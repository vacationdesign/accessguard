---
title: "How to Fix Common Accessibility Issues Found by Automated Scanners"
description: "Just ran an accessibility scan? Learn how to fix the most common WCAG issues that automated scanners detect, with step-by-step code fixes for each violation."
date: 2026-02-21
author: AccessGuard Team
tags: Accessibility, Automated Testing, WCAG
---

# How to Fix Common Accessibility Issues Found by Automated Scanners

You just ran an automated accessibility scan on your website and the report came back with dozens, maybe hundreds, of violations. The list looks overwhelming, but here is the good news: most automated scanners flag the same core set of issues, and every one of them has a straightforward fix. This guide walks you through the most frequently reported violations in the exact order you should tackle them, with code examples you can implement immediately.

Automated accessibility scanners like AccessGuard, axe-core, and Lighthouse can detect roughly 30-40% of all WCAG 2.1 issues. The issues they catch tend to be the most common and most impactful, which means fixing your scan results is the single highest-leverage accessibility improvement you can make.

## Understanding Your Scan Report

Before you start fixing issues, take a moment to understand how scan reports are organized. Most tools categorize violations by severity: critical, serious, moderate, and minor. They also reference specific WCAG 2.1 success criteria, such as 1.1.1 (Non-text Content) or 4.1.2 (Name, Role, Value).

Start with critical and serious violations. These are the issues most likely to completely block users from accessing your content and the ones most likely to trigger legal complaints. Work through moderate and minor issues afterward.

Each violation in your report should include three things: the WCAG rule that was broken, the specific HTML element that failed, and guidance on how to fix it. If your scanner provides element selectors or XPath references, use those to locate the exact code you need to change.

## Missing Alternative Text on Images

**WCAG Criterion:** 1.1.1 Non-text Content (Level A)

This is the single most common violation on the web. Every `<img>` element needs an `alt` attribute. The fix depends on the purpose of the image.

**Informative images** need descriptive alt text:

```html
<!-- Before -->
<img src="team-photo.jpg">

<!-- After -->
<img src="team-photo.jpg" alt="The AccessGuard engineering team at the 2026 company retreat">
```

**Decorative images** that add no information should use an empty alt attribute:

```html
<img src="decorative-divider.svg" alt="">
```

**Linked images** where the image is inside an anchor tag should describe the link destination:

```html
<a href="/products">
  <img src="products-icon.png" alt="Browse our product catalog">
</a>
```

A common mistake is writing alt text like "image of" or "photo of." Screen readers already announce that the element is an image, so the alt text should describe the content directly.

## Empty Links and Buttons

**WCAG Criterion:** 4.1.2 Name, Role, Value (Level A)

Scanners flag this when a link or button has no accessible name. This happens frequently with icon buttons and linked images that lack text.

```html
<!-- Before: icon button with no accessible name -->
<button><svg>...</svg></button>

<!-- After: add aria-label -->
<button aria-label="Close dialog"><svg aria-hidden="true">...</svg></button>
```

For links that only contain an image, the image alt text becomes the link's accessible name:

```html
<!-- Before -->
<a href="/home"><img src="logo.png"></a>

<!-- After -->
<a href="/home"><img src="logo.png" alt="AccessGuard home page"></a>
```

If a link wraps both text and an icon, the text already provides the accessible name. Mark the icon as decorative with `aria-hidden="true"` to prevent screen readers from announcing it redundantly.

## Insufficient Color Contrast

**WCAG Criterion:** 1.4.3 Contrast (Minimum) (Level AA)

Low contrast between text and its background is one of the most frequently flagged issues. WCAG requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18pt or 14pt bold).

The fix is simple but sometimes requires design coordination. Check each flagged element and increase the contrast by either darkening the text or lightening/darkening the background.

```css
/* Before: gray text on white, ratio 2.5:1 */
.subtitle {
  color: #999999;
}

/* After: darker gray, ratio 4.6:1 */
.subtitle {
  color: #767676;
}
```

Use a contrast calculator to verify your changes. Tools like the WebAIM Contrast Checker let you enter foreground and background colors and see the exact ratio. For text overlaid on images or gradients, test the lowest-contrast combination that occurs.

## Missing Form Labels

**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)

Form inputs without associated labels are a critical barrier for screen reader users. Every input must have a programmatically associated label. The most reliable method is the `<label>` element with a matching `for` attribute.

