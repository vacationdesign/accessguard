import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import {
  sendTrialEndingT3Email,
  sendTrialEndingT1Email,
} from "@/lib/email";
import type { PlanKey } from "@/lib/stripe";

export const maxDuration = 60;

/**
 * GET /api/cron/trial-ending
 *
 * Triggered daily by Vercel Cron. Two steps:
 *   - T-3: subscriptions whose trial_end falls within (now, now+3d]
 *   - T-1: subscriptions whose trial_end falls within (now, now+1d]
 *
 * Both steps:
 *   - Restrict to status = 'trialing' (post-trial rows are skipped)
 *   - Dedupe via subscriptions.trial_ending_t{3,1}_sent_at
 *   - Adapt email copy to whether a payment method is on file: we use
 *     cancel_at as the proxy (Stripe sets cancel_at = trial_end when the
 *     checkout was payment_method_collection: "if_required" and no card
 *     was provided). cancel_at IS NULL after the user adds a card.
 *
 * Ordering: T-3 also requires t1_sent_at IS NULL so we never send "3 days
 * left" after "1 day left" was already delivered (e.g. after a long cron
 * outage).
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  const now = new Date();
  const day = 24 * 60 * 60 * 1000;
  const nowIso = now.toISOString();
  const in1dIso = new Date(now.getTime() + 1 * day).toISOString();
  const in3dIso = new Date(now.getTime() + 3 * day).toISOString();

  type SubRow = {
    id: string;
    user_id: string;
    plan: PlanKey;
    trial_end: string;
    cancel_at: string | null;
    canceled_at: string | null;
    users: { email: string } | { email: string }[] | null;
  };

  const fetchUserEmail = (row: SubRow): string | null => {
    if (!row.users) return null;
    if (Array.isArray(row.users)) return row.users[0]?.email ?? null;
    return row.users.email;
  };

  const results: Record<string, { matched: number; sent: number }> = {};

  // ---- T-1 first (so a row sent T-1 won't also receive T-3 below) ----
  {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("id, user_id, plan, trial_end, cancel_at, canceled_at, users(email)")
      .eq("status", "trialing")
      .gt("trial_end", nowIso)
      .lte("trial_end", in1dIso)
      .is("trial_ending_t1_sent_at", null);

    if (error) {
      console.error("trial-ending T-1 query failed:", error.message);
      results["t1"] = { matched: 0, sent: 0 };
    } else {
      const rows = (data ?? []) as unknown as SubRow[];
      let sent = 0;
      for (const row of rows) {
        const email = fetchUserEmail(row);
        if (!email) continue;
        const willAutoCancel = !!row.cancel_at && !row.canceled_at;
        try {
          const ok = await sendTrialEndingT1Email({
            to: email,
            plan: row.plan,
            trialEndDate: new Date(row.trial_end),
            willAutoCancel,
          });
          if (!ok) continue;
          const { error: markErr } = await supabase
            .from("subscriptions")
            .update({ trial_ending_t1_sent_at: new Date().toISOString() })
            .eq("id", row.id);
          if (markErr) {
            console.error(
              `trial-ending T-1 mark-sent failed for ${email}:`,
              markErr.message
            );
          }
          sent++;
        } catch (err) {
          console.error(`trial-ending T-1 send failed for ${email}:`, err);
        }
      }
      results["t1"] = { matched: rows.length, sent };
    }
  }

  // ---- T-3 ----
  {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("id, user_id, plan, trial_end, cancel_at, canceled_at, users(email)")
      .eq("status", "trialing")
      .gt("trial_end", in1dIso)
      .lte("trial_end", in3dIso)
      .is("trial_ending_t3_sent_at", null)
      .is("trial_ending_t1_sent_at", null);

    if (error) {
      console.error("trial-ending T-3 query failed:", error.message);
      results["t3"] = { matched: 0, sent: 0 };
    } else {
      const rows = (data ?? []) as unknown as SubRow[];
      let sent = 0;
      for (const row of rows) {
        const email = fetchUserEmail(row);
        if (!email) continue;
        const willAutoCancel = !!row.cancel_at && !row.canceled_at;
        try {
          const ok = await sendTrialEndingT3Email({
            to: email,
            plan: row.plan,
            trialEndDate: new Date(row.trial_end),
            willAutoCancel,
          });
          if (!ok) continue;
          const { error: markErr } = await supabase
            .from("subscriptions")
            .update({ trial_ending_t3_sent_at: new Date().toISOString() })
            .eq("id", row.id);
          if (markErr) {
            console.error(
              `trial-ending T-3 mark-sent failed for ${email}:`,
              markErr.message
            );
          }
          sent++;
        } catch (err) {
          console.error(`trial-ending T-3 send failed for ${email}:`, err);
        }
      }
      results["t3"] = { matched: rows.length, sent };
    }
  }

  return NextResponse.json({ ok: true, results });
}
