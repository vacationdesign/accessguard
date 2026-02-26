import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: {
    template: "%s | A11yScope",
    default: "Dashboard | A11yScope",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardShell userEmail={user.email} isAdmin={isAdminEmail(user.email)}>
      {children}
    </DashboardShell>
  );
}
