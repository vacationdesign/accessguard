---
title: "PDF Accessibility: How to Create and Remediate Accessible PDF Documents"
description: "Learn how to create and fix accessible PDF documents. Cover tag structure, alt text, reading order, and forms to meet WCAG and ADA requirements."
date: 2026-02-25
author: AccessGuard Team
tags: [PDF, Accessibility, WCAG, Documents]
---

# PDF Accessibility: How to Create and Remediate Accessible PDF Documents

PDFs are everywhere. They serve as contracts, financial reports, policy documents, product brochures, government forms, and educational materials. Most organizations publish dozens or hundreds of PDFs through their websites without giving much thought to whether those documents are usable by people with disabilities. That is a problem because inaccessible PDFs create the same legal exposure and user exclusion as an inaccessible web page.

If your website links to PDF documents, those documents are part of your digital presence. The Americans with Disabilities Act (ADA), the European Accessibility Act (EAA), Section 508, and the Web Content Accessibility Guidelines (WCAG) all apply to documents you publish online, not just to your HTML pages.

This guide covers why PDF accessibility matters, what the most common failures are, how to create accessible PDFs from the start, how to remediate existing documents, and how to test your work.

## Why PDF Accessibility Matters

### Legal Requirements Apply to Documents, Not Just Web Pages

When people think about web accessibility compliance, they typically think about HTML pages. But legal requirements are not limited to HTML. The ADA requires that places of public accommodation provide equal access to their goods and services. If a government agency publishes a PDF application form that a blind person cannot fill out, or if a university posts course materials as image-only PDFs that screen readers cannot read, those organizations are failing their legal obligations.

The Department of Justice has consistently taken the position that documents published on the web must be accessible. Multiple enforcement actions and settlement agreements have specifically cited inaccessible PDF documents as violations. The European Accessibility Act, which applies to a broad range of products and services starting in 2025, similarly extends accessibility requirements to digital documents. For a broader overview of ADA obligations, see our [ADA compliance guide](/blog/ada-website-compliance-guide-small-businesses).

### PDFs Create Real Barriers for Real Users

A sighted user opens a PDF and sees a neatly formatted document. A screen reader user opens the same PDF and may hear nothing meaningful at all. Without proper tag structure, a screen reader cannot distinguish headings from body text, cannot navigate between sections, and cannot identify the reading order of content in multi-column layouts. Without alt text, every image is invisible to blind users. Without labeled form fields, a visually impaired user cannot complete a fillable form independently.

These are not hypothetical problems. Millions of people rely on assistive technology every day for work, education, healthcare, and civic participation. When your PDF documents are inaccessible, you are telling those users that your content is not for them.

### Inaccessible PDFs Undermine Your Web Accessibility Efforts

You may invest substantial time and budget making your website WCAG compliant, only to link out to PDF documents that fail basic accessibility checks. A single inaccessible PDF linked from an otherwise compliant page creates a gap in your accessibility coverage. Automated scanners may not catch issues inside PDF files, but manual testers, assistive technology users, and plaintiff attorneys certainly will.

## Common PDF Accessibility Failures

Before you can fix PDF accessibility problems, you need to understand what they look like. The following failures account for the vast majority of inaccessible PDFs encountered on the web.

### No Tag Structure

Tags are the PDF equivalent of semantic HTML. A tagged PDF contains a logical structure tree that identifies headings, paragraphs, lists, tables, figures, and other content types. This structure is what allows a screen reader to navigate the document, skip between sections, and convey the document's organization to the user.

An untagged PDF is a flat collection of visual elements with no semantic meaning. A screen reader will attempt to extract text in whatever order the content happens to be stored in the file, which often bears no resemblance to the visual reading order. Multi-column layouts, sidebars, headers, and footers become a jumbled stream of disconnected text. Scanned documents without optical character recognition (OCR) are the worst case: they contain only images of text, and a screen reader cannot read any of it.

### Missing Alt Text on Images

Every meaningful image in a PDF needs alternative text that conveys the same information a sighted user would get from viewing the image. Charts, diagrams, photographs, logos used as headings, and infographics all require descriptions. Decorative images that convey no information should be marked as artifacts so screen readers skip over them entirely.

The problem is not just that alt text is missing. Most PDF creation workflows do not prompt authors to add it, and applications like Word will let you export without warning. The result is that most PDFs published on the web contain images with no descriptions.

### Form Fields Without Labels

Fillable PDF forms present a specific challenge. Each form field — text input, checkbox, radio button, dropdown — must have a programmatic label that a screen reader can announce. Without labels, a screen reader user hears something like "edit text" with no indication of what information the field expects. They cannot independently complete the form.

Many organizations create PDF forms by placing text visually next to a form field and assuming the association is obvious. It is obvious to a sighted user, but there is no programmatic connection between the text and the field. The label must be explicitly associated with the form field in the PDF's tag structure and field properties.

### Incorrect Reading Order

PDFs do not inherently store content in the order you see it on the page. The visual layout uses coordinates to place each element at a specific position, but the underlying content stream may store those elements in a completely different sequence. A screen reader follows the tag structure's reading order, or if there are no tags, the content stream order.

