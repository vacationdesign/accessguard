---
title: "How to Fix Accessibility Issues on Your Website: A Practical Guide to the Top 10 Problems"
description: "Learn how to fix accessibility issues on your website with code examples for the 10 most common problems, from missing alt text to ARIA landmarks."
date: 2026-02-20
author: A11yScope Team
tags:
  - Accessibility
  - Tutorial
  - Web Development
---

# How to Fix Accessibility Issues on Your Website: A Practical Guide to the Top 10 Problems

If you need to fix accessibility issues on your website, you are not alone. Over 96% of home pages have detectable WCAG failures, according to the WebAIM Million annual analysis. The good news is that most of these problems fall into a handful of categories, and every single one of them is fixable with straightforward HTML, CSS, and ARIA changes.

This guide walks you through the ten most common accessibility issues, explains why each one matters, shows you how to detect it, and gives you copy-paste code to resolve it. By the end you will have a concrete checklist you can apply to any site today.

## Why Fixing Accessibility Issues Matters

Before diving into the fixes, it helps to understand the stakes. Accessibility failures affect real people: screen reader users who cannot parse your navigation, keyboard-only users who get trapped inside a modal, and users with low vision who cannot read light-gray text on a white background. Beyond the ethical imperative, inaccessible sites face legal risk under the ADA and the European Accessibility Act, and they lose search ranking signals that Google ties to Core Web Vitals and semantic HTML.

Every fix below maps to one or more WCAG 2.1 success criteria. Where relevant, the criterion is noted so you can cross-reference your own audit.

## 1. Missing Alt Text on Images

### What It Is

When an `<img>` element lacks an `alt` attribute, assistive technologies have no way to convey the image's purpose. Some screen readers will read the file name instead, producing gibberish like "DSC underscore zero four three seven dot jpeg."

**WCAG criterion:** 1.1.1 Non-text Content (Level A)

### How to Find It

Open your browser DevTools, go to the Console, and run:

```javascript
document.querySelectorAll('img:not([alt])').forEach(img => {
  console.warn('Missing alt:', img.src);
});
```

Alternatively, any automated scanner will flag this immediately.

### How to Fix It

For **informative images**, write alt text that communicates the same information the image conveys:

```html
<!-- Bad -->
<img src="chart-q4-revenue.png">

<!-- Good -->
<img src="chart-q4-revenue.png"
     alt="Bar chart showing Q4 revenue increased 18% compared to Q3">
```

For **decorative images** that add no information, use an empty alt attribute so screen readers skip them entirely:

```html
<!-- Decorative image  Eintentionally empty alt -->
<img src="decorative-swirl.svg" alt="">
```

Never omit the `alt` attribute altogether. An empty string and a missing attribute are treated very differently by assistive technology.

## 2. Low Color Contrast

### What It Is

Text that does not have enough contrast against its background is difficult or impossible to read for users with low vision or color vision deficiencies. WCAG requires a contrast ratio of at least **4.5:1** for normal text and **3:1** for large text (18px bold or 24px regular and above).

**WCAG criterion:** 1.4.3 Contrast (Minimum) (Level AA)

### How to Find It

Use the Chrome DevTools color picker: inspect any text element, click the color swatch in the Styles panel, and the picker will display the contrast ratio along with a pass/fail indicator. For a full-page scan, browser extensions like the WAVE toolbar highlight every low-contrast instance.

### How to Fix It

Adjust your foreground or background color until the ratio meets the threshold:

```css
/* Bad  Eratio approximately 2.5:1 */
.subtle-text {
  color: #999999;
  background-color: #ffffff;
}

/* Good  Eratio approximately 7:1 */
.subtle-text {
  color: #595959;
  background-color: #ffffff;
}
```

If your brand palette includes colors that fail contrast checks, create an accessible variant for text use while keeping the original for large decorative elements where the 3:1 threshold applies.

A useful tip: define contrast-safe CSS custom properties so that every component references them:

```css
:root {
  --color-text-primary: #1a1a1a;   /* 15.4:1 on white */
  --color-text-secondary: #595959; /* 7:1 on white */
}
```

## 3. Missing Form Labels

