# Sitecore Site Configuration

**Source of truth for site IDs and common paths**
Last updated: 2026-02-05
Source: Marketer MCP

---

## Main Site

- **Site Name**: `main`
- **Site ID**: `13efad37-1cc8-4c29-924b-8dd2d54b4046`
- **Target Hostname**: `ai-migration-solution.vercel.app`
- **Home Page ID**: `b132d115-7893-49aa-a06f-f1719a8704e3`
- **Home Page Path**: `/sitecore/content/sites/main/home`
- **Root Placeholder**: `headless-main` (no leading slash for root components)

---

## Common Paths

| Description | Path | Item ID |
|:------------|:-----|:--------|
| Home | /sitecore/content/sites/main/home | b132d115-7893-49aa-a06f-f1719a8704e3 |
| Data Folder | /sitecore/content/sites/main/home/Data | (created per page) |

---

## Preview URL Template

```
https://xmc-4qlgtraf1kmzc2kz5jkd33-eh.sitecorecloud.io/api/editing/render?sc_itemid={PAGE_ID}&sc_lang={LANGUAGE}&sc_site=main&sc_version=1&mode=preview&sc_layoutkind=final&route={PAGE_ROUTE}&tenant_id=10053d8f-5120-4d89-f891-08de2910c96f&secret=5HB80HYQdXqyr2SnWsaCgT
```

### Parameters
- `{PAGE_ID}`: The page's item ID (GUID)
- `{LANGUAGE}`: Language code (default: `en`)
- `{PAGE_ROUTE}`: The page route (e.g., `/testpage`)

---

## XM Cloud Environment

- **Instance**: xmc-4qlgtraf1kmzc2kz5jkd33-eh
- **Tenant ID**: 10053d8f-5120-4d89-f891-08de2910c96f
- **MCP Endpoint**: https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod

---

## Usage Notes

- **No MCP needed**: Use this file instead of `marketer_search_site` for Home page ID
- **Token savings**: ~1.2k tokens per lookup
- **Pages Editor**: All pages can be edited via Sitecore Pages at the preview URL
