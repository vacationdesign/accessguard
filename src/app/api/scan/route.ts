import { NextRequest, NextResponse } from "next/server";
import { scanUrl, ScanResult } from "@/lib/scanner";
import {
  canUserScanDetailed,
  logScan,
  getDomainScanCount,
} from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { logEvent } from "@/lib/analytics";

// Vercel serverless function config: scanning needs up to 60s
export const maxDuration = 60;

const ALLOWED_ORIGINS = [
  "https://www.a11yscope.com",
  "https://a11yscope.com",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

export async function POST(request: NextRequest) {
  try {
    // CSRF protection: validate Origin header
    const origin = request.headers.get("origin");
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limit. Three tiers:
    //   anonymous    → 5/hour by IP             → push to free signup
    //   free signed  → 50/month per account     → push to Pro trial
    //   pro/agency   → unlimited
    // Try to get authenticated user — null for anonymous LP scans
    const appUser = await getCurrentUser().catch(() => null);
    const userId: string | null = appUser?.id ?? null;
    const auth = await canUserScanDetailed(ip, userId);

    if (!auth.allowed) {
      void logEvent({
        kind: "scan_rate_limited",
        userId,
        ip,
        meta: { reason: auth.reason },
      });
      if (auth.reason === "anonymous_hourly") {
        return NextResponse.json(
          {
            error:
              "You've hit the 5-scan hourly limit. Create a free account to get 50 scans per month plus scan history — no credit card required — or start a 7-day Pro trial for unlimited scanning and weekly monitoring.",
            signup: true,
            upgrade: true,
          },
          { status: 429 }
        );
      }
      // reason === "free_monthly"
      return NextResponse.json(
        {
          error:
            "You've used all 50 free scans this month. Start a 7-day Pro trial for unlimited scans, full-site crawls, and weekly monitoring.",
          upgrade: true,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error();
      }
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid URL" },
        { status: 400 }
      );
    }

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    void logEvent({
      kind: "scan_started",
      userId,
      ip,
      url: normalizedUrl,
    });

    // Run the scan
    const scanStart = Date.now();
    const result: ScanResult = await scanUrl(normalizedUrl);
    const scanDurationMs = Date.now() - scanStart;

    void logEvent({
      kind: "scan_completed",
      userId,
      ip,
      url: normalizedUrl,
      meta: {
        score: result.score,
        violations_count: result.violations?.length ?? 0,
        duration_ms: scanDurationMs,
      },
    });

    // Log the scan to the database (must await to prevent Vercel from
    // terminating the function before the write completes)
    try {
      await logScan(
        userId,
        normalizedUrl,
        ip,
        result.score ?? 0,
        result.violations?.length ?? 0,
        scanDurationMs,
        result.violations ?? undefined,
        result.passes ?? undefined,
        result.incomplete ?? undefined
      );
    } catch (err) {
      console.error("Failed to log scan:", err);
    }

    // Count how many times this IP has scanned the same domain (for nudge)
    let domainScanCount = 0;
    try {
      const hostname = new URL(normalizedUrl).hostname;
      domainScanCount = await getDomainScanCount(ip, hostname);
    } catch {
      // ignore — non-critical
    }

    return NextResponse.json({ ...result, domainScanCount });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Scan failed");
    console.error("Scan error:", error);

    if (message === "Invalid URL provided") {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    if (message.includes("not allowed")) {
      return NextResponse.json(
        { error: "This URL cannot be scanned for security reasons." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to scan the page. The site may be blocking automated access or taking too long to load.",
      },
      { status: 500 }
    );
  }
}