### What It Is

A form input without a programmatically associated label leaves screen reader users guessing what information to enter. Placeholder text is not a substitute because it disappears on focus and is not reliably announced.

**WCAG criterion:** 1.3.1 Info and Relationships (Level A), 4.1.2 Name, Role, Value (Level A)

### How to Find It

Run the following snippet to catch orphaned inputs:

```javascript
document.querySelectorAll('input, select, textarea').forEach(el => {
  const id = el.id;
  const hasLabel = id && document.querySelector(`label[for="${id}"]`);
  const isWrapped = el.closest('label');
  const hasAriaLabel = el.getAttribute('aria-label');
  const hasAriaLabelledby = el.getAttribute('aria-labelledby');

  if (!hasLabel && !isWrapped && !hasAriaLabel && !hasAriaLabelledby) {
    console.warn('No label for:', el);
  }
});
```

### How to Fix It

The most robust approach is an explicit `<label>` with a matching `for`/`id` pair:

```html
<!-- Bad -->
<input type="email" placeholder="Enter your email">

<!-- Good -->
<label for="email-input">Email address</label>
<input type="email" id="email-input" placeholder="e.g. you@example.com">
```

When a visible label is not part of the design (for example, a single search field with only a button), use `aria-label`:

```html
<input type="search" aria-label="Search the site" placeholder="Search...">
<button type="submit">Search</button>
```

## 4. No Keyboard Navigation

### What It Is

Many users cannot use a mouse. They rely on the Tab key to move between interactive elements and Enter or Space to activate them. When sites use non-interactive elements like `<div>` or `<span>` for buttons and links, those elements are invisible to the keyboard.

**WCAG criterion:** 2.1.1 Keyboard (Level A)

### How to Find It

Put your mouse aside and try to navigate your entire site using only the keyboard. Every interactive element should be reachable with Tab, and you should see a visible focus indicator at all times. If you get stuck inside a component and cannot Tab out, you have a keyboard trap (2.1.2).

### How to Fix It

**Use native elements first.** A `<button>` is keyboard-accessible and announces its role automatically. A `<div onclick="...">` does none of that.

```html
<!-- Bad -->
<div class="btn" onclick="submitForm()">Submit</div>

<!-- Good -->
<button type="submit" class="btn">Submit</button>
```

If you absolutely must use a non-interactive element, add `tabindex="0"`, a `role`, and keyboard event handlers:

```html
<div role="button"
     tabindex="0"
     onclick="submitForm()"
     onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();submitForm();}">
  Submit
</div>
```

And never remove the focus outline globally:

```css
/* Bad  Ehides focus for everyone */
*:focus {
  outline: none;
}

/* Good  Ecustom focus style that is still visible */
*:focus-visible {
  outline: 3px solid #1a73e8;
  outline-offset: 2px;
}
```

## 5. Missing Page Title

### What It Is

The `<title>` element is the first thing a screen reader announces when a page loads. It also appears in browser tabs and search engine results. A missing or generic title like "Untitled" or "Home" on every page makes it impossible for users to distinguish between open tabs.

**WCAG criterion:** 2.4.2 Page Titled (Level A)

### How to Find It

Check the `<head>` of every page template. In a single-page application, verify that the title updates on route changes:

```javascript
// Quick audit in the console
console.log(document.title || 'NO TITLE SET');
```

### How to Fix It

Each page should have a unique, descriptive title that follows the pattern **Specific Page  ESite Name**:

```html
<head>
  <title>Pricing Plans  EA11yScope</title>
</head>
```

In a React app, update the title on navigation:

```jsx
import { useEffect } from 'react';

function PricingPage() {
  useEffect(() => {
    document.title = 'Pricing Plans  EA11yScope';
  }, []);

  return <main>...</main>;
}
```

For frameworks like Next.js or Astro, use the built-in `<Head>` or frontmatter title fields so this is handled automatically.

## 6. Missing Language Attribute

### What It Is

The `lang` attribute on the `<html>` element tells screen readers which language rules to use for pronunciation. Without it, a screen reader set to English might attempt to read French content with English phonetics, producing unintelligible audio.

