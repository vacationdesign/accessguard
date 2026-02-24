---
title: "The Complete WCAG Compliance Checklist for 2026: Audit Your Website Step by Step"
description: "Use this WCAG compliance checklist to audit your website against WCAG 2.1 AA standards. Practical fixes, code examples, and actionable steps for developers."
date: 2026-02-24
author: AccessGuard Team
tags:
  - WCAG
  - Compliance
  - Checklist
---

# The Complete WCAG Compliance Checklist for 2026: Audit Your Website Step by Step

If you have ever tried to make a website accessible and felt overwhelmed by the sheer volume of guidelines, you are not alone. A structured **WCAG compliance checklist** is the single most effective tool for cutting through the complexity, organizing your audit, and making real progress toward an inclusive website. This guide gives you exactly that: a practical, developer-friendly walkthrough of every major WCAG 2.1 AA requirement, complete with code examples you can apply today.

The Web Content Accessibility Guidelines (WCAG) 2.1, published by the W3C, are the global benchmark for web accessibility. Level AA conformance is the standard referenced by most laws and regulations, including the ADA, the European Accessibility Act, and Section 508. Whether you are a front-end developer, a product owner, or a site administrator, this checklist will help you identify gaps and fix them systematically.

## How to Use This WCAG Compliance Checklist

Before diving into individual criteria, establish a workflow:

1. **Pick a scope.** Audit your most-visited pages first: the homepage, key landing pages, forms, and checkout flows.
2. **Combine automated and manual testing.** Automated scanners catch roughly 30-40% of accessibility issues. The rest require manual review, keyboard testing, and screen reader verification.
3. **Document everything.** Track each issue, its WCAG success criterion, severity, and remediation status in a spreadsheet or issue tracker.
4. **Retest after fixes.** Accessibility is not a one-time task. Integrate checks into your CI/CD pipeline and design review process.

The checklist below is organized around the four foundational principles of WCAG: Perceivable, Operable, Understandable, and Robust (often abbreviated as POUR).

---

## Principle 1: Perceivable

Users must be able to perceive all information and interface components. Content cannot be invisible to every sense available to a user.

### 1.1 Text Alternatives (Success Criterion 1.1.1)

Every non-text element needs a text alternative that serves the same purpose.

**What to check:**

- All `<img>` elements have an `alt` attribute.
- Decorative images use an empty `alt=""` so screen readers skip them.
- Complex images (charts, infographics) have extended descriptions.
- Icon fonts and SVGs used as controls have accessible labels.

**Common fix -- adding alt text:**

```html
<!-- Incorrect: missing alt -->
<img src="dashboard-chart.png">

<!-- Correct: descriptive alt -->
<img src="dashboard-chart.png" alt="Bar chart showing monthly revenue increasing from $12k in January to $38k in June">

<!-- Correct: decorative image -->
<img src="decorative-swirl.svg" alt="">
```

**Common fix -- labeling an SVG icon button:**

```html
<button aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false">
    <use href="#icon-close"></use>
  </svg>
</button>
```

### 1.2 Time-Based Media (Success Criteria 1.2.1 -- 1.2.5)

Audio and video content must have alternatives.

**What to check:**

- Pre-recorded video has synchronized captions.
- Pre-recorded audio has a transcript.
- Pre-recorded video has an audio description track (or a descriptive transcript) for visual-only information.
- Live video has real-time captions.

### 1.3 Info and Relationships (Success Criterion 1.3.1)

Structure conveyed visually must also be conveyed programmatically.

**What to check:**

- Headings use proper `<h1>` through `<h6>` tags in a logical hierarchy (no skipping levels).
- Data tables use `<th>` elements with `scope` attributes.
- Form inputs are associated with `<label>` elements.
- Lists use `<ul>`, `<ol>`, or `<dl>` markup rather than styled `<div>` elements.
- Landmark regions (`<header>`, `<nav>`, `<main>`, `<footer>`) are used correctly.

**Common fix -- properly structured data table:**

```html
<table>
  <caption>Q1 Sales by Region</caption>
  <thead>
    <tr>
      <th scope="col">Region</th>
      <th scope="col">January</th>
      <th scope="col">February</th>
      <th scope="col">March</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">North America</th>
      <td>$142,000</td>
      <td>$158,000</td>
      <td>$173,000</td>
    </tr>
  </tbody>
</table>
```

### 1.3 Meaningful Sequence and Sensory Characteristics (1.3.2 -- 1.3.3)

