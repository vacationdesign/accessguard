"use client";

import { useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.localStorage.getItem("cookie-banner-dismissed");
  });

  const handleDismiss = () => {
    localStorage.setItem("cookie-banner-dismissed", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white px-6 py-4 shadow-lg"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          We use essential cookies to keep you signed in and privacy-friendly
          analytics to improve our service. No advertising or cross-site tracking.
          See our{" "}
          <Link
            href="/privacy"
            className="text-white underline hover:text-blue-300"
          >
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <button
          onClick={handleDismiss}
          className="bg-white text-gray-900 text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
