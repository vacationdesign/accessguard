import { jsPDF } from "jspdf";
import { ScanResult } from "./scanner";

export function generatePdfReport(result: ScanResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addPageIfNeeded = (requiredSpace: number) => {
    if (y + requiredSpace > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // ─── Header ───
  doc.setFillColor(37, 99, 235); // primary blue
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("AccessGuard", margin, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("WCAG 2.1 Accessibility Report", margin, 28);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, margin, 36);

  y = 52;

  // ─── URL & Score ───
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Scanned URL:", margin, y);
  doc.setFont("helvetica", "bold");
  doc.text(result.url, margin + 28, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text(
    `Scan Duration: ${(result.scanDuration / 1000).toFixed(1)}s  |  Timestamp: ${new Date(result.timestamp).toLocaleString()}`,
    margin,
    y
  );
  y += 12;

  // Score box
  const scoreColor =
    result.score >= 90
      ? [22, 163, 74]
      : result.score >= 70
        ? [234, 179, 8]
        : [220, 38, 38];
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(margin, y, 40, 22, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(`${result.score}`, margin + 20, y + 15, { align: "center" });

  // Score label
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.text("Accessibility Score", margin + 48, y + 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const gradeText =
    result.score >= 90
      ? "Excellent"
      : result.score >= 70
        ? "Needs Improvement"
        : "Poor - Action Required";
  doc.text(gradeText, margin + 48, y + 18);
  y += 32;

  // ─── Summary Stats ───
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, y, contentWidth, 20, 3, 3, "F");

  const criticalCount = result.violations.filter((v) => v.impact === "critical").length;
  const seriousCount = result.violations.filter((v) => v.impact === "serious").length;
  const moderateCount = result.violations.filter((v) => v.impact === "moderate").length;
  const minorCount = result.violations.filter((v) => v.impact === "minor").length;
  const totalIssueNodes = result.violations.reduce((sum, v) => sum + v.nodes.length, 0);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const colWidth = contentWidth / 6;

  const stats = [
    { label: "Total Rules", value: `${result.violations.length}`, color: [30, 30, 30] },
    { label: "Elements", value: `${totalIssueNodes}`, color: [30, 30, 30] },
    { label: "Critical", value: `${criticalCount}`, color: [220, 38, 38] },
    { label: "Serious", value: `${seriousCount}`, color: [249, 115, 22] },
    { label: "Moderate", value: `${moderateCount}`, color: [234, 179, 8] },
    { label: "Minor", value: `${minorCount}`, color: [59, 130, 246] },
  ];

  stats.forEach((stat, i) => {
    const x = margin + colWidth * i + colWidth / 2;
    doc.setTextColor(stat.color[0], stat.color[1], stat.color[2]);
    doc.setFontSize(12);
    doc.text(stat.value, x, y + 9, { align: "center" });
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.text(stat.label, x, y + 16, { align: "center" });
  });

  y += 28;

  // Passes & Incomplete
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Rules Passed: ${result.passes}  |  Needs Review: ${result.incomplete}`, margin, y);
  y += 12;

  // ─── Violations Detail ───
  if (result.violations.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text(`Issues Found (${result.violations.length})`, margin, y);
    y += 10;

    result.violations.forEach((violation, index) => {
      addPageIfNeeded(40);

      // Impact badge
      const impactColors: Record<string, number[]> = {
        critical: [220, 38, 38],
        serious: [249, 115, 22],
        moderate: [234, 179, 8],
        minor: [59, 130, 246],
      };
      const badgeColor = impactColors[violation.impact] || [120, 120, 120];

      doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      doc.roundedRect(margin, y, 18, 5, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.text(violation.impact.toUpperCase(), margin + 9, y + 3.5, { align: "center" });

      // Violation title
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const titleText = `${index + 1}. ${violation.help}`;
      const titleLines = doc.splitTextToSize(titleText, contentWidth - 22);
      doc.text(titleLines, margin + 21, y + 4);
      y += 4 + titleLines.length * 5;

      // Description
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      const descLines = doc.splitTextToSize(violation.description, contentWidth - 4);
      addPageIfNeeded(descLines.length * 4 + 10);
      doc.text(descLines, margin + 2, y + 2);
      y += descLines.length * 4 + 4;

      // Affected elements count
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(`${violation.nodes.length} element(s) affected  |  Rule: ${violation.id}`, margin + 2, y);
      y += 4;

      // Show first few affected elements
      const nodesToShow = violation.nodes.slice(0, 3);
      nodesToShow.forEach((node) => {
        addPageIfNeeded(16);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(margin + 4, y, contentWidth - 8, 10, 1, 1, "F");
        doc.setFontSize(6);
        doc.setTextColor(60, 60, 60);
        doc.setFont("courier", "normal");
        const htmlSnippet = node.html.substring(0, 90) + (node.html.length > 90 ? "..." : "");
        doc.text(htmlSnippet, margin + 6, y + 4);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        const fixText = node.fixSuggestion
          ? node.fixSuggestion.substring(0, 100) + (node.fixSuggestion.length > 100 ? "..." : "")
          : node.failureSummary.substring(0, 100);
        doc.text(fixText, margin + 6, y + 8);
        y += 12;
      });

      if (violation.nodes.length > 3) {
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(`... and ${violation.nodes.length - 3} more element(s)`, margin + 6, y);
        y += 5;
      }

      // Separator
      y += 3;
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    });
  } else {
    addPageIfNeeded(20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74);
    doc.text("No accessibility issues found!", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("This page passed all WCAG 2.1 AA checks.", margin, y);
    y += 12;
  }

  // ─── Footer on every page ───
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.setFont("helvetica", "normal");
    doc.text(
      `AccessGuard - WCAG 2.1 Accessibility Report  |  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
    doc.text("https://www.accessguard.dev", pageWidth / 2, 294, { align: "center" });
  }

  // Download
  const urlSlug = result.url
    .replace(/https?:\/\//, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .substring(0, 40);
  doc.save(`accessguard-report-${urlSlug}.pdf`);
}
