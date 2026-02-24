---
title: "WordPress Accessibility: How to Make Your WordPress Site WCAG Compliant"
description: "Learn how to improve WordPress accessibility with actionable steps for choosing themes, auditing plugins, and editing content to meet WCAG 2.1 AA compliance."
date: 2026-02-25
author: AccessGuard Team
tags: [WordPress, Accessibility, WCAG, CMS]
---

# WordPress Accessibility: How to Make Your WordPress Site WCAG Compliant

WordPress powers a massive share of the web, and that reach comes with a responsibility that most site owners are not meeting. The platform itself has made real strides toward accessibility in its core software, but the moment you install a third-party theme, add a handful of plugins, and start publishing content, you inherit accessibility problems that WordPress core cannot prevent. The result is that the vast majority of WordPress sites fail basic WCAG 2.1 Level AA checks, often in ways that completely block users who rely on screen readers, keyboards, or other assistive technologies.

This guide is for web agencies managing client WordPress sites and for small business owners running their own. It covers the areas where WordPress accessibility breaks down most often — themes, plugins, and content — and gives you concrete steps to fix each one.

## The State of WordPress Accessibility

WordPress core has an active accessibility team that reviews new features and block editor updates against WCAG standards. The admin dashboard itself has undergone significant accessibility improvements over the years, and the Gutenberg block editor is built with ARIA roles and keyboard navigation in mind. On paper, WordPress provides a solid foundation.

The problem is everything that sits on top of core.

Most WordPress sites use a third-party theme for their front-end design and rely on anywhere from five to thirty plugins for functionality like contact forms, SEO, analytics, e-commerce, sliders, and page builders. Each of these introduces its own HTML, CSS, and JavaScript, and the accessibility quality varies enormously.

The most common WCAG failures on WordPress sites include:

- **Missing or improper alt text on images**, especially in themes that use background images for hero sections or in plugins that generate image galleries.
- **Low color contrast** in theme stylesheets, particularly for navigation links, placeholder text, and footer content.
- **Missing form labels** in contact form plugins that rely on placeholder text instead of proper `<label>` elements.
- **Inaccessible navigation menus** that only open submenus on mouse hover and provide no keyboard interaction.
- **Keyboard traps** in sliders, lightboxes, and modal popups that offer no way to close or escape using the keyboard.
- **Skipped heading levels** introduced by themes that use `<h3>` or `<h4>` for widget titles regardless of the surrounding document structure.
- **Missing skip navigation links**, even in themes that claim to be "accessibility ready."
- **Auto-playing media** in hero sliders and background video sections.

These are not theoretical problems. They are the issues that show up repeatedly when you scan WordPress sites with an automated accessibility tool. If you have not scanned your own site recently, that is the first step — but more on that at the end.

## Choosing an Accessible WordPress Theme

Your theme controls the entire front-end HTML structure, so an inaccessible theme means an inaccessible site regardless of how carefully you manage your content. Choosing the right theme is the single highest-leverage decision for WordPress accessibility.

### The "Accessibility Ready" Tag

The WordPress.org theme directory has an "accessibility-ready" tag that indicates a theme has passed a review against a specific set of accessibility requirements. Themes with this tag must meet criteria including:

- Skip navigation links
- Keyboard navigation for all menus and interactive elements
- Visible focus indicators on all focusable elements
- Correct use of heading hierarchy
- Sufficient color contrast in default styles
- Proper use of ARIA landmarks
- Labeled form elements

This tag is a useful starting point, but it is not a guarantee. The review checks for a baseline set of requirements, not full WCAG 2.1 AA conformance. A theme can pass the accessibility-ready review and still have contrast issues in certain color schemes, missing focus styles on custom components, or improperly structured markup in specific templates.

### What to Evaluate Before Choosing a Theme

Whether you are selecting from the WordPress.org directory or evaluating a premium theme, run through this checklist:

- **Keyboard navigation.** Activate the theme on a staging site and navigate the entire front end using only the Tab, Enter, Escape, and Arrow keys. Every menu, link, button, and form field should be reachable and operable. Dropdown menus must open and close with the keyboard, not just on hover.
- **Skip navigation link.** Press Tab on page load. The first focusable element should be a "Skip to content" link that jumps past the header and navigation.
- **Focus indicators.** As you Tab through the page, every focused element should have a clearly visible outline or highlight. If focus disappears on any element, the theme is suppressing the default focus style without providing a replacement.
- **Heading structure.** Inspect the page source and verify that there is exactly one `<h1>`, that headings do not skip levels, and that the hierarchy reflects the visual content structure.
- **Landmark regions.** Check for `<header>`, `<nav>`, `<main>`, and `<footer>` elements in the markup. These landmarks allow screen reader users to jump between major page sections.
- **Color contrast.** Test the default color scheme using a contrast checker. Pay special attention to navigation text, body text, link text, and any text overlaid on images or colored backgrounds.
- **Responsive behavior.** Zoom the browser to 200% and verify that no content is cut off or overlapping. Check the site at 320px viewport width for horizontal scrolling.

### Themes Worth Considering

The default WordPress themes (Twenty Twenty-Four, Twenty Twenty-Five, and their predecessors) are built by the WordPress core team and consistently meet the accessibility-ready criteria. They are the safest baseline choice. Beyond the defaults, filter the WordPress.org theme directory by the "accessibility-ready" tag and apply the evaluation checklist above to any theme you consider. Third-party theme quality varies year to year, so always test rather than relying on recommendations alone.

## Plugin Accessibility: The Hidden Liability

Themes get the most attention in accessibility discussions, but plugins are often the bigger problem. Plugins inject their own markup, styles, and scripts into the front end, and they frequently override or conflict with the theme's accessibility features. The plugin ecosystem has no equivalent of the "accessibility-ready" review for themes — there is no accessibility gate that a plugin must pass before being listed in the directory.

### Contact Form Plugins

Contact forms are one of the most common sources of accessibility violations on WordPress sites. The issues typically include:

- **Missing `<label>` elements.** Some form plugins render fields with only placeholder text and no associated label. Screen reader users have no way to identify what each field expects.
- **Inaccessible error messages.** When a user submits a form with errors, the error feedback must be programmatically associated with the relevant field using `aria-describedby` or `aria-invalid`, and it should be announced to screen readers. Many plugins simply display a colored message at the top of the form that screen readers may never encounter.
- **CAPTCHA barriers.** Image-based CAPTCHAs are completely inaccessible to blind users. If your form plugin uses a CAPTCHA, ensure it offers an audio alternative or switch to a more accessible anti-spam method like a honeypot field or server-side validation.

**What to do:** Test your contact forms with a keyboard and a screen reader. Verify that every field has a label that is announced when the field receives focus. Submit the form with errors intentionally and confirm that error messages are announced and linked to the correct fields. Popular plugins like Contact Form 7 and WPForms have improved their accessibility over time, but default configurations may still require manual adjustments. Always test the actual rendered output, not the plugin's marketing claims.

### Sliders and Carousels

Image sliders and carousels are among the worst offenders for WordPress accessibility. Common problems include:

- **Auto-advancing slides** with no pause button, which violates WCAG 2.2.2 (Pause, Stop, Hide).
- **No keyboard controls.** Users cannot navigate between slides using arrow keys or Tab.
- **Missing alt text** on slide images, or alt text that is ignored because the image is set as a CSS background.
- **Missing live region announcements.** When a slide changes, screen reader users receive no indication that the content has updated.

**What to do:** The most accessible approach is to avoid sliders entirely. They perform poorly for conversions and create significant accessibility barriers. If a slider is required, ensure it has visible pause/play controls, supports keyboard navigation, uses proper `<img>` elements with alt text rather than background images, and announces slide changes to assistive technology using `aria-live` regions. Test with auto-play disabled by default.

### Page Builders

Page builders like Elementor, Beaver Builder, and WPBakery generate the HTML structure of your content, which means they directly control the accessibility of your page layout. The issues with page builders include:

