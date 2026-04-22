import { getSupabaseClient } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  plan: "free" | "pro" | "agency";
  auth_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  status: string;
  plan: "pro" | "agency";
  current_period_start: string | null;
  current_period_end: string | null;
  trial_start: string | null;
  trial_end: string | null;
  cancel_at: string | null;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScanLog {
  id: string;
  user_id: string | null;
  ip_address: string;
  url: string;
  score: number | null;
  violations_count: number;
  scan_duration_ms: number | null;
  violations: unknown[] | null;
  passes: number | null;
  incomplete: number | null;
  site_id: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// User helpers
// ---------------------------------------------------------------------------

/**
 * Find an existing user by email, or create a new one.
 * Optionally attach a Stripe customer ID on creation / update.
 */
export async function getOrCreateUser(
  email: string,
  stripeCustomerId?: string
): Promise<User> {
  const supabase = getSupabaseClient();

  // Try to find an existing user by email
  const { data: existing, error: findError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (findError && findError.code !== "PGRST116") {
    // PGRST116 = "no rows returned" which is expected when user doesn't exist
    throw new Error(`Error finding user: ${findError.message}`);
  }

  if (existing) {
    // If we have a new Stripe customer ID and the user doesn't have one yet, update it
    if (stripeCustomerId && existing.stripe_customer_id !== stripeCustomerId) {
      const { data: updated, error: updateError } = await supabase
        .from("users")
        .update({
          stripe_customer_id: stripeCustomerId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select("*")
        .single();

      if (updateError) {
        throw new Error(`Error updating user: ${updateError.message}`);
      }

      return updated as User;
    }

    return existing as User;
  }

  // Create a new user
  const { data: newUser, error: createError } = await supabase
    .from("users")
    .insert({
      email,
      stripe_customer_id: stripeCustomerId || null,
      plan: "free",
    })
    .select("*")
    .single();

  if (createError) {
    throw new Error(`Error creating user: ${createError.message}`);
  }

  return newUser as User;
}

/**
 * Find a user by their Stripe customer ID.
 */
export async function getUserByStripeCustomerId(
  customerId: string
): Promise<User | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("stripe_customer_id", customerId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(
      `Error finding user by Stripe customer ID: ${error.message}`
    );
  }

  return (data as User) || null;
}

/**
 * Find a user by their email address.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error finding user by email: ${error.message}`);
  }

  return (data as User) || null;
}

// ---------------------------------------------------------------------------
// Subscription helpers
// ---------------------------------------------------------------------------

/**
 * Check if a user (by email) has ever had a subscription (active, canceled, etc.).
 * Used to prevent trial abuse on re-subscription.
 */
export async function hasSubscriptionHistory(
  email: string
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (!user) return false;

  const { count, error } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error checking subscription history:", error.message);
    return false;
  }

  return (count ?? 0) > 0;
}

/**
 * Create a new subscription record and update the user's plan.
 */
export async function createSubscription(
  userId: string,
  data: {
    stripeSubscriptionId: string;
    status: string;
    plan: "pro" | "agency";
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    trialStart?: Date;
    trialEnd?: Date;
  }
): Promise<Subscription> {
  const supabase = getSupabaseClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      stripe_subscription_id: data.stripeSubscriptionId,
      status: data.status,
      plan: data.plan,
      current_period_start: data.currentPeriodStart?.toISOString() || null,
      current_period_end: data.currentPeriodEnd?.toISOString() || null,
      trial_start: data.trialStart?.toISOString() || null,
      trial_end: data.trialEnd?.toISOString() || null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Error creating subscription: ${error.message}`);
  }

  // Update the user's plan
  const { error: userUpdateError } = await supabase
    .from("users")
    .update({ plan: data.plan, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (userUpdateError) {
    throw new Error(
      `Error updating user plan: ${userUpdateError.message}`
    );
  }

  return subscription as Subscription;
}

/**
 * Update an existing subscription by its Stripe subscription ID.
 */
export async function updateSubscription(
  stripeSubscriptionId: string,
  data: {
    status?: string;
    plan?: "pro" | "agency";
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    trialStart?: Date;
    trialEnd?: Date;
    cancelAt?: Date | null;
    canceledAt?: Date | null;
  }
): Promise<Subscription> {
  const supabase = getSupabaseClient();

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (data.status !== undefined) updatePayload.status = data.status;
  if (data.plan !== undefined) updatePayload.plan = data.plan;
  if (data.currentPeriodStart !== undefined)
    updatePayload.current_period_start =
      data.currentPeriodStart.toISOString();
  if (data.currentPeriodEnd !== undefined)
    updatePayload.current_period_end = data.currentPeriodEnd.toISOString();
  if (data.trialStart !== undefined)
    updatePayload.trial_start = data.trialStart.toISOString();
  if (data.trialEnd !== undefined)
    updatePayload.trial_end = data.trialEnd.toISOString();
  if (data.cancelAt !== undefined)
    updatePayload.cancel_at = data.cancelAt?.toISOString() || null;
  if (data.canceledAt !== undefined)
    updatePayload.canceled_at = data.canceledAt?.toISOString() || null;

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .update(updatePayload)
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Error updating subscription: ${error.message}`);
  }

  // If plan changed, update user record too
  if (data.plan) {
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({ plan: data.plan, updated_at: new Date().toISOString() })
      .eq("id", subscription.user_id);

    if (userUpdateError) {
      console.error("Error updating user plan:", userUpdateError.message);
    }
  }

  return subscription as Subscription;
}

