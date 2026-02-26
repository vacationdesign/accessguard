import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ProductHuntBadge from "@/components/ProductHuntBadge";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.a11yscope.com"),
  title:
    "A11yScope - Free Website Accessibility Checker | WCAG 2.1 Compliance Scanner",
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "A11yScope - Free Website Accessibility Checker",
    description:
      "Scan your website for accessibility issues in seconds. Get actionable fixes for WCAG 2.1 compliance.",
    type: "website",
    locale: "en_US",
    url: "https://www.a11yscope.com",
    siteName: "A11yScope",
  },
  twitter: {
    card: "summary_large_image",
    title: "A11yScope - Free Website Accessibility Checker",
    description:
      "Scan your website for accessibility issues in seconds. Get actionable fixes for WCAG 2.1 compliance.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "F-Xib_D9b8L1jY8ZTS9x32_ZVKsexQxLVwvEWSs6-uM",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "A11yScope",
  url: "https://www.a11yscope.com",
  logo: "https://www.a11yscope.com/favicon.ico",
  description:
    "Free website accessibility checker and WCAG 2.1 compliance scanner.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "A11yScope",
  url: "https://www.a11yscope.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" className="notranslate">
      <body className={`${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        {children}
        <ProductHuntBadge />
      </body>
    </html>
  );
}
