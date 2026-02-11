---
name: sitecore-content-author
description: Create and configure SitecoreAI content. Coordinates sub-skills for image, link, and placeholder handling. Create new pages, add components to pages, populate all field types (text, rich text, image XML, link XML, checkbox, date), handle child components with dynamic placeholders, manage media assets. All changes are drafts — never publishes automatically.
allowed-tools:
  - mcp__marketer-mcp__update_content
  - mcp__marketer-mcp__update_fields_on_content_item
  - mcp__marketer-mcp__create_page
  - mcp__marketer-mcp__create_content_item
  - mcp__marketer-mcp__create_child_item
  - mcp__marketer-mcp__create_component_datasource
  - mcp__marketer-mcp__add_component_on_page
  - mcp__marketer-mcp__get_components_on_page
  - mcp__marketer-mcp__get_components_by_placeholder
  - mcp__marketer-mcp__get_allowed_components_by_placeholder
  - mcp__marketer-mcp__move_component_within_placeholder
  - mcp__marketer-mcp__remove_component_on_page
  - mcp__marketer-mcp__set_component_datasource
  - mcp__marketer-mcp__search_assets
  - mcp__marketer-mcp__get_asset_information
  - mcp__marketer-mcp__update_asset
  - mcp__marketer-mcp__upload_asset
  - mcp__marketer-mcp__get_page
  - mcp__marketer-mcp__get_content_item_by_id
  - mcp__marketer-mcp__get_content_item_by_path
  - mcp__marketer-mcp__list_available_insertoptions
  - mcp__marketer-mcp__search_site
  - mcp__marketer-mcp__get_page_preview_url
---

# Sitecore Content Author

**Create and configure SitecoreAI content via marketer-mcp. Coordinates sub-skills for complete component authoring. Identifies field types, routes to correct formatting logic, handles multi-field updates, and manages parent-child component hierarchies. All changes produce drafts only — publishing requires separate approval.**

---

## Sub-Skill Coordination

This skill delegates specialized work to focused sub-skills:

| Sub-Skill | Responsibility | Key Tools |
|:----------|:---------------|:----------|
| `sitecore-author-image` | Image field XML formatting, asset search, asset metadata | `search_assets`, `get_asset_information`, `update_content` |
| `sitecore-author-link` | Link field XML formatting (internal, external, media, anchor) | `update_content`, `get_content_item_by_id` |
| `sitecore-author-placeholder` | Placeholder path construction, dynamic ID retrieval, nesting | `add_component_on_page`, `get_components_on_page` |
| `sitecore-upload-media` | Upload new media assets to the Media Library | `upload_asset`, `update_asset`, `search_assets` |

**When to use this skill vs a sub-skill directly:**
- Use **this skill** when authoring a component end-to-end (add component + populate all field types)
- Use a **sub-skill directly** when performing a single focused operation (e.g., only updating an image field)

---

## Context Efficiency — Check Local Files First

**The context window is a public good.** Before making MCP calls, check local reference files.

### Reference Data Files

| File | Tokens | Replaces MCP Call | Savings |
|:-----|:-------|:------------------|:--------|
| `references/component-registry.md` | ~2k | `list_components` | ~13k tokens |
| `references/site-config.md` | ~200 | `search_site` for Home page | ~1.2k tokens |
| `references/page-templates.md` | ~300 | `list_available_insertoptions` | ~600 tokens |
| `references/placeholder-patterns.md` | ~400 | Manual placeholder construction | reference |
| `references/component-authoring-guide.md` | ~300 | Per-component field formats | reference |

**Total savings: ~12,600 tokens per authoring session (83% reduction)**

### When to Use MCP

**ONLY use MCP for:**
- Creating/updating actual content (`create_page`, `add_component_on_page`, `update_content`)
- Querying latest page state (`get_components_on_page` for dynamic IDs)
- Searching for non-Home pages (`search_site`)
- Reading current field values (`get_content_item_by_id`)
- Information not available in local reference files

---

## Authoring Workflow

