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

              <!-- What you can do now -->
              <h2 style="margin:0 0 12px;color:#1e293b;font-size:18px;font-weight:600;">
                What you can do right now
              </h2>
              <ul style="margin:0 0 24px;padding-left:20px;color:#475569;font-size:14px;line-height:1.8;">
                <li><strong>Unlimited accessibility scans</strong> &mdash; no hourly limits</li>
                <li>Scan any URL at <a href="https://www.accessguard.dev" style="color:#2563eb;text-decoration:none;">www.accessguard.dev</a></li>
              </ul>

              <!-- Coming soon -->
              <h2 style="margin:0 0 12px;color:#1e293b;font-size:18px;font-weight:600;">
                Coming soon
              </h2>
              <ul style="margin:0 0 24px;padding-left:20px;color:#475569;font-size:14px;line-height:1.8;">
                <li><strong>Pro Dashboard</strong> &mdash; manage monitored sites, view scan history and trends</li>
                <li><strong>Weekly monitoring</strong> &mdash; automated scans with email reports</li>
                <li><strong>PDF compliance reports</strong> &mdash; export and share with stakeholders</li>
              </ul>

              <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
                We'll notify you by email as these features become available. In the meantime, weekly scan reports will be delivered directly to this email address.
              </p>

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
                Questions? Reply to this email or contact us at
                <a href="mailto:g550139@gmail.com" style="color:#2563eb;text-decoration:none;">g550139@gmail.com</a>.
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

    console.log(`Welcome email sent to ${to} for ${planInfo.name}`);
  } catch (err) {
    // Log but don't throw — email failures should not break the webhook
    console.error("Error sending welcome email:", err);
  }
}
