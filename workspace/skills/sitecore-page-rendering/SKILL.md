---
name: sitecore-page-rendering
description: Visual QA and page rendering inspection for SitecoreAI. Take screenshots, inspect HTML output, analyze page templates, generate preview URLs, and reverse-lookup pages from live URLs. Use when the user wants to visually verify pages, audit HTML structure, check accessibility or SEO, review template fields, or find a page from its live URL. Read-only — does not create or modify content.
allowed-tools:
  - mcp__marketer-mcp__get_page_screenshot
  - mcp__marketer-mcp__get_page_html
  - mcp__marketer-mcp__get_page_template_by_id
  - mcp__marketer-mcp__get_page_preview_url
  - mcp__marketer-mcp__get_page_path_by_live_url
---

# Sitecore Page Rendering

**Visual QA, HTML inspection, template analysis, and preview generation for SitecoreAI via marketer-mcp.**

---

## Capabilities

1. **Visual QA** — Take a screenshot of any page and analyze it for layout issues, broken elements, or visual regressions
2. **HTML inspection** — Retrieve the rendered HTML of a page and check structure, accessibility attributes, SEO meta tags, and semantic markup
3. **Template analysis** — Inspect a page's template to list all available fields, their types, and configuration
4. **Preview URL generation** — Generate a shareable preview URL for stakeholder review before publishing
5. **Reverse lookup** — Find the Sitecore page path and ID from a live production URL

---

## Workflow: Visual QA

Take a screenshot of a page and analyze it for visual issues.

1. Identify the page:
   - If user provides a page ID -> use directly
   - If user provides a live URL -> use `mcp__marketer-mcp__get_page_path_by_live_url` to resolve the page first
   - For the Home page -> ID is `b132d115-7893-49aa-a06f-f1719a8704e3`
2. Call `mcp__marketer-mcp__get_page_screenshot` with the page ID and version number
   - **Required params:** `pageId` (string), `version` (number, use `1` for latest published)
   - **Optional params:** `language` (default "en"), `width` (default 1200), `height` (default 800)
   - Returns a base64-encoded image of the rendered page
3. Analyze the screenshot for:
   - Layout issues (overlapping elements, broken grids, misaligned sections)
   - Missing images or broken image placeholders
   - Text overflow or truncation
   - Spacing and padding inconsistencies
   - Mobile responsiveness issues (if viewport is narrow)
   - Branding consistency (correct colors, fonts, logo placement)
4. Generate `mcp__marketer-mcp__get_page_preview_url` so the user can verify in their own browser

**Report format:**

```
Visual QA Report: [Page Name]

Screenshot: [displayed inline]

Findings:
- [PASS/ISSUE] Hero section: [description]
- [PASS/ISSUE] Navigation: [description]
- [PASS/ISSUE] Content area: [description]
- [PASS/ISSUE] Footer: [description]

Preview URL: [URL]
```

### Visual Regression Check

When comparing against a known-good state:

1. Take a screenshot of the current page
2. Ask the user to provide the reference (previous screenshot, design comp, or description of expected state)
3. Compare and report differences:

```
Visual Regression Report: [Page Name]

Changes detected:
- [Area]: [What changed — e.g., "Hero image replaced", "Button color changed from blue to green"]
- [Area]: [What changed]

No changes detected in:
- [Area], [Area], [Area]

Preview URL: [URL]
```

---

## Workflow: HTML Inspection

Retrieve and analyze the rendered HTML of a page.

1. Identify the page (same resolution steps as Visual QA)
2. Call `mcp__marketer-mcp__get_page_html` with the page ID and language
   - **Required params:** `pageId` (string), `language` (string, e.g., `"en"`)
   - **Optional params:** `version` (number)
3. Analyze the HTML for the requested audit type (see sub-workflows below)

### Accessibility Audit

Check the HTML for accessibility compliance:

