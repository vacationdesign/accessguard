"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface ScanResult {
  url: string;
  score: number;
  violations: any[];
  passes: number;
  incomplete: number;
  scanDuration: number;
}

export default function DashboardScanPage() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState(searchParams.get("url") || "");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update URL from search params when they change
  useEffect(() => {
    const paramUrl = searchParams.get("url");
    if (paramUrl) setUrl(paramUrl);
  }, [searchParams]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setScanning(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Scan failed");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Scan</h1>
        <p className="text-muted mt-1">
          Run an accessibility scan on any webpage.
        </p>
      </div>

      {/* Scan Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
          />
          <button
            type="submit"
            disabled={scanning || !url.trim()}
            className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
          >
            {scanning ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Scanning...
              </>
            ) : (
              "Run Scan"
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-danger text-sm px-4 py-3 rounded-lg mt-4">
            {error}
          </div>
        )}
      </div>

      {/* Scan Result */}
      {result && (
        <div className="space-y-6">
          {/* Score Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-sm text-muted">Score</p>
              <p
                className={`text-3xl font-bold mt-1 ${
                  result.score >= 90
                    ? "text-green-600"
                    : result.score >= 70
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {result.score}%
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-sm text-muted">Violations</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {result.violations.length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-sm text-muted">Passes</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {result.passes}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-sm text-muted">Scan Time</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {(result.scanDuration / 1000).toFixed(1)}s
              </p>
            </div>
          </div>

          {/* Violations */}
          {result.violations.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Violations ({result.violations.length})
              </h2>
              {result.violations.map((v: any, i: number) => {
                const impactColors: Record<string, string> = {
                  critical: "bg-red-100 text-red-800 border-red-200",
                  serious: "bg-orange-100 text-orange-800 border-orange-200",
                  moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
                  minor: "bg-blue-100 text-blue-800 border-blue-200",
                };
                return (
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
                        <p className="text-sm text-muted mt-1">
                          {v.description}
                        </p>
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
                          {v.nodes.slice(0, 3).map((node: any, j: number) => (
                            <code
                              key={j}
                              className="bg-white px-2 py-1 rounded border border-gray-200 text-xs text-foreground block overflow-x-auto"
                            >
                              {node.html}
                            </code>
                          ))}
                          {v.nodes.length > 3 && (
                            <p className="text-xs text-muted">
                              ... and {v.nodes.length - 3} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-green-800 font-semibold">
                No violations found — great job!
              </p>
            </div>
          )}

          {/* View in history */}
          <div className="text-center">
            <Link
              href="/dashboard/history"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              View all scans in history &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
