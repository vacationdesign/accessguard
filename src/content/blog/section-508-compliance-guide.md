---
title: "Section 508 Compliance: What It Requires and How It Differs From WCAG"
description: "Understand Section 508 compliance requirements for federal agencies and contractors. Learn how it maps to WCAG and what your organization must do."
date: 2026-02-25
author: AccessGuard Team
tags: [Section 508, Compliance, WCAG, Government]
---

# Section 508 Compliance: What It Requires and How It Differs From WCAG

If your organization builds, maintains, or sells technology to a federal agency, Section 508 compliance is not a suggestion. It is a legal mandate with real procurement consequences. Federal agencies cannot purchase or deploy information and communication technology (ICT) that fails to meet Section 508 standards, and contractors who cannot demonstrate conformance risk losing contracts they already hold or being disqualified from future opportunities.

Despite its significance, Section 508 is widely misunderstood. Many organizations conflate it with ADA compliance or assume that meeting WCAG automatically satisfies all 508 requirements. This guide explains what Section 508 actually requires, how it relates to and differs from WCAG and the ADA, who must comply, and what practical steps your organization should take to achieve and maintain conformance.

## What Is Section 508?

Section 508 is an amendment to the Rehabilitation Act of 1973. It requires federal agencies to make their electronic and information technology accessible to people with disabilities. This includes both employees with disabilities who use agency systems and members of the public who interact with agency-facing technology.

The law applies to all information and communication technology that a federal agency develops, procures, maintains, or uses. That scope is broad. It covers websites and web applications, desktop and mobile software, documents and multimedia, hardware such as kiosks and multifunction printers, telecommunications equipment, and any other technology that federal employees or the public interact with in a federal context.

Section 508 is enforced primarily through the federal procurement process. When an agency purchases technology, it must include 508 conformance requirements in the solicitation and evaluate vendor responses against those requirements. The Access Board, an independent federal agency, is responsible for developing and maintaining the technical standards that define what 508 conformance means.

### How Section 508 Differs From a Voluntary Guideline

Section 508 is a legal obligation, not a best practice recommendation. When the Access Board publishes updated standards, those standards become enforceable requirements for every federal agency and every vendor that sells technology to those agencies. Non-compliance can result in formal complaints filed with agency civil rights offices, loss of contract awards during competitive procurement, contract modifications or terminations, and legal action under the Rehabilitation Act.

## The 2017 Section 508 Refresh

The original Section 508 standards were published in 2000 and quickly became outdated as web technology evolved. The standards referenced specific technologies (like HTML 4.0) and did not account for mobile devices, dynamic web applications, or modern assistive technology.

In January 2017, the Access Board published a comprehensive update known as the Section 508 Refresh. This update fundamentally changed how 508 conformance is defined by incorporating WCAG 2.0 Level AA as the benchmark for web content and software accessibility.

### What the Refresh Changed

The 2017 refresh replaced the previous technology-specific standards with a performance-based approach organized around the WCAG framework. Specifically:

- **Web content** must conform to WCAG 2.0 Level AA (all Level A and AA success criteria).
- **Software applications** must meet functional performance criteria that are closely aligned with WCAG principles, adapted for non-web contexts.
- **Hardware** must meet specific physical accessibility requirements covering things like operable parts, display screens, and biometric systems.
- **Electronic documents** (PDFs, Word documents, spreadsheets, presentations) must meet the same WCAG 2.0 Level AA criteria when those criteria are applicable.
- **Multimedia** must provide captions, audio descriptions, and accessible media players.

The refresh also adopted the concept of functional performance criteria as a backstop. Even if a specific technical standard does not address a particular accessibility barrier, the technology must still be usable by people with various disabilities, including those with vision, hearing, motor, cognitive, and speech impairments.

### Where WCAG 2.1 and 2.2 Fit

The 2017 refresh formally incorporated WCAG 2.0 Level AA. It did not incorporate WCAG 2.1 (published in 2018) or WCAG 2.2 (published in 2023). This creates a nuance that organizations must understand.

Legally, the minimum requirement for Section 508 is WCAG 2.0 AA. However, there are strong practical reasons to target WCAG 2.1 AA or higher:

- **WCAG 2.1 is backward-compatible with 2.0.** Meeting 2.1 AA automatically satisfies all 2.0 AA requirements.
- **WCAG 2.1 adds criteria that address mobile accessibility and cognitive disabilities** that are increasingly relevant to federal technology, including requirements for touch target size, content reflow on mobile screens, and orientation support.
- **The Department of Justice referenced WCAG 2.1** in its 2024 rule on web accessibility under ADA Title II for state and local governments, signaling a regulatory trend toward 2.1 as the standard of care.
- **Many federal agencies already expect WCAG 2.1 conformance** in practice, even if the formal 508 standard has not been updated to require it.

For a detailed breakdown of every WCAG success criterion and how to test for it, see our [WCAG checklist](/blog/wcag-compliance-checklist-2026).

## Who Must Comply With Section 508

Section 508's reach extends well beyond the federal agencies themselves. Understanding who is subject to these requirements is critical for determining whether your organization has obligations.

### Federal Agencies

Every department, agency, and office within the executive, legislative, and judicial branches of the federal government must comply with Section 508. This includes cabinet-level departments like the Department of Defense and the Department of Health and Human Services, independent agencies like the EPA and NASA, and smaller offices and commissions. There are no exceptions based on agency size or budget.

### Federal Contractors and Vendors

Any company that sells, develops, or provides ICT to a federal agency must ensure that its products and services conform to Section 508 standards. This includes software vendors whose products are purchased through GSA Schedule contracts, IT services firms that build custom applications for agencies, cloud service providers offering SaaS platforms to government clients, consulting firms that deliver reports and documents in electronic format, and hardware manufacturers whose products are deployed in federal workplaces.

When responding to a federal Request for Proposal (RFP) or Request for Quotation (RFQ), vendors are typically required to submit a Voluntary Product Accessibility Template (VPAT) documenting how their product conforms to Section 508 standards. A missing or incomplete VPAT can be grounds for disqualification from the procurement process.

### Organizations Receiving Federal Funding

Section 508 requirements can extend to organizations that receive federal grants or other forms of federal financial assistance. While the extent of this obligation varies depending on the specific grant program and agency, many grant agreements include technology accessibility requirements that reference Section 508 standards. State agencies that administer federally funded programs (such as Medicaid or SNAP) frequently inherit 508 obligations for the technology they use to deliver those programs.

### Subcontractors

If your organization is a subcontractor to a federal prime contractor, your deliverables may need to meet Section 508 standards. The prime contractor's obligation flows down through the supply chain. If you are building a software module, providing content, or delivering documents that will be used in a federal context, you should assume that 508 conformance is required.

## How Section 508 Differs From ADA Compliance

Section 508 and the ADA are both federal laws that address disability-related access, but they are distinct statutes with different scopes, enforcement mechanisms, and technical requirements. Organizations that serve both government and private-sector clients need to understand where these laws overlap and where they diverge.

### Scope of Coverage

The ADA (specifically Title III) applies to places of public accommodation, which courts have interpreted to include websites operated by private businesses. Its scope is broad: virtually any business that serves the public has some obligation under the ADA.

Section 508, by contrast, applies only to federal agencies and the technology they develop, procure, maintain, or use. A private company with no federal contracts has no Section 508 obligations, even if it has extensive ADA obligations for its public-facing website.

The overlap occurs when a company has both a public-facing website (subject to the ADA) and federal contracts (subject to Section 508). In that situation, the same company may need to meet ADA requirements for its commercial website and Section 508 requirements for the products it delivers to government clients.

### Technical Standards

Under the ADA, there is no single legislated technical standard for web accessibility. The DOJ's 2024 rule for state and local government websites under Title II references WCAG 2.1 Level AA, and courts have increasingly treated WCAG 2.1 AA as the benchmark for Title III cases involving private businesses, but this has evolved through case law and regulatory guidance rather than through the statute itself.

Section 508 explicitly incorporates WCAG 2.0 Level AA through the Access Board's technical standards. This provides more regulatory certainty about exactly what is required, but it also means the standard may lag behind the latest WCAG version. For a broader look at ADA web accessibility requirements, see our [ADA compliance guide](/blog/ada-website-compliance-guide-small-businesses).

### Enforcement Mechanisms

ADA compliance is enforced primarily through private lawsuits and DOJ enforcement actions. Any individual with a disability can file a lawsuit against a business whose website is inaccessible.

