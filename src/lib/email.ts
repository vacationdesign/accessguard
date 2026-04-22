import { Resend } from "resend";
import { PLANS, PlanKey } from "@/lib/stripe";

// ---------------------------------------------------------------------------
// Resend client (lazy init to avoid build-time errors when env var is missing)
// ---------------------------------------------------------------------------

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// Verified domain sender
const FROM_EMAIL = "A11yScope <noreply@a11yscope.com>";

// Admin notification recipient (forwards to owner's Gmail)
const ADMIN_EMAIL = "support@a11yscope.com";

// ---------------------------------------------------------------------------
// Welcome email
// ---------------------------------------------------------------------------

interface WelcomeEmailParams {
  to: string;
  plan: PlanKey;
  trialEndDate: Date | null;
}

export async function sendWelcomeEmail({
  to,
  plan,
  trialEndDate,
}: WelcomeEmailParams): Promise<void> {
  const planInfo = PLANS[plan];
  const trialEndStr = trialEndDate
    ? trialEndDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const subject = `Welcome to ${planInfo.name}!`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1e40af;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">
                Welcome to ${planInfo.name}!
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;color:#334155;font-size:16px;line-height:1.6;">
                Thank you for subscribing to <strong>${planInfo.name}</strong> ($${planInfo.price}/month).
              </p>

              ${
                trialEndStr
                  ? `<div style="background-color:#eff6ff;border-left:4px solid #3b82f6;padding:16px;border-radius:0 8px 8px 0;margin:0 0 24px;">
                <p style="margin:0;color:#1e40af;font-size:14px;">
                  <strong>Your 7-day free trial is active.</strong><br>
                  You won't be charged until <strong>${trialEndStr}</strong>.
                </p>
              </div>`
                  : ""
              }

              <!-- What's included -->
              <h2 style="margin:0 0 12px;color:#1e293b;font-size:18px;font-weight:600;">
                What&rsquo;s included in your plan
              </h2>

              <!-- 1. Unlimited scans -->
              <div style="margin:0 0 16px;padding:16px;background-color:#f8fafc;border-radius:8px;">
                <p style="margin:0 0 4px;color:#1e293b;font-size:15px;font-weight:600;">
                  Unlimited Accessibility Scans
                </p>
                <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
                  Run as many WCAG compliance scans as you need with no hourly limits.
                  Visit <a href="https://www.a11yscope.com" style="color:#2563eb;text-decoration:none;">www.a11yscope.com</a>, enter any URL, and get a detailed report in seconds.
                </p>
              </div>

              <!-- 2. Pro Dashboard -->
              <div style="margin:0 0 16px;padding:16px;background-color:#f8fafc;border-radius:8px;">
                <p style="margin:0 0 4px;color:#1e293b;font-size:15px;font-weight:600;">
                  Pro Dashboard
                </p>
                <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
                  Your dedicated dashboard to register the sites you want to monitor, review past scan results, and track accessibility trends over time.
                  You&rsquo;ll receive an email with your login link once your dashboard is ready.
                </p>
              </div>

              <!-- 3. Weekly monitoring -->
              <div style="margin:0 0 16px;padding:16px;background-color:#f8fafc;border-radius:8px;">
                <p style="margin:0 0 4px;color:#1e293b;font-size:15px;font-weight:600;">
                  Weekly Automated Monitoring
                </p>
                <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
                  Every week, A11yScope automatically scans your registered sites and sends you a summary report by email &mdash; so you can catch new issues before they become problems.
                </p>
              </div>

              <!-- 4. PDF reports -->
              <div style="margin:0 0 24px;padding:16px;background-color:#f8fafc;border-radius:8px;">
                <p style="margin:0 0 4px;color:#1e293b;font-size:15px;font-weight:600;">
                  PDF Compliance Reports
                </p>
                <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
                  Export any scan result as a branded PDF report you can share with your team, clients, or stakeholders to demonstrate compliance progress.
                </p>
              </div>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="https://www.a11yscope.com" style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">
                      Start Scanning Now
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;">

              <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
                Questions? Contact us anytime at
                <a href="mailto:support@a11yscope.com" style="color:#2563eb;text-decoration:none;">support@a11yscope.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                &copy; 2026 A11yScope. All rights reserved.<br>
                <a href="https://www.a11yscope.com" style="color:#94a3b8;text-decoration:none;">www.a11yscope.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Failed to send welcome email:", error);
      return;
    }

    console.log(`Welcome email sent for ${planInfo.name} plan`);
  } catch (err) {
    // Log but don't throw — email failures should not break the webhook
    console.error("Error sending welcome email:", err);
  }
}