Documents with multi-column layouts, pull quotes, sidebars, and floating text boxes are especially prone to reading order problems. A two-column page might present the first line of column one followed by the first line of column two to a screen reader, producing incomprehensible output.

### Missing Document Language

The PDF must declare its language so that screen readers use the correct pronunciation engine. A French document that does not declare its language will be read with English pronunciation rules, making it unintelligible. Even English documents should declare the language explicitly, as screen readers use this information to select the appropriate speech synthesizer.

### Inaccessible Tables

Tables in PDFs need properly defined header cells and data cells, just like tables in HTML. Without header markup, a screen reader cannot tell the user which column or row a data cell belongs to. Complex tables with merged cells, nested headers, or irregular structures are particularly difficult to make accessible in PDF format and often require manual tag editing.

## Creating Accessible PDFs from Source Documents

The most effective strategy for PDF accessibility is to build it in from the start. Remediating a finished PDF is always more time-consuming than creating an accessible source document that exports cleanly.

### Microsoft Word

Word is the most common source application for PDF documents in business environments, and it produces reasonably accessible PDFs when used correctly.

**Use built-in heading styles.** Apply Heading 1, Heading 2, and Heading 3 styles from Word's style gallery instead of manually formatting text with bold and larger font sizes. These heading styles become tagged headings in the exported PDF. A document that uses visual formatting only will produce an untagged or poorly tagged PDF.

**Add alt text to every image.** Right-click any image, select "Edit Alt Text," and write a concise description of what the image conveys. If the image is decorative, mark it as decorative so it is ignored by screen readers.

**Use Word's built-in table tools.** Create tables using the Insert Table function, not by using tabs or spaces to visually align text into columns. Designate the first row as a header row in the table properties. Avoid merged cells and nested tables where possible, as these create complex structures that are difficult to make accessible.

**Use Word's built-in list tools.** Create bulleted and numbered lists using the list formatting buttons, not by typing hyphens or numbers followed by spaces. Built-in list formatting translates to proper list tags in the PDF.

**Add meaningful hyperlink text.** Do not use "click here" or raw URLs as link text. Write link text that describes where the link goes, such as "view the full accessibility policy."

**Set the document language.** In Word, go to File, then Options, then Language, and confirm that the proofing language is set correctly. This language setting carries over to the PDF.

**Export correctly.** On Windows, use File, then Save As, then select PDF. Make sure the "Options" dialog has "Document structure tags for accessibility" checked. On Mac, use File, then Save As, then select PDF, and the tags are included by default. Do not use the Print to PDF function, as it strips out accessibility structure.

### Google Docs

Google Docs has more limited PDF export capabilities than Word but can produce reasonably tagged PDFs if you follow similar principles: use built-in heading styles, add alt text to images via right-click, and use the built-in table and list tools. When exporting, use File, then Download, then PDF Document. Google Docs includes tags automatically, though the tag quality is less refined than Word. You may still need to check the reading order and tag structure in the exported file.

### Adobe InDesign

InDesign is widely used for designed documents like brochures, reports, and marketing materials. It offers robust PDF accessibility support but requires deliberate effort.

**Use paragraph styles mapped to PDF tags.** In your paragraph style options, assign each style an export tag (H1, H2, P, etc.) under the Export Tagging section. This creates a clean tag structure in the exported PDF.

**Set the reading order with the Articles panel.** InDesign's Articles panel lets you define the order in which content should be read. Drag text frames, images, and other elements into the Articles panel in the correct reading order. Without this step, InDesign will export content in the order it was created, which is rarely the correct reading order.

**Add alt text through Object Export Options.** Select an image, then go to Object, then Object Export Options, and enter the alt text in the Alt Text tab.

**Add table headers.** Select header rows in your tables and assign them as header cells in the table options.

**Export with the right settings.** When exporting to PDF, check "Create Tagged PDF" and "Use Structure for Tab Order" in the export dialog. Choose PDF/UA as the standard if available in your version.

## Remediating Existing PDFs

When you have PDFs that were not created with accessibility in mind, you need to remediate them after the fact. Adobe Acrobat Pro is the primary tool for this work.

### Run the Accessibility Checker First

Open the PDF in Acrobat Pro and run the built-in accessibility checker: go to All Tools, then Prepare for Accessibility, then Check for Accessibility. This produces a report listing each issue as passed, failed, or needing manual check. It will identify missing tags, missing alt text, missing document title, missing language setting, untagged form fields, and some reading order issues. It will not catch every problem, but it gives you a clear starting point.

### Add Tags to an Untagged Document

If the PDF has no tags at all, Acrobat can auto-tag the document: go to Prepare for Accessibility, then Autotag Document. Acrobat analyzes the visual layout and assigns tags based on its interpretation of the content structure.

Auto-tagging is imperfect. Always review the results using the Tags panel (View, then Show/Hide, then Navigation Panes, then Tags) where you can reassign tag types, reorder tags, and nest them correctly. The Reading Order tool (under Prepare for Accessibility) provides a visual interface for selecting page regions and assigning them as headings, paragraphs, figures, tables, or background artifacts.

### Add and Edit Alt Text

