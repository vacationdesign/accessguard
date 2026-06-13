// ---------------------------------------------------------------------------
// Pure HTML/email-safety helpers (no external dependencies — safe to unit test
// in isolation, and safe to import from anywhere without env side effects).
// ---------------------------------------------------------------------------

/**
 * Extract a safe hostname from a URL for use in email subjects/bodies.
 * Strips any CR/LF so an attacker-controlled URL can never inject headers,
 * and falls back to a neutral label when the URL doesn't parse.
 */
export function safeDomain(url: string): string {
  try {
    const host = new URL(url).hostname;
    // Belt-and-braces: strip any CR/LF in case a weird URL shape survived
    // parsing. Email headers and CRLF must never mix.
    return host.replace(/[\r\n]/g, "");
  } catch {
    // Never return the raw, attacker-controlled string — it could contain
    // CRLF that would be injected into the email subject.
    return "your page";
  }
}

/** Escape the five HTML-significant characters for safe interpolation. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
