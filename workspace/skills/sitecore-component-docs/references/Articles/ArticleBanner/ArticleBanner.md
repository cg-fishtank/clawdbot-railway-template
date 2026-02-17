# ArticleBanner Component

## Purpose
The ArticleBanner component displays a prominent banner section for article pages, featuring a headline, subheading, category badge, and hero image. It supports multiple visual variants (Default, Contained, Careers, Insights, News) with different badge themes and button styles. The component is typically used at the top of article detail pages to create visual hierarchy and introduce content.

## Sitecore Template Requirements

### Data Source Template
- **Template Path:** `/sitecore/templates/Project/[Site]/Articles/Article Banner` or uses Article Page Template fields
- **Template Name:** `Article Banner` (or inherits from Article Page)

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Main headline displayed in the banner | Recommended max 80 characters |
| subheading | Rich Text | No | Supporting text below the headline | Supports basic formatting (bold, italic, links) |
| image | Image | Yes | Desktop hero image for the banner | Recommended 1000x500px minimum, landscape orientation |
| imageMobile | Image | No | Mobile-specific image (falls back to image if not set) | Recommended 800x600px, portrait or square orientation |
| pageCategory | Multilist/Treelist | No | Reference to Page Category taxonomy items | Links to `/sitecore/content/[Site]/Data/Page Categories/` |
| datePublished | Date | No | Publication date of the article | ISO date format |
| lastUpdated | Date | No | Last modification date | ISO date format |

### Rendering Parameters (Styles)
| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| theme | Droplist | primary, secondary, tertiary | primary | Color theme for the banner background and text |
| bannerImgLeft | Checkbox | true, false | false | When true, positions image on the left side |
| contentAlignment | Droplist | left, center, right | left | Alignment of text content within the banner |
| padding (top) | Droplist | top-none, top-xs, top-sm, top-md, top-lg, top-xl | none | Top padding for the component |
| padding (bottom) | Droplist | bottom-none, bottom-xs, bottom-sm, bottom-md, bottom-lg, bottom-xl | none | Bottom padding for the component |
| paddingDesktop (top) | Droplist | top-none, top-xs, top-sm, top-md, top-lg, top-xl | none | Desktop-specific top padding |
| paddingDesktop (bottom) | Droplist | bottom-none, bottom-xs, bottom-sm, bottom-md, bottom-lg, bottom-xl | none | Desktop-specific bottom padding |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text field={fields?.heading} tag="h2" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| subheading | `<RichText field={fields?.subheading} />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| image | `<NextImage field={image} />` | `import { NextImage } from '@sitecore-jss/sitecore-jss-nextjs'` |
| pageCategory | `<Text field={category} editable={false} />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

The ArticleBanner exports 5 rendering variants, each with different visual styling:

| Variant | Export Name | Badge Theme | Button Style | Use Case |
|---------|-------------|-------------|--------------|----------|
| Default | `Default` | Primary (blue) | Link style | General articles, blog posts |
| Contained | `Contained` | Primary (blue) | Link style | Articles needing max-width constraint |
| Careers | `Careers` | Tertiary (green/accent) | Solid button | Job postings, career-related content |
| Insights | `Insights` | Secondary (gray) | Outline button | Research, whitepapers, industry insights |
| News | `News` | Secondary (gray) | Outline button | News articles, press releases |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading
- **What to enter:** The main article title that captures reader attention
- **Tone/Style:** Clear, compelling, action-oriented when appropriate
- **Character limit:** 80 characters recommended for best display
- **Example:** "Transforming Healthcare Through Digital Innovation"

#### subheading
- **What to enter:** Supporting context or article summary
- **Tone/Style:** Informative, complements the headline
- **Formatting:** Basic rich text - avoid complex formatting, keep it simple
- **Example:** "Discover how emerging technologies are reshaping patient care and improving outcomes across the industry."

#### image (Desktop)
- **Recommended dimensions:** 1000x500px or larger
- **Aspect ratio:** 2:1 (landscape)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Descriptive text that conveys image content and context
- **Media Library path:** `/sitecore/media library/Project/[Site]/Articles/Banners/`
- **Tips:** Use high-contrast images that work well with text overlay in some themes

#### imageMobile
- **Recommended dimensions:** 800x600px
- **Aspect ratio:** 4:3 or 1:1 (portrait/square preferred for mobile)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Can be same as desktop image
- **Media Library path:** `/sitecore/media library/Project/[Site]/Articles/Banners/Mobile/`
- **Tips:** Crop to focus on key subject matter; this image displays below 1024px viewport

