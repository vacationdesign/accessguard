# A11yScope Audit and Growth Improvement Plan

作成日: 2026-04-25
対象: `C:\Users\g5501\projects\a11yscope\a11yscope`
本番URL: https://www.a11yscope.com

## 1. Executive Summary

A11yScope は「無料の単ページWCAGスキャン -> Proの継続監視 -> Agencyのホワイトラベルレポート」という SaaS 導線の骨格ができている。公開サイトは主要ページ、sitemap、robots、llms.txt が 200 で返り、Next.js production build も成功する。

一方で、現時点の最大課題は以下の5つ。

1. Lint が 53 errors / 4 warnings で失敗しており、CI品質ゲートとして機能していない。
2. `public/llms.txt` の Free/Pro/Agency 説明が現行仕様とズレている。ChatGPT 経由流入があるため、これは獲得導線上の優先度が高い。
3. フルサイトクロールAPIはあるが、ダッシュボードから実行できるUIがない。Pro価値が体験されにくい。
4. FAQページにA11yScope自身の色コントラスト違反がある。アクセシビリティ製品として信用毀損リスクが高い。
5. Free signup、Email This Report、onboarding drip は実装されているが、計測とUI配置が弱く、獲得/転換の学習速度が遅い。

推奨方針は、まず「信頼性と一貫性」を1週間で直し、次に「無料スキャンから保存・メール・Pro試用への転換」を2週間で強化し、その後に「業種別SEOとAgency向け販売導線」を積み上げること。

## 2. Current State

### Product

- Free anonymous scan: 5 scans/hour per IP
- Signed-in Free: 50 scans/month per account
- Pro: unlimited scans, 3 monitored sites, weekly full-site crawl up to 20 pages, PDF reports
- Agency: 10 monitored sites, crawl up to 50 pages, white-label PDF reports
- Email This Report endpoint and onboarding drip are present
- Public blog has 29 articles and 35 sitemap URLs

### Validation

- `npm run build`: success
- `npm run lint`: failure, 57 total findings
- Public health:
  - `/`: 200
  - `/faq`: 200
  - `/blog`: 200
  - `/sitemap.xml`: 200
  - `/robots.txt`: 200
  - `/llms.txt`: 200
- Quick axe scan against live pages:
  - `/`: 0 violations, 1 incomplete
  - `/blog`: 0 violations, 1 incomplete
  - `/faq`: 1 serious color-contrast violation, 2 nodes

### Growth Signals from Existing SEO Reports

Latest local reports show:

- GSC: 22 clicks, 299 impressions, CTR 7.4%, avg position 21.6
- Total scans: 499
- April scans: 229, matching/exceeding March
- Users: 6 total, Free 5 / Pro 1
- Vercel 7-day traffic: 35 visitors, 65 page views, 63% bounce
- Referrers include ChatGPT and Google
- No new signups in 9 days as of the 2026-04-24 report
- `email_events` remains 0, suggesting Email This Report has not been discovered or used yet

## 3. High Priority Findings

### P0-1. LLM-facing product facts are stale

File: `public/llms.txt`

Current public `llms.txt` says:

- Free: 3 scans/month
- Pro: priority support
- Agency: team access

But current app and docs say:

- Anonymous Free: 5 scans/hour
- Signed-in Free: 50 scans/month
- Pro/Agency are designed as self-service, with human-support-heavy features removed

Why this matters:

- Recent SEO reports show ChatGPT referrals are meaningful for the current traffic size.
- `llms.txt` is explicitly consumed by LLM/crawler-style agents. Mismatched pricing/features can send users with wrong expectations.

Recommendation:

- Update `public/llms.txt` to match the current pricing and feature model.
- Add a short "Use cases" section for agencies, small businesses, ecommerce, nonprofits, and government contractors.
- Remove unsupported "priority support" and "team access" claims unless those features are actually restored.

Estimated effort: 0.5 day.

### P0-2. A11yScope has a visible accessibility issue on FAQ

