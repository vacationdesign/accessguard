import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { linkAuthToUser } from "@/lib/auth";

/**
 * Auth callback route — handles the redirect after a user clicks a magic link.
 * Exchanges the auth code for a session, links the auth user to the app user,
 * and redirects to the dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get the authenticated user and link to app user record
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        // Link auth user to existing app user (or create new)
        // This handles users who were created via Stripe webhook before first login
        await linkAuthToUser(user.id, user.email);
      }

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Auth failed — redirect to login with error
  return NextResponse.redirect(
    new URL("/login?error=auth_failed", request.url)
  );
}