// ---------------------------------------------------------------------------
// Weekly scan summary email
// ---------------------------------------------------------------------------

interface SiteScanSummary {
  siteName: string;
  url: string;
  score: number | null;
  violationsCount: number;
  pagesScanned?: number;
  previousScore: number | null;
}

interface WeeklySummaryParams {
  to: string;
  sites: SiteScanSummary[];
  scanDate: string;
}

export async function sendWeeklySummaryEmail({
  to,
  sites,
  scanDate,
}: WeeklySummaryParams): Promise<void> {
  const subject = `A11yScope Weekly Report — ${scanDate}`;

  const siteRows = sites
    .map((site) => {
      const scoreColor =
        site.score !== null && site.score >= 90
          ? "#16a34a"
          : site.score !== null && site.score >= 70
          ? "#d97706"
          : "#dc2626";
      const scoreText = site.score !== null ? `${site.score}%` : "Failed";
      const trend =
        site.previousScore !== null && site.score !== null
          ? site.score > site.previousScore
            ? `<span style="color:#16a34a;">+${site.score - site.previousScore}</span>`
            : site.score < site.previousScore
            ? `<span style="color:#dc2626;">${site.score - site.previousScore}</span>`
            : `<span style="color:#64748b;">—</span>`
          : "";

      const pagesText = site.pagesScanned && site.pagesScanned > 1
        ? `<br><span style="color:#64748b;font-size:11px;">${site.pagesScanned} pages scanned</span>`
        : "";

      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">
            <strong style="color:#1e293b;font-size:14px;">${site.siteName}</strong><br>
            <span style="color:#64748b;font-size:12px;">${site.url}</span>${pagesText}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;text-align:center;">
            <span style="color:${scoreColor};font-weight:700;font-size:18px;">${scoreText}</span>
            ${trend ? `<br><span style="font-size:12px;">${trend}</span>` : ""}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;text-align:center;color:#dc2626;font-weight:600;">
            ${site.violationsCount}
          </td>
        </tr>`;
    })
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:#1e40af;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Weekly Accessibility Report</h1>
              <p style="margin:8px 0 0;color:#93c5fd;font-size:14px;">${scanDate}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                <tr style="background-color:#f1f5f9;">
                  <th style="padding:10px 16px;text-align:left;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Site</th>
                  <th style="padding:10px 16px;text-align:center;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Score</th>
                  <th style="padding:10px 16px;text-align:center;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Violations</th>
                </tr>
                ${siteRows}
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td align="center">
                    <a href="https://www.a11yscope.com/login" style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:8px;">
                      View Full Reports
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0 16px;">
              <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
                You're receiving this because you have active site monitoring on A11yScope.<br>
                <a href="https://www.a11yscope.com/dashboard/settings" style="color:#94a3b8;">Manage settings</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Failed to send weekly summary email:", error);
      return;
    }

    console.log(`Weekly summary email sent to ${to}`);
  } catch (err) {
    console.error("Error sending weekly summary email:", err);
  }
}

// ---------------------------------------------------------------------------
// Admin notification emails (sent to owner)
// ---------------------------------------------------------------------------

interface AdminNotifyParams {
  event: "new_subscription" | "subscription_canceled" | "payment_failed" | "payment_succeeded";
  customerEmail: string;
  plan?: string;
  details?: string;
}

export async function sendAdminNotification({
  event,
  customerEmail,
  plan,
  details,
}: AdminNotifyParams): Promise<void> {
  const eventLabels: Record<AdminNotifyParams["event"], { emoji: string; subject: string; color: string }> = {
    new_subscription: {
      emoji: "🎉",
      subject: `New subscriber: ${plan ?? "Unknown"} plan`,
      color: "#16a34a",
    },
    subscription_canceled: {
      emoji: "⚠️",
      subject: "Subscription canceled",
      color: "#dc2626",
    },
    payment_failed: {
      emoji: "🚨",
      subject: "Payment failed",
      color: "#dc2626",
    },
    payment_succeeded: {
      emoji: "💰",
      subject: "Payment received",
      color: "#2563eb",
    },
  };

  const { emoji, subject, color } = eventLabels[event];
  const timestamp = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:${color};padding:20px 28px;">
              <h2 style="margin:0;color:#fff;font-size:18px;">${emoji} ${subject}</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;color:#64748b;font-size:13px;width:100px;">Customer</td>
                  <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${customerEmail}</td>
                </tr>
                ${plan ? `<tr>
                  <td style="padding:6px 0;color:#64748b;font-size:13px;">Plan</td>
                  <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${plan}</td>
                </tr>` : ""}
                ${details ? `<tr>
                  <td style="padding:6px 0;color:#64748b;font-size:13px;">Details</td>
                  <td style="padding:6px 0;color:#0f172a;font-size:14px;">${details}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding:6px 0;color:#64748b;font-size:13px;">Time</td>
                  <td style="padding:6px 0;color:#0f172a;font-size:14px;">${timestamp}</td>
                </tr>
              </table>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0 16px;">
              <p style="margin:0;text-align:center;">
                <a href="https://dashboard.stripe.com" style="color:#2563eb;font-size:13px;text-decoration:none;">Open Stripe Dashboard →</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[A11yScope] ${emoji} ${subject}`,
      html,
    });

    if (error) {
      console.error("Failed to send admin notification:", error);
      return;
    }

    console.log(`Admin notification sent: ${event}`);
  } catch (err) {
    // Non-blocking — admin notification failures should never break webhooks
    console.error("Error sending admin notification:", err);
  }
}

// ---------------------------------------------------------------------------
// Scan report email (user-requested "email this report to yourself")
// ---------------------------------------------------------------------------

interface ScanReportEmailParams {
  to: string;
  url: string;
  score: number;
  violationsCount: number;
  totalIssueNodes: number;
  topViolations: Array<{
    id: string;
    impact: string | null;
    help: string;
    description?: string;
    nodeCount: number;
  }>;
}

export async function sendScanReportEmail({
  to,
  url,
  score,
  violationsCount,
  totalIssueNodes,
  topViolations,
}: ScanReportEmailParams): Promise<void> {
  const subject = `Your A11yScope report for ${safeDomain(url)}`;

  const scoreColor =
    score >= 90 ? "#16a34a" : score >= 70 ? "#d97706" : "#dc2626";

  const violationRows = topViolations
    .map(
      (v) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
            <p style="margin:0 0 4px;color:#1e293b;font-size:14px;font-weight:600;">
              ${escapeHtml(v.help)}
            </p>
            <p style="margin:0;color:#64748b;font-size:13px;">
              ${escapeHtml(v.impact ?? "moderate")} &middot; ${v.nodeCount} element${v.nodeCount === 1 ? "" : "s"}
            </p>
          </td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:#1e40af;padding:24px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">A11yScope Report</h1>
              <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;word-break:break-all;">${escapeHtml(url)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;">
              <div style="display:inline-block;padding:12px 24px;border-radius:999px;background-color:${scoreColor}15;color:${scoreColor};font-size:28px;font-weight:700;">
                ${score}/100
              </div>
              <p style="margin:16px 0 0;color:#334155;font-size:15px;line-height:1.6;">
                We found <strong>${violationsCount}</strong> accessibility rule violation${violationsCount === 1 ? "" : "s"}
                across <strong>${totalIssueNodes}</strong> element${totalIssueNodes === 1 ? "" : "s"} on this page.
              </p>
              ${
                topViolations.length > 0
                  ? `<h2 style="margin:24px 0 8px;color:#1e293b;font-size:16px;font-weight:600;">Top issues to fix first</h2>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                    ${violationRows}
                  </table>`
                  : `<p style="margin:24px 0 0;color:#16a34a;font-size:14px;">&#127881; No critical issues detected on this page.</p>`
              }

              <div style="margin-top:32px;padding:16px;border-radius:8px;background-color:#eff6ff;border-left:4px solid #2563eb;">
                <p style="margin:0 0 8px;color:#1e40af;font-size:14px;font-weight:600;">
                  Want to scan your whole site, not just one page?
                </p>
                <p style="margin:0;color:#1e3a8a;font-size:13px;line-height:1.6;">
                  <a href="https://www.a11yscope.com/login" style="color:#2563eb;font-weight:600;text-decoration:none;">Create a free account</a>
                  to save scan history, or
                  <a href="https://www.a11yscope.com/#pricing" style="color:#2563eb;font-weight:600;text-decoration:none;">start a 7-day Pro trial</a>
                  for full-site crawling, weekly monitoring, and PDF reports.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;">
              You requested this report from
              <a href="https://www.a11yscope.com" style="color:#2563eb;">a11yscope.com</a>.
              This is a one-time email &mdash; we did not create an account for you.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    if (error) {
      console.error("Failed to send scan report email:", error);
      return;
    }
    console.log(`Scan report email sent to ${to}`);
  } catch (err) {
    console.error("Error sending scan report email:", err);
  }
}

