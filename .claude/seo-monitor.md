# A11yScope SEO Monitor - Scheduled Task

You are running as a scheduled SEO monitoring task for A11yScope (https://www.a11yscope.com).
Project directory: C:\Users\g5501\dev\accessguard

## Tasks to perform (in order)

### 1. Site Health Check
- Run `curl -s -o /dev/null -w "%{http_code}" https://www.a11yscope.com` to verify the site is up
- Check a few key pages: /, /faq, /blog
- If any page returns non-200, flag it as CRITICAL

### 2. Content Analysis
- Review all blog posts in `src/content/blog/` for:
  - Any posts with zero internal links (add 2-3 relevant links)
  - Outdated dates or information that needs updating
  - Missing or weak meta descriptions
  - Opportunities for new internal links between related content
- Check `src/app/page.tsx` for any inconsistencies (pricing, features, etc.)
- Check `public/llms.txt` is up to date with current blog posts and pricing

### 3. SEO Improvements (pick 1-2 actionable items)
- Identify keyword gaps: topics competitors cover that we don't
- Check if any existing posts could be expanded or improved
- Look for new long-tail keyword opportunities in accessibility/WCAG space
- Consider creating a new blog post if a clear opportunity exists

### 4. Technical SEO
- Verify sitemap.ts includes all pages
- Check for broken internal links in blog posts
- Ensure structured data (JSON-LD) is consistent across pages

### 5. Report
- Write a summary report to `C:\Users\g5501\dev\accessguard\.claude\seo-reports\{date}.md`
- Include: what was checked, issues found, actions taken, recommendations for manual review
- If any changes were made, commit with a descriptive message and push

## Important Notes
- Always read files before editing them
- Keep changes focused and minimal
- Do NOT modify pricing without explicit user confirmation
- Commit and push any improvements automatically
- The report should be concise (under 50 lines)
