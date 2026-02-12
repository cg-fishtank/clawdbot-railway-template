# ContentBanner Component

## Purpose

The ContentBanner component displays a prominent banner section with a background image, heading, body text, and optional call-to-action buttons. It features a gradient overlay that transitions from the image to the surface color, with configurable content alignment. This component is ideal for hero sections, promotional banners, and featured content areas that need visual impact with readable text overlay.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Components/Banners/Content Banner`
- **Template Name:** `Content Banner`

### Fields

| Field Name            | Sitecore Type | Required | Description                               | Validation/Constraints                    |
| --------------------- | ------------- | -------- | ----------------------------------------- | ----------------------------------------- |
| heading               | Single-Line Text | Yes   | Main headline displayed in the banner     | Recommended max 80 characters             |
| body                  | Rich Text     | No       | Supporting body text below the headline   | Supports basic formatting                 |
| backgroundImage       | Image         | Yes      | Desktop background image for the banner   | Recommended 1920x800px minimum, landscape |
| backgroundImageMobile | Image         | No       | Mobile-specific background image          | Recommended 800x600px, portrait/square    |

### Rendering Parameters (Styles)

| Parameter              | Type     | Options                                           | Default | Description                                |
| ---------------------- | -------- | ------------------------------------------------- | ------- | ------------------------------------------ |
| theme                  | Droplist | primary, secondary, tertiary                      | primary | Color theme for the banner                 |
| bannerContentAlignment | Droplist | md:mr-auto, md:ml-auto                            | md:ml-auto | Content positioning (left or right)       |
| padding (top)          | Droplist | top-none, top-xs, top-sm, top-md, top-lg, top-xl  | none    | Top padding                                |
| padding (bottom)       | Droplist | bottom-none, bottom-xs, bottom-sm, bottom-md, bottom-lg, bottom-xl | none | Bottom padding                            |

## JSS Field Component Mapping

| Sitecore Field        | JSS Component                                                  | Import                                                  |
| --------------------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| heading               | `<Text field={fields?.heading} tag="h2" className="..." />`    | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| body                  | `<RichText field={fields?.body} className="richtext..." />`    | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| backgroundImage       | `<BackgroundImage fields={fields} />`                          | Custom component using `useBackgroundImage` hook        |
| backgroundImageMobile | `<BackgroundImage fields={fields} />`                          | Falls back to backgroundImage if not provided           |

## Placeholders

| Placeholder Name | Description                                         | Allowed Components |
| ---------------- | --------------------------------------------------- | ------------------ |
| buttons          | CTA buttons displayed below the content             | Button, LinkButton |

## Component Variants

The ContentBanner exports 1 rendering variant:

| Variant | Export Name | Use Case                                    |
| ------- | ----------- | ------------------------------------------- |
| Default | `Default`   | Full-width banner with background image     |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The main promotional headline or page title
- **Tone/Style:** Compelling, action-oriented, benefit-focused
- **Character limit:** 80 characters recommended for best display
- **Example:** "Transform Your Business with Digital Innovation"

#### body

- **What to enter:** Supporting context or value proposition
- **Tone/Style:** Informative, complements the headline
- **Formatting:** Basic rich text - bold, italic, links. Keep it simple.
- **Example:** "<p>Discover solutions that drive growth and efficiency across your organization.</p>"

#### backgroundImage (Desktop)

- **Recommended dimensions:** 1920x800px or larger
- **Aspect ratio:** 2.4:1 (landscape)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Descriptive text for accessibility
- **Media Library path:** `/sitecore/media library/Project/[Site]/Banners/`
- **Tips:** Use images with areas of low detail where text will overlay

#### backgroundImageMobile

- **Recommended dimensions:** 800x600px
- **Aspect ratio:** 4:3 or 1:1 (portrait/square preferred)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Can be same as desktop image
- **Media Library path:** `/sitecore/media library/Project/[Site]/Banners/Mobile/`
- **Tips:** Crop to focus on key subject; displays below 1024px viewport

### Content Matrix (Variations)

| Variation | Required Fields           | Optional Fields                   | Use Case                           |
| --------- | ------------------------- | --------------------------------- | ---------------------------------- |
| Minimal   | heading, backgroundImage  | -                                 | Simple visual banner               |
| Standard  | heading, body, backgroundImage | backgroundImageMobile        | Banner with supporting text        |
| Full      | heading, body, backgroundImage | backgroundImageMobile + buttons | Complete promotional banner        |

## Component Props Interface

```typescript
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { BackgroundImageProps } from 'lib/hooks/useBackgroundImage';
import { ComponentProps } from 'lib/component-props';

type ContentBannerFields = BackgroundImageProps & {
  heading: Field<string>;
  body?: Field<string>;
};

export type ContentBannerProps = ComponentProps & {
  fields: ContentBannerFields;
};

