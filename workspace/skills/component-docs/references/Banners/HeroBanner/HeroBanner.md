# HeroBanner Component

## Purpose

The HeroBanner component displays a full-width hero section with a background image, prominent heading, optional subheading, and call-to-action buttons. It features a dark overlay for improved text readability and supports configurable content alignment. This component is typically used as the primary visual element at the top of landing pages, home pages, and campaign pages to create immediate visual impact.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Components/Banners/Hero Banner`
- **Template Name:** `Hero Banner`

### Fields

| Field Name            | Sitecore Type    | Required | Description                               | Validation/Constraints                    |
| --------------------- | ---------------- | -------- | ----------------------------------------- | ----------------------------------------- |
| heading               | Single-Line Text | Yes      | Main headline displayed prominently       | Recommended max 60 characters             |
| subheading            | Rich Text        | No       | Supporting text below the headline        | Supports basic formatting                 |
| backgroundImage       | Image            | Yes      | Desktop background image for the banner   | Recommended 1920x1080px minimum           |
| backgroundImageMobile | Image            | No       | Mobile-specific background image          | Recommended 800x800px, square preferred   |

### Rendering Parameters (Styles)

| Parameter        | Type     | Options                                           | Default                              | Description                          |
| ---------------- | -------- | ------------------------------------------------- | ------------------------------------ | ------------------------------------ |
| theme            | Droplist | primary, secondary, tertiary                      | primary                              | Color theme for the banner           |
| contentAlignment | Droplist | items-start justify-start text-left, items-center justify-center text-center, items-end justify-end text-right | items-start justify-start text-left | Text and content alignment           |
| padding (top)    | Droplist | top-none, top-xs, top-sm, top-md, top-lg, top-xl  | none                                 | Top padding                          |
| padding (bottom) | Droplist | bottom-none, bottom-xs, bottom-sm, bottom-md, bottom-lg, bottom-xl | none                             | Bottom padding                       |

## JSS Field Component Mapping

| Sitecore Field        | JSS Component                                                  | Import                                                  |
| --------------------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| heading               | `<Text field={fields?.heading} tag="h1" className="..." />`    | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| subheading            | `<RichText field={fields?.subheading} className="..." />`      | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| backgroundImage       | `<BackgroundImage fields={fields} />`                          | Custom component using `useBackgroundImage` hook        |
| backgroundImageMobile | `<BackgroundImage fields={fields} />`                          | Falls back to backgroundImage if not provided           |

## Placeholders

| Placeholder Name | Description                                         | Allowed Components |
| ---------------- | --------------------------------------------------- | ------------------ |
| buttons          | CTA buttons displayed below the content             | Button, LinkButton |

## Component Variants

The HeroBanner exports 1 rendering variant:

| Variant | Export Name | Use Case                                    |
| ------- | ----------- | ------------------------------------------- |
| Default | `Default`   | Full-width hero with background image       |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The primary page or campaign headline
- **Tone/Style:** Bold, attention-grabbing, value-focused
- **Character limit:** 60 characters recommended for best display
- **Example:** "Empower Your Digital Future"

#### subheading

- **What to enter:** Supporting context or value proposition
- **Tone/Style:** Informative, complements the headline
- **Formatting:** Basic rich text - bold, italic, links. Keep it simple.
- **Max width:** Content is constrained to 600px (max-w-150)
- **Example:** "<p>Leading solutions for modern enterprises seeking digital transformation.</p>"

#### backgroundImage (Desktop)

- **Recommended dimensions:** 1920x1080px or larger
- **Aspect ratio:** 16:9 (landscape)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Descriptive text for accessibility
- **Media Library path:** `/sitecore/media library/Project/[Site]/Banners/Heroes/`
- **Tips:** Dark overlay (25% black) is applied; choose images that work with text overlay

#### backgroundImageMobile

- **Recommended dimensions:** 800x800px or 800x1000px
- **Aspect ratio:** 1:1 or 4:5 (square/portrait preferred)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Can be same as desktop image
- **Media Library path:** `/sitecore/media library/Project/[Site]/Banners/Heroes/Mobile/`
- **Tips:** Displays below 1024px viewport; focus on key subject

### Content Matrix (Variations)

| Variation | Required Fields           | Optional Fields                   | Use Case                           |
| --------- | ------------------------- | --------------------------------- | ---------------------------------- |
| Minimal   | heading, backgroundImage  | -                                 | Bold headline-only hero            |
| Standard  | heading, subheading, backgroundImage | backgroundImageMobile        | Hero with supporting text          |
| Full      | heading, subheading, backgroundImage | backgroundImageMobile + buttons | Complete hero with CTAs           |

## Component Props Interface

```typescript
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { BackgroundImageProps } from 'lib/hooks/useBackgroundImage';
import { ComponentProps } from 'lib/component-props';

export type HeroBannerFields = BackgroundImageProps & {
  heading: Field<string>;
  subheading?: Field<string>;
};

