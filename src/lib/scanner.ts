import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import { AxeResults } from "axe-core";

export interface ScanResult {
  url: string;
  timestamp: string;
  violations: Violation[];
  passes: number;
  incomplete: number;
  score: number;
  scanDuration: number;
}

export interface Violation {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: ViolationNode[];
}

export interface ViolationNode {
  html: string;
  target: string[];
  failureSummary: string;
  fixSuggestion: string;
}

const CHROMIUM_REMOTE_URL =
  "https://github.com/nichochar/sparticuz-chromium-bin/raw/main/chromium-v143.0.1-pack.tar";

async function getBrowser() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    // Serverless environment (Vercel, AWS Lambda)
    const chromium = (await import("@sparticuz/chromium-min")).default;
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath: await chromium.executablePath(CHROMIUM_REMOTE_URL),
      headless: true,
    });
  } else {
    // Local development
    return puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
  }
}

export async function scanUrl(url: string): Promise<ScanResult> {
  const startTime = Date.now();

  // Validate URL
  let validUrl: URL;
  try {
    validUrl = new URL(url);
    if (!["http:", "https:"].includes(validUrl.protocol)) {
      throw new Error("Only HTTP and HTTPS URLs are supported");
    }
  } catch {
    throw new Error("Invalid URL provided");
  }

  const browser = await getBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent(
      "AccessGuard/1.0 (Accessibility Scanner; +https://accessguard.dev)"
    );

    // Navigate with timeout
    await page.goto(validUrl.toString(), {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Inject axe-core and run analysis
    const axeSource = require("axe-core").source;
    await page.evaluate(axeSource);

    const axeResults: AxeResults = await page.evaluate(() => {
      return (window as any).axe.run(document, {
        runOnly: {
          type: "tag",
          values: [
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "best-practice",
          ],
        },
        resultTypes: ["violations", "passes", "incomplete"],
      });
    });

    const scanDuration = Date.now() - startTime;

    // Calculate accessibility score (0-100)
    const totalChecks =
      axeResults.violations.length +
      axeResults.passes.length +
      axeResults.incomplete.length;
    const score =
      totalChecks > 0
        ? Math.round((axeResults.passes.length / totalChecks) * 100)
        : 100;

    // Map violations to our format
    const violations: Violation[] = axeResults.violations.map((v) => ({
      id: v.id,
      impact: v.impact as Violation["impact"],
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      tags: v.tags,
      nodes: v.nodes.map((n) => ({
        html: n.html,
        target: n.target.map(String),
        failureSummary: n.failureSummary || "",
        fixSuggestion: generateFixSuggestion(v.id, n.html),
      })),
    }));

    // Sort by impact severity
    const impactOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
    violations.sort(
      (a, b) => impactOrder[a.impact] - impactOrder[b.impact]
    );

    return {
      url: validUrl.toString(),
      timestamp: new Date().toISOString(),
      violations,
      passes: axeResults.passes.length,
      incomplete: axeResults.incomplete.length,
      score,
      scanDuration,
    };
  } finally {
    await browser.close();
  }
}

function generateFixSuggestion(ruleId: string, html: string): string {
  const fixes: Record<string, string> = {
    "image-alt":
      'Add a descriptive alt attribute to the image. Example: <img alt="Description of image content" ...>',
    "color-contrast":
      "Increase the contrast ratio between the text color and background color. Use a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.",
    "link-name":
      "Add descriptive text content to the link, or add an aria-label attribute.",
    "button-name":
      "Add text content to the button, or add an aria-label attribute.",
    "html-has-lang":
      'Add a lang attribute to the <html> element. Example: <html lang="en">',
    "document-title":
      "Add a <title> element inside the <head> section of your HTML.",
    "meta-viewport":
      'Ensure the meta viewport tag does not disable user scaling. Remove maximum-scale=1.0 or user-scalable=no.',
    label:
      "Associate a <label> element with this form input using the for attribute, or wrap the input in a <label> element.",
    "heading-order":
      "Ensure headings follow a logical order (h1, then h2, then h3, etc.). Do not skip heading levels.",
    region:
      "Wrap page content in landmark regions (<main>, <nav>, <header>, <footer>) so screen reader users can navigate efficiently.",
    "landmark-one-main":
      "Add a <main> element to wrap the primary content of the page.",
    "page-has-heading-one":
      "Add an <h1> heading to the page to describe its main content.",
    tabindex:
      "Avoid using tabindex values greater than 0. Use tabindex=\"0\" to add an element to the tab order, or tabindex=\"-1\" to remove it.",
    "aria-roles":
      "Use valid ARIA roles. Check the WAI-ARIA specification for a list of valid role values.",
    "aria-valid-attr":
      "Ensure all ARIA attributes used are valid and spelled correctly.",
    "aria-valid-attr-value":
      "Ensure all ARIA attribute values are valid for their respective attributes.",
  };

  return (
    fixes[ruleId] ||
    "Review the element and ensure it meets WCAG 2.1 AA guidelines. See the help URL for detailed guidance."
  );
}
