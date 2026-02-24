import { jsPDF } from "jspdf";
import { ScanResult } from "./scanner";

export function generatePdfReport(result: ScanResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Reset character spacing globally (fixes courier font bug in jsPDF)
  doc.setCharSpace(0);

  const addPageIfNeeded = (requiredSpace: number) => {
    if (y + requiredSpace > 272) {
      doc.addPage();
      y = 20;
    }
  };

  // Helper: draw text safely with charSpace reset
  const safeText = (
    text: string | string[],
    x: number,
    ty: number,
    options?: { align?: "left" | "center" | "right" }
  ) => {
    doc.setCharSpace(0);
    doc.text(text, x, ty, options);
  };

  // ─── Header ───
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 38, "F");
  // Subtle gradient effect with second darker bar
  doc.setFillColor(30, 80, 210);
  doc.rect(0, 36, pageWidth, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  safeText("AccessGuard", margin, 16);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  safeText("WCAG 2.1 Accessibility Report", margin, 25);

  doc.setFontSize(8);
  doc.setTextColor(200, 215, 255);
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  safeText(`Generated: ${dateStr}`, margin, 33);

  y = 48;

  // ─── URL & Scan Info ───
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  safeText("SCANNED URL", margin, y);
  y += 5;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const urlLines = doc.splitTextToSize(result.url, contentWidth);
  safeText(urlLines, margin, y);
  y += urlLines.length * 5 + 3;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  const scanTs = new Date(result.timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  safeText(
    `Duration: ${(result.scanDuration / 1000).toFixed(1)}s  \u2022  ${scanTs}`,
    margin,
    y
  );
  y += 10;

  // ─── Score Section ───
  const scoreColor =
    result.score >= 90
      ? [22, 163, 74]
      : result.score >= 70
        ? [234, 179, 8]
        : [220, 38, 38];

  // Score circle
  const circleX = margin + 16;
  const circleY = y + 12;
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.circle(circleX, circleY, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  safeText(`${result.score}`, circleX, circleY + 3, { align: "center" });

  // Score label
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(16);
  safeText("Accessibility Score", margin + 36, y + 8);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const gradeText =
    result.score >= 90
      ? "Excellent"
      : result.score >= 70
        ? "Needs Improvement"
        : "Poor - Action Required";
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  safeText(gradeText, margin + 36, y + 16);

  // Score scale bar
  const barX = margin + 36;
  const barY = y + 20;
  const barW = contentWidth - 40;
  doc.setFillColor(230, 230, 230);
  doc.roundedRect(barX, barY, barW, 3, 1.5, 1.5, "F");
  const fillW = (result.score / 100) * barW;
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(barX, barY, fillW, 3, 1.5, 1.5, "F");

  y += 32;

  // ─── Summary Stats ───
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "FD");

  const criticalCount = result.violations.filter(
    (v) => v.impact === "critical"
  ).length;
  const seriousCount = result.violations.filter(
    (v) => v.impact === "serious"
  ).length;
  const moderateCount = result.violations.filter(
    (v) => v.impact === "moderate"
  ).length;
  const minorCount = result.violations.filter(
    (v) => v.impact === "minor"
  ).length;
  const totalIssueNodes = result.violations.reduce(
    (sum, v) => sum + v.nodes.length,
    0
  );

  const colWidth = contentWidth / 6;
  const stats = [
    { label: "Rules", value: `${result.violations.length}`, color: [30, 30, 30] },
    { label: "Elements", value: `${totalIssueNodes}`, color: [30, 30, 30] },
    { label: "Critical", value: `${criticalCount}`, color: [220, 38, 38] },
    { label: "Serious", value: `${seriousCount}`, color: [249, 115, 22] },
    { label: "Moderate", value: `${moderateCount}`, color: [234, 179, 8] },
    { label: "Minor", value: `${minorCount}`, color: [59, 130, 246] },
  ];

  stats.forEach((stat, i) => {
    const x = margin + colWidth * i + colWidth / 2;
    doc.setTextColor(stat.color[0], stat.color[1], stat.color[2]);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    safeText(stat.value, x, y + 10, { align: "center" });
    doc.setTextColor(140, 140, 140);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    safeText(stat.label, x, y + 16, { align: "center" });
  });

  y += 28;

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  safeText(
    `Passed: ${result.passes}  \u2022  Needs Review: ${result.incomplete}`,
    margin,
    y
  );
  y += 10;

  // ─── Violations Detail ───
  if (result.violations.length > 0) {
    // Section header with line
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + 40, y);
    doc.setLineWidth(0.2);
    y += 5;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    safeText(`Issues Found (${result.violations.length})`, margin, y);
    y += 10;

    result.violations.forEach((violation, index) => {
      addPageIfNeeded(45);

      // Impact badge
      const impactColors: Record<string, number[]> = {
        critical: [220, 38, 38],
        serious: [249, 115, 22],
        moderate: [234, 179, 8],
        minor: [59, 130, 246],
      };
      const badgeColor = impactColors[violation.impact] || [120, 120, 120];

      // Colored left border for the violation card
      doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      doc.rect(margin, y, 2, 5, "F");

      // Impact label
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      safeText(violation.impact.toUpperCase(), margin + 5, y + 3.5);

      // Violation title
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const titleText = `${index + 1}. ${violation.help}`;
      const titleLines = doc.splitTextToSize(titleText, contentWidth - 5);
      safeText(titleLines, margin + 5, y + 9);
      y += 9 + titleLines.length * 4.5;

      // Description
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      const descLines = doc.splitTextToSize(violation.description, contentWidth - 8);
      addPageIfNeeded(descLines.length * 3.5 + 10);
      safeText(descLines, margin + 5, y);
      y += descLines.length * 3.5 + 3;

      // Affected elements count
      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      safeText(
        `${violation.nodes.length} element(s) affected  \u2022  Rule: ${violation.id}`,
        margin + 5,
        y
      );
      y += 5;

      // Show first few affected elements
      const nodesToShow = violation.nodes.slice(0, 3);
      nodesToShow.forEach((node) => {
        // Truncate and clean HTML snippet
        const rawHtml = node.html.replace(/\s+/g, " ").trim();
        const htmlSnippet =
          rawHtml.length > 80 ? rawHtml.substring(0, 77) + "..." : rawHtml;

        // Fix suggestion text
        const fixRaw = node.fixSuggestion || node.failureSummary;
        const fixText =
          fixRaw.length > 100 ? fixRaw.substring(0, 97) + "..." : fixRaw;

        doc.setFontSize(6.5);
        doc.setFont("helvetica", "normal");
        const fixLines = doc.splitTextToSize(`\u2192 ${fixText}`, contentWidth - 18);
        const fixLineCount = Math.min(fixLines.length, 2);

        const boxHeight = 5 + fixLineCount * 3 + 2;
        addPageIfNeeded(boxHeight + 4);

        // Code block background
        doc.setFillColor(243, 244, 246);
        doc.setDrawColor(209, 213, 219);
        doc.roundedRect(margin + 5, y, contentWidth - 10, boxHeight, 1, 1, "FD");

        // HTML snippet in monospace with charSpace fix
        doc.setCharSpace(0);
        doc.setFontSize(6);
        doc.setFont("courier", "normal");
        doc.setTextColor(55, 65, 81);
        safeText(htmlSnippet, margin + 7, y + 3.5);

        // Fix suggestion
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(22, 101, 52);
        safeText(fixLines.slice(0, fixLineCount), margin + 7, y + 3.5 + 4);

        y += boxHeight + 2;
      });

      if (violation.nodes.length > 3) {
        doc.setFontSize(7);
        doc.setTextColor(160, 160, 160);
        doc.setFont("helvetica", "italic");
        safeText(
          `+ ${violation.nodes.length - 3} more element(s)`,
          margin + 7,
          y
        );
        y += 4;
      }

      // Separator
      y += 3;
      doc.setDrawColor(235, 235, 235);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    });
  } else {
    addPageIfNeeded(20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74);
    safeText("No accessibility issues found!", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    safeText("This page passed all WCAG 2.1 AA checks.", margin, y);
    y += 12;
  }

  // ─── Footer on every page ───
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setCharSpace(0);

    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, 283, pageWidth - margin, 283);

    // Footer text
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      289,
      { align: "right" }
    );
    doc.text("accessguard.dev", margin, 289);

    // Tiny branding
    doc.setFontSize(6);
    doc.setTextColor(180, 180, 180);
    doc.text(
      "WCAG 2.1 Accessibility Report",
      pageWidth / 2,
      289,
      { align: "center" }
    );
  }

  // ─── Download ───
  const urlSlug = result.url
    .replace(/https?:\/\//, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .substring(0, 40);
  doc.save(`accessguard-report-${urlSlug}.pdf`);
}
