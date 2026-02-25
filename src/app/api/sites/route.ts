import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserSites, addSite, removeSite, getSiteLimit } from "@/lib/db";

/**
 * GET /api/sites — List authenticated user's sites
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sites = await getUserSites(user.id);
    const siteLimit = getSiteLimit(user.plan);
    return NextResponse.json({ sites, plan: user.plan, siteLimit });
  } catch (error: any) {
    console.error("Error fetching sites:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch sites" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sites — Add a new site
 * Body: { url: string, name?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url, name } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format. Include https://" },
        { status: 400 }
      );
    }

    const site = await addSite(user.id, user.plan, url, name);
    return NextResponse.json({ site }, { status: 201 });
  } catch (error: any) {
    // Handle plan limit or duplicate errors from addSite
    if (
      error.message?.includes("limit") ||
      error.message?.includes("already registered") ||
      error.message?.includes("Free plan")
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Error adding site:", error.message);
    return NextResponse.json(
      { error: "Failed to add site" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sites — Remove a site
 * Body: { siteId: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { siteId } = body;

    if (!siteId || typeof siteId !== "string") {
      return NextResponse.json(
        { error: "Site ID is required" },
        { status: 400 }
      );
    }

    await removeSite(siteId, user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error removing site:", error.message);
    return NextResponse.json(
      { error: "Failed to remove site" },
      { status: 500 }
    );
  }
}
