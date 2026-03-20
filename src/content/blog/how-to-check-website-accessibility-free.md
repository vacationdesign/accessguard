---
title: "How to Check Your Website Accessibility for Free (Step-by-Step Guide)"
description: "Learn how to check your website for accessibility issues using free tools. This guide covers automated scanning, keyboard testing, screen reader checks, and browser DevTools — no budget required."
date: 2026-03-03
author: A11yScope Team
tags:
  - Accessibility
  - Testing
  - Free Tools
  - WCAG
---

# How to Check Your Website Accessibility for Free

You suspect your website has accessibility issues but do not know where to start. Maybe a customer mentioned they could not use your checkout form with a screen reader, or you read that ADA lawsuits are increasing and want to check your exposure. The good news: you do not need to hire a consultant or buy expensive software to get a clear picture of your site's accessibility. Several powerful free tools exist, and combining them gives you a thorough audit that covers both automated detection and manual verification.

This guide walks you through exactly how to check your website accessibility for free, using a step-by-step process that moves from quick automated scans to deeper manual testing. By the end, you will know what issues your site has, how severe they are, and what to fix first.

## Step 1: Run a Free Automated Accessibility Scan

The fastest way to get an accessibility baseline is to run your URL through an automated scanner. These tools check your page against WCAG 2.1 success criteria and report specific violations with element references and fix suggestions.

### A11yScope (Free Online Scanner)

[A11yScope](/) is a free website accessibility checker that scans any URL against WCAG 2.1 AA standards. Enter your URL on the homepage, and within about 6 seconds you get:

- An accessibility score out of 100
- A list of every WCAG violation found, grouped by severity
- The exact HTML element causing each issue
- Fix-ready code snippets for every violation
- A summary of which WCAG success criteria passed and failed

A11yScope uses a real browser engine to render your page (including JavaScript), then runs axe-core — the same engine behind Google Lighthouse and Microsoft Accessibility Insights — to test against 38+ rules. The free tier gives you 5 scans per hour with no account required.

### Google Lighthouse (Built Into Chrome)

Lighthouse is built into Chrome DevTools and includes an accessibility audit:

1. Open Chrome and navigate to your page.
2. Press F12 to open DevTools.
3. Click the **Lighthouse** tab.
4. Check only **Accessibility** under Categories.
5. Click **Analyze page load**.

Lighthouse returns a score and a list of failing audits. It uses axe-core under the hood, so the results overlap with A11yScope. However, Lighthouse runs against the initial page load only and may miss issues in dynamic content, modals, or content loaded after user interaction.

### WAVE (Web Accessibility Evaluation Tool)

WAVE from WebAIM is a free browser extension that overlays accessibility information directly on your page. Install the extension for Chrome or Firefox, navigate to your page, and click the WAVE icon. It highlights errors, alerts, and structural elements inline, making it easy to see exactly where issues occur.

WAVE is particularly good for visual inspection because it annotates the page itself rather than just listing violations in a separate panel.

Each of these tools has different strengths depending on your workflow and technical level. If you want a deeper look at how they compare, including CI/CD integrations and monitoring platforms, see our [full testing tools comparison](/blog/website-accessibility-testing-tools-compared).

## Step 2: Test Keyboard Navigation

Automated scanners catch roughly 30-40% of accessibility issues. Keyboard testing is the single most important manual check you can do, and it is completely free.

### How to keyboard test your website

1. Put your mouse away. Seriously — do not touch it.
2. Open your website in a browser.
3. Press **Tab** to move forward through interactive elements (links, buttons, form fields).
4. Press **Shift+Tab** to move backward.
5. Press **Enter** to activate links and buttons.
6. Press **Space** to toggle checkboxes and activate buttons.
7. Press **Escape** to close modals and dropdowns.
8. Use **Arrow keys** to navigate within menus, tabs, and radio groups.

### What to check during keyboard testing

