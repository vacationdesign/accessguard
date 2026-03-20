import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | A11yScope",
  description:
    "A11yScope privacy policy. Learn how we collect, use, and protect your personal data.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          <span className="text-xl font-bold text-foreground">A11yScope</span>
        </Link>
        <Link
          href="/"
          className="text-sm text-muted hover:text-primary transition-colors"
        >
          &larr; Back to Home
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted mb-10">Last updated: March 20, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-[15px] leading-relaxed text-muted">
          {/* 1. Overview */}
          <section>
            <h2 className="text-xl font-bold text-foreground mt-0">1. Overview</h2>
            <p>
              A11yScope (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a web accessibility scanning
              service operated by Ryusei Saito as a sole proprietorship based in
              Musashino City, Tokyo, Japan. This Privacy Policy explains how we collect,
              use, store, and protect your personal data when you use our website
              (www.a11yscope.com) and services.
            </p>
            <p>
              By using A11yScope, you agree to the practices described in this policy.
              If you do not agree, please do not use our services.
            </p>
          </section>

          {/* 2. Data We Collect */}
          <section>
            <h2 className="text-xl font-bold text-foreground">2. Data We Collect</h2>

            <h3 className="text-base font-semibold text-foreground mt-4">
              2.1 Account Information
            </h3>
            <p>
              When you create an account, we collect your <strong>email address</strong> for
              authentication purposes. We use a passwordless magic-link sign-in system;
              we do not store passwords.
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4">
              2.2 Payment Information
            </h3>
            <p>
              Payment processing is handled entirely by <strong>Stripe, Inc.</strong> We do
              not store your credit card numbers or banking details on our servers. We
              retain your Stripe customer ID and subscription status to manage your plan.
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4">
              2.3 Scan Data
            </h3>
            <p>
              When you run an accessibility scan, we store the URL you submitted, the
              scan results (accessibility score, violations, passes), and the timestamp.
              For authenticated users, scan history is linked to your account.
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4">
              2.4 Usage Data
            </h3>
            <p>
              We collect your <strong>IP address</strong> for rate limiting and abuse
              prevention. We use Vercel Analytics to collect anonymous, aggregated usage
              data (page views, visitor counts). Vercel Analytics does not use cookies
              and does not track individual users across sites.
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4">
              2.5 Cookies
            </h3>
            <p>
              We use <strong>essential cookies only</strong> to maintain your authentication
              session. These cookies are required for the service to function and cannot
              be disabled. We do not use advertising or tracking cookies. See our cookie
              details:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Authentication session cookies</strong> (Supabase) &mdash;
                required for sign-in. Expire when you sign out or after the session
                timeout.
              </li>
            </ul>
          </section>

          {/* 3. How We Use Your Data */}
          <section>
            <h2 className="text-xl font-bold text-foreground">3. How We Use Your Data</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain the accessibility scanning service</li>
              <li>To authenticate your account and manage your subscription</li>
              <li>To send transactional emails (sign-in links, billing notifications)</li>
              <li>To enforce rate limits and prevent abuse</li>
              <li>To improve our service through aggregated, anonymous analytics</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p>
              We do <strong>not</strong> sell your personal data. We do <strong>not</strong> use
              your data for advertising. We do <strong>not</strong> share your data with
              third parties for their marketing purposes.
            </p>
          </section>

          {/* 4. Third-Party Processors */}
          <section>
            <h2 className="text-xl font-bold text-foreground">
              4. Third-Party Service Providers
            </h2>
            <p>
              We share your data with the following service providers, solely to operate
              our service:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-2 font-semibold text-foreground">Provider</th>
                    <th className="text-left px-4 py-2 font-semibold text-foreground">Purpose</th>
                    <th className="text-left px-4 py-2 font-semibold text-foreground">Data Shared</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2">Supabase</td>
                    <td className="px-4 py-2">Authentication &amp; database</td>
                    <td className="px-4 py-2">Email, account data, scan history</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Stripe</td>
                    <td className="px-4 py-2">Payment processing</td>
                    <td className="px-4 py-2">Email, payment details</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Resend</td>
                    <td className="px-4 py-2">Transactional email</td>
                    <td className="px-4 py-2">Email address</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Vercel</td>
                    <td className="px-4 py-2">Hosting &amp; analytics</td>
                    <td className="px-4 py-2">Anonymous usage data (no PII)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Data Retention */}
          <section>
            <h2 className="text-xl font-bold text-foreground">5. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Account data</strong> &mdash; Retained while your account is active.
                Deleted within 30 days of account deletion request.
              </li>
              <li>
                <strong>Scan history</strong> &mdash; Retained while your account is active.
                Deleted upon account deletion.
              </li>
              <li>
                <strong>IP addresses</strong> (rate limiting) &mdash; Retained for up to 24
                hours, then automatically purged.
              </li>
              <li>
                <strong>Payment records</strong> &mdash; Retained as required by applicable
                tax and accounting laws (typically 7 years in Japan).
              </li>
              <li>
                <strong>Anonymous scans</strong> (without account) &mdash; Scan results are
                not linked to any personal data and are retained indefinitely for service
                improvement.
              </li>
            </ul>
          </section>

          {/* 6. International Data Transfers */}
          <section>
            <h2 className="text-xl font-bold text-foreground">
              6. International Data Transfers
            </h2>
            <p>
              A11yScope is based in Japan. Your data may be transferred to and processed
              in countries outside your country of residence, including the United States
              (where our service providers Supabase, Stripe, Resend, and Vercel are
              located). We ensure that appropriate safeguards are in place to protect
              your data in accordance with applicable law.
            </p>
          </section>

          {/* 7. Your Rights */}
          <section>
            <h2 className="text-xl font-bold text-foreground">7. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the following rights regarding
              your personal data:
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4">
              All Users
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Access</strong> &mdash; Request a copy of the personal data we hold about you</li>
              <li><strong>Deletion</strong> &mdash; Request deletion of your account and associated data</li>
              <li><strong>Export</strong> &mdash; Download your data in a machine-readable format</li>
              <li><strong>Correction</strong> &mdash; Request correction of inaccurate data</li>
            </ul>
            <p className="mt-2">
              You can exercise these rights from your{" "}
              <Link href="/dashboard/settings" className="text-primary hover:underline">
                account settings
              </Link>{" "}
              or by emailing us at{" "}
              <a href="mailto:support@a11yscope.com" className="text-primary hover:underline">
                support@a11yscope.com
              </a>.
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4">
              European Economic Area (GDPR)
            </h3>
            <p>
              If you are in the EEA, our legal basis for processing your data is:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Contract performance</strong> &mdash; To provide the service you signed up for</li>
              <li><strong>Legitimate interest</strong> &mdash; Rate limiting, abuse prevention, service improvement</li>
              <li><strong>Legal obligation</strong> &mdash; Tax and accounting requirements</li>
            </ul>
            <p className="mt-2">
              You also have the right to <strong>restrict processing</strong>,{" "}
              <strong>object to processing</strong>, and{" "}
              <strong>lodge a complaint</strong> with your local data protection authority.
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4">
              California (CCPA)
            </h3>
            <p>
              If you are a California resident, you have the right to know what personal
              data we collect, request deletion, and opt out of the sale of personal
              data. <strong>We do not sell personal data.</strong>
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4">
              Japan (APPI)
            </h3>
            <p>
              In accordance with Japan&apos;s Act on the Protection of Personal Information
              (APPI), we clearly specify the purpose of data use, manage personal data
              securely, and respond to disclosure, correction, and deletion requests.
              The purpose of use is limited to those described in Section 3.
            </p>
          </section>

          {/* 8. Data Security */}
          <section>
            <h2 className="text-xl font-bold text-foreground">8. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect
              your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>All data is transmitted over HTTPS (TLS encryption in transit)</li>
              <li>Database access is restricted by row-level security policies</li>
              <li>Authentication uses secure, time-limited magic links (no passwords stored)</li>
              <li>Payment data is handled exclusively by PCI DSS-compliant Stripe</li>
              <li>We do not store credit card numbers or banking information</li>
            </ul>
            <p>
              In the event of a data breach that affects your personal data, we will
              notify you and the relevant authorities within 72 hours as required by
              applicable law.
            </p>
          </section>

          {/* 9. Children */}
          <section>
            <h2 className="text-xl font-bold text-foreground">9. Children&apos;s Privacy</h2>
            <p>
              A11yScope is not intended for use by children under 16 years of age. We do
              not knowingly collect personal data from children. If we learn that we have
              collected data from a child under 16, we will delete it promptly. If you
              believe a child has provided us with personal data, please contact us at{" "}
              <a href="mailto:support@a11yscope.com" className="text-primary hover:underline">
                support@a11yscope.com
              </a>.
            </p>
          </section>

          {/* 10. Changes */}
          <section>
            <h2 className="text-xl font-bold text-foreground">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of
              material changes by posting the updated policy on this page and updating
              the &quot;Last updated&quot; date. Your continued use of A11yScope after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 11. Contact */}
          <section>
            <h2 className="text-xl font-bold text-foreground">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your
              data rights, contact us at:
            </p>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>Email:</strong>{" "}
                <a href="mailto:support@a11yscope.com" className="text-primary hover:underline">
                  support@a11yscope.com
                </a>
              </li>
              <li><strong>Business:</strong> A11yScope (Sole Proprietorship)</li>
              <li><strong>Representative:</strong> Ryusei Saito</li>
              <li><strong>Location:</strong> Musashino City, Tokyo, Japan</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