// ---------------------------------------------------------------------------
// Onboarding drip emails (sent by daily cron)
// ---------------------------------------------------------------------------

interface OnboardingEmailParams {
  to: string;
}

/**
 * Day 1 after signup: guide the user to register their first site for
 * weekly monitoring — the most underused feature in the free + trial flow.
 */
export async function sendOnboardingDay1Email({
  to,
}: OnboardingEmailParams): Promise<void> {
  const subject = "Get the most out of A11yScope: register your first site";
  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color:#1e40af;padding:28px 36px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Register your first site</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px;">
            <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
              Thanks for joining A11yScope. The single biggest thing you can do today &mdash; free &mdash; is to register one site for continuous monitoring.
            </p>
            <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
              Once registered, A11yScope keeps an eye on it: you get a weekly score, a history of how it changes over time, and alerts when new issues appear. One scan tells you where you stand; a registered site tells you whether you're getting better or worse.
            </p>
            <div style="text-align:center;padding:20px 0;">
              <a href="https://www.a11yscope.com/dashboard/sites" style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:8px;">
                Register a site &rarr;
              </a>
            </div>
            <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
              Need ideas for what to fix first? Reply to this email with your URL and we'll point out the three highest-impact items.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  await safeSend({ to, subject, html, kind: "onboarding-day1" });
}

