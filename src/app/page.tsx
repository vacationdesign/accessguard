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

  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "A11yScope",
    url: "https://www.a11yscope.com",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description:
      "Scan your website for accessibility issues in seconds. Get actionable fixes for WCAG 2.1 compliance.",
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
      { "@type": "Offer", price: "49", priceCurrency: "USD", name: "Pro" },
      { "@type": "Offer", price: "149", priceCurrency: "USD", name: "Agency" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
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
            A11yScope
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

      <main>
      {/* Hero Section */}
      <section className="bg-dot-pattern pt-20 pb-28 text-center">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="space-y-5">
          <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-sm font-medium px-4 py-1.5 rounded-full border border-red-200">
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
          <p className="text-lg sm:text-xl text-muted max-w-xl mx-auto leading-relaxed">
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
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
          <span>WCAG 2.1 AA Standard</span>
          <span className="text-gray-300">·</span>
          <span>Powered by axe-core®</span>
          <span className="text-gray-300">·</span>
          <span>No sign-up required</span>
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

      {/* Features Section — Bento Grid */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-2 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Why teams choose A11yScope
            </h2>
            <p className="text-lg text-muted">
              More than a scanner. A complete accessibility compliance platform.
            </p>
          </div>

          {/* Top row — 2 hero features */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-8">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Instant Scanning</h3>
              <p className="text-muted leading-relaxed">
                Get results in under 30 seconds. No browser extensions or code changes needed. Just paste your URL and get a full WCAG 2.1 audit.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-8">
              <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Fix-Ready Code</h3>
              <p className="text-muted leading-relaxed">
                Every issue comes with specific code snippets to fix it. Copy, paste, deploy. No accessibility expertise required.
              </p>
            </div>
          </div>

          {/* Bottom row — 4 compact features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">Weekly Monitoring</h3>
              <p className="text-muted text-xs leading-relaxed">Automated scans alert you to new issues before they become problems.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="h-10 w-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">WCAG 2.1 AA</h3>
              <p className="text-muted text-xs leading-relaxed">Tests against all Level A and AA criteria required by ADA and EU law.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="h-10 w-10 bg-rose-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">PDF Reports</h3>
              <p className="text-muted text-xs leading-relaxed">Professional compliance reports for stakeholders and legal teams.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L12 4.37m-5.68 5.7h11.36m-5.68 5.7l5.1-5.1m0 0L12 4.37" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">CI/CD Integration</h3>
              <p className="text-muted text-xs leading-relaxed">Coming soon: Catch issues in your build pipeline before production.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-2 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted">
              Start free. Upgrade when you need full-site coverage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
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
            <div className="bg-white rounded-2xl border-2 border-primary shadow-xl p-8 space-y-6 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-blue-500 text-white text-sm font-bold px-4 py-1 rounded-full">
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
            <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
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

      {/* Credibility Metrics */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { value: "38+", label: "WCAG rules checked" },
              { value: "~6s", label: "Average scan time" },
              { value: "97", label: "Our own A11yScope score" },
              { value: "$0", label: "Cost to get started" },
            ].map((metric, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">{metric.value}</div>
                <div className="text-sm text-gray-400 mt-2">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center space-y-6 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              Built on{" "}
              <a
                href="https://github.com/dequelabs/axe-core"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 underline underline-offset-2 hover:text-white transition-colors"
              >
                axe-core®
              </a>
              {" "}— the world&apos;s most trusted accessibility testing engine
            </p>
            <div className="space-y-3">
              <p className="text-2xl sm:text-3xl font-bold">
                Don&apos;t wait for a lawsuit.{" "}
                <span className="text-primary">Scan your site now.</span>
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
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
                <span className="font-bold">A11yScope</span>
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
            &copy; 2026 A11yScope. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
