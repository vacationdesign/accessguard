import { NextRequest, NextResponse } from "next/server";
import { scanUrl, ScanResult } from "@/lib/scanner";

// Rate limiting - simple in-memory store (replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // scans per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Free tier allows 5 scans per hour.",
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
    const result: ScanResult = await scanUrl(normalizedUrl);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Scan error:", error);

    if (error.message === "Invalid URL provided") {
      return NextResponse.json(
        { error: "Invalid URL provided" },
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
