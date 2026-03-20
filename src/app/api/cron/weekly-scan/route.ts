import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { crawlAndScan } from "@/lib/scanner";
import { logScan } from "@/lib/db";
import { sendWeeklySummaryEmail } from "@/lib/email";

// Allow up to 5 minutes for batch scanning
export const maxDuration = 300;

/** Max pages per site crawl, by plan */
const CRAWL_LIMITS: Record<string, number> = {
  pro: 20,
  agency: 50,
};

/**
 * GET /api/cron/weekly-scan
 * Triggered by Vercel Cron every Monday at 9:00 UTC.
 *
 * For each paid user with registered sites:
 * 1. Crawls and scans each site (multiple pages)
 * 2. Logs the per-page results
 * 3. Updates the site's aggregate score
 * 4. Sends a weekly summary email
 */
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized triggers
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  const cronStart = Date.now();
  // Hard deadline: 280s from now (20s buffer before Vercel kills the function)
  const cronDeadline = cronStart + 280_000;

  try {
    // Get all paid users with registered sites
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, plan")
      .in("plan", ["pro", "agency"]);

    if (usersError) {
      throw new Error(`Error fetching users: ${usersError.message}`);
    }

    if (!users || users.length === 0) {
      return NextResponse.json({
        message: "No paid users to scan",
        scanned: 0,
      });
    }

    // Count total sites to budget time fairly
    const userSitesMap: Map<string, any[]> = new Map();
    let totalSiteCount = 0;
    for (const user of users) {
      const { data: sites } = await supabase
        .from("sites")
        .select("id, url, name, last_scan_score")
        .eq("user_id", user.id);
      if (sites && sites.length > 0) {
        userSitesMap.set(user.id, sites);
        totalSiteCount += sites.length;
      }
    }

    if (totalSiteCount === 0) {
      return NextResponse.json({
        message: "No registered sites to scan",
        scanned: 0,
      });
    }

    // Budget: divide remaining time evenly across all sites
    const remainingMs = cronDeadline - Date.now();
    const perSiteBudgetMs = Math.floor(remainingMs / totalSiteCount);

    let totalPagesScanned = 0;
    let totalErrors = 0;

    for (const user of users) {
      const sites = userSitesMap.get(user.id);
      if (!sites) continue;

      const maxPages = CRAWL_LIMITS[user.plan] ?? 5;

      const siteSummaries: {
        siteName: string;
        url: string;
        score: number | null;
        violationsCount: number;
        pagesScanned: number;
        previousScore: number | null;
      }[] = [];

      for (const site of sites) {
        // Check global deadline
        if (Date.now() > cronDeadline - 15_000) {
          console.log("Cron deadline approaching — stopping scan loop");
          break;
        }

        const siteDeadline = Math.min(
          Date.now() + perSiteBudgetMs,
          cronDeadline - 10_000
        );

        try {
          const crawlResult = await crawlAndScan(
            site.url,
            maxPages,
            siteDeadline
          );

          // Log each successfully scanned page
          for (const pageResult of crawlResult.pageResults) {
            if (pageResult.error) continue;
            try {
              await logScan(
                user.id,
                pageResult.url,
                "cron",
                pageResult.score ?? 0,
                pageResult.violations?.length ?? 0,
                pageResult.scanDuration ?? 0,
                pageResult.violations ?? undefined,
                pageResult.passes ?? undefined,
                pageResult.incomplete ?? undefined
              );
            } catch (logErr) {
              console.error(`Failed to log scan for ${pageResult.url}:`, logErr);
            }
          }

          // Update site's aggregate score
          await supabase
            .from("sites")
            .update({
              last_scan_score: crawlResult.aggregateScore,
              last_scan_at: new Date().toISOString(),
            })
            .eq("id", site.id);

          siteSummaries.push({
            siteName: site.name || new URL(site.url).hostname,
            url: site.url,
            score: crawlResult.aggregateScore,
            violationsCount: crawlResult.summary.totalViolations,
            pagesScanned: crawlResult.pagesScanned,
            previousScore: site.last_scan_score,
          });

          totalPagesScanned += crawlResult.pagesScanned;
        } catch (scanError: any) {
          console.error(
            `Cron crawl failed for ${site.url}:`,
            scanError.message
          );

          siteSummaries.push({
            siteName: site.name || new URL(site.url).hostname,
            url: site.url,
            score: null,
            violationsCount: 0,
            pagesScanned: 0,
            previousScore: site.last_scan_score,
          });

          totalErrors++;
        }
      }

      // Send weekly summary email
      if (siteSummaries.length > 0) {
        const scanDate = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        await sendWeeklySummaryEmail({
          to: user.email,
          sites: siteSummaries,
          scanDate,
        }).catch((err) => {
          console.error(
            `Failed to send summary to ${user.email}:`,
            err
          );
        });
      }
    }

    return NextResponse.json({
      message: "Weekly crawl scan complete",
      users: users.length,
      sites: totalSiteCount,
      pagesScanned: totalPagesScanned,
      errors: totalErrors,
      durationMs: Date.now() - cronStart,
    });
  } catch (error: any) {
    console.error("Weekly cron error:", error);
    return NextResponse.json(
      { error: "Weekly scan failed", details: error.message },
      { status: 500 }
    );
  }
}
