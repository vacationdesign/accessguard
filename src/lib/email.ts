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
const FROM_EMAIL = "AccessGuard <noreply@accessguard.dev>";

// Admin notification recipient (forwards to owner's Gmail)
const ADMIN_EMAIL = "support@accessguard.dev";

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
                  <strong>Your 14-day free trial is active.</strong><br>
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
                  Visit <a href="https://www.accessguard.dev" style="color:#2563eb;text-decoration:none;">www.accessguard.dev</a>, enter any URL, and get a detailed report in seconds.
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
                  Every week, AccessGuard automatically scans your registered sites and sends you a summary report by email &mdash; so you can catch new issues before they become problems.
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
                    <a href="https://www.accessguard.dev" style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">
                      Start Scanning Now
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;">

              <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
                Questions? Contact us anytime at
                <a href="mailto:support@accessguard.dev" style="color:#2563eb;text-decoration:none;">support@accessguard.dev</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                &copy; 2026 AccessGuard. All rights reserved.<br>
                <a href="https://www.accessguard.dev" style="color:#94a3b8;text-decoration:none;">www.accessguard.dev</a>
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
      subject: `[AccessGuard] ${emoji} ${subject}`,
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