Section 508 enforcement works differently. The primary mechanism is the procurement process itself: agencies must evaluate 508 conformance when purchasing technology, and non-conforming products can be excluded. Individuals can also file administrative complaints with the relevant agency's civil rights office, and the DOJ can investigate agencies for systemic non-compliance. There is no private right of action directly under Section 508 in the way there is under ADA Title III, though Section 504 of the Rehabilitation Act provides a parallel avenue for legal action covering technology accessibility.

### Coverage of Non-Web Technology

One important difference is that Section 508 explicitly covers categories of technology that the ADA does not directly address with technical standards. Section 508 includes specific requirements for hardware accessibility (physical controls, display characteristics, biometric systems), electronic document accessibility (PDFs, office documents, forms), telecommunications equipment, and desktop and mobile software applications. The ADA's "effective communication" requirement can encompass some of these areas, but Section 508 provides much more specific technical guidance.

## Practical Section 508 Compliance Steps

Achieving and maintaining Section 508 compliance requires a structured approach. The following steps apply whether your organization is a federal agency building internal systems or a contractor preparing products for government procurement.

### Step 1: Determine Your Compliance Scope

Start by identifying every piece of ICT that falls within your Section 508 obligations. For federal agencies, this includes all public-facing websites and web applications, all internal systems used by employees (intranets, HR systems, project management tools), all electronic documents published internally or externally, multimedia content, and hardware deployed in workplaces open to the public.

For contractors, the scope is defined by your contract and the products or services you deliver to the agency. Review your contract language carefully. Look for references to Section 508 in the statement of work, the Federal Acquisition Regulation (FAR) clause 39.2, and any agency-specific accessibility requirements.

### Step 2: Conduct a Baseline Accessibility Audit

Before you can plan remediation, you need to understand your current state of conformance. A thorough 508 audit combines automated scanning with manual expert testing.

**Automated scanning** identifies the most common and programmatically detectable violations: missing alt text, insufficient color contrast, missing form labels, invalid ARIA attributes, and similar structural issues. Automated tools typically catch 30 to 40 percent of WCAG violations.

**Manual testing** covers what automation cannot: keyboard navigation behavior, screen reader compatibility, logical reading order, the quality and accuracy of alt text and labels, and the usability of complex interactive components like data tables, forms, and modal dialogs.

