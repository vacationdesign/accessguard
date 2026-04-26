# A11yScope Implementation Log - 2026-04-25

## Summary

Audit findings from `AUDIT-IMPROVEMENT-PLAN.md` were implemented across accessibility, product quality, activation, SEO/LLM discoverability, and developer reliability. This log records what changed and how it was verified.

## Implemented

### Accessibility and Trust Fixes

- Added an explicit label to the homepage scan input in `src/components/ScanForm.tsx`.
- Added labels to dashboard scan and site registration inputs.
- Fixed FAQ CTA contrast by changing the low-contrast CTA body text to a darker color.
- Fixed legal footer copyright contrast in `src/components/LegalFooter.tsx`.
- Added `role="region"` and `aria-label` to the cookie notice so it is contained in a landmark region.

### Quality Gate Cleanup

- Removed all ESLint failures from the previous lint run.
- Added `src/lib/errors.ts` and replaced `catch (err: any)` patterns with `unknown` plus safe message extraction.
- Replaced unsafe `any` usage in scanner, dashboard, Stripe webhook, API routes, and client buttons.
- Fixed `src/app/api/account/export/route.ts` to export `last_scan_at`, matching the actual site model.
- Updated Puppeteer/axe typing in `src/lib/scanner.ts`.

### Email and Activation Flow

- Changed onboarding drip send functions to return a boolean accepted/rejected result.
- Updated `src/app/api/cron/onboarding-drip/route.ts` so failed/rejected onboarding emails are not marked as sent.
- Updated scan report email handling so send failure returns an API error instead of silently reporting success.
- Moved "Email Report" capture near the scan result score in `src/components/ScanReport.tsx`.
- Added a clearer free-account CTA after a scan: 50 monthly scans plus saved history.

### Full-Site Crawl Productization

- Added a Page Scan / Full-Site Crawl mode switch to `src/app/dashboard/scan/page.tsx`.
- Connected the dashboard UI to the existing `/api/scan/crawl` endpoint.
- Added crawl result rendering: aggregate score, pages scanned, total issues, common issues, and per-page results.
- Added a Crawl action in `src/app/dashboard/sites/page.tsx`.

### SEO, LLM, and Growth Improvements

- Updated homepage positioning from fear-only legal copy toward accessibility, SEO, conversion, ADA, and EAA value.
- Updated metadata to mention WCAG 2.1 AA findings and WCAG 2.2 readiness guidance.
- Rewrote `public/llms.txt` to match actual pricing and feature limits:
  - anonymous free: 5 scans/hour
  - signed-in free: 50 scans/month plus history
  - Pro: 3 monitored sites, 20-page crawls
  - Agency: 10 monitored sites, 50-page crawls, white-label PDFs
- Added three search-intent landing pages:
  - `/use-cases/ecommerce-accessibility-checker`
  - `/use-cases/web-agency-accessibility-audits`
  - `/use-cases/saas-accessibility-monitoring`
- Added the new use-case URLs to `src/app/sitemap.ts`.
- Added homepage footer links to high-intent use-case pages.

### Database Documentation

- Updated `src/lib/supabase-schema.sql` to reflect the current application model:
  - `users.auth_id`
  - `users.brand_name`
  - onboarding timestamp columns
  - `sites`
  - expanded `scan_logs`
  - `email_events`
  - supporting indexes
  - admin scan-count RPC

## Verification

Commands run:

```bash
npm run lint
npm run build
```

Results:

- `npm run lint`: passed.
- `npm run build`: passed.
- Build generated 43 static pages including the 3 new use-case pages.
- Existing Next.js warnings remain:
  - `middleware` convention is deprecated in favor of `proxy`.
  - Edge runtime disables static generation on affected pages.

Local production server:

- Started with `npm start -- -p 3010`.
- Preview URL: `http://localhost:3010`.

HTTP checks:

- `/`: 200
- `/faq`: 200
- `/use-cases/ecommerce-accessibility-checker`: 200
- `/use-cases/web-agency-accessibility-audits`: 200
- `/use-cases/saas-accessibility-monitoring`: 200
- `/sitemap.xml`: 200 and includes all use-case URLs
- `/llms.txt`: 200 and includes updated pricing/limits