- The DOM reading order matches the visual order.
- Instructions do not rely solely on shape, color, size, or location (e.g., "click the green button on the right").

### 1.4 Distinguishable Content (Success Criteria 1.4.1 -- 1.4.13)

This group of criteria ensures users can see and hear content clearly.

**What to check:**

- **Color is not the only indicator** (1.4.1). Error states, links within text, and status changes use more than color alone -- add icons, underlines, or text labels.
- **Text contrast ratio** is at least 4.5:1 for normal text and 3:1 for large text (1.4.3).
- **Non-text contrast** for UI components and graphical objects is at least 3:1 (1.4.11).
- Text can be **resized up to 200%** without loss of content or functionality (1.4.4).
- **Content reflows** at 320 CSS pixels wide without horizontal scrolling (1.4.10).
- **Text spacing** can be overridden without breaking layout (1.4.12).

**Common fix -- ensuring sufficient link contrast within text:**

```css
/* Links within body text need to be distinguishable
   without relying on color alone */
p a {
  color: #0055b3;            /* 4.9:1 ratio against white */
  text-decoration: underline; /* non-color indicator */
}

p a:hover,
p a:focus {
  color: #003d80;
  text-decoration-thickness: 2px;
}
```

**Common fix -- supporting user text spacing overrides:**

```css
/* Avoid fixed heights on text containers.
   Use min-height or let the container grow. */
.card-body {
  min-height: 4rem;  /* not height: 4rem */
  padding: 1em;
  overflow: visible;  /* not overflow: hidden */
}
```

---

## Principle 2: Operable

All interface components and navigation must be operable by all users, including those who rely on keyboards, switches, or voice control.

### 2.1 Keyboard Accessible (Success Criteria 2.1.1 -- 2.1.4)

**What to check:**

- Every interactive element is reachable and operable with the keyboard alone.
- There are no keyboard traps -- users can always Tab away from a component.
- Custom widgets (dropdowns, modals, sliders) follow WAI-ARIA authoring practices for keyboard interaction.

**Common fix -- making a custom button keyboard accessible:**

```html
<!-- Incorrect: div acting as button, not keyboard accessible -->
<div class="btn" onclick="submitForm()">Submit</div>

<!-- Correct: use a real button element -->
<button type="submit" class="btn">Submit</button>

<!-- If you must use a div (rare), add role and keyboard handling -->
<div class="btn" role="button" tabindex="0"
     onclick="submitForm()"
     onkeydown="if(event.key==='Enter'||event.key===' ')submitForm()">
  Submit
</div>
```

### 2.2 Enough Time (Success Criteria 2.2.1 -- 2.2.2)

- Users can turn off, adjust, or extend time limits (session timeouts, auto-advancing carousels).
- Moving, blinking, or auto-updating content can be paused, stopped, or hidden.

### 2.3 Seizures and Physical Reactions (Success Criterion 2.3.1)

- No content flashes more than three times per second.

### 2.4 Navigable (Success Criteria 2.4.1 -- 2.4.10)

This is one of the largest groups in your WCAG compliance checklist and one of the most impactful for usability.

**What to check:**

- A **skip navigation** link is the first focusable element on the page.
- Every page has a descriptive `<title>`.
- **Focus order** is logical and follows the visual layout.
- **Link purpose** is clear from the link text alone (avoid "click here" or "read more" without context).
- Multiple ways to find pages exist (navigation menu, sitemap, search).
- Headings and labels accurately describe content.
- **Focus is visible** on all interactive elements.

**Common fix -- skip navigation link:**

```html
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header><!-- site header and nav --></header>
  <main id="main-content">
    <!-- page content -->
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.skip-link:focus {
  position: fixed;
  top: 0;
  left: 0;
  width: auto;
  height: auto;
  padding: 0.75em 1.5em;
  background: #000;
  color: #fff;
  z-index: 10000;
  font-size: 1rem;
}
```

### 2.5 Input Modalities (Success Criteria 2.5.1 -- 2.5.4)

- Pointer gestures that require multipoint or path-based input (pinch, swipe) have single-pointer alternatives.
- Pointer actions can be cancelled (use `mouseup` / `keyup` rather than `mousedown` / `keydown` for activation).
- Visible labels match accessible names so voice control users can activate controls.
- Motion-based input (shake to undo) has a conventional UI alternative.

---

## Principle 3: Understandable

Content and controls must be understandable to users.

### 3.1 Readable (Success Criteria 3.1.1 -- 3.1.2)

**What to check:**

