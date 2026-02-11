---
name: sitecore-site-management
description: Multi-site governance for SitecoreAI. List sites, inspect site configuration, generate page trees and sitemaps, and identify which site an item belongs to. Use when the user wants to understand the site landscape, audit site structure, or generate sitemaps. Read-only — does not create or modify sites.
allowed-tools:
  - mcp__marketer-mcp__list_sites
  - mcp__marketer-mcp__get_site_information
  - mcp__marketer-mcp__get_site_id_from_item
  - mcp__marketer-mcp__get_all_pages_by_site
  - mcp__marketer-mcp__search_site
---

# Sitecore Site Management

**Multi-site governance, discovery, and sitemap generation for SitecoreAI via marketer-mcp.**

---

## Capabilities

1. **List all sites** — Discover every site in the XM Cloud instance with name, display name, and URL
2. **Inspect site configuration** — Get detailed site settings including ID, root path, hostname, and language
3. **Generate page trees** — Retrieve all pages for a site and present them as a hierarchical sitemap
4. **Identify site ownership** — Determine which site an arbitrary content item belongs to
5. **Search within a site** — Find pages by name or content within a specific site context

---

## Known Site Configuration

Before making API calls, check if the answer is already here. This saves tokens and latency.

| Property | Value |
|:---------|:------|
| **Site Name** | `main` |
| **Site ID** | `13efad37-1cc8-4c29-924b-8dd2d54b4046` |
| **Target Hostname** | `ai-migration-solution.vercel.app` |
| **Home Page ID** | `b132d115-7893-49aa-a06f-f1719a8704e3` |
| **Home Page Path** | `/sitecore/content/sites/main/home` |
| **Root Placeholder** | `headless-main` |

> **Token-saving rule:** If the user asks about the `main` site, use this table instead of calling `list_sites` or `get_site_information`. Only call the API when dealing with unknown sites or when you need fresh data.

---

## Workflow: List All Sites

When the user asks "What sites exist?" or "List all sites":

1. Call `mcp__marketer-mcp__list_sites` to retrieve all sites in the instance
2. Present each site with its key properties:

```
Site Inventory — XM Cloud Instance

| # | Site Name | Display Name | Hostname | Site ID |
|:--|:----------|:-------------|:---------|:--------|
| 1 | main | Main Site | ai-migration-solution.vercel.app | 13efad37-... |
| 2 | ... | ... | ... | ... |

Total: [N] sites
```

3. If only one site exists, note that this is a single-site instance
4. If multiple sites exist, highlight the relationships (e.g., shared content, language variants)

---

## Workflow: Inspect Site Configuration

When the user asks "Tell me about the [site name] site" or "What's the config for [site]?":

1. If the site is `main`, start from the Known Site Configuration table above
2. For any other site, call `mcp__marketer-mcp__get_site_information` with the site name or ID
3. Present the full configuration:

```
Site Configuration: [Site Name]

Property              Value
--------------------  ----------------------------------------
Site ID               [GUID]
Site Name             [name]
Display Name          [display name]
Target Hostname       [hostname]
Root Path             [/sitecore/content/sites/...]
Home Page Path        [path]
Home Page ID          [GUID]
Language              [language code]
```

4. Note any important details:
   - Is the hostname pointing to a Vercel/Next.js deployment?
   - Does the root path follow the standard `/sitecore/content/sites/{name}/home` pattern?
   - Are there any language-specific configurations?

---

## Workflow: Generate Page Tree / Sitemap

When the user asks "Generate a sitemap for [site]" or "Show me the page tree":

1. Identify the target site:
   - If user says "main" or "corporate" or the site name is known, use the site ID directly
   - If user provides a site name, call `mcp__marketer-mcp__get_site_information` to get the site ID
   - If unsure which site, call `mcp__marketer-mcp__list_sites` first and ask the user to pick
2. Call `mcp__marketer-mcp__get_all_pages_by_site` with the site ID to get all pages
3. Build a hierarchical tree from the page paths:

```
Page Tree: [Site Name]
Site ID: [GUID]
Total Pages: [N]

/home
  /home/about
    /home/about/team
    /home/about/history
  /home/services
    /home/services/consulting
    /home/services/development
  /home/products
    /home/products/product-a
    /home/products/product-b
  /home/contact
  /home/blog
    /home/blog/post-1
    /home/blog/post-2
```

4. Optionally provide a summary:

