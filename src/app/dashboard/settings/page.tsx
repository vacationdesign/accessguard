import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const planLabel =
    user.plan === "agency"
      ? "Agency"
      : user.plan === "pro"
      ? "Pro"
      : "Free";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted mt-1">Your account information.</p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="font-semibold text-foreground">Account</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Email
            </label>
            <p className="text-foreground">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Plan
            </label>
            <p className="text-foreground">{planLabel}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Member since
            </label>
            <p className="text-foreground">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-foreground mb-2">Sign Out</h2>
        <p className="text-sm text-muted mb-4">
          Sign out of your A11yScope account on this device.
        </p>
        <form action="/api/auth/signout" method="POST" className="inline">
          <button
            type="submit"
            className="bg-white border border-gray-200 text-foreground text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