Files:

- `src/app/faq/page.tsx`
- `src/components/LegalFooter.tsx`

axe result on `https://www.a11yscope.com/faq`:

- `color-contrast`, serious
- `.bg-blue-50 > p`: contrast 4.37:1, expected 4.5:1
- footer copyright text: contrast 1.47:1, expected 4.5:1

Why this matters:

- For an accessibility checker, the product itself needs to be near-perfect on public pages.
- This is a trust issue, not just a WCAG issue.

Recommendation:

- Replace the FAQ CTA body text color with a darker slate/blue token.
- Replace `text-gray-300` in `LegalFooter` with at least `text-gray-500` or reuse `text-muted` only where contrast passes on white.
- Add a small self-audit check to the release checklist: scan `/`, `/faq`, `/blog`, and `/login`.

Estimated effort: 0.5 day.

### P0-3. Lint is failing and should not be accepted as normal

Command: `npm run lint`

Current result:

- 53 errors
- 4 warnings

Main categories:

- widespread `no-explicit-any`
- Next.js internal links using `<a>` instead of `Link`
- `CookieBanner` synchronous setState in effect
- unused variables

Why this matters:

- Build currently passes, but lint is the fastest guard against avoidable regressions.
- For a product selling code-quality/accessibility confidence, failing lint undermines engineering discipline.

Recommendation:

- Split into two passes:
  - Pass A: fix easy mechanical issues (`Link`, unused vars, `prefer-const`, CookieBanner)
  - Pass B: introduce shared types for scan results, API errors, Supabase rows, and Stripe period fields to remove most `any`
- Add CI after lint is clean.

Estimated effort: 1.5-2.5 days.

### P0-4. Full-site crawl exists but lacks productized UI

Files:

- API: `src/app/api/scan/crawl/route.ts`
- Current dashboard scan UI: `src/app/dashboard/scan/page.tsx`
- Sites UI: `src/app/dashboard/sites/page.tsx`

Current state:

- Pro/Agency crawl API exists and logs page results.
- Sites page only has "Scan", which routes to single-page scan.
- No dashboard button that says "Crawl site", no progress state, no multi-page result summary.

Why this matters:

- Full-site crawl is the main paid-plan value prop.
- If users cannot try it immediately after upgrading, activation is weak.

Recommendation:

- Add "Run Full-Site Crawl" action to each registered site for Pro/Agency users.
- Render crawl summary: pages scanned, aggregate score, failed pages, top recurring issues.
- Store and display crawl batch ID or at least grouped timestamp to distinguish one crawl from isolated scans.
- Use this result view as the paid-plan aha moment.

Estimated effort: 2-4 days for UI + grouped display; 5-7 days if adding crawl batch persistence.

### P0-5. Onboarding drip can mark failed sends as sent

Files:

- `src/app/api/cron/onboarding-drip/route.ts`
- `src/lib/email.ts`

Issue:

- Route comments say failed sends should remain unmarked for retry.
- `safeSend()` catches Resend errors and returns normally.
- The route then updates `onboarding_dayN_sent_at` and increments `sent`.

Impact:

- If Resend returns an error, the user may never receive onboarding email, but the DB records it as sent.
- Growth telemetry becomes inaccurate.

Recommendation:

- Make `safeSend()` return `{ ok: boolean }` or throw on send failure.
- Only update `onboarding_dayN_sent_at` after confirmed send acceptance.
- Log onboarding sends into `email_events` or a dedicated `outbound_emails` table.

Estimated effort: 0.5-1 day.

## 4. Acquisition and Conversion Findings

### G1. Current positioning is too legal-fear heavy

Current H1:

> Find Accessibility Issues Before Lawyers Do

This is sharp and probably converts some US SMBs, but it is narrow. It may repel developers, agencies, public-sector teams, and international users who are looking for operational monitoring rather than legal fear.

Recommended test:

