---
name: sitecore-asset-management
description: Search, inspect, and update digital assets in the SitecoreAI Media Library. Find assets by name, keyword, or type (images, PDFs, videos, documents). Inspect asset metadata including dimensions, alt text, tags, and file path. Update alt text, descriptions, and tags on existing assets. Prevent duplicate uploads by searching the library before adding new files.
allowed-tools:
  - mcp__marketer-mcp__search_assets
  - mcp__marketer-mcp__get_asset_information
  - mcp__marketer-mcp__update_asset
---

# Sitecore Asset Management

**Search, inspect, and update digital assets in the SitecoreAI Media Library via marketer-mcp.**

---

## Capabilities

1. **Search for assets** — Find images, PDFs, videos, and documents in the Media Library by name, keyword, or type
2. **Inspect asset metadata** — Retrieve full metadata for any asset including dimensions, alt text, description, tags, file path, and file type
3. **Update asset metadata** — Modify alt text, description, and tags on existing assets for SEO and accessibility compliance
4. **Prevent duplicate uploads** — Search the library before uploading to avoid creating redundant copies of the same asset
5. **Audit asset quality** — Identify assets with missing alt text, descriptions, or tags that need attention

---

## When to Use This Skill

Use this skill when:
- You need to find an existing asset in the Media Library (by name, keyword, or type)
- You want to inspect an asset's metadata (dimensions, alt text, tags, path)
- You need to update alt text, description, or tags on an existing asset
- You want to check if an asset already exists before uploading a new one
- You are auditing assets for accessibility compliance (missing alt text)
- You need to inventory assets by type (all PDFs, all videos, etc.)

**Do NOT use this skill when:**
- You need to upload a new asset to the Media Library (use `sitecore-content-author` with `upload_asset`)
- You need to assign an image to a component's image field (use `sitecore-author-image`)
- You need to read or edit page content (use `sitecore-content-reader` or `sitecore-content-author`)

---

## Asset Types

The Media Library stores multiple asset types. Use the appropriate search terms to filter:

| Asset Type | Common Extensions | Example Search Terms |
|:-----------|:-----------------|:---------------------|
| Images | `.jpg`, `.png`, `.svg`, `.webp`, `.gif` | `"banner"`, `"logo"`, `"hero background"` |
| PDFs | `.pdf` | `"brochure"`, `"whitepaper"`, `"annual report"` |
| Videos | `.mp4`, `.webm`, `.mov` | `"product demo"`, `"testimonial video"` |
| Documents | `.docx`, `.xlsx`, `.pptx` | `"datasheet"`, `"spec sheet"` |

---

## Workflow: Search for Assets

Find assets in the Media Library by name or keyword.

### Steps

1. Use `mcp__marketer-mcp__search_assets` with a descriptive search query
2. Review returned results — each includes asset ID, name, and path
3. If too many results, refine the search with more specific keywords
4. If no results, try alternate keywords (e.g., `"banner"` instead of `"hero image"`)

### Example

```
mcp__marketer-mcp__search_assets({
  search_query: "hospitality banner"
})
```

**Response:**
```json
{
  "assets": [
    {
      "id": "cfd9e144-f974-4aa8-a552-cbf55e67e628",
      "name": "hospitality-banner",
      "path": "/sitecore/media library/Project/main/Images/hospitality-banner"
    },
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "hospitality-banner-mobile",
      "path": "/sitecore/media library/Project/main/Images/hospitality-banner-mobile"
    }
  ]
}
```

### Search Tips

- Use descriptive keywords: `"hero background"`, `"logo dark"`, `"team photo"`
- Search by file name: `"banner-desktop"`, `"icon-arrow"`
- Search by folder path if known: `"Project/main/Images"`
- Try partial names if exact name is unknown: `"hospit"` may match `"hospitality-banner"`
- Search by asset type context: `"pdf brochure"`, `"video testimonial"`

---

## Workflow: Inspect Asset Metadata

Retrieve full metadata for a specific asset to understand its properties.

### Steps

1. Obtain the asset ID (from a previous search or from the user)
2. Call `mcp__marketer-mcp__get_asset_information` with the asset ID
3. Review the metadata: dimensions, alt text, description, tags, file path, file type
4. Report findings to the user in a structured format

### Example

```
mcp__marketer-mcp__get_asset_information({
  asset_id: "cfd9e144-f974-4aa8-a552-cbf55e67e628"
})
```

