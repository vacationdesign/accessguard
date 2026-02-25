import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { scanUrl } from "@/lib/scanner";
import { logScan } from "@/lib/db";
import { sendWeeklySummaryEmail } from "@/lib/email";

// Allow up to 5 minutes for batch scanning
export const maxDuration = 300;

/**
 * GET /api/cron/weekly-scan
 * Triggered by Vercel Cron every Monday at 9:00 UTC.
 *
 * For each paid user with registered sites:
 * 1. Scans all their sites
 * 2. Logs the results
 * 3. Sends a weekly summary email
 */
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized triggers
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseClient();

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

    let totalScans = 0;
    let totalErrors = 0;

    for (const user of users) {
      // Get user's registered sites
      const { data: sites, error: sitesError } = await supabase
        .from("sites")
        .select("id, url, name, last_scan_score")
        .eq("user_id", user.id);

      if (sitesError || !sites || sites.length === 0) continue;

      const siteSummaries: {
        siteName: string;
        url: string;
        score: number | null;
        violationsCount: number;
        previousScore: number | null;
      }[] = [];

      // Scan each site sequentially (to avoid overloading the scanner)
      for (const site of sites) {
        try {
          const result = await scanUrl(site.url);

          // Log the scan
          await logScan(
            user.id,
            site.url,
            "cron",
            result.score ?? 0,
            result.violations?.length ?? 0,
            0, // no duration tracking for cron
            result.violations ?? undefined,
            result.passes ?? undefined,
            result.incomplete ?? undefined
          );

          siteSummaries.push({
            siteName: site.name || new URL(site.url).hostname,
            url: site.url,
            score: result.score,
            violationsCount: result.violations?.length ?? 0,
            previousScore: site.last_scan_score,
          });

          totalScans++;
        } catch (scanError: any) {
          console.error(
            `Cron scan failed for ${site.url}:`,
            scanError.message
          );

          siteSummaries.push({
            siteName: site.name || new URL(site.url).hostname,
            url: site.url,
            score: null,
            violationsCount: 0,
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
      message: "Weekly scan complete",
      users: users.length,
      scanned: totalScans,
      errors: totalErrors,
    });
  } catch (error: any) {
    console.error("Weekly cron error:", error);
    return NextResponse.json(
      { error: "Weekly scan failed", details: error.message },
      { status: 500 }
    );
  }
}
