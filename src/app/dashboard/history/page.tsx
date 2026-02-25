import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserScanHistory, getUserSites } from "@/lib/db";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scan History",
};

export default async function ScanHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ site?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const isFree = user.plan === "free";
  const currentPage = isFree ? 1 : Math.max(1, parseInt(params.page || "1", 10));
  const siteFilter = isFree ? undefined : params.site || undefined;
  const limit = isFree ? 3 : 20;

  const [scanResult, sites] = await Promise.all([
    getUserScanHistory(user.id, {
      limit,
      offset: isFree ? 0 : (currentPage - 1) * limit,
      siteId: siteFilter,
    }),
    getUserSites(user.id),
  ]);
  const scans = scanResult.scans;
  const totalScans = scanResult.total;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scan History</h1>
          <p className="text-muted mt-1">
            All accessibility scans for your account.
          </p>
        </div>
        <Link
          href="/dashboard/scan"
          className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap text-center"
        >
          New Scan
        </Link>
      </div>

      {/* Free plan limit banner */}
      {isFree && totalScans > 3 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-blue-800">
            Free plan shows your last 3 scans. Upgrade to view full history ({totalScans} scans total).
          </p>
          <Link
            href="/dashboard/billing"
            className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
          >
            Upgrade
          </Link>
        </div>
      )}

      {/* Site Filter */}
      {!isFree && sites.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/history"
            className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
              !siteFilter
                ? "bg-primary text-white"
                : "bg-gray-100 text-muted hover:bg-gray-200"
            }`}
          >
            All
          </Link>
          {sites.map((site) => (
            <Link
              key={site.id}
              href={`/dashboard/history?site=${site.id}`}
              className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                siteFilter === site.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-muted hover:bg-gray-200"
              }`}
            >
              {site.name || new URL(site.url).hostname}
            </Link>
          ))}
        </div>
      )}

      {/* Scans Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {scans.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-muted">No scans found.</p>
            <Link
              href="/dashboard/scan"
              className="text-sm text-primary hover:text-primary-dark font-medium mt-2 inline-block"
            >
              Run a scan &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-muted">
                  <th className="px-6 py-3 font-medium">URL</th>
                  <th className="px-6 py-3 font-medium">Score</th>
                  <th className="px-6 py-3 font-medium">Violations</th>
                  <th className="px-6 py-3 font-medium">Passes</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <span className="truncate block max-w-xs text-foreground">
                        {scan.url}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <ScoreBadge score={scan.score} />
                    </td>
                    <td className="px-6 py-3 text-foreground">
                      {scan.violations_count ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-foreground">
                      {scan.passes ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-muted whitespace-nowrap">
                      {new Date(scan.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/dashboard/history/${scan.id}`}
                        className="text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination (paid plans only) */}
      {!isFree && totalScans > currentPage * limit && (
        <div className="flex justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/dashboard/history?page=${currentPage - 1}${
                siteFilter ? `&site=${siteFilter}` : ""
              }`}
              className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-lg text-muted hover:text-foreground"
            >
              &larr; Previous
            </Link>
          )}
          <Link
            href={`/dashboard/history?page=${currentPage + 1}${
              siteFilter ? `&site=${siteFilter}` : ""
            }`}
            className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-lg text-muted hover:text-foreground"
          >
            Next &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-muted">—</span>;
  const color =
    score >= 90
      ? "bg-green-100 text-green-800"
      : score >= 70
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}
    >
      {score}%
    </span>
  );
}