- **Can you reach every interactive element?** If you cannot Tab to a button or link, keyboard and screen reader users cannot use it either.
- **Can you see where you are?** Every focused element should have a visible focus indicator (typically an outline or highlight). If focus disappears, you have an invisible focus problem.
- **Can you operate everything?** Dropdowns should open with Enter or Space and navigate with arrow keys. Modals should trap focus inside them and close with Escape.
- **Can you get out of everything?** If focus gets trapped somewhere and you cannot Tab away, you have a keyboard trap — a critical WCAG violation (SC 2.1.2).
- **Is the tab order logical?** Focus should move through elements in a visual and logical sequence, generally left-to-right and top-to-bottom.

Keyboard testing takes 5-10 minutes per page and catches issues that no automated tool can detect. Make it part of every code review.

## Step 3: Check Color Contrast

Insufficient color contrast is one of the most common accessibility failures. WCAG requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18px bold or 24px regular).

### Free contrast checking tools

- **Chrome DevTools**: Inspect any text element, and the color picker shows the contrast ratio against the background along with a pass/fail indicator for WCAG AA and AAA.
- **WebAIM Contrast Checker** (webaim.org/resources/contrastchecker): Enter foreground and background hex colors to see the exact ratio and whether it passes each WCAG level.
- **A11yScope**: Automatically flags every element on your page that fails contrast requirements during its scan.

### Common contrast failures to watch for