/**
 * Get a user's active subscription (status = active or trialing).
 */
export async function getActiveSubscription(
  userId: string
): Promise<Subscription | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error fetching active subscription: ${error.message}`);
  }

  return (data as Subscription) || null;
}

// ---------------------------------------------------------------------------
// Scan log helpers
// ---------------------------------------------------------------------------

/**
 * Log a completed scan for analytics, rate-limiting, and history.
 */
export async function logScan(
  userId: string | null,
  url: string,
  ip: string,
  score: number,
  violationsCount: number,
  scanDurationMs?: number,
  violations?: unknown[],
  passes?: number,
  incomplete?: number
): Promise<void> {
  const supabase = getSupabaseClient();

  // Try to match URL to a registered site
  let siteId: string | null = null;
  if (userId) {
    const { data: site } = await supabase
      .from("sites")
      .select("id")
      .eq("user_id", userId)
      .eq("url", url)
      .single();

    siteId = site?.id ?? null;

    // Update site's last scan info
    if (siteId) {
      await supabase
        .from("sites")
        .update({
          last_scan_score: score,
          last_scan_at: new Date().toISOString(),
        })
        .eq("id", siteId);
    }
  }

  const { error } = await supabase.from("scan_logs").insert({
    user_id: userId || null,
    ip_address: ip,
    url,
    score,
    violations_count: violationsCount,
    scan_duration_ms: scanDurationMs || null,
    violations: violations ?? null,
    passes: passes ?? null,
    incomplete: incomplete ?? null,
    site_id: siteId,
  });

  if (error) {
    // Log but don't throw -- scan logging should not break the scan response
    console.error("Error logging scan:", error.message);
  }
}

/**
 * Count how many times an IP address has scanned URLs containing a given
 * domain in the last 30 days.  Used to show a "repeated scan" nudge.
 */
export async function getDomainScanCount(
  ip: string,
  domain: string
): Promise<number> {
  const supabase = getSupabaseClient();

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("scan_logs")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .ilike("url", `%${domain}%`)
    .gte("created_at", since);

  if (error) {
    console.error("Error counting domain scans:", error.message);
    return 0;
  }

  return count ?? 0;
}

/**
 * Count how many scans an IP address has made in the last `hours` hours.
 */
export async function getRecentScanCount(
  ip: string,
  hours: number
): Promise<number> {
  const supabase = getSupabaseClient();

  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("scan_logs")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", since);

  if (error) {
    console.error("Error counting recent scans:", error.message);
    // Fail closed -- if we can't check rate limits, assume limit is reached
    // This prevents abuse if the database is temporarily unreachable
    return Infinity;
  }

  return count ?? 0;
}

/**
 * Count scans a specific user (not IP) has made in the last N hours.
 */
export async function getUserScanCount(
  userId: string,
  hours: number
): Promise<number> {
  const supabase = getSupabaseClient();
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("scan_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);

  if (error) {
    console.error("Error counting user scans:", error.message);
    return Infinity;
  }
  return count ?? 0;
}

/**
 * Result of a scan authorization check.  `allowed === false` means block.
 * `reason` describes which limit was hit, so the client can show the right
 * CTA (free signup vs Pro upgrade).
 */
export type ScanAuthResult =
  | { allowed: true }
  | { allowed: false; reason: "anonymous_hourly" | "free_monthly" };

/** Anonymous visitors: 5 scans/hour per IP. */
const ANON_HOURLY_LIMIT = 5;
/** Signed-in Free users: 50 scans/month per account. */
const FREE_MONTHLY_LIMIT = 50;
const MONTH_HOURS = 30 * 24;

/**
 * Determine whether a user (identified by IP and optionally user ID) is
 * allowed to perform a scan.
 *
 * - Paid users (pro/agency): unlimited
 * - Signed-in Free users: 50 scans per 30 days per account (higher than
 *   the anonymous limit so a free account has a concrete benefit over
 *   the no-signup experience)
 * - Anonymous: 5 scans per hour per IP
 */
export async function canUserScanDetailed(
  ip: string,
  userId: string | null
): Promise<ScanAuthResult> {
  // Signed-in user: look up plan first
  if (userId) {
    const supabase = getSupabaseClient();
    const { data: user } = await supabase
      .from("users")
      .select("plan")
      .eq("id", userId)
      .single();

    if (user && (user.plan === "pro" || user.plan === "agency")) {
      return { allowed: true };
    }

    // Signed-in Free user: monthly per-account limit
    const monthCount = await getUserScanCount(userId, MONTH_HOURS);
    if (monthCount < FREE_MONTHLY_LIMIT) return { allowed: true };
    return { allowed: false, reason: "free_monthly" };
  }

  // Anonymous: hourly per-IP limit
  const recentCount = await getRecentScanCount(ip, 1);
  if (recentCount < ANON_HOURLY_LIMIT) return { allowed: true };
  return { allowed: false, reason: "anonymous_hourly" };
}

/**
 * Legacy boolean wrapper — kept so existing callers (weekly-scan cron, etc.)
 * don't need to change. New callers should use `canUserScanDetailed`.
 */
export async function canUserScan(
  ip: string,
  userId: string | null
): Promise<boolean> {
  const res = await canUserScanDetailed(ip, userId);
  return res.allowed;
}

// ---------------------------------------------------------------------------
// Email event helpers
// ---------------------------------------------------------------------------

/**
 * Log an outbound transactional email so we can rate-limit future sends
 * from the same IP or to the same recipient. Failures are logged but never
 * thrown — email sending should not be blocked by an audit write error.
 */
export async function logEmailEvent(
  kind: string,
  recipient: string,
  ip: string | null
): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("email_events").insert({
    kind,
    recipient,
    ip_address: ip,
  });
  if (error) {
    console.error("Failed to log email_event:", error.message);
  }
}

/**
 * How many email events the given IP has triggered in the last `hours` hours.
 * Used to cap the "email this report" endpoint.
 */
export async function getEmailEventCountByIp(
  ip: string,
  hours: number,
  kind?: string
): Promise<number> {
  const supabase = getSupabaseClient();
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  let query = supabase
    .from("email_events")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", since);
  if (kind) query = query.eq("kind", kind);
  const { count, error } = await query;
  if (error) {
    console.error("Failed to count email_events by ip:", error.message);
    // Fail closed — treat as over the limit
    return Infinity;
  }
  return count ?? 0;
}

/**
 * How many email events have targeted the given recipient in the last
 * `hours` hours. Prevents rotating-IP attackers from bombing a single
 * victim's inbox.
 */
export async function getEmailEventCountByRecipient(
  recipient: string,
  hours: number,
  kind?: string
): Promise<number> {
  const supabase = getSupabaseClient();
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  let query = supabase
    .from("email_events")
    .select("*", { count: "exact", head: true })
    .eq("recipient", recipient)
    .gte("created_at", since);
  if (kind) query = query.eq("kind", kind);
  const { count, error } = await query;
  if (error) {
    console.error("Failed to count email_events by recipient:", error.message);
    return Infinity;
  }
  return count ?? 0;
}

// ---------------------------------------------------------------------------
// Site helpers
// ---------------------------------------------------------------------------

export interface Site {
  id: string;
  user_id: string;
  url: string;
  name: string | null;
  last_scan_score: number | null;
  last_scan_at: string | null;
  created_at: string;
  updated_at: string;
}

const SITE_LIMITS: Record<string, number> = {
  free: 0,
  pro: 3,
  agency: 10,
};

/**
 * Get the maximum number of sites a user can register based on their plan.
 */
export function getSiteLimit(plan: string): number {
  return SITE_LIMITS[plan] ?? 0;
}

/**
 * Get all sites for a user.
 */
export async function getUserSites(userId: string): Promise<Site[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Error fetching sites: ${error.message}`);
  }

  return (data as Site[]) || [];
}

