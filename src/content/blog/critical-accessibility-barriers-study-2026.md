---
title: "1 in 3 Websites Has a Critical Accessibility Barrier: A Severity Breakdown of 244 Real Sites (2026 Data)"
description: "Original 2026 data from 1,000+ automated WCAG scans: 34% of real websites have a critical, task-blocking accessibility barrier and 82% have a serious-or-worse one. The full severity breakdown, by impact level."
date: 2026-06-30
author: A11yScope Team
tags: [Accessibility, WCAG, Data Study, Severity, Research]
---

# 1 in 3 Websites Has a Critical Accessibility Barrier: A Severity Breakdown of 244 Real Sites (2026 Data)

It is one thing to know that most websites have accessibility issues. It is another to know how *bad* those issues are. A skipped heading level is a nuisance; a button a screen reader cannot name is a wall. So we went back through our scan dataset and sorted every violation by the one thing that matters most to a real user: severity.

This is a companion to our [study of the most common accessibility violations](/blog/accessibility-scan-data-study-2026). That one answered *what breaks most*. This one answers *how serious it is*.

## Key findings

- **34.4% of websites have at least one *critical* violation** — an issue that, by axe-core's own impact rating, can completely block a task for someone using assistive technology.
- **82.4% have at least one *serious*-or-worse violation.** The large majority of sites are not failing on minor technicalities; they are failing on issues that materially degrade the experience.
- **The average site carries 4.1 distinct violation types; the median is 4, and the worst single site had 13.**
- **Not one site in the sample scored a perfect 100** — every single site had at least some checks that failed outright or needed human review.
- The critical barriers are concentrated in a short, fixable list: **missing image alt text, unnamed buttons, blocked zoom, and broken ARIA**.

## Methodology (read this before quoting us)

- **Sample**: 244 distinct domains, deduplicated from more than 1,000 scans (latest scan per domain), collected through June 2026 via A11yScope's free scanner.
- **Engine**: [axe-core](https://github.com/dequelabs/axe-core) by Deque Systems — the same engine behind Google Lighthouse — run in a fully rendered headless browser against WCAG 2.1 AA and best-practice rules.
- **Severity = axe-core impact**: each violation carries an impact rating of `critical`, `serious`, `moderate`, or `minor`, assigned by axe-core based on how much it blocks an assistive-technology user. We report a site as "having a critical violation" if *any* element on the scanned page triggered a critical-impact rule.
- **A note on the score**: A11yScope's 0–100 score is the share of automated axe checks a page passes cleanly (passes ÷ [passes + violations + checks needing manual review]). It is *not* a WCAG-conformance percentage. That is why a site can have zero flagged violations and still not score 100 — there are almost always checks that require a human to confirm.
- **Selection bias, stated plainly**: these are sites whose owners cared enough to run a check. The broader web is likely *worse*.

## How severe are the failures?

| Severity reached | Share of sites |
|---|---|
| At least one **critical** violation | **34.4%** |
| At least one **serious** or critical violation | **82.4%** |
| Zero detectable violations | 7.0% |

The headline most people quote — "most sites have accessibility issues" — undersells the problem. The more honest framing is that **four out of five real websites carry a serious-or-worse barrier, and one in three carries an outright critical one.**

## The critical barriers: a short, fixable list

Critical-impact violations are the ones that can fully block a task. The encouraging news is that they cluster around a handful of rules — and the most common ones are among the cheapest fixes in web development.

| Critical violation (axe rule) | % of sites |
|---|---|
| Images without alt text (`image-alt`) | 11.1% |
| Buttons without an accessible name (`button-name`) | 9.4% |
| Zoom/scaling blocked by viewport (`meta-viewport`) | 8.2% |
| Disallowed ARIA attribute (`aria-allowed-attr`) | 5.3% |
| Missing required ARIA children (`aria-required-children`) | 4.9% |
| Form field without a label (`label`) | 4.1% |
| Unnamed `<select>` (`select-name`) | 2.9% |

The pattern: roughly half of all critical barriers are an `alt` attribute, an `aria-label`, or a `<label>` that was never added — and the rest are broken ARIA, usually from hand-rolled widgets that would have been accessible if built from native HTML elements. Our [guide to fixing empty links and buttons](/blog/fix-empty-links-buttons-accessibility) and [form labels guide](/blog/form-accessibility-missing-labels-guide) cover the exact fixes.

## The serious barriers: dominated by two issues

One step down in severity, the picture narrows even further. Two rules account for the overwhelming majority of serious-impact failures.

| Serious violation (axe rule) | % of sites |
|---|---|
| Insufficient color contrast (`color-contrast`) | 62.7% |
| Links without accessible names (`link-name`) | 27.9% |
| Links not distinguishable in text (`link-in-text-block`) | 10.7% |
| Focusable element inside `aria-hidden` (`aria-hidden-focus`) | 7.8% |
| Nested interactive controls (`nested-interactive`) | 7.0% |
| `<iframe>` without a title (`frame-title`) | 6.6% |

**Color contrast alone affects nearly two-thirds of all sites** — it is both the most common violation overall and the single biggest source of serious-impact failures. If you fix one thing this week, fix your contrast. Our [color contrast guide](/blog/color-contrast-accessibility-guide) has the exact ratios and tooling.

## What this means if you own a website

The severity lens changes the priority order. You do not have to fix everything at once — you have to fix the *critical and serious* issues first, because those are the ones doing real harm and carrying the most legal risk.

The good news hiding in this data: **the most severe problems are also the most concentrated and the most mechanical.** Add alt text. Name your buttons. Don't disable zoom. Pass contrast. Label your forms. That short list clears the large majority of critical and serious barriers on a typical site — usually in an afternoon, not a re-platforming project. Our [step-by-step fixing guide](/blog/how-to-fix-accessibility-issues-on-your-website) walks through the workflow, and the [tools comparison](/blog/website-accessibility-testing-tools-compared) covers what to scan with.

## Check your own site

You can run the same scan we used for this study — free, no signup — at [a11yscope.com](https://www.a11yscope.com). In about six seconds it shows every violation, ranked by the exact severity levels in this report, with a fix-ready code snippet for each.

---

*Citation: A11yScope Accessibility Severity Study, June 2026. 244 distinct domains, 1,000+ total scans, axe-core WCAG 2.1 AA automated rule set, violations classified by axe-core impact rating. You're welcome to cite or republish these figures with a link to this page.*
