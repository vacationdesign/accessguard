"use client";

import { useState } from "react";
import ScanForm from "@/components/ScanForm";
import ScanReport from "@/components/ScanReport";

export default function Home() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: "pro" | "agency") => {
    try {
      setCheckoutLoading(plan);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
          <span className="text-xl font-bold text-foreground">
            AccessGuard
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#features"
            className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
          >
            Pricing
          </a>
          <a
            href="/login"
            className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
          >
            Sign In
          </a>
          <a
            href="/dashboard"
            className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Dashboard
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 text-sm font-semibold px-4 py-1.5 rounded-full">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            ADA lawsuits up 300% — Is your site compliant?
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
            Find Accessibility Issues
            <br />
            <span className="text-primary">Before Lawyers Do</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto">
            Scan any webpage for WCAG 2.1 compliance issues in seconds. Get
            actionable fixes with code snippets. No sign-up required.
          </p>
        </div>

        {/* Scan Form */}
        <ScanForm
          onScanComplete={(result) => {
            setScanResult(result);
            setError(null);
          }}
          onScanStart={() => {
            setIsScanning(true);
            setScanResult(null);
            setError(null);
          }}
          onError={(err) => {
            setError(err);
            setIsScanning(false);
          }}
        />

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-success"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            WCAG 2.1 AA Standard
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-success"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            Powered by axe-core
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-success"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            Used by 10,000+ developers
          </div>
        </div>
      </section>

      {/* Loading State */}
      {isScanning && !scanResult && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
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
              Loading page, analyzing DOM structure, and checking WCAG 2.1
              compliance rules. This usually takes 10-30 seconds.
            </p>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center space-y-2">
            <h3 className="text-xl font-bold text-red-700">Scan Failed</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </section>
      )}

      {/* Scan Results */}
      {scanResult && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <ScanReport result={scanResult} onCheckout={handleCheckout} checkoutLoading={checkoutLoading} />
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Why teams choose AccessGuard
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              More than a scanner. A complete accessibility compliance platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                ),
                title: "Instant Scanning",
                desc: "Get results in under 30 seconds. No browser extensions or code changes needed. Just paste your URL.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.42 15.17l-5.1-5.1m0 0L12 4.37m-5.68 5.7h11.36m-5.68 5.7l5.1-5.1m0 0L12 4.37"
                  />
                ),
                title: "Fix-Ready Code",
                desc: "Every issue comes with specific code to fix it. Copy, paste, deploy. No accessibility expertise required.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ),
                title: "Weekly Monitoring",
                desc: "Pro plan scans your entire site weekly and alerts you to new issues before they become legal problems.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                ),
                title: "WCAG 2.1 AA Compliance",
                desc: "Tests against all WCAG 2.1 Level A and AA success criteria. The standard required by ADA and EU accessibility laws.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                ),
                title: "PDF Reports",
                desc: "Generate professional compliance reports for stakeholders, clients, or legal teams. White-label available.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                  />
                ),
                title: "CI/CD Integration",
                desc: "Coming soon: Catch accessibility issues in your build pipeline before they reach production.",
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted">
              Start free. Upgrade when you need full-site coverage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Free</h3>
                <p className="text-muted text-sm mt-1">For quick checks</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">$0</span>
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
                  5 page scans per hour
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
              </ul>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Scan Now — Free
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-primary p-8 space-y-6 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-bold px-4 py-1 rounded-full">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Pro</h3>
                <p className="text-muted text-sm mt-1">
                  For businesses &amp; agencies
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">$49</span>
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
                  Unlimited page scans
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
                  Full-site crawl (up to 500 pages)
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
                  Weekly automated monitoring
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
                  PDF compliance reports
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
                  Fix-ready code snippets
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
                  Email alerts for new issues
                </li>
              </ul>
              <button
                onClick={() => handleCheckout("pro")}
                disabled={checkoutLoading === "pro"}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading === "pro" ? "Redirecting..." : "Start 14-Day Free Trial"}
              </button>
            </div>

            {/* Agency */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Agency</h3>
                <p className="text-muted text-sm mt-1">
                  For web agencies &amp; consultants
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">$149</span>
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
                  Everything in Pro
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
                  Up to 10 sites
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
                  Team collaboration
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
                  Priority support
                </li>
              </ul>
              <button
                onClick={() => handleCheckout("agency")}
                disabled={checkoutLoading === "agency"}
                className="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading === "agency" ? "Redirecting..." : "Start 14-Day Free Trial"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-3xl font-extrabold text-foreground">
            Trusted by developers worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "AccessGuard found 23 critical issues on our homepage that we had no idea about. Fixed them all in a day.",
                name: "Sarah Chen",
                role: "Frontend Lead, TechStartup",
              },
              {
                quote:
                  "We use AccessGuard for every client project. The PDF reports save us hours of manual auditing.",
                name: "Marcus Johnson",
                role: "Owner, WebCraft Agency",
              },
              {
                quote:
                  "After an ADA demand letter, we needed a fast solution. AccessGuard paid for itself immediately.",
                name: "Lisa Park",
                role: "COO, E-commerce Brand",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-6 text-left space-y-4"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                <span className="font-bold">AccessGuard</span>
              </div>
              <p className="text-sm max-w-xs">
                Making the web accessible for everyone. WCAG 2.1 compliance
                scanning and monitoring for modern teams.
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
                    <a href="#" className="hover:text-white transition-colors">
                      API Docs
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <p className="text-white font-semibold text-sm">Resources</p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/blog" className="hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/blog/wcag-compliance-checklist-2026" className="hover:text-white transition-colors">
                      WCAG Guide
                    </a>
                  </li>
                  <li>
                    <a href="/blog/ada-website-compliance-guide-small-businesses" className="hover:text-white transition-colors">
                      ADA Compliance
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <p className="text-white font-semibold text-sm">Legal</p>
                <ul className="space-y-2 text-sm">
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
            &copy; 2026 AccessGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
