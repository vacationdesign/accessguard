import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { linkAuthToUser } from "@/lib/auth";

/**
 * Auth Callback Route Handler
 *
 * When a user clicks the magic link in their email, Supabase redirects to
 * /auth/callback?code=<code>. This handler:
 * 1. Exchanges the code for a session
 * 2. Links the auth user to the application users table (or creates one)
 * 3. Redirects to /dashboard
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const response = NextResponse.redirect(new URL(next, origin));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Link auth user to application users table (or create new free user)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id && user?.email) {
        await linkAuthToUser(user.id, user.email);
      }

      return response;
    }
  }

  // If code is missing or exchange failed, redirect to login with error
  return NextResponse.redirect(new URL("/login?error=auth", origin));
}
