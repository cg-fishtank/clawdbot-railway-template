---
name: sitecore-author-image
description: Author image fields on SitecoreAI content items with proper XML formatting. Search for media assets, retrieve asset metadata, format image XML with correct GUID syntax, and update image fields via marketer-mcp. Use when updating image fields on existing components or when an image needs to be found in the Media Library before assignment.
allowed-tools:
  - mcp__marketer-mcp__search_assets
  - mcp__marketer-mcp__get_asset_information
  - mcp__marketer-mcp__update_content
  - mcp__marketer-mcp__update_fields_on_content_item
---

# Sitecore Image Field Author

**Find media assets and update image fields on SitecoreAI content items with correctly formatted XML via marketer-mcp.**

---

## Capabilities

1. **Search for media assets** — Find images in the Sitecore Media Library by name or keyword
2. **Get asset metadata** — Retrieve asset GUID, dimensions, alt text, and path from the Media Library
3. **Format image XML** — Build properly formatted Sitecore image XML values with correct GUID syntax
4. **Update image fields** — Write image XML to any image field on a content item or component datasource

---

## When to Use This Skill

Use this skill when:
- Updating image fields on existing Sitecore components (hero images, background images, card images, etc.)
- You need to find an image in the Media Library before assigning it to a field
- You have a Media ID (GUID) and need to format it as Sitecore image XML
- A component has an empty image field that needs to be populated
- You need to swap one image for another on a component

**Do NOT use this skill when:**
- You need to upload a new image to the Media Library (use `sitecore-content-author` with `upload_asset` instead)
- You need to create pages or add components (use `sitecore-content-author`)
- You only need to read/inspect image field values (use `sitecore-content-reader`)

---

## Workflow Overview

```
1. Search Assets    → search_assets (find image by name/keyword)
2. Get Asset Info   → get_asset_information (get GUID and metadata)
3. Format XML       → Build image XML with GUID (local — no MCP call)
4. Update Field     → update_content or update_fields_on_content_item (write to item)
```

---

## Step 1: Search for Media Assets

Use `mcp__marketer-mcp__search_assets` to find images in the Media Library:

```
mcp__marketer-mcp__search_assets({
  search_query: "hospitality banner"
})
```

**Response includes matching assets:**
```json
{
  "assets": [
    {
      "id": "cfd9e144-f974-4aa8-a552-cbf55e67e628",
      "name": "hospitality-banner",
      "path": "/sitecore/media library/Project/main/Images/hospitality-banner"
    }
  ]
}
```

**Tips for searching:**
- Use descriptive keywords: `"hero background"`, `"logo dark"`, `"team photo"`
- Search by file name: `"banner-desktop"`
- Search by folder path if known: `"Project/main/Images"`

---

## Step 2: Get Asset Information

Use `mcp__marketer-mcp__get_asset_information` to retrieve full metadata for a specific asset:

```
mcp__marketer-mcp__get_asset_information({
  asset_id: "cfd9e144-f974-4aa8-a552-cbf55e67e628"
})
```

**Response includes:**
```json
{
  "id": "cfd9e144-f974-4aa8-a552-cbf55e67e628",
  "name": "hospitality-banner",
  "path": "/sitecore/media library/Project/main/Images/hospitality-banner",
  "dimensions": { "width": 1920, "height": 1080 },
  "alt": "Hospitality venue exterior"
}
```

The `id` field is the GUID you need for the image XML.

---

## Step 3: Format Image XML

Build the image XML string locally — no MCP call needed.

**Template:**
```xml
<image mediaid='{GUID}' />
```

**Example with the asset from Step 2:**
```xml
<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />
```

See **CRITICAL: Image XML Format Rules** below for exact formatting requirements.

---

## Step 4: Update the Image Field

Use `mcp__marketer-mcp__update_content` to write the image XML to the target item:

```
mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: "a788f16f-d42e-4689-9975-f9a5bdde6757",
  fields: {
    "BackgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
  }
})
```

**Important:** The `itemId` is the **datasource ID** of the component, not the page ID. To find it:
1. Use `mcp__marketer-mcp__get_components_on_page` (from `sitecore-content-reader` skill) to list components
2. The `dataSource` field on each component is the item ID to use

**Note:** A response with `updatedFields: {}` is **normal and expected** — the update actually succeeded. This is standard Sitecore API behavior.

Alternatively, use `mcp__marketer-mcp__update_fields_on_content_item` if you need to update fields by content item path rather than ID.

---

## CRITICAL: Image XML Format Rules

Sitecore image fields require a specific XML format. Getting any detail wrong will cause the image to not render.

### The Format

```xml
<image mediaid='{GUID}' />
```

### Requirements

