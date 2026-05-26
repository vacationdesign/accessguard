"use client";

import { useState } from "react";

type Sentiment = "positive" | "negative";
type Status = "idle" | "submitting" | "submitted" | "error";

interface FeedbackWidgetProps {
  scannedUrl?: string;
}

export default function FeedbackWidget({ scannedUrl }: FeedbackWidgetProps) {
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePick = (next: Sentiment) => {
    if (status === "submitting" || status === "submitted") return;
    setSentiment(next);
    setStatus("idle");
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentiment) return;
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentiment,
          comment: comment.trim() || undefined,
          url: scannedUrl,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setStatus("error");
        setErrorMsg(data?.error ?? "Couldn't save that — please try again.");
        return;
      }
      setStatus("submitted");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  if (status === "submitted") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
        <p className="text-sm font-semibold text-green-700">
          Thanks &mdash; we read every one.
        </p>
        <p className="text-xs text-green-600 mt-1">
          Your note helps shape what we build next.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">
          Was this report useful?
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handlePick("positive")}
            aria-pressed={sentiment === "positive"}
            disabled={status === "submitting"}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              sentiment === "positive"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-gray-50 text-muted border border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span aria-hidden="true">&#128077;</span>
            <span className="ml-1.5">Yes</span>
          </button>
          <button
            type="button"
            onClick={() => handlePick("negative")}
            aria-pressed={sentiment === "negative"}
            disabled={status === "submitting"}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              sentiment === "negative"
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-gray-50 text-muted border border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span aria-hidden="true">&#128078;</span>
            <span className="ml-1.5">Not really</span>
          </button>
        </div>
      </div>

      {sentiment && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label
            htmlFor="feedback-comment"
            className="block text-xs text-muted"
          >
            {sentiment === "positive"
              ? "What worked best? (optional)"
              : "What was missing? (optional)"}
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={2}
            placeholder={
              sentiment === "positive"
                ? "e.g. the top-3 fix list was exactly what I needed"
                : "e.g. I wanted a breakdown by section, not by rule"
            }
            disabled={status === "submitting"}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors text-sm disabled:bg-gray-50"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-muted">
              {comment.length} / 500
            </span>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {status === "submitting" ? "Sending..." : "Send"}
            </button>
          </div>
          {status === "error" && errorMsg && (
            <p className="text-xs text-red-600">{errorMsg}</p>
          )}
        </form>
      )}
    </div>
  );
}
