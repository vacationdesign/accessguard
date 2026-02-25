import { createSupabaseServerClient } from "./supabase-server";
import { getSupabaseClient } from "./supabase";

export interface AppUser {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  plan: "free" | "pro" | "agency";
  auth_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppUserWithSubscription extends AppUser {
  subscriptions: {
    id: string;
    stripe_subscription_id: string;
    status: string;
    plan: "pro" | "agency";
    current_period_start: string | null;
    current_period_end: string | null;
    trial_start: string | null;
    trial_end: string | null;
    cancel_at: string | null;
    canceled_at: string | null;
  }[];
}

/**
 * Get the currently authenticated user's application record.
 * Returns null if not authenticated or user not found.
 */
export async function getCurrentUser(): Promise<AppUserWithSubscription | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Look up the application user record linked to this auth user
  const adminClient = getSupabaseClient();
  const { data, error } = await adminClient
    .from("users")
    .select("*, subscriptions(*)")
    .eq("auth_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching current user:", error.message);
    return null;
  }

  return (data as AppUserWithSubscription) || null;
}

/**
 * Link a Supabase Auth user to an existing application user record.
 * Called after first login — matches by email.
 * If no existing user found, creates a new free-tier user.
 */
export async function linkAuthToUser(
  authId: string,
  email: string
): Promise<AppUser | null> {
  const adminClient = getSupabaseClient();

  // Try to link to an existing user (created by Stripe webhook)
  const { data: linked, error: linkError } = await adminClient
    .from("users")
    .update({ auth_id: authId, updated_at: new Date().toISOString() })
    .eq("email", email.toLowerCase())
    .is("auth_id", null)
    .select("*")
    .single();

  if (linked) return linked as AppUser;

  // Check if already linked
  if (linkError && linkError.code === "PGRST116") {
    const { data: existing } = await adminClient
      .from("users")
      .select("*")
      .eq("auth_id", authId)
      .single();

    if (existing) return existing as AppUser;

    // Also check by email (might be linked with a different auth_id — edge case)
    const { data: byEmail } = await adminClient
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (byEmail) return byEmail as AppUser;
  }

  // No existing user at all — create a new free-tier user
  const { data: newUser, error: createError } = await adminClient
    .from("users")
    .insert({
      email: email.toLowerCase(),
      auth_id: authId,
      plan: "free",
    })
    .select("*")
    .single();

  if (createError) {
    console.error("Error creating user on first login:", createError.message);
    return null;
  }

  return newUser as AppUser;
}