**WCAG criterion:** 3.1.1 Language of Page (Level A)

### How to Find It

View the page source and check the opening `<html>` tag:

```javascript
const lang = document.documentElement.getAttribute('lang');
if (!lang) console.warn('Missing lang attribute on <html>');
```

### How to Fix It

Add the correct BCP 47 language tag:

```html
<!-- English -->
<html lang="en">

<!-- Japanese -->
<html lang="ja">

<!-- Brazilian Portuguese -->
<html lang="pt-BR">
```

If a section of the page is in a different language than the rest, use `lang` on that element:

```html
<p>The French word for hello is <span lang="fr">bonjour</span>.</p>
```

## 7. Empty Links and Buttons

### What It Is

A link or button that contains no text and no accessible name is announced by a screen reader as simply "link" or "button," giving the user zero context. This is extremely common with icon-only buttons that rely solely on a visual icon.

**WCAG criterion:** 4.1.2 Name, Role, Value (Level A), 2.4.4 Link Purpose (Level A)

### How to Find It

```javascript
document.querySelectorAll('a, button').forEach(el => {
  const text = el.textContent.trim();
  const ariaLabel = el.getAttribute('aria-label');
  const ariaLabelledby = el.getAttribute('aria-labelledby');
  const title = el.getAttribute('title');
  const imgAlt = el.querySelector('img[alt]')?.alt;

  if (!text && !ariaLabel && !ariaLabelledby && !title && !imgAlt) {
    console.warn('Empty interactive element:', el);
  }
});
```

### How to Fix It

For icon-only buttons, add `aria-label`:

```html
<!-- Bad -->
<button>
  <svg class="icon-menu">...</svg>
</button>

<!-- Good -->
<button aria-label="Open navigation menu">
  <svg class="icon-menu" aria-hidden="true">...</svg>
</button>
```

For links that wrap only an image, ensure the image has alt text:

```html
<!-- Bad -->
<a href="/"><img src="logo.png"></a>

<!-- Good -->
<a href="/"><img src="logo.png" alt="A11yScope home page"></a>
```

Notice that the SVG icon in the button example gets `aria-hidden="true"` to prevent the screen reader from trying to announce the SVG markup itself.

## 8. Missing Skip Navigation

### What It Is

Keyboard users and screen reader users must Tab through every navigation link on every page load before reaching the main content. A skip navigation link lets them jump straight past the header.

**WCAG criterion:** 2.4.1 Bypass Blocks (Level A)

### How to Find It

Load the page and press Tab once. If the first focusable element is not a "Skip to content" link, the mechanism is missing.

### How to Fix It

Add a visually hidden link as the first element inside `<body>` that becomes visible on focus:

```html
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header>...</header>
  <main id="main-content">
    ...
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: #ffffff;
  font-size: 1rem;
  z-index: 1000;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 0;
}
```

This link is invisible during normal browsing but slides into view the moment a keyboard user presses Tab, giving them a one-key shortcut to the main content.

## 9. Inaccessible Custom Components

### What It Is

Custom dropdown menus, modals, tabs, and accordions built from generic `<div>` elements often lack the keyboard interactions and ARIA attributes that native HTML elements provide for free. A custom select menu that only opens on mouse click is completely unusable for keyboard and screen reader users.

**WCAG criterion:** 4.1.2 Name, Role, Value (Level A)

### How to Find It

Attempt to use every custom interactive component with only the keyboard. Then turn on a screen reader (VoiceOver on macOS, NVDA on Windows) and verify that the role, state, and value of each component are announced correctly.

### How to Fix It  EAccessible Modal Example

A modal needs three things: focus trapping, Escape to close, and appropriate ARIA roles.

```html
<div role="dialog"
     aria-modal="true"
     aria-labelledby="modal-title"
     id="my-modal">
  <h2 id="modal-title">Confirm your subscription</h2>
  <p>You will be billed monthly. Cancel any time.</p>
  <button id="modal-confirm">Confirm</button>
  <button id="modal-cancel">Cancel</button>
</div>
```

