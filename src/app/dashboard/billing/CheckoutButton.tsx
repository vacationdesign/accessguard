"use client";

import { useState } from "react";
import { getErrorMessage } from "@/lib/errors";

export default function CheckoutButton({
  plan,
  email,
}: {
  plan: "pro" | "agency";
  email: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const label = plan === "pro" ? "Start Pro Trial — $49/mo" : "Start Agency Trial — $149/mo";
  const isPrimary = plan === "pro";

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
        isPrimary
          ? "bg-primary text-white hover:bg-primary-dark"
          : "bg-white border border-gray-200 text-foreground hover:bg-gray-50"
      }`}
    >
      {loading ? "Processing..." : label}
    </button>
  );
}