```
+---------------------------------------------------------------------+
| SITECORE CONTENT AUTHOR WORKFLOW                                    |
+---------------------------------------------------------------------+
|                                                                      |
|  0. GATHER INFO LOCALLY                                              |
|     Read reference files for rendering IDs, field schemas,           |
|     placeholder keys, page IDs, template IDs                         |
|     |                                                                |
|  1. CLASSIFY FIELDS by type                                          |
|     Scan the requested content and categorize every field:           |
|     +-- Text / RichText / Multi-Line / Number / Date / Checkbox     |
|     +-- Image fields                                                 |
|     +-- Link fields                                                  |
|     +-- Fields needing media upload first                            |
|     |                                                                |
|  2. DETERMINE PLACEHOLDER (delegate to sitecore-author-placeholder)  |
|     +-- Root -> placeholder = "headless-main" (NO leading slash)     |
|     +-- Nested -> "/{parent}/{key}-{dynamicId}" (HAS leading slash)  |
|     |                                                                |
|  3. ADD COMPONENT to page                                            |
|     mcp__marketer-mcp__add_component_on_page                         |
|     -> Returns datasourceId (content item ID for field updates)      |
|     |                                                                |
|  4. ROUTE FIELD UPDATES by type                                      |
|     +-- Text / RichText / Checkbox / Number / Date                   |
|     |   -> Direct: mcp__marketer-mcp__update_content                 |
|     +-- Image fields                                                 |
|     |   -> Delegate to sitecore-author-image formatting rules        |
|     |   -> If image needs upload: delegate to sitecore-upload-media  |
|     +-- Link fields                                                  |
|     |   -> Delegate to sitecore-author-link formatting rules         |
|     |                                                                |
|  5. BATCH MULTI-FIELD UPDATES                                        |
|     Group compatible fields into minimal update_content calls         |
|     (all field types can go in one call once formatted correctly)     |
|     |                                                                |
|  6. HANDLE CHILDREN (if any)                                         |
|     +-- Query parent's DynamicPlaceholderId                          |
|     +-- Delegate path construction to sitecore-author-placeholder    |
|     +-- REPEAT from step 3 for each child component                  |
|     |                                                                |
|  7. VERIFY                                                           |
|     get_components_on_page to confirm component tree                  |
|     get_page_preview_url for visual verification                     |
|                                                                      |
+---------------------------------------------------------------------+
```

### Step 1: Gather Info Locally

**Get component rendering ID (from local registry — NO MCP):**
- Read `references/component-registry.md`
- Search for the component name to get rendering ID and field schema

**Get Home page ID (from local config — NO MCP):**
- Read `references/site-config.md`
- Home Page ID: `b132d115-7893-49aa-a06f-f1719a8704e3`

**Get template ID (from local config — NO MCP):**
- Read `references/page-templates.md`
- Landing Page: `300f3d1b-52ef-4734-8eab-ae2e2a422759`

**Find non-Home pages (requires MCP):**
```
mcp__marketer-mcp__search_site({ site_name: "main", search_query: "PageName" })
```

---

## Step 1: Classify Fields by Type

Before any MCP calls, categorize every field the user wants to populate:

| Field Type | Category | Routing Decision |
|:-----------|:---------|:-----------------|
| Single-Line Text | **direct** | `update_content` with plain string |
| Multi-Line Text | **direct** | `update_content` with `<br />` line breaks |
| Rich Text | **direct** | `update_content` with HTML tags |
| Number | **direct** | `update_content` with string number |
| Date | **direct** | `update_content` with `"20240115T120000Z"` format |
| Checkbox | **direct** | `update_content` with `"1"` or `"0"` |
| Multilist | **direct** | `update_content` with pipe-separated GUIDs `"{GUID1}\|{GUID2}"` |
| Image | **image sub-skill** | Format via `sitecore-author-image` rules, then `update_content` |
| General Link | **link sub-skill** | Format via `sitecore-author-link` rules, then `update_content` |
| Image (needs upload) | **upload + image** | Upload via `sitecore-upload-media`, then format via `sitecore-author-image` |

**Field names are case-sensitive.** Always verify exact names from `references/component-registry.md`.

---

## Step 2: Identify Component

Look up the component in `references/component-registry.md` to get:
- **Rendering ID** (GUID for `add_component_on_page`)
- **Field names and types** (case-sensitive!)
- **Placeholder keys** (if component accepts children)

### Step 3: Determine Placeholder Path

See `references/placeholder-patterns.md` for full rules.

| Scenario | Placeholder Path | Leading Slash? |
|:---------|:-----------------|:---------------|
| Root-level component | `headless-main` | **NO** |
| Child of component (dynamic ID 1) | `/headless-main/buttons-1` | **YES** |
| Deeply nested | `/headless-main/accordion-2/buttons-3` | **YES** |

### Step 4: Add Component to Page

