---
name: sitecore-upload-media
description: Upload and manage media assets in Sitecore XM Cloud via marketer-mcp. Upload images, search for existing assets before duplicating, update metadata (alt text, description, tags), and retrieve asset details. Use when the user wants to add new media to the Media Library or manage existing assets.
allowed-tools:
  - mcp__marketer-mcp__upload_asset
  - mcp__marketer-mcp__search_assets
  - mcp__marketer-mcp__get_asset_information
  - mcp__marketer-mcp__update_asset
---

# Sitecore Media Uploader

**Upload and manage media assets in Sitecore XM Cloud via marketer-mcp. Supports uploading new assets, searching existing assets, updating metadata, and retrieving asset details.**

---

## Capabilities

1. **Upload media assets** -- Upload images and files to the Sitecore Media Library using `upload_asset`
2. **Search before upload** -- Check if an asset already exists to avoid duplicates using `search_assets`
3. **Inspect asset details** -- Retrieve full metadata for any asset by ID using `get_asset_information`
4. **Update asset metadata** -- Set alt text, description, and tags on uploaded assets using `update_asset`

---

## When to Use

Use this skill when:
- Uploading new images or media files to Sitecore Media Library
- Migrating media assets to XM Cloud
- Preparing images for use in components (e.g., HeroBanner backgroundImage, Card image fields)
- Checking if an asset already exists before uploading a duplicate
- Updating alt text, descriptions, or tags on existing media assets
- Looking up an asset's ID to use in image XML fields (`<image mediaid='{GUID}' />`)

---

## Workflow: Upload a Media Asset

### Step 1: Search Before Upload (Prevent Duplicates)

**Always search first.** Before uploading, check if the asset (or a similar one) already exists in the Media Library.

```
mcp__marketer-mcp__search_assets({
  query: "hero-banner",
  type: "image"
})
```

**Decision logic:**
- If a matching asset is found: show the user the existing asset details and ask whether to use the existing one or upload a new version
- If no match: proceed with upload

**Present search results:**
```
Found existing assets matching "hero-banner":

1. hero-banner-desktop.jpg
   - ID: {CFD9E144-F974-4AA8-A552-CBF55E67E628}
   - Path: /sitecore/media library/Project/main/Images/hero-banner-desktop
   - Dimensions: 1920x1080

Use existing asset or upload new? (existing/new)
```

### Step 2: Collect Upload Inputs

Before uploading, gather from the user:

| Input | Description | Required | Example |
|:------|:------------|:---------|:--------|
| **Image source** | Local file path or external URL | Yes | `/path/to/hero.jpg` or `https://example.com/hero.jpg` |
| **Asset name** | Name for the asset in Media Library | Yes | `hero-banner-desktop` |
| **Alt text** | Accessibility text for the image | Recommended | `"Aerial view of convention center"` |
| **Description** | Longer description of the asset | Optional | `"Main hero banner for the home page"` |
| **Tags** | Categorization tags | Optional | `["hero", "banner", "homepage"]` |

**CRITICAL: Image source restrictions**
- **Accepted:** Local file paths (`/Users/john/images/hero.jpg`, `C:\images\hero.jpg`)
- **Accepted:** External URLs (`https://example.com/hero.jpg`)
- **NOT accepted:** Pasted/embedded images -- binary data cannot be written to disk correctly

If the user pastes an image directly:
> "I cannot process pasted images directly. Please provide the local file path where the image is saved, or a URL I can download it from."

### Step 3: Upload the Asset

```
mcp__marketer-mcp__upload_asset({
  filePath: "/path/to/hero.jpg",
  name: "hero-banner-desktop",
  itemPath: "/sitecore/media library/Project/main/Images",
  language: "en",
  extension: "jpg",
  siteName: "main"
})
```

**All 6 parameters are REQUIRED:**
- `filePath`: Local file path or URL to the image
- `name`: Asset name in Media Library
- `itemPath`: Media Library folder path (e.g., `/sitecore/media library/Project/main/Images`)
- `language`: Language code (e.g., `"en"`)
- `extension`: File extension without dot (e.g., `"jpg"`, `"png"`, `"webp"`)
- `siteName`: Site name (e.g., `"main"`)