/**
 * Add a new site for a user. Enforces plan-based limits.
 */
export async function addSite(
  userId: string,
  plan: string,
  url: string,
  name?: string
): Promise<Site> {
  const supabase = getSupabaseClient();
  const limit = getSiteLimit(plan);

  // Check current count
  const { count, error: countError } = await supabase
    .from("sites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    throw new Error(`Error counting sites: ${countError.message}`);
  }

  if ((count ?? 0) >= limit) {
    if (limit === 0) {
      throw new Error(
        "Site monitoring is available on Pro and Agency plans. Upgrade to start registering sites."
      );
    }
    throw new Error(
      `Site limit reached. Your ${plan} plan allows up to ${limit} sites. Upgrade for more.`
    );
  }

  const { data, error } = await supabase
    .from("sites")
    .insert({
      user_id: userId,
      url,
      name: name || null,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("This URL is already registered.");
    }
    throw new Error(`Error adding site: ${error.message}`);
  }

  return data as Site;
}

/**
 * Remove a site by ID (must belong to user).
 */
export async function removeSite(
  siteId: string,
  userId: string
): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("sites")
    .delete()
    .eq("id", siteId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Error removing site: ${error.message}`);
  }
}

/**
 * Get scan history for a user, with optional site filter and pagination.
 */
export async function getUserScanHistory(
  userId: string,
  options: {
    siteId?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ scans: ScanLog[]; total: number }> {
  const supabase = getSupabaseClient();
  const { siteId, limit = 20, offset = 0 } = options;

  let query = supabase
    .from("scan_logs")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (siteId) {
    query = query.eq("site_id", siteId);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`Error fetching scan history: ${error.message}`);
  }

  return {
    scans: (data as ScanLog[]) || [],
    total: count ?? 0,
  };
}

/**
 * Get a single scan log by ID (must belong to user).
 */
export async function getScanById(
  scanId: string,
  userId: string
): Promise<ScanLog | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("scan_logs")
    .select("*")
    .eq("id", scanId)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error fetching scan: ${error.message}`);
  }

  return (data as ScanLog) || null;
}

/**
 * Get dashboard stats for a user.
 */
export async function getDashboardStats(userId: string): Promise<{
  sitesCount: number;
  scansThisMonth: number;
  averageScore: number | null;
}> {
  const supabase = getSupabaseClient();

  // Sites count
  const { count: sitesCount } = await supabase
    .from("sites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Scans this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: scansThisMonth } = await supabase
    .from("scan_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  // Average score from all scans this month
  const { data: scans } = await supabase
    .from("scan_logs")
    .select("score")
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString())
    .not("score", "is", null);

  let averageScore: number | null = null;
  if (scans && scans.length > 0) {
    const sum = scans.reduce((acc, s) => acc + (s.score || 0), 0);
    averageScore = Math.round(sum / scans.length);
  }

  return {
    sitesCount: sitesCount ?? 0,
    scansThisMonth: scansThisMonth ?? 0,
    averageScore,
  };
}
