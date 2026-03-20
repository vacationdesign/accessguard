import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabase";

/**
 * PUT /api/account/brand
 * Update the user's white-label brand name (Agency plan only).
 */
export async function PUT(request: NextRequest) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.plan !== "agency") {
    return NextResponse.json(
      { error: "White-label branding is available on the Agency plan." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const brandName = typeof body.brandName === "string"
    ? body.brandName.trim().substring(0, 100)
    : null;

  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("users")
    .update({
      brand_name: brandName || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Failed to update brand name:", error.message);
    return NextResponse.json(
      { error: "Failed to update brand name." },
      { status: 500 }
    );
  }

  return NextResponse.json({ brandName: brandName || null });
}
