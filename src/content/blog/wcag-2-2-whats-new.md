---
title: "WCAG 2.2: What's New and How to Prepare Your Website"
description: "WCAG 2.2 introduces 9 new success criteria. Learn what changed from WCAG 2.1, which criteria affect your site, and how to prepare for compliance."
date: 2026-02-25
author: A11yScope Team
tags:
  - WCAG 2.2
  - Accessibility
  - Compliance
  - Standards
---

# WCAG 2.2: What's New and How to Prepare Your Website

The Web Content Accessibility Guidelines (WCAG) 2.2 became an official W3C Recommendation on October 5, 2023, marking the first major update to the standard since WCAG 2.1 was published in June 2018. If your website currently targets WCAG 2.1 conformance, the update introduces nine new success criteria you need to evaluate, removes one existing criterion, and raises the bar in areas that directly affect everyday user interactions -- particularly around focus management, authentication, and cognitive accessibility.

This guide breaks down every change in **WCAG 2.2**, explains the practical implications for your website, and provides concrete steps you can take to prepare. Whether you are a developer writing front-end code, a product manager defining requirements, or a business owner tracking legal compliance, understanding these changes is essential. Accessibility standards do not stand still, and neither should your conformance strategy.

## Why WCAG 2.2 Matters

WCAG is the global benchmark for web accessibility, referenced by virtually every major accessibility law and regulation worldwide. The ADA, the European Accessibility Act, Section 508, and EN 301 549 all point back to WCAG as the technical standard that defines what an accessible website looks like.

WCAG 2.2 was developed to address gaps in 2.1, particularly for users with cognitive and learning disabilities, users with low vision, and users with motor impairments. The Accessibility Guidelines Working Group (AG WG) identified real-world interaction patterns that were not adequately covered by the previous version, and the nine new success criteria close those gaps.

Importantly, WCAG 2.2 is backward-compatible with 2.1. Every success criterion from WCAG 2.1 (with one exception discussed below) remains in 2.2. If your site already conforms to WCAG 2.1 AA, you are not starting over -- you are building on an existing foundation.

## The Nine New Success Criteria in WCAG 2.2

WCAG 2.2 adds nine new success criteria spread across Levels A, AA, and AAA. Below is a detailed breakdown of each one, organized by conformance level.

---

### Level A: The New Baseline Requirements

Level A criteria represent the absolute minimum for accessibility. WCAG 2.2 adds two new criteria at this level.

#### 2.4.11 Focus Not Obscured (Minimum) -- Level A

**What it requires:** When a user interface component receives keyboard focus, that component is not entirely hidden by author-created content. In practical terms, at least part of the focused element must be visible to the user.

**Why it was added:** A common usability problem occurs when sticky headers, fixed footers, modal overlays, or cookie banners cover the element that currently has keyboard focus. A sighted keyboard user tabs through the page and suddenly cannot see where they are because a fixed-position element is sitting on top of the focused component. This is disorienting and makes keyboard navigation unreliable.

**What to check on your site:**

- Sticky navigation bars or announcement banners that remain fixed at the top or bottom of the viewport.
- Cookie consent dialogs that partially overlay page content while users can still interact with elements behind them.
- Chat widgets or floating action buttons that might overlap focusable elements.
- Modal dialogs that do not properly trap focus, allowing keyboard focus to move behind the overlay.

**How to fix it:**

Ensure that fixed or sticky elements do not completely cover the focused element. You can achieve this with `scroll-padding` in CSS to offset scroll positions, by managing `z-index` values thoughtfully, or by applying sufficient padding/margin to page content so that focusable elements are never positioned entirely behind fixed elements.

```css
/* Account for a sticky header when scrolling to anchored elements */
html {
  scroll-padding-top: 80px; /* Height of your sticky header */
  scroll-padding-bottom: 60px; /* Height of your sticky footer */
}
```

Note that this is the Minimum (Level A) version of the criterion. It only requires that the focused element is not *entirely* hidden. The enhanced version at Level AA (2.4.12) sets a stricter standard.

#### 2.5.7 Dragging Movements -- Level A

**What it requires:** For any functionality that uses a dragging movement (such as drag-and-drop), a single-pointer alternative must be available that does not require dragging, unless dragging is essential to the underlying activity.

