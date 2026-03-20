import { NextRequest, NextResponse } from "next/server";
import { crawlAndScan } from "@/lib/scanner";
import { logScan } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabase";

// Full-site crawl needs up to 5 minutes
export const maxDuration = 300;

/** Page limits per plan */
const PLAN_LIMITS: Record<string, number> = {
  pro: 20,
  agency: 50,
};

export async function POST(request: NextRequest) {
  try {
    // Authentication required
    const appUser = await getCurrentUser().catch(() => null);
    if (!appUser) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to use full-site crawl." },
        { status: 401 }
      );
    }

    // Check plan — crawl is Pro/Agency only
    const supabase = getSupabaseClient();
    const { data: user } = await supabase
      .from("users")
      .select("plan")
      .eq("id", appUser.id)
      .single();

    const plan = user?.plan;
    const maxPages = PLAN_LIMITS[plan ?? ""];

    if (!maxPages) {
      return NextResponse.json(
        {
          error:
            "Full-site crawl is available on Pro and Agency plans. Upgrade to scan your entire site.",
          upgrade: true,
        },
        { status: 403 }
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
    let normalizedUrl: string;
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error();
      }
      normalizedUrl = parsed.toString();
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid URL" },
        { status: 400 }
      );
    }

    // Set a hard deadline: 280s from now (20s buffer before Vercel timeout)
    const deadlineMs = Date.now() + 280_000;

    // Run the crawl
    const result = await crawlAndScan(normalizedUrl, maxPages, deadlineMs);

    // Get client IP for logging
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Log each page result to the database
    for (const pageResult of result.pageResults) {
      if (pageResult.error) continue; // Skip failed pages
      try {
        await logScan(
          appUser.id,
          pageResult.url,
          ip,
          pageResult.score ?? 0,
          pageResult.violations?.length ?? 0,
          pageResult.scanDuration ?? 0,
          pageResult.violations ?? undefined,
          pageResult.passes ?? undefined,
          pageResult.incomplete ?? undefined
        );
      } catch (err) {
        console.error(`Failed to log crawl scan for ${pageResult.url}:`, err);
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Crawl error:", error);

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
          "Full-site crawl failed. The site may be blocking automated access or taking too long to load.",
      },
      { status: 500 }
    );
  }
}
