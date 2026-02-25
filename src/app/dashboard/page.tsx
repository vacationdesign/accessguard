import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardStats, getUserScanHistory } from "@/lib/db";
import Link from "next/link";

export default async function DashboardOverview() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [stats, recentScansResult] = await Promise.all([
    getDashboardStats(user.id),
    getUserScanHistory(user.id, { limit: 5 }),
  ]);
  const recentScans = recentScansResult.scans;

  const activeSubscription = user.subscriptions?.find(
    (s) => s.status === "active" || s.status === "trialing"
  );

  const planLabel =
    user.plan === "agency"
      ? "Agency"
      : user.plan === "pro"
      ? "Pro"
      : "Free";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted mt-1">
          Welcome back. Here&apos;s your accessibility overview.
        </p>
      </div>

      {/* Plan Banner (Free users) */}
      {user.plan === "free" && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground">
              Upgrade to unlock monitoring
            </h3>
            <p className="text-sm text-muted mt-1">
              Register sites, automate weekly scans, and get compliance reports.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
          >
            View Plans
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Plan"
          value={planLabel}
          sub={
            activeSubscription?.status === "trialing"
              ? "Trial active"
              : activeSubscription?.status === "active"
              ? "Active"
              : user.plan === "free"
              ? "No subscription"
              : undefined
          }
          color="blue"
        />
        <StatCard
          label="Registered Sites"
          value={String(stats.sitesCount)}
          sub={
            user.plan === "pro"
              ? "/ 3 max"
              : user.plan === "agency"
              ? "/ 10 max"
              : "Upgrade to add"
          }
          color="green"
        />
        <StatCard
          label="Scans This Month"
          value={String(stats.scansThisMonth)}
          color="purple"
        />
        <StatCard
          label="Average Score"
          value={
            stats.averageScore !== null
              ? `${Math.round(stats.averageScore)}%`
              : "—"
          }
          sub={
            stats.averageScore !== null
              ? stats.averageScore >= 90
                ? "Excellent"
                : stats.averageScore >= 70
                ? "Good"
                : "Needs work"
              : "No scans yet"
          }
          color={
            stats.averageScore !== null
              ? stats.averageScore >= 90
                ? "green"
                : stats.averageScore >= 70
                ? "yellow"
                : "red"
              : "gray"
          }
        />
      </div>

      {/* Recent Scans */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Scans</h2>
          <Link
            href="/dashboard/history"
            className="text-sm text-primary hover:text-primary-dark font-medium"
          >
            View all
          </Link>
        </div>
        {recentScans.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-muted">No scans yet.</p>
            <Link
              href="/dashboard/scan"
              className="text-sm text-primary hover:text-primary-dark font-medium mt-2 inline-block"
            >
              Run your first scan &rarr;
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
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <Link
                        href={`/dashboard/history/${scan.id}`}
                        className="text-primary hover:text-primary-dark font-medium truncate block max-w-xs"
                      >
                        {scan.url}
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      <ScoreBadge score={scan.score} />
                    </td>
                    <td className="px-6 py-3 text-foreground">
                      {scan.violations_count ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-muted">
                      {new Date(scan.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
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

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
    gray: "bg-gray-50 text-gray-500",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      {sub && (
        <span
          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-2 ${
            colorClasses[color] || colorClasses.gray
          }`}
        >
          {sub}
        </span>
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
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {score}%
    </span>
  );
}