**Why it was added:** Drag-and-drop interactions are physically difficult or impossible for many users. People with motor impairments who use a head pointer, eye-tracking device, or single-switch input cannot perform sustained pointer movements across the screen. Users operating a touchscreen with limited fine motor control also struggle with drag operations.

**What to check on your site:**

- Kanban boards or task management interfaces that use drag-and-drop to reorder items.
- Sortable lists where users drag items to rearrange their order.
- Slider controls that require dragging a handle along a track.
- File upload interfaces where the only mechanism is dragging files into a drop zone.
- Map or image cropping tools that rely on dragging to position content.

**How to fix it:**

Provide a non-dragging alternative for every drag-based interaction. For sortable lists, add "Move up" and "Move down" buttons. For sliders, allow users to click specific points on the track or type a value directly into an input field. For file uploads, always include a standard file input button alongside the drop zone.

```html
<!-- Sortable list with drag AND button alternatives -->
<li draggable="true">
  <span>Task: Update homepage copy</span>
  <button aria-label="Move task up">Move Up</button>
  <button aria-label="Move task down">Move Down</button>
</li>
```

---

### Level AA: The Standard Compliance Target

Level AA is the conformance level referenced by most accessibility laws and the target for the vast majority of organizations. WCAG 2.2 adds five new criteria at this level, making it the most impactful tier of changes.

#### 2.4.12 Focus Not Obscured (Enhanced) -- Level AA

**What it requires:** When a user interface component receives keyboard focus, no part of the component is hidden by author-created content. This is the stricter version of 2.4.11 -- where the Minimum version only requires that the element is not *entirely* hidden, the Enhanced version requires that the focused element is *fully* visible.

**Why it matters:** Even partial obstruction of a focused element can make it difficult for keyboard users to understand what they have selected. A button whose label is half-covered by a sticky banner is technically not "entirely hidden" and would pass 2.4.11, but it still creates a poor and confusing experience.

**How to fix it:**

The same techniques used for 2.4.11 apply here, but you need to be more thorough. Audit every fixed-position element on your pages and verify that no focusable element is even partially overlapped when it receives focus. Increase `scroll-padding` values to add a comfortable buffer. Consider using the `scrollIntoView()` API with the `block: 'center'` option to position focused elements in the vertical center of the available viewport when programmatically moving focus.

#### 2.4.13 Focus Appearance -- Level AA

**What it requires:** When a user interface component has keyboard focus, the focus indicator must meet all of the following:

- It must have a minimum area of at least a 2 CSS pixel thick perimeter of the focused component, or an area at least as large.
- The change between the focused and unfocused state must have a contrast ratio of at least 3:1 against adjacent colors.

**Why it was added:** Many websites use very faint or thin focus indicators that are practically invisible, especially for users with low vision. Some websites remove the default browser focus outline entirely with `outline: none` without providing an adequate replacement. WCAG 2.1 required that focus be "visible" (SC 2.4.7), but it did not specify *how* visible. WCAG 2.2 now defines measurable minimums for the size and contrast of focus indicators.

**What to check on your site:**

- Whether you have CSS rules that suppress the default focus outline (`outline: none`, `outline: 0`, or `outline-color: transparent`).
- Whether your custom focus styles are thick enough and have sufficient contrast.
- Whether focus styles are consistent across interactive elements (buttons, links, form fields, custom components).

**How to fix it:**

Design focus indicators that meet the size and contrast requirements. A solid 2-pixel (or thicker) outline with strong contrast against the background is the most straightforward approach. Using `outline-offset` can improve visibility by adding space between the element's border and the focus ring.

```css
/* A focus style that meets WCAG 2.2 Focus Appearance requirements */
:focus-visible {
  outline: 3px solid #0056b3;
  outline-offset: 2px;
}

/* Remove default outline only when providing a visible custom style */
button:focus:not(:focus-visible) {
  outline: none;
}
```

#### 3.2.6 Consistent Help -- Level AA

**What it requires:** If a website provides any of the following help mechanisms, they must be presented in the same relative order on every page: human contact details, a human contact mechanism, a self-help option, or a fully automated contact mechanism.

The criterion lists a specific priority order:

1. Human contact details (phone number, email address)
2. Human contact mechanism (contact form, chat with a real person)
3. Self-help option (FAQ page, knowledge base)
4. Fully automated contact mechanism (chatbot)

