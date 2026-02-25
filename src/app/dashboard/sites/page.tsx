"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Site {
  id: string;
  url: string;
  name: string | null;
  last_scan_score: number | null;
  last_scan_at: string | null;
  created_at: string;
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>("free");
  const [siteLimit, setSiteLimit] = useState<number>(0);

  const fetchSites = useCallback(async () => {
    try {
      setFetchError(null);
      const res = await fetch("/api/sites");
      const data = await res.json();
      if (res.ok) {
        setSites(data.sites || []);
        if (data.plan) setPlan(data.plan);
        if (data.siteLimit !== undefined) setSiteLimit(data.siteLimit);
      } else {
        setFetchError(data.error || "Failed to load sites.");
      }
    } catch {
      setFetchError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError(null);

    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), name: name.trim() || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add site");
      }

      setUrl("");
      setName("");
      fetchSites();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (siteId: string) => {
    if (!confirm("Remove this site? Scan history will be preserved.")) return;

    setDeleting(siteId);
    try {
      const res = await fetch("/api/sites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId }),
      });

      if (res.ok) {
        setSites((prev) => prev.filter((s) => s.id !== siteId));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to remove site. Please try again.");
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setDeleting(null);
    }
  };

  const canAddSites = siteLimit > 0;
  const limitReached = sites.length >= siteLimit && siteLimit > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sites</h1>
        <p className="text-muted mt-1">
          Register websites to monitor for accessibility compliance.
        </p>
      </div>

      {/* Add Site Form or Upgrade CTA */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {!canAddSites ? (
          /* Free plan — show upgrade prompt */
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="font-semibold text-foreground mb-1">
              Site Monitoring — Pro Feature
            </h2>
            <p className="text-muted text-sm mb-4 max-w-md mx-auto">
              Register and monitor your websites for accessibility compliance
              over time. Upgrade to Pro to track up to 3 sites, or Agency for
              up to 10.
            </p>
            <Link
              href="/dashboard/billing"
              className="inline-block bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Upgrade Plan
            </Link>
          </div>
        ) : (
          /* Paid plan — show form */
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Add a Site</h2>
              <span className="text-xs text-muted">
                {sites.length} / {siteLimit} sites
              </span>
            </div>
            {limitReached ? (
              <div className="text-center py-4">
                <p className="text-muted text-sm mb-3">
                  You&apos;ve reached the {siteLimit}-site limit on your{" "}
                  <span className="capitalize">{plan}</span> plan.
                </p>
                <Link
                  href="/dashboard/billing"
                  className="text-primary hover:text-primary-dark text-sm font-medium"
                >
                  Upgrade for more sites →
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleAdd}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Site name (optional)"
                  className="sm:w-48 px-4 py-2.5 border border-gray-200 rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={adding || !url.trim()}
                  className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {adding ? "Adding..." : "Add Site"}
                </button>
              </form>
            )}
            {error && <p className="text-danger text-sm mt-3">{error}</p>}
          </>
        )}
      </div>

      {/* Fetch Error */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-800">
          {fetchError}
        </div>
      )}

      {/* Sites List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-muted">Loading...</div>
        ) : sites.length === 0 && !fetchError ? (
          <div className="px-6 py-12 text-center">
            <p className="text-muted">
              {canAddSites
                ? "No sites registered yet."
                : "You can still run individual scans from the New Scan page."}
            </p>
            {canAddSites && (
              <p className="text-sm text-muted mt-1">
                Add a URL above to start monitoring.
              </p>
            )}
            {!canAddSites && (
              <Link
                href="/dashboard/scan"
                className="inline-block text-primary hover:text-primary-dark text-sm font-medium mt-2"
              >
                Go to New Scan →
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-muted">
                  <th className="px-6 py-3 font-medium">Site</th>
                  <th className="px-6 py-3 font-medium">Last Score</th>
                  <th className="px-6 py-3 font-medium">Last Scan</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sites.map((site) => (
                  <tr key={site.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {site.name || new URL(site.url).hostname}
                        </p>
                        <p className="text-xs text-muted truncate max-w-xs">
                          {site.url}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {site.last_scan_score !== null ? (
                        <span
                          className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                            site.last_scan_score >= 90
                              ? "bg-green-100 text-green-800"
                              : site.last_scan_score >= 70
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {site.last_scan_score}%
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {site.last_scan_at
                        ? new Date(site.last_scan_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/scan?url=${encodeURIComponent(site.url)}`}
                          className="text-primary hover:text-primary-dark text-sm font-medium"
                        >
                          Scan
                        </Link>
                        <button
                          onClick={() => handleDelete(site.id)}
                          disabled={deleting === site.id}
                          className="text-danger hover:text-red-800 text-sm font-medium cursor-pointer disabled:opacity-50"
                        >
                          {deleting === site.id ? "..." : "Remove"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
