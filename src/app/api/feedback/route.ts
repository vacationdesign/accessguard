import { NextRequest, NextResponse } from "next/server";
import { logEvent, ipFromRequest } from "@/lib/analytics";
import { getAnalyticsEventCountByIp } from "@/lib/db";

// Sentiment-only feedback collection from the scan results page. Heavier
// "Customer Story" submissions (name, role, quote, public consent) will
// land in a dedicated table when that flow ships — analytics_events.meta
// is fine for short sentiment + optional one-line comment.

const ALLOWED_ORIGINS = [
  "https://www.a11yscope.com",
  "https://a11yscope.com",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

const MAX_FEEDBACK_PER_IP_PER_HOUR = 5;
const MAX_COMMENT_CHARS = 500;

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = ipFromRequest(request);

    const recent = await getAnalyticsEventCountByIp(
      ip,
      1,
      "feedback_submitted"
    );
    if (recent >= MAX_FEEDBACK_PER_IP_PER_HOUR) {
      return NextResponse.json(
        { error: "Thanks — we already got your earlier notes. Try again later." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { sentiment, comment, url } = (body ?? {}) as {
      sentiment?: string;
      comment?: string;
      url?: string;
    };

    if (sentiment !== "positive" && sentiment !== "negative") {
      return NextResponse.json(
        { error: "Sentiment must be 'positive' or 'negative'." },
        { status: 400 }
      );
    }

    const trimmedComment =
      typeof comment === "string" ? comment.trim().slice(0, MAX_COMMENT_CHARS) : "";

    void logEvent({
      kind: "feedback_submitted",
      ip,
      url: typeof url === "string" ? url.slice(0, 2048) : null,
      meta: {
        sentiment,
        comment: trimmedComment || null,
        comment_length: trimmedComment.length,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("feedback endpoint error:", err);
    return NextResponse.json(
      { error: "Failed to record feedback. Please try again." },
      { status: 500 }
    );
  }
}
