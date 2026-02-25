import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserScanHistory } from "@/lib/db";

/**
 * GET /api/scan/history?limit=3
 * Returns recent scan history for the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") || "3"), 20);

    const { scans } = await getUserScanHistory(user.id, { limit });

    return NextResponse.json({ scans });
  } catch (error: unknown) {
    console.error("Scan history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scan history." },
      { status: 500 }
    );
  }
}
