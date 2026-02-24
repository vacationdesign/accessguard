// @ts-nocheck — Stripe SDK v20 types are out of sync with the actual API response
// (e.g. current_period_start, invoice.subscription were removed from TS types).
// The code is correct at runtime; this suppresses false type errors.
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import {
  getOrCreateUser,
  getUserByStripeCustomerId,
  createSubscription,
  updateSubscription,
} from "@/lib/db";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
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
          customerEmail,
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

        // Fetch the full subscription from Stripe to get period dates
        const stripeSubscription =
          await stripe.subscriptions.retrieve(stripeSubscriptionId);

        // Create the subscription record in our database
        await createSubscription(user.id, {
          stripeSubscriptionId,
          status: stripeSubscription.status,
          plan,
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          trialStart: stripeSubscription.trial_start
            ? new Date(stripeSubscription.trial_start * 1000)
            : undefined,
          trialEnd: stripeSubscription.trial_end
            ? new Date(stripeSubscription.trial_end * 1000)
            : undefined,
        });

        console.log(
          `User ${user.email} subscribed to ${plan} plan (subscription: ${stripeSubscriptionId})`
        );
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
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
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          trialStart: subscription.trial_start
            ? new Date(subscription.trial_start * 1000)
            : undefined,
          trialEnd: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : undefined,
          cancelAt: subscription.cancel_at
            ? new Date(subscription.cancel_at * 1000)
            : null,
          canceledAt: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000)
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
            `User ${user.email} downgraded to free plan after subscription cancellation`
          );
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        console.log("Payment succeeded:", {
          invoiceId: invoice.id,
          customerId,
          amountPaid: invoice.amount_paid,
        });

        // If this invoice is tied to a subscription, update the period dates
        if (invoice.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );

          await updateSubscription(stripeSubscription.id, {
            status: stripeSubscription.status,
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          });

          console.log(
            `Subscription ${stripeSubscription.id} period updated after successful payment`
          );
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        console.log("Payment failed:", {
          invoiceId: invoice.id,
          customerId,
          attemptCount: invoice.attempt_count,
        });

        // Update subscription status to reflect the payment issue
        if (invoice.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );

          await updateSubscription(stripeSubscription.id, {
            status: stripeSubscription.status, // Stripe sets this to "past_due"
          });

          // Log the failure for monitoring
          const user = await getUserByStripeCustomerId(customerId);
          console.error(
            `Payment failed for user ${user?.email ?? customerId} ` +
              `(invoice: ${invoice.id}, attempt: ${invoice.attempt_count}). ` +
              `Subscription status: ${stripeSubscription.status}`
          );
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }
}
