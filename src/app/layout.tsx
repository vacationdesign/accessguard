import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title:
    "AccessGuard - Free Website Accessibility Checker | WCAG 2.1 Compliance Scanner",
  description:
    "Scan your website for accessibility issues in seconds. Get actionable fixes for WCAG 2.1 compliance. Avoid ADA lawsuits. Free instant scan.",
  other: {
    google: "notranslate",
  },
  keywords: [
    "accessibility checker",
    "WCAG compliance",
    "ADA compliance",
    "website accessibility",
    "accessibility scanner",
    "WCAG 2.1",
    "accessibility audit",
    "a11y checker",
    "web accessibility testing",
  ],
  openGraph: {
    title: "AccessGuard - Free Website Accessibility Checker",
    description:
      "Scan your website for accessibility issues in seconds. Get actionable fixes for WCAG 2.1 compliance.",
    type: "website",
    locale: "en_US",
    url: "https://www.accessguard.dev",
    siteName: "AccessGuard",
  },
  twitter: {
    card: "summary",
    title: "AccessGuard - Free Website Accessibility Checker",
    description:
      "Scan your website for accessibility issues in seconds. Get actionable fixes for WCAG 2.1 compliance.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "LoLB0JA05qcI6u3y54pKFl86H3uqMxurVdxEwEPdYUs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" className="notranslate">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