- The page declares its language with a `lang` attribute on `<html>`.
- Passages in a different language are marked up with their own `lang` attribute.

**Common fix:**

```html
<html lang="en">
  <body>
    <p>Welcome to our site.</p>
    <p lang="fr">Bienvenue sur notre site.</p>
  </body>
</html>
```

### 3.2 Predictable (Success Criteria 3.2.1 -- 3.2.5)

- Focusing on an element does not automatically trigger a change of context (like navigating to a new page).
- Changing a form input value does not automatically submit the form or navigate away without warning.
- Navigation patterns are consistent across pages.

### 3.3 Input Assistance (Success Criteria 3.3.1 -- 3.3.4)

Forms are where most real-world accessibility failures happen. This section of the checklist deserves extra attention.

**What to check:**

- **Error identification**: Errors are described in text and linked to the relevant field.
- **Labels and instructions**: Every input has a visible label and, where needed, format hints.
- **Error suggestion**: When an error is detected and a correction is known, it is suggested to the user.
- **Error prevention**: For legal, financial, or data-deletion actions, submissions are reversible, verified, or confirmed.

**Common fix -- accessible inline error messages:**

```html
<div class="form-group">
  <label for="email">Email address</label>
  <input
    type="email"
    id="email"
    name="email"
    aria-describedby="email-error"
    aria-invalid="true"
  >
  <p id="email-error" class="error-message" role="alert">
    Please enter a valid email address, for example name@domain.com
  </p>
</div>
```

```css
.error-message {
  color: #b30000;          /* sufficient contrast */
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

input[aria-invalid="true"] {
  border: 2px solid #b30000;
  /* Also add an icon -- do not rely on border color alone */
  background: url('error-icon.svg') no-repeat right 0.5rem center;
  background-size: 1rem;
  padding-right: 2rem;
}
```

---

## Principle 4: Robust

Content must be robust enough to work reliably with current and future technologies, including assistive technologies.

### 4.1 Compatible (Success Criteria 4.1.1 -- 4.1.3)

**What to check:**

- HTML is well-formed and **validates** without critical parsing errors.
- All interactive elements have a **name, role, and value** that assistive technology can read.
- **Status messages** (success alerts, progress updates, cart item counts) are communicated to screen readers without stealing focus.

**Common fix -- live region for status messages:**

```html
<!-- Cart count update announced to screen readers -->
<div aria-live="polite" aria-atomic="true" class="cart-status">
  3 items in your cart
</div>

<!-- Form submission success message -->
<div role="status" aria-live="polite">
  Your message has been sent successfully.
</div>
```

**Common fix -- custom select with proper ARIA roles:**

```html
<div role="combobox" aria-expanded="false" aria-haspopup="listbox"
     aria-labelledby="color-label">
  <span id="color-label">Choose a color</span>
  <input type="text" aria-autocomplete="list"
         aria-controls="color-listbox">
  <ul id="color-listbox" role="listbox" hidden>
    <li role="option" id="opt-red">Red</li>
    <li role="option" id="opt-blue">Blue</li>
    <li role="option" id="opt-green">Green</li>
  </ul>
</div>
```

---

## Quick-Reference WCAG Compliance Checklist

Use this condensed list during development reviews and pull requests:

| Category | Check | WCAG SC |
|---|---|---|
| Images | All images have meaningful or empty `alt` | 1.1.1 |
| Video | Captions present and synchronized | 1.2.2 |
| Structure | Heading hierarchy is logical, no skipped levels | 1.3.1 |
| Forms | Every input has a `<label>` | 1.3.1 |
| Landmarks | Page uses `<header>`, `<nav>`, `<main>`, `<footer>` | 1.3.1 |
| Color | Text contrast meets 4.5:1 (normal) or 3:1 (large) | 1.4.3 |
| Color | Info is not conveyed by color alone | 1.4.1 |
| Reflow | Content works at 320px width, no horizontal scroll | 1.4.10 |
| Keyboard | All controls reachable and operable via keyboard | 2.1.1 |
| Keyboard | No keyboard traps | 2.1.2 |
| Navigation | Skip link present | 2.4.1 |
| Navigation | Page `<title>` is descriptive | 2.4.2 |
| Focus | Focus indicator visible on all interactive elements | 2.4.7 |
| Links | Link text describes destination | 2.4.4 |
| Language | `<html>` has `lang` attribute | 3.1.1 |
| Forms | Errors identified in text and linked to fields | 3.3.1 |
| Forms | Labels and instructions provided | 3.3.2 |
| Parsing | HTML validates without critical errors | 4.1.1 |
| ARIA | Interactive widgets have name, role, value | 4.1.2 |
| Status | Status messages use `aria-live` regions | 4.1.3 |

