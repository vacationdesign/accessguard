"use client";

import { useState } from "react";

interface Violation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: { html: string; failureSummary: string; target: string[] }[];
}

export default function ScanDetailClient({
  violations,
  url,
  score,
}: {
  violations: any[] | null;
  url: string;
  score: number | null;
}) {
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!violations) return;
    setPdfLoading(true);
    try {
      const { generatePdfReport } = await import("@/lib/pdf-report");
      generatePdfReport({
        url,
        timestamp: new Date().toISOString(),
        violations: violations as any,
        passes: 0,
        incomplete: 0,
        score: score ?? 0,
        scanDuration: 0,
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  if (!violations || violations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <p className="text-muted">
          {violations?.length === 0
            ? "No violations found — great job!"
            : "Detailed violation data is not available for this scan."}
        </p>
      </div>
    );
  }

  const impactColors: Record<string, string> = {
    critical: "bg-red-100 text-red-800 border-red-200",
    serious: "bg-orange-100 text-orange-800 border-orange-200",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    minor: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Violations ({violations.length})
        </h2>
        <button
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
          className="text-sm text-primary hover:text-primary-dark font-medium cursor-pointer disabled:opacity-50"
        >
          {pdfLoading ? "Generating..." : "Download PDF"}
        </button>
      </div>

      {violations.map((v, i) => (
        <div
          key={`${v.id}-${i}`}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 flex items-start gap-3">
            <span
              className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${
                impactColors[v.impact] || impactColors.minor
              }`}
            >
              {v.impact}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-foreground">{v.help}</p>
              <p className="text-sm text-muted mt-1">{v.description}</p>
              {v.helpUrl && (
                <a
                  href={v.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-primary-dark mt-1 inline-block"
                >
                  Learn more &rarr;
                </a>
              )}
            </div>
          </div>
          {v.nodes && v.nodes.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
              <p className="text-xs font-medium text-muted mb-2">
                Affected elements ({v.nodes.length}):
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {v.nodes.slice(0, 5).map((node: any, j: number) => (
                  <div key={j} className="text-xs">
                    <code className="bg-white px-2 py-1 rounded border border-gray-200 text-foreground block overflow-x-auto">
                      {node.html}
                    </code>
                  </div>
                ))}
                {v.nodes.length > 5 && (
                  <p className="text-xs text-muted">
                    ... and {v.nodes.length - 5} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
