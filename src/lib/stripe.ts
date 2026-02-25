import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

if (!process.env.STRIPE_PRO_PRICE_ID) {
  throw new Error("STRIPE_PRO_PRICE_ID is not set in environment variables");
}

if (!process.env.STRIPE_AGENCY_PRICE_ID) {
  throw new Error("STRIPE_AGENCY_PRICE_ID is not set in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

export const PLANS = {
  pro: {
    name: "AccessGuard Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    price: 49,
    trialDays: 14,
  },
  agency: {
    name: "AccessGuard Agency",
    priceId: process.env.STRIPE_AGENCY_PRICE_ID,
    price: 149,
    trialDays: 14,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
