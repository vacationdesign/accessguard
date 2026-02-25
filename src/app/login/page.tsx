"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        throw authError;
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between w-full">
        <a href="/" className="flex items-center gap-2">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          <span className="text-xl font-bold text-foreground">
            AccessGuard
          </span>
        </a>
      </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-md">
          {sent ? (
            /* Success State */
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Check Your Email
              </h2>
              <p className="text-muted">
                We sent a sign-in link to{" "}
                <span className="font-semibold text-foreground">{email}</span>.
                <br />
                Click the link in your email to access your dashboard.
              </p>
              <p className="text-sm text-muted">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setSent(false);
                    setError(null);
                  }}
                  className="text-primary hover:text-primary-dark font-medium underline cursor-pointer"
                >
                  try again
                </button>
                .
              </p>
            </div>
          ) : (
            /* Login Form */
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Sign in to AccessGuard
                </h1>
                <p className="text-muted">
                  Enter your email to receive a secure sign-in link.
                  <br />
                  No password needed.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    autoFocus
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-danger text-sm px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full bg-primary text-white font-semibold px-5 py-3 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending link...
                    </>
                  ) : (
                    "Send Sign-in Link"
                  )}
                </button>
              </form>

              <div className="text-center">
                <p className="text-xs text-muted">
                  By signing in, you agree to our{" "}
                  <a
                    href="/tokushoho"
                    className="text-primary hover:text-primary-dark underline"
                  >
                    Terms of Service
                  </a>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Back to home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              &larr; Back to AccessGuard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