**Response:**
```json
{
  "id": "cfd9e144-f974-4aa8-a552-cbf55e67e628",
  "name": "hospitality-banner",
  "path": "/sitecore/media library/Project/main/Images/hospitality-banner",
  "dimensions": { "width": 1920, "height": 1080 },
  "alt": "Hospitality venue exterior at sunset",
  "description": "Main banner image for the hospitality landing page",
  "tags": ["hospitality", "banner", "hero"]
}
```

### Presenting Asset Metadata

Use this format when reporting asset details to the user:

```
Asset: hospitality-banner
  ID:          cfd9e144-f974-4aa8-a552-cbf55e67e628
  Path:        /sitecore/media library/Project/main/Images/hospitality-banner
  Dimensions:  1920 x 1080
  Alt Text:    "Hospitality venue exterior at sunset"
  Description: "Main banner image for the hospitality landing page"
  Tags:        hospitality, banner, hero
```

---

## Workflow: Update Asset Metadata

Modify alt text, description, or tags on an existing asset for SEO, accessibility, or organizational purposes.

### Steps

1. Identify the target asset (search if needed, or use a known asset ID)
2. Call `mcp__marketer-mcp__get_asset_information` to review current metadata
3. Describe the planned changes to the user and get confirmation
4. Call `mcp__marketer-mcp__update_asset` with the updated metadata fields
5. Verify the update by calling `mcp__marketer-mcp__get_asset_information` again

### Example: Update Alt Text

```
// Step 1: Get current metadata
mcp__marketer-mcp__get_asset_information({
  asset_id: "cfd9e144-f974-4aa8-a552-cbf55e67e628"
})
// -> Current alt: "" (empty)

// Step 2: Update alt text
mcp__marketer-mcp__update_asset({
  asset_id: "cfd9e144-f974-4aa8-a552-cbf55e67e628",
  alt: "Hospitality venue exterior at sunset with garden seating"
})

// Step 3: Verify
mcp__marketer-mcp__get_asset_information({
  asset_id: "cfd9e144-f974-4aa8-a552-cbf55e67e628"
})
// -> Alt now populated
```

### Example: Update Description and Tags

```
mcp__marketer-mcp__update_asset({
  asset_id: "cfd9e144-f974-4aa8-a552-cbf55e67e628",
  description: "Primary hero banner for the hospitality landing page. Used in desktop and tablet breakpoints.",
  tags: ["hospitality", "banner", "hero", "desktop", "landing-page"]
})
```

### What Can Be Updated

| Field | Purpose | Example Value |
|:------|:--------|:-------------|
| `alt` | Alt text for accessibility and SEO | `"Team members collaborating in office"` |
| `description` | Internal description for content editors | `"Used on the About Us page hero section"` |
| `tags` | Organizational tags for search and filtering | `["hero", "about-us", "team"]` |

### Alt Text Best Practices

- Be descriptive but concise (under 125 characters for screen readers)
- Describe the content and function of the image, not its appearance
- Do not start with "Image of" or "Photo of" — screen readers already announce it as an image
- Include relevant context: `"Chef preparing signature dish in open kitchen"` not `"person cooking"`
- For decorative images that add no information, use an empty alt: `""`
- For images with text, include the text in the alt attribute

---

## Workflow: Prevent Duplicate Uploads

Before uploading a new asset, always search the Media Library first to avoid creating duplicates.

### Steps

