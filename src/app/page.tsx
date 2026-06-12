"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ScanForm from "@/components/ScanForm";
import ScanReport from "@/components/ScanReport";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { ScanResult } from "@/lib/scanner";
import { getErrorMessage } from "@/lib/errors";
import { track } from "@/lib/track";

type HomeScanResult = ScanResult & { domainScanCount?: number };

interface HomeFaqItem {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export default function Home() {
  const [scanResult, setScanResult] = useState<HomeScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMeta, setErrorMeta] = useState<{
    signup?: boolean;
    upgrade?: boolean;
  } | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, []);

  const handleCheckout = async (plan: "starter" | "pro" | "agency") => {
    track("checkout_clicked", { plan, from: "home_limit_error" });
    try {
      setCheckoutLoading(plan);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email: userEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    } finally {
      setCheckoutLoading(null);
    }
  };

  const faqJsonLd: {
    "@context": "https://schema.org";
    "@type": "FAQPage";
    mainEntity: HomeFaqItem[];
  } = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is WCAG 2.1, WCAG 2.2, and why does it matter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WCAG 2.1 is the baseline accessibility standard referenced by many laws and policies. WCAG 2.2 adds newer success criteria for focus visibility, target size, dragging movements, redundant entry, and accessible authentication. A11yScope currently scans the automated WCAG 2.1 AA rule set in axe-core and highlights issues teams should review as they move toward WCAG 2.2 readiness.",
        },
      },
      {
        "@type": "Question",
        name: "How does A11yScope scan websites for accessibility issues?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A11yScope uses a headless browser to fully render your page including JavaScript, then runs axe-core — the industry-standard accessibility testing engine by Deque Systems — to check against 38+ automated WCAG 2.1 AA and best-practice rules. Results are returned in seconds with specific code fixes for each issue found.",
        },
      },
      {
        "@type": "Question",
        name: "Is A11yScope free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Anonymous visitors can run 5 scans per hour without an account. A free account gives 50 scans per month and scan history. Paid plans start at $10/month (Starter) with unlimited scans, weekly automated monitoring for one site, and PDF reports. Pro ($49/month) covers up to 10 monitored sites with 20-page full-site crawls, and Agency ($149/month) adds up to 30 sites, larger crawls, and white-label PDF reports.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between automated and manual accessibility testing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Automated tools like A11yScope can detect approximately 30-40% of WCAG issues — including missing alt text, color contrast failures, missing form labels, and keyboard traps. The remaining issues require manual testing with screen readers (like NVDA or VoiceOver) and keyboard navigation. A11yScope covers the automated portion thoroughly and highlights areas needing manual review.",
        },
      },
      {
        "@type": "Question",
        name: "Do I legally need WCAG compliance for my website?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In the US, ADA Title III has been interpreted by courts to cover websites, and over 4,000 web accessibility lawsuits were filed in 2023. In the EU, the European Accessibility Act (EAA) mandates digital accessibility from June 2025. Government websites in the US must comply with Section 508. Even without legal requirements, WCAG compliance improves SEO, user experience, and reaches 15% of the global population living with disabilities.",
        },
      },
      {
        "@type": "Question",
        name: "What is axe-core and why does A11yScope use it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "axe-core is an open-source accessibility testing engine maintained by Deque Systems. It's the industry standard used by Google Lighthouse, Microsoft Accessibility Insights, and many other tools. A11yScope uses axe-core because of its proven accuracy, comprehensive rule coverage, and zero false-positive commitment.",
        },
      },
    ],
  };

  // Single canonical commercial schema for the product. A11yScope is a SaaS,
  // so SoftwareApplication (Google's recommended type for software) is the
  // right type — not Product, which pulls the page into the retail "merchant
  // listings" experience that requires image/shipping/return fields a monthly
  // subscription doesn't have. When customer-story reviews land,
  // aggregateRating + review wire in here.
  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "A11yScope",
    url: "https://www.a11yscope.com",
    image: "https://www.a11yscope.com/opengraph-image",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description:
      "Scan your website for accessibility issues in seconds. Get actionable WCAG 2.1 AA findings and WCAG 2.2 readiness guidance.",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Starter",
        price: "10",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: "https://www.a11yscope.com/#pricing",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "49",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: "https://www.a11yscope.com/#pricing",
      },
      {
        "@type": "Offer",
        name: "Agency",
        price: "149",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: "https://www.a11yscope.com/#pricing",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Navigation */}
      <div className="border-b border-line bg-background/90 backdrop-blur-sm sticky top-0 z-40">
        <nav className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg
              className="h-7 w-7 text-foreground"
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
            <span className="font-display text-xl font-semibold text-foreground tracking-tight">
              A11yScope
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="meta-label hover:text-foreground transition-colors hidden sm:block"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="meta-label hover:text-foreground transition-colors hidden sm:block"
            >
              Pricing
            </a>
            <a
              href="/login"
              onMouseDown={() => track("signup_clicked", { from: "home_top_nav" })}
              className="meta-label hover:text-foreground transition-colors hidden sm:block"
            >
              Sign In
            </a>
            <a
              href="/dashboard"
              className="bg-primary text-background text-sm font-semibold px-5 py-2 rounded-[3px] hover:bg-primary-dark transition-colors"
            >
              Dashboard
            </a>
          </div>
        </nav>
      </div>

      <main>
      {/* Hero Section */}
      <section className="bg-graph-paper border-b border-line pt-16 pb-24 text-center">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="space-y-6">
          <p className="meta-label reveal reveal-1">
            Automated WCAG inspection &mdash; est. 2026 &mdash; 986 scans on record
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.05] reveal reveal-2">
            Find accessibility issues
            <br />
            <span className="ink-underline">before users leave.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-xl mx-auto leading-relaxed reveal reveal-3">
            Scan any webpage for WCAG 2.1 AA issues in seconds, spot WCAG 2.2
            readiness gaps, and get fix-ready guidance. No sign-up required.
          </p>
        </div>

        {/* Scan Form */}
        <ScanForm
          onScanComplete={(result) => {
            setScanResult(result);
            setError(null);
            setErrorMeta(null);
          }}
          onScanStart={() => {
            setIsScanning(true);
            setScanResult(null);
            setError(null);
            setErrorMeta(null);
          }}
          onError={(err, meta) => {
            setError(err);
            setErrorMeta(meta ?? null);
            setIsScanning(false);
          }}
        />

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 reveal reveal-4">
          {[
            "WCAG 2.1 AA checks",
            "WCAG 2.2-ready guidance",
            "Powered by axe-core®",
            "No sign-up required",
          ].map((item, i) => (
            <span key={item} className="flex items-center gap-x-3">
              {i > 0 && (
                <span aria-hidden="true" className="text-accent font-mono text-xs">
                  /
                </span>
              )}
              <span className="meta-label !text-foreground/70">{item}</span>
            </span>
          ))}
        </div>
        </div>
      </section>

      {/* Loading State */}
      {isScanning && !scanResult && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="report-sheet crop-ticks p-12 text-center space-y-4">
            <div className="flex justify-center">
              <svg
                className="animate-spin h-12 w-12 text-primary"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Scanning your page...
            </h3>
            <p className="text-muted">
              Loading page, analyzing DOM structure, and checking WCAG rules.
              This usually takes 10-30 seconds.
            </p>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="bg-[#fdf3ed] border border-[#e6c4ae] rounded-[3px] p-8 text-center space-y-4">
            <h3 className="font-display text-2xl font-semibold text-danger">
              {errorMeta?.signup || errorMeta?.upgrade
                ? "You've hit the free scan limit"
                : "Scan Failed"}
            </h3>
            <p className="text-foreground/80">{error}</p>
            {errorMeta?.signup && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href="/login"
                  onMouseDown={() => track("signup_clicked", { from: "home_limit_error" })}
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-background font-semibold rounded-[2px] hover:bg-primary-dark transition-colors"
                >
                  Create a Free Account
                </a>
                <button
                  onClick={() => handleCheckout("starter")}
                  disabled={checkoutLoading !== null}
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-[2px] hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                >
                  {checkoutLoading === "starter"
                    ? "Redirecting..."
                    : "Start 7-Day Starter Trial — $10/mo"}
                </button>
              </div>
            )}
            {!errorMeta?.signup && errorMeta?.upgrade && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => handleCheckout("starter")}
                  disabled={checkoutLoading !== null}
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-background font-semibold rounded-[2px] hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {checkoutLoading === "starter"
                    ? "Redirecting..."
                    : "Upgrade to Starter — $10/mo"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Scan Results */}
      {scanResult && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <ScanReport
            result={scanResult}
            onCheckout={handleCheckout}
            checkoutLoading={checkoutLoading}
            isLoggedIn={userEmail !== null}
            prefillEmail={userEmail}
          />
        </section>
      )}

      {/* Features Section — inspection index */}
      <section id="features" className="py-24 border-b border-line">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="meta-label mb-3">Section 01 — Capabilities</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground">
              Why teams choose A11yScope
            </h2>
            <p className="text-lg text-muted mt-3 max-w-2xl">
              More than a scanner. A complete accessibility compliance platform.
            </p>
          </div>

          {/* Top row — 2 hero features */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {[
              {
                index: "01",
                title: "Instant Scanning",
                body: "Get results in under 30 seconds. No browser extensions or code changes needed. Just paste your URL and get a focused WCAG 2.1 AA scan.",
              },
              {
                index: "02",
                title: "Fix-Ready Code",
                body: "Every issue comes with specific code snippets to fix it. Copy, paste, deploy. No accessibility expertise required.",
              },
            ].map((f) => (
              <div key={f.index} className="report-sheet p-8">
                <p className="font-mono text-sm text-accent mb-5">{f.index}</p>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>

          {/* Bottom row — compact features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                index: "03",
                title: "Weekly Monitoring",
                body: "Automated scans alert you to new issues before they become problems.",
              },
              {
                index: "04",
                title: "WCAG 2.2 Ready",
                body: "Automated checks plus guidance for newer focus, target-size, and authentication criteria.",
              },
              {
                index: "05",
                title: "PDF Reports",
                body: "Professional compliance reports for stakeholders and legal teams.",
              },
            ].map((f) => (
              <div key={f.index} className="report-sheet p-5">
                <p className="font-mono text-xs text-accent mb-3">{f.index}</p>
                <h3 className="text-sm font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-muted text-xs leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-b border-line bg-graph-paper">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="meta-label mb-3">Section 02 — Pricing</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted mt-3">
              Start free. Upgrade when you need full-site coverage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Free */}
            <div className="report-sheet p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Free</h3>
                <p className="text-muted text-sm mt-1">For quick checks</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold">$0</span>
                <span className="text-muted">/month</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-success shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  5 page scans per hour without signup
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-success shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  WCAG 2.1 AA checks
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-success shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Fix suggestions
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-success shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Free account: 50 scans/month + history
                </li>
              </ul>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-full py-3 border-2 border-gray-200 rounded-[2px] font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Scan Now — Free
              </button>
            </div>

            {/* Starter */}
            <div className="report-sheet crop-ticks p-8 space-y-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white font-mono text-[11px] font-semibold uppercase tracking-[0.14em] px-3 py-1 rounded-[2px]">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Starter</h3>
                <p className="text-muted text-sm mt-1">
                  For one site, watched weekly
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold">$10</span>
                <span className="text-muted">/month</span>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  "Unlimited page scans",
                  "1 monitored site, scanned weekly",
                  "Email alerts for new issues",
                  "PDF compliance reports",
                  "Full scan history",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-success shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout("starter")}
                disabled={checkoutLoading === "starter"}
                className="w-full py-3 bg-primary text-background rounded-[2px] font-semibold hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading === "starter" ? "Redirecting..." : "Start 7-Day Free Trial"}
              </button>
            </div>

            {/* Pro */}
            <div className="report-sheet p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Pro</h3>
                <p className="text-muted text-sm mt-1">
                  For businesses &amp; agencies
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold">$49</span>
                <span className="text-muted">/month</span>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  "Everything in Starter",
                  "Up to 10 monitored sites",
                  "Weekly full-site crawl (up to 20 pages)",
                  "Fix-ready code snippets",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-success shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout("pro")}
                disabled={checkoutLoading === "pro"}
                className="w-full py-3 border-2 border-gray-200 rounded-[2px] font-semibold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading === "pro" ? "Redirecting..." : "Start 7-Day Free Trial"}
              </button>
            </div>

            {/* Agency */}
            <div className="report-sheet p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Agency</h3>
                <p className="text-muted text-sm mt-1">
                  For web agencies &amp; consultants
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold">$149</span>
                <span className="text-muted">/month</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-success shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Everything in Pro (crawl up to 50 pages)
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-success shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Up to 30 sites
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-success shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  White-label PDF reports
                </li>
              </ul>
              <button
                onClick={() => handleCheckout("agency")}
                disabled={checkoutLoading === "agency"}
                className="w-full py-3 border-2 border-gray-200 rounded-[2px] font-semibold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading === "agency" ? "Redirecting..." : "Start 7-Day Free Trial"}
              </button>
            </div>
          </div>
        </div>

        {/* Trust / Guarantee */}
        <p className="text-center text-sm text-muted mt-8">
          7-day free trial on all paid plans. 30-day money-back guarantee. Cancel anytime.
          <br />
          By subscribing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-foreground">Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
        </p>
      </section>

      {/* Credibility Metrics — instrument readout */}
      <section className="py-20 bg-ink-band text-[#f5f2ea]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="meta-label !text-[#a89f8c] text-center mb-10">
            Section 03 — Instrument readings
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#34302a] border border-[#34302a] mb-12">
            {[
              { value: "38+", label: "WCAG rules checked" },
              { value: "~6s", label: "Average scan time" },
              { value: "98", label: "Our own A11yScope score" },
              { value: "$0", label: "Cost to get started" },
            ].map((metric, i) => (
              <div key={i} className="text-center bg-ink-band py-8 px-2">
                <div className="font-mono text-4xl sm:text-5xl font-semibold tracking-tight">
                  {metric.value}
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#a89f8c] mt-3">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-y-6 pt-8">
            <p className="text-sm text-[#a89f8c]">
              Built on{" "}
              <a
                href="https://github.com/dequelabs/axe-core"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d4cec2] underline underline-offset-2 hover:text-white transition-colors"
              >
                axe-core®
              </a>
              {" "}— the world&apos;s most trusted accessibility testing engine
            </p>
            <div className="space-y-5">
              <p className="font-display text-3xl sm:text-4xl font-semibold">
                Don&apos;t let accessibility defects leak into growth.
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 bg-[#f5f2ea] text-foreground font-semibold px-8 py-3 rounded-[2px] hover:bg-white transition-colors cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
                Start Free Scan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <p className="meta-label mb-3">Section 04 — Notes</p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqJsonLd.mainEntity.map((item, i) => (
              <details
                key={i}
                className="group report-sheet"
              >
                <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer text-left font-semibold text-foreground hover:text-accent transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span>{item.name}</span>
                  <svg
                    className="h-5 w-5 shrink-0 text-muted group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-muted text-[15px] leading-relaxed -mt-2">
                  {item.acceptedAnswer.text}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <svg
                  className="h-6 w-6"
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
                <span className="font-display font-semibold text-lg">A11yScope</span>
              </div>
                <p className="text-sm max-w-xs">
                Making the web accessible for everyone. WCAG 2.1 AA scanning,
                WCAG 2.2 readiness guidance, and monitoring for modern teams.
              </p>
            </div>
            <div className="flex gap-12">
              <div className="space-y-3">
                <p className="text-white font-semibold text-sm">Product</p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Free Scanner
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <Link href="/use-cases/ecommerce-accessibility-checker" className="hover:text-white transition-colors">
                      Ecommerce
                    </Link>
                  </li>
                  <li>
                    <Link href="/use-cases/web-agency-accessibility-audits" className="hover:text-white transition-colors">
                      Agencies
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <p className="text-white font-semibold text-sm">Resources</p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/blog" className="hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/wcag-compliance-checklist-2026" className="hover:text-white transition-colors">
                      WCAG Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/ada-website-compliance-guide-small-businesses" className="hover:text-white transition-colors">
                      ADA Compliance
                    </Link>
                  </li>
                  <li>
                    <a href="/faq" className="hover:text-white transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <p className="text-white font-semibold text-sm">Legal</p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/privacy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="/tokushoho" className="hover:text-white transition-colors">
                      Legal Disclosure
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            &copy; 2026 A11yScope. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