// BackgroundImageProps includes:
// - backgroundImage: ImageField (required)
// - backgroundImageMobile: ImageField (optional)
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Welcome to Our Platform" },
    "backgroundImage": {
      "value": {
        "src": "/-/media/Project/Site/Banners/hero-bg.jpg",
        "alt": "Abstract business background",
        "width": "1920",
        "height": "800"
      }
    }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Transform Your Business with Digital Innovation" },
    "body": {
      "value": "<p>Discover solutions that drive growth and efficiency across your organization. Our platform empowers teams to achieve more.</p>"
    },
    "backgroundImage": {
      "value": {
        "src": "/-/media/Project/Site/Banners/digital-transformation.jpg",
        "alt": "Team collaborating on digital project",
        "width": "1920",
        "height": "800"
      }
    },
    "backgroundImageMobile": {
      "value": {
        "src": "/-/media/Project/Site/Banners/Mobile/digital-transformation-mobile.jpg",
        "alt": "Team collaborating on digital project",
        "width": "800",
        "height": "600"
      }
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Data sources: `/sitecore/content/[Site]/Home/Data/Content Banners/`

### Experience Editor Behavior

- **Inline editable fields:** heading, body
- **Forms panel required:** backgroundImage, backgroundImageMobile
- **Image selection:** Click image area to open media browser
- **Placeholder:** Add buttons via the "buttons" placeholder

### Personalization Opportunities

- **heading/body:** Personalize messaging based on visitor segments
- **backgroundImage:** Use different imagery for different campaigns
- **Variant selection:** Different themes for different audiences

## Common Mistakes to Avoid

1. **Missing mobile image:** If `backgroundImageMobile` is not set, the desktop image is used at all sizes. For optimal mobile experience, provide a cropped mobile-specific image.

2. **Low-contrast images:** Ensure images have enough contrast for text readability. The gradient overlay helps, but choose images wisely.

3. **Overly long headings:** Headlines exceeding 80 characters may wrap awkwardly or be difficult to read over images.

4. **Rich text overload in body:** Keep body text simple and scannable. Avoid complex HTML or multiple paragraphs.

5. **Missing alt text:** Always provide meaningful alt text for accessibility compliance.

6. **Forgetting buttons:** Add CTAs via the buttons placeholder for maximum engagement.

## Related Components

- `HeroBanner` - Similar full-width banner with different layout options
- `SplitBanner` - Banner with side-by-side image and content layout
- `TextBanner` - Text-only banner without background image
- `VideoBanner` - Banner with video background instead of image

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ContentBanner component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer-mcp__search_site`)
2. Have the ContentBanner rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)
4. Have media IDs for any images to be used

### Step 1: Find the Target Page

```javascript
// Search for the page where ContentBanner will be added
await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Home Page"
});
// Returns: { itemId: "page-guid", name: "PageName", path: "/sitecore/..." }
```

### Step 2: Add ContentBanner to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "content-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ContentBanner_1",
  language: "en",
  fields: {
    "heading": "Transform Your Business",
    "body": "<p>Discover solutions that drive growth.</p>"
  }
});

// Returns:
// {
//   "datasourceId": "created-datasource-guid",
//   "placeholderId": "headless-main"
// }
```

**IMPORTANT:** Save the `datasourceId` - it's needed for updating image fields.

### Step 3: Update Image Fields

Image fields require XML format with specific syntax:

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,  // From Step 2
  language: "en",
  fields: {
    "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "backgroundImageMobile": "<image mediaid='{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}' />"
  }
});
```

**Image Field Rules:**

- MUST use single quotes around attribute values
- GUID MUST be wrapped in braces: `{GUID}`
- GUID should be UPPERCASE
- If image needs uploading first, use `/sitecore-upload-media` skill

### Step 4: Add Button Components (Optional)

Add buttons to the buttons placeholder:

```javascript
await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "button-rendering-id",
  placeholderPath: "headless-main/buttons-{CONTENT-BANNER-UID}",
  componentItemName: "ContentBanner_CTA",
  language: "en",
  fields: {
    "linkText": "Learn More",
    "linkUrl": "/about"
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
  search_query: "Home"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add ContentBanner component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "content-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ContentBanner_Hero",
  language: "en",
  fields: {
    "heading": "Transform Your Business with Digital Innovation",
    "body": "<p>Discover solutions that drive growth and efficiency across your organization.</p>"
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
    "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "backgroundImageMobile": "<image mediaid='{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: ContentBanner with all fields populated
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field                 | Type             | MCP Format                          |
| :-------------------- | :--------------- | :---------------------------------- |
| heading               | Single-Line Text | `"Plain text value"`                |
| body                  | Rich Text        | `"<p>HTML content</p>"`             |
| backgroundImage       | Image            | `<image mediaid='{GUID}' />`        |
| backgroundImageMobile | Image            | `<image mediaid='{GUID}' />`        |

### MCP Authoring Checklist

Before authoring ContentBanner via MCP, verify:

- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have ContentBanner rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `ContentBanner_1`)
- [ ] Have media GUIDs for backgroundImage field
- [ ] Image XML uses single quotes and braces: `<image mediaid='{GUID}' />`

### MCP Error Handling

| Error                  | Cause                   | Solution                                    |
| :--------------------- | :---------------------- | :------------------------------------------ |
| "Item already exists"  | Duplicate component name | Use unique suffix: `ContentBanner_2`       |
| Component not visible  | Wrong placeholder path   | Use `"headless-main"` without leading slash |
| Image not showing      | Wrong XML format         | Verify single quotes, braces around GUID   |
| `updatedFields: {}`    | Normal response          | Update succeeded despite empty response    |
| "Cannot find field"    | Wrong field name         | Field names are case-sensitive             |

### Related Skills for MCP Authoring

| Skill                          | Purpose                                  |
| :----------------------------- | :--------------------------------------- |
| `/sitecore-author-placeholder` | Placeholder path construction rules      |
| `/sitecore-author-image`       | Image field XML formatting details       |
| `/sitecore-upload-media`       | Upload images to Media Library first     |
| `/sitecore-pagebuilder`        | Full page creation workflow              |

---

## Change Log

| Date       | Change                | Author      |
| ---------- | --------------------- | ----------- |
| 2026-02-09 | Initial documentation | Claude Code |
