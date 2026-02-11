# marketer-mcp Complete Tool Reference

**Source:** [Sitecore Marketer MCP Docs](https://doc.sitecore.com/sai/en/users/sitecoreai/marketer-mcp.html)
**Endpoint:** `https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod`
**Auth:** OAuth 2.0 via Sitecore Identity (interactive browser login)
**Tool naming in OpenClaw:** `mcp__marketer-mcp__<tool_name>`

---

## Site Management

| Tool | Purpose | Status |
|:-----|:--------|:-------|
| `list_sites` | List available sites with name, display name, URL | Available |
| `get_site_information` | Get specific site details (ID, name, root path) | Available |
| `get_site_id_from_item` | Get site ID from an item ID | Available |
| `get_all_pages_by_site` | Get all pages for a site (ID + path) | Available |

---

## Page Management

| Tool | Purpose | Status |
|:-----|:--------|:-------|
| `create_page` | Create new page using template under parent | **In Use** |
| `add_language_to_page` | Add language version to existing page | Available |
| `add_component_on_page` | Add component to placeholder on page | **In Use** |
| `get_components_on_page` | Get all components on a page | **In Use** |
| `set_component_datasource` | Set datasource for a component | Available |
| `remove_component_on_page` | Remove component from page | Available |
| `search_site` | Search pages by title/content | Available |
| `get_page_path_by_live_url` | Get page path from live URL | Available |
| `get_page_screenshot` | Get page screenshot as base64 | Available |
| `get_page_html` | Get HTML content of a page | Available |
| `get_page_preview_url` | Get preview URL for a page | **In Use** |
| `get_page_template_by_id` | Get page template details | Available |
| `get_page` | Get page details (ID, name, path) | Available |
| `get_allowed_components_by_placeholder` | Get allowed components for a placeholder | Available |

---

## Content Management

| Tool | Purpose | Status |
|:-----|:--------|:-------|
| `create_content_item` | Create new content item with fields | Available |
| `update_content` | **CRITICAL** — Update fields on content items (image XML, link XML, rich text, etc.) | Available |
| `delete_content` | Delete content item (+ optional children) | Available |
| `get_content_item_by_path` | Get content item by Sitecore path | Available |
| `get_content_item_by_id` | Get content item by ID | Available |
| `list_available_insertoptions` | Get available child templates | Available |

---

## Component Management

| Tool | Purpose | Status |
|:-----|:--------|:-------|
| `list_components` | List all components for a site (~13k tokens — use component-registry.md instead) | Available |
| `get_component` | Get component details (ID, name, datasource options) | Available |
| `create_component_datasource` | Create datasource item for a component | Available |
| `search_component_datasources` | Search datasources for a component | Available |

---

## Asset Management

| Tool | Purpose | Status |
|:-----|:--------|:-------|
| `search_assets` | Search digital assets by query/type/tags | Available |
| `get_asset_information` | Get asset details by ID | Available |
| `update_asset` | Update asset metadata (alt text, description, tags) | Available |
| `upload_asset` | Upload new digital asset | Available |

---

## Personalization

| Tool | Purpose | Status |
|:-----|:--------|:-------|
| `get_personalization_versions_by_page` | Get personalization variants | Available |
| `create_personalization_version` | Create personalization variant | Available |
| `get_personalization_condition_templates` | Get condition templates | Available |
| `get_personalization_condition_template_by_id` | Get condition template by ID | Available |

---

## Summary

**Total tools: 37**
- Site Management: 4
- Page Management: 14
- Content Management: 6
- Component Management: 4
- Asset Management: 4
- Personalization: 4
- Currently in use by deployed skills: 4 (expanding to 10+ with enrichment)
