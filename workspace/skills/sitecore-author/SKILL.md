---
name: sitecore-author
description: Orchestrates complete page creation and component authoring in Sitecore XM Cloud using context-specific templates and specialized field skills
---

# Component Authorer Skill

**Version:** 1.1

## What I do

- Create new pages with context-appropriate templates (Article Page, Event Page, etc.)
- Add components to Sitecore pages with all fields populated
- Orchestrate specialized skills for different field types:
  - `/sitecore-author-placeholder` - Component placement
  - `/sitecore-author-image` - Image field formatting
  - `/sitecore-author-link` - Link field formatting
- Handle nested/child components automatically
- Support all common field types (text, rich text, image, link, checkbox)
- **ALWAYS provide preview URL** in final response using `marketer_get_page_preview_url` (NOT optional!)

## Expected Output Format (REQUIRED)

Every successful authoring response MUST include:

```
Done! [Action summary]:
• Field1: value
• Field2: value

Preview: https://xmc-main-xxx.sitecorecloud.io/...
```

**Never ask "Want the preview URL?" - always include it automatically.**

## When to use

Use this skill when:

- Creating a new page in Sitecore (uses context-specific templates)
- Creating a new component on a Sitecore page
- Adding multiple components to build a page layout
- Need to populate various field types in a single workflow
- Creating parent components with children (e.g., HeroBanner with Button)

**EXCEPTION - Delegate to specialized skills:**

- **Article Pages** → Use `/sitecore-author-article-page` instead
  - Triggers: "create article", "edit article", "new blog post", "publish article"
  - When working in `/Articles` folder or with Article Page template
  - When updating article-specific fields (heading, subheading, datePublished, tags)

---

## Skill Delegation Rules

**Before authoring, check if a specialized skill should handle the request:**

| User Request Pattern | Delegate To | Why |
|:---------------------|:------------|:----|
| "create article [title]" | `/sitecore-author-article-page` | Article-specific template, fields, and workflow |
| "edit article [name]" | `/sitecore-author-article-page` | Article-specific field updates |
| "new blog post about [topic]" | `/sitecore-author-article-page` | Blog posts use Article Page template |
| "add [name] tag" | `/sitecore-author-tags` | Tag name → ID mapping |
| "add [name] profile" | `/sitecore-author-profiles` | Profile name → ID mapping |

**Only use this skill (`/sitecore-author`) for:**
- General page creation (Landing Pages, Event Pages, etc.)
- Adding components to any page type
- Multi-component workflows

---

## ⚠️ CONTEXT EFFICIENCY - Check Local Files First

**The context window is a public good.** Before making MCP calls, check local data sources.

### Data Sources (Read First)

1. **`/sitecore-component-docs` references** (~2k tokens per component)
   - Component rendering IDs
   - Field names, types, and requirements
   - Placeholder keys
   - **REPLACES**: `marketer_list_components` (~13k tokens) ✓
   - Use `/sitecore-component-docs` or `/sitecore-field-validator` for quick access

2. **`.claude/data/site-config.md`** (~200 tokens)
   - Site ID: `13efad37-1cc8-4c29-924b-8dd2d54b4046`
   - Home Page ID: `b132d115-7893-49aa-a06f-f1719a8704e3`
   - **REPLACES**: `marketer_search_site` (~1.2k tokens) ✓

3. **`references/page-templates.md`** (~300 tokens)
   - Landing Page: `300f3d1b-52ef-4734-8eab-ae2e2a422759`
   - Templates available under HOME only
   - **LIMITATION**: Does NOT include context-specific templates (Article Page, Event Page, etc.)
   - **USE**: For creating pages directly under /Home
   - **DO NOT USE**: For creating pages under /Articles, /Events, etc. (use MCP instead)

**Token Savings**: ~12,600 tokens per authoring session (83% reduction)

### When to Use MCP

**ONLY use MCP for**:

- **Template selection** - ALWAYS use `list_available_insertoptions` on the parent when creating new pages
- Creating/updating actual content (`create_page`, `add_component_on_page`, `update_content`)
- Querying latest page state (`get_components_on_page` for dynamic IDs)
- Information not available locally

---

## Workflow

This skill coordinates specialized skills and MCP calls:

1. **Read local context** → /sitecore-component-docs, site-config.md (see "Context Efficiency" above)
2. **Check component docs** → /sitecore-component-docs
3. **Determine placeholder** → /sitecore-author-placeholder
4. **Add component** → marketer_add_component_on_page
5. **Update fields**:
   - Text/Rich Text → marketer_update_content
   - Images → /sitecore-author-image
   - Links → /sitecore-author-link
   - Checkboxes → marketer_update_content ("1" or "0")
6. **Handle children** → Get parent dynamic ID, repeat steps 3-5
7. **Get preview URL** → marketer_get_page_preview_url (MANDATORY)

---

## Workflow Steps

### Step 0a: Select Page Template

**CRITICAL**: When creating new pages, ALWAYS call `marketer_list_available_insertoptions` on parent item.

