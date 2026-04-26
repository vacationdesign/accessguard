import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, PlanKey } from "@/lib/stripe";
import { hasSubscriptionHistory } from "@/lib/db";
import { getErrorMessage } from "@/lib/errors";
import { logEvent, ipFromRequest } from "@/lib/analytics";

const ALLOWED_ORIGINS = [
  "https://www.a11yscope.com",
  "https://a11yscope.com",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

export async function POST(request: NextRequest) {
  try {
    // CSRF protection: validate Origin header
    const origin = request.headers.get("origin");
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { plan, email } = body as { plan: string; email?: string };

    // Validate the plan
    if (!plan || !["pro", "agency"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'pro' or 'agency'." },
        { status: 400 }
      );
    }

    const selectedPlan = PLANS[plan as PlanKey];

    if (!selectedPlan.priceId) {
      return NextResponse.json(
        { error: "Price ID not configured for this plan." },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("NEXT_PUBLIC_BASE_URL is not configured");
      return NextResponse.json(
        { error: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }

    // Check if the user has a past subscription — if so, no trial
    const hadSub = email ? await hasSubscriptionHistory(email) : false;
    const trialDays = hadSub ? undefined : selectedPlan.trialDays;

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      locale: "auto",
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        ...(trialDays ? { trial_period_days: trialDays } : {}),
      },
      ...(email ? { customer_email: email } : {}),
      consent_collection: {
        terms_of_service: "required",
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: "I agree to the [Terms of Service](https://www.a11yscope.com/terms) and [Privacy Policy](https://www.a11yscope.com/privacy).",
        },
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        plan: plan,
      },
    });

    void logEvent({
      kind: "checkout_clicked",
      ip: ipFromRequest(request),
      meta: { plan, had_prior_sub: hadSub, trial_days: trialDays ?? null },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      {
        error: getErrorMessage(
          error,
          "Failed to create checkout session. Please try again later."
        ),
      },
      { status: 500 }
    );
  }
}