- **Excessive and non-semantic markup.** Page builders often generate deeply nested `<div>` elements with no semantic meaning, making it difficult for screen readers to parse the content structure.
- **Heading misuse.** It is easy to select heading levels in a page builder based on visual size rather than document hierarchy, resulting in skipped heading levels throughout the page.
- **Custom widgets** with missing ARIA attributes. Tabs, accordions, and toggle components built into page builders may lack the keyboard interactions and ARIA roles required for accessibility.
- **Inline styles** that override theme-level accessibility features like focus indicators.

**What to do:** If you use a page builder, test every custom layout with a keyboard and verify the heading hierarchy using a browser extension or [AccessGuard's free scanner](/). Elementor has made notable improvements to its accessibility output in recent versions, but the quality of the final HTML depends heavily on how the builder is used. Pay attention to heading levels, use semantic elements where the builder allows it, and test interactive components individually.

### Other Plugins to Audit

Beyond forms, sliders, and page builders, audit these common plugin categories for accessibility:

- **Lightbox and gallery plugins.** Verify keyboard navigation, focus trapping, and Escape key to close.
- **Social media share buttons.** Ensure each button has an accessible name, not just an icon.
- **Cookie consent banners.** These are often the first element users encounter. They must be keyboard accessible and must not trap focus.
- **E-commerce plugins.** WooCommerce has an accessibility team, but custom themes and extensions can introduce issues in product listings, cart functionality, and checkout forms.
- **Chat widgets.** Third-party live chat plugins frequently inject inaccessible overlays. Test that they can be opened, used, and closed with the keyboard alone.

## Content Editing in WordPress: Getting the Basics Right

Even with an accessible theme and well-audited plugins, your site will fail WCAG checks if content is not published accessibly. WordPress gives content editors the tools to do this correctly in the block editor (Gutenberg), but the tools only work if editors know how to use them.

### Alt Text for Images

Every image uploaded to WordPress has an alt text field in the media library and in the image block settings panel. This is the single most important accessibility habit for content editors.

**Guidelines for writing alt text:**

- **Describe the content and function of the image.** A photo of a product should describe the product. A chart should summarize the data point it conveys.
- **Keep it concise.** One to two sentences is usually sufficient. Alt text is not a caption or a full description.
- **Do not start with "Image of" or "Photo of."** Screen readers already announce that the element is an image.
- **Mark decorative images as decorative.** In the Gutenberg image block, there is a toggle in the block settings panel that allows you to mark an image as decorative, which sets an empty `alt=""` attribute. Use this for purely decorative images that add no information to the content.

### Heading Structure in Gutenberg

The block editor makes it easy to add headings, but it also makes it easy to use them incorrectly. Each heading block lets you select a level from H1 through H6. The common mistake is choosing a heading level based on how it looks visually rather than where it falls in the document hierarchy.

**Rules for headings in WordPress content:**

- Your page or post title is the `<h1>`. Most themes render the post title as an H1 automatically. Do not add another H1 inside the content.
- Start your in-content headings at `<h2>` for major sections.
- Use `<h3>` for subsections within an H2 section, `<h4>` within an H3, and so on.
- Never skip levels. Do not jump from H2 to H4 because you prefer the smaller visual size. Instead, adjust the styling with CSS.

Gutenberg includes a Document Outline feature accessible through the top toolbar (the information icon or the list view). Use it to verify your heading hierarchy before publishing. It shows every heading in the post and flags skipped levels.

### Link Text

Links that read "click here," "read more," or "learn more" are meaningless to screen reader users who navigate by tabbing through links or pulling up a list of all links on the page. Each link's text should describe where it leads.

**Before:**

> To learn about our pricing, click here.

**After:**

> View our [pricing plans](/#pricing) for details.

In Gutenberg, select the text you want to link, press Ctrl+K (or Cmd+K on macOS), and enter the URL. The selected text becomes the link text, so choose descriptive words before creating the link.

### Lists, Tables, and Other Structured Content

Use the correct block types in Gutenberg for structured content:

- **Lists.** Use the List block for bulleted or numbered lists. Do not simulate lists by typing dashes or numbers in a Paragraph block. Proper list markup (`<ul>`, `<ol>`) allows screen readers to announce how many items the list contains and the user's position within it.
- **Tables.** Use the Table block for tabular data. Enable the header row option in the block settings so that the first row uses `<th>` elements. Do not use tables for layout purposes.
- **Quotes.** Use the Quote block for blockquotes rather than italicizing text in a paragraph.

### Video and Audio Content

If you embed video content in your posts, ensure captions are available. For YouTube and Vimeo embeds, enable captions on the source platform before embedding. For self-hosted video using the Video block, add a captions track file (WebVTT format) through the block settings.

For audio content such as podcasts, provide a text transcript either within the post or as a linked document.

## Building an Accessibility Workflow for WordPress Teams

For agencies managing multiple WordPress sites, individual fixes are not enough. You need a repeatable process that prevents accessibility regressions across every site and every content update.

### Establish Content Guidelines

Create a short accessibility style guide for content editors that covers:

- How to write alt text (with examples specific to your client's content)
- How to use heading levels correctly
- How to write descriptive link text
- When and how to add captions to video content

A single-page checklist that editors can reference before hitting Publish is more effective than a comprehensive guide that no one reads.

### Set Up Staging and Testing

Maintain a staging environment where theme updates, plugin updates, and major content changes are tested before going live. Run accessibility checks on staging as part of your QA process to catch regressions before they affect real users.

### Conduct Regular Scans

Manual testing is important but does not scale across dozens of client sites with hundreds of pages. Automated scanning catches the most common violations — missing alt text, contrast failures, missing labels, broken heading hierarchy — across your entire site on a regular schedule.

This is where [AccessGuard's free scanner](/) fits into your workflow. Run a scan against any WordPress site to get a prioritized list of WCAG 2.1 AA violations with specific element references and remediation guidance. A single scan gives you a clear picture of where the site stands.

For ongoing monitoring, AccessGuard's [Pro plan](/#pricing) runs weekly automated scans across your entire site and alerts you to new violations as they appear. For agencies, this means you can track accessibility health across all client sites without relying on manual audits. For business owners, it means your site stays compliant even as you publish new content, update plugins, and change themes.

## What About Accessibility Overlay Plugins?

You may have encountered WordPress plugins that promise to make your site accessible by adding an overlay widget — a toolbar that lets users adjust font sizes, colors, and spacing. These overlay tools do not make your site WCAG compliant.

Overlays do not fix the underlying HTML issues that cause accessibility failures. A missing form label is still missing. An inaccessible navigation menu is still inaccessible. A keyboard trap in a slider is still a trap. The overlay simply adds a surface-level widget that does not integrate with assistive technologies the way users actually rely on them.

The accessibility community, including advocacy organizations representing people with disabilities, has been vocal in opposing overlay solutions. Multiple lawsuits have been filed against websites that used overlay plugins, demonstrating that the legal community does not view overlays as a substitute for actual remediation.

The only reliable path to WordPress accessibility is fixing the source: choosing an accessible theme, auditing your plugins, publishing content correctly, and scanning regularly for regressions.

## Scan Your WordPress Site Now

WordPress gives you the tools to build an accessible website, but those tools require deliberate effort to use correctly. The gap between what WordPress makes possible and what most WordPress sites actually deliver is significant.

Start by understanding where your site stands today. [Run a free AccessGuard scan](/) on your WordPress site right now. You will get a detailed report of WCAG 2.1 AA violations, organized by severity, with specific guidance on what to fix first. No signup required.

If you are working through a broader accessibility initiative, our guides on [ADA compliance for small businesses](/blog/ada-website-compliance-guide-small-businesses) and [how to fix accessibility issues](/blog/how-to-fix-accessibility-issues-on-your-website) provide additional context and code-level remediation steps that apply directly to WordPress sites.

Accessibility is not a one-time project. Every theme update, plugin change, and new blog post can introduce regressions. Make scanning a regular part of your WordPress maintenance workflow, and your site will stay accessible as it evolves.