```
mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "rendering-guid",
  placeholderPath: "headless-main",
  componentItemName: "HeroBanner_1",
  fields: { "Heading": "Welcome" }
})
```

**IMPORTANT:** The `datasourceId` in the response is the content item ID needed for `update_content`.

### Step 5: Populate Complex Fields

After adding a component, use `mcp__marketer-mcp__update_content` for complex field types:

```
mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  fields: { "fieldName": "formatted value" }
})
```

See **Field Type Reference** below for exact formats.

---

## Step 5: Batch Multi-Field Updates

**Minimize MCP calls by combining all formatted fields into a single `update_content` call.** All field types (text, image XML, link XML, checkbox) can be sent in one request once they are properly formatted.

```
mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  fields: {
    "heading": "Welcome to Our Restaurant",
    "subheading": "Experience fine dining",
    "body": "<p>Discover our award-winning cuisine.</p>",
    "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "backgroundImageMobile": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "link": "<link text='View Menu' linktype='external' url='https://example.com/menu' anchor='' target='_blank' />",
    "isEnabled": "1"
  }
})
```

**Multi-field update strategy:**
1. Classify all fields (Step 1)
2. Format complex fields (image XML, link XML) using sub-skill rules
3. Combine ALL formatted values into a single `fields` object
4. Make ONE `update_content` call with everything

**Note:** A response with `updatedFields: {}` is **normal and expected** -- the update actually succeeded.

---

## Step 6: Handle Child Components

1. Call `mcp__marketer-mcp__get_components_on_page` to get parent's `DynamicPlaceholderId`
2. Construct child placeholder: `/{parentPlaceholder}/{childKey}-{dynamicId}`
3. Repeat steps 4-5 for each child

### Cumulative Dynamic ID Counting

Sitecore assigns dynamic placeholder IDs sequentially to ALL components added, including children:

```
1. HeroBanner (1st component added)  -> Dynamic ID: 1
   +-- Button (2nd component added)  -> placed at /headless-main/buttons-1
2. SplitBanner (3rd component added) -> Dynamic ID: 3
   +-- Button (4th component added)  -> placed at /headless-main/buttons-3
3. ContentBlock (5th component added) -> Dynamic ID: 5
   +-- Button (6th component added)  -> placed at /headless-main/buttons-5
```

**Always query the actual dynamic ID after adding each parent -- do not guess.**

---

## Field Type Reference

| Field Type | Format | Example |
|:-----------|:-------|:--------|
| Single-Line Text | Plain string | `"Welcome to Our Site"` |
| Multi-Line Text | `<br />` for line breaks | `"Line 1<br />Line 2"` |
| Rich Text | HTML tags | `"<p>Paragraph content</p>"` |
| Image | XML with mediaid | `"<image mediaid='{GUID}' />"` |
| General Link (external) | XML with url | `"<link text='Learn More' linktype='external' url='https://example.com' anchor='' target='_blank' />"` |
| General Link (internal) | XML with id | `"<link text='About' linktype='internal' url='' anchor='' target='' id='{GUID}' />"` |
| Checkbox | String "1" or "0" | `"1"` (checked) or `"0"` (unchecked) |
| Number | String number | `"123"` |
| Date | ISO-ish format | `"20240115T120000Z"` |
| Multilist | Pipe-separated GUIDs | `"{GUID1}|{GUID2}|{GUID3}"` |

### Image XML Template

```
<image mediaid='{GUID}' />
```

**Rules:**
- MUST use single quotes around attribute values
- GUID MUST have braces: `{GUID}`
- GUID should be UPPERCASE
- Self-closing tag with space before `/>`
- If image needs upload first, use `mcp__marketer-mcp__upload_asset`

### Link XML Template

**External link:**
```
<link text='Display Text' linktype='external' url='https://example.com' anchor='' target='_blank' />
```

**Internal link:**
```
<link text='Display Text' linktype='internal' url='' anchor='' target='' id='{GUID}' />
```

**Rules:**
- MUST use single quotes around ALL attribute values
- ALL attributes required: `text`, `linktype`, `url`, `anchor`, `target`
- External links need `url='https://...'`
- Internal links need `id='{GUID}'` with braces
- Empty attributes must still be present: `anchor='' target=''`

---

## Special Character Handling

### Quotation Marks in Content

**NEVER use escaped double quotes (`\"`) in field values.** They render as literal backslash-quote on the published site.

