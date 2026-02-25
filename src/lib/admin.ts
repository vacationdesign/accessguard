import { getSupabaseClient } from "@/lib/supabase";
import { PLANS } from "@/lib/stripe";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AdminStats {
  totalUsers: number;
  paidUsers: number;
  trialUsers: number;
  totalScans: number;
  scansToday: number;
  scansThisWeek: number;
  scansThisMonth: number;
  averageScore: number | null;
  mrr: number;
}

export interface AdminUser {
  id: string;
  email: string;
  plan: "free" | "pro" | "agency";
  stripe_customer_id: string | null;
  auth_id: string | null;
  created_at: string;
  scan_count: number;
}

export interface RecentEvent {
  type: "signup" | "scan" | "subscription";
  description: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

/**
 * Check whether an email matches the configured admin email.
 */
export function isAdminEmail(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

// ---------------------------------------------------------------------------
// Admin queries
// ---------------------------------------------------------------------------

/**
 * Get high-level stats for the admin overview page.
 */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = getSupabaseClient();

  const now = new Date();

  // Start of today (UTC)
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  // Start of this week (Monday UTC)
  const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon, ...
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setUTCDate(startOfWeek.getUTCDate() - daysToMonday);

  // Start of this month
  const startOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  );

  // Run all queries in parallel
  const [
    usersResult,
    activeSubsResult,
    trialSubsResult,
    totalScansResult,
    scansTodayResult,
    scansWeekResult,
    scansMonthResult,
    scoresResult,
  ] = await Promise.all([
    // Total users
    supabase
      .from("users")
      .select("*", { count: "exact", head: true }),

    // Active subscriptions (for MRR + paid count)
    supabase
      .from("subscriptions")
      .select("plan")
      .eq("status", "active"),

    // Trialing subscriptions
    supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "trialing"),

    // Total scans
    supabase
      .from("scan_logs")
      .select("*", { count: "exact", head: true }),

    // Scans today
    supabase
      .from("scan_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfToday.toISOString()),

    // Scans this week
    supabase
      .from("scan_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfWeek.toISOString()),

    // Scans this month
    supabase
      .from("scan_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString()),

    // All scores (for average)
    supabase
      .from("scan_logs")
      .select("score")
      .not("score", "is", null),
  ]);

  // Calculate MRR from active subscriptions
  const activeSubs = activeSubsResult.data ?? [];
  const mrr = activeSubs.reduce((sum, sub) => {
    const planPrice =
      sub.plan === "agency" ? PLANS.agency.price : PLANS.pro.price;
    return sum + planPrice;
  }, 0);

  // Calculate average score
  let averageScore: number | null = null;
  const scores = scoresResult.data ?? [];
  if (scores.length > 0) {
    const sum = scores.reduce((acc, s) => acc + (s.score || 0), 0);
    averageScore = Math.round(sum / scores.length);
  }

  return {
    totalUsers: usersResult.count ?? 0,
    paidUsers: activeSubs.length,
    trialUsers: trialSubsResult.count ?? 0,
    totalScans: totalScansResult.count ?? 0,
    scansToday: scansTodayResult.count ?? 0,
    scansThisWeek: scansWeekResult.count ?? 0,
    scansThisMonth: scansMonthResult.count ?? 0,
    averageScore,
    mrr,
  };
}

/**
 * Get all users with their scan counts, paginated.
 */
export async function getAllUsers(options: {
  limit?: number;
  offset?: number;
} = {}): Promise<{ users: AdminUser[]; total: number }> {
  const supabase = getSupabaseClient();
  const { limit = 20, offset = 0 } = options;

  // Get paginated users
  const { data: users, count, error } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }

  // Get scan counts for these users
  const userList = (users ?? []) as AdminUser[];

  // Fetch scan count for each user (N+1, but fine for small user base)
  const enriched = await Promise.all(
    userList.map(async (user) => {
      const { count: scanCount } = await supabase
        .from("scan_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      return { ...user, scan_count: scanCount ?? 0 };
    })
  );

  return {
    users: enriched,
    total: count ?? 0,
  };
}

/**
 * Get recent activity (signups, scans, subscription changes) for the admin feed.
 */
export async function getRecentActivity(
  limit: number = 15
): Promise<RecentEvent[]> {
  const supabase = getSupabaseClient();

  // Fetch recent events from each table in parallel
  const [usersResult, scansResult, subsResult] = await Promise.all([
    // Recent signups
    supabase
      .from("users")
      .select("email, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),

    // Recent scans
    supabase
      .from("scan_logs")
      .select("url, score, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),

    // Recent subscriptions
    supabase
      .from("subscriptions")
      .select("plan, status, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  const events: RecentEvent[] = [];

  // Map signups
  for (const user of usersResult.data ?? []) {
    events.push({
      type: "signup",
      description: `${user.email} signed up`,
      timestamp: user.created_at,
    });
  }

  // Map scans
  for (const scan of scansResult.data ?? []) {
    const scoreText =
      scan.score !== null ? ` — scored ${scan.score}%` : "";
    events.push({
      type: "scan",
      description: `Scan: ${scan.url}${scoreText}`,
      timestamp: scan.created_at,
    });
  }

  // Map subscriptions
  for (const sub of subsResult.data ?? []) {
    const planLabel = sub.plan === "agency" ? "Agency" : "Pro";
    const statusLabel =
      sub.status === "trialing"
        ? "started trial"
        : sub.status === "active"
        ? "subscribed"
        : sub.status === "canceled"
        ? "canceled"
        : sub.status;
    events.push({
      type: "subscription",
      description: `${planLabel} plan: ${statusLabel}`,
      timestamp: sub.updated_at || sub.created_at,
    });
  }

  // Sort by timestamp descending and take the requested limit
  events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return events.slice(0, limit);
}
