import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import LegalFooter from "@/components/LegalFooter";

interface UseCasePage {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  audience: string;
  pains: string[];
  outcomes: string[];
  workflow: string[];
  cta: string;
}

const useCases: UseCasePage[] = [
  {
    slug: "ecommerce-accessibility-checker",
    title: "Ecommerce Accessibility Checker",
    metaTitle: "Ecommerce Accessibility Checker | WCAG Audits for Online Stores",
    description:
      "Find checkout, product-page, navigation, and form accessibility issues that can hurt revenue, SEO, and compliance readiness.",
    audience: "For Shopify, WooCommerce, custom storefront, and marketplace teams",
    pains: [
      "Low-contrast sale labels, product options, and error messages",
      "Missing labels on checkout, search, newsletter, and account forms",
      "Empty buttons or links in icon-heavy product cards",
      "Regression risk when themes, apps, or merchandising content changes",
    ],
    outcomes: [
      "Prioritized WCAG 2.1 AA issue list for high-value pages",
      "Fix suggestions your developer or agency can act on",
      "PDF reports for compliance files, stakeholders, or vendors",
      "Weekly crawl monitoring for product, category, and checkout flows",
    ],
    workflow: [
      "Scan the homepage, product page, cart, and checkout entry points",
      "Fix high-impact contrast, label, alt text, and button-name issues first",
      "Register the store for weekly crawl monitoring after launch",
    ],
    cta: "Scan Your Store",
  },
  {
    slug: "web-agency-accessibility-audits",
    title: "Accessibility Audits for Web Agencies",
    metaTitle: "Accessibility Audits for Web Agencies | A11yScope",
    description:
      "Turn accessibility checks into a repeatable agency workflow with client-ready reports, fix-ready findings, and white-label PDF exports.",
    audience: "For agencies, freelancers, and consultants managing client sites",
    pains: [
      "Manual audits are hard to scope during discovery",
      "Clients need clear evidence, not raw technical output",
      "Accessibility issues reappear after CMS and plugin updates",
      "Reporting must be repeatable across multiple client sites",
    ],
    outcomes: [
      "Fast first-pass audits for prospects and retainers",
      "White-label reports on Agency plans",
      "Multi-site monitoring for recurring client work",
      "Clear before-and-after score tracking for remediation projects",
    ],
    workflow: [
      "Run a free page scan during discovery or sales calls",
      "Use Pro or Agency crawl results to scope remediation work",
      "Share PDF reports and monitor regressions after handoff",
    ],
    cta: "Audit a Client Site",
  },
  {
    slug: "saas-accessibility-monitoring",
    title: "SaaS Accessibility Monitoring",
    metaTitle: "SaaS Accessibility Monitoring | WCAG Regression Checks",
    description:
      "Monitor marketing pages, signup flows, dashboards, and documentation so accessibility regressions are caught before customers report them.",
    audience: "For SaaS product, growth, and engineering teams",
    pains: [
      "Rapid UI releases can break labels, focus states, or contrast",
      "Marketing pages and app surfaces often drift separately",
      "Accessibility debt becomes expensive when found late",
      "Compliance, support, and product teams need the same source of truth",
    ],
    outcomes: [
      "Weekly monitoring across important public pages",
      "Scan history and score trends for release reviews",
      "Fix-ready findings for product and frontend teams",
      "Reports that product, legal, and customer-facing teams can share",
    ],
    workflow: [
      "Scan public acquisition pages and core signup flows",
      "Register production URLs for weekly monitoring",
      "Review regressions after major releases, redesigns, or content updates",
    ],
    cta: "Check Your SaaS Site",
  },
];

function getUseCase(slug: string): UseCasePage | undefined {
  return useCases.find((item) => item.slug === slug);
}

export function generateStaticParams() {
  return useCases.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getUseCase(slug);
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.description,
    alternates: {
      canonical: `/use-cases/${page.slug}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.description,
      type: "website",
      url: `https://www.a11yscope.com/use-cases/${page.slug}`,
    },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getUseCase(slug);
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: `https://www.a11yscope.com/use-cases/${page.slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.a11yscope.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.title,
          item: `https://www.a11yscope.com/use-cases/${page.slug}`,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLd} />
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-8 w-8 text-primary"
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
          <span className="text-xl font-bold text-foreground">A11yScope</span>
        </Link>
        <Link
          href="/"
          className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Free Scan
        </Link>
      </nav>

      <main>
        <section className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="text-sm font-semibold text-primary mb-3">
              {page.audience}
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
              {page.title}
            </h1>
            <p className="text-lg text-muted mt-5 leading-relaxed max-w-2xl">
              {page.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                {page.cta}
              </Link>
              <Link
                href="/blog/wcag-compliance-checklist-2026"
                className="inline-flex items-center justify-center bg-white border border-gray-200 text-foreground font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View WCAG Checklist
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Sample scan plan
                </p>
                <p className="text-xs text-muted">WCAG 2.1 AA + WCAG 2.2 readiness</p>
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
                Ready
              </span>
            </div>
            <ol className="space-y-3">
              {page.workflow.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-50 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-700 leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-white border-y border-gray-100 py-16">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Problems A11yScope helps surface
              </h2>
              <ul className="space-y-3">
                {page.pains.map((pain) => (
                  <li key={pain} className="flex gap-3 text-sm text-slate-700">
                    <span className="mt-1 h-2 w-2 rounded-full bg-danger shrink-0" />
                    {pain}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                What you can hand to the team
              </h2>
              <ul className="space-y-3">
                {page.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 text-success font-bold">&#10003;</span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Start with one public URL
          </h2>
          <p className="text-muted mt-3">
            A single page scan gives you an immediate prioritized issue list.
            Pro plans unlock full-site crawling and recurring monitoring.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors mt-6"
          >
            Run a Free Scan
          </Link>
        </section>
      </main>

      <LegalFooter />
    </div>
  );
}