1. Get the page HTML via `mcp__marketer-mcp__get_page_html`
2. Inspect for:
   - **Images:** All `<img>` tags have meaningful `alt` attributes (not empty, not generic like "image")
   - **Headings:** Proper heading hierarchy (h1 -> h2 -> h3, no skipped levels, single h1)
   - **Links:** All `<a>` tags have descriptive text (not "click here" or "read more" without context)
   - **Forms:** All form inputs have associated `<label>` elements or `aria-label`
   - **ARIA:** Correct use of `role`, `aria-*` attributes on interactive elements
   - **Landmarks:** Proper use of `<nav>`, `<main>`, `<header>`, `<footer>`, `<aside>`
   - **Color contrast:** Flag any inline styles with potentially low-contrast text (note: full contrast check requires visual analysis)
   - **Focus management:** Presence of `tabindex`, skip-nav links, focus-visible styles

**Report format:**

```
Accessibility Audit: [Page Name]

Critical Issues:
- [element]: [issue description]

Warnings:
- [element]: [issue description]

Passed Checks:
- Images: [N] of [M] have proper alt text
- Headings: [hierarchy description]
- Landmarks: [list of landmarks found]
- Links: [N] descriptive, [M] need improvement

Preview URL: [URL]
```

### SEO Audit

Check the HTML for SEO best practices:

1. Get the page HTML via `mcp__marketer-mcp__get_page_html`
2. Inspect for:
   - **Title tag:** Present, unique, under 60 characters
   - **Meta description:** Present, under 160 characters, descriptive
   - **Canonical URL:** `<link rel="canonical">` present and correct
   - **Open Graph tags:** `og:title`, `og:description`, `og:image`, `og:url` present
   - **Heading structure:** Single `<h1>`, logical hierarchy
   - **Structured data:** JSON-LD or microdata present
   - **Image optimization:** `alt` tags, reasonable `src` paths (not base64 inline for large images)
   - **Internal links:** Proper anchor text, no broken href values
   - **Robots directives:** `<meta name="robots">` if present, `noindex`/`nofollow` flags

**Report format:**

```
SEO Audit: [Page Name]

Meta Tags:
- Title: "[title text]" ([N] chars) [OK/TOO LONG/MISSING]
- Description: "[description text]" ([N] chars) [OK/TOO LONG/MISSING]
- Canonical: [URL or MISSING]
- Robots: [value or NOT SET]

Open Graph:
- og:title: [present/missing]
- og:description: [present/missing]
- og:image: [present/missing]
- og:url: [present/missing]

Structure:
- H1 count: [N] [OK if 1, ISSUE if 0 or 2+]
- Heading hierarchy: [description]
- Structured data: [present type or NONE]

Recommendations:
1. [actionable recommendation]
2. [actionable recommendation]

Preview URL: [URL]
```

### Structure Inspection

General HTML structure analysis:

1. Get the page HTML via `mcp__marketer-mcp__get_page_html`
2. Report:
   - Document structure (doctype, html lang, head/body)
   - Key sections and their nesting depth
   - Script and stylesheet count
   - Component rendering placeholders
   - Any inline styles or scripts (potential issues)

---

## Workflow: Template Analysis

Inspect a page template to understand its available fields and configuration.

1. Identify the template:
   - If user provides a template ID -> use directly
   - If user provides a page ID -> call `mcp__marketer-mcp__get_page_template_by_id` with the page ID to get the template
   - If user provides a page name -> resolve the page first (via search or known IDs), then get its template
2. Call `mcp__marketer-mcp__get_page_template_by_id` with the appropriate ID
3. Present the template fields in a structured format

**Report format:**

```
Template Analysis: [Template Name]
Template ID: [ID]

Fields:
| Field Name | Type | Required | Section |
|:-----------|:-----|:---------|:--------|
| [name] | [Single-Line Text / Rich Text / Image / etc.] | [Yes/No] | [section] |
| [name] | [type] | [req] | [section] |

Standard Fields: [list any inherited/standard Sitecore fields]

Notes:
- [Any observations about the template structure]
- [Relationships to other templates if apparent]
```

### Template Comparison

When comparing two templates:

1. Get both templates via `mcp__marketer-mcp__get_page_template_by_id`
2. Show side-by-side differences:

