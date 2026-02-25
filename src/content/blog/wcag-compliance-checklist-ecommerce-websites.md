---
title: "WCAG 2.1 Compliance Checklist for E-commerce Websites"
description: "A complete WCAG 2.1 compliance checklist built specifically for e-commerce websites. Covers product pages, checkout flows, shopping carts, and more to help online stores avoid accessibility lawsuits."
date: 2026-02-23
author: A11yScope Team
tags: WCAG, E-commerce, Compliance
---

# WCAG 2.1 Compliance Checklist for E-commerce Websites

E-commerce websites face unique accessibility challenges that generic checklists rarely address. When a customer with a disability cannot complete a purchase on your online store, the result is lost revenue and serious legal exposure. ADA website lawsuits targeting e-commerce businesses have risen sharply year over year, with plaintiffs' attorneys specifically focusing on shopping carts, product filters, and checkout flows that exclude screen reader users and keyboard-only navigators.

This checklist is designed specifically for online store owners, Shopify merchants, WooCommerce administrators, and e-commerce developers who need a focused, actionable guide to WCAG 2.1 Level AA compliance across every stage of the shopping experience.

## Why E-commerce Accessibility Is a Legal Priority

Online retail is one of the most heavily targeted sectors in ADA digital accessibility litigation. The reasons are straightforward: e-commerce sites are clearly "places of public accommodation" under Title III of the ADA, they process financial transactions that directly affect consumers, and their accessibility failures are easy to document and reproduce.

The European Accessibility Act, which took effect in June 2025, adds another layer of obligation for any store selling to EU customers. If your e-commerce site is not WCAG 2.1 AA compliant, you are exposed on both sides of the Atlantic.

Beyond the legal dimension, accessible e-commerce is simply good business. An estimated 1.3 billion people worldwide live with some form of disability, and their collective spending power exceeds $13 trillion annually. Every accessibility barrier you remove is a barrier to revenue you are eliminating.

## Product Listing and Search Pages

### Image Alt Text for Product Photos

Every product image must have descriptive alt text that communicates what the product looks like and any information the image conveys. Decorative images used purely for layout can use an empty `alt=""` attribute, but your primary product photos must describe the item.

**Bad:** `<img src="shoe-001.jpg">`
**Good:** `<img src="shoe-001.jpg" alt="Men's black leather Oxford dress shoe, side profile view">`

If your product images include text overlays such as "SALE" or "NEW," that text must be included in the alt attribute or provided in the surrounding HTML.

### Accessible Product Filters and Sorting

Product filter panels are one of the most common accessibility failure points on e-commerce sites. Filters built with custom JavaScript dropdowns or checkbox panels frequently lack keyboard support and proper ARIA roles.

Ensure that every filter control is operable with the keyboard alone. Users must be able to tab to each filter, activate it with Enter or Space, and understand the current filter state through screen reader announcements. Use `role="checkbox"` with `aria-checked` for toggle filters, and make sure filter results are announced to assistive technology when applied.

### Pagination and Infinite Scroll

If your product listing uses infinite scroll, provide an alternative pagination mechanism. Infinite scroll creates severe barriers for keyboard users who can never reach the footer content. Add explicit "Load More" buttons or numbered page navigation as a fallback, and ensure focus management moves logically when new content loads.

## Product Detail Pages

### Accessible Image Galleries and Zoom

Product detail pages typically feature image carousels or galleries with zoom functionality. These must be fully keyboard accessible. Each thumbnail should be focusable, the main image swap should be announced to screen readers, and zoom functionality should work with keyboard controls, not just mouse hover.

Use `aria-live="polite"` regions to announce when the displayed image changes, and provide text descriptions of color swatches rather than relying on color alone to convey the option.

### Size Charts and Variant Selectors

Size and variant selectors (color, material, quantity) must use standard form controls or properly configured ARIA widgets. Custom-styled radio buttons for size selection are fine as long as the underlying HTML uses actual `<input type="radio">` elements or the custom elements include `role="radio"` with full keyboard support.

