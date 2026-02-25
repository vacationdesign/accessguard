import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: {
    template: "%s | Admin | A11yScope",
    default: "Admin | A11yScope",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Non-admin users get bounced to the regular dashboard
  if (!isAdminEmail(user.email)) {
    redirect("/dashboard");
  }

  return (
    <AdminShell userEmail={user.email}>
      {children}
    </AdminShell>
  );
}
