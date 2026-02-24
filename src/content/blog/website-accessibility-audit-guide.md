---
title: "How to Conduct a Website Accessibility Audit: Step-by-Step Guide"
description: "Learn how to conduct a website accessibility audit step by step. Covers automated testing, manual testing, WCAG documentation, and ongoing monitoring."
date: 2026-02-25
author: AccessGuard Team
tags:
  - Accessibility
  - Audit
  - WCAG
  - Testing
---

# How to Conduct a Website Accessibility Audit: Step-by-Step Guide

A website accessibility audit is a structured evaluation of your website against the Web Content Accessibility Guidelines (WCAG) to identify barriers that prevent people with disabilities from using your site. Whether you are a web agency managing client sites or a business owner responsible for your own online presence, knowing how to conduct a thorough audit is no longer optional. It is a fundamental part of maintaining a professional, legally compliant, and inclusive website.

This guide walks you through the entire process from start to finish: what a website accessibility audit actually involves, how to combine automated and manual testing for maximum coverage, how to document and prioritize your findings, and how to set up ongoing monitoring so your site stays compliant as it evolves. No prior accessibility expertise is required, though developers will find the technical details immediately actionable.

## What Is a Website Accessibility Audit and When Do You Need One?

A website accessibility audit systematically examines your site's pages, components, and content against the WCAG 2.1 Level AA success criteria. The goal is to identify every barrier that would prevent someone using assistive technology, a keyboard, or modified display settings from accessing your content and completing tasks on your site.

WCAG 2.1 AA is the standard referenced by nearly all accessibility regulations, including the Americans with Disabilities Act (ADA), Section 508 of the Rehabilitation Act, and the European Accessibility Act. When lawyers, regulators, and advocacy organizations evaluate a website's accessibility, WCAG 2.1 AA is the benchmark they use.

### When you need an audit

You should conduct a website accessibility audit in any of these situations:

- **You have never tested your site for accessibility.** If your website has never been evaluated against WCAG, there is a near certainty that it contains barriers. Most websites do.
- **You are launching a new site or a major redesign.** An audit before launch catches issues when they are cheapest to fix. Retrofitting accessibility after a site has been live for months is significantly more expensive.
- **You received a legal demand letter or complaint.** ADA demand letters related to website accessibility have increased steadily year over year. An audit is the first step in any remediation response.
- **Your organization is subject to regulatory requirements.** Government agencies, education institutions, healthcare organizations, and companies operating in the EU under the European Accessibility Act all have explicit accessibility obligations.
- **You are an agency onboarding a new client.** Running an accessibility audit as part of your discovery process gives you a clear picture of the technical debt you are inheriting and lets you scope remediation accurately.
- **It has been more than six months since your last audit.** Websites change constantly through code deployments, content updates, and third-party script changes. An audit from six months ago does not reflect your current state.

For a detailed breakdown of every WCAG criterion to check, see our [WCAG compliance checklist](/blog/wcag-compliance-checklist-2026).

## Step 1: Define the Scope

Before running any tools or testing any pages, define what your audit will cover.

### Select your pages

A complete audit covers every page on your site, but for large sites this may not be practical in a single pass. At minimum, audit these page types:

- **Homepage**
- **Primary navigation paths** (the pages users reach from your main menu)
- **Forms and interactive flows** (contact forms, checkout, registration, search)
- **Content-heavy pages** (blog posts, product pages, help articles)
- **Authentication pages** (login, password reset, account settings)
- **Error pages** (404, 500, form validation error states)

If your site is template-driven (most CMS-based sites are), auditing one representative page per template can give you efficient coverage of structural issues. Content-level issues like missing alt text still need to be checked across individual pages.

### Define your target standard

For most organizations, the target is **WCAG 2.1 Level AA**. This is the conformance level referenced by the ADA, Section 508, and the European Accessibility Act. Level A criteria are included within AA (AA is a superset of A), so you are automatically covering both.

WCAG 2.2, published by the W3C in October 2023, adds nine new success criteria. Some organizations are beginning to target 2.2 AA, but 2.1 AA remains the legally referenced standard in most jurisdictions as of early 2026.

### Set up your testing environment

Prepare the following before you begin:

- **A modern browser** (Chrome or Firefox) with developer tools open
- **An accessibility testing browser extension** (axe DevTools, WAVE, or similar)
- **A screen reader** (NVDA on Windows, VoiceOver on macOS)
- **A spreadsheet or issue tracker** for documenting findings
- **Access to your site's source code** or CMS (not required for the audit itself, but essential for remediation)

## Step 2: Automated Testing