#### pageCategory
- **What to select:** One category item from the Page Categories folder
- **Selection path:** `/sitecore/content/[Site]/Data/Page Categories/`
- **Display:** Shows as uppercase badge above the heading
- **Example categories:** "Technology", "Healthcare", "Finance", "Careers"

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | heading, image | - | Quick banner with just title and image |
| Standard | heading, image, subheading | imageMobile, pageCategory | Most common article banner setup |
| Full | heading, image, subheading, pageCategory | imageMobile | Complete banner with category badge |

## Component Props Interface

```typescript
// From lib/types/components/Articles/article-banner.ts
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { ArticleRouteFieldsType } from 'lib/types';

export type ArticleBannerProps = ComponentProps & {
  fields: ArticleRouteFieldsType;
  variant?: string;
  rendering: ComponentRendering & {
    path?: string;  // Resolved item path for "Read More" link
  };
};

// ArticleRouteFieldsType includes:
// - heading: Field<string>
// - subheading: Field<string>
// - image: ImageField
// - imageMobile: ImageField
// - pageCategory: PageCategoryField
// - datePublished: Field<string>
// - lastUpdated: Field<string>
// - profiles: ProfileType[]
// - displayDateTime: QueryField | Field<string>
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "Article Title Goes Here" },
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Articles/hero-image.jpg",
        "alt": "Descriptive alt text",
        "width": "1000",
        "height": "500"
      }
    }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "heading": { "value": "Transforming Healthcare Through Digital Innovation" },
    "subheading": {
      "value": "<p>Discover how emerging technologies are reshaping patient care and improving outcomes across the industry.</p>"
    },
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Articles/healthcare-innovation.jpg",
        "alt": "Medical professional using digital tablet in hospital setting",
        "width": "1200",
        "height": "600"
      }
    },
    "imageMobile": {
      "value": {
        "src": "/-/media/Project/Site/Articles/Mobile/healthcare-innovation-mobile.jpg",
        "alt": "Medical professional using digital tablet",
        "width": "800",
        "height": "600"
      }
    },
    "pageCategory": [
      {
        "displayName": "Healthcare",
        "fields": {
          "pageCategory": { "value": "Healthcare" }
        }
      }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path
- Article pages: `/sitecore/content/[Site]/Home/Articles/[Article Name]`
- Data sources: `/sitecore/content/[Site]/Home/Data/Article Banners/`

### Experience Editor Behavior
- **Inline editable fields:** heading, subheading
- **Forms panel required:** image, imageMobile, pageCategory
- **Image selection:** Click image area to open media browser
- **Category selection:** Use the content tree picker for pageCategory field

### Rendering Variant Selection
In Experience Editor or Content Editor:
1. Select the ArticleBanner component
2. Open "Rendering Properties" or "Component Properties"
3. Choose variant from dropdown: Default, Contained, Careers, Insights, or News

### Personalization Opportunities
- **heading/subheading:** Personalize messaging based on visitor segments
- **pageCategory display:** Show/hide based on visitor interests
- **Variant selection:** Use different variants for different campaigns

## Common Mistakes to Avoid

1. **Missing mobile image:** If `imageMobile` is not set, the desktop image is used at all sizes. For optimal mobile experience, provide a cropped mobile-specific image.

2. **Overly long headlines:** Headlines exceeding 80 characters may wrap awkwardly or truncate on smaller screens. Keep headlines concise.

3. **Rich text overload in subheading:** The subheading should be simple supporting text. Avoid complex HTML, lists, or multiple paragraphs.

4. **Low-contrast images:** When using lighter themes, ensure images have enough contrast for text readability over the content area.

5. **Missing alt text:** Always provide meaningful alt text for accessibility compliance and SEO.

6. **Wrong variant for content type:** Match the variant to your content:
   - Job postings → Careers variant
   - Industry analysis → Insights variant
   - Press releases → News variant
   - General articles → Default variant

## Related Components

- `ArticleHeader` - Alternative header component for article detail pages with different layout
- `SplitBanner` - Similar split-image layout but for non-article content
- `ContentBanner` - Full-width banner without split image layout
- `ArticleCard` - Card format for article listings that links to ArticleBanner pages

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Image not displaying | Missing or invalid image field | Verify image is selected in media library and published |
| Category badge not showing | pageCategory field empty or unpublished | Select category from Data folder and publish |
| "Read More" link missing | Item path not resolved | Ensure datasource item has a valid URL/path |
| Wrong colors displaying | Theme parameter not set | Check Styles field in rendering parameters |
| Content misaligned | contentAlignment parameter issue | Verify contentAlignment value in Styles |
| Mobile image not swapping | imageMobile not configured | Add separate mobile image or leave empty for fallback |

## Rendering Parameters (Styles) Format

The Styles field uses space-separated key:value pairs:

```
theme:primary padding:top-md padding:bottom-md contentAlignment:left bannerImgLeft:true
```

### Available Style Combinations

```
# Primary theme with image on right (default)
theme:primary

