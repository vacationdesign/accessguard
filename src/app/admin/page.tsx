import type { Metadata } from "next";
import { getAdminStats, getRecentActivity } from "@/lib/admin";
import type { RecentEvent } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function AdminOverviewPage() {
  const [stats, activity] = await Promise.all([
    getAdminStats(),
    getRecentActivity(20),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted mt-1">
          Platform overview and recent activity.
        </p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={String(stats.totalUsers)}
          color="blue"
        />
        <StatCard
          label="MRR"
          value={`$${stats.mrr.toLocaleString()}`}
          sub={
            stats.paidUsers > 0
              ? `${stats.paidUsers} active${
                  stats.trialUsers > 0
                    ? ` + ${stats.trialUsers} trial`
                    : ""
                }`
              : "No paid users"
          }
          color="green"
        />
        <StatCard
          label="Total Scans"
          value={String(stats.totalScans)}
          color="purple"
        />
        <StatCard
          label="Avg Score"
          value={
            stats.averageScore !== null
              ? `${stats.averageScore}%`
              : "--"
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

      {/* Scan Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Scans Today"
          value={String(stats.scansToday)}
          color="blue"
        />
        <StatCard
          label="This Week"
          value={String(stats.scansThisWeek)}
          color="blue"
        />
        <StatCard
          label="This Month"
          value={String(stats.scansThisMonth)}
          color="blue"
        />
      </div>

      {/* Revenue Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-foreground mb-4">Revenue</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <p className="text-3xl font-bold text-foreground">
              ${stats.mrr.toLocaleString()}
              <span className="text-lg text-muted font-normal">/mo</span>
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
              <span className="font-semibold">{stats.paidUsers}</span>{" "}
              Active
            </div>
            {stats.trialUsers > 0 && (
              <div className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg">
                <span className="font-semibold">{stats.trialUsers}</span>{" "}
                Trialing
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-foreground">Recent Activity</h2>
        </div>
        {activity.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-muted">No activity yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activity.map((event, i) => (
              <ActivityRow key={i} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

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

const eventConfig: Record<
  RecentEvent["type"],
  { icon: React.ReactNode; colorClass: string }
> = {
  signup: {
    colorClass: "bg-green-100 text-green-600",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
      />
    ),
  },
  scan: {
    colorClass: "bg-blue-100 text-blue-600",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    ),
  },
  subscription: {
    colorClass: "bg-purple-100 text-purple-600",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
      />
    ),
  },
};

function ActivityRow({ event }: { event: RecentEvent }) {
  const config = eventConfig[event.type];
  const timeAgo = getRelativeTime(event.timestamp);

  return (
    <div className="px-6 py-3 flex items-center gap-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.colorClass}`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          {config.icon}
        </svg>
      </div>
      <p className="text-sm text-foreground flex-1 min-w-0 truncate">
        {event.description}
      </p>
      <span className="text-xs text-muted whitespace-nowrap flex-shrink-0">
        {timeAgo}
      </span>
    </div>
  );
}

function getRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
