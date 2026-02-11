---
name: sitecore-author-link
description: Authors link fields on Sitecore XM Cloud components via marketer-mcp. Handles internal links, external links, media links, and anchor links using Sitecore's XML link format. Checks existing values before overwriting.
allowed-tools:
  - mcp__marketer-mcp__update_content
  - mcp__marketer-mcp__update_fields_on_content_item
  - mcp__marketer-mcp__get_content_item_by_id
  - mcp__marketer-mcp__get_content_item_by_path
  - mcp__marketer-mcp__get_page
  - mcp__marketer-mcp__search_site
  - mcp__marketer-mcp__get_components_on_page
---

# Sitecore Link Authoring

**Authors link fields on Sitecore XM Cloud components via marketer-mcp.**

Supports all four Sitecore link types: internal, external, media, and anchor.

---

## Capabilities

1. **Find pages and components** -- Locate pages by name/path and list their components
2. **Identify link fields** -- Detect link-type fields on components via the component registry
3. **Check existing values** -- Read current link field values before making changes
4. **Update link fields** -- Write properly formatted Sitecore link XML to any link field
5. **Handle all link types** -- Internal, external, media, and anchor links
6. **Batch update** -- Update multiple link fields on a single component in one call

---

## Workflow Overview

```
1. Find Page        --> mcp__marketer-mcp__search_site
2. Get Components   --> mcp__marketer-mcp__get_components_on_page
3. Identify Fields  --> Check references/component-registry.md
3.5. Check Existing --> mcp__marketer-mcp__get_content_item_by_id + confirm override
4. Gather Details   --> Ask user for link information
5. Update Fields    --> mcp__marketer-mcp__update_content
```

---

## Step 1: Find the Page

Use `mcp__marketer-mcp__search_site` to find the page containing the component:

```
mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Hospitality-01-28"
})
```

**Response includes:**
```json
{
  "itemId": "1cf58fee-32e4-45e6-ac86-905883f3b2b6",
  "name": "Hospitality-01-28",
  "path": "/sitecore/content/Sites/main/Home/Landrysv2/Hospitality-01-28"
}
```

**User Input Required:**
Ask the user: "What page contains the component you want to update?"
- Accept page name (e.g., "Hospitality-01-28")
- Accept partial path (e.g., "Landrysv2/Hospitality")
- Accept full path

---

## Step 2: Get Components on Page

Use `mcp__marketer-mcp__get_components_on_page` to list all components and their datasources:

```
mcp__marketer-mcp__get_components_on_page({
  site_name: "main",
  page_id: "1cf58fee-32e4-45e6-ac86-905883f3b2b6"
})
```

**Response includes components with datasource IDs:**
```json
{
  "components": [
    {
      "componentName": "HeroBanner",
      "dataSource": "a788f16f-d42e-4689-9975-f9a5bdde6757",
      "placeholder": "headless-main"
    },
    {
      "componentName": "Button",
      "dataSource": "b899c27g-e53f-522c-c086-g8a6ceee7868",
      "placeholder": "/headless-main/buttons-1"
    }
  ]
}
```

**Present to User:**
Display a numbered list of components:
```
Components on this page:
1. HeroBanner (headless-main)
2. Button (/headless-main/buttons-1)
3. ContentBlock (headless-main)
```

**User Input Required:**
Ask: "Which component do you want to update?" (accept number or name)

The `dataSource` is the item ID you will update.

---

## Step 3: Identify Link Fields

Load the component registry to identify link fields on the selected component.

**Registry Location:** `references/component-registry.md`

Look for fields with type `LinkField` or `Field<Link>` or names that contain "link" (case-insensitive).

**Single Link Field:**
If the component has only one link field, proceed to check existing values.

**Multiple Link Fields:**
If the component has multiple link fields (e.g., `PrimaryLink`, `SecondaryLink`):
1. List all link fields by name
2. Ask user: "Which link field(s) do you want to update?"
   - Options: "All" or specific field names

---

## Step 3.5: Check Existing Values and Confirm Override

**CRITICAL:** Before updating, check if the link field(s) already have values.

Use `mcp__marketer-mcp__get_content_item_by_id` to read current field values:

```
mcp__marketer-mcp__get_content_item_by_id({
  siteName: "main",
  itemId: "a788f16f-d42e-4689-9975-f9a5bdde6757"
})
```