1. Search for the asset by name or keyword using `mcp__marketer-mcp__search_assets`
2. If matches are found, inspect each match with `mcp__marketer-mcp__get_asset_information`
3. Compare the existing asset with the intended upload (dimensions, name, path)
4. **If a matching asset exists:** Use the existing asset ID instead of uploading
5. **If no match exists:** Proceed with the upload (via `sitecore-content-author` skill's `upload_asset`)

### Example

```
// Step 1: Search before uploading
mcp__marketer-mcp__search_assets({
  search_query: "company-logo-dark"
})

// Step 2a: Match found — use existing asset
// -> Found: "company-logo-dark" (id: abc-123-...)
// -> No upload needed. Use this ID for image field assignment.

// Step 2b: No match — safe to upload
// -> No results. Proceed with upload via sitecore-content-author skill.
```

### Duplicate Prevention Checklist

Before uploading, verify:

- [ ] Searched by exact file name (e.g., `"company-logo-dark"`)
- [ ] Searched by descriptive keywords (e.g., `"company logo"`, `"dark logo"`)
- [ ] Checked common variations (e.g., `"logo-dark"` vs `"dark-logo"` vs `"logo_dark"`)
- [ ] Inspected any matches to confirm they are truly the same asset (not just similarly named)
- [ ] If a match exists, confirmed it meets the required dimensions and quality

### When Duplicates Are Acceptable

In rare cases, uploading a seeming duplicate is correct:
- The existing asset has different dimensions than what is needed
- The existing asset is in a different folder/context and is managed by a different team
- The user explicitly wants a separate copy for independent editing

Always explain to the user if you find a potential duplicate and let them decide.

---

## Workflow: Audit Asset Metadata Quality

Review assets for missing or incomplete metadata, especially alt text for accessibility.

### Steps

1. Search for assets in a target area using `mcp__marketer-mcp__search_assets`
2. For each result, call `mcp__marketer-mcp__get_asset_information`
3. Flag assets with missing alt text, empty descriptions, or no tags
4. Present an audit report

### Report Format

```
Asset Metadata Audit: [Search Query / Section]

Complete (2/5 assets):
- hospitality-banner: alt, description, tags all populated
- company-logo: alt and description populated

Needs Attention (3/5 assets):
- team-photo: MISSING alt text (accessibility risk)
- office-exterior: MISSING description, MISSING tags
- product-hero: alt text is "image" (too generic — needs improvement)

Recommendations:
1. Add descriptive alt text to team-photo for screen reader accessibility
2. Add description and tags to office-exterior for editorial discoverability
3. Replace generic alt text on product-hero with specific description
```

---

## Complete Example: Find, Inspect, and Update an Asset

```
// STEP 1: Search for the asset
mcp__marketer-mcp__search_assets({
  search_query: "team photo office"
})
// -> Returns asset: { id: "e5f6a7b8-...", name: "team-photo-office" }

// STEP 2: Inspect current metadata
mcp__marketer-mcp__get_asset_information({
  asset_id: "e5f6a7b8-c9d0-1234-5678-abcdef012345"
})
// -> alt: "" (empty), description: "" (empty), tags: []

// STEP 3: Confirm with user
// "I found 'team-photo-office' (1920x1280). It currently has no alt text,
//  description, or tags. I'd like to update:
//  - Alt: 'Fishtank team members collaborating around a conference table'
//  - Description: 'Team photo used on the About Us page hero section'
//  - Tags: ['team', 'about-us', 'office', 'people']
//  Proceed?"

// STEP 4: Update metadata
mcp__marketer-mcp__update_asset({
  asset_id: "e5f6a7b8-c9d0-1234-5678-abcdef012345",
  alt: "Fishtank team members collaborating around a conference table",
  description: "Team photo used on the About Us page hero section",
  tags: ["team", "about-us", "office", "people"]
})

// STEP 5: Verify the update
mcp__marketer-mcp__get_asset_information({
  asset_id: "e5f6a7b8-c9d0-1234-5678-abcdef012345"
})
// -> alt, description, tags now populated
```

---

## Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| `AUTH_NOT_AUTHENTICATED` | Token expired | Re-authenticate with Sitecore Cloud CLI and update credentials |
| No search results | Wrong search terms or asset does not exist | Try different keywords, partial names, or broader terms |
| Asset ID not found | Invalid, deleted, or moved asset | Re-search for the asset by name; it may have been relocated |
| Update returns error | Invalid field or value format | Check that field names and value formats match what `update_asset` expects |
| Stale metadata after update | Caching delay | Call `get_asset_information` again after a brief pause to confirm |

---

## Guidelines

- **Always search before uploading** — duplicate prevention is a core responsibility of this skill
- **Always inspect before updating** — review current metadata so you know what you are changing
- **Always confirm with the user before updating** — describe the planned changes and wait for approval
- **Always verify after updating** — call `get_asset_information` to confirm the update took effect
- **Write meaningful alt text** — follow accessibility best practices (concise, descriptive, no "Image of" prefix)
- **Use consistent tag conventions** — lowercase, hyphenated, descriptive (e.g., `"landing-page"`, not `"Landing Page"`)
- **This skill does not upload or delete assets** — if the user needs to upload, direct them to `sitecore-content-author` with `upload_asset`
- **This skill does not assign assets to content fields** — if the user needs to set an image field on a component, direct them to `sitecore-author-image`
- Never fabricate metadata that is not present in the API response
- When presenting search results with many matches, summarize and ask the user which asset they want to inspect
