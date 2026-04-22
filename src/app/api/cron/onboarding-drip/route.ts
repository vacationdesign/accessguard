import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import {
  sendOnboardingDay1Email,
  sendOnboardingDay3Email,
} from "@/lib/email";

// Run under default serverless limits — this is a lightweight query + a
// handful of email sends, not a batch scan.
export const maxDuration = 60;

/**
 * GET /api/cron/onboarding-drip
 *
 * Triggered daily by Vercel Cron. Finds users who signed up in specific
 * windows and sends them onboarding emails:
 *
 *   Day 1 after signup → "register your first site"
 *   Day 3 after signup → "three Pro features worth trying"
 *
 * A user is considered in "Day N" if their `created_at` is between
 *   now - (N + 1) days  and  now - N days
 * (i.e. they signed up ~N days ago, +/- the cron cadence).
 *
 * This is intentionally simple: we re-query each day without tracking which
 * emails have been sent, because the signup-window query itself prevents
 * duplicates as long as the cron runs once per day. If the cron misfires,
 * a user might miss a drip email — acceptable for a best-effort nudge
 * system that doesn't need perfect delivery.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const windows: Array<{
    label: "day1" | "day3";
    startIso: string;
    endIso: string;
  }> = [
    {
      label: "day1",
      startIso: new Date(now - 2 * day).toISOString(),
      endIso: new Date(now - 1 * day).toISOString(),
    },
    {
      label: "day3",
      startIso: new Date(now - 4 * day).toISOString(),
      endIso: new Date(now - 3 * day).toISOString(),
    },
  ];

  const results: Record<string, { matched: number; sent: number }> = {};

  for (const w of windows) {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, plan")
      .gte("created_at", w.startIso)
      .lt("created_at", w.endIso);

    if (error) {
      console.error(`Drip ${w.label} query failed:`, error.message);
      results[w.label] = { matched: 0, sent: 0 };
      continue;
    }

    const matched = users?.length ?? 0;
    let sent = 0;

    for (const user of users ?? []) {
      // Skip admin test account — we don't want to email ourselves the
      // onboarding drip on every test run
      if (user.email === process.env.ADMIN_EMAIL) continue;

      try {
        if (w.label === "day1") {
          await sendOnboardingDay1Email({ to: user.email });
        } else if (w.label === "day3") {
          await sendOnboardingDay3Email({ to: user.email });
        }
        sent++;
      } catch (err) {
        console.error(`Drip ${w.label} send failed for ${user.email}:`, err);
      }
    }

    results[w.label] = { matched, sent };
  }

  return NextResponse.json({ ok: true, results });
}