**Response includes current field values:**
```json
{
  "itemId": "a788f16f-d42e-4689-9975-f9a5bdde6757",
  "fields": {
    "Link": "<link text='Existing Link' linktype='external' url='https://old-url.com' anchor='' target='_blank' />",
    "Heading": "Welcome"
  }
}
```

**Parse and Display Existing Links:**

If a link field has a value, extract and present it to the user:

```
The 'Link' field currently has:
- Text: "Existing Link"
- URL: "https://old-url.com"
- Type: external
- Target: _blank
```

**User Confirmation Required:**

For each link field with an existing value:

1. Display the current value (as shown above)
2. Ask: "Do you want to override this existing link? (yes/no)"
3. Handle response:
   - **Yes** -- Proceed to gather new link details
   - **No** -- Skip this field, move to next field (if any)

**Multiple Fields with Values:**
If updating multiple fields and some have existing values:
- Check each field individually
- Ask for confirmation for each field that has a value
- Only gather new details for fields the user confirms

---

## Step 4: Gather New Link Details

**User Input Required for Each Link Field:**

1. **Link Text:** "What text should the link display?"
   - Example: "View Menu", "Learn More", "Contact Us"

2. **Link URL/Path:** "What is the link URL or path?"
   - External: `https://example.com/page`
   - Internal: `/about` or a Sitecore item ID
   - Media: Sitecore media library path or ID
   - Anchor: `#section-name`

3. **Link Type:** "What type of link is this?"
   - Auto-detect from URL when possible (see Link Type Detection below)
   - Options: `internal`, `external`, `media`, `anchor`

4. **Target:** "Should this open in a new tab?"
   - Yes --> `_blank`
   - No --> `_self` or empty string

5. **Anchor (Optional):** "Any anchor/hash to add?" (usually empty unless linktype is anchor)

---

## Step 5: Update Link Fields

Use `mcp__marketer-mcp__update_content` with properly formatted link XML:

```
mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: "a788f16f-d42e-4689-9975-f9a5bdde6757",
  fields: {
    "Link": "<link text='View Menu' linktype='external' url='https://example.com/menu' anchor='' target='_blank' />"
  }
})
```

**Multiple Fields Example:**
```
mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: "a788f16f-d42e-4689-9975-f9a5bdde6757",
  fields: {
    "PrimaryLink": "<link text='Learn More' linktype='internal' url='/about' anchor='' target='_self' />",
    "SecondaryLink": "<link text='Contact' linktype='external' url='https://example.com/contact' anchor='' target='_blank' />"
  }
})
```

**Note:** Response may show `updatedFields: {}` even on success. This is expected behavior from the API.

---

## CRITICAL: Link Field XML Format

Sitecore link fields use a specific XML format. **All four link types** share the same base structure with variations in attributes.

### Base Format
```xml
<link text='...' linktype='...' url='...' anchor='' target='...' />
```

### 1. External Link (`linktype='external'`)

For links to URLs outside of Sitecore.

```xml
<link text='Visit Website' linktype='external' url='https://example.com/' anchor='' target='_blank' />
```

- `url` must include the full URL with protocol (`https://`)
- `target` is typically `_blank` for external links

### 2. Internal Link (`linktype='internal'`)

For links to other Sitecore pages/items.

**With Path:**
```xml
<link text='About Us' linktype='internal' url='/about' anchor='' target='_self' />
```

**With Sitecore Item ID:**
```xml
<link text='About Us' linktype='internal' url='' anchor='' target='' id='{B1BBF454-6060-4596-9D2C-0EA4AA414A9D}' />
```

- When using `id`, the `url` attribute should be an empty string
- GUID must be UPPERCASE
- GUID must be wrapped in braces: `'{GUID}'`

### 3. Media Link (`linktype='media'`)

For links to files in the Sitecore Media Library (PDFs, documents, downloads).

```xml
<link text='Download Brochure' linktype='media' url='' anchor='' target='_blank' id='{A3C2E789-1234-5678-9ABC-DEF012345678}' />
```

- Typically uses the `id` attribute pointing to a media library item
- `target` is usually `_blank` so the file opens in a new tab
- `url` is empty when using `id`

**With media path:**
```xml
<link text='Download PDF' linktype='media' url='/sitecore/media library/Files/brochure.pdf' anchor='' target='_blank' />
```

### 4. Anchor Link (`linktype='anchor'`)

For links to anchors/sections on the same page.

