import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import {
  getOrCreateUser,
  getUserByStripeCustomerId,
  getActiveSubscription,
  createSubscription,
  updateSubscription,
} from "@/lib/db";
import { sendWelcomeEmail, sendAdminNotification } from "@/lib/email";
import { logEvent } from "@/lib/analytics";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

interface StripeSubscriptionTiming {
  current_period_start?: number | null;
  current_period_end?: number | null;
  trial_start?: number | null;
  trial_end?: number | null;
  cancel_at?: number | null;
  canceled_at?: number | null;
}

interface StripeInvoiceWithSubscription {
  id: string;
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null;
  amount_paid?: number;
  attempt_count?: number;
  subscription?: string | Stripe.Subscription | null;
}

/** Safely convert a unix timestamp (seconds) to Date, returns undefined for missing/invalid values */
function toDate(ts: unknown): Date | undefined {
  if (typeof ts === "number" && ts > 0) return new Date(ts * 1000);
  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header." },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured.");
      return NextResponse.json(
        { error: "Webhook secret not configured." },
        { status: 500 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      console.error("Webhook signature verification failed:", (err as Error).message);
      return NextResponse.json(
        { error: "Webhook signature verification failed." },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email;
        const plan = session.metadata?.plan as "pro" | "agency" | undefined;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        console.log("Checkout session completed:", {
          sessionId: session.id,
          plan,
          subscriptionId: stripeSubscriptionId,
        });

        if (!customerEmail || !plan) {
          console.error(
            "Missing customer email or plan in checkout session:",
            session.id
          );
          break;
        }

        // Create or update the user record with the Stripe customer ID
        const user = await getOrCreateUser(customerEmail, stripeCustomerId);

        // Idempotency: skip if this subscription already exists (webhook replay)
        const existingSub = await getActiveSubscription(user.id);
        if (existingSub?.stripe_subscription_id === stripeSubscriptionId) {
          console.log(
            `Subscription ${stripeSubscriptionId} already exists — skipping duplicate webhook`
          );
          break;
        }

        // Fetch the full subscription from Stripe to get period dates
        const stripeSubscription =
          await stripe.subscriptions.retrieve(stripeSubscriptionId);

        // Create the subscription record in our database
        const subTiming =
          stripeSubscription as unknown as StripeSubscriptionTiming;

        await createSubscription(user.id, {
          stripeSubscriptionId,
          status: stripeSubscription.status,
          plan,
          currentPeriodStart: toDate(subTiming.current_period_start),
          currentPeriodEnd: toDate(subTiming.current_period_end),
          trialStart: toDate(subTiming.trial_start),
          trialEnd: toDate(subTiming.trial_end),
        });

        console.log(
          `User ${user.id} subscribed to ${plan} plan (subscription: ${stripeSubscriptionId})`
        );

        // Send welcome email (non-blocking — failures are logged, not thrown)
        sendWelcomeEmail({
          to: customerEmail,
          plan,
          trialEndDate: subTiming.trial_end
            ? new Date(subTiming.trial_end * 1000)
            : null,
        }).catch((err) => {
          console.error("Welcome email failed (non-blocking):", err);
        });

        // Notify admin of new subscription
        sendAdminNotification({
          event: "new_subscription",
          customerEmail,
          plan: plan === "agency" ? "Agency ($149/mo)" : "Pro ($49/mo)",
          details: subTiming.trial_end
            ? `7-day trial until ${new Date(subTiming.trial_end * 1000).toLocaleDateString("en-US")}`
            : "No trial — charged immediately",
        }).catch((err) => {
          console.error("Admin notification failed (non-blocking):", err);
        });

        // Funnel telemetry: trial vs immediate-paid distinction matters for
        // conversion math, so emit different kinds.
        const startedTrial =
          stripeSubscription.status === "trialing" && !!subTiming.trial_end;
        void logEvent({
          kind: startedTrial ? "trial_started" : "checkout_clicked",
          userId: user.id,
          meta: {
            plan,
            stripe_subscription_id: stripeSubscriptionId,
            trial_end: subTiming.trial_end ?? null,
          },
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const subTiming = subscription as unknown as StripeSubscriptionTiming;
        console.log("Subscription updated:", {
          subscriptionId: subscription.id,
          status: subscription.status,
        });

        // Determine the plan from the subscription's price
        // We look at the first item's price to figure out which plan it is
        let plan: "pro" | "agency" | undefined;
        const priceId = subscription.items.data[0]?.price?.id;
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          plan = "pro";
        } else if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) {
          plan = "agency";
        }

        await updateSubscription(subscription.id, {
          status: subscription.status,
          plan,
          currentPeriodStart: toDate(subTiming.current_period_start),
          currentPeriodEnd: toDate(subTiming.current_period_end),
          trialStart: toDate(subTiming.trial_start),
          trialEnd: toDate(subTiming.trial_end),
          cancelAt: subTiming.cancel_at
            ? new Date(subTiming.cancel_at * 1000)
            : null,
          canceledAt: subTiming.canceled_at
            ? new Date(subTiming.canceled_at * 1000)
            : null,
        });

        console.log(
          `Subscription ${subscription.id} updated to status: ${subscription.status}`
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log("Subscription cancelled:", {
          subscriptionId: subscription.id,
          customerId,
        });

        // Mark the subscription as canceled in our database
        await updateSubscription(subscription.id, {
          status: "canceled",
          canceledAt: new Date(),
        });

        // Downgrade the user to the free plan
        const user = await getUserByStripeCustomerId(customerId);
        if (user) {
          const { getSupabaseClient } = await import("@/lib/supabase");
          const supabase = getSupabaseClient();
          await supabase
            .from("users")
            .update({ plan: "free", updated_at: new Date().toISOString() })
            .eq("id", user.id);

          console.log(
            `User ${user.id} downgraded to free plan after subscription cancellation`
          );

          // Notify admin of cancellation
          sendAdminNotification({
            event: "subscription_canceled",
            customerEmail: user.email,
          }).catch((err) => {
            console.error("Admin notification failed (non-blocking):", err);
          });

          void logEvent({
            kind: "subscription_canceled",
            userId: user.id,
            meta: {
              stripe_subscription_id: subscription.id,
            },
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice =
          event.data.object as unknown as StripeInvoiceWithSubscription;
        const customerId = invoice.customer as string;

        console.log("Payment succeeded:", {
          invoiceId: invoice.id,
          customerId,
          amountPaid: invoice.amount_paid,
        });

        // If this invoice is tied to a subscription, update the period dates
        const succSubId = invoice.subscription;
        if (succSubId) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            succSubId as string
          );
          const subTiming =
            stripeSubscription as unknown as StripeSubscriptionTiming;

          await updateSubscription(stripeSubscription.id, {
            status: stripeSubscription.status,
            currentPeriodStart: toDate(subTiming.current_period_start),
            currentPeriodEnd: toDate(subTiming.current_period_end),
          });

          console.log(
            `Subscription ${stripeSubscription.id} period updated after successful payment`
          );
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice =
          event.data.object as unknown as StripeInvoiceWithSubscription;
        const customerId = invoice.customer as string;

        console.log("Payment failed:", {
          invoiceId: invoice.id,
          customerId,
          attemptCount: invoice.attempt_count,
        });

        // Update subscription status to reflect the payment issue
        const failSubId = invoice.subscription;
        if (failSubId) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            failSubId as string
          );

          await updateSubscription(stripeSubscription.id, {
            status: stripeSubscription.status, // Stripe sets this to "past_due"
          });

          // Log the failure for monitoring (no PII in logs)
          console.error(
            `Payment failed for customer ${customerId} ` +
              `(invoice: ${invoice.id}, attempt: ${invoice.attempt_count}). ` +
              `Subscription status: ${stripeSubscription.status}`
          );

          // Notify admin of payment failure
          const failedUser = await getUserByStripeCustomerId(customerId);
          sendAdminNotification({
            event: "payment_failed",
            customerEmail: failedUser?.email ?? customerId,
            details: `Attempt ${invoice.attempt_count} — status: ${stripeSubscription.status}`,
          }).catch((err) => {
            console.error("Admin notification failed (non-blocking):", err);
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Webhook handler error:", message, error);
    return NextResponse.json(
      { error: "Webhook handler failed.", detail: message },
      { status: 500 }
    );
  }
}