# Secondary theme with image on left
theme:secondary bannerImgLeft:true

# Tertiary theme, centered content, with padding
theme:tertiary contentAlignment:center padding:top-lg padding:bottom-lg
```

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ArticleBanner component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer-mcp__search_site`)
2. Have the ArticleBanner rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)
4. Have media IDs for any images to be used

### Step 1: Find the Target Page

```javascript
// Search for the page where ArticleBanner will be added
await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Article Page Name"
});
// Returns: { itemId: "page-guid", name: "PageName", path: "/sitecore/..." }
```

### Step 2: Add ArticleBanner to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "article-banner-rendering-id",
  placeholderPath: "headless-main",  // Root level = NO leading slash
  componentItemName: "ArticleBanner_1",  // Must be unique on page
  language: "en",
  fields: {
    // Simple text fields can be set here
    "heading": "Article Headline Here",
    "subheading": "<p>Supporting text for the article.</p>"
  }
});

// Returns:
// {
//   "datasourceId": "created-datasource-guid",
//   "placeholderId": "headless-main"
// }
```

**IMPORTANT:** Save the `datasourceId` - it's needed for updating complex fields.

### Step 3: Update Image Fields

Image fields require XML format with specific syntax:

```javascript
// Format: <image mediaid='{GUID}' />
// CRITICAL: Use single quotes, braces around GUID, UPPERCASE GUID

await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,  // From Step 2
  language: "en",
  fields: {
    "image": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "imageMobile": "<image mediaid='{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}' />"
  }
});
```

**Image Field Rules:**
- MUST use single quotes around attribute values
- GUID MUST be wrapped in braces: `{GUID}`
- GUID should be UPPERCASE
- If image needs uploading first, use `/sitecore-upload-media` skill

### Step 4: Update Text/RichText Fields

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "heading": "Transforming Healthcare Through Innovation",
    "subheading": "<p>Discover how emerging technologies are reshaping patient care.</p>"
  }
});
```

**Note:** The `updatedFields: {}` response is normal - the update succeeded even if the response appears empty.

### Step 5: Handle pageCategory (Multilist Field)

The pageCategory field references taxonomy items. Set it using the item GUID:

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "pageCategory": "{CATEGORY-ITEM-GUID}"  // Single category
    // OR for multiple: "{GUID1}|{GUID2}|{GUID3}"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Healthcare Innovation"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add ArticleBanner component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "article-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ArticleBanner_Healthcare",
  language: "en",
  fields: {
    "heading": "Transforming Healthcare Through Digital Innovation",
    "subheading": "<p>Discover how emerging technologies are reshaping patient care and improving outcomes across the industry.</p>"
  }
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update image fields
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "image": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "imageMobile": "<image mediaid='{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Set page category (optional)
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "pageCategory": "{HEALTHCARE-CATEGORY-GUID}"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: ArticleBanner with all fields populated
// ═══════════════════════════════════════════════════════════════
```

### Variant Selection via Rendering

To use a specific variant (Default, Contained, Careers, Insights, News), use the corresponding rendering ID:

| Variant | Rendering Name |
|---------|----------------|
| Default | `ArticleBanner` |
| Contained | `ArticleBanner-Contained` |
| Careers | `ArticleBanner-Careers` |
| Insights | `ArticleBanner-Insights` |
| News | `ArticleBanner-News` |

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| subheading | Rich Text | `"<p>HTML content</p>"` |
| image | Image | `<image mediaid='{GUID}' />` |
| imageMobile | Image | `<image mediaid='{GUID}' />` |
| pageCategory | Multilist | `"{GUID}"` or `"{GUID1}\|{GUID2}"` |
| datePublished | Date | `"20240115T120000Z"` |

### MCP Authoring Checklist

Before authoring ArticleBanner via MCP, verify:

- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have ArticleBanner rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `ArticleBanner_1`)
- [ ] Have media GUIDs for image and imageMobile fields
- [ ] Image XML uses single quotes and braces: `<image mediaid='{GUID}' />`

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ArticleBanner_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| Image not showing | Wrong XML format | Verify single quotes, braces around GUID |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |
| "Cannot find field" | Wrong field name | Field names are case-sensitive |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-author-image` | Image field XML formatting details |
| `/sitecore-upload-media` | Upload images to Media Library first |
| `/sitecore-component-authorer` | Full orchestration workflow |

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-04 | Initial documentation | Claude Code |
| 2026-02-04 | Added MCP Authoring Instructions section | Claude Code |
