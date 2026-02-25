"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  {
    label: "Overview",
    href: "/admin",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    ),
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    ),
  },
];

export default function AdminSidebar({
  onClose,
}: {
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link href="/admin" className="flex items-center gap-2">
          <svg
            className="h-7 w-7 text-primary"
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
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground leading-tight">
              AccessGuard
            </span>
            <span className="text-xs font-medium text-orange-600 -mt-0.5">
              Admin
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-50 text-orange-700"
                  : "text-muted hover:bg-gray-50 hover:text-foreground"
              }`}
            >
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to Dashboard */}
      <div className="px-3 py-4 border-t border-gray-100">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-gray-50 hover:text-foreground transition-colors"
        >
          <svg
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </aside>
  );
}
