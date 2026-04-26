import { NextRequest, NextResponse } from "next/server";
import { sendScanReportEmail } from "@/lib/email";
import {
  logEmailEvent,
  getEmailEventCountByIp,
  getEmailEventCountByRecipient,
} from "@/lib/db";
import { logEvent } from "@/lib/analytics";

// Dedicated rate limits for this endpoint. Both are enforced — the IP cap
// stops a single attacker burning our Resend quota, and the recipient cap
// stops a rotating-IP attacker from bombing one victim's inbox.
const MAX_EMAIL_REPORTS_PER_IP_PER_HOUR = 3;
const MAX_EMAIL_REPORTS_PER_RECIPIENT_PER_DAY = 3;

// Guard against someone POSTing an enormous scanResult object to abuse our
// serverless memory or email template rendering. Real scans top out at ~100
// violations; 500 is a generous ceiling.
const MAX_VIOLATIONS = 500;

const ALLOWED_ORIGINS = [
  "https://www.a11yscope.com",
  "https://a11yscope.com",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

function isValidEmail(email: string): boolean {
  // Intentionally loose — we're not validating deliverability, just shape
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export async function POST(request: NextRequest) {
  try {
    // CSRF: require a known Origin header. Non-browser clients (curl) are
    // blocked — this endpoint is only meant to be called from our own UI.
    const origin = request.headers.get("origin");
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Per-IP rate limit on this specific endpoint
    const ipCount = await getEmailEventCountByIp(ip, 1, "scan_report");
    if (ipCount >= MAX_EMAIL_REPORTS_PER_IP_PER_HOUR) {
      return NextResponse.json(
        {
          error: "Too many email-report requests. Try again in an hour.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, scanResult } = body ?? {};

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!scanResult || typeof scanResult !== "object") {
      return NextResponse.json(
        { error: "Missing scan result." },
        { status: 400 }
      );
    }

    // Per-recipient rate limit: block sending to the same address more than
    // 3 times per day even if the attacker rotates IPs
    const recipCount = await getEmailEventCountByRecipient(
      email,
      24,
      "scan_report"
    );
    if (recipCount >= MAX_EMAIL_REPORTS_PER_RECIPIENT_PER_DAY) {
      return NextResponse.json(
        {
          error: "This address has already received 3 reports today.",
        },
        { status: 429 }
      );
    }

    const url: string =
      typeof scanResult.url === "string" ? scanResult.url : "";
    const score: number =
      typeof scanResult.score === "number" ? scanResult.score : 0;
    const rawViolations = Array.isArray(scanResult.violations)
      ? scanResult.violations
      : [];

    if (rawViolations.length > MAX_VIOLATIONS) {
      return NextResponse.json(
        { error: "Scan result too large." },
        { status: 413 }
      );
    }

    const violationsCount = rawViolations.length;
    const totalIssueNodes = rawViolations.reduce((sum: number, v: unknown) => {
      const nodes = (v as { nodes?: unknown[] })?.nodes;
      return sum + (Array.isArray(nodes) ? nodes.length : 0);
    }, 0);

    // Pick the top 5 most impactful violations (critical > serious > moderate)
    const impactOrder: Record<string, number> = {
      critical: 0,
      serious: 1,
      moderate: 2,
      minor: 3,
    };
    const topViolations = [...rawViolations]
      .sort((a: unknown, b: unknown) => {
        const ai = (a as { impact?: string }).impact ?? "moderate";
        const bi = (b as { impact?: string }).impact ?? "moderate";
        return (impactOrder[ai] ?? 4) - (impactOrder[bi] ?? 4);
      })
      .slice(0, 5)
      .map((v: unknown) => {
        const x = v as {
          id?: string;
          impact?: string | null;
          help?: string;
          description?: string;
          nodes?: unknown[];
        };
        return {
          id: x.id ?? "",
          impact: x.impact ?? null,
          help: x.help ?? x.id ?? "Accessibility issue",
          description: x.description,
          nodeCount: Array.isArray(x.nodes) ? x.nodes.length : 0,
        };
      });

    // Log the event BEFORE sending so concurrent requests can see it and
    // enforce the per-recipient cap. A failed send after a logged event is
    // still counted — that's a safe fail-closed bias for an abuse-prevention
    // counter.
    await logEmailEvent("scan_report", email, ip);

    const sent = await sendScanReportEmail({
      to: email,
      url,
      score,
      violationsCount,
      totalIssueNodes,
      topViolations,
    });

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 502 }
      );
    }

    void logEvent({
      kind: "email_report_sent",
      ip,
      url,
      meta: { score, violations_count: violationsCount },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("email-report error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
