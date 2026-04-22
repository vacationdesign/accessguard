"use client";

import { useState } from "react";
import ScoreGauge from "./ScoreGauge";
import ViolationCard from "./ViolationCard";
import { ScanResult } from "@/lib/scanner";

interface ScanReportProps {
  result: ScanResult & { domainScanCount?: number };
  onCheckout: (plan: "pro" | "agency") => void;
  checkoutLoading: string | null;
}

export default function ScanReport({ result, onCheckout, checkoutLoading }: ScanReportProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [emailFormOpen, setEmailFormOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const { generatePdfReport } = await import("@/lib/pdf-report");
      generatePdfReport(result);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleEmailReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue.trim()) {
      setEmailStatus("error");
      setEmailError("Please enter an email address.");
      return;
    }
    setEmailStatus("sending");
    setEmailError(null);
    try {
      const response = await fetch("/api/scan/email-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailValue.trim(),
          scanResult: result,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setEmailStatus("error");
        setEmailError(data?.error ?? "Failed to send. Please try again.");
        return;
      }
      setEmailStatus("sent");
    } catch {
      setEmailStatus("error");
      setEmailError("Network error. Please try again.");
    }
  };
  const criticalCount = result.violations.filter(
    (v) => v.impact === "critical"
  ).length;
  const seriousCount = result.violations.filter(
    (v) => v.impact === "serious"
  ).length;
  const moderateCount = result.violations.filter(
    (v) => v.impact === "moderate"
  ).length;
  const minorCount = result.violations.filter(
    (v) => v.impact === "minor"
  ).length;

  const totalIssueNodes = result.violations.reduce(
    (sum, v) => sum + v.nodes.length,
    0
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Accessibility Report
        </h2>
        <p className="text-muted">
          {result.url} &middot; Scanned in{" "}
          {(result.scanDuration / 1000).toFixed(1)}s
        </p>
      </div>

      {/* Score and Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col md:flex-row items-center gap-8">
        <ScoreGauge score={result.score} />

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-red-50">
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              <p className="text-xs text-muted font-medium">Critical</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-orange-50">
              <p className="text-2xl font-bold text-orange-500">
                {seriousCount}
              </p>
              <p className="text-xs text-muted font-medium">Serious</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-yellow-50">
              <p className="text-2xl font-bold text-yellow-500">
                {moderateCount}
              </p>
              <p className="text-xs text-muted font-medium">Moderate</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50">
              <p className="text-2xl font-bold text-blue-500">{minorCount}</p>
              <p className="text-xs text-muted font-medium">Minor</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Total Issues Found</span>
              <span className="font-bold text-foreground">
                {result.violations.length} rules ({totalIssueNodes} elements)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Rules Passed</span>
              <span className="font-bold text-success">{result.passes}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Needs Review</span>
              <span className="font-bold text-warning">{result.incomplete}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Repeated Scan Nudge */}
      {(result.domainScanCount ?? 0) >= 3 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-3">
          <h3 className="text-lg font-bold text-amber-900">
            You&apos;ve scanned this site {result.domainScanCount} times this month
          </h3>
          <p className="text-amber-700 text-sm">
            A11yScope Pro monitors your site automatically every week — no manual
            scanning needed. Get alerted when new issues appear.
          </p>
          <button
            onClick={() => onCheckout("pro")}
            disabled={checkoutLoading !== null}
            className="bg-amber-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-amber-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkoutLoading ? "Redirecting..." : "Start Automated Monitoring"}
          </button>
        </div>
      )}

      {/* CTA Banner */}
      {result.violations.length > 0 && (
        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 text-white text-center space-y-3">
          <h3 className="text-xl font-bold">
            {totalIssueNodes} issues found on this page alone
          </h3>
          <p className="text-blue-100">
            Most websites have accessibility problems on every page. Scan your
            entire site and get fix-ready code snippets for each issue.
          </p>
          <button
            onClick={() => onCheckout("pro")}
            disabled={checkoutLoading !== null}
            className="bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkoutLoading ? "Redirecting..." : "Start 7-Day Free Trial"}
          </button>
          <p className="text-xs text-blue-200 mt-2">
            By subscribing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-white">Terms</a>
            {" "}and{" "}
            <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.
          </p>
        </div>
      )}

      {/* Violations List */}
      {result.violations.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            Issues Found ({result.violations.length})
          </h3>
          {result.violations.map((violation, index) => (
            <ViolationCard
              key={violation.id}
              violation={violation}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-3">
          <div className="text-6xl">&#127881;</div>
          <h3 className="text-xl font-bold text-success">
            No accessibility issues found!
          </h3>
          <p className="text-muted">
            This page passed all WCAG 2.1 AA checks. Keep up the great work.
          </p>
        </div>
      )}

      {/* Footer CTA */}
      <div className="bg-gray-50 rounded-2xl p-8 text-center space-y-5">
        <h3 className="text-xl font-bold text-foreground">
          This was just one page.
        </h3>
        <p className="text-muted max-w-lg mx-auto">
          Create a free account to save your scan results, or upgrade to Pro
          for full-site monitoring.
        </p>

        <div className="max-w-md mx-auto text-left space-y-2">
          <p className="text-sm font-semibold text-foreground">What you get with Pro:</p>
          <ul className="text-sm text-muted space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">&#10003;</span>
              Full-site crawl — scan up to 20 pages at once
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">&#10003;</span>
              Weekly automated monitoring &amp; email alerts
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">&#10003;</span>
              PDF compliance reports for stakeholders
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">&#10003;</span>
              Scan history &amp; score trends over time
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onCheckout("pro")}
            disabled={checkoutLoading !== null}
            className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkoutLoading === "pro" ? "Redirecting..." : "Try Pro Free for 7 Days"}
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="border-2 border-gray-200 text-foreground font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pdfLoading ? "Generating..." : "Download PDF Report"}
          </button>
          {!emailFormOpen && emailStatus !== "sent" && (
            <button
              onClick={() => setEmailFormOpen(true)}
              className="border-2 border-gray-200 text-foreground font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Email This Report
            </button>
          )}
        </div>

        {emailFormOpen && emailStatus !== "sent" && (
          <form
            onSubmit={handleEmailReport}
            className="max-w-md mx-auto text-left bg-white border border-gray-200 rounded-xl p-4 space-y-3"
          >
            <label
              htmlFor="scan-report-email"
              className="block text-sm font-semibold text-foreground"
            >
              Where should we send this report?
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="scan-report-email"
                type="email"
                required
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors text-sm"
                disabled={emailStatus === "sending"}
              />
              <button
                type="submit"
                disabled={emailStatus === "sending"}
                className="bg-primary text-white font-semibold px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {emailStatus === "sending" ? "Sending..." : "Send Report"}
              </button>
            </div>
            {emailStatus === "error" && emailError && (
              <p className="text-xs text-red-600">{emailError}</p>
            )}
            <p className="text-xs text-muted">
              One-time send. No account created. We don&apos;t add you to a
              mailing list.
            </p>
          </form>
        )}

        {emailStatus === "sent" && (
          <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-green-700">
              &#10003; Report sent to {emailValue}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Check your inbox (and spam folder just in case).
            </p>
          </div>
        )}
        <p className="text-xs text-muted">
          Or{" "}
          <a href="/login" className="text-primary underline hover:text-primary-dark">create a free account</a>
          {" "}to save this scan.
          {" "}By subscribing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-foreground">Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