To add alt text, find the Figure tag in the Tags panel, right-click it, select Properties, and enter the alternative text. You can also use the Set Alternative Text option under Prepare for Accessibility.

For decorative images, mark them as artifacts rather than figures. Artifacts are not part of the document's meaningful structure and are ignored by screen readers. Background images, decorative borders, and watermarks should all be artifacts.

### Fix Form Fields

Open the Prepare Form tool to see all form fields in the document. Each field should have a tooltip that serves as its accessible label. Open the field properties, go to the General tab, and enter a descriptive tooltip. For example, a field next to the text "First Name" should have the tooltip "First Name."

Set the tab order of form fields so they follow a logical sequence when a user navigates with the Tab key. You can set tab order by going to Page Thumbnails, right-clicking a page, and selecting Page Properties, then Tab Order.

### Set Document Properties

Open File, then Properties. Set the document title and language. Under Initial View, set the title bar to display the document title rather than the filename, as the title is more meaningful to assistive technology users.

### Consider the PDF/UA Standard

PDF/UA (Universal Accessibility, ISO 14289) is the ISO standard for accessible PDF documents. It defines specific requirements for tags, alt text, reading order, fonts, and metadata. A PDF that conforms to PDF/UA meets the document-level requirements of WCAG. If your organization publishes a high volume of PDFs, targeting PDF/UA conformance provides a clear, auditable standard.

## Testing PDF Accessibility

Creating or remediating a PDF is only half the work. You need to test the result to confirm that it actually works for assistive technology users.

### Automated Testing

**Adobe Acrobat Pro's accessibility checker** is your first-line automated test. Run it after every remediation pass. Address all failures and review all items flagged for manual check.

**PAC (PDF Accessibility Checker)** is a free tool developed by the Access For All Foundation that performs a thorough automated check against the PDF/UA standard. It is more rigorous than Acrobat's built-in checker and generates detailed reports showing exactly which tags and elements have issues. PAC is available for Windows and is widely used by accessibility professionals.

Automated checkers verify structural requirements — the presence of tags, alt text attributes, language settings, tab order, and table headers. They cannot verify quality. They can confirm that an image has alt text but not that the alt text is accurate, and that tags exist but not that the reading order makes sense.

### Manual Testing With a Screen Reader

The only way to truly verify PDF accessibility is to open the document in a screen reader and navigate it the way a blind user would. This step is essential and cannot be skipped.

**NVDA** (NonVisual Desktop Access) is a free, open-source screen reader for Windows. Open your PDF in Acrobat Reader with NVDA running and navigate through the document. Listen to how headings are announced, verify that the reading order is logical, check that images are described, and tab through form fields to confirm each one is labeled.

**JAWS** is a commercial screen reader widely used in enterprise environments. If your audience includes JAWS users, testing with JAWS is important, as there are rendering differences between screen readers. **VoiceOver** on macOS can also be used with Preview or Acrobat Reader.

As you test, ask yourself: Can you tell what the document is about from the title announcement? Can you navigate between sections using headings? Does the reading order match the visual layout? Are all images described? Can you complete all form fields? Are tables announced with their headers?

### Check Against WCAG

PDF accessibility maps to specific WCAG success criteria. The most relevant criteria for PDF documents include:

- **1.1.1 Non-text Content** — all meaningful images have alt text
- **1.3.1 Info and Relationships** — document structure is conveyed through tags
- **1.3.2 Meaningful Sequence** — reading order is correct
- **2.1.1 Keyboard** — forms and interactive elements work with keyboard alone
- **2.4.2 Page Titled** — document has a meaningful title
- **3.1.1 Language of Page** — document language is set
- **3.3.2 Labels or Instructions** — form fields are labeled

For a complete list of applicable criteria, see our [WCAG checklist](/blog/wcag-compliance-checklist-2026).

## Your Web Pages Host Those PDFs

Even a perfectly accessible PDF causes problems if the web page linking to it does not handle the link properly. Users should know they are about to open a PDF before they click. Best practice is to indicate the file type and size in the link text, such as "Download the annual report (PDF, 2.4 MB)."

If a PDF contains information that is critical to your site's purpose — application forms, legal disclosures, pricing documents, policy statements — consider whether that content should also be available as an accessible HTML page. HTML is inherently more accessible than PDF when built correctly, and it adapts better to different screen sizes and user preferences.

### Scan Your Website for Accessibility Issues

PDF accessibility is one piece of a larger compliance picture. The web pages that host your PDFs must also be accessible. Navigation, link text, color contrast, keyboard operability, and every other WCAG criterion applies to your HTML pages.

[AccessGuard's free scanner](/) checks your website against WCAG 2.1 Level AA criteria and identifies issues across your pages in seconds. It gives you a prioritized list of violations with clear explanations of what each issue means and how to fix it. For ongoing monitoring, scheduled scans, and detailed reporting across your entire site, the [Pro plan](/#pricing) provides continuous coverage so new accessibility issues are caught before they become complaints.

Accessible PDFs and accessible web pages together form a complete, compliant digital presence. Start with your website, extend that commitment to every document you publish, and your users — all of your users — will be able to engage with your content fully and independently.
