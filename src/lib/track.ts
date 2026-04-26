/**
 * Client-side event tracker. Sends a fire-and-forget beacon to /api/events
 * for funnel measurement. Allowed event kinds are enforced server-side.
 *
 * Usage:
 *   import { track } from "@/lib/track";
 *   track("signup_clicked", { from: "scan_result_card" });
 *
 * Failures are silent — telemetry must never break the user experience.
 */
export type ClientEventKind =
  | "signup_clicked"
  | "checkout_clicked"
  | "email_report_opened";

export function track(
  kind: ClientEventKind,
  meta: Record<string, unknown> = {}
): void {
  // Bail in non-browser contexts (SSR, build-time)
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    kind,
    url: window.location.pathname,
    meta,
  });

  try {
    // Prefer sendBeacon when available — survives navigation away from page
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/events", blob);
      return;
    }
    // Fallback: regular fetch
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // swallow — telemetry must never raise to the user
  }
}