| Requirement | Details |
|:------------|:--------|
| **Tag** | Must be `<image ... />` (self-closing with space before `/>`) |
| **Attribute** | Must be `mediaid` (lowercase) |
| **Quotes** | MUST use **single quotes** for attribute values |
| **Braces** | MUST include curly braces `{}` around the GUID |
| **Case** | GUIDs MUST be **UPPERCASE** |
| **Self-closing** | Must have a space before `/>` |

### Correct vs Wrong Examples

```xml
CORRECT:   <image mediaid='{FB70BF8B-1254-4326-8FB7-C136E49E68C8}' />

WRONG:     <image mediaid="{FB70BF8B-1254-4326-8FB7-C136E49E68C8}" />
           ^^^ Double quotes — causes JSON escaping issues

WRONG:     <image mediaid='FB70BF8B-1254-4326-8FB7-C136E49E68C8' />
           ^^^ Missing curly braces around GUID

WRONG:     <image mediaid='{fb70bf8b-1254-4326-8fb7-c136e49e68c8}' />
           ^^^ Lowercase GUID — Sitecore may not resolve it

WRONG:     <image mediaid='{FB70BF8B-1254-4326-8FB7-C136E49E68C8}'/>
           ^^^ Missing space before /> (may cause parsing issues)
```

### Why Single Quotes Matter

The image XML is passed as a JSON string value to the API. Double quotes inside the XML would conflict with JSON string delimiters, causing parsing failures or escaped characters in the stored value. **Always use single quotes** for XML attributes in Sitecore field values.

---

## Multiple Image Fields

Many components have more than one image field (e.g., desktop and mobile variants). Update them in a single `update_content` call:

```
mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: "a788f16f-d42e-4689-9975-f9a5bdde6757",
  fields: {
    "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "backgroundImageMobile": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
  }
})
```

**Common image field names** (check `references/component-registry.md` for exact names per component):
- `backgroundImage` / `backgroundImageMobile`
- `image` / `imageMobile`
- `logo`
- `icon`
- `thumbnail`

**Field names are case-sensitive.** Always verify exact field names from the component registry.

---

## Complete Example: Update HeroBanner Background Image

```
// STEP 1: Search for the image in Media Library
mcp__marketer-mcp__search_assets({
  search_query: "hospitality banner"
})
// -> Returns asset with id: "cfd9e144-f974-4aa8-a552-cbf55e67e628"

// STEP 2: Get full asset info (optional — if you need dimensions/alt text)
mcp__marketer-mcp__get_asset_information({
  asset_id: "cfd9e144-f974-4aa8-a552-cbf55e67e628"
})
// -> Confirms GUID and metadata

// STEP 3: Format the image XML (local — no MCP call)
// Result: <image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />

// STEP 4: Update the component's image field
// (datasource ID obtained from get_components_on_page via sitecore-content-reader)
mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: "a788f16f-d42e-4689-9975-f9a5bdde6757",
  fields: {
    "BackgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
  }
})
// -> updatedFields: {} means SUCCESS
```

---

## Shortcut: When You Already Have the Media ID

If the user provides a GUID directly, skip Steps 1-2:

1. Uppercase the GUID if needed
2. Format: `<image mediaid='{UPPERCASED-GUID}' />`
3. Call `update_content` with the formatted XML

---

## Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| `AUTH_NOT_AUTHENTICATED` | Token expired | Re-authenticate with Sitecore Cloud CLI and update credentials |
| "Cannot find a field with name X" | Wrong field name (case-sensitive) | Check `references/component-registry.md` for exact field name |
| JSON parsing error | Double quotes in XML | Switch to single quotes: `mediaid='{GUID}'` |
| Image not rendering on page | Missing braces around GUID | Ensure format is `'{GUID}'` not `'GUID'` |
| Image not rendering on page | Lowercase GUID | Uppercase all hex characters in the GUID |
| `updatedFields: {}` in response | Normal API behavior | Update succeeded — verify via `get_content_item_by_id` if needed |
| No search results | Wrong search terms | Try different keywords, partial file names, or browse by path |
| Asset ID not found | Invalid or deleted asset | Re-search for the asset; it may have been moved or renamed |

---

## Guidelines

- **Always confirm the asset exists** before formatting XML — search or get info first
- **Always use single quotes** in image XML to prevent JSON escaping issues
- **Always uppercase GUIDs** in the mediaid attribute
- **Always verify field names** from the component registry (case-sensitive)
- **Describe the update before executing** — tell the user which component and field you are updating
- **Verify after updating** — use `get_content_item_by_id` (from `sitecore-content-reader`) to confirm the field value was written correctly
- If the user needs to **upload a new image** to the Media Library first, direct them to use the `sitecore-content-author` skill with `upload_asset` before returning to this workflow
- All changes are **drafts** — publishing requires separate approval via `sitecore-content-publisher`
