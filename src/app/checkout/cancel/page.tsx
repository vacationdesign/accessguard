import Link from "next/link";

export const metadata = {
  title: "Checkout Cancelled - A11yScope",
  description: "Your checkout was cancelled. You can try again anytime.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="h-10 w-10 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-foreground">
            Checkout Cancelled
          </h1>
          <p className="text-lg text-muted">
            No worries &mdash; you haven&apos;t been charged. Your checkout session
            was cancelled and you can try again whenever you&apos;re ready.
          </p>
        </div>

        {/* Benefits reminder */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-left space-y-4">
          <h2 className="text-lg font-bold text-foreground">
            Here&apos;s what you&apos;re missing out on:
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-muted">
              <svg
                className="h-5 w-5 text-primary shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Unlimited accessibility scans (no hourly limits)
            </li>
            <li className="flex items-center gap-2 text-muted">
              <svg
                className="h-5 w-5 text-primary shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Weekly automated monitoring with email alerts
            </li>
            <li className="flex items-center gap-2 text-muted">
              <svg
                className="h-5 w-5 text-primary shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Professional PDF compliance reports
            </li>
            <li className="flex items-center gap-2 text-muted">
              <svg
                className="h-5 w-5 text-primary shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              14-day free trial &mdash; no charge until it ends
            </li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            View Plans &amp; Try Again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Continue with Free Plan
          </Link>
        </div>

        {/* Support */}
        <p className="text-sm text-muted">
          Have questions? Email us at{" "}
          <a
            href="mailto:support@a11yscope.com"
            className="text-primary hover:underline"
          >
            support@a11yscope.com
          </a>
        </p>
      </div>
    </div>
  );
}
