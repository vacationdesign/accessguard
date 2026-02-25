"use client";

import { useState } from "react";
import ScoreGauge from "./ScoreGauge";
import ViolationCard from "./ViolationCard";
import { ScanResult } from "@/lib/scanner";

interface ScanReportProps {
  result: ScanResult;
  onCheckout: (plan: "pro" | "agency") => void;
  checkoutLoading: string | null;
}

export default function ScanReport({ result, onCheckout, checkoutLoading }: ScanReportProps) {
  const [pdfLoading, setPdfLoading] = useState(false);

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

      {/* CTA Banner */}
      {result.violations.length > 0 && (
        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 text-white text-center space-y-3">
          <h3 className="text-xl font-bold">
            {totalIssueNodes} accessibility issues could expose you to lawsuits
          </h3>
          <p className="text-blue-100">
            ADA website lawsuits increased 300% since 2018. Get full-site
            monitoring and automated fix reports.
          </p>
          <button
            onClick={() => onCheckout("pro")}
            disabled={checkoutLoading !== null}
            className="bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkoutLoading ? "Redirecting..." : "Start Full Site Audit — $49/month"}
          </button>
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
      <div className="bg-gray-50 rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-foreground">
          This was just one page.
        </h3>
        <p className="text-muted max-w-lg mx-auto">
          Most websites have accessibility issues on every page. A11yScope Pro
          scans your entire site, monitors for new issues weekly, and gives your
          team fix-ready code snippets.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onCheckout("pro")}
            disabled={checkoutLoading !== null}
            className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkoutLoading === "pro" ? "Redirecting..." : "Try Pro Free for 14 Days"}
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="border-2 border-gray-200 text-foreground font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pdfLoading ? "Generating..." : "Download PDF Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