```xml
<link text='Jump to Section' linktype='anchor' url='' anchor='section-name' target='' />
```

- `url` is typically empty
- `anchor` contains the anchor name (without the `#` prefix)
- `target` is usually empty (same page navigation)

---

## Format Requirements

| Requirement | Details |
|:------------|:--------|
| **Quotes** | MUST use **single quotes** for all attributes |
| **Link Type** | Must be one of: `'internal'`, `'external'`, `'media'`, `'anchor'` |
| **External Links** | Must include `url` with full URL including `https://` |
| **Internal Links** | Can use `url='/path'` OR `id='{GUID}'` |
| **Media Links** | Typically use `id='{GUID}'` pointing to a media library item |
| **Anchor Links** | Use `anchor='name'` with empty `url` |
| **Required Attributes** | `text`, `linktype`, `anchor`, `target` always present |
| **GUID Format** | If using ID, MUST include braces: `'{GUID}'` and UPPERCASE |
| **Empty Attributes** | Use empty strings (`''`), never omit attributes |

---

## Correct vs Wrong

```xml
CORRECT (external):
<link text='View Menu' linktype='external' url='https://example.com/menu' anchor='' target='_blank' />

WRONG (double quotes):
<link text="View Menu" linktype="external" url="https://example.com/menu" anchor="" target="_blank" />

CORRECT (internal with path):
<link text='About' linktype='internal' url='/about' anchor='' target='_self' />

CORRECT (internal with ID):
<link text='About' linktype='internal' url='' anchor='' target='' id='{B1BBF454-6060-4596-9D2C-0EA4AA414A9D}' />

WRONG (missing braces in GUID):
<link text='About' linktype='internal' id='B1BBF454-6060-4596-9D2C-0EA4AA414A9D' />

WRONG (missing required attributes):
<link text='About' linktype='internal' id='{B1BBF454-6060-4596-9D2C-0EA4AA414A9D}' />

CORRECT (media link):
<link text='Download' linktype='media' url='' anchor='' target='_blank' id='{A3C2E789-1234-5678-9ABC-DEF012345678}' />

CORRECT (anchor link):
<link text='Jump to FAQ' linktype='anchor' url='' anchor='faq-section' target='' />

WRONG (anchor with # prefix):
<link text='Jump to FAQ' linktype='anchor' url='' anchor='#faq-section' target='' />
```

---

## Link Type Detection

Use this logic to auto-detect link type from user input:

| User Input Pattern | Detected Type |
|:-------------------|:--------------|
| Starts with `http://` or `https://` | `external` |
| Starts with `/` (path) | `internal` |
| Matches GUID pattern (`{...}` or `xxxxxxxx-xxxx-...`) | `internal` (with `id` attribute) |
| Starts with `#` or user says "anchor" | `anchor` (strip `#` for the `anchor` attribute) |
| References a media item, PDF, document, or download | `media` |
| Ambiguous | Ask the user to clarify |

---

## Common Errors

| Error | Cause | Solution |
|:------|:------|:---------|
| `AUTH_NOT_AUTHENTICATED` | Token expired | Run `dotnet sitecore cloud login` and update `.env` |
| "Cannot find a field with name X" | Wrong field name | Check component registry for exact field name (case-sensitive) |
| JSON escaping issues | Double quotes in XML | Use single quotes: `text='...'` not `text="..."` |
| `updatedFields: {}` | Normal behavior | Update actually succeeded -- this is expected |
| "Invalid link format" | Missing required attributes | Ensure all attributes present: `text`, `linktype`, `anchor`, `target` |
| "Cannot read item" | Invalid datasource ID | Verify component has a datasource (not shared) |

---

## Usage Examples

### Example 1: Simple External Link
```
Update the Button component on /Hospitality/Dining page
Field: Link
Text: "View Full Menu"
URL: "https://example.com/menu"
Type: external
Target: _blank
```

### Example 2: Internal Link with Path
```
Update the HeroBanner link on /Home page
Field: Link
Text: "Learn More"
URL: "/about-us"
Type: internal
Target: _self
```

### Example 3: Internal Link with Sitecore Item ID
```
Update the ContentBlock link on /Services page
Field: Link
Text: "About Us"
ID: "{B1BBF454-6060-4596-9D2C-0EA4AA414A9D}"
Type: internal
```

### Example 4: Media Link (Document Download)
```
Update the ResourceCard on /Resources page
Field: DownloadLink
Text: "Download Brochure"
ID: "{A3C2E789-1234-5678-9ABC-DEF012345678}"
Type: media
Target: _blank
```

