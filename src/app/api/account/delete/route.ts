import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSupabaseClient } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = getSupabaseClient();

    // Get user record
    const { data: user } = await adminClient
      .from("users")
      .select("*, subscriptions(*)")
      .eq("auth_id", authUser.id)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cancel active Stripe subscriptions
    if (user.subscriptions && user.subscriptions.length > 0) {
      for (const sub of user.subscriptions) {
        if (sub.status === "active" || sub.status === "trialing") {
          try {
            await stripe.subscriptions.cancel(sub.stripe_subscription_id);
          } catch {
            // Subscription may already be cancelled in Stripe
          }
        }
      }
    }

    // Delete scan logs
    await adminClient.from("scan_logs").delete().eq("user_id", user.id);

    // Delete sites
    await adminClient.from("sites").delete().eq("user_id", user.id);

    // Delete subscriptions
    await adminClient.from("subscriptions").delete().eq("user_id", user.id);

    // Delete user record
    await adminClient.from("users").delete().eq("id", user.id);

    // Delete Supabase Auth user
    await adminClient.auth.admin.deleteUser(authUser.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please contact support." },
      { status: 500 }
    );
  }
}
