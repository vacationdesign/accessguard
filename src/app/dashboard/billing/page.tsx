import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import ManageSubscriptionButton from "./ManageSubscriptionButton";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const activeSubscription = user.subscriptions?.find(
    (s) => s.status === "active" || s.status === "trialing"
  );

  const planLabel =
    user.plan === "agency"
      ? "Agency"
      : user.plan === "pro"
      ? "Pro"
      : "Free";

  const planPrice =
    user.plan === "agency"
      ? "$149/mo"
      : user.plan === "pro"
      ? "$49/mo"
      : "$0";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted mt-1">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Current Plan</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-foreground">
                {planLabel}
              </span>
              <span className="text-lg text-muted">{planPrice}</span>
            </div>
            {activeSubscription && (
              <div className="mt-2 space-y-1 text-sm text-muted">
                <p>
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      activeSubscription.status === "active"
                        ? "text-green-600"
                        : activeSubscription.status === "trialing"
                        ? "text-blue-600"
                        : "text-muted"
                    }`}
                  >
                    {activeSubscription.status === "trialing"
                      ? "Trial"
                      : activeSubscription.status.charAt(0).toUpperCase() +
                        activeSubscription.status.slice(1)}
                  </span>
                </p>
                {activeSubscription.trial_end && (
                  <p>
                    Trial ends:{" "}
                    <span className="font-medium text-foreground">
                      {new Date(
                        activeSubscription.trial_end
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                )}
                {activeSubscription.current_period_end && (
                  <p>
                    Next billing:{" "}
                    <span className="font-medium text-foreground">
                      {new Date(
                        activeSubscription.current_period_end
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                )}
                {activeSubscription.cancel_at && (
                  <p className="text-danger">
                    Cancels on:{" "}
                    {new Date(
                      activeSubscription.cancel_at
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            )}
          </div>
          {user.stripe_customer_id ? (
            <ManageSubscriptionButton />
          ) : user.plan === "free" ? (
            <Link
              href="/#pricing"
              className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap text-center"
            >
              Upgrade Plan
            </Link>
          ) : null}
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-foreground mb-4">Plan Features</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <PlanColumn
            name="Free"
            price="$0"
            features={[
              "Single page scan",
              "Basic score report",
              "No monitoring",
            ]}
            current={user.plan === "free"}
          />
          <PlanColumn
            name="Pro"
            price="$49/mo"
            features={[
              "3 monitored sites",
              "Weekly auto-scans",
              "Detailed violation reports",
              "PDF export",
              "Email alerts",
              "14-day free trial",
            ]}
            current={user.plan === "pro"}
            highlighted
          />
          <PlanColumn
            name="Agency"
            price="$149/mo"
            features={[
              "10 monitored sites",
              "Weekly auto-scans",
              "Detailed violation reports",
              "PDF export",
              "Email alerts",
              "Priority support",
              "14-day free trial",
            ]}
            current={user.plan === "agency"}
          />
        </div>
      </div>
    </div>
  );
}

function PlanColumn({
  name,
  price,
  features,
  current,
  highlighted,
}: {
  name: string;
  price: string;
  features: string[];
  current: boolean;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-4 ${
        highlighted
          ? "border-2 border-primary bg-blue-50/50"
          : "border border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted">{price}</p>
        </div>
        {current && (
          <span className="text-xs font-semibold bg-primary text-white px-2 py-0.5 rounded-full">
            Current
          </span>
        )}
      </div>
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-muted">
            <svg
              className="h-4 w-4 text-success flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