- Variant A: current legal-risk headline
- Variant B: "Scan any website for WCAG issues in seconds"
- Variant C: "Turn accessibility scans into fix-ready reports"

Keep legal risk as supporting copy, not necessarily the only hero frame.

### G2. Update from WCAG 2.1-only messaging to WCAG 2.1 + 2.2-aware messaging

Current public copy emphasizes WCAG 2.1 AA. That is still relevant because the ADA Title II final rule uses WCAG 2.1 Level AA for state/local governments. But WCAG 2.2 has been a W3C Recommendation since 2023, and competitors are actively using "WCAG 2.2" in positioning.

Recommendation:

- Keep "WCAG 2.1 AA" where legally precise.
- Add "WCAG 2.2-aware guidance" where product scope supports it.
- Add a roadmap note if scanner rules are still axe/WCAG 2.1 oriented.

### G3. Free scan should capture an email at the moment of value

Current email capture:

- "Email This Report" exists after scan result.
- Recent telemetry shows `email_events = 0`.

Recommendation:

- Move "Email this report" closer to the score summary, not third in a crowded footer CTA row.
- Add a non-blocking inline field: "Send this report to yourself" immediately after the first report card.
- Include a clear privacy line: "One-time email. No mailing list."
- After send, show two next steps:
  - "Create a free account to save history"
  - "Start 7-day Pro trial to crawl up to 20 pages"

Estimated effort: 1-2 days.

### G4. Signed-in Free benefit is under-communicated

Current app logic gives signed-in Free users 50 scans/month, but homepage copy mostly says anonymous users get 5 scans/hour and `llms.txt` says 3 scans/month.

Recommendation:

- Add a small conversion ladder:
  - No account: 5 scans/hour, one-page reports
  - Free account: 50 scans/month + scan history
  - Pro: full-site crawl + weekly monitoring + PDFs
- This should appear in pricing, rate-limit modal, scan result CTA, and `llms.txt`.

### G5. Industry-specific pages are promising but need stronger commercial CTAs

Existing and recent content includes:

- banking/financial services
- nonprofit
- ecommerce
- Shopify / WordPress / Webflow
- agencies

Recommendation:

- Create dedicated landing pages, not only blog posts:
  - `/for/web-agencies`
  - `/for/shopify-stores`
  - `/for/nonprofits`
  - `/for/public-sector`
  - `/for/financial-services`
- Each page should include:
  - industry-specific risk
  - sample scan flow
  - sample PDF report screenshot
  - "scan your site" CTA
  - plan recommendation

Estimated effort: 1 day per vertical page after template creation.

### G6. Competitor gap: page volume and report shareability

Competitors emphasize:

- WCAG 2.2
- 10 free pages or single-page public report links
- full-site scan in minutes
- issue libraries
- accessibility statement generators
- legal mapping across jurisdictions

A11yScope can avoid enterprise bloat by owning a tighter wedge:

> Fast self-service scanner for small businesses and agencies that need fix-ready reports without enterprise sales.

Recommended differentiators:

- One-click shareable report URL
- Before/after comparison after re-scan
- Agency-branded PDF
- "Top 5 fixes by impact" summary
- WordPress/Shopify/Webflow specific remediation hints

## 5. Technical SEO Findings

### T1. Static metadata and sitemap are healthy

Observed:

- `/sitemap.xml` returns 35 URLs.
- `/robots.txt` disallows dashboard/admin/checkout/auth and allows major LLM crawlers.
- Homepage has canonical, FAQPage JSON-LD, SoftwareApplication JSON-LD, Organization JSON-LD, WebSite JSON-LD.

Recommendation:

- Add `SearchAction` to WebSite JSON-LD only if site search exists. Do not fake it.
- Add `sameAs` only for real social/product profiles.

### T2. Blog internal links are present, but some pillar pages are thin

Local scan:

- 29 blog posts
- No broken internal `/blog/` links detected in Markdown
- Several posts are ~1,300-1,700 words and should be expanded if they target competitive commercial terms

Priority expansions:

- `wcag-compliance-checklist-ecommerce-websites.md`
- `website-accessibility-monitoring-weekly-scans.md`
- `european-accessibility-act-2025-guide.md`
- `banking-financial-services-website-accessibility.md`
- `nonprofit-website-accessibility-guide.md`

### T3. Add programmatic comparison pages carefully

High-intent opportunities:

- "A11yScope vs WAVE"
- "A11yScope vs Lighthouse accessibility"
- "A11yScope vs accessiBe scanner"
- "A11yScope vs UserWay scanner"
- "best accessibility checker for agencies"

Rules:

- Be factual and non-defamatory.
- Do not claim legal compliance guarantee.
- Emphasize workflow differences: monitoring, PDF, history, agency branding.

## 6. Product Roadmap

### Phase 0: Trust and Consistency (Week 1)

Goal: remove trust leaks before pushing traffic.

Tasks:

1. Fix FAQ contrast issue and homepage scan input accessible name.
2. Update `public/llms.txt`.
3. Update README/HANDOVER/SYSTEM-SPEC to include onboarding drip, email report, Free 50/month, email_events.
4. Fix onboarding `safeSend()` semantics.
5. Fix `supabase-schema.sql` or add migration documentation for:
   - `sites`
   - `scan_logs.violations/passes/incomplete/site_id`
   - `users.auth_id/brand_name/onboarding_day1_sent_at/onboarding_day3_sent_at`
   - `email_events`
6. Reduce lint errors at least for public pages and touched API routes.

Success criteria:

- `npm run build` passes.
- `npm run lint` either passes or has a documented burn-down list with <10 known items.
- Live axe scan on `/`, `/faq`, `/blog` returns 0 violations.
- `llms.txt` matches actual feature/pricing facts.

### Phase 1: Activation Funnel (Weeks 2-3)

Goal: convert anonymous scanners into Free users and Pro trials.

Tasks:

1. Improve scan result layout:
   - score summary
   - email report field
   - create free account CTA
   - Pro trial CTA
2. Add event telemetry:
   - scan_started
   - scan_completed
   - email_report_opened
   - email_report_sent
   - signup_clicked
   - checkout_clicked
   - rate_limit_hit
3. Add dashboard full-site crawl UI for paid users.
4. Add crawl result summary.
5. Add post-scan "scan another page on same site" suggestions for anonymous users.

Success criteria:

- Email report usage >5% of completed scans.
- Free signup from scan result >2%.
- At least one paid user runs full-site crawl from dashboard.

### Phase 2: SEO and Landing Pages (Weeks 4-6)

Goal: grow qualified search and LLM referral traffic.

Tasks:

1. Create `/for/*` vertical landing page template.
2. Publish first four pages:
   - agencies
   - Shopify/ecommerce
   - nonprofits
   - public sector
3. Refresh homepage copy to include WCAG 2.2-aware language and less brittle legal stats.
4. Add sample report page or public demo report.
5. Create comparison pages for WAVE/Lighthouse/accessibility checker alternatives.

Success criteria:

- GSC impressions double from ~300 to ~600+.
- Average position for `a11y audit`, `accessibility checker`, and vertical terms improves.
- Blog/landing traffic produces at least 1 new signup/week.

### Phase 3: Retention and Revenue (Weeks 7-10)

Goal: make Pro/Agency subscription value durable.

Tasks:

1. Crawl batch persistence and trend charts.
2. Re-scan comparison: fixed/new/regressed issues.
3. Weekly email includes changes since last week, not just current score.
4. Agency-branded report template improvements.
5. Optional: accessibility statement generator.

Success criteria:

- Weekly monitoring email open/click tracking exists.
- Pro user sees trend history and recurring value.
- Agency plan has one clearly differentiated workflow beyond "more sites".

## 7. Recommended Priority Backlog