If your website provides multiple help mechanisms, they must appear in the same relative order consistently across pages.

**Why it was added:** Users with cognitive disabilities often rely on memory and established patterns to navigate a website. When the help section moves to a different location or the order of contact options changes from page to page, it creates confusion and increases the effort required to find support.

**What to check on your site:**

- Whether your help or support links appear in the same location on every page (for example, always in the footer, always in the header navigation, or always in a consistent sidebar position).
- Whether multiple help mechanisms (phone number, email, chat, FAQ) appear in the same order wherever they are presented.

**How to fix it:**

Use a shared component or template partial for your help section. Place it in a consistent location (such as the footer) across every page, and keep the ordering of contact methods fixed. This is often already the case for well-structured websites, but it is worth verifying -- especially on pages like checkout flows or account settings that may use different layouts.

#### 3.3.7 Redundant Entry -- Level AA

**What it requires:** Information that the user has previously entered or that has been provided to the user during the current process must be either auto-populated or available for the user to select, unless re-entering the information is essential, the information is required for security purposes, or the previously entered information is no longer valid.

**Why it was added:** Filling in the same information repeatedly is frustrating for everyone, but it is a significant barrier for users with cognitive disabilities, memory impairments, or motor difficulties. Typing a shipping address and then being asked to type it again as a billing address -- when the addresses are the same -- is an unnecessary burden.

**What to check on your site:**

- Checkout flows that ask for shipping and billing addresses separately without offering a "Same as shipping" option.
- Multi-step forms where data entered in earlier steps is requested again in later steps.
- Account creation processes that ask for information already provided during a previous interaction in the same session.
- Any workflow where users might be asked to re-enter their name, email, phone number, or address after they have already provided it.

**How to fix it:**

Add "Same as above" or "Copy from previous" checkboxes where applicable. Pre-populate form fields with information the user has already provided. If a multi-step form collects an email address in step one, do not ask for it again in step three -- display it as pre-filled or allow the user to confirm and edit it.

```html
<!-- Provide a way to avoid redundant address entry -->
<fieldset>
  <legend>Billing Address</legend>
  <label>
    <input type="checkbox" id="same-address" checked>
    Same as shipping address
  </label>
  <!-- Billing fields auto-populated when checked -->
</fieldset>
```

#### 3.3.8 Accessible Authentication (Minimum) -- Level AA

**What it requires:** For each step in an authentication process, a cognitive function test (such as remembering a password, solving a puzzle, or performing a calculation) is not required, unless at least one of the following is true:

- An alternative authentication method is available that does not rely on a cognitive function test.
- A mechanism is available to assist the user in completing the cognitive function test (such as a password manager being allowed to auto-fill credentials).
- The cognitive function test involves recognizing objects (e.g., "Select all images with traffic lights").
- The cognitive function test involves recognizing non-text content that the user provided (e.g., selecting an image they previously chose as a security image).

**Why it was added:** Passwords are a cognitive function test -- they require users to recall previously memorized information. For people with cognitive and memory impairments, this is a significant barrier. While passwords remain common, this criterion ensures that either alternative authentication methods exist (such as passkeys, magic links, or biometrics) or that users are able to use password managers without the website actively blocking them.

**What to check on your site:**

- Whether your login form blocks password managers by using `autocomplete="off"` or by dynamically renaming form fields.
- Whether copy-paste is disabled on password fields.
- Whether your only authentication method requires memorizing and typing a password without any alternative.
- Whether CAPTCHAs require cognitive effort beyond simple object recognition.

**How to fix it:**

The most straightforward fix is to ensure your authentication forms are compatible with password managers. Do not set `autocomplete="off"` on username or password fields. Do not disable paste in password fields. Use proper `autocomplete` attribute values so browsers and password managers can identify your form fields.

```html
<!-- Authentication form that supports password managers -->
<form method="post" action="/login">
  <label for="username">Email address</label>
  <input type="email" id="username" name="username"
         autocomplete="username">

  <label for="password">Password</label>
  <input type="password" id="password" name="password"
         autocomplete="current-password">

  <button type="submit">Sign in</button>
</form>
```

Alternatively, offer passwordless authentication methods: email magic links, passkeys (WebAuthn/FIDO2), single sign-on (SSO), or biometric options on supported devices. These methods eliminate the cognitive function test entirely.

---

### Level AAA: The Highest Standard