Automated testing is where every website accessibility audit should begin. Automated scanners evaluate your HTML against a set of programmatic rules and flag violations they can detect with certainty. They are fast, consistent, and excellent at catching structural issues at scale.

### What automated tools catch

Automated scanners reliably detect issues like:

- Missing `alt` attributes on images
- Insufficient color contrast ratios
- Missing form labels and label associations
- Empty links and buttons with no accessible name
- Missing document language (`lang` attribute on `<html>`)
- Skipped heading levels
- Missing ARIA attributes on custom widgets
- Duplicate element IDs
- Missing landmark regions
- Tables without proper header markup

These are among the most common accessibility violations on the web, and catching them automatically saves significant time compared to finding each one manually.

### What automated tools miss

Automated scanners catch roughly 30-40% of WCAG 2.1 success criteria. The remaining 60-70% require human judgment. Here is what automation cannot evaluate:

- **Whether alt text is actually meaningful.** A scanner can verify that an `alt` attribute exists, but it cannot determine whether "image123.jpg" is a useful description.
- **Whether focus order is logical.** Automation can detect that elements are focusable, but it cannot judge whether the tab sequence makes sense to a user.
- **Whether custom widget interactions work correctly.** A scanner can check for ARIA attributes, but it cannot verify that a custom dropdown actually responds to arrow keys as expected.
- **Whether content is understandable.** Reading level, clear language, and meaningful link text require human evaluation.
- **Whether video captions are accurate.** A scanner might detect the presence of a caption track, but it cannot evaluate the quality of the captions.
- **Whether visual presentation is accessible.** Content that relies on spatial positioning, visual grouping, or icon recognition to convey meaning requires human review.

This is why a website accessibility audit that relies solely on automated scanning is fundamentally incomplete. Automated testing is step one, not the entire process.

### Running your automated scan