**Capture the response** -- the returned asset ID is needed for:
- Updating metadata (Step 4)
- Constructing image XML for component fields

### Step 4: Update Metadata

After a successful upload, immediately update the asset's metadata (alt text, description, tags) using `update_asset`:

```
mcp__marketer-mcp__update_asset({
  asset_id: "<returned-asset-id>",
  fields: {
    "Description": "Main hero banner image for the home page, 1920x1080px"
  },
  language: "en",
  altText: "Aerial view of convention center at sunset"
})
```

**Required parameters:**
- `asset_id`: The asset GUID from the upload response
- `fields`: Object with field name/value pairs (e.g., `Description`, custom metadata fields)
- `language`: Language code (e.g., `"en"`)

**Optional parameters:**
- `altText`: Alt text for the asset (accessibility)
- `name`: Rename the asset

**Why update separately?** The `upload_asset` tool handles the file upload. Metadata (alt text, description) is applied via `update_asset` after the upload completes.

### Step 5: Verify the Upload

After uploading and updating metadata, confirm the asset by retrieving its details:

```
mcp__marketer-mcp__get_asset_information({
  asset_id: "<returned-asset-id>"
})
```

Verify:
- Asset name is correct
- File was uploaded successfully (non-zero file size)
- Alt text and description are populated
- Tags are applied

### Step 6: Report Results

```
==============================================================
MEDIA UPLOAD COMPLETE
==============================================================

Asset Name:    hero-banner-desktop
Asset ID:      {CFD9E144-F974-4AA8-A552-CBF55E67E628}
Source:         /Users/john/images/hero.jpg

Metadata:
- Alt Text:    Aerial view of convention center at sunset
- Description: Main hero banner image for the home page
- Tags:        hero, banner, homepage

Image XML (for component fields):
  <image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />

==============================================================

To use this image in a component, provide the Image XML above
to the sitecore-content-author skill's update_content call.
```

---

## Workflow: Search and Inspect Existing Assets

When the user wants to find assets already in the Media Library:

### Search by Query

```
mcp__marketer-mcp__search_assets({
  query: "banner",
  type: "image"
})
```

### Get Full Details

For any asset returned from search, get complete metadata:

```
mcp__marketer-mcp__get_asset_information({
  asset_id: "<asset-id>"
})
```

### Present Results

```
Asset: hero-banner-desktop.jpg
ID:    {CFD9E144-F974-4AA8-A552-CBF55E67E628}
Alt:   Aerial view of convention center at sunset
Tags:  hero, banner, homepage

Image XML: <image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />
```

---

## Workflow: Update Existing Asset Metadata

When the user wants to update alt text, description, or tags on an asset that already exists:

1. If the user provides an asset ID, use it directly
2. If the user provides a name, search for it first:
   ```
   mcp__marketer-mcp__search_assets({ query: "asset-name" })
   ```
3. Update the metadata:
   ```
   mcp__marketer-mcp__update_asset({
     asset_id: "<asset-id>",
     fields: { "Description": "Updated description" },
     language: "en",
     altText: "Updated alt text"
   })
   ```
4. Verify with `get_asset_information` to confirm changes applied

---

## Workflow: Bulk Upload (Multiple Assets)

When uploading multiple assets:

1. **Present the plan first** -- list all assets to be uploaded with names and sources
2. **Get explicit approval** before starting (bulk operation gate)
3. **Search for each** before uploading to prevent duplicates
4. **Upload sequentially** -- report each result as it completes
5. **Update metadata** for each asset after upload
6. **Provide summary table** at the end:

