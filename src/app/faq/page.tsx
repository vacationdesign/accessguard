import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Web Accessibility & WCAG Compliance Questions | A11yScope",
  description:
    "Answers to common questions about web accessibility, WCAG 2.1 compliance, ADA requirements, automated testing, and A11yScope features.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | A11yScope",
    description:
      "Everything you need to know about web accessibility, WCAG compliance, and A11yScope.",
    type: "website",
  },
};

const faqCategories = [
  {
    category: "Web Accessibility Basics",
    questions: [
      {
        q: "What is web accessibility?",
        a: "Web accessibility means designing and developing websites so that people with disabilities can use them. This includes people with visual, auditory, motor, and cognitive impairments. An accessible website works with assistive technologies like screen readers, provides keyboard navigation, uses sufficient color contrast, and includes text alternatives for non-text content.",
      },
      {
        q: "What is WCAG 2.1?",
        a: "WCAG 2.1 (Web Content Accessibility Guidelines version 2.1) is the international standard for web accessibility published by the World Wide Web Consortium (W3C). It defines success criteria organized under four principles: Perceivable, Operable, Understandable, and Robust (POUR). WCAG 2.1 has three conformance levels: A (minimum), AA (recommended for most sites), and AAA (highest). Most laws and regulations reference WCAG 2.1 Level AA as the baseline.",
      },
      {
        q: "What is the difference between WCAG 2.1 and WCAG 2.2?",
        a: "WCAG 2.2, published in October 2023, adds 9 new success criteria on top of WCAG 2.1. New criteria include Focus Not Obscured, Dragging Movements, Target Size (minimum), Consistent Help, Redundant Entry, and Accessible Authentication. WCAG 2.2 also removes success criterion 4.1.1 Parsing. If you comply with WCAG 2.1 AA, you're most of the way to 2.2 compliance.",
      },
      {
        q: "What are the most common accessibility issues on websites?",
        a: "The most common issues include: missing alternative text on images, insufficient color contrast (below 4.5:1 ratio for normal text), missing form labels, empty links or buttons without accessible names, missing document language, and empty headings. These six issues account for over 96% of detected errors according to the WebAIM Million report.",
      },
      {
        q: "What percentage of accessibility issues can automated tools detect?",
        a: "Automated accessibility testing tools can detect approximately 30-40% of WCAG issues. They excel at finding missing alt text, color contrast failures, missing form labels, duplicate IDs, and structural issues. The remaining 60-70% requires manual testing — such as evaluating alt text quality, testing keyboard navigation flows, and verifying screen reader announcements.",
      },
    ],
  },
  {
    category: "Legal Requirements",
    questions: [
      {
        q: "Is website accessibility legally required in the United States?",
        a: "While no single federal law explicitly mandates website accessibility, ADA Title III has been consistently interpreted by courts to cover websites of businesses open to the public. The Department of Justice issued a final rule in 2024 requiring state and local government websites to meet WCAG 2.1 AA. Over 4,000 ADA web accessibility lawsuits were filed in 2023 alone, with plaintiffs winning or settling the vast majority of cases.",
      },
      {
        q: "What is the European Accessibility Act (EAA)?",
        a: "The European Accessibility Act (EAA) is an EU directive that requires digital products and services to be accessible starting June 28, 2025. It applies to e-commerce websites, banking services, e-books, transportation services, and more. The EAA references the EN 301 549 standard, which maps to WCAG 2.1 AA. Non-compliance can result in fines and market access restrictions.",
      },
      {
        q: "What is Section 508 and who must comply?",
        a: "Section 508 of the Rehabilitation Act requires US federal agencies and organizations receiving federal funding to make their electronic and information technology accessible. It was updated in 2017 to align with WCAG 2.0 AA standards. This includes federal websites, internal tools, procurement, and any technology funded by federal grants or contracts.",
      },
      {
        q: "How much can an ADA website accessibility lawsuit cost?",
        a: "ADA web accessibility lawsuits typically settle between $5,000 and $150,000 for small to mid-size businesses. Legal defense costs $10,000-$50,000 even if you win. Serial plaintiff firms often target e-commerce sites, hospitality, food service, and retail. The average settlement is significantly more expensive than proactive remediation, which typically costs $2,000-$15,000 depending on site complexity.",
      },
    ],
  },
  {
    category: "About A11yScope",
    questions: [
      {
        q: "How does A11yScope scan websites?",
        a: "A11yScope uses a headless browser (Puppeteer) to fully render your page including JavaScript content, then runs axe-core — the industry-standard accessibility testing engine by Deque Systems — to check against 38+ WCAG 2.1 AA rules. The entire scan takes approximately 6 seconds and produces a detailed report with specific code fixes for every issue found.",
      },
      {
        q: "Is A11yScope free to use?",
        a: "Yes. A11yScope offers a free tier with 3 scans per month. No account or credit card is required. Simply enter a URL on the homepage and get your accessibility report in seconds. For unlimited scans, PDF report export, and continuous monitoring, the Pro plan is available at $19/month. The Agency plan at $49/month adds multi-site management, team access, and white-label reports.",
      },
      {
        q: "What is axe-core and why does A11yScope use it?",
        a: "axe-core is an open-source accessibility testing engine created and maintained by Deque Systems. It's the most widely used accessibility testing library in the world, also used by Google Lighthouse, Microsoft Accessibility Insights, and browser DevTools. A11yScope uses axe-core because of its proven accuracy, comprehensive WCAG rule coverage, and zero false-positive commitment.",
      },
      {
        q: "Does A11yScope test JavaScript-rendered content?",
        a: "Yes. Unlike some accessibility checkers that only analyze static HTML, A11yScope uses a real browser engine to fully render your page. This means React, Vue, Angular, and other JavaScript framework content is fully loaded and tested. Dynamic content, single-page applications, and client-side rendered components are all included in the scan.",
      },
      {
        q: "What accessibility score does A11yScope's own website get?",
        a: "A11yScope's own website scores 98 out of 100 on our accessibility scanner with zero WCAG violations detected. We practice what we preach — our site is built with semantic HTML, proper heading structure, sufficient color contrast, keyboard navigation, and screen reader compatibility.",
      },
    ],
  },
  {
    category: "Fixing Accessibility Issues",
    questions: [
      {
        q: "How do I fix missing alt text on images?",
        a: "Add an alt attribute to every <img> tag that describes the image content. For informational images, write a concise description (e.g., alt=\"Team meeting in conference room\"). For decorative images that don't convey content, use an empty alt attribute (alt=\"\"). For complex images like charts, provide a brief alt text and a longer description nearby or via aria-describedby.",
      },
      {
        q: "How do I fix color contrast issues?",
        a: "WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18px bold or 24px regular). To fix contrast issues: darken your text color or lighten the background (or vice versa). Use a contrast checker tool to verify ratios. Common fixes include changing light gray text (#999) to darker gray (#595959) against white backgrounds.",
      },
      {
        q: "How do I fix missing form labels?",
        a: "Every form input needs an associated label. The preferred method is using a <label> element with a 'for' attribute matching the input's 'id': <label for=\"email\">Email</label><input id=\"email\" type=\"email\">. Alternatively, use aria-label for inputs where a visible label isn't appropriate, or aria-labelledby to reference existing text on the page.",
      },
      {
        q: "How do I make my website keyboard accessible?",
        a: "Ensure all interactive elements (links, buttons, form fields, menus) are reachable and operable with keyboard alone. Use semantic HTML elements that are naturally focusable. Add visible focus indicators (:focus-visible styles). Implement logical tab order. Avoid keyboard traps where focus gets stuck. For custom widgets, add appropriate ARIA roles and keyboard event handlers.",
      },
      {
        q: "Do accessibility overlay widgets actually fix accessibility issues?",
        a: "No. Accessibility overlay widgets (like AccessiBe, UserWay, AudioEye) add a JavaScript layer on top of your site but do not fix the underlying code issues. Multiple studies and advocacy organizations have documented that overlays often introduce new accessibility barriers, interfere with screen readers, and provide a false sense of compliance. Over 800 accessibility advocates have signed an open letter against overlays. The recommended approach is fixing your actual code.",
      },
    ],
  },
];

