# TOOLS.md - Local Notes

## Architecture

```
Slack (Socket Mode) → OpenClaw Gateway → sitecore-mcp extension → HTTP proxy → marketer-mcp → Sitecore XM Cloud
```

- **OpenClaw Gateway** — Your brain. Runs on Railway, internal only (no public URL).
- **sitecore-mcp-proxy** — HTTP REST proxy that handles MCP protocol + OAuth. Runs as a separate Railway service on internal networking.
- **marketer-mcp** — Sitecore's official MCP server (42 tools). Hosted at Sitecore Edge Platform.

## MCP Proxy

- **Internal URL:** `http://sitecore-mcp-proxy.railway.internal:3001`
- **Auth:** `x-mcp-token` header (shared secret between proxy and OpenClaw)
- **OAuth:** client_credentials grant to Sitecore Cloud (auto-renews, no refresh token)
- **Endpoints:**
  - `GET /health` — proxy status + tool count
  - `GET /tools` — list all 42 tool definitions
  - `POST /tools/:name` — execute a tool

## Sitecore Tools (42 total)

All tools are registered as OpenClaw tools via the sitecore-mcp extension plugin. Tool names may be prefixed by OpenClaw — check actual names via `/tools list` or ask "list your tools."

### Site Management (4)
- `list_sites` — List available sites
- `get_site_information` — Site details (ID, name, root path)
- `get_site_id_from_item` — Site ID from item ID
- `get_all_pages_by_site` — All pages for a site

### Page Management (14)
- `create_page` — Create page from template
- `add_language_to_page` — Add language version
- `add_component_on_page` — Add component to placeholder
- `get_components_on_page` — List components on page
- `get_components_by_placeholder` — Components in a specific placeholder
- `set_component_datasource` — Set component datasource
- `move_component_within_placeholder` — Reorder components
- `remove_component_on_page` — Remove component
- `search_site` — Search pages by title/content
- `get_page_path_by_live_url` — Page path from live URL
- `get_page_screenshot` — Screenshot as base64
- `get_page_html` — HTML content
- `get_page_preview_url` — Preview URL (**always include in responses**)
- `get_page_template_by_id` — Template details
- `get_page` — Page details (ID, name, path)
- `get_allowed_components_by_placeholder` — Allowed components for placeholder

### Content Management (7)
- `create_content_item` — Create content item
- `create_child_item` — Create child item under parent
- `update_content` — **CRITICAL** — Update fields (image XML, link XML, rich text)
- `update_fields_on_content_item` — Update fields on content item
- `delete_content` — Delete content item
- `delete_child_item` — Delete child item
- `get_content_item_by_path` — Item by Sitecore path
- `get_content_item_by_id` — Item by ID
- `list_available_insertoptions` — Available child templates

### Component Management (4)
- `list_components` — List all components (~13k tokens — **use component-registry.md instead**)
- `get_component` — Component details
- `create_component_datasource` — Create datasource
- `search_component_datasources` — Search datasources

### Asset Management (4)
- `search_assets` — Search by query/type/tags
- `get_asset_information` — Asset details by ID
- `update_asset` — Update metadata (alt text, description, tags)
- `upload_asset` — Upload new asset

### Personalization (4)
- `get_personalization_versions_by_page` — Get variants
- `create_personalization_version` — Create variant
- `get_personalization_condition_templates` — List condition templates
- `get_personalization_condition_template_by_id` — Template details

## Local Reference Data

These files save thousands of tokens per session. **Check them before making MCP calls:**

| File | Replaces | Savings |
|:-----|:---------|:--------|
| `skills/*/references/component-registry.md` | `list_components` | ~13k tokens |
| `skills/*/references/site-config.md` | `search_site` | ~1.2k tokens |
| `skills/*/references/page-templates.md` | `list_available_insertoptions` | ~600 tokens |
| `skills/*/references/placeholder-patterns.md` | Manual lookup | Reference |

## Slack

- **Channel:** #ai-agent-workflows
- **Mode:** Socket Mode (outbound WebSocket, no inbound ports)
- **DMs:** Enabled (Slack Agent split-pane UI)

## Notes

_(Add runtime discoveries here — tool quirks, API gotchas, workarounds)_