Size chart modals must be properly trapped for focus. When a modal opens, focus should move into it, tab cycling should stay within the modal, and pressing Escape should close it and return focus to the trigger element.

### Price and Availability Announcements

Prices and stock status must be programmatically associated with the product. If selecting a different variant changes the price, use an `aria-live` region to announce the updated price so screen reader users are not left guessing.

## Shopping Cart Accessibility

### Cart Updates and Notifications

When a user adds an item to the cart, provide a clear confirmation that assistive technology can detect. A visual toast notification alone is not sufficient. Use an `aria-live="polite"` region to announce messages like "Item added to cart. Cart total: 3 items."

Quantity adjustment controls must be labeled. If you use plus/minus buttons, each must have an accessible label such as "Increase quantity for Blue T-Shirt" rather than just "+" and "-."

### Cart Summary Table

Present cart contents in a semantic `<table>` element with proper `<th>` headers for columns like Product, Quantity, Price, and Subtotal. Screen reader users navigate tables by column and row, so a properly structured table makes the cart comprehensible while a series of `<div>` elements does not.

## Checkout Flow

### Form Labels and Error Handling

Every form field in checkout must have a visible `<label>` element programmatically associated via the `for` attribute. Placeholder text is not a substitute for a label because it disappears when the user begins typing.

Error messages must be specific and associated with the field that triggered them. Use `aria-describedby` to connect error text to the relevant input, and consider using `aria-invalid="true"` on fields that fail validation. When the form is submitted with errors, move focus to the first invalid field or to a summary of errors at the top of the form.

### Accessible Payment Forms

Payment card entry forms are a frequent failure point. If you embed a third-party payment iframe (Stripe, Braintree, Square), verify that the iframe itself is accessible. Add a descriptive `title` attribute to the iframe element, and test the embedded form with a screen reader.

If your checkout uses multiple steps, implement a clear progress indicator that communicates the current step to screen readers. Something like `aria-current="step"` on the active step and descriptive labels such as "Step 2 of 4: Shipping Address" make the process navigable.

### Order Confirmation

The order confirmation page must be reachable and readable by all users. Use a clear heading structure and ensure the order number, summary, and next steps are presented in semantic HTML rather than purely visual layouts.

## Site-Wide E-commerce Requirements

### Keyboard Navigation Throughout

Test every interactive element on your site using only the Tab key, Shift+Tab, Enter, Space, and Arrow keys. Common failures include: dropdown menus that do not open with Enter, modal dialogs that cannot be closed with Escape, and custom components that trap focus indefinitely.

### Color Contrast for Pricing and CTAs

Sale prices displayed in red, "Add to Cart" buttons, and promotional banners must all meet the WCAG 4.5:1 contrast ratio for normal text (or 3:1 for large text). Use a contrast checker to verify every color combination, especially for text overlaid on product photography.

### Accessible Promotional Banners and Carousels

Auto-rotating homepage carousels must include pause, stop, and navigation controls. Each slide must be accessible, and users must be able to interact with slide content using the keyboard. Provide "Previous" and "Next" buttons with clear accessible labels, not just arrow icons.

## Run a Free Accessibility Scan on Your E-commerce Site

The fastest way to identify WCAG 2.1 violations on your online store is to run an automated scan that flags issues across your product pages, cart, and checkout. [A11yScope's free scanner](/) analyzes your site against WCAG 2.1 AA criteria and delivers a prioritized report in seconds.

Automated scanning catches approximately 30-40% of accessibility issues. For a comprehensive audit, combine scanning with manual keyboard testing and screen reader verification. If you need ongoing coverage, [A11yScope's Pro plan](/#pricing) offers weekly scheduled scans with detailed trend reporting so you can catch regressions before they become legal liabilities.

Start with a free scan today and see exactly where your e-commerce site stands.