Level AAA criteria are not typically required by law, but they represent best practices and benefit the widest range of users. WCAG 2.2 adds one new criterion at this level.

#### 3.3.9 Accessible Authentication (Enhanced) -- Level AAA

**What it requires:** This is the stricter version of 3.3.8. It applies the same requirements but removes the exceptions for object recognition and personal content recognition. Under 3.3.9, no cognitive function test of any kind is required unless an alternative method or an assistive mechanism (like a password manager) is available.

**Practical implication:** If you meet this criterion, your authentication flow either supports password managers fully or provides a completely non-cognitive alternative (passkeys, magic links, biometrics). Image-based CAPTCHAs like "Select all traffic lights" would not satisfy this criterion without an alternative that avoids cognitive effort.

For organizations targeting the highest level of inclusivity, implementing passkey support and ensuring full password manager compatibility is the clearest path to meeting 3.3.9.

---

## What Was Removed: SC 4.1.1 Parsing (Level A)

WCAG 2.2 removes one success criterion that existed in WCAG 2.1: **SC 4.1.1 Parsing**, which previously required that HTML content be parsed without significant errors -- specifically, that elements have complete start and end tags, are nested correctly, do not contain duplicate attributes, and have unique IDs (except where the specification allows otherwise).

**Why it was removed:** When SC 4.1.1 was written for WCAG 2.0 in 2008, browsers and assistive technologies handled malformed HTML inconsistently. Parsing errors could cause screen readers and other tools to misinterpret page content in unpredictable ways. Modern browsers now use the HTML5 parsing algorithm, which handles malformed markup consistently and predictably. The problems that SC 4.1.1 was designed to prevent are now handled by the platform layer rather than by author-side markup validation.

**What this means for you:** If your WCAG testing process includes HTML validation as a check for SC 4.1.1 compliance, you can remove that specific requirement from your conformance reports. This does not mean that well-formed HTML no longer matters -- it absolutely does for maintainability, performance, and compatibility. It simply means that markup parsing errors are no longer considered a WCAG conformance failure.

Note that if you are still conforming to WCAG 2.1 (rather than updating to 2.2), SC 4.1.1 remains part of that standard. The removal only applies to WCAG 2.2 conformance claims.

---

## Practical Impact: What to Change on Your Site

With the nine new criteria defined, here is a consolidated list of the most common changes websites need to make to move from WCAG 2.1 AA to WCAG 2.2 AA conformance.

### 1. Audit Your Fixed and Sticky Elements

Walk through your site using only the keyboard. Tab through every interactive element and verify that the focused element is never hidden behind sticky headers, fixed footers, cookie banners, or chat widgets. This addresses both 2.4.11 (Level A) and 2.4.12 (Level AA).

### 2. Add Alternatives to Every Drag Interaction

Inventory every feature on your site that uses drag-and-drop. For each one, ensure a non-dragging alternative exists: buttons, menus, direct text input, or click-to-select interfaces. This addresses 2.5.7.

### 3. Redesign Your Focus Indicators

Inspect every interactive element's focus style. Replace thin, low-contrast, or suppressed focus indicators with outlines that are at least 2 CSS pixels thick and have a contrast ratio of at least 3:1. This addresses 2.4.13.

### 4. Standardize Your Help Mechanisms

Review every page template on your site. Confirm that help links, phone numbers, email addresses, chat widgets, and FAQ links appear in the same location and the same relative order on every page. This addresses 3.2.6.

### 5. Eliminate Redundant Data Entry

Map out every multi-step form and checkout flow. Identify anywhere users are asked to provide information they have already entered, and add auto-population or "same as above" options. This addresses 3.3.7.

### 6. Make Your Login Compatible With Password Managers

Ensure your authentication forms use correct `autocomplete` attributes, allow paste in password fields, and do not use JavaScript tricks that interfere with credential auto-fill. Consider adding passkey or magic link support as a non-cognitive alternative. This addresses 3.3.8.

### 7. Run a Full Scan

