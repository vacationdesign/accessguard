---
title: "We Scanned 243 Real Websites for Accessibility. 93% Failed. Here's What Breaks Most (2026 Data)"
description: "Original data from 1,012 automated WCAG 2.1 AA scans across 243 real-world websites: the failure rate, the 10 most common accessibility violations, and how to fix each one. Updated June 2026."
date: 2026-06-29
author: A11yScope Team
tags: [Accessibility, WCAG, Data Study, Research]
---

# We Scanned 243 Real Websites for Accessibility. 93% Failed. Here's What Breaks Most (2026 Data)

Most accessibility statistics you see quoted online trace back to one source: WebAIM's annual analysis of home pages. It's excellent work, but the web needs more than one dataset. So we analyzed our own.

A11yScope has run **1,012 automated accessibility scans** since launch. After deduplicating to one result per domain (keeping each domain's most recent scan), that gives us **243 distinct real-world websites** — small-business sites, dental and medical practices, e-commerce stores, SaaS products, agencies' client sites — scanned against the automated **WCAG 2.1 AA** rule set in axe-core.

This is what the data says. (For how *severe* these failures are — how many sites carry a critical, task-blocking barrier versus a minor one — see the companion [accessibility severity breakdown](/blog/critical-accessibility-barriers-study-2026).)

## Key findings

- **Only 17 of 243 websites (7.0%) had zero detectable WCAG violations.** 93.0% of sites failed at least one automated check.
- **The average accessibility score was 85.7 out of 100** — most sites are not disasters, but almost none are clean.
- **The average site carried 4.1 distinct violation types.**
- **Color contrast is the single most common failure**, affecting **62.6%** of all sites scanned.
- Three of the top ten violations — missing image alt text, unnamed buttons, and broken viewport scaling — are rated **critical** impact, meaning they can make content completely unusable for assistive-technology users.

## Methodology (read this before quoting us)

- **Sample**: 243 distinct domains, deduplicated from 1,012 scans (latest scan per domain), collected through June 2026 via A11yScope's free scanner.
- **Engine**: [axe-core](https://github.com/dequelabs/axe-core) by Deque Systems — the same engine used by Google Lighthouse — run in a fully rendered headless browser, covering 38+ automated WCAG 2.1 AA and best-practice rules.
- **Selection bias, stated plainly**: these are sites whose owners (or their agencies) cared enough to run an accessibility check. The real-world failure rate across the broader web is likely *worse* than what we report here.
- **Automated checks only**: automated tools detect roughly 30–40% of WCAG issues. A site with zero automated violations is not necessarily fully accessible — but a site *with* automated violations is definitely not.

## The 10 most common accessibility violations in 2026

| # | Violation (axe rule) | Impact | % of sites affected |
|---|---------------------|--------|---------------------|
| 1 | Insufficient color contrast (`color-contrast`) | Serious | **62.6%** |
| 2 | Content outside landmarks (`region`) | Moderate | 57.6% |
| 3 | Skipped heading levels (`heading-order`) | Moderate | 41.6% |
| 4 | Links without accessible names (`link-name`) | Serious | 27.6% |
| 5 | Duplicate landmarks without labels (`landmark-unique`) | Moderate | 21.4% |
| 6 | Missing or multiple `<main>` landmarks (`landmark-one-main`) | Moderate | 18.5% |
| 7 | No level-one heading (`page-has-heading-one`) | Moderate | 11.9% |
| 8 | Images without alt text (`image-alt`) | **Critical** | 11.1% |
| 9 | Links not distinguishable in text (`link-in-text-block`) | Serious | 10.3% |
| 10 | Buttons without accessible names (`button-name`) | **Critical** | 9.5% |

Just outside the top ten: viewport scaling blocked for zoom (`meta-viewport`, 8.2%, critical), redundant image alt text (8.2%), and focusable elements inside `aria-hidden` containers (7.8%).

## What each failure means — and the fix

### 1. Color contrast (62.6% of sites)

Nearly two out of three websites have text that fails the WCAG 4.5:1 contrast ratio. The usual suspects: light-gray body text (`#999` on white), placeholder-colored labels, and white text over hero images. The fix is mechanical — darken the text or the background until the ratio passes. Our [color contrast guide](/blog/color-contrast-accessibility-guide) walks through the exact ratios and tooling.

### 2. Content outside landmarks (57.6%)

Screen-reader users navigate by landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`). Content sitting outside any landmark is invisible to that navigation style. Wrap page content in semantic regions — usually one `<main>` plus the standard furniture.

### 3. Skipped heading levels (41.6%)

Jumping from `<h1>` to `<h4>` because the `<h4>` "looked right" breaks document outlines that screen-reader users rely on. Style with CSS; structure with sequential heading levels.

### 4. Links without accessible names (27.6%)

Icon-only links (social icons, hamburger menus, card arrows) with no text and no `aria-label`. A screen reader announces them as just "link". See [how to fix empty links and buttons](/blog/fix-empty-links-buttons-accessibility).

### 8 & 10. Missing alt text and unnamed buttons (critical)

These two are rated **critical** because they fully block tasks: an unnamed button can't be confidently pressed, and an unlabeled informative image conveys nothing. They're also among the cheapest fixes in all of web development — an `alt` attribute and an `aria-label`.

## What this means if you own a website

The encouraging read: **the most common failures are also the most fixable**. Color contrast, heading order, alt text, and link names are all afternoon-sized fixes, not re-platforming projects. A site at the average score of 86 can usually reach the high 90s in a day of focused work — our [step-by-step fixing guide](/blog/how-to-fix-accessibility-issues-on-your-website) covers the workflow.

The sobering read: accessibility regresses. Every deploy, CMS edit, and new landing page can reintroduce these exact issues — which is why one-time audits drift back to failure within months, and why we built [weekly automated monitoring](/#pricing) into A11yScope.

## Check your own site

You can run the same scan we used for this study — free, no signup — at [a11yscope.com](https://www.a11yscope.com). It takes about six seconds and shows every violation with a fix-ready code snippet.

---

*Citation: A11yScope Accessibility Scan Data Study, updated June 2026. 243 distinct domains, 1,012 total scans, axe-core WCAG 2.1 AA automated rule set. You're welcome to cite or republish these figures with a link to this page.*
