---
name: sitecore-author-image
description: Executes MCP API calls to author image fields in Sitecore XM Cloud with proper XML formatting
---

# Image Authoring Agent

**Version:** 1.1

## What I do
- Find pages and components in Sitecore using MCP
- Upload images to Media Library (via `/sitecore-upload-media` skill)
- Update image fields on Sitecore content items
- Build properly formatted Sitecore image XML values

## When to use
Use this skill when:
- Updating image fields on existing Sitecore components
- Changing a component's background image, hero image, etc.
- You have an image URL or local file to use

## Workflow Overview

```
1. Find Page → marketer_search_site
2. Get Components → marketer_get_components_on_page
3. Upload Image → /sitecore-upload-media (if needed)
4. Update Field → marketer_update_content
```

---

## Step 1: Find the Page

Use `marketer_search_site` to find the page:

```javascript
await marketer_search_site({
  site_name: "main",
  search_query: "Hospitality-01-28"
});
```

**Response includes:**
```json
{
  "itemId": "1cf58fee-32e4-45e6-ac86-905883f3b2b6",
  "name": "Hospitality-01-28",
  "path": "/sitecore/content/Sites/main/Home/Landrysv2/Hospitality-01-28"
}
```

---

## Step 2: Get Components on Page

Use `marketer_get_components_on_page` to find the component and its datasource:

```javascript
await marketer_get_components_on_page({
  site_name: "main",
  page_id: "1cf58fee-32e4-45e6-ac86-905883f3b2b6"
});
```

**Response includes components with datasource IDs:**
```json
{
  "componentName": "HeroBanner",
  "dataSource": "a788f16f-d42e-4689-9975-f9a5bdde6757",
  "placeholder": "headless-main"
}
```

The `dataSource` is the item ID you'll update.

---

## Step 3: Upload Image (if needed)

If the image doesn't exist in Media Library, use the `/sitecore-upload-media` skill:

```
/sitecore-upload-media
Image: https://www.example.com/image.jpg
Target: Project/main/Images/folder/imagename
```

This returns a **Media ID** like `cfd9e144-f974-4aa8-a552-cbf55e67e628`.

---

## Step 4: Update the Image Field

Use `marketer_update_content` with properly formatted image XML:

```javascript
await marketer_update_content({
  siteName: "main",
  itemId: "a788f16f-d42e-4689-9975-f9a5bdde6757",
  fields: {
    "BackgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
  }
});
```

**Note:** Response may show `updatedFields: {}` even on success. This is expected.

---

## CRITICAL: Image Field Format

Sitecore Image fields use XML format with a `mediaid` attribute:

```xml
<image mediaid='{FB70BF8B-1254-4326-8FB7-C136E49E68C8}' />
```

### Format Requirements

| Requirement | Details |
|:------------|:--------|
| **Format** | `<image mediaid='{GUID}' />` |
| **Quotes** | MUST use **single quotes** for attributes |
| **Braces** | MUST include curly braces around the GUID |
| **Case** | GUIDs should be UPPERCASE |

### Correct vs Wrong

```xml
CORRECT:   <image mediaid='{FB70BF8B-1254-4326-8FB7-C136E49E68C8}' />
WRONG:     <image mediaid="{FB70BF8B-...}" />   (double quotes)
WRONG:     <image mediaid='FB70BF8B-...' />     (no braces)
WRONG:     <image mediaid='{fb70bf8b-...}' />   (lowercase)
```

---

## Common Errors

| Error | Cause | Solution |
|:------|:------|:---------|
| `AUTH_NOT_AUTHENTICATED` | Token expired | Run `dotnet sitecore cloud login` and update `.env` |
| "Cannot find a field with name X" | Wrong field name | Check component template for exact field name |
| JSON escaping issues | Double quotes in XML | Use single quotes: `mediaid='{GUID}'` |
| `updatedFields: {}` | Normal behavior | Update actually succeeded |

---

## Usage Examples

```
/sitecore-author-image
Change the HeroBanner background image on /Landrysv2/Hospitality-01-28
to https://www.landrysinc.com/-/media/images/hospitalitybanner.jpg

/sitecore-author-image
Update the first ContentBlock's Image field on /Home/About
with media ID CFD9E144-F974-4AA8-A552-CBF55E67E628
```

---

## Key Rules

1. **Always use single quotes** in XML to prevent JSON escaping issues
2. **Always include braces** around the GUID in mediaid attribute
3. **Always uppercase** the GUID
4. **Use `/sitecore-upload-media`** if image needs to be uploaded first
5. **Find datasource via MCP** - don't assume IDs
