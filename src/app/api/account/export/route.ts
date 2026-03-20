import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = getSupabaseClient();

    // Get user record with subscriptions
    const { data: user } = await adminClient
      .from("users")
      .select("id, email, plan, created_at, updated_at, subscriptions(id, plan, status, current_period_start, current_period_end, trial_start, trial_end, cancel_at, canceled_at, created_at)")
      .eq("auth_id", authUser.id)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get scan history (without IP addresses for privacy)
    const { data: scans } = await adminClient
      .from("scan_logs")
      .select("id, url, score, violations_count, scan_duration_ms, passes, incomplete, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Get registered sites
    const { data: sites } = await adminClient
      .from("sites")
      .select("id, url, name, last_scan_score, last_scanned_at, created_at")
      .eq("user_id", user.id);

    const exportData = {
      exported_at: new Date().toISOString(),
      account: {
        email: user.email,
        plan: user.plan,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      subscriptions: user.subscriptions || [],
      sites: sites || [],
      scans: scans || [],
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="a11yscope-data-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error: any) {
    console.error("Data export error:", error);
    return NextResponse.json(
      { error: "Failed to export data. Please try again." },
      { status: 500 }
    );
  }
}
