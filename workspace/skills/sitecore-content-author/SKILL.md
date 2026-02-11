---
name: sitecore-content-author
description: Create and configure SitecoreAI content. Create new pages, add components to pages, populate all field types (text, rich text, image XML, link XML, checkbox, date), handle child components with dynamic placeholders. All changes are drafts — never publishes automatically.
allowed-tools:
  - mcp__marketer-mcp__create_page
  - mcp__marketer-mcp__add_component_on_page
  - mcp__marketer-mcp__update_content
  - mcp__marketer-mcp__get_components_on_page
  - mcp__marketer-mcp__get_page_preview_url
  - mcp__marketer-mcp__search_site
  - mcp__marketer-mcp__get_content_item_by_id
  - mcp__marketer-mcp__create_component_datasource
  - mcp__marketer-mcp__set_component_datasource
  - mcp__marketer-mcp__upload_asset
---

# Sitecore Content Author

**Create and configure SitecoreAI content via marketer-mcp. All changes produce drafts only — publishing requires separate approval.**

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

## Authoring Workflow (6 Steps)

```
┌─────────────────────────────────────────────────────────────────┐
│ COMPONENT AUTHORING WORKFLOW                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. GATHER: Read reference files for rendering ID, fields,      │
│     placeholder key, page ID, template ID                       │
│     |                                                           │
│  2. IDENTIFY: Look up component in component-registry.md        │
│     Get rendering ID and field schema                           │
│     |                                                           │
│  3. DETERMINE PLACEHOLDER: Is root or nested?                   │
│     ├── Root → placeholder = "headless-main" (NO leading slash) │
│     └── Nested → "/{parent}/{key}-{dynamicId}" (HAS slash)     │
│     |                                                           │
│  4. ADD COMPONENT: mcp__marketer-mcp__add_component_on_page     │
│     → Returns datasourceId (content item ID for field updates)  │
│     |                                                           │
│  5. POPULATE FIELDS (by type):                                  │
│     ├── Text/RichText → mcp__marketer-mcp__update_content       │
│     ├── Image → update_content with image XML format            │
│     ├── Link → update_content with link XML format              │
│     └── Checkbox → update_content with "1" or "0"              │
│     |                                                           │
│  6. HANDLE CHILDREN (if any):                                   │
│     ├── Query parent's DynamicPlaceholderId                     │
│     ├── Construct child placeholder: /{parent}/{key}-{id}       │
│     └── REPEAT from step 4 for each child                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
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

### Step 2: Identify Component

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

### Step 6: Handle Child Components

1. Call `mcp__marketer-mcp__get_components_on_page` to get parent's `DynamicPlaceholderId`
2. Construct child placeholder: `/{parentPlaceholder}/{childKey}-{dynamicId}`
3. Repeat steps 4-5 for each child

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

- [ ] Have page ID (from `references/site-config.md` or `search_site`)
- [ ] Have rendering ID (from `references/component-registry.md`)
- [ ] Know correct placeholder path (root = no slash, nested = with slash)
- [ ] Have unique component item name (e.g., `HeroBanner_1`)
- [ ] Know all field names (case-sensitive — from component registry)
- [ ] Know field types (text, image, link, etc.) and their XML formats
- [ ] If has children: know child placeholder key from component registry

---

## Complete Example: HeroBanner with Button

```
// STEP 1: Read local reference files
// → HeroBanner rendering ID: 5e9d7b60-f61b-407b-b04b-2eeba60b0ec0
// → Button rendering ID: c152f7dc-6c01-4380-babb-97c9f080cf00
// → Home Page ID: b132d115-7893-49aa-a06f-f1719a8704e3
// → HeroBanner placeholder key for children: "buttons"

// STEP 2: Add HeroBanner to page (root level = NO leading slash)
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
// → Returns: { datasourceId: "abc-123-...", placeholderId: "headless-main" }

// STEP 3: Update HeroBanner image fields
mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: "abc-123-...",
  fields: {
    "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "backgroundImageMobile": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
  }
})

// STEP 4: Get dynamic placeholder ID for child Button
mcp__marketer-mcp__get_components_on_page({ pageId: "b132d115-..." })
// → Find HeroBanner component → DynamicPlaceholderId: "1"

// STEP 5: Add Button child (nested = WITH leading slash)
mcp__marketer-mcp__add_component_on_page({
  pageId: "b132d115-7893-49aa-a06f-f1719a8704e3",
  componentRenderingId: "c152f7dc-6c01-4380-babb-97c9f080cf00",
  placeholderPath: "/headless-main/buttons-1",
  componentItemName: "Button_1_1",
  fields: {
    "link": "<link text='View Menu' linktype='external' url='https://example.com/menu' anchor='' target='_blank' />"
  }
})

// STEP 6: Verify and get preview URL
mcp__marketer-mcp__get_page_preview_url({ pageId: "b132d115-..." })
```

---

## Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `HeroBanner_2` |
| Component not visible | Wrong placeholder path | Check leading slash rules (root = no slash, nested = with slash) |
| "Cannot find field" | Wrong field name | Check component-registry.md for exact name (case-sensitive) |
| Child not placed correctly | Missing dynamic ID | Query parent's `DynamicPlaceholderId` via `get_components_on_page` first |
| Image not showing | Wrong XML format | Use single quotes, braces around GUID: `<image mediaid='{GUID}' />` |
| Link not working | Missing attributes | Include ALL attributes: text, linktype, url, anchor, target |
| `updatedFields: {}` response | Normal behavior | The update actually succeeded — `update_content` returns empty on success |

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

- If page creation fails: report error, suggest checking parent path, template, MCP connection
- If component addition fails: report which component failed and which succeeded — do not retry automatically
- If `update_content` returns an error: check field name spelling (case-sensitive) and field format
- If preview URL is unavailable: note it but don't block the workflow
