---
title: "How to Fix Empty Links and Empty Buttons: An Accessibility Guide"
description: "Empty links and empty buttons are among the top WCAG violations on the web. Learn what causes them, how to detect them, and how to fix every common pattern with code examples."
date: 2026-03-08
author: A11yScope Team
tags:
  - Empty Links
  - Empty Buttons
  - Accessibility
  - WCAG
  - HTML
---

# How to Fix Empty Links and Empty Buttons: An Accessibility Guide

**Key Takeaways:**
- Empty links affect **45.4%** of home pages and empty buttons affect **29.6%**, per the WebAIM Million 2025 report
- An "empty" link or button means it has **no accessible name** — screen readers announce it as "link" or "button" with no context
- Most fixes require adding **visible text**, an **`aria-label`**, or proper **`alt` text** on images inside the element
- These errors are **fully detectable by automated scanners**, making them easy to find and track

Every interactive element on a web page needs a name. When a link or button does not have one, assistive technologies like screen readers announce it without any context. A screen reader user hears "link" or "button" — nothing more. They have no idea what the link goes to or what the button does. This is not a minor inconvenience. It makes parts of your website completely unusable for people who rely on assistive technology.

Empty links and empty buttons are two of the six most common WCAG accessibility errors detected across the web. The [WebAIM Million 2025 analysis](https://webaim.org/projects/million/) found empty links on 45.4% of home pages and empty buttons on 29.6%. Together with [low-contrast text](/blog/color-contrast-accessibility-guide), missing image alt text, missing form labels, and missing document language, these six issues account for the vast majority of detectable accessibility failures.

The good news is that both problems are straightforward to fix once you understand what causes them.

## What Makes a Link or Button "Empty"?

An element is considered empty when it has no **accessible name**. The accessible name is the text that assistive technologies read aloud to identify the element. Browsers compute the accessible name using a specific algorithm defined in the [W3C Accessible Name and Description Computation specification](https://www.w3.org/TR/accname-1.2/).

For links and buttons, the accessible name typically comes from one of these sources:

1. **Text content** inside the element
2. **`alt` attribute** on an `<img>` inside the element
3. **`aria-label`** attribute on the element
4. **`aria-labelledby`** attribute referencing another element's text
5. **`title`** attribute (used as a last resort)

When none of these sources provide a non-empty string, the element is "empty" from an accessibility perspective.

### WCAG Success Criteria

Empty links and buttons violate multiple WCAG success criteria:

- **SC 1.1.1 Non-text Content (Level A):** Images inside links or buttons must have text alternatives.
- **SC 2.4.4 Link Purpose (In Context) (Level A):** The purpose of each link must be determinable from the link text alone or from the link text together with its programmatically determined context.
- **SC 4.1.2 Name, Role, Value (Level A):** All user interface components must have a name that can be programmatically determined.

All three are Level A — the absolute minimum for WCAG conformance. Failing any of them means your site does not meet even the baseline accessibility standard.

## Empty Links: Common Patterns and Fixes

### Pattern 1: Icon-Only Links With No Text

This is the most common cause of empty links. A link wraps an icon — either an SVG, a font icon, or a decorative image — with no visible or hidden text.

**Broken:**

```html
<!-- Screen reader announces: "link" -->
<a href="/search">
  <svg viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/>
  </svg>
</a>
```

**Fixed — Option A: Add `aria-label` to the link:**

```html
<a href="/search" aria-label="Search">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/>
  </svg>
</a>
```

**Fixed — Option B: Add visually hidden text:**

```html
<a href="/search">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/>
  </svg>
  <span class="sr-only">Search</span>
</a>
```

The `sr-only` class (also called `visually-hidden`) hides the text visually while keeping it available to screen readers:

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

**When to use which:** Use `aria-label` when you want a concise solution. Use visually hidden text when you want the label to be translatable by automatic translation tools, since `aria-label` values are often skipped by translation services.

### Pattern 2: Image Links With Missing Alt Text

A link wraps an image, but the image has no `alt` attribute or an empty `alt=""`.

**Broken:**

```html
<!-- Screen reader announces: "link, image" or just "link" -->
<a href="/home">
  <img src="/logo.png">
</a>
```

**Fixed:**

```html
<a href="/home">
  <img src="/logo.png" alt="A11yScope home page">
</a>
```

When an image is the only content inside a link, the image's `alt` text becomes the link's accessible name. Never use `alt=""` on an image that is the sole content of a link — that explicitly tells assistive technologies to ignore the image, leaving the link empty.

### Pattern 3: Links Wrapping Empty or Whitespace-Only Content

Sometimes links are created dynamically and end up with no content, or content that is only whitespace or HTML comments.

**Broken:**

```html
<!-- Generated by a CMS or framework -->
<a href="/category/sale">  </a>
<a href="/promo"></a>
<a href="/offer"><!-- placeholder --></a>
```

**Fixed:**

Either add meaningful text content, or remove the empty link entirely if it serves no purpose. Empty links that were generated by accident should be eliminated at the template level.

```html
<a href="/category/sale">Sale</a>
```

### Pattern 4: Anchor Links Used as JavaScript Triggers

Links with `href="#"` or `href="javascript:void(0)"` that rely entirely on JavaScript click handlers and have no text content.

**Broken:**

```html
<a href="#" onclick="openModal()">
  <i class="icon-settings"></i>
</a>
```

**Fixed — and improved:**

If the element triggers an action rather than navigating to a URL, it should be a `<button>`, not a link.

```html
<button type="button" onclick="openModal()" aria-label="Settings">
  <i class="icon-settings" aria-hidden="true"></i>
</button>
```

This fix addresses two problems at once: the empty accessible name and the incorrect use of a link for a button action. Screen readers differentiate between links (navigation) and buttons (actions), and using the correct element helps users understand what will happen when they activate it.

### Pattern 5: Social Media Icon Links

A row of social media icons linking to external profiles is one of the most frequently flagged sources of empty links.

**Broken:**

```html
<div class="social-links">
  <a href="https://twitter.com/example"><i class="fab fa-twitter"></i></a>
  <a href="https://github.com/example"><i class="fab fa-github"></i></a>
  <a href="https://linkedin.com/company/example"><i class="fab fa-linkedin"></i></a>
</div>
```

**Fixed:**

```html
<div class="social-links">
  <a href="https://twitter.com/example" aria-label="Follow us on Twitter">
    <i class="fab fa-twitter" aria-hidden="true"></i>
  </a>
  <a href="https://github.com/example" aria-label="View our GitHub repository">
    <i class="fab fa-github" aria-hidden="true"></i>
  </a>
  <a href="https://linkedin.com/company/example" aria-label="Connect on LinkedIn">
    <i class="fab fa-linkedin" aria-hidden="true"></i>
  </a>
</div>
```

Note the `aria-hidden="true"` on the icon elements. This prevents screen readers from attempting to announce the icon's Unicode character or CSS content, which would produce gibberish.

## Empty Buttons: Common Patterns and Fixes

### Pattern 1: Icon-Only Buttons

The most common source of empty buttons. A button contains only an icon with no text alternative.

**Broken:**

```html
<!-- Screen reader announces: "button" -->
<button type="button">
  <svg viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
</button>
```

**Fixed:**

```html
<button type="button" aria-label="Close dialog">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
</button>
```

Common icon-only buttons that frequently lack labels include close buttons (✕), hamburger menu buttons (☰), search buttons (🔍), settings buttons (⚙), and pagination arrows (← →). Each one needs a label that describes the **action**, not the icon. "Close dialog" is better than "X". "Open navigation menu" is better than "Hamburger".

### Pattern 2: Buttons With Only an Image

Similar to image links, but with a `<button>` element.

**Broken:**

```html
<button type="submit">
  <img src="/icons/submit-arrow.png">
</button>
```

**Fixed:**

```html
<button type="submit">
  <img src="/icons/submit-arrow.png" alt="Submit form">
</button>
```

### Pattern 3: CSS-Only Buttons With No Text

Buttons styled purely with CSS backgrounds or pseudo-elements, with no actual text content in the HTML.

**Broken:**

```html
<!-- The "play" triangle is a CSS border trick -->
<button type="button" class="play-btn"></button>
```

```css
.play-btn {
  width: 0;
  height: 0;
  border-left: 20px solid #000;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
}
```

**Fixed:**

```html
<button type="button" class="play-btn" aria-label="Play video"></button>
```

CSS-generated content (via `::before` or `::after`) is not reliably included in the accessible name computation across all browser and screen reader combinations. Always provide an explicit text alternative rather than relying on CSS content.

### Pattern 4: Dynamically Generated Buttons

JavaScript frameworks sometimes generate button elements without ensuring they have content. This is common with component libraries where the button's content is passed as a prop but defaults to empty.

**Broken (React example):**

```jsx
// IconButton renders <button> but relies on caller to pass aria-label
<IconButton onClick={handleDelete}>
  <TrashIcon />
</IconButton>
```

**Fixed:**

```jsx
<IconButton onClick={handleDelete} aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</IconButton>
```

If you maintain a component library, consider making the `aria-label` prop required when no visible text is provided. TypeScript can enforce this at the type level:

```typescript
type IconButtonProps = {
  onClick: () => void;
  'aria-label': string;  // Required, not optional
  children: React.ReactNode;
};
```

## How to Detect Empty Links and Buttons

### Automated Scanning

Empty links and buttons are one of the few accessibility issues that automated tools can detect with near-100% accuracy. The accessible name computation is deterministic — a tool can check whether an element has a computed name and flag it if the name is empty.

Use [A11yScope's free scanner](/) to check your site. It runs axe-core under the hood and will flag every empty link and empty button on any page you scan. For ongoing monitoring, the [Pro plan](/#pricing) can run scheduled scans and alert you when new empty elements appear — especially useful if your site has dynamic content from a CMS or user-generated pages.

Other tools that detect these issues include:

- **axe DevTools** browser extension (manual per-page check)
- **Lighthouse** accessibility audit in Chrome DevTools
- **WAVE** browser extension

For a detailed comparison, see our [accessibility testing tools comparison](/blog/website-accessibility-testing-tools-compared).

### Manual Verification

After fixing flagged elements, verify your fixes with a screen reader:

1. **On macOS:** Enable VoiceOver (Cmd + F5), then press Tab to move through interactive elements. Each link and button should be announced with a meaningful name.
2. **On Windows:** Open NVDA (free) or JAWS, then use Tab to navigate. Listen for any element announced as just "link" or "button" without additional context.
3. **On mobile:** Enable TalkBack (Android) or VoiceOver (iOS) and swipe through elements.

If any interactive element is announced without a descriptive name, it still needs a fix. For a comprehensive guide to screen reader testing, see our [screen reader testing guide](/blog/screen-reader-testing-guide-for-developers).

## Framework-Specific Considerations

### React and Next.js

In React applications, empty buttons and links often come from component composition where the accessible name is not enforced. Add ESLint rules to catch these issues during development:

```bash
npm install eslint-plugin-jsx-a11y --save-dev
```

The `jsx-a11y/anchor-has-content` and `jsx-a11y/interactive-supports-focus` rules will flag empty links and buttons during development, before they reach production. For more React-specific guidance, see our [React accessibility guide](/blog/react-accessibility-guide-spa).

### WordPress

WordPress themes frequently generate empty links in navigation menus, pagination, and widget areas. The most common source is the featured image link — WordPress wraps post thumbnails in links, and if the image has no alt text, the link is empty. Check our [WordPress accessibility guide](/blog/wordpress-accessibility-guide) for theme-specific fixes.

### Shopify

Shopify themes often have empty links in product cards (image-only links to product pages), icon-only cart buttons, and social media footers. These are theme-level issues that require editing Liquid templates. See our [Shopify accessibility guide](/blog/shopify-accessibility-guide) for step-by-step instructions.

## Prevention: Stop Empty Elements Before They Ship

Fixing existing empty links and buttons is important, but preventing new ones from appearing is even better.

### 1. Add Linting Rules

Configure `eslint-plugin-jsx-a11y` (React) or `axe-linter` (general HTML) in your project. These catch empty elements in your editor before you commit code.

### 2. Add Automated Testing to CI/CD

Include accessibility checks in your continuous integration pipeline. Tools like `@axe-core/playwright` or `@axe-core/puppeteer` can run automated accessibility tests on every pull request and fail the build if new empty elements are introduced.

```javascript
// Example: Playwright accessibility test
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('no empty links or buttons on home page', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withRules(['link-name', 'button-name'])
    .analyze();
  expect(results.violations).toHaveLength(0);
});
```

### 3. Create CMS Guidelines

If your content comes from a CMS, create guidelines for content editors. Ensure that every image uploaded to the CMS has alt text filled in, especially images that will be used inside links (product images, category images, author avatars). Many CMS platforms allow you to make the alt text field required.

### 4. Monitor Continuously

New pages, new features, and CMS content updates can reintroduce empty elements at any time. Set up [weekly accessibility scans](/blog/website-accessibility-monitoring-weekly-scans) to catch regressions early, before they accumulate.

## Quick Reference: Fix Checklist

| Element | Check | Fix |
|---------|-------|-----|
| Icon-only link | Does it have `aria-label` or visually hidden text? | Add `aria-label="Purpose"` to the `<a>` |
| Image link | Does the `<img>` inside have meaningful `alt` text? | Add `alt="Description"` to the `<img>` |
| SVG link/button | Is the SVG `aria-hidden="true"` with label on parent? | Add `aria-hidden="true"` to SVG, `aria-label` to parent |
| Font icon link/button | Is the icon `aria-hidden="true"` with label on parent? | Add `aria-hidden="true"` to `<i>`, `aria-label` to parent |
| Social media icons | Does each link describe the destination? | Add `aria-label="Follow us on [Platform]"` |
| Close/menu/search button | Does it describe the action? | Add `aria-label="Close dialog"` etc. |
| CSS-only button | Is there any text or `aria-label`? | Add `aria-label="Action description"` |
| CMS-generated link | Does the template ensure content exists? | Fix template to require text or alt text |

## Start Scanning for Empty Links and Buttons

Empty links and empty buttons are among the easiest accessibility issues to detect and fix. Every one you eliminate makes your site more usable for screen reader users, more compliant with WCAG, and more resilient against [ADA accessibility lawsuits](/blog/ada-website-lawsuits-how-to-protect-your-business).

Run a free scan with [A11yScope](/) to find every empty link and button on your site in seconds. The scanner identifies each violation, shows you exactly where it occurs in your HTML, and provides fix-ready code suggestions so you can resolve issues immediately. For sites with dynamic content or multiple pages, the [Pro plan](/#pricing) provides scheduled monitoring that catches new empty elements as they appear.

Your users deserve to know what every link and button does. Fix the empty ones today.
