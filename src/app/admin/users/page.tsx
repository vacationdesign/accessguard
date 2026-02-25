import type { Metadata } from "next";
import Link from "next/link";
import { getAllUsers } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Users",
};

const LIMIT = 20;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const offset = (currentPage - 1) * LIMIT;

  const { users, total } = await getAllUsers({ limit: LIMIT, offset });
  const totalPages = Math.ceil(total / LIMIT);

  const planBadge: Record<string, string> = {
    free: "bg-gray-100 text-gray-600",
    pro: "bg-blue-100 text-blue-700",
    agency: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted mt-1">
            {total} total user{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-muted">No users yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-muted">
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Scans</th>
                  <th className="px-6 py-3 font-medium">Signed Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <span className="text-foreground font-medium">
                        {user.email}
                      </span>
                      {!user.auth_id && (
                        <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
                          No login
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                          planBadge[user.plan] || planBadge.free
                        }`}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-foreground">
                      {user.scan_count}
                    </td>
                    <td className="px-6 py-3 text-muted">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-muted">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/admin/users?page=${currentPage - 1}`}
                  className="text-sm font-medium text-primary hover:text-primary-dark px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/admin/users?page=${currentPage + 1}`}
                  className="text-sm font-medium text-primary hover:text-primary-dark px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
