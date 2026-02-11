---
name: sitecore-content-reader
description: Read-only SitecoreAI content browser. Browse pages, inspect components, analyze component trees, check field completeness, and preview page layouts. Use when the user wants to view, inspect, audit, or understand existing SitecoreAI content. Does not create or modify content.
allowed-tools:
  - mcp__marketer-mcp__get_components_on_page
  - mcp__marketer-mcp__get_page_preview_url
  - mcp__marketer-mcp__search_site
  - mcp__marketer-mcp__get_content_item_by_id
  - mcp__marketer-mcp__get_content_item_by_path
  - mcp__marketer-mcp__get_page
---

# Sitecore Content Reader

**Read-only content inspection and analysis for SitecoreAI via marketer-mcp.**

---

## Capabilities

1. **Browse page components** — List all components on a page with their configuration and content fields
2. **Preview pages** — Get the preview URL for visual verification in a browser
3. **Search for pages** — Find pages by name or content across the site
4. **Read field values** — Inspect current field values on any content item
5. **Analyze component trees** — Reconstruct the full component hierarchy with parent-child relationships
6. **Audit field completeness** — Identify empty required fields and missing components

---

## Workflow: Inspecting a Page

1. Identify the page:
   - If user provides a page ID → use directly
   - If user provides a name → use `mcp__marketer-mcp__search_site` to find it
   - For the Home page → ID is `b132d115-7893-49aa-a06f-f1719a8704e3` (no MCP needed)
2. Use `mcp__marketer-mcp__get_components_on_page` to retrieve all components
3. Present results in structured format (see below)
4. Use `mcp__marketer-mcp__get_page_preview_url` to get the preview link
5. Share the preview URL for visual verification

---

## Workflow: Component Tree Reconstruction

When analyzing page structure, reconstruct the full component hierarchy:

1. Call `mcp__marketer-mcp__get_components_on_page` to get all components
2. For each component, note:
   - Component type/rendering
   - Placeholder path (reveals parent-child relationships)
   - Datasource ID
   - Dynamic placeholder ID (if it accepts children)
3. Build the tree from placeholder paths:
   - `headless-main` → root-level components
   - `/headless-main/buttons-1` → child of component with dynamic ID 1
   - `/headless-main/accordion-2/buttons-3` → deeply nested child
4. Present as an indented tree:

```
📄 Page: [Name]
├── HeroBanner (headless-main) — dynamic ID: 1
│   └── Button (buttons-1)
├── CardGrid (headless-main) — dynamic ID: 2
│   ├── Card (cards-2)
│   └── Card (cards-2)
└── ContentBlock (headless-main) — dynamic ID: 3
    └── Button (buttons-3)
```

---

## Workflow: Field Completeness Analysis

When auditing content quality:

1. Get all components via `mcp__marketer-mcp__get_components_on_page`
2. For each component with a datasource, call `mcp__marketer-mcp__get_content_item_by_id` to read field values
3. Cross-reference against the component registry's required fields (from the author skill's `references/component-registry.md`)
4. Report:
   - Components with all required fields populated
   - Components with empty required fields (flag these)
   - Components with no datasource (may need one created)

**Report format:**
```
📊 Field Completeness Report: [Page Name]

✅ Complete (3/5 components):
- HeroBanner: heading, subheading, backgroundImage all populated
- Button: link field populated
- ContentBlock: heading populated

⚠️ Incomplete (2/5 components):
- Card: missing `image` (required), missing `body` (required)
- SplitBanner: missing `imageMobile` (required)

Preview: [URL]
```

---

## Workflow: Component Inventory

When users want to understand what components exist across pages:

1. Use `mcp__marketer-mcp__search_site` to find target pages
2. For each page, call `mcp__marketer-mcp__get_components_on_page`
3. Aggregate component usage:

```
📊 Component Inventory: [Site Section]

| Component | Count | Pages |
|:----------|:------|:------|
| HeroBanner | 5 | Home, About, Services, Contact, Products |
| ContentBlock | 12 | (multiple) |
| CardGrid | 3 | Services, Products, Resources |
| Button | 18 | (multiple — child component) |
```

---

## Response Format

When presenting page content:

```
📄 Page: [Page Name/Path]

Components:
1. [Component Type] — [Placeholder/Slot]
   - Field: Value
   - Field: Value

2. [Component Type] — [Placeholder/Slot]
   - Field: Value

Preview: [URL]
```

---

## Guidelines

- Always show the preview URL when inspecting content — visual verification is critical
- If a page has many components, group them by placeholder/slot for readability
- If a component has empty fields, note them (the user may want to fill them via the content-author skill)
- If the page ID or path is invalid, say so clearly and ask the user to verify
- This skill is **read-only** — if the user wants to create or edit content, direct them to use the `sitecore-content-author` skill
- Never guess at content that doesn't exist in the API response
- When showing field values, indicate the field type (text, image XML, link XML, etc.) so the user understands the format
