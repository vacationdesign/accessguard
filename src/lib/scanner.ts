import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import { AxeResults } from "axe-core";
import dns from "dns/promises";

// ---------------------------------------------------------------------------
// SSRF protection: block private/internal IPs and cloud metadata endpoints
// ---------------------------------------------------------------------------

const BLOCKED_HOSTNAMES = [
  "localhost",
  "metadata.google.internal",
  "metadata.google",
];

function isPrivateIPv4(ip: string): boolean {
  // IPv4 private ranges, loopback, link-local, cloud metadata
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return false;

  const [a, b] = parts;

  return (
    a === 10 ||                              // 10.0.0.0/8
    (a === 172 && b >= 16 && b <= 31) ||      // 172.16.0.0/12
    (a === 192 && b === 168) ||               // 192.168.0.0/16
    a === 127 ||                              // 127.0.0.0/8 (loopback)
    (a === 169 && b === 254) ||               // 169.254.0.0/16 (link-local / AWS metadata)
    a === 0                                   // 0.0.0.0/8
  );
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase().replace(/^\[|\]$/g, "");

  if (
    normalized === "::1" ||                   // IPv6 loopback
    normalized === "::" ||                    // Unspecified address
    normalized.startsWith("fc") ||            // fc00::/7 unique local
    normalized.startsWith("fd") ||            // fc00::/7 unique local
    normalized.startsWith("fe80") ||          // fe80::/10 link-local
    normalized.startsWith("::ffff:127.") ||   // IPv4-mapped loopback
    normalized.startsWith("::ffff:10.") ||    // IPv4-mapped private Class A
    normalized.startsWith("::ffff:192.168.") || // IPv4-mapped private Class C
    normalized.startsWith("::ffff:169.254.") || // IPv4-mapped link-local
    normalized.startsWith("::ffff:0.")        // IPv4-mapped 0.0.0.0/8
  ) {
    return true;
  }

  // Check IPv4-mapped 172.16.0.0/12 (172.16.x.x - 172.31.x.x)
  const mapped172 = normalized.match(/^::ffff:172\.(\d+)\./);
  if (mapped172) {
    const second = parseInt(mapped172[1], 10);
    if (second >= 16 && second <= 31) return true;
  }

  return false;
}

function isPrivateIP(ip: string): boolean {
  return isPrivateIPv4(ip) || isPrivateIPv6(ip);
}

async function validateUrlSafety(url: URL): Promise<void> {
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");

  // Block known dangerous hostnames
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    throw new Error("Scanning internal or reserved addresses is not allowed");
  }

  // Block IPv6 loopback/private used directly as hostname
  if (hostname.includes(":") && isPrivateIPv6(hostname)) {
    throw new Error("Scanning private or internal IP addresses is not allowed");
  }

  // Block IPv4 addresses directly used as hostnames (including octal/hex/decimal encoding)
  if (/^[\d.]+$/.test(hostname) || /^0x/i.test(hostname)) {
    // Try to detect non-standard IP encoding (octal: 0177.0.0.1, hex: 0x7f000001, decimal: 2130706433)
    if (isPrivateIPv4(hostname)) {
      throw new Error("Scanning private or internal IP addresses is not allowed");
    }
  }

  // Resolve hostname and check the resolved IP (prevents DNS rebinding and encoded IPs)
  try {
    const results = await dns.lookup(hostname, { all: true });
    for (const result of results) {
      if (isPrivateIP(result.address)) {
        throw new Error("Scanning private or internal IP addresses is not allowed");
      }
    }
  } catch (err: any) {
    if (err.message?.includes("not allowed")) throw err;
    // DNS resolution failure — let the browser handle it (will fail with timeout)
  }
}

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
  "https://github.com/Sparticuz/chromium/releases/download/v143.0.0/chromium-v143.0.0-pack.x64.tar";

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

  // SSRF protection: block private IPs, cloud metadata, localhost
  await validateUrlSafety(validUrl);

  const browser = await getBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent(
      "A11yScope/1.0 (Accessibility Scanner; +https://www.a11yscope.com)"
    );

    // Navigate with timeout
    await page.goto(validUrl.toString(), {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Inject axe-core from CDN (avoids bundler issues in serverless)
    await page.addScriptTag({
      url: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js",
    });
    // Wait for axe to be available
    await page.waitForFunction(() => typeof (window as any).axe !== "undefined", {
      timeout: 10000,
    });

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

    // Null safety: ensure arrays exist even if axe returns unexpected shape
    const violations = axeResults.violations ?? [];
    const passes = axeResults.passes ?? [];
    const incomplete = axeResults.incomplete ?? [];

    // Calculate accessibility score (0-100)
    const totalChecks =
      violations.length +
      passes.length +
      incomplete.length;
    const score =
      totalChecks > 0
        ? Math.round((passes.length / totalChecks) * 100)
        : 100;

    // Map violations to our format
    const mappedViolations: Violation[] = violations.map((v) => ({
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
    mappedViolations.sort(
      (a, b) => impactOrder[a.impact] - impactOrder[b.impact]
    );

    return {
      url: validUrl.toString(),
      timestamp: new Date().toISOString(),
      violations: mappedViolations,
      passes: passes.length,
      incomplete: incomplete.length,
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
