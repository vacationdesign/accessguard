import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getScanById } from "@/lib/db";
import Link from "next/link";
import ScanDetailClient from "./ScanDetailClient";

export default async function ScanDetailPage({
  params,
}: {
  params: Promise<{ scanId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { scanId } = await params;
  const scan = await getScanById(scanId, user.id);

  if (!scan) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link
          href="/dashboard/history"
          className="hover:text-foreground transition-colors"
        >
          Scan History
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-xs">
          {scan.url}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scan Details</h1>
          <p className="text-muted mt-1">
            {new Date(scan.created_at).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Link
          href={`/dashboard/scan?url=${encodeURIComponent(scan.url)}`}
          className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap text-center"
        >
          Re-scan
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-sm text-muted">Score</p>
          <p
            className={`text-3xl font-bold mt-1 ${
              scan.score !== null && scan.score >= 90
                ? "text-green-600"
                : scan.score !== null && scan.score >= 70
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {scan.score !== null ? `${scan.score}%` : "—"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-sm text-muted">Violations</p>
          <p className="text-3xl font-bold text-red-600 mt-1">
            {scan.violations_count ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-sm text-muted">Passes</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {scan.passes ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-sm text-muted">Incomplete</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">
            {scan.incomplete ?? "—"}
          </p>
        </div>
      </div>

      {/* Violations Detail */}
      <ScanDetailClient
        violations={
          typeof scan.violations === "string"
            ? JSON.parse(scan.violations)
            : scan.violations
        }
        url={scan.url}
        score={scan.score}
      />
    </div>
  );
}