export type HeroBannerProps = ComponentProps & {
  fields: HeroBannerFields;
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
    "heading": { "value": "Empower Your Digital Future" },
    "backgroundImage": {
      "value": {
        "src": "/-/media/Project/Site/Heroes/main-hero.jpg",
        "alt": "Modern office with digital screens",
        "width": "1920",
        "height": "1080"
      }
    }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Empower Your Digital Future" },
    "subheading": {
      "value": "<p>Leading solutions for modern enterprises seeking digital transformation and sustainable growth.</p>"
    },
    "backgroundImage": {
      "value": {
        "src": "/-/media/Project/Site/Heroes/digital-future.jpg",
        "alt": "Team working on innovative digital solutions",
        "width": "1920",
        "height": "1080"
      }
    },
    "backgroundImageMobile": {
      "value": {
        "src": "/-/media/Project/Site/Heroes/Mobile/digital-future-mobile.jpg",
        "alt": "Team working on innovative digital solutions",
        "width": "800",
        "height": "800"
      }
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Data sources: `/sitecore/content/[Site]/Home/Data/Hero Banners/`

### Experience Editor Behavior

- **Inline editable fields:** heading, subheading
- **Forms panel required:** backgroundImage, backgroundImageMobile
- **Image selection:** Click image area to open media browser
- **Placeholder:** Add buttons via the "buttons" placeholder

### Accessibility Features

- **role="region":** Component has region role for landmark navigation
- **aria-label:** Set to the heading value for screen readers
- **aria-hidden:** Decorative overlay elements are hidden from assistive technology

### Personalization Opportunities

- **heading/subheading:** Personalize messaging based on visitor segments
- **backgroundImage:** Use different imagery for different campaigns
- **Buttons:** Show different CTAs based on visitor behavior

## Common Mistakes to Avoid

1. **Missing mobile image:** If `backgroundImageMobile` is not set, the desktop image is used at all sizes. For optimal mobile experience, provide a square/portrait mobile-specific image.

2. **Low-contrast images:** Even with the dark overlay, ensure images provide sufficient contrast for white text.

3. **Overly long headings:** Headlines exceeding 60 characters may wrap to multiple lines, reducing impact.

4. **Rich text overload in subheading:** Keep subheading text concise (1-2 sentences). It has a max-width constraint.

5. **Missing alt text:** Always provide meaningful alt text for accessibility compliance.

6. **Ignoring alignment options:** Use contentAlignment to position content appropriately for your image composition.

## Related Components

- `ContentBanner` - Similar banner with gradient overlay and body text
- `SplitBanner` - Banner with side-by-side image and content layout
- `TextBanner` - Text-only banner without background image
- `VideoBanner` - Banner with video background instead of image

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the HeroBanner component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the HeroBanner rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)
4. Have media IDs for any images to be used

### Step 1: Find the Target Page

```javascript
// Search for the page where HeroBanner will be added
await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Home Page"
});
// Returns: { itemId: "page-guid", name: "PageName", path: "/sitecore/..." }
```

### Step 2: Add HeroBanner to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "hero-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "HeroBanner_1",
  language: "en",
  fields: {
    "heading": "Empower Your Digital Future",
    "subheading": "<p>Leading solutions for modern enterprises.</p>"
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
await mcp__marketer__update_content({
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
await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "button-rendering-id",
  placeholderPath: "headless-main/buttons-{HERO-BANNER-UID}",
  componentItemName: "HeroBanner_CTA",
  language: "en",
  fields: {
    "linkText": "Get Started",
    "linkUrl": "/contact"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Home"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add HeroBanner component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "hero-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "HeroBanner_Main",
  language: "en",
  fields: {
    "heading": "Empower Your Digital Future",
    "subheading": "<p>Leading solutions for modern enterprises seeking digital transformation and sustainable growth.</p>"
  }
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update image fields
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "backgroundImageMobile": "<image mediaid='{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: HeroBanner with all fields populated
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field                 | Type             | MCP Format                          |
| :-------------------- | :--------------- | :---------------------------------- |
| heading               | Single-Line Text | `"Plain text value"`                |
| subheading            | Rich Text        | `"<p>HTML content</p>"`             |
| backgroundImage       | Image            | `<image mediaid='{GUID}' />`        |
| backgroundImageMobile | Image            | `<image mediaid='{GUID}' />`        |

### MCP Authoring Checklist

Before authoring HeroBanner via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have HeroBanner rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `HeroBanner_1`)
- [ ] Have media GUIDs for backgroundImage field
- [ ] Image XML uses single quotes and braces: `<image mediaid='{GUID}' />`

### MCP Error Handling

| Error                  | Cause                   | Solution                                    |
| :--------------------- | :---------------------- | :------------------------------------------ |
| "Item already exists"  | Duplicate component name | Use unique suffix: `HeroBanner_2`          |
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
