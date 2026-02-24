---
title: "Shopify Accessibility: How to Make Your Shopify Store WCAG Compliant"
description: "Make your Shopify store accessible and WCAG compliant. Fix common accessibility issues in themes, product pages, checkout, and third-party apps."
date: 2026-02-25
author: AccessGuard Team
tags: [Shopify, Accessibility, WCAG, E-commerce]
---

# Shopify Accessibility: How to Make Your Shopify Store WCAG Compliant

Shopify makes it remarkably easy to launch an online store, but launching accessible is a different matter. The platform handles hosting, payment processing, and a polished storefront out of the box, yet the accessibility of what your customers actually experience depends on decisions Shopify has made for you, decisions your theme developer made, and decisions you make every time you add a product, install an app, or customize your store. Most Shopify stores fail basic WCAG 2.1 Level AA checks, and the store owners do not realize it until they receive a demand letter or lose a customer who simply could not use their site.

This guide covers where Shopify accessibility problems come from, what you can fix yourself, what requires theme-level changes, and where the platform limits your control entirely.

## Shopify's Built-In Accessibility Features and Their Limitations

Shopify deserves credit for building certain accessibility foundations into the platform:

- **Semantic HTML structure.** Shopify's Liquid templates use semantic elements like `<header>`, `<nav>`, `<main>`, and `<footer>` to define page regions that screen readers rely on for navigation.
- **Mobile-responsive framework.** All current Shopify themes support responsive layouts and pinch-to-zoom, meeting WCAG requirements around content reflow.
- **Structured product data.** Shopify separates structured fields (title, price, variants, description) from presentation, making it possible for themes to output accessible markup.
- **Alt text field for images.** Every product image, collection image, and blog post image has a dedicated alt text field in the admin. The platform gives you the tool — it just does not require you to use it.

These foundations are real, but not enough on their own. Here is where the limitations start.

**Shopify does not enforce accessibility standards on themes.** The Theme Store has no accessibility certification requirement. Themes go through review for performance and code quality, but a theme can pass and still have significant WCAG failures in contrast, focus indicators, mobile menus, and keyboard interaction.

**Shopify does not enforce accessibility on apps.** Thousands of third-party apps inject their own HTML, CSS, and JavaScript into your storefront with no accessibility review gate. A single poorly coded review widget or popup can introduce violations across every page.

**Checkout is partially locked down.** On most plans, the checkout is controlled by Shopify and cannot be fully customized. Shopify's hosted checkout is reasonably accessible, but if there are issues, your ability to fix them is limited to the settings Shopify exposes.

Understanding this split is essential. The rest of this guide focuses on the areas where your decisions make the difference.

## Common Accessibility Problems in Popular Shopify Themes

Your theme is the single largest factor in your store's accessibility. It controls the HTML structure, visual design, navigation, and interactive components on every page. Even Shopify's own free themes have had accessibility issues that were only fixed after community reports.

### Navigation and Mobile Menus

The header navigation is the first interactive element customers encounter and one of the most common failure points:

- **Dropdown menus that only work on hover.** Keyboard and touchscreen users cannot access subcategories if menus only reveal on mouse hover. Dropdowns must open with keyboard focus using Enter or Space.
- **Mobile hamburger menus without ARIA attributes.** The menu button needs `aria-expanded` to communicate its open/closed state. Many themes render a correct icon but omit these attributes.
- **Missing focus indicators.** Themes often suppress the browser's default focus outline without providing a replacement, leaving keyboard users unable to see where they are on the page.
- **No skip navigation link.** A "Skip to content" link should be the first focusable element, letting keyboard users bypass the header. Many Shopify themes omit this.

### Color Contrast Failures

Low color contrast is the most frequently detected WCAG violation across the web, and Shopify themes are no exception. The most common problem areas include:

- **Light gray text on white backgrounds**, particularly for secondary information like "Compare at" prices, product tags, and footer links.
- **White text overlaid on product photography** in hero banners and collection headers, where the contrast depends entirely on the image underneath and is often insufficient.
- **Placeholder text in search bars and form fields** that fails the 4.5:1 contrast ratio required by WCAG 1.4.3.
- **Sale and badge colors** that look vibrant visually but do not meet contrast minimums when rendered as text on a colored background.

