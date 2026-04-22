import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import {
  sendOnboardingDay1Email,
  sendOnboardingDay3Email,
} from "@/lib/email";

export const maxDuration = 60;

/**
 * GET /api/cron/onboarding-drip
 *
 * Triggered daily by Vercel Cron. Finds users whose signup age matches each
 * drip step and who haven't already received that step's email, then sends
 * and marks them.
 *
 * Dedupe: a per-step `onboarding_dayN_sent_at` column is set after each
 * successful send. The query excludes anyone already marked, so retries,
 * overlapping runs, and cron jitter all become no-ops.
 *
 * Lookback: we only look back 14 days, so users who signed up during a
 * Vercel cron outage longer than that miss the email (acceptable).
 *
 * Plan targeting: Pro and Agency subscribers skip these emails entirely.
 * Welcome + weekly summary cover them; the drip is aimed at Free users
 * who need a nudge to register a site or try Pro.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const lookbackStart = new Date(now - 14 * day).toISOString();

  type Step = "day1" | "day3";
  const steps: Array<{
    step: Step;
    column: "onboarding_day1_sent_at" | "onboarding_day3_sent_at";
    ageCutoffIso: string; // users created BEFORE this timestamp qualify
  }> = [
    {
      step: "day1",
      column: "onboarding_day1_sent_at",
      ageCutoffIso: new Date(now - 1 * day).toISOString(),
    },
    {
      step: "day3",
      column: "onboarding_day3_sent_at",
      ageCutoffIso: new Date(now - 3 * day).toISOString(),
    },
  ];

  const results: Record<string, { matched: number; sent: number }> = {};

  for (const { step, column, ageCutoffIso } of steps) {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, plan")
      .gte("created_at", lookbackStart)
      .lte("created_at", ageCutoffIso)
      .is(column, null);

    if (error) {
      console.error(`Drip ${step} query failed:`, error.message);
      results[step] = { matched: 0, sent: 0 };
      continue;
    }

    const matched = users?.length ?? 0;
    let sent = 0;

    for (const user of users ?? []) {
      // Skip admin test account — we don't want to email ourselves every
      // time we test the drip pipeline
      if (user.email === process.env.ADMIN_EMAIL) continue;

      // Plan targeting: the drip is for Free users. Pro/Agency subscribers
      // already received the Welcome email with relevant messaging and get
      // the Monday weekly summary.
      if (user.plan !== "free") continue;

      try {
        if (step === "day1") {
          await sendOnboardingDay1Email({ to: user.email });
        } else {
          await sendOnboardingDay3Email({ to: user.email });
        }

        // Mark as sent AFTER successful send. A failed send leaves the row
        // un-marked so the next cron run tries again. The email functions
        // themselves catch Resend errors non-blockingly, so "success" here
        // means the HTTP call was accepted — not that the email landed.
        const { error: markErr } = await supabase
          .from("users")
          .update({ [column]: new Date().toISOString() })
          .eq("id", user.id);
        if (markErr) {
          console.error(
            `Drip ${step} mark-sent failed for ${user.email}:`,
            markErr.message
          );
        }

        sent++;
      } catch (err) {
        console.error(`Drip ${step} send failed for ${user.email}:`, err);
      }
    }

    results[step] = { matched, sent };
  }

  return NextResponse.json({ ok: true, results });
}