### Example 5: Anchor Link (Same-Page Navigation)
```
Update the NavItem on /Landing page
Field: Link
Text: "Jump to FAQ"
Anchor: "faq-section"
Type: anchor
```

### Example 6: Multiple Link Fields on One Component
```
Update the ContentBlock on /Services page
Component has 2 link fields:
- PrimaryLink: "Get Started" --> https://example.com/signup (external, _blank)
- SecondaryLink: "Learn More" --> /about (internal, _self)
```

---

## Advanced: Internal Links with Sitecore Item IDs

If the user wants to link to a specific Sitecore item by ID:

**Step 1:** Get the target item ID (if user does not provide it):
```
mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "About Us"
})
// Returns: { itemId: "b1bbf454-6060-4596-9d2c-0ea4aa414a9d" }
```

**Step 2:** Format the link XML with ID:
```xml
<link text='About Us' linktype='internal' url='' anchor='' target='' id='{B1BBF454-6060-4596-9D2C-0EA4AA414A9D}' />
```

**Important:**
- GUID must be UPPERCASE in the link XML
- GUID must be wrapped in braces: `'{GUID}'`
- `url` attribute should be empty string when using `id`

---

## Key Rules

1. **Always check existing values first** -- use `mcp__marketer-mcp__get_content_item_by_id` before updating
2. **Always ask for override confirmation** if a field already has a value
3. **Always use single quotes** in XML to prevent JSON escaping issues
4. **Always include all required attributes**: `text`, `linktype`, `anchor`, `target`
5. **Use empty strings for unused attributes**: `anchor=''` not omitting it
6. **External links need full URLs** including `https://`
7. **Internal links can use paths** (`/about`) or IDs (`{GUID}`)
8. **Media links typically use IDs** pointing to media library items
9. **Anchor links use the `anchor` attribute** without the `#` prefix
10. **GUIDs must have braces** and be UPPERCASE when used in link XML
11. **Find datasource via MCP** -- never assume IDs
12. **Check component registry** (`references/component-registry.md`) for exact field names
13. **Support multiple link fields** in a single `mcp__marketer-mcp__update_content` call

---

## Workflow Summary

```
+-------------------------------------------------------------+
| LINK AUTHORING WORKFLOW                                     |
+-------------------------------------------------------------+
|                                                             |
|  1. ASK: "What page has the component?"                    |
|     |                                                       |
|  2. CALL: mcp__marketer-mcp__search_site(page_name)        |
|     |                                                       |
|  3. CALL: mcp__marketer-mcp__get_components_on_page(id)    |
|     |                                                       |
|  4. SHOW: List of components with indices                  |
|     |                                                       |
|  5. ASK: "Which component to update?"                      |
|     |                                                       |
|  6. READ: Component registry for link fields               |
|     |                                                       |
|  7. IF multiple link fields:                               |
|     +-- SHOW: List of link field names                     |
|     +-- ASK: "Which fields to update?"                     |
|     |                                                       |
|  8. CALL: mcp__marketer-mcp__get_content_item_by_id(id)    |
|     |                                                       |
|  9. FOR EACH selected link field:                          |
|     +-- CHECK: Does field have existing value?             |
|     +-- IF yes:                                            |
|     |   +-- SHOW: Current link details                     |
|     |   +-- ASK: "Override existing link? (yes/no)"        |
|     |   +-- IF no: Skip this field                         |
|     +-- IF yes to override OR field is empty:              |
|         +-- ASK: "Link text?"                              |
|         +-- ASK: "Link URL/path/anchor?"                   |
|         +-- AUTO-DETECT or ASK: Link type                  |
|         +-- ASK: "Open in new tab?"                        |
|     |                                                       |
| 10. BUILD: Link XML with single quotes                     |
|     |                                                       |
| 11. CALL: mcp__marketer-mcp__update_content(id, fields)    |
|     |                                                       |
| 12. CONFIRM: "Link field(s) updated successfully"          |
|                                                             |
+-------------------------------------------------------------+
```

---

## Integration Notes

This skill works alongside:
- `sitecore-content-author` -- For creating pages and adding components
- `sitecore-content-reader` -- For inspecting existing content (read-only)
- `sitecore-content-publisher` -- For publishing content changes

All skills use the same marketer-mcp tools and site configuration.