// Build schema.org FAQ data from all categories
const allQuestions = faqCategories.flatMap((cat) => cat.questions);
const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allQuestions.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={faqPageJsonLd} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
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
              name: "FAQ",
              item: "https://www.a11yscope.com/faq",
            },
          ],
        }}
      />

      {/* Navigation */}
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

      {/* FAQ Content */}
      <main className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <Link
          href="/"
          className="text-sm text-muted hover:text-primary transition-colors inline-flex items-center gap-1 mb-8"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-muted text-lg mb-12">
          Everything you need to know about web accessibility, WCAG compliance,
          and how A11yScope helps.
        </p>

        <div className="space-y-12">
          {faqCategories.map((category) => (
            <section key={category.category}>
              <h2 className="text-xl font-bold text-foreground mb-6 pb-2 border-b border-gray-100">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((item, i) => (
                  <details
                    key={i}
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer text-left font-semibold text-foreground hover:text-primary transition-colors list-none [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <svg
                        className="h-5 w-5 shrink-0 text-muted group-open:rotate-180 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </summary>
                    <div className="px-5 pb-5 text-muted text-[15px] leading-relaxed -mt-1">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            Ready to check your website?
          </h2>
          <p className="text-muted">
            Scan for WCAG 2.1 issues in seconds. Free, no sign-up required.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Scan Your Website Free
          </Link>
        </div>
      </main>
    </div>
  );
}
