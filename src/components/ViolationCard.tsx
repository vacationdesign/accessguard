"use client";

import { useState } from "react";

interface ViolationCardProps {
  violation: {
    id: string;
    impact: "critical" | "serious" | "moderate" | "minor";
    description: string;
    help: string;
    helpUrl: string;
    tags: string[];
    nodes: {
      html: string;
      target: string[];
      failureSummary: string;
      fixSuggestion: string;
    }[];
  };
  index: number;
}

const impactStyles = {
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-600 text-white",
    label: "Critical",
  },
  serious: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-500 text-white",
    label: "Serious",
  },
  moderate: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-500 text-white",
    label: "Moderate",
  },
  minor: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-500 text-white",
    label: "Minor",
  },
};

export default function ViolationCard({
  violation,
  index,
}: ViolationCardProps) {
  const [isExpanded, setIsExpanded] = useState(index < 3);
  const style = impactStyles[violation.impact];

  return (
    <div className={`rounded-xl border-2 ${style.border} ${style.bg} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${style.badge} shrink-0`}
          >
            {style.label}
          </span>
          <h3 className="font-semibold text-foreground truncate">
            {violation.help}
          </h3>
          <span className="text-sm text-muted shrink-0">
            ({violation.nodes.length} element{violation.nodes.length > 1 ? "s" : ""})
          </span>
        </div>
        <svg
          className={`h-5 w-5 text-muted transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-6 pb-5 space-y-4">
          <p className="text-sm text-muted">{violation.description}</p>

          {/* Affected elements */}
          {violation.nodes.slice(0, 5).map((node, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-4 space-y-3 border border-gray-100"
            >
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                  Affected Element
                </p>
                <code className="text-sm bg-gray-100 px-3 py-1.5 rounded-md block overflow-x-auto text-red-700">
                  {node.html.length > 200
                    ? node.html.substring(0, 200) + "..."
                    : node.html}
                </code>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                  Issue
                </p>
                <p className="text-sm text-foreground">{node.failureSummary}</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-1">
                  How to Fix
                </p>
                <p className="text-sm text-green-900">{node.fixSuggestion}</p>
              </div>
            </div>
          ))}

          {violation.nodes.length > 5 && (
            <p className="text-sm text-muted text-center py-2">
              + {violation.nodes.length - 5} more affected elements.{" "}
              <span className="text-primary font-semibold">
                Upgrade to see all.
              </span>
            </p>
          )}

          <a
            href={violation.helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"
          >
            Learn more about this rule
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