Automated testing tools can detect many of these issues, including missing focus styles, missing autocomplete attributes, and duplicate-ID problems related to the now-removed SC 4.1.1. Use [A11yScope's free scanner](/) to run a baseline scan of your site and identify issues across the full WCAG 2.2 criteria set.

---

## WCAG 2.2 vs. WCAG 2.1: When to Update Your Compliance Target

If you are currently targeting WCAG 2.1 AA, you may be wondering whether and when you should shift your conformance target to WCAG 2.2 AA. Here are the key considerations:

### Legal References Are Catching Up

Most existing accessibility laws -- including ADA case law, the European Accessibility Act, and Section 508 -- currently reference WCAG 2.1 as the technical standard. However, WCAG 2.2 is the current W3C Recommendation, and legal frameworks tend to evolve toward the latest published standard. Organizations that proactively adopt 2.2 are positioning themselves ahead of inevitable regulatory updates.

### WCAG 2.2 Is a Superset of 2.1

Because WCAG 2.2 includes all of WCAG 2.1 (minus the removed SC 4.1.1), conforming to WCAG 2.2 AA automatically means you also conform to WCAG 2.1 AA. There is no conflict or trade-off. Updating your target gives you broader coverage without sacrificing anything.

### The New Criteria Reflect Real User Needs

The nine new success criteria are not theoretical. They address real usability problems that real people encounter daily: being unable to see where keyboard focus is, being forced to drag elements when dragging is physically impossible, being asked to remember passwords without any alternative, and being required to re-enter information already provided. Meeting these criteria makes your website genuinely more usable.

### How to Transition

1. **Run a gap analysis.** Scan your site against the WCAG 2.2 criteria to identify which new requirements you already meet and where you have gaps. [A11yScope's free scanner](/) provides automated detection for many of these issues.
2. **Prioritize by impact.** Start with Level A criteria (2.4.11 and 2.5.7) since they represent the minimum baseline, then address the Level AA criteria that are most likely to affect your users.
3. **Integrate into your workflow.** Add the new criteria to your design review checklists, QA testing scripts, and CI/CD pipeline checks. Accessibility is not a one-time project -- it is a continuous practice.
4. **Monitor continuously.** Requirements do not stay fixed, and neither does your website. New pages, new features, and content updates can introduce regressions. Use [A11yScope's Pro plan](/#pricing) for ongoing automated monitoring that alerts you when new accessibility issues are detected.

If you are building your compliance program from scratch, start with our [WCAG 2.1 checklist](/blog/wcag-compliance-checklist-2026) for a comprehensive foundation, then layer in the WCAG 2.2 additions covered in this guide.

---

## Quick Reference: All WCAG 2.2 Changes at a Glance

| Success Criterion | Level | Summary |
|---|---|---|
| 2.4.11 Focus Not Obscured (Minimum) | A | Focused element must not be entirely hidden by other content |
| 2.5.7 Dragging Movements | A | Drag operations must have a single-pointer alternative |
| 2.4.12 Focus Not Obscured (Enhanced) | AA | Focused element must not be partially hidden by other content |
| 2.4.13 Focus Appearance | AA | Focus indicators must meet minimum size and contrast thresholds |
| 3.2.6 Consistent Help | AA | Help mechanisms must appear in the same order on every page |
| 3.3.7 Redundant Entry | AA | Previously entered data must be auto-populated or selectable |
| 3.3.8 Accessible Authentication (Minimum) | AA | Authentication must not require cognitive function tests without alternatives |
| 3.3.9 Accessible Authentication (Enhanced) | AAA | Stricter version: removes object and personal content recognition exceptions |
| 4.1.1 Parsing | Removed | No longer a conformance requirement in WCAG 2.2 |

---

## Start Your WCAG 2.2 Audit Today

WCAG 2.2 is not a distant future requirement -- it is the current W3C standard, and the accessibility community, regulatory bodies, and courts are already referencing it. Waiting to update your compliance target only increases the remediation effort when you eventually do.

The good news is that most of the new criteria address issues you can fix with straightforward CSS changes, HTML attribute corrections, and design pattern updates. You do not need to rebuild your site. You need to audit, prioritize, and incrementally improve.

Start with a scan. [A11yScope's free scanner](/) evaluates your site against WCAG 2.2 criteria automatically, giving you a clear picture of where you stand and what needs attention. For organizations that need continuous monitoring, scheduled scans, and detailed reporting, the [Pro plan](/#pricing) provides the infrastructure to keep your site compliant as it evolves.

Accessibility is not a checkbox you tick once. It is a commitment to ensuring that every person who visits your website can use it effectively. WCAG 2.2 raises the standard, and your site should rise with it.
