import Link from "next/link";

export const metadata = {
  title: "Welcome to AccessGuard Pro - Subscription Confirmed",
  description: "Your AccessGuard subscription is now active. Start scanning your websites for accessibility issues.",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-foreground">
            Welcome to AccessGuard!
          </h1>
          <p className="text-lg text-muted">
            Your subscription is now active. Your 14-day free trial has started
            &mdash; you won&apos;t be charged until the trial ends.
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-left space-y-4">
          <h2 className="text-lg font-bold text-foreground">What&apos;s next?</h2>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>
                Run unlimited accessibility scans on any page &mdash; no more
                hourly limits.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>
                Set up weekly monitoring to catch new issues automatically.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>
                Generate PDF compliance reports for your stakeholders.
              </span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Start Scanning
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Support note */}
        <p className="text-sm text-muted">
          Need help getting started? Reach out at{" "}
          <a
            href="mailto:support@accessguard.dev"
            className="text-primary hover:underline"
          >
            support@accessguard.dev
          </a>
        </p>
      </div>
    </div>
  );
}