- Context-specific templates (Article Page, Event Page) only appear under their parent sections
- See `references/page-templates.md` for complete template listings
- Token cost: ~600 tokens (cheaper than recreating page with wrong template)

---

### Step 0b: Component Documentation

**Automatic**: `/sitecore-component-docs` skill runs before every component authoring to fetch component-specific field formats.

---

### Step 1: Identify Component and Target Page

**Required Information:**

- Page ID (from local config or MCP search)
- Component rendering ID (from `/sitecore-component-docs`)
- Target placeholder (e.g., "headless-main")
- Field values to populate (validated via `/sitecore-field-validator`)
- Children (if any)

**Find Page (if not Home):**

```javascript
// Only use MCP if searching for non-Home pages
await marketer_search_site({
	site_name: "main",
	search_query: "PageName",
});
// Returns: { itemId: "page-guid", name: "PageName", path: "/sitecore/..." }
```

**Get Rendering ID (from component docs - NO MCP):**

```bash
# ✓ Read per-component docs via /sitecore-component-docs (~200 tokens)
Glob(pattern: ".claude/skills/sitecore-component-docs/references/**/HeroBanner/HeroBanner.md")
# Extract Rendering ID from the doc's Rendering Information table

# ❌ OLD WAY - Don't do this anymore
# marketer_list_components() # ~13k tokens!
```

---

### Step 2: Determine Placeholder Path

**Use `/sitecore-author-placeholder` skill for path construction.**

Quick reference:

- **Root-level**: `"headless-main"` (NO leading slash)
- **Child components**: `"/headless-main/buttons-1"` (HAS leading slash, requires parent's dynamic ID)

See `/sitecore-author-placeholder` for complete rules and examples.

---

### Step 3: Add Component to Page

```javascript
const result = await marketer_add_component_on_page({
	pageId: "page-guid",
	componentRenderingId: "rendering-guid",
	placeholderPath: placeholderPath,
	componentItemName: "HeroBanner_1", // Must be unique
	fields: {
		// Only simple text fields here
		Heading: "Welcome to Our Site",
		Subheading: "Discover more",
	},
});

// Returns:
// {
//   "datasourceId": "created-datasource-guid",
//   "placeholderId": "headless-main"
// }
```

**IMPORTANT:** The `datasourceId` returned is the content item ID for updating fields.

---

### Step 4: Populate Complex Fields

After adding the component, update fields using specialized skills and direct MCP calls:

#### 4a: Image Fields

Use `/sitecore-author-image` skill for XML formatting: `<image mediaid='{GUID}' />`

- Must use single quotes, braces around GUID, UPPERCASE
- If upload needed, use `/sitecore-upload-media` first

#### 4b: Link Fields

Use `/sitecore-author-link` skill for XML formatting: `<link text='...' linktype='external' url='...' anchor='' target='_blank' />`

- External links need `url`, internal links need `id='{GUID}'`
- All attributes required (text, linktype, url, anchor, target)

#### 4c: Text/RichText Fields

Update directly via `marketer_update_content`:

- Single-line text: Plain strings
- Rich text: HTML strings (e.g., `"<p>Content</p>"`)
- Multi-line: Use `<br />` for line breaks

#### 4d: Checkbox Fields

Update directly via `marketer_update_content`:

- Checked: `"1"`
- Unchecked: `"0"`

---

### Step 5: Handle Child Components

If the component has children (e.g., Button inside HeroBanner):

#### 5a: Get Parent's Dynamic Placeholder ID

```javascript
// Query page to get parent component's dynamic ID
const pageData = await marketer_get_components_on_page({
	pageId: pageId,
});

// Find parent by datasource ID
const parentComponent = pageData.components.find(
	(c) => c.dataSource === parentDatasourceId,
);

// Extract dynamic placeholder ID
const dynamicId = parentComponent?.parameters?.DynamicPlaceholderId || "1";
```

**Shortcut — Cumulative Counting:**
Sitecore assigns a sequential ID to every component added to the page (parents and children alike). When you control the add order, the dynamic ID equals the cumulative count:

| Order | Component               | ID  | Child Placeholder                       |
| :---- | :---------------------- | :-- | :-------------------------------------- |
| 1st   | HeroBanner              | 1   | `/headless-main/buttons-1`              |
| 2nd   | Button (child of Hero)  | 2   | —                                       |
| 3rd   | SplitBanner             | 3   | `/headless-main/buttons-3`              |
| 4th   | Button (child of Split) | 4   | —                                       |
| 5th   | Card                    | 5   | — (CTA maps to Card's own `link` field) |

This avoids an MCP call when you know the add order. Use `marketer_get_components_on_page` when the order is uncertain.

#### 5b: Construct Child Placeholder Path

```javascript
// Format: /{parentPlaceholder}/{childKey}-{dynamicId}
const childPlaceholderPath = `/headless-main/buttons-${dynamicId}`;
// Example: "/headless-main/buttons-1"
```

**Common child placeholder keys:**
| Parent | Child Key | Child Component |
|:-------|:----------|:----------------|
| HeroBanner | `buttons` | Button |
| SplitBanner | `buttons` | Button |
| ContentBlock | `buttons` | Button |
| CardGrid | `cards` | Card |
| Card | `card-actions` | Button |

#### CTA Mapping Rules

| Component Type          | CTA Handling                                                                 |
| :---------------------- | :--------------------------------------------------------------------------- |
| HeroBanner, SplitBanner | Create a separate child `Button` component in the correct button placeholder |
| Card                    | Do NOT create a child Button — map CTA data to the Card's own `link` field   |

#### 5c: Add Child Component (Recursive)

```javascript
// Add child using same workflow (Step 3-4)
await marketer_add_component_on_page({
	pageId: pageId,
	componentRenderingId: buttonRenderingId,
	placeholderPath: "/headless-main/buttons-1", // With leading slash!
	componentItemName: "Button_1_1",
	fields: {
		Link: "<link text='Learn More' linktype='external' url='https://example.com' anchor='' target='_blank' />",
	},
});
```

---

## Field Type Reference

| Field Type       | Skill/Method              | Format                                   |
| :--------------- | :------------------------ | :--------------------------------------- |
| Single-Line Text | `marketer_update_content` | `"Plain text value"`                     |
| Multi-Line Text  | `marketer_update_content` | `"Line 1<br />Line 2"`                   |
| Rich Text        | `marketer_update_content` | `"<p>HTML content</p>"`                  |
| Image            | `/sitecore-author-image`  | `<image mediaid='{GUID}' />`             |
| General Link     | `/sitecore-author-link`   | `<link text='...' linktype='...' ... />` |
| Checkbox         | `marketer_update_content` | `"1"` or `"0"`                           |
| Number           | `marketer_update_content` | `"123"`                                  |
| Date             | `marketer_update_content` | `"20240115T120000Z"`                     |

---

## ⚠️ CRITICAL: Special Character Handling

**See `references/special-characters.md` for complete guide.**

Quick reference:

- **Quotes**: Use `&quot;` or single quotes `'` (NEVER `\"`)
- **Newlines**: Use `<br />` or `<p>` tags (NEVER `\n`)
- **Code blocks**: Use `&#10;` for line breaks (NEVER `\n`)

---

## Field Name Discovery

Use `/sitecore-component-docs` or `/sitecore-field-validator` to verify exact field names (case-sensitive) before authoring.

---

## Error Handling

| Error                 | Cause                    | Solution                                    |
| :-------------------- | :----------------------- | :------------------------------------------ |
| "Item already exists" | Duplicate component name | Use unique suffix: `HeroBanner_2`           |
| Component not visible | Wrong placeholder path   | Check leading slash rules                   |
| "Cannot find field"   | Wrong field name         | Check component docs for exact name         |
| Child not placed      | Missing dynamic ID       | Query parent's DynamicPlaceholderId first   |
| Image not showing     | Wrong XML format         | Use single quotes, braces around GUID       |
| Link not working      | Missing attributes       | Include all: text, linktype, anchor, target |
| `updatedFields: {}`   | Normal behavior          | Update actually succeeded                   |

---

## Usage Example

```
/sitecore-author
Add HeroBanner with Button to /Home page
- Heading: "Welcome"
- BackgroundImage: {media-id}
- Button CTA: "Learn More" → https://example.com
```

**Workflow**:

1. Read component docs for rendering IDs
2. Add HeroBanner to "headless-main"
3. Update image field via /sitecore-author-image
4. Get parent's dynamic ID
5. Add Button to "/headless-main/buttons-1"
6. Get preview URL (MANDATORY)

---

## Related Skills

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-article-page` | **Article/blog post authoring** (use instead of this skill for articles) |
| `/sitecore-author-tags` | Tag management (name → ID mapping) |
| `/sitecore-author-profiles` | Profile management (name → ID mapping) |
| `/sitecore-component-docs` | Component-specific field formats and MCP authoring instructions |
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-author-image` | Image field XML formatting |
| `/sitecore-author-link` | Link field XML formatting |
| `/sitecore-upload-media` | Upload images to Media Library |

---

---

## Step 6: Get Preview URL (MANDATORY - NO EXCEPTIONS)

**ALWAYS call `marketer_get_page_preview_url` after ANY Sitecore authoring operation.**

```javascript
// ⚠️ REQUIRED STEP - Do not skip this!
const previewUrl = await marketer_get_page_preview_url({
	pageId: pageId,
	language: "en",
});
```

**This is NOT optional:**

- ✅ ALWAYS include after adding any component
- ✅ ALWAYS include after updating fields
- ✅ ALWAYS include in every final response
- ❌ NEVER ask "Want to see the preview URL?"
- ❌ NEVER say "Let me grab the preview URL"
- ❌ NEVER skip this step

**Required response format (preview URL is mandatory):**

```
Done! Added [ComponentName] to [PageName]:
• Field1: value
• Field2: value

Preview: https://xmc-main-abcd1234.sitecorecloud.io/en?sc_itemid={PAGE_ID}
```

**If you forget the preview URL, you've failed the task.**