Puppeteer + axe-core smoke test:

- `/`: 0 violations, 1 incomplete
- `/faq`: 0 violations, 1 incomplete
- `/use-cases/ecommerce-accessibility-checker`: 0 violations, 1 incomplete
- `/use-cases/web-agency-accessibility-audits`: 0 violations, 1 incomplete
- `/use-cases/saas-accessibility-monitoring`: 0 violations, 1 incomplete

## Remaining Work

These items were intentionally left as follow-up because they require database production migration, telemetry design, or account/auth test data:

- Apply the SQL schema changes or equivalent migrations in Supabase.
- Add funnel event telemetry for scan started, scan completed, email report requested/sent, free signup clicked, checkout clicked, and crawl started.
- Persist crawl-level aggregate summaries separately from per-page scan logs.
- Add authenticated end-to-end tests for dashboard crawl mode once test credentials are available.
- Rename `src/middleware.ts` to the newer Next.js `proxy` convention in a separate compatibility pass.

## Follow-Up Implementation Pass — 2026-04-26

The first four items above are now done. Detail:

### Production Supabase migration applied

Applied via Supabase MCP `apply_migration` (`crawl_batches_analytics_events_and_rpc`). Production now has:

- `get_scan_counts_by_users(user_ids uuid[])` RPC (was missing — admin UI had been falling back to N+1 counts)
- `crawl_batches` table + indexes
- `scan_logs.crawl_batch_id` FK column + index
- `analytics_events` table + indexes
- RLS enabled on the two new tables

### Crawl batch persistence

- `src/lib/db.ts`: `createCrawlBatch()` and `getRecentCrawlBatches()` helpers added; `logScan()` gained an optional `crawlBatchId` parameter.
- `src/app/api/scan/crawl/route.ts`: writes a `crawl_batches` row before logging per-page scans, then passes the batch id through `logScan()` so each row is grouped. Returns `crawlBatchId` in the response so the dashboard can scope follow-up reads.

### Funnel telemetry

- `src/lib/analytics.ts`: typed event-kind union and a fail-soft `logEvent()` that never throws; `ipFromRequest()` helper.
- `src/lib/track.ts`: client-side beacon using `navigator.sendBeacon` when available, plain fetch with `keepalive: true` as fallback.
- `src/app/api/events/route.ts`: POST beacon endpoint. Strict allowlist of client-fireable kinds (`signup_clicked`, `checkout_clicked`, `email_report_opened`); other kinds are server-only.
- Server-side measurement points wired in:
  - `api/scan/route.ts`: `scan_started`, `scan_completed`, `scan_rate_limited` (with reason)
  - `api/scan/crawl/route.ts`: `crawl_started`, `crawl_completed`
  - `api/scan/email-report/route.ts`: `email_report_sent`
  - `api/checkout/route.ts`: `checkout_clicked`

All `logEvent` calls are `void`-prefixed so telemetry write latency or failure can never block the user's response.

### middleware → proxy convention migration

Per Next.js 16 deprecation: renamed `src/middleware.ts` → `src/proxy.ts` and renamed the exported function from `middleware` to `proxy`. APIs are identical (`NextRequest`/`NextResponse`/`config.matcher`); no behavioural change, just removes the deprecation warning.

### Still deferred

- **Authenticated dashboard E2E tests** — out of scope for this commit. Adding them requires (a) a Playwright or similar harness, (b) a dedicated test user provisioned in Supabase, and (c) test-only Stripe credentials so checkout flows can be exercised without polluting prod data. Should be a separate PR with its own CI integration.
- **Crawl batch aggregate dashboard view** — `crawl_batches` rows are now created but the dashboard still shows raw per-page lists. A "Recent crawls" panel reading from `getRecentCrawlBatches()` is the next obvious step but is UI work, not infra.
- **Funnel event dashboard** — events now flow into `analytics_events`. A simple admin view (`SELECT kind, COUNT(*) FROM analytics_events GROUP BY kind, date_trunc('day', created_at)`) is the obvious follow-up.