```javascript
function openModal() {
  const modal = document.getElementById('my-modal');
  modal.removeAttribute('hidden');

  // Move focus into the modal
  modal.querySelector('#modal-confirm').focus();

  // Trap focus inside the modal
  modal.addEventListener('keydown', trapFocus);
}

function trapFocus(event) {
  const modal = document.getElementById('my-modal');
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.key === 'Escape') {
    closeModal();
    return;
  }

  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

function closeModal() {
  const modal = document.getElementById('my-modal');
  modal.setAttribute('hidden', '');
  modal.removeEventListener('keydown', trapFocus);
  // Return focus to the element that opened the modal
  document.getElementById('open-modal-btn').focus();
}
```

Wherever possible, consider using the native `<dialog>` element, which handles focus trapping and the Escape key natively in modern browsers:

```html
<dialog id="native-modal">
  <h2>Confirm your subscription</h2>
  <p>You will be billed monthly. Cancel any time.</p>
  <button id="confirm-btn">Confirm</button>
  <button id="cancel-btn" onclick="this.closest('dialog').close()">Cancel</button>
</dialog>

<button onclick="document.getElementById('native-modal').showModal()">
  Subscribe
</button>
```

## 10. Missing ARIA Landmarks

### What It Is

ARIA landmark roles  Eor their equivalent HTML5 semantic elements  Elet screen reader users jump between major sections of the page. Without them, navigating a page is like reading a book with no chapter headings.

**WCAG criterion:** 1.3.1 Info and Relationships (Level A)

### How to Find It

Check whether the page uses semantic sectioning elements:

```javascript
const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
landmarks.forEach(tag => {
  const count = document.querySelectorAll(tag).length;
  console.log(`<${tag}>: ${count} found`);
});
```

If any of these return zero, you have missing landmarks.

### How to Fix It

Replace generic `<div>` wrappers with semantic elements:

```html
<!-- Bad  Ediv soup -->
<div id="header">...</div>
<div id="navigation">...</div>
<div id="content">...</div>
<div id="sidebar">...</div>
<div id="footer">...</div>

<!-- Good  Esemantic landmarks -->
<header>...</header>
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<aside aria-label="Related articles">...</aside>
<footer>...</footer>
```

When you have multiple `<nav>` or `<aside>` elements on one page, differentiate them with `aria-label` so screen reader users can tell them apart:

```html
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Footer navigation">...</nav>
```

This simple structural change gives screen reader users a "table of contents" for your page that they can access at any time.

## Putting It All Together: Your Fix Checklist

Here is a quick-reference checklist you can use on any project:

1. **Images**  EEvery `<img>` has an `alt` attribute (descriptive or empty).
2. **Contrast**  EAll text meets a 4.5:1 ratio (3:1 for large text).
3. **Form labels**  EEvery input has an associated `<label>`, `aria-label`, or `aria-labelledby`.
4. **Keyboard**  EEvery interactive element is reachable and operable via keyboard, with visible focus styles.
5. **Page title**  EEach page has a unique, descriptive `<title>`.
6. **Language**  EThe `<html>` element has a valid `lang` attribute.
7. **Links and buttons**  EEvery link and button has a non-empty accessible name.
8. **Skip navigation**  EA skip link is the first focusable element on the page.
9. **Custom components**  EModals trap focus, accordions use proper ARIA, and all widgets work with keyboard alone.
10. **Landmarks**  EThe page uses `<header>`, `<nav>`, `<main>`, `<aside>`, and `<footer>` appropriately.

Work through these ten items in order. Issues one through six can typically be fixed in a single sitting. Issues seven through ten may require refactoring components, but every fix you ship makes the experience better for real users.

## Automate What You Can

Manual testing is essential  Eespecially keyboard and screen reader testing  Ebut automated scanners catch the low-hanging fruit instantly. Running a scanner after every deployment ensures that new code does not reintroduce resolved issues.

**A11yScope's free accessibility scanner** analyzes your pages against WCAG 2.1, flags every issue covered in this guide, and gives you prioritized, code-level fix suggestions so your team spends less time diagnosing and more time shipping. Try it today at [a11yscope.com](https://www.a11yscope.com) and fix accessibility issues on your website before your users  Eor their lawyers  Efind them first.