Start with a full-site scan using [AccessGuard's free scanner](/) or a comparable tool. A full-site scan crawls multiple pages and gives you a comprehensive baseline of detectable violations. Supplement this with page-level scans using a browser extension like axe DevTools on your highest-traffic and highest-risk pages for more granular element-level detail.

Record the total number of violations, the breakdown by severity (critical, serious, moderate, minor), and the specific WCAG success criteria referenced. This becomes the automated portion of your audit report.

## Step 3: Manual Testing

Manual testing is where a website accessibility audit moves from checking code to evaluating the actual user experience. This is the step that separates a superficial scan from a real audit.

### Keyboard testing protocol

Keyboard testing verifies that every part of your site is operable without a mouse. This directly tests WCAG success criteria 2.1.1 (Keyboard), 2.1.2 (No Keyboard Trap), 2.4.3 (Focus Order), and 2.4.7 (Focus Visible).

Disconnect or ignore your mouse entirely. Then work through this protocol on each page:

1. **Press Tab repeatedly from the top of the page.** Verify that focus moves to every interactive element: links, buttons, form inputs, dropdowns, and custom controls. Note any element you cannot reach.
2. **Check focus visibility.** On every element that receives focus, confirm that a visible focus indicator appears. If focus lands on an element and you cannot see where it is, that is a 2.4.7 violation.
3. **Test activation.** Press Enter on links to verify they navigate. Press Enter and Space on buttons to verify they activate. Press Space on checkboxes to toggle them. Press Enter on form submit buttons.
4. **Test complex widgets.** For dropdown menus, tab panels, accordions, date pickers, and modal dialogs, test the expected keyboard interactions:
   - **Menus:** Arrow keys navigate between items, Enter selects, Escape closes
   - **Tabs:** Arrow keys switch between tabs, Tab moves into the panel content
   - **Modals:** Focus is trapped inside the modal, Escape closes it, focus returns to the triggering element on close
   - **Accordions:** Enter or Space toggles sections, arrow keys move between headers
5. **Check for keyboard traps.** At every point, verify that you can Tab away from the current element. If focus gets stuck inside a component with no way to exit using the keyboard, that is a critical 2.1.2 violation.
6. **Test skip navigation.** Press Tab once from the top of the page. A "Skip to main content" link should appear. Press Enter and verify that focus moves past the navigation to the main content area.

Document every failure with the page URL, the element description, the expected behavior, and the actual behavior.

### Screen reader testing

Screen reader testing evaluates how your site is experienced by users who cannot see the screen. It tests criteria across all four WCAG principles, with particular emphasis on success criteria like 1.1.1 (Non-text Content), 1.3.1 (Info and Relationships), 4.1.2 (Name, Role, Value), and 4.1.3 (Status Messages).

Use at least one screen reader. NVDA is free and widely used on Windows. VoiceOver is built into macOS and iOS. For the most thorough coverage, test with both a desktop and a mobile screen reader.

Work through each page and evaluate these areas:

- **Page title and landmarks.** When the page loads, does the screen reader announce a descriptive page title? Can you use landmark navigation (NVDA: D key, VoiceOver: rotor) to jump between header, navigation, main content, and footer?
- **Headings.** Navigate by headings (NVDA: H key, VoiceOver: rotor set to Headings). Do the heading levels form a logical hierarchy? Do they accurately describe the sections they introduce?
- **Images.** When the screen reader encounters images, does it announce meaningful alt text? Are decorative images correctly hidden from the reading order?
- **Forms.** Tab through form fields and verify that the screen reader announces the label for each input. When you trigger a validation error, does the screen reader announce the error message and its association with the relevant field?
- **Dynamic content.** Trigger actions that update the page without a full reload: adding items to a cart, submitting a form, opening an accordion, loading search results. Does the screen reader announce the change? If the site uses `aria-live` regions, verify that updates are announced without stealing focus.
- **Links and buttons.** Navigate through links and buttons and verify that each one has a descriptive accessible name. "Read more" and "Click here" without additional context are failures of success criterion 2.4.4 (Link Purpose in Context).

### Visual inspection

Visual inspection catches issues that neither automated tools nor assistive technology testing will surface:

- **Content reflow.** Zoom the browser to 200% and verify that all content remains visible and functional without horizontal scrolling (success criterion 1.4.10, Reflow). Also test at 320 CSS pixels viewport width.
- **Text spacing.** Use a browser extension or custom CSS to override text spacing: line height to 1.5 times the font size, paragraph spacing to 2 times the font size, letter spacing to 0.12 times the font size, and word spacing to 0.16 times the font size. Verify that no content is clipped, truncated, or overlapped (success criterion 1.4.12, Text Spacing).
- **Color independence.** Review all content where color is used to convey information: error states, required field indicators, chart data, status badges. Verify that a non-color indicator is also present, such as an icon, text label, pattern, or underline (success criterion 1.4.1, Use of Color).
- **Motion and animation.** Check for auto-playing animations, carousels, or moving content. Verify that users can pause, stop, or hide any auto-updating content (success criterion 2.2.2, Pause, Stop, Hide). Check that no content flashes more than three times per second (success criterion 2.3.1).

## Step 4: Documenting Your Findings

A website accessibility audit is only as useful as its documentation. Every issue you identify needs to be recorded with enough detail that a developer can locate the problem, understand the requirement, and implement a fix without additional research.

### What to include for each finding

For every issue, document the following:

- **Page URL** where the issue occurs
- **Element identification** (CSS selector, screenshot, or description sufficient to locate the element)
- **WCAG success criterion** that is violated (e.g., 1.4.3 Contrast Minimum)
- **Conformance level** (A or AA)
- **Severity** (critical, serious, moderate, or minor)
- **Description** of the barrier: what is wrong and who is affected
- **Remediation recommendation** with specific steps or code changes to fix the issue
- **Testing method** that identified the issue (automated scan, keyboard test, screen reader, visual inspection)

### Severity classification

Consistent severity classification is essential for prioritization. Use these definitions:

- **Critical:** The issue completely blocks access to content or functionality for one or more user groups. Examples: a keyboard trap that prevents navigation, a form that cannot be submitted without a mouse, a page with no accessible content because all information is in untagged images.
- **Serious:** The issue causes significant difficulty for users with disabilities but does not completely block access. Examples: contrast ratio below 3:1 on body text, missing labels on form inputs that can still be guessed from context, focus indicators that are technically visible but extremely faint.
- **Moderate:** The issue creates inconvenience or confusion but users can still accomplish their task. Examples: heading hierarchy that skips a level but is otherwise logical, link text that is vague but understandable in context, a missing landmark region on a simple page.
- **Minor:** The issue is a technical violation that has minimal user impact. Examples: a redundant ARIA role on a native element, a missing `lang` attribute on a short inline foreign phrase, a decorative image with a non-empty but non-harmful alt text.

### Reporting format

Organize your findings in a format that serves both technical and non-technical stakeholders:

- **Executive summary** with total issue count by severity, overall conformance level, and highest-risk areas
- **Detailed findings table** with every individual issue, sortable by severity and WCAG criterion
- **Remediation roadmap** with recommended fix order and effort estimates
- **Testing methodology** section describing the tools, screen readers, and browsers used

## Step 5: Prioritizing Remediation

Not all accessibility issues carry the same weight. A critical-path prioritization approach ensures you fix the issues that matter most to real users first.

### Prioritize by user impact on critical paths

Identify the critical user paths on your site: the sequences of pages and actions that users follow most frequently to accomplish their primary goals. For an e-commerce site, this might be homepage, product listing, product detail, cart, and checkout. For a SaaS product, it might be landing page, signup, onboarding, and core feature. For a content site, it might be homepage, category page, and article page.

Fix all critical and serious issues on these paths first. A keyboard trap in your checkout flow is more urgent than a minor heading hierarchy issue on your about page, even though both are WCAG violations.

### Recommended remediation order

Within each critical path, fix issues in this order:

1. **Critical issues on critical paths.** These are complete blockers for users with disabilities on your most important pages. Fix them immediately.
2. **Serious issues on critical paths.** These create significant difficulty on your most important pages. Fix them within the current sprint or work cycle.
3. **Critical issues on secondary pages.** Complete blockers on less-trafficked pages. Schedule within two to four weeks.
4. **Serious issues on secondary pages.** Significant barriers on less-trafficked pages. Schedule within the current month.
5. **Moderate issues across the site.** Inconveniences and confusing patterns. Address as part of normal development work over the following one to three months.
6. **Minor issues across the site.** Technical violations with minimal user impact. Address during code cleanup or when touching related code.

### Group related fixes

Many accessibility issues share a common root cause. A missing CSS focus style on one button means it is likely missing across the entire site. A form component without label associations probably appears on multiple pages. Fixing the root cause once (updating a shared component, adding a global CSS rule, modifying a CMS template) resolves the issue everywhere it appears.

Identify these systematic fixes and prioritize them highly. They deliver the largest accessibility improvement per hour of development effort.

### Effort estimation

Classify each fix by implementation effort to help with sprint planning:

- **Quick fix (under 30 minutes):** Adding alt text, adding a lang attribute, fixing a single contrast value, adding an aria-label
- **Standard fix (30 minutes to 2 hours):** Refactoring a component to use semantic HTML, adding keyboard handling to a custom widget, fixing focus management in a modal
- **Complex fix (half day or more):** Rebuilding a custom date picker to be accessible, redesigning a color system for sufficient contrast, adding caption support to a video player

## Step 6: Setting Up Ongoing Monitoring

A website accessibility audit is a snapshot. The moment it is complete, your site begins drifting. Code deployments, content updates, design changes, and third-party script updates all introduce new accessibility issues on an ongoing basis.

The organizations that maintain accessibility over time are the ones that treat monitoring as infrastructure, not as a one-time project. Here is what an effective ongoing program looks like:

### Automated scheduled scanning

Set up automated scans that run on a regular cadence, ideally weekly. Each scan should cover your full site and compare results against the previous scan so you can immediately see regressions. A weekly scan aligned with your development sprint cycle catches most regressions within days of introduction. For more on why weekly cadence matters, read our guide on [weekly monitoring](/blog/website-accessibility-monitoring-weekly-scans).

### Regression detection

Your monitoring should alert you when your violation count increases or when new categories of violations appear. A spike in missing alt text violations after a content push or a new contrast failure after a CSS update should be flagged immediately so the responsible team can act.

### Integrate into your development workflow

Accessibility checks should be part of your continuous integration pipeline. Run automated checks on pull requests before code merges. Add accessibility to your code review checklist. Test new components with a keyboard before approving them. The earlier you catch issues in the development cycle, the cheaper they are to fix.

### Periodic manual re-audits

Supplement your automated monitoring with manual audits on a quarterly or semi-annual basis. Manual testing catches the 60-70% of issues that automation misses and verifies that the overall user experience for people with disabilities is actually functional, not just technically compliant.

## Start Your Audit with AccessGuard

If you have read this far, you understand what a website accessibility audit involves and why it matters. The next step is to run one.

[AccessGuard's free scanner](/) gives you an immediate baseline. It crawls your site, tests against WCAG 2.1 AA criteria, and delivers a prioritized report with specific element references and remediation guidance. You will know exactly where your site stands in minutes.

For ongoing protection, [AccessGuard's Pro plan](/#pricing) includes scheduled weekly scans, historical trend tracking, regression alerts, and exportable compliance reports. It is built for both agencies managing multiple client sites and business owners who need to stay compliant without hiring a full-time accessibility specialist.

A website accessibility audit is not a one-time checkbox. It is the starting point of an ongoing commitment to an inclusive web. Run your first scan today and take the first step.