```html
<!-- Before: placeholder used as label -->
<input type="email" placeholder="Email address">

<!-- After: proper label element -->
<label for="email">Email address</label>
<input type="email" id="email" placeholder="you@example.com">
```

If your design requires visually hidden labels, use a CSS class that hides the label visually while keeping it available to screen readers:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

Never rely on `placeholder` alone. Placeholder text disappears when the user starts typing, leaving them with no reference for what the field expects.

## Missing Document Language

**WCAG Criterion:** 3.1.1 Language of Page (Level A)

This is one of the simplest fixes you will encounter. Scanners flag this when the `<html>` element is missing a `lang` attribute. Screen readers use this attribute to select the correct pronunciation engine.

```html
<!-- Before -->
<html>

<!-- After -->
<html lang="en">
```

If your page contains content in multiple languages, add `lang` attributes to the specific elements in a different language:

```html
<p>The French word for hello is <span lang="fr">bonjour</span>.</p>
```

## Heading Hierarchy Issues

**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)

Scanners check for skipped heading levels, such as jumping from `<h1>` directly to `<h3>`, and for missing `<h1>` elements. Headings create the document outline that screen reader users rely on for navigation.

Rules to follow:

- Every page should have exactly one `<h1>` that describes the page content.
- Headings must be nested sequentially: `<h1>`, then `<h2>`, then `<h3>`. Do not skip levels.
- Do not use heading elements purely for visual styling. If you need large bold text that is not a section heading, use CSS on a `<p>` or `<span>` instead.

```html
<!-- Before: skipped heading level -->
<h1>Our Products</h1>
<h3>Featured Items</h3>

<!-- After: correct hierarchy -->
<h1>Our Products</h1>
<h2>Featured Items</h2>
```

## Missing ARIA Attributes on Custom Widgets

**WCAG Criterion:** 4.1.2 Name, Role, Value (Level A)

Custom interactive components like tabs, accordions, dropdowns, and modals need ARIA roles and properties to communicate their behavior to assistive technology.

For a tab interface:

```html
<div role="tablist" aria-label="Product information">
  <button role="tab" aria-selected="true" aria-controls="panel-desc" id="tab-desc">
    Description
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-reviews" id="tab-reviews">
    Reviews
  </button>
</div>
<div role="tabpanel" id="panel-desc" aria-labelledby="tab-desc">
  <!-- Description content -->
</div>
```

The key principle is that custom components must expose the same information to assistive technology that native HTML elements provide automatically. If you can use a native element instead of a custom one, that is almost always the better choice.

## Empty Table Headers

**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)

Data tables must have `<th>` elements that label each column and/or row. Scanners flag tables where `<th>` cells are empty or where data tables use `<td>` for every cell including the header row.

```html
<!-- Before: no table headers -->
<table>
  <tr><td>Name</td><td>Price</td></tr>
  <tr><td>Widget A</td><td>$10.00</td></tr>
</table>

<!-- After: proper headers with scope -->
<table>
  <thead>
    <tr><th scope="col">Name</th><th scope="col">Price</th></tr>
  </thead>
  <tbody>
    <tr><td>Widget A</td><td>$10.00</td></tr>
  </tbody>
</table>
```

## What To Do After Fixing Scanner Results

Once you have resolved the violations from your automated scan, do not stop there. Automated tools catch only a fraction of accessibility issues. The next steps are:

1. **Keyboard testing.** Tab through every page and verify that all interactive elements are reachable, operable, and have visible focus indicators.
2. **Screen reader testing.** Test with at least one screen reader (NVDA on Windows is free) to verify that the content makes sense when read linearly.
3. **Rescan regularly.** New code deployments can introduce regressions. Schedule recurring scans to catch issues before they reach users.

## Automate Your Accessibility Monitoring

Fixing scan results is step one. Keeping your site compliant as it evolves requires ongoing monitoring. [AccessGuard](/) provides automated WCAG 2.1 scanning that you can run on demand or schedule weekly. Every scan generates a prioritized report with specific element references and code-level remediation guidance.

[Run a free scan now](/) to see your current violation count, or explore [AccessGuard's Pro plan](/pricing) for scheduled monitoring, trend tracking, and team collaboration features that keep accessibility on track across every deployment.
