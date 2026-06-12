"use client";

import { useState } from "react";
import type { ScanResult } from "@/lib/scanner";

interface ScanErrorMeta {
  signup?: boolean;
  upgrade?: boolean;
}

interface ScanFormProps {
  onScanComplete: (result: ScanResult & { domainScanCount?: number }) => void;
  onScanStart: () => void;
  onError: (error: string, meta?: ScanErrorMeta) => void;
}

export default function ScanForm({
  onScanComplete,
  onScanStart,
  onError,
}: ScanFormProps) {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      onError("Please enter a URL");
      return;
    }

    setIsScanning(true);
    onScanStart();

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        onError(data.error || "Scan failed", {
          signup: Boolean(data.signup),
          upgrade: Boolean(data.upgrade),
        });
        return;
      }

      onScanComplete(data);
    } catch {
      onError("Network error. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="crop-ticks report-sheet p-2 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <label htmlFor="homepage-scan-url" className="sr-only">
            Website URL to scan
          </label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span aria-hidden="true" className="font-mono text-sm text-accent">
              ›
            </span>
          </div>
          <input
            id="homepage-scan-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your website URL (e.g., example.com)"
            className="w-full pl-10 pr-4 py-4 text-lg font-mono border border-transparent rounded-[2px] focus:border-line focus:outline-none transition-colors bg-paper-raised placeholder:font-sans placeholder:text-muted/70"
            disabled={isScanning}
          />
        </div>
        <button
          type="submit"
          disabled={isScanning}
          className="px-8 py-4 bg-primary text-background text-lg font-semibold rounded-[2px] hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
        >
          {isScanning ? (
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Scanning...
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5"
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
              Scan for Free
            </>
          )}
        </button>
      </div>
      <p className="meta-label text-center mt-4">
        Free scan checks one page · no sign-up required
      </p>
    </form>
  );
}