```
Bulk Upload Complete: 4/4 assets uploaded

| # | Asset Name | ID | Status |
|:--|:-----------|:---|:-------|
| 1 | hero-banner | {GUID-1} | Uploaded + metadata set |
| 2 | card-image-1 | {GUID-2} | Uploaded + metadata set |
| 3 | card-image-2 | {GUID-3} | Uploaded + metadata set |
| 4 | logo-dark | {GUID-4} | Already existed (skipped) |

Image XML references:
- hero-banner: <image mediaid='{GUID-1}' />
- card-image-1: <image mediaid='{GUID-2}' />
- card-image-2: <image mediaid='{GUID-3}' />
- logo-dark: <image mediaid='{GUID-4}' />
```

If any upload fails during a batch, report the failure and ask whether to continue with remaining assets or stop.

---

## Integration with Content Author Skill

After uploading assets, the returned asset IDs are used in the `sitecore-content-author` skill to populate image fields on components. The image XML format is:

```
<image mediaid='{ASSET-ID-GUID}' />
```

**Rules for image XML:**
- MUST use single quotes around attribute values
- GUID MUST have braces: `{GUID}`
- GUID should be UPPERCASE
- Self-closing tag with space before `/>`

**Example flow:**
1. Upload image via this skill -> get asset ID `{CFD9E144-F974-4AA8-A552-CBF55E67E628}`
2. Use `sitecore-content-author` to set the image field:
   ```
   mcp__marketer-mcp__update_content({
     siteName: "main",
     itemId: "<component-datasource-id>",
     fields: {
       "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
     }
   })
   ```

---

## Supported File Types

Common media types supported by Sitecore XM Cloud Media Library:

| Type | Extensions |
|:-----|:-----------|
| Images | `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp`, `.bmp`, `.tiff` |
| Documents | `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx` |
| Video | `.mp4`, `.webm`, `.mov` |
| Audio | `.mp3`, `.wav`, `.ogg` |

**Best practices for images:**
- Use optimized/compressed images before uploading (smaller file = faster page loads)
- Use descriptive asset names (e.g., `hero-banner-desktop` not `IMG_2847`)
- Always set alt text for accessibility compliance
- Prefer `.webp` or optimized `.jpg` for web images

---

## Error Handling

| Error | Cause | Resolution |
|:------|:------|:-----------|
| Upload fails | File path invalid or inaccessible | Verify the file exists at the specified path |
| Upload fails | URL unreachable | Check the URL is publicly accessible and returns an image |
| Asset not found | Wrong asset ID | Use `search_assets` to find the correct ID |
| Metadata update fails | Invalid asset ID | Verify the ID from the upload response |
| Duplicate asset | Asset with same name exists | Use `search_assets` result or upload with a different name |
| Pasted image corrupted | Binary data written via text tool | Ask for file path or URL instead -- never save pasted images |
| MCP connection error | marketer-mcp server unavailable | Check MCP connection status and retry |

---

## Guidelines

- **Always search before uploading** -- prevent duplicate assets in the Media Library
- **Always set alt text** -- accessibility is not optional. If the user does not provide alt text, ask for it before finalizing
- **Always provide the image XML** -- the user will need it for component field population
- **Describe before executing** -- tell the user what you're about to upload and where, then wait for confirmation
- **Verify after executing** -- use `get_asset_information` to confirm the upload succeeded and metadata is correct
- **Never save pasted images** -- binary data written via text tools will be corrupted. Always request a file path or URL
- **Report asset IDs clearly** -- the asset ID is the primary key for all downstream operations (content authoring, field population)
- **For bulk operations (3+ assets)** -- present the full plan and get explicit approval before starting

---

## Usage Examples

**Single upload:**
```
/sitecore-upload-media

Image: /Users/john/images/hero-banner.jpg
Name: hero-banner-desktop
Alt text: Aerial view of convention center at sunset
```

**Upload from URL:**
```
/sitecore-upload-media

Image: https://example.com/images/hero-banner.jpg
Name: hero-banner-desktop
Alt text: Aerial view of convention center at sunset
```

**Search existing assets:**
```
/sitecore-upload-media

Find all banner images in the Media Library
```

**Update metadata on existing asset:**
```
/sitecore-upload-media

Update alt text on asset {CFD9E144-F974-4AA8-A552-CBF55E67E628}
New alt text: "Updated aerial view of convention center"
```