| Priority | Item | Owner Type | Effort |
|---|---|---:|---:|
| P0 | Update `llms.txt` pricing/features | growth/dev | 0.5d |
| P0 | Fix FAQ contrast + footer contrast | frontend | 0.5d |
| P0 | Fix onboarding send success semantics | backend | 0.5-1d |
| P0 | Document/apply DB schema drift | backend | 1d |
| P0 | Lint cleanup pass A | frontend/backend | 1d |
| P1 | Email report CTA repositioning | frontend/growth | 1d |
| P1 | Event funnel telemetry | full-stack | 1-2d |
| P1 | Dashboard crawl UI | full-stack | 2-4d |
| P1 | Crawl summary persistence | backend | 2-3d |
| P2 | Vertical landing page template | frontend/content | 1d |
| P2 | 4 vertical pages | content/frontend | 4d |
| P2 | Sample report / demo report | full-stack | 1-2d |
| P3 | Comparison pages | content | 2-4d |
| P3 | Re-scan diff and trend reporting | full-stack | 4-7d |

## 8. Budget Estimate

Lean execution:

- 2-3 weeks
- 6-10 engineering/content days
- Focus: P0 + highest-leverage P1

Recommended execution:

- 6-8 weeks
- 20-35 engineering/content days
- Focus: trust fixes, activation funnel, crawl UI, vertical SEO

Full growth/product cycle:

- 10-12 weeks
- 45-65 engineering/content days
- Focus: retention analytics, crawl batches, comparisons, agency workflows

## 9. External Context Used

- W3C published WCAG 2.2 as a Recommendation on 2023-10-05 and it adds 9 success criteria beyond WCAG 2.1: https://www.w3.org/news/2023/web-content-accessibility-guidelines-wcag-2-2-is-a-w3c-recommendation/
- DOJ ADA Title II web/mobile rule uses WCAG 2.1 Level AA for state/local governments, with compliance dates in 2027/2028 depending on size: https://www.ada.gov/resources/2024-03-08-web-rule/
- European Commission states the EAA came into effect in June 2025 and covers key products/services including e-commerce, banking/payment, transport, and electronic communications: https://commission.europa.eu/news-and-media/news/eu-becomes-more-accessible-all-2025-07-31_en
- WebAIM Million 2026 found 95.9% of home pages had detected WCAG failures, with low contrast, missing alt text, missing labels, empty links/buttons, and missing language remaining dominant: https://webaim.org/projects/million/?locale=en_GB
- Competitor positioning checked against AccessiScan, GetWCAG, EqualWeb Monitor, and other public scanner pages.

## 10. One Sentence Strategy

Make A11yScope the lightweight, self-service accessibility scanner that turns a free one-page check into a saved report, a full-site crawl, and recurring monitoring before the user ever needs an enterprise sales call.

## 11. Implementation Status - 2026-04-25

The first implementation pass is complete. Details are recorded in `IMPLEMENTATION-LOG-2026-04-25.md`.

Completed from this plan:

- Updated `llms.txt` pricing and feature claims.
- Fixed FAQ and legal footer contrast issues.
- Added missing scan form labels.
- Cleaned the lint gate from failing to passing.
- Fixed onboarding drip send-success semantics.
- Updated the Supabase schema document to match current app usage.
- Repositioned email report capture near scan results.
- Added dashboard full-site crawl mode using the existing crawl API.
- Added crawl actions from registered sites.
- Updated homepage positioning and metadata for WCAG 2.1 AA plus WCAG 2.2 readiness.
- Added three vertical SEO landing pages and included them in the sitemap.

Verified:

- `npm run lint`: passed.
- `npm run build`: passed.
- Local HTTP checks for `/`, `/faq`, `/llms.txt`, `/sitemap.xml`, and all new use-case pages: 200.
- Puppeteer + axe-core smoke test on public pages: 0 violations, 1 incomplete on each checked page.

Remaining:

- Production Supabase migration application.
- Funnel telemetry implementation.
- Crawl aggregate persistence.
- Authenticated dashboard E2E tests.
- Next.js `middleware` to `proxy` convention migration.
