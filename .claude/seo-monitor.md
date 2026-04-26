# A11yScope Monitoring Skill

You are running as a recurring monitoring task for A11yScope (https://www.a11yscope.com).
Project directory: `C:\Users\g5501\projects\a11yscope\a11yscope`.

## Operating principle

A11yScope has 6 users and $0 MRR. Daily fluctuations in GSC clicks or
Vercel visitors are not actionable. The actionable signal is in the
**conversion funnel** (`analytics_events`) and **operational health**
(Vercel deploys, email deliverability, crawl batch completion).

This skill follows a **heartbeat + tripwire + exception drilldown**
pattern. Default to the cheapest mode. Escalate only on tripwires.

## Modes

- `quick` — default daily run, ~5 min, DB-only, no Chrome
- `standard` — escalation when a tripwire fires, ~15 min, adds Chrome MCP
- `weekly` — once every 7 days (Mondays), ~30 min, conversion math + audits

If unsure which mode to run, check the date of the most recent file in
`.claude/seo-reports/`. If the last `weekly-*.md` is older than 7 days,
run `weekly`. Otherwise run `quick` and let tripwires escalate.

---

## Mode 1: Quick (default)

### Step 1.1 — Health check (3 curls)

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://www.a11yscope.com
curl -s -o /dev/null -w "%{http_code}\n" https://www.a11yscope.com/faq
curl -s -o /dev/null -w "%{http_code}\n" https://www.a11yscope.com/blog
```

If any returns non-200, flag CRITICAL and escalate to `standard` immediately.

### Step 1.2 — Run the four heartbeat SQL queries

Use the Supabase MCP (`execute_sql`, project_id `hxsiqqyimzeyomesmkeh`).

**a) Funnel last 2 days (kinds × day):**
```sql
SELECT
  date_trunc('day', created_at) AS day,
  COUNT(*) FILTER (WHERE kind='scan_started')        AS scan_started,
  COUNT(*) FILTER (WHERE kind='scan_completed')      AS scan_completed,
  COUNT(*) FILTER (WHERE kind='scan_rate_limited')   AS scan_rate_limited,
  COUNT(*) FILTER (WHERE kind='email_report_sent')   AS email_report_sent,
  COUNT(*) FILTER (WHERE kind='signup_clicked')      AS signup_clicked,
  COUNT(*) FILTER (WHERE kind='checkout_clicked')    AS checkout_clicked,
  COUNT(*) FILTER (WHERE kind='trial_started')       AS trial_started,
  COUNT(*) FILTER (WHERE kind='subscription_canceled') AS subscription_canceled,
  COUNT(*) FILTER (WHERE kind='crawl_started')       AS crawl_started,
  COUNT(*) FILTER (WHERE kind='crawl_completed')     AS crawl_completed
FROM analytics_events
WHERE created_at >= now() - interval '2 day'
GROUP BY 1
ORDER BY 1 DESC;
```

**b) New users in the last 24h:**
```sql
SELECT id, email, plan, created_at
FROM users
WHERE created_at >= now() - interval '24 hour'
ORDER BY created_at DESC;
```

**c) Email events last 24h (column is `kind`, not `event_type`):**
```sql
SELECT kind, COUNT(*) AS n
FROM email_events
WHERE created_at >= now() - interval '24 hour'
GROUP BY kind
ORDER BY n DESC;
```

**d) Crawl-batch reliability (column is `status`, not `completed_at`):**
```sql
SELECT
  COUNT(*) FILTER (WHERE created_at >= now() - interval '24 hour') AS batches_24h,
  COUNT(*) FILTER (WHERE status = 'failed' AND created_at >= now() - interval '7 day') AS failed_7d,
  COUNT(*) FILTER (WHERE status = 'running' AND created_at < now() - interval '2 hour') AS stuck_running
FROM crawl_batches;
```

### Step 1.3 — Evaluate tripwires

Escalate to `standard` mode if **any** condition is true:

| Tripwire | Condition |
|----------|-----------|
| New paid attempt | `trial_started > 0` OR `checkout_clicked > 0` (today) |
| New signup | New row in `users` in last 24h |
| Funnel break | `scan_started > 0 AND scan_completed = 0` |
| High rate-limit ratio | `scan_rate_limited / scan_started > 0.20` (with denom ≥ 5) |
| Crawl problems | `stuck_running > 0` OR `failed_7d ≥ 2` |
| Feature undiscovered | `email_report_sent = 0 AND scan_completed > 30` (sustained 7d signal) |
| Volume spike | `scan_started today ≥ 50` (secondary, not primary) |
| Cancellation | `subscription_canceled > 0` |

**Do not** treat absolute scan volume above 30 as a primary trigger — it is too noisy at this scale.

### Step 1.4 — Quiet-day report

If no tripwire fired:

- Write `.claude/seo-reports/{YYYY-MM-DD}.md`
- 3-8 lines max
- Required fields:
  ```
  mode: quick
  data_sources: supabase_only
  degraded_flags: []
  escalated: false
  scan_started_today: N
  scan_completed_today: N
  signup_clicked_today: N
  trial_started_today: N
  checkout_clicked_today: N
  scan_rate_limited_today: N
  ```
- One sentence on day-over-day delta.
- One sentence on what to watch next run.
- Commit + push.

Stop here. Do not run Chrome. Do not write 200-line narratives on quiet days.

---

## Mode 2: Standard (escalation only)

Triggered when a Tier 1 tripwire fires, when site health curl fails, or when explicitly requested.

### Step 2.1 — Pull all the Tier 1 queries again, plus

**e) Domain repeat-scan candidates (anonymous Pro candidates):**
```sql
WITH dc AS (
  SELECT ip_address,
         regexp_replace(url, '^https?://([^/]+).*', '\1') AS domain,
         COUNT(*) AS n
  FROM scan_logs
  WHERE user_id IS NULL AND created_at >= now() - interval '7 day'
  GROUP BY ip_address, domain
)
SELECT domain, SUM(n) AS scans, COUNT(DISTINCT ip_address) AS unique_ips
FROM dc
WHERE n >= 3
GROUP BY domain
ORDER BY scans DESC LIMIT 10;
```

**f) Most recent scan activity:**
```sql
SELECT url, score, created_at
FROM scan_logs
ORDER BY created_at DESC LIMIT 15;
```

### Step 2.2 — Chrome MCP enrichment (with bounded retry)

Try Chrome **at most twice**: 15s wait, then 45s wait. If both fail:
- Set `degraded_flags: [chrome_unavailable]`
- Continue with Supabase-only data
- Do not block the report

When Chrome works, capture screenshots from:
- GSC: `https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Fwww.a11yscope.com%2F`
  - Click ページ tab to capture top pages
  - Record clicks / impressions / CTR / average position
- Admin: `https://www.a11yscope.com/admin` (record Total Users, Total Scans, Plan Distribution, This Month)
- Vercel: `https://vercel.com/vacationdesigns-projects/accessguard/analytics` (record visitors, page views, bounce, top referrers, top pages, top countries)

**Always use `browser_batch`** to chain navigate → wait → screenshot in one call. Single-action sequences are 3-4× slower.

### Step 2.3 — Standard report structure

Write `.claude/seo-reports/{YYYY-MM-DD}.md`. Required header:

```
mode: standard
data_sources: supabase + chrome  (or supabase_only)
degraded_flags: []
escalated: true
trigger: <which tripwire fired>
```

Then in this exact order (funnel before traffic before content):

1. **Funnel signals** — what changed in `analytics_events`. Lead with conversion movements (signup, trial, checkout). Note any tripwire-level ratio anomalies.
2. **Reliability signals** — `scan_rate_limited`, `failed`/`stuck` crawl batches, email delivery events.
3. **Traffic & SEO** — GSC + Vercel deltas vs last `standard` report (not the last `quick` report).
4. **Notable activity** — domains scanned multiple times, highest-impact scans.
5. **Actions taken** — keep to ≤3 items.
6. **Recommendations for next run** — keep to ≤3 items.

Commit + push.

---

## Mode 3: Weekly (Mondays only)

Run once every 7 days. Default to Monday morning. Skip if last `weekly-*.md` is < 6 days old.

### Step 3.1 — Conversion ratios (7d and 28d)

```sql
WITH counts AS (
  SELECT
    interval_label,
    COUNT(*) FILTER (WHERE kind='scan_started')      AS scan_started,
    COUNT(*) FILTER (WHERE kind='scan_completed')    AS scan_completed,
    COUNT(*) FILTER (WHERE kind='signup_clicked')    AS signup_clicked,
    COUNT(*) FILTER (WHERE kind='trial_started')     AS trial_started,
    COUNT(*) FILTER (WHERE kind='checkout_clicked')  AS checkout_clicked
  FROM analytics_events
  CROSS JOIN LATERAL (VALUES
    ('7d', now() - interval '7 day'),
    ('28d', now() - interval '28 day')
  ) AS i(interval_label, since)
  WHERE created_at >= since
  GROUP BY interval_label
)
SELECT * FROM counts;
```

Compute and report (with explicit denominator ≥ 5 caveat for tiny-N):

- `scan_completed / scan_started` — **scan reliability**
- `signup_clicked / scan_completed` — **value-to-account conversion**
- `trial_started / signup_clicked` — **account-to-trial conversion**
- `checkout_clicked / scan_completed` — **end-to-end commercial intent**

### Step 3.2 — Email deliverability sweep

```sql
SELECT kind, COUNT(*) AS n,
       COUNT(DISTINCT recipient) AS unique_recipients
FROM email_events
WHERE created_at >= now() - interval '7 day'
GROUP BY kind
ORDER BY n DESC;
```

Plus check for any per-recipient cap hits (>3 reports in 24h to one address).

### Step 3.3 — Crawl batch trend

```sql
SELECT date_trunc('day', created_at) AS day,
       COUNT(*) AS batches,
       AVG(aggregate_score) AS avg_score,
       AVG(pages_scanned) AS avg_pages,
       COUNT(*) FILTER (WHERE status='failed') AS failed
FROM crawl_batches
WHERE created_at >= now() - interval '28 day'
GROUP BY 1 ORDER BY 1 DESC;
```

### Step 3.4 — Vercel deploy + runtime tripwire (Chrome optional)

Open `https://vercel.com/vacationdesigns-projects/accessguard/deployments`:
- Latest production deploy is `Ready` and matches the commit SHA in `git log -1 --format=%H`?
- Any deploy in the last 7d marked `Error`?

(If you don't have an MCP for Vercel runtime logs in this run, note the gap and move on. Don't block.)

### Step 3.5 — Internal-link re-audit (now low-frequency)

Already at 4+ incoming links per blog post as of 4/2. Confirm by:
```bash
grep -c '/blog/<post-slug>' src/content/blog/*.md
```
for any post that appears under-referenced. **Only act** if a post drops below 3 incoming links.

### Step 3.6 — Write `weekly-{YYYY-MM-DD}.md`

Sections, in this order:

1. Conversion ratio table with deltas vs prior week
2. Funnel anomalies (any kind that changed >50% week-over-week)
3. Email deliverability summary
4. Crawl health summary
5. Vercel deploy reliability
6. Internal-link audit result (usually one line)
7. **Top 3 hypotheses** for next week's experiments

Commit + push.

---

## Operational guardrails

- **Tier 1 must never block on Chrome.** Quick mode is DB-only by contract.
- **Bounded Chrome retry**: 2 attempts max (15s, 45s), then degrade.
- **Always `browser_batch`** for chained Chrome operations.
- **Quiet days = quiet reports.** 3-8 lines, machine-readable header. No 200-line tables on a no-movement day.
- **Don't modify pricing without explicit user confirmation.**
- **DB column reminders** (verified 2026-04-26):
  - `analytics_events.kind` (not `event_type`)
  - `email_events.kind` (not `event_type`)
  - `crawl_batches.status` (not `completed_at`)
- **Day boundary**: SQL uses `now() - interval '24 hour'`; the report should call out timezone explicitly when summarising "today".
- **Use Japanese for user-facing chat.** Use English for code, commits, and report files.

## What was removed from the older skill

The previous version of this skill demanded these as daily defaults — they have been removed because data showed they produced little signal at this product's scale:

- Daily keyword-gap mining
- Daily blog meta-description audits
- Daily internal-link audits (sweep is complete; check weekly only)
- Dev-server-based verification of changes (use production URL directly)
- Long narrative reports on quiet days

If a question arises that one of those removed steps would have answered, do it explicitly that day rather than reinstating it as a daily default.
