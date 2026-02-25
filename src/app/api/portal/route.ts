import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getUserByEmail } from "@/lib/db";

const ALLOWED_ORIGINS = [
  "https://www.accessguard.dev",
  "https://accessguard.dev",
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
    const { email } = body as { email: string };

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Normalize email to prevent enumeration via casing
    const normalizedEmail = email.trim().toLowerCase();

    // Find the user and their Stripe customer ID
    const user = await getUserByEmail(normalizedEmail);

    if (!user || !user.stripe_customer_id) {
      // Use a generic message to prevent user enumeration
      return NextResponse.json(
        { error: "Unable to create portal session. Please contact support if you believe this is an error." },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("NEXT_PUBLIC_BASE_URL is not configured");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    // Create a Stripe Customer Portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: baseUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Portal session error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session. Please try again later." },
      { status: 500 }
    );
  }
}