| Method | Result | Correct? |
|:-------|:-------|:---------|
| `\"Register\"` | Displays: `\"Register\"` | **WRONG** |
| `&quot;Register&quot;` | Displays: `"Register"` | **CORRECT** |
| `'Register'` | Displays: `'Register'` | **CORRECT** (single quotes) |

**Rule:** Use `&quot;` for double quotes in all text fields. Never use `\"`.

### Newline Handling

**NEVER use literal `\n` in field values.** They render as the text "\n" on the published site.

| Field Type | Solution | Example |
|:-----------|:---------|:--------|
| Multi-Line Text | `<br />` tags | `"Line one<br />Line two"` |
| Rich Text | `<p>` tags for paragraphs | `"<p>Para one</p><p>Para two</p>"` |
| Rich Text | `<br />` for soft breaks | `"<p>Line one<br />Line two</p>"` |
| Single-Line Text | No line breaks allowed | `"Single line only"` |

### Code Blocks in Rich Text

When including code in rich text fields, use HTML entities:
- Newlines: `&#10;` (NOT `\n`)
- `<` → `&lt;`
- `>` → `&gt;`
- `&` → `&amp;`
- `"` → `&quot;`

**Example:**
```
"<pre><code>/Components&#10;  /EventCard&#10;    key-name</code></pre>"
```

---

## Pre-Authoring Checklist

Before authoring any component, verify:

- [ ] Read local reference files (component-registry, site-config, page-templates)
- [ ] Have page ID (from `references/site-config.md` or MCP search)
- [ ] Have rendering ID (from `references/component-registry.md`)
- [ ] Classified all fields by type (text, image, link, etc.)
- [ ] Know correct placeholder path (root = no slash, nested = with slash)
- [ ] Have unique component item name (e.g., `HeroBanner_1`)
- [ ] Know all field names (case-sensitive -- from component registry)
- [ ] Know field formats for each type (from sub-skill rules)
- [ ] If has children: know child placeholder key from component registry
- [ ] If needs media upload: have image source ready for `sitecore-upload-media`

---

## Complete Example: HeroBanner with Image and Child Button

```
// ================================================================
// STEP 0: Gather info locally
// ================================================================
// Read references/component-registry.md:
//   HeroBanner rendering ID: 5e9d7b60-f61b-407b-b04b-2eeba60b0ec0
//   Button rendering ID: c152f7dc-6c01-4380-babb-97c9f080cf00
//   HeroBanner child placeholder key: "buttons"
// Read references/site-config.md:
//   Home Page ID: b132d115-7893-49aa-a06f-f1719a8704e3

// ================================================================
// STEP 1: Classify fields
// ================================================================
// heading       -> Single-Line Text -> direct
// subheading    -> Single-Line Text -> direct
// backgroundImage -> Image -> sitecore-author-image rules
// backgroundImageMobile -> Image -> sitecore-author-image rules
// Button child: link -> General Link -> sitecore-author-link rules

// ================================================================
// STEP 2: Placeholder = root level -> "headless-main" (no slash)
// ================================================================

// ================================================================
// STEP 3: Add HeroBanner to page
// ================================================================
mcp__marketer-mcp__add_component_on_page({
  pageId: "b132d115-7893-49aa-a06f-f1719a8704e3",
  componentRenderingId: "5e9d7b60-f61b-407b-b04b-2eeba60b0ec0",
  placeholderPath: "headless-main",
  componentItemName: "HeroBanner_1",
  fields: {
    "heading": "Welcome to Our Restaurant",
    "subheading": "Experience fine dining"
  }
})
// -> Returns: { datasourceId: "abc-123-...", placeholderId: "headless-main" }

// ================================================================
// STEP 4 + 5: Route and batch image field updates
// ================================================================
// Image fields: delegate formatting to sitecore-author-image rules
// Search for asset if needed: search_assets -> get_asset_information
// Format XML: <image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />
// Batch both image fields into one update call:

mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: "abc-123-...",
  fields: {
    "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "backgroundImageMobile": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
  }
})

// ================================================================
// STEP 6: Handle child Button
// ================================================================
// 6a: Get parent's dynamic placeholder ID
mcp__marketer-mcp__get_components_on_page({
  pageId: "b132d115-7893-49aa-a06f-f1719a8704e3"
})
// -> Find HeroBanner -> DynamicPlaceholderId: "1"

// 6b: Construct child placeholder path (sitecore-author-placeholder rules)
// "/headless-main/buttons-1" (WITH leading slash)

// 6c: Add Button child (link field formatted via sitecore-author-link rules)
mcp__marketer-mcp__add_component_on_page({
  pageId: "b132d115-7893-49aa-a06f-f1719a8704e3",
  componentRenderingId: "c152f7dc-6c01-4380-babb-97c9f080cf00",
  placeholderPath: "/headless-main/buttons-1",
  componentItemName: "Button_1_1",
  fields: {
    "link": "<link text='View Menu' linktype='external' url='https://example.com/menu' anchor='' target='_blank' />"
  }
})

// ================================================================
// STEP 7: Verify
// ================================================================
mcp__marketer-mcp__get_components_on_page({
  pageId: "b132d115-7893-49aa-a06f-f1719a8704e3"
})
// Confirm HeroBanner + child Button appear correctly
```

