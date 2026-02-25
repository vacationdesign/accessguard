import { NextRequest, NextResponse } from "next/server";
import { scanUrl, ScanResult } from "@/lib/scanner";
import { canUserScan, logScan } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

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

    // Check rate limit (free tier: 5 scans/hour by IP, paid: unlimited)
    // Try to get authenticated user — null for anonymous LP scans
    const appUser = await getCurrentUser().catch(() => null);
    const userId: string | null = appUser?.id ?? null;
    const allowed = await canUserScan(ip, userId);

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. Free tier allows 5 scans per hour. Upgrade to Pro or Agency for unlimited scans.",
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

    // Run the scan
    const scanStart = Date.now();
    const result: ScanResult = await scanUrl(normalizedUrl);
    const scanDurationMs = Date.now() - scanStart;

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

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Scan error:", error);

    if (error.message === "Invalid URL provided") {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    if (error.message?.includes("not allowed")) {
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
