# A11yScope SEO Monitor - Scheduled Task

You are running as a scheduled SEO monitoring task for A11yScope (https://www.a11yscope.com).
Project directory: C:\Users\g5501\dev\accessguard

## Tasks to perform (in order)

### 1. Site Health Check
- Run `curl -s -o /dev/null -w "%{http_code}" https://www.a11yscope.com` to verify the site is up
- Check a few key pages: /, /faq, /blog
- If any page returns non-200, flag it as CRITICAL

### 2. Access & Traffic Analysis (via Chrome MCP browser automation)
Use Chrome MCP tools to access these dashboards and extract data:

#### Google Search Console
- Navigate to: https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Fwww.a11yscope.com%2F
- Record: total clicks, impressions, CTR, average position
- Click "クエリ" tab: list all queries with clicks and impressions
- Click "ページ" tab: list all pages with clicks and impressions
- Compare with previous report in `.claude/seo-reports/` to identify trends

#### Admin Dashboard
- Navigate to: https://www.a11yscope.com/admin
- Record: Total Users, MRR, Total Scans, Avg Score, Scans Today/This Week/This Month, Revenue
- Navigate to: https://www.a11yscope.com/admin/users
- Record: total user count, new signups since last report, plan distribution

#### Vercel Analytics
- Navigate to: https://vercel.com/vacationdesigns-projects/accessguard/analytics
- Record: Visitors, Page Views, Bounce Rate, top pages
- Note any significant traffic patterns or referral sources

### 3. Content Analysis
- Review all blog posts in `src/content/blog/` for:
  - Any posts with zero internal links (add 2-3 relevant links)
  - Outdated dates or information that needs updating
  - Missing or weak meta descriptions
  - Opportunities for new internal links between related content
- Check `src/app/page.tsx` for any inconsistencies (pricing, features, etc.)
- Check `public/llms.txt` is up to date with current blog posts and pricing

### 4. SEO Improvements (pick 1-2 actionable items)
- Identify keyword gaps: topics competitors cover that we don't
- Check if any existing posts could be expanded or improved
- Look for new long-tail keyword opportunities in accessibility/WCAG space
- Consider creating a new blog post if a clear opportunity exists
- If top-ranking pages are close to page 1 (position <20), prioritize improving those

### 5. Technical SEO
- Verify sitemap.ts includes all pages
- Check for broken internal links in blog posts
- Ensure structured data (JSON-LD) is consistent across pages

### 6. Report
- Write a summary report to `C:\Users\g5501\dev\accessguard\.claude\seo-reports\{YYYY-MM-DD}.md`
- Include ALL of the following sections:
  1. Site Health Check results
  2. GSC data (clicks, impressions, CTR, position) with comparison to previous report
  3. Query and page breakdown tables
  4. Admin dashboard metrics (users, scans, revenue)
  5. Vercel Analytics summary (visitors, page views)
  6. Content analysis findings
  7. Actions taken
  8. Recommendations for next run
- If any changes were made, commit with a descriptive message and push

## Important Notes
- Always read files before editing them
- Keep changes focused and minimal
- Do NOT modify pricing without explicit user confirmation
- Commit and push any improvements automatically
- Use Japanese for user-facing communication, English for code and reports