---

## Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `HeroBanner_2` |
| Component not visible | Wrong placeholder path | Check leading slash rules (see `sitecore-author-placeholder`) |
| "Cannot find field" | Wrong field name | Check component-registry.md for exact name (case-sensitive) |
| Child not placed correctly | Missing dynamic ID | Query parent's `DynamicPlaceholderId` via `get_components_on_page` first |
| Image not showing | Wrong XML format | Follow `sitecore-author-image` rules: single quotes, braces, uppercase GUID |
| Link not working | Missing attributes | Follow `sitecore-author-link` rules: all attributes required |
| `updatedFields: {}` response | Normal behavior | The update actually succeeded -- `update_content` returns empty on success |
| JSON parsing error | Double quotes in XML | Always use single quotes for XML attributes inside JSON strings |
| `\n` visible on site | Literal newline in field value | Use `<br />` or `<p>` tags, never `\n` |
| `\"` visible on site | Escaped quotes in field value | Use `&quot;` HTML entity, never `\"` |

---

## Safety Rules

- **Never publish** — this skill creates drafts only. Publishing requires the `sitecore-content-publisher` skill and approval workflow.
- **Always describe before executing** — tell the user what you're about to do and wait for confirmation before making changes.
- **Always verify after executing** — use `get_components_on_page` and `get_page_preview_url` to confirm changes.
- **If adding 4+ components**, present the full plan and get explicit approval before starting (bulk operation).

---

## Confirmation Workflow

### Before Executing

Describe the operation:
```
I'm going to add a [Component Type] to [Page Name] in the [Placeholder] slot with:
- Field: Value
- Field: Value

Proceed? (yes/no)
```

### After Executing

Confirm with:
```
✅ [Action completed]

Result:
- [What was created/modified]
- [Key field values]

Preview: [URL]

Note: This is a draft. Publishing requires separate approval via sitecore-content-publisher.
```

### Bulk Operations (Multiple Components)

Present the full plan:
```
Plan for [Page Name]:
1. Add [Component A] to [Slot] with fields...
2. Add [Component B] to [Slot] with fields...
3. Add [Component C] as child of Component A...

Proceed with all? (yes/no)
```

Execute sequentially, verifying each step. Show final preview URL after all components are added.

---

## Error Recovery

- If page creation fails: report error, suggest checking parent path, template, and MCP connection
- If component addition fails: report which component failed and which succeeded -- do not retry automatically
- If `update_content` returns an error: check field name spelling (case-sensitive) and field format against sub-skill rules
- If child component placement fails: verify the parent's dynamic placeholder ID was queried (not guessed) and the path has a leading slash
- If media upload fails: check image source accessibility and auth credentials -- delegate troubleshooting to `sitecore-upload-media` skill
- If preview URL is unavailable: note it but do not block the workflow

---

## Related Skills

| Skill | Purpose | When to Delegate |
|:------|:--------|:-----------------|
| `sitecore-author-image` | Image field XML formatting and asset search | Formatting image fields (Step 4) |
| `sitecore-author-link` | Link field XML formatting (all link types) | Formatting link fields (Step 4) |
| `sitecore-author-placeholder` | Placeholder path construction and dynamic IDs | Determining placement path (Step 2, Step 6) |
| `sitecore-upload-media` | Upload new media to the Media Library | When image needs upload before assignment (Step 4) |
| `sitecore-content-reader` | Read-only content inspection and analysis | Verifying results (Step 7) |
| `sitecore-content-publisher` | Publishing workflow and approval | NOT used by this skill -- drafts only |
