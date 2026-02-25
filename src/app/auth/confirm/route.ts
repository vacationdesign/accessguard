import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { type EmailOtpType } from "@supabase/supabase-js";
import { linkAuthToUser } from "@/lib/auth";

/**
 * Auth Confirm Route Handler
 *
 * Handles magic link verification using token_hash instead of ConfirmationURL.
 * This approach calls verifyOtp server-side, avoiding issues with:
 * - Email security scanners consuming tokens via GET to Supabase's /auth/v1/verify
 * - PKCE token prefix handling bugs in Supabase's verify endpoint
 *
 * Email template should use:
 *   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink">
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (tokenHash && type) {
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

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id && user?.email) {
        await linkAuthToUser(user.id, user.email);
      }

      return response;
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth", origin));
}