```
Template Comparison: [Template A] vs [Template B]

Fields only in [Template A]:
- [field name] ([type])

Fields only in [Template B]:
- [field name] ([type])

Shared fields:
- [field name] ([type]) - same in both
- [field name] - [difference description]
```

---

## Workflow: Preview URL Generation

Generate a shareable preview URL for stakeholder review.

1. Identify the page (same resolution steps as above)
2. Call `mcp__marketer-mcp__get_page_preview_url` with the page ID and language
   - **Required params:** `pageId` (string), `language` (string, e.g., `"en"`)
3. Return the URL with context:

```
Preview URL for [Page Name]:
[URL]

This link shows the current draft version of the page. Share it with stakeholders for review.
Note: This URL requires Sitecore access — external reviewers may need VPN or permissions.
```

### Manual Preview URL Construction

If `mcp__marketer-mcp__get_page_preview_url` is unavailable, construct the preview URL manually:

```
https://xmc-4qlgtraf1kmzc2kz5jkd33-eh.sitecorecloud.io/api/editing/render?sc_itemid={PAGE_ID}&sc_lang=en&sc_site=main&sc_version=1&mode=preview&sc_layoutkind=final&route={PAGE_ROUTE}&tenant_id=10053d8f-5120-4d89-f891-08de2910c96f&secret=5HB80HYQdXqyr2SnWsaCgT
```

Replace `{PAGE_ID}` with the page's item ID (GUID) and `{PAGE_ROUTE}` with the page route (e.g., `/testpage`).

---

## Workflow: Reverse Lookup

Find the Sitecore page from a live production URL.

1. User provides a live URL (e.g., `https://www.example.com/about-us`)
2. Call `mcp__marketer-mcp__get_page_path_by_live_url` with the live URL
3. Return the Sitecore page path and any associated IDs:

```
Reverse Lookup: [Live URL]

Sitecore Path: [path]
Page ID: [ID if returned]
Site: [site name if returned]

You can now use this page ID with other skills (content-reader, content-author, etc.)
```

This is useful when:
- A stakeholder reports an issue on the live site and you need to find the page in Sitecore
- You need to cross-reference live content with draft content
- You want to run a Visual QA or HTML inspection on a page identified by its live URL

---

## Common Requests — Quick Reference

| User says | Action |
|:----------|:-------|
| "Screenshot the home page" | `get_page_screenshot` with pageId + `version: 1` (version is REQUIRED) |
| "What fields does this template have?" | `get_page_template_by_id` with the template ID |
| "Check the SEO on this page" | `get_page_html` with pageId + `language: "en"` (language is REQUIRED) |
| "Is this page accessible?" | `get_page_html` with pageId + `language: "en"` (language is REQUIRED) |
| "Get me a preview link" | `get_page_preview_url` with pageId + `language: "en"` (language is REQUIRED) |
| "Find this page in Sitecore" + live URL | `get_page_path_by_live_url` with the URL |
| "Does this page look right?" | `get_page_screenshot` + visual analysis |
| "What's the HTML structure?" | `get_page_html` + structure inspection |

---

## Guidelines

- **Always offer the preview URL** alongside any analysis — visual verification by a human is the gold standard
- **Screenshots are base64-encoded** — display them inline when the platform supports it, otherwise note that the screenshot was captured and summarize what you see
- **HTML can be large** — focus your analysis on the specific area the user asked about rather than reporting on every element
- **Template analysis is read-only** — if the user wants to add fields to a template, that requires Sitecore admin access (not available via marketer-mcp)
- **Reverse lookup requires an exact live URL** — if the URL is wrong or the page doesn't exist, report it clearly
- **This skill is read-only** — it inspects rendered output and templates but does not modify anything. For content changes, direct the user to the `sitecore-content-author` skill. For publishing, direct to `sitecore-content-publisher`
- **When combining workflows** — e.g., "Screenshot and check SEO" — run both and present a unified report
- Never fabricate HTML content or template fields that were not returned by the API