Start your automated audit with [AccessGuard's free scanner](/). It tests your web content against WCAG 2.1 AA criteria and delivers a prioritized report of violations with specific guidance on how to fix each one. For organizations with large sites or multiple properties, the [Pro plan](/#pricing) supports ongoing monitoring across your entire digital footprint.

### Step 3: Create and Submit VPATs

For contractors and vendors, the Voluntary Product Accessibility Template (VPAT) is the standard document for communicating your product's level of Section 508 conformance. The current version is based on the Information Technology Industry Council's (ITI) Accessibility Conformance Report (ACR) format and is organized into sections corresponding to WCAG success criteria, software requirements, hardware requirements, and support documentation.

A credible VPAT requires:

- **Honest reporting.** Each criterion should be marked as Supports, Partially Supports, Does Not Support, or Not Applicable, with explanatory remarks. Claiming full conformance when known issues exist will damage your credibility during procurement evaluation.
- **Specificity.** Remarks should describe the actual state of conformance, including known issues and planned remediation, rather than vague statements about ongoing commitment.
- **Currency.** VPATs should reflect the current version of your product and be updated with each major release.

### Step 4: Establish a Remediation Plan

Based on your audit findings, create a prioritized remediation plan. Prioritize issues based on two factors: severity of impact on users with disabilities, and risk to your procurement or contractual standing.

A practical prioritization framework:

1. **Critical (fix immediately):** Issues that completely block access to core functionality. Examples include forms that cannot be submitted with a keyboard, pages with no heading structure that are unnavigable by screen reader, and images conveying essential information with no alt text.
2. **High (fix within 30 days):** Issues that significantly impair usability. Examples include insufficient color contrast on primary text, missing labels on form fields, and focus order that does not match visual layout.
3. **Medium (fix within 90 days):** Issues that cause inconvenience but do not block task completion. Examples include missing skip navigation links, inconsistent focus indicators, and audio content without transcripts.
4. **Low (fix in next release cycle):** Issues that represent minor deviations from best practice. Examples include verbose alt text, minor heading hierarchy issues, and redundant ARIA attributes.

### Step 5: Integrate Accessibility Into Your Development Lifecycle

One-time remediation sprints address existing accessibility debt, but they are not sustainable. Build accessibility into every phase of your development process:

- **Design:** Use accessible color palettes, specify heading hierarchies in design annotations, and write alt text at the design stage.
- **Development:** Write semantic HTML. Use native elements instead of custom `<div>`-based components. Follow WAI-ARIA authoring practices for custom widgets. Run automated accessibility checks before committing code.
- **QA:** Include keyboard-only testing and screen reader testing in your test plans. Verify that features meet WCAG success criteria before release.
- **Deployment:** Integrate automated accessibility scanning into your CI/CD pipeline so regressions are caught before production.
- **Post-launch:** Monitor your production site continuously. Content changes, third-party script updates, and CMS-authored pages can introduce new issues at any time.

### Step 6: Train Your Team

Section 508 compliance requires awareness across your organization, not just from a single accessibility specialist. Prioritize training for content authors (alt text, heading structure, document accessibility), designers (color contrast, focus indicators, responsive design), developers (WCAG criteria, ARIA practices, assistive technology testing), project managers and procurement officers (VPAT evaluation, contract requirements), and QA testers (keyboard testing, screen reader testing, manual audits).

### Step 7: Document Everything

Documentation is critical for Section 508 compliance. Agencies evaluate documentation as evidence of conformance during procurement, and it demonstrates good faith during complaint investigations. Maintain audit reports, VPATs for each product version, remediation plans with timelines, training records, testing procedures, and conformance statements that describe your product's accessibility status and any known limitations.

## Common Section 508 Compliance Pitfalls

Organizations pursuing Section 508 compliance frequently make the following mistakes. Being aware of them can save you significant time and contractual risk.

### Relying Solely on Automated Scanning

Automated scanners are essential but insufficient. They cannot evaluate whether alt text accurately describes an image, whether focus management makes logical sense, or whether dynamic content updates are announced to screen readers. An organization that runs a scan, fixes flagged issues, and declares conformance will almost certainly have significant unresolved barriers.

### Treating the VPAT as a Marketing Document

Some organizations prepare VPATs that overstate conformance or use vague language to obscure known issues. Federal procurement officers are experienced at reading VPATs and will recognize inflated claims. A VPAT that honestly acknowledges partial conformance with a credible remediation plan is more trustworthy than one claiming full support without evidence.

### Ignoring Document Accessibility

Web accessibility receives the most attention, but Section 508 also applies to electronic documents. PDFs, Word documents, spreadsheets, and presentations must be accessible when published in a federal context, with proper heading structure, tagged content, data table markup, and correct reading order. Document accessibility is frequently overlooked and is a common source of 508 complaints.

### Overlooking Third-Party Content

If your website includes third-party components (embedded maps, chat widgets, social media feeds, payment processors), you are responsible for the accessibility of the complete user experience. Third-party content that introduces barriers can cause your product to fail 508 conformance even if your own code is fully accessible.

### Failing to Monitor After Launch

Accessibility is not a fixed state. Every content update, design change, or third-party script update can introduce new barriers. Organizations that audit once and stop monitoring invariably drift out of conformance. Continuous monitoring is not optional for sustained 508 compliance.

## Scanning for Section 508 Conformance

The foundation of any Section 508 compliance program is understanding where your technology stands right now. You cannot plan remediation, prepare accurate VPATs, or demonstrate good faith without a clear and current picture of your conformance status.

[AccessGuard's free scanner](/) gives you that picture in minutes. Enter your URL and get a detailed, prioritized report of every automatically detectable WCAG violation on your site, with specific explanations of what each issue means, which WCAG success criteria it violates, and how to fix it.

For organizations managing multiple federal-facing properties or maintaining ongoing 508 conformance across large sites, the [Pro plan](/#pricing) provides automated weekly scans, historical trend tracking, and exportable reports that support your VPAT documentation and demonstrate continuous compliance monitoring to your agency clients.

Whether you are a federal agency auditing your own digital properties, a contractor preparing for a procurement response, or an organization receiving federal funds, the first step is the same: understand where you stand. Run your scan, review the results, build your remediation plan, and move toward a defensible, documented state of Section 508 compliance.

[Start your free Section 508 compliance scan today](/).