```
Sitemap Summary:
- Total pages: [N]
- Max depth: [N] levels
- Top-level sections: [list]
- Deepest path: [path]
```

### Building the Tree from Flat Page Data

The `get_all_pages_by_site` tool returns a flat list of pages with paths. To build the tree:

1. Sort pages by path alphabetically
2. Split each path into segments
3. Group pages by their parent path
4. Indent child pages under their parents
5. Pages at the same depth are siblings — present them at the same indent level

### URL Sitemap Format

If the user wants an XML sitemap or URL list (for SEO purposes):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://[hostname]/</loc>
  </url>
  <url>
    <loc>https://[hostname]/about</loc>
  </url>
  <url>
    <loc>https://[hostname]/services</loc>
  </url>
  <!-- ... -->
</urlset>
```

Use the site's target hostname from the site configuration to construct the full URLs. Strip the `/sitecore/content/sites/{name}/home` prefix and map to clean URL paths.

---

## Workflow: Identify Site from Item

When the user asks "Which site does this item belong to?" or provides an item ID and needs site context:

1. Call `mcp__marketer-mcp__get_site_id_from_item` with the item ID
2. Use the returned site ID to call `mcp__marketer-mcp__get_site_information` for the full site details
3. Present the result:

```
Item: [Item ID]
Belongs to: [Site Name] ([Site ID])
Site Root: [Root Path]
Hostname: [Hostname]
```

4. This is useful when:
   - The user pastes an item ID from a URL or log and needs context
   - Debugging cross-site content sharing issues
   - Verifying an item is in the expected site before performing operations

---

## Workflow: Search Within a Site

When the user wants to find pages by name or content:

1. Call `mcp__marketer-mcp__search_site` with the search query
2. Present results with page names, paths, and IDs:

```
Search Results for "[query]"

| # | Page Name | Path | Page ID |
|:--|:----------|:-----|:--------|
| 1 | About Us | /sitecore/content/sites/main/home/about | abc123... |
| 2 | About Our Team | /sitecore/content/sites/main/home/about/team | def456... |

Found: [N] results
```

3. If no results are found, suggest:
   - Trying broader search terms
   - Checking for typos
   - Using `get_all_pages_by_site` instead to browse the full page tree

---

## Multi-Site Awareness

When working across multiple sites, keep these principles in mind:

### Site Hierarchy in XM Cloud

```
/sitecore/content/sites/
  /main/           <-- Site 1 (root)
    /home/         <-- Home page (entry point)
      /about/
      /services/
  /corporate/      <-- Site 2 (root)
    /home/
      /investors/
      /careers/
```

- Each site has its own root under `/sitecore/content/sites/`
- Each site has its own `home` page that serves as the entry point
- Sites do NOT share page trees — each site's pages are isolated under its root
- Content items (datasources) CAN be shared across sites if stored in shared folders
- Each site maps to its own hostname for rendering

### Cross-Site Operations

- When the user works across sites, always clarify WHICH site before executing operations
- If an item ID is provided without site context, use `get_site_id_from_item` to determine the site first
- Never assume an item belongs to the `main` site — always verify when in doubt
- When listing pages from multiple sites, clearly label which site each page belongs to

---

## Response Format

When presenting site information:

```
Site: [Site Name]

[Key details in table or structured format]

[Relevant action suggestions based on what the user might want to do next]
```

Suggested follow-up actions based on context:
- After listing sites: "Would you like to inspect a specific site's configuration or generate its sitemap?"
- After generating a sitemap: "Would you like me to audit any of these pages for content completeness? (Use the `sitecore-content-reader` skill)"
- After identifying a site from an item: "Would you like to see the full page tree for this site?"

---

## Guidelines

- **Start with cached data** — Use the Known Site Configuration table before making API calls for the `main` site
- **Always confirm the site** — If the user's request is ambiguous about which site, ask before proceeding
- **Present hierarchically** — Page trees should always show parent-child relationships via indentation
- **Include IDs** — Always include site IDs and page IDs in output so the user can reference them in other skills
- **This skill is read-only** — It does not create, modify, or delete sites or pages. For content operations, direct the user to `sitecore-content-author` or `sitecore-content-reader`
- **Token efficiency** — `get_all_pages_by_site` can return large payloads for sites with many pages. Warn the user if the site has 100+ pages and offer to filter by section
- **Cross-skill handoffs** — After site discovery, suggest relevant next steps using other skills (content reader for auditing, content author for editing, publisher for going live)
