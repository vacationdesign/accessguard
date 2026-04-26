import { NextRequest, NextResponse } from "next/server";
import { logEvent, type AnalyticsEventKind, ipFromRequest } from "@/lib/analytics";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED_ORIGINS = [
  "https://www.a11yscope.com",
  "https://a11yscope.com",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

const ALLOWED_KINDS: AnalyticsEventKind[] = [
  // Most client-fired events. Server-only events (scan_completed,
  // crawl_completed, scan_rate_limited) are recorded directly inside their
  // respective API handlers and should not be POSTable from the client.
  "signup_clicked",
  "checkout_clicked",
  "email_report_opened",
];

/**
 * POST /api/events
 * Lightweight beacon for client-side funnel events. Strict allowlist of
 * `kind` values prevents random clients from polluting telemetry.
 */
export async function POST(request: NextRequest) {
  // CSRF: must come from our own UI
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { kind, url, meta } = (body ?? {}) as {
    kind?: string;
    url?: string;
    meta?: Record<string, unknown>;
  };

  if (
    !kind ||
    !ALLOWED_KINDS.includes(kind as AnalyticsEventKind)
  ) {
    return NextResponse.json({ error: "Unknown event kind" }, { status: 400 });
  }

  const appUser = await getCurrentUser().catch(() => null);

  // Fire-and-forget — beacon endpoint should respond immediately
  void logEvent({
    kind: kind as AnalyticsEventKind,
    userId: appUser?.id ?? null,
    ip: ipFromRequest(request),
    url: typeof url === "string" ? url : null,
    meta: meta ?? null,
  });

  return NextResponse.json({ ok: true });
}
