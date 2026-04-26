import { NextRequest, NextResponse } from "next/server";
import { crawlAndScan } from "@/lib/scanner";
import { logScan, createCrawlBatch } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabase";
import { getErrorMessage } from "@/lib/errors";
import { logEvent, ipFromRequest } from "@/lib/analytics";

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

    const ip = ipFromRequest(request);

    void logEvent({
      kind: "crawl_started",
      userId: appUser.id,
      ip,
      url: normalizedUrl,
      meta: { plan, max_pages: maxPages },
    });

    // Run the crawl
    const crawlStart = Date.now();
    const result = await crawlAndScan(normalizedUrl, maxPages, deadlineMs);
    const crawlDurationMs = Date.now() - crawlStart;

    // Persist a crawl-batch summary row first so we have an id to link
    // each per-page scan_logs row to. If this fails, per-page scans still
    // get logged — they just won't be grouped.
    const successfulPages = result.pageResults.filter((p) => !p.error);
    const totalViolations = successfulPages.reduce(
      (sum, p) => sum + (p.violations?.length ?? 0),
      0
    );

    const crawlBatchId = await createCrawlBatch({
      userId: appUser.id,
      rootUrl: normalizedUrl,
      pagesScanned: successfulPages.length,
      aggregateScore: result.aggregateScore ?? null,
      totalViolations,
      durationMs: crawlDurationMs,
      status: "completed",
    });

    // Log each page result to the database, linked to the batch
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
          pageResult.incomplete ?? undefined,
          crawlBatchId
        );
      } catch (err) {
        console.error(`Failed to log crawl scan for ${pageResult.url}:`, err);
      }
    }

    void logEvent({
      kind: "crawl_completed",
      userId: appUser.id,
      ip,
      url: normalizedUrl,
      meta: {
        crawl_batch_id: crawlBatchId,
        pages_scanned: successfulPages.length,
        aggregate_score: result.aggregateScore ?? null,
        total_violations: totalViolations,
        duration_ms: crawlDurationMs,
      },
    });

    return NextResponse.json({ ...result, crawlBatchId });
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Crawl failed");
    console.error("Crawl error:", error);

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
          "Full-site crawl failed. The site may be blocking automated access or taking too long to load.",
      },
      { status: 500 }
    );
  }
}