---

## Common Mistakes That Fail WCAG Audits

Even experienced teams make these errors repeatedly. Watch for them in your code reviews:

### Missing Focus Styles

Removing the browser default outline without replacing it is one of the fastest ways to fail an audit.

```css
/* Do NOT do this without a replacement */
*:focus {
  outline: none;
}

/* Instead, create a custom focus indicator */
:focus-visible {
  outline: 3px solid #1a73e8;
  outline-offset: 2px;
  border-radius: 2px;
}
```

### Placeholder Text as Labels

Placeholder text disappears when the user starts typing, leaving them without context. It also typically fails contrast requirements.

```html
<!-- Incorrect: placeholder instead of label -->
<input type="text" placeholder="Enter your name">

<!-- Correct: visible label plus optional placeholder -->
<label for="full-name">Full name</label>
<input type="text" id="full-name" placeholder="e.g., Jane Doe">
```

### Auto-Playing Media

Video or audio that plays automatically can be disorienting and make a page unusable for screen reader users.

```html
<!-- Incorrect -->
<video autoplay src="promo.mp4"></video>

<!-- Correct: no autoplay, with controls -->
<video controls src="promo.mp4">
  <track kind="captions" src="promo-captions.vtt" srclang="en" label="English">
</video>
```

### Inaccessible Modal Dialogs

Modals that do not trap focus or that lack a close mechanism are a frequent source of keyboard traps.

```html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm your selection</h2>
  <p>Are you sure you want to proceed?</p>
  <button type="button">Cancel</button>
  <button type="button">Confirm</button>
</div>
```

When the modal opens, move focus to the first interactive element inside it. When it closes, return focus to the element that triggered it. Ensure the Escape key closes the dialog.

---

## Testing Your WCAG Compliance Checklist

A thorough audit combines multiple approaches:

### Automated Testing

Run a scanner to catch low-hanging fruit: missing alt text, contrast failures, missing labels, and invalid ARIA. Automated tools are excellent for catching structural issues at scale, but they cannot evaluate whether alt text is meaningful or whether focus order makes logical sense.

### Manual Keyboard Testing

Unplug your mouse and navigate through every page. Verify that:

- You can reach all interactive elements with Tab.
- You can activate buttons with Enter and Space.
- Dropdowns and menus respond to arrow keys.
- Modals trap focus correctly and release it on close.

### Screen Reader Testing

Test with at least one screen reader. NVDA (free, Windows) or VoiceOver (built into macOS and iOS) are the most common choices. Listen for:

- Meaningful announcements on every interactive element.
- Correct reading order.
- Live region announcements for dynamic content.

### Responsive and Zoom Testing

- Zoom the browser to 200% and verify no content is lost.
- Set the viewport to 320px wide and check for horizontal scrolling.
- Override text spacing (line-height, letter-spacing, word-spacing) and confirm nothing breaks.

---

## Building Accessibility Into Your Workflow

The most successful accessibility programs are not audit-driven. They are process-driven. Here is how to shift left:

1. **Design phase**: Use contrast-checked color palettes. Annotate designs with heading levels, focus order, and alternative text.
2. **Development phase**: Use semantic HTML by default. Lint for accessibility issues with tools like axe-linter or eslint-plugin-jsx-a11y.
3. **Code review phase**: Add accessibility to your review checklist. Reviewers should tab through new components in the browser before approving a pull request.
4. **CI/CD phase**: Integrate automated accessibility testing into your pipeline so regressions are caught before deployment.
5. **Monitoring phase**: Run scheduled scans across your site to catch issues introduced by content editors, third-party scripts, or CMS updates.

---

## Start Your Audit Today with AccessGuard

Working through a WCAG compliance checklist manually is essential, but it does not scale across hundreds or thousands of pages. That is where automation fills the gap.

**AccessGuard's free website accessibility scanner** crawls your site, tests against WCAG 2.1 AA criteria, and delivers a prioritized report of issues with specific code-level remediation guidance. You get a clear picture of where you stand in minutes, not weeks.

Whether you are starting your first audit or maintaining an already-accessible site, AccessGuard helps you catch regressions, track progress over time, and demonstrate compliance with confidence.

[Run your free accessibility scan now](https://www.accessguard.io/free-scan) and see how your site measures up against this WCAG compliance checklist.