- Light gray text on white backgrounds (#999 on #fff is only 2.85:1)
- White text on colored buttons (check that your brand colors provide enough contrast)
- Placeholder text in form fields (default placeholder styles often fail contrast)
- Text over images or gradients (check the worst-case combination)

For a comprehensive guide including UI component contrast and focus indicator requirements, see our [color contrast accessibility guide](/blog/color-contrast-accessibility-guide).

## Step 4: Test With a Screen Reader

Screen reader testing is the closest thing to experiencing your site as a blind or low-vision user does. Two excellent screen readers are completely free:

- **NVDA** (NonVisual Desktop Access) — Free, open-source, Windows. Download from nvaccess.org.
- **VoiceOver** — Built into every Mac, iPhone, and iPad. No installation needed. On Mac, press Cmd+F5 to toggle it on.

### Quick screen reader test checklist

1. **Page title**: Does the screen reader announce a descriptive page title when the page loads?
2. **Headings**: Press H (NVDA) or use the rotor (VoiceOver) to jump between headings. Are headings present, in logical order, and descriptive?
3. **Images**: Navigate to images. Does the screen reader announce meaningful alternative text, or does it read the filename?
4. **Links**: Tab through links. Does each link describe its destination, or do you hear "click here" and "read more" repeatedly?
5. **Forms**: Navigate to form fields. Does the screen reader announce the label for each input? Can you complete and submit the form?
6. **Dynamic content**: Trigger actions that update page content (add to cart, submit a form, open a tab). Does the screen reader announce the change?

Even 10 minutes of screen reader testing will reveal issues that automated tools completely miss. For a deeper walkthrough, see our [screen reader testing guide for developers](/blog/screen-reader-testing-guide-for-developers).

## Step 5: Check Your Page Structure

Good page structure helps screen reader users navigate efficiently. You can check structure for free using browser DevTools or accessibility-focused extensions.

### Heading hierarchy

Open DevTools (F12), go to the Console tab, and paste:

```javascript
document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h =>
  console.log(h.tagName, h.textContent.trim().substring(0, 60))
);
```

This prints every heading on the page with its level. Check that:
- There is exactly one H1.
- Headings do not skip levels (no H1 followed directly by H3).
- Headings describe the content of their sections.

### Landmark regions

Screen reader users can jump between landmark regions. Check that your page uses:
- `<header>` or `role="banner"` for the site header
- `<nav>` or `role="navigation"` for navigation menus
- `<main>` or `role="main"` for the primary content area
- `<footer>` or `role="contentinfo"` for the site footer

### Language attribute

Check that your `<html>` element has a `lang` attribute:

```html
<html lang="en">
```

This tells screen readers which pronunciation engine to use. Missing language declarations are one of the most common automated scan findings.

## Step 6: Check Mobile Accessibility

Over 50% of web traffic comes from mobile devices, and accessibility issues often differ between desktop and mobile.

### Free mobile accessibility checks

- **Responsive design**: Resize your browser to 320px wide. WCAG requires that content reflows without horizontal scrolling at this width (SC 1.4.10).
- **Touch target size**: WCAG 2.2 requires a minimum touch target size of 24x24 CSS pixels (SC 2.5.8). Check that buttons and links are large enough to tap accurately.
- **Pinch zoom**: Make sure your page does not block pinch-to-zoom. Check that your viewport meta tag does not include `maximum-scale=1` or `user-scalable=no`.

```html
<!-- Correct: allows zoom -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Incorrect: blocks zoom, fails WCAG SC 1.4.4 -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

## What to Fix First

After completing these checks, you will likely have a list of issues. Prioritize them in this order:

1. **Critical blockers**: Keyboard traps, missing form labels, completely inaccessible interactive components. These prevent users from completing tasks.
2. **High-impact issues**: Missing alt text on informational images, insufficient color contrast on body text, missing page language. These affect large numbers of users.
3. **Medium-impact issues**: Heading hierarchy problems, missing landmark regions, poor link text. These reduce usability but do not completely block access.
4. **Low-impact issues**: Minor contrast failures on decorative elements, redundant ARIA attributes, best-practice recommendations.

For code-level guidance on fixing the most common issues, see our guide on [fixing accessibility issues found by automated scanners](/blog/fix-accessibility-issues-automated-scanners).

## How Often Should You Check?

Accessibility is not a one-time task. Your website changes constantly — new pages, updated content, third-party script updates, CMS changes — and each change can introduce regressions.

- **Every code deployment**: Run an automated scan before or after each deploy.
- **Monthly**: Do a keyboard test of your key user journeys (homepage, search, checkout, contact).
- **Quarterly**: Conduct a full manual audit including screen reader testing.
- **Annually**: Review against the latest WCAG version. WCAG 2.2 introduced [nine new success criteria](/blog/wcag-2-2-whats-new) that may affect your site.

For teams that want automated monitoring without manual effort, [A11yScope's Pro plan](/#pricing) runs scheduled weekly scans and alerts you when new issues appear.

## Free vs. Paid Accessibility Testing: What You Get

The free tools covered in this guide are genuinely powerful. For a detailed side-by-side comparison of both free and paid options, see our [accessibility testing tools comparison](/blog/website-accessibility-testing-tools-compared). Here is what changes when you move to a paid solution:

| Capability | Free Tools | A11yScope Pro ($49/mo) |
|---|---|---|
| Automated WCAG scanning | Yes (5 scans/hr on A11yScope) | Unlimited scans |
| Code fix suggestions | Yes | Yes, with priority support |
| PDF report export | No | Yes |
| Scheduled monitoring | No | Weekly automated scans |
| Historical trend tracking | No | Yes |
| Multi-page crawling | Limited | Full site crawl |

For small sites and personal projects, the free approach described in this guide is sufficient. For businesses that need ongoing compliance documentation, scheduled monitoring, and team workflows, a paid tool saves significant time.

If you use a specific platform, we have dedicated guides with platform-specific fixes: [Shopify](/blog/shopify-accessibility-guide), [WordPress](/blog/wordpress-accessibility-guide), and [Webflow](/blog/webflow-accessibility-guide).

## Start Your Free Accessibility Check Now

The simplest first step is an automated scan. [Enter your URL on A11yScope's homepage](/) and you will have a detailed accessibility report in under 10 seconds — free, no sign-up required.

Combine that scan with 10 minutes of keyboard testing and a quick screen reader check, and you will have a thorough picture of your site's accessibility posture without spending a dollar.

If you want a structured checklist to work through, our [WCAG compliance checklist for 2026](/blog/wcag-compliance-checklist-2026) covers every Level AA requirement with code examples. For businesses concerned about legal exposure, our [ADA compliance guide for small businesses](/blog/ada-website-compliance-guide-small-businesses) explains the legal landscape and what steps to take.

Web accessibility matters — for your users, your business, and increasingly, the law. It also has a measurable impact on search rankings: semantic HTML, heading structure, and descriptive link text are accessibility requirements that search engines reward. For a detailed breakdown, see our guide on [how WCAG compliance improves SEO](/blog/accessibility-and-seo-how-wcag-improves-search-rankings). Start checking today.
