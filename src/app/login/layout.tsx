import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | A11yScope",
  description:
    "Sign in to your A11yScope dashboard to manage accessibility scans, monitor compliance, and generate reports.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
