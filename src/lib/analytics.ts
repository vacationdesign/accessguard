import { getSupabaseClient } from "@/lib/supabase";

/**
 * Funnel event names. Keep this list short and meaningful — every name we
 * add becomes a permanent telemetry contract for downstream queries.
 */
export type AnalyticsEventKind =
  | "scan_started"
  | "scan_completed"
  | "scan_rate_limited"
  | "email_report_opened"
  | "email_report_sent"
  | "signup_clicked"
  | "checkout_clicked"
  | "trial_started"
  | "subscription_canceled"
  | "crawl_started"
  | "crawl_completed";

interface LogEventParams {
  kind: AnalyticsEventKind;
  userId?: string | null;
  ip?: string | null;
  url?: string | null;
  meta?: Record<string, unknown> | null;
}

/**
 * Server-side recorder for funnel events. Failures are logged but never
 * thrown — telemetry must never break the user-facing request that fired
 * it. Callers should `void logEvent(...)` rather than awaiting it.
 */
export async function logEvent({
  kind,
  userId,
  ip,
  url,
  meta,
}: LogEventParams): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("analytics_events").insert({
      kind,
      user_id: userId ?? null,
      ip_address: ip ?? null,
      url: url ?? null,
      meta: meta ?? null,
    });
    if (error) {
      console.error(`analytics_events insert (${kind}) failed:`, error.message);
    }
  } catch (err) {
    console.error(`analytics_events insert (${kind}) threw:`, err);
  }
}

/** Helper for handlers that need to extract a request IP. */
export function ipFromRequest(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
