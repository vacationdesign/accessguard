import { NextRequest, NextResponse } from "next/server";
import { sendScanReportEmail } from "@/lib/email";
import { getRecentScanCount } from "@/lib/db";

// Rate limit: 3 email-report requests per IP per hour. Prevents abuse of
// Resend as an email relay while still letting legitimate users re-send.
const MAX_EMAIL_REPORTS_PER_HOUR = 3;

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
    // CSRF: validate Origin header on POST
    const origin = request.headers.get("origin");
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Soft rate limit via existing scan-count helper (same IP bucket)
    const recent = await getRecentScanCount(ip, 1);
    if (recent > 50) {
      // 50 scans/hour is already abusive territory — block email sends too
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
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

    const url: string =
      typeof scanResult.url === "string" ? scanResult.url : "";
    const score: number =
      typeof scanResult.score === "number" ? scanResult.score : 0;
    const violations = Array.isArray(scanResult.violations)
      ? scanResult.violations
      : [];

    const violationsCount = violations.length;
    const totalIssueNodes = violations.reduce(
      (sum: number, v: unknown) => {
        const nodes = (v as { nodes?: unknown[] })?.nodes;
        return sum + (Array.isArray(nodes) ? nodes.length : 0);
      },
      0
    );

    // Pick the top 5 most impactful violations (critical > serious > moderate)
    const impactOrder: Record<string, number> = {
      critical: 0,
      serious: 1,
      moderate: 2,
      minor: 3,
    };
    const topViolations = [...violations]
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

    // Send — non-blocking errors are logged inside sendScanReportEmail
    await sendScanReportEmail({
      to: email,
      url,
      score,
      violationsCount,
      totalIssueNodes,
      topViolations,
    });

    return NextResponse.json({ ok: true, maxPerHour: MAX_EMAIL_REPORTS_PER_HOUR });
  } catch (err: unknown) {
    console.error("email-report error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