### Missing or Broken Focus Management

Beyond navigation, themes frequently fail focus management in interactive components:

- **Quick-view modals** that open without moving focus into the modal, leaving keyboard users stranded on the element behind it. When the modal is closed, focus should return to the element that triggered it.
- **Image galleries and carousels** that cannot be navigated with arrow keys and have no visible focus state on thumbnails.
- **Accordion and tab components** in product descriptions or FAQ sections that lack `role="tablist"`, `role="tab"`, and `role="tabpanel"` attributes, making them opaque to screen readers.

### How to Evaluate Your Theme

Before investing time in individual fixes, assess where your current theme stands:

1. **Navigate your entire store using only the keyboard.** Use Tab, Shift+Tab, Enter, Escape, and Arrow keys. Can you reach every link, button, menu, and form field? Can you open and close modals and menus? Can you add a product to the cart and reach the checkout?
2. **Check focus visibility.** As you tab through the site, is every focused element visibly highlighted? If focus disappears at any point, your theme is suppressing focus styles.
3. **Test with a screen reader.** VoiceOver on macOS or NVDA on Windows will reveal issues that visual testing cannot, such as missing button labels, unnamed form fields, and image links with no alt text.
4. **Run an automated scan.** [AccessGuard's free scanner](/) will flag contrast failures, missing alt text, missing form labels, and other detectable WCAG violations across your store in seconds. This gives you a prioritized starting point.

## Fixing Product Pages: Alt Text, Variant Selectors, and Price Announcements

Product pages are the core of your store, and they carry several accessibility requirements that are unique to e-commerce.

### Product Image Alt Text

Shopify gives you an alt text field for every product image, but it does not flag missing alt text or generate it automatically. Most Shopify stores have hundreds of product images with no alt text at all.

**How to write effective product alt text:**

- Describe what the image shows. "Women's ribbed cotton crew neck sweater in forest green, front view" is useful. "Sweater" is not.
- Include details the image conveys beyond the product title: viewing angle, color shown, or how the product is being used.
- Do not stuff keywords. Alt text is for users who cannot see the image, not for SEO.
- For lifestyle images, describe the relevant context.
- Each image of a product should have unique alt text reflecting what that specific shot shows.

**Bulk-editing alt text:** For large catalogs, Shopify's CSV export/import can update alt text in bulk — export your products, fill in the `Image Alt Text` column, and re-import.

### Variant Selectors

When a customer selects a different variant, the displayed image, price, and availability may all change. Each update must be communicated to screen reader users, not just displayed visually.

**Common issues:**

- **Color swatches that rely on color alone.** If your theme shows color options as colored circles with no text label, users who cannot perceive color cannot identify them. Each swatch needs a visible label or `aria-label` with the color name.
- **Custom select dropdowns** built with `<div>` elements instead of native `<select>` elements. These frequently lack keyboard support and ARIA roles. Test custom variant selectors thoroughly.
- **Silent updates.** When a variant selection changes the price, that update must be announced via an `aria-live="polite"` region so screen readers convey the new price.

### Price Display and Discounts

Prices must be programmatically readable, not just visually formatted. Specific issues to watch for:

- **Sale prices displayed without context.** A screen reader reading "$49.99 $34.99" without labels gives no way to tell which is the original and which is the sale price. Use visually hidden text like "Original price" and "Sale price" to label each amount.
- **Currency symbols and formatting.** Ensure prices include the currency symbol in text content, not just as a CSS element.
- **"Sold out" and availability status.** Availability must be conveyed in text, not just through a grayed-out button. A disabled "Add to Cart" button with no text explanation is a dead end for screen reader users.

## Checkout Accessibility: What Shopify Controls vs. What You Control

Shopify's checkout is where the platform's control is strongest and your customization ability is most limited. Understanding this boundary helps you focus on what you can actually change.

### What Shopify Controls

On most plans, the checkout pages are hosted and rendered by Shopify. You cannot edit the HTML structure, form markup, or JavaScript. Shopify manages:

- **Form field labels and validation.** Shopify's checkout forms use proper `<label>` elements and provide inline error messages. This is generally well-implemented.
- **Payment form accessibility.** The credit card entry fields, payment method selection, and order summary are rendered by Shopify's checkout system.
- **Step-by-step progress.** Shopify's multi-step checkout communicates the current step, though the implementation quality has varied across checkout versions.
- **Auto-complete and address suggestions.** These features are built into the checkout and include basic accessibility support.

Shopify's checkout is not flawless — there have been reported issues with focus management between steps and screen reader announcement of dynamic price updates — but because Shopify controls this code, these issues are fixed (or not) by Shopify, not by you.

### What You Control

Even within Shopify's checkout constraints, several settings affect accessibility:

- **Checkout branding and colors.** Under Settings > Checkout, you can customize colors, fonts, and logo. If you change the default color scheme, ensure the new colors meet WCAG's 4.5:1 contrast ratio.
- **Additional checkout scripts.** Shopify Plus merchants can add custom scripts via Checkout Extensibility. Any custom UI you add is your responsibility to make accessible.
- **Order status page.** The post-purchase page can be customized. Ensure any custom content you add is accessible.
- **Policy pages.** Refund, privacy, and terms of service pages linked from checkout are regular pages you control. Ensure they have proper heading structure.

### Cart Page Accessibility

The cart page, which sits before the checkout, is fully controlled by your theme and is an area where you can make significant improvements:

- **Quantity controls.** Plus and minus buttons for adjusting item quantity must have accessible labels. A button labeled only "+" is meaningless to a screen reader. Use `aria-label="Increase quantity for [Product Name]"` or visually hidden text.
- **Cart update confirmations.** When a user changes a quantity or removes an item, the cart total updates. Use an `aria-live` region to announce the updated total.
- **Cart summary structure.** Present cart contents in a semantic HTML `<table>` with headers for product, quantity, price, and subtotal. Many themes use a grid of `<div>` elements that screen readers cannot interpret as tabular data.

## Apps and Third-Party Integrations: Accessibility Risks

This is where most Shopify stores accumulate accessibility debt without realizing it. Every app you install injects HTML, CSS, and JavaScript into your storefront, and the vast majority of Shopify apps are not built with accessibility in mind.

### Review Widgets

Product review apps inject review sections into your product pages and sometimes collection pages. Common accessibility failures include:

- **Star ratings conveyed only through icons.** A screen reader may announce nothing meaningful or read "star star star star star" without context. Widgets must include a text equivalent like "3 out of 5 stars."
- **Review forms with missing labels.** The review submission form often uses placeholder text instead of proper form labels.
- **Photo review lightboxes** that trap keyboard focus or cannot be closed with Escape.
- **Review pagination** that is not keyboard accessible or does not manage focus when new reviews load.

### Live Chat Widgets

Live chat apps inject a floating chat button and expandable chat window. These are among the most problematic third-party elements for accessibility:

- **Chat buttons with no accessible label.** A floating icon without an `aria-label` is invisible to screen readers.
- **Chat windows that trap focus.** Focus should move into the chat when it opens and return to the trigger button when it closes. Many widgets fail both.
- **Chat input fields without labels.**
- **Widgets covering other content.** Floating overlays can block access to interactive elements underneath, especially on mobile.

### Popup and Banner Apps

Email capture popups, promotional banners, and exit-intent overlays are a major accessibility hazard:

- **Popups that appear without moving focus**, leaving keyboard users stranded on the page behind them.
- **Missing or unlabeled close buttons.**
- **Popups that cannot be dismissed with Escape**, violating WCAG 2.1.1.
- **Timed popups** that disappear before users can interact, or auto-rotating banners that violate WCAG 2.2.2.
- **Focus traps** that prevent users from reaching the actual store content.

### What to Do About App Accessibility

You cannot fix the code of a third-party app, but you can make informed decisions:

- **Audit every installed app for accessibility.** Test its output on a development store with keyboard navigation and a screen reader. If it introduces significant barriers, contact the developer or find an alternative.
- **Limit the number of apps.** Every app is a potential source of violations. Remove apps you are not actively using.
- **Prioritize apps that touch every page.** A review widget on product pages affects a subset of your store. A chat widget or popup that loads on every page affects everything. Focus auditing on the apps with broadest reach.
- **Check app settings.** Some apps offer options to add alt text, enable keyboard support, or disable auto-play. These settings may exist but are not enabled by default.

## Quick Liquid Fixes for Common Accessibility Issues

If you or a developer can edit your Shopify theme's Liquid templates, a few targeted changes address the most widespread problems.

**Add a skip navigation link.** Insert this at the beginning of `<body>` in `theme.liquid`, and ensure your main content area has `id="MainContent"`:

```html
<a class="skip-to-content" href="#MainContent">Skip to content</a>
```

Style it to be hidden until focused, then visible at a fixed position with high contrast when a keyboard user tabs to it.

**Restore focus indicators.** If your theme suppresses the default focus outline, add a custom focus style in your theme CSS:

```css
*:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
```

The `:focus-visible` pseudo-class applies the outline only during keyboard navigation, not on mouse clicks.

**Add aria-live regions for dynamic content.** On product pages where price or availability changes with variant selection, wrap the dynamic value in an `aria-live` region so screen readers announce updates:

```html
<div aria-live="polite" aria-atomic="true">
  <span class="product-price">{{ product.selected_or_first_available_variant.price | money }}</span>
</div>
```

**Label icon-only buttons.** Search your theme for buttons containing only an SVG icon and no text — cart icons, search buttons, close buttons, menu toggles. Add `aria-label` attributes:

```html
<button aria-label="Search">{% render 'icon-search' %}</button>
<button aria-label="Close menu">{% render 'icon-close' %}</button>
```

## Scanning Your Shopify Store for Accessibility Issues

Manual testing with a keyboard and screen reader catches issues that no automated tool can detect, but manual testing does not scale to every page of a store with hundreds of products. Automated scanning provides the baseline, catching the most common WCAG violations — missing alt text, contrast failures, missing form labels, empty links, and broken heading hierarchy — across your entire store in seconds.

[Run a free scan on your Shopify store with AccessGuard](/) to get a prioritized list of WCAG 2.1 AA violations, organized by severity and by page. You will see exactly which elements fail, what WCAG criterion they violate, and specific guidance on how to fix each one. No signup required.

For stores that are actively publishing new products, updating themes, or installing apps, a single scan is a snapshot. Accessibility regressions happen every time content changes. AccessGuard's [Pro plan](/#pricing) provides weekly automated scans across your entire Shopify store, with trend reporting that shows whether your accessibility posture is improving or degrading over time. You get alerts when new violations appear, so you can catch and fix issues before they reach customers or attract legal attention.

If your store also sells through other channels or you operate a custom-built site alongside Shopify, our [e-commerce WCAG checklist](/blog/wcag-compliance-checklist-ecommerce-websites) covers the full range of accessibility requirements for online retail. And if you are concerned about legal exposure specifically, our [ADA compliance guide](/blog/ada-website-compliance-guide-small-businesses) explains the regulatory landscape and practical steps for small businesses.

## Making Shopify Accessibility an Ongoing Practice

Accessibility on Shopify is not a one-time checklist. Every new product, app install, theme update, and seasonal banner change can introduce new barriers. Build these habits into your store management:

- **Add alt text at the time of product creation**, not as a backlog cleanup task. Make it part of your product listing workflow.
- **Test new apps on a development store before installing on production.** Check their keyboard accessibility and screen reader output before committing.
- **Review your theme after every update.** Theme updates can change component markup in ways that affect accessibility. A quick keyboard navigation test after updating catches regressions early.
- **Scan regularly.** Monthly at minimum, weekly if your store changes frequently. Automated scanning is the fastest way to catch the issues that accumulate over time.
- **Educate your team.** If multiple people manage your store's content, share basic guidelines on alt text, heading structure, and link text. The most common accessibility failures come from content, not code.

Shopify gives you a functional platform. Making it accessible to all your customers is your responsibility — and it is achievable with the right awareness, the right tools, and a consistent effort to get the details right.
