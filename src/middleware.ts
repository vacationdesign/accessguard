import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware — protects /dashboard/* routes, redirects auth flows.
 *
 * - /dashboard/*  → if not authenticated, redirect to /login
 * - /login        → if already authenticated, redirect to /dashboard
 * - All other routes (LP, blog, API, etc.) are unaffected.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  // Create Supabase client with cookie handling for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set cookies on the request (for downstream server components)
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          // Re-create response with updated request
          response = NextResponse.next({ request });
          // Set cookies on the response (for the browser)
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session (important for token rotation)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login
  if (pathname === "/login") {
    if (user) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/api/scan/:path*",
    "/api/sites/:path*",
    "/api/portal/:path*",
    "/api/auth/:path*",
  ],
};