/**
 * Day 3: show what paid plans unlock, framed as value not sales.
 */
export async function sendOnboardingDay3Email({
  to,
}: OnboardingEmailParams): Promise<void> {
  const subject = "The 3 Pro features worth trying during your free trial";
  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="padding:28px 36px;">
            <h1 style="margin:0 0 12px;color:#1e293b;font-size:22px;font-weight:700;">Three things to try next</h1>
            <p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:1.6;">
              If you're evaluating whether A11yScope is worth paying for, here are the three things to test during a free 7-day Pro trial. They're the features free users consistently ask about.
            </p>

            <div style="margin:0 0 16px;padding:16px;background-color:#f1f5f9;border-radius:8px;">
              <p style="margin:0 0 4px;color:#1e293b;font-size:15px;font-weight:600;">1. Full-site crawl</p>
              <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
                One click, we scan up to 20 pages. Real sites have issues you won't find on the homepage alone.
              </p>
            </div>

            <div style="margin:0 0 16px;padding:16px;background-color:#f1f5f9;border-radius:8px;">
              <p style="margin:0 0 4px;color:#1e293b;font-size:15px;font-weight:600;">2. Weekly automated monitoring</p>
              <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
                Every Monday we re-scan your registered sites and email a summary. Regressions caught before they become tickets.
              </p>
            </div>

            <div style="margin:0 0 16px;padding:16px;background-color:#f1f5f9;border-radius:8px;">
              <p style="margin:0 0 4px;color:#1e293b;font-size:15px;font-weight:600;">3. PDF compliance reports</p>
              <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
                One-click PDF for stakeholders, clients, or a legal file &mdash; same data your team sees, formatted for external use.
              </p>
            </div>

            <div style="text-align:center;padding:16px 0 4px;">
              <a href="https://www.a11yscope.com/#pricing" style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:8px;">
                Start 7-Day Pro Trial
              </a>
            </div>
            <p style="margin:12px 0 0;color:#94a3b8;font-size:12px;text-align:center;">
              No charge for 7 days. Cancel anytime from your billing page.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  await safeSend({ to, subject, html, kind: "onboarding-day3" });
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function safeDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function safeSend({
  to,
  subject,
  html,
  kind,
}: {
  to: string;
  subject: string;
  html: string;
  kind: string;
}): Promise<void> {
  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    if (error) {
      console.error(`Failed to send ${kind} email:`, error);
      return;
    }
    console.log(`Sent ${kind} email to ${to}`);
  } catch (err) {
    console.error(`Error sending ${kind} email:`, err);
  }
}
