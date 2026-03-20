import type { Metadata } from "next";
import Link from "next/link";
import LegalFooter from "@/components/LegalFooter";

export const metadata: Metadata = {
  title: "Terms of Service | A11yScope",
  description:
    "A11yScope terms of service. Read the terms and conditions governing your use of A11yScope.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-muted mb-10">Last updated: March 20, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-[15px] leading-relaxed text-muted">
          {/* 1. Acceptance */}
          <section>
            <h2 className="text-xl font-bold text-foreground mt-0">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using A11yScope (&quot;the Service&quot;), operated by Ryusei
              Saito (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms
              of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          {/* 2. Service Description */}
          <section>
            <h2 className="text-xl font-bold text-foreground">
              2. Service Description
            </h2>
            <p>
              A11yScope is a web accessibility scanning service that analyzes web pages
              for WCAG 2.1 compliance issues using axe-core, an open-source
              accessibility testing engine. The Service provides automated scan results,
              violation reports, and suggested fixes.
            </p>
            <p>
              <strong>Important:</strong> A11yScope provides automated testing only.
              Automated tools can detect approximately 30&ndash;40% of accessibility
              issues. Our scan results do not constitute legal advice and do not
              guarantee full WCAG or ADA compliance. We recommend supplementing
              automated testing with manual review and expert consultation.
            </p>
          </section>

          {/* 3. Accounts */}
          <section>
            <h2 className="text-xl font-bold text-foreground">3. Accounts</h2>
            <p>
              Some features require an account. You must provide a valid email address
              and keep your account information accurate. You are responsible for all
              activity under your account. You must not share your sign-in link with
              others.
            </p>
            <p>
              We reserve the right to suspend or terminate accounts that violate these
              terms or are used for abusive purposes.
            </p>
          </section>

          {/* 4. Plans and Billing */}
          <section>
            <h2 className="text-xl font-bold text-foreground">
              4. Plans and Billing
            </h2>
            <p>
              A11yScope offers Free, Pro ($49/month), and Agency ($149/month) plans.
              Paid plans include a 14-day free trial. Payment is processed by Stripe.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Trial period</strong> &mdash; You will not be charged during the
                14-day trial. If you cancel before the trial ends, no payment will be
                collected.
              </li>
              <li>
                <strong>Billing</strong> &mdash; After the trial, your subscription renews
                automatically each month. You can cancel at any time from your Billing
                settings.
              </li>
              <li>
                <strong>Refunds</strong> &mdash; We offer a 30-day money-back guarantee on
                all paid plans. After 30 days, no prorated refunds are provided for
                mid-cycle cancellations.
              </li>
              <li>
                <strong>Price changes</strong> &mdash; We will notify you at least 30 days
                before any price increase.
              </li>
            </ul>
            <p>
              For detailed billing information, see our{" "}
              <Link href="/tokushoho" className="text-primary hover:underline">
                Legal Disclosure
              </Link>.
            </p>
          </section>

          {/* 5. Acceptable Use */}
          <section>
            <h2 className="text-xl font-bold text-foreground">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Scan websites you do not own or have permission to test
              </li>
              <li>
                Use the Service to perform security testing, penetration testing, or
                vulnerability scanning
              </li>
              <li>
                Attempt to bypass rate limits or abuse the scanning infrastructure
              </li>
              <li>
                Use automated scripts or bots to access the Service beyond its intended
                API
              </li>
              <li>
                Resell or redistribute scan results as your own product without an
                Agency plan
              </li>
              <li>
                Submit URLs that contain illegal, malicious, or harmful content
              </li>
              <li>
                Interfere with the Service&apos;s operation or other users&apos; access
              </li>
            </ul>
            <p>
              <strong>Rate limits:</strong> Free accounts are limited to 5 scans per
              hour. Paid plans include unlimited scans, subject to reasonable use.
              Excessive automated scanning may be throttled.
            </p>
          </section>

          {/* 6. Intellectual Property */}
          <section>
            <h2 className="text-xl font-bold text-foreground">
              6. Intellectual Property
            </h2>
            <p>
              The A11yScope service, website, design, and original content are owned by
              us. Your scan results belong to you &mdash; you may use, share, and
              distribute your own reports freely.
            </p>
            <p>
              A11yScope uses{" "}
              <a
                href="https://github.com/dequelabs/axe-core"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                axe-core
              </a>{" "}
              by Deque Systems under the Mozilla Public License 2.0.
            </p>
          </section>

          {/* 7. Disclaimer of Warranties */}
          <section>
            <h2 className="text-xl font-bold text-foreground">
              7. Disclaimer of Warranties
            </h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
              OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES
              OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p>
              We do not warrant that the Service will be uninterrupted, error-free, or
              completely accurate. Accessibility scan results are generated by automated
              tools and may contain false positives or miss certain issues.
            </p>
          </section>

          {/* 8. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-bold text-foreground">
              8. Limitation of Liability
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING
              FROM YOUR USE OF THE SERVICE.
            </p>
            <p>
              OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THE SERVICE SHALL NOT
              EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR
              $100 USD, WHICHEVER IS GREATER.
            </p>
          </section>

          {/* 9. Privacy */}
          <section>
            <h2 className="text-xl font-bold text-foreground">9. Privacy</h2>
            <p>
              Your use of the Service is subject to our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              , which describes how we collect, use, and protect your data.
            </p>
          </section>

          {/* 10. Service Availability */}
          <section>
            <h2 className="text-xl font-bold text-foreground">
              10. Service Availability
            </h2>
            <p>
              We strive to maintain high availability but do not guarantee 100% uptime.
              We may temporarily suspend the Service for maintenance, updates, or
              security reasons. We will make reasonable efforts to notify users of
              planned downtime in advance.
            </p>
          </section>

          {/* 11. Termination */}
          <section>
            <h2 className="text-xl font-bold text-foreground">11. Termination</h2>
            <p>
              You may stop using the Service and delete your account at any time from
              your account settings. We may suspend or terminate your account if you
              violate these terms, with or without notice.
            </p>
            <p>
              Upon termination, your access to the Service ceases and your data will be
              deleted in accordance with our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </section>

          {/* 12. Changes to Terms */}
          <section>
            <h2 className="text-xl font-bold text-foreground">
              12. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. Material changes will be
              posted on this page with an updated date. Continued use of the Service
              after changes constitutes acceptance. If you disagree with updated terms,
              please stop using the Service.
            </p>
          </section>

          {/* 13. Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-foreground">
              13. Governing Law and Disputes
            </h2>
            <p>
              These Terms are governed by the laws of Japan. Any disputes arising from
              these Terms or the Service shall be subject to the exclusive jurisdiction
              of the Tokyo District Court as the court of first instance.
            </p>
          </section>

          {/* 14. Contact */}
          <section>
            <h2 className="text-xl font-bold text-foreground">14. Contact</h2>
            <p>
              If you have questions about these Terms, contact us at:
            </p>
            <ul className="list-none pl-0 space-y-1">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@a11yscope.com"
                  className="text-primary hover:underline"
                >
                  support@a11yscope.com
                </a>
              </li>
              <li><strong>Business:</strong> A11yScope (Sole Proprietorship)</li>
              <li><strong>Location:</strong> Musashino City, Tokyo, Japan</li>
            </ul>
          </section>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
