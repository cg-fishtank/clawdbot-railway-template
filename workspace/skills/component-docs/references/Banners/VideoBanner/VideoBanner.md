# VideoBanner Component

## Purpose

The VideoBanner component displays a full-width banner section with an autoplaying background video, heading text, and call-to-action buttons. It features a dark overlay (40% black) for improved text readability and falls back gracefully when video cannot be played. This component is ideal for home pages, campaign landing pages, and any section where dynamic visual content creates greater engagement than static imagery.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Components/Banners/Video Banner`
- **Template Name:** `Video Banner`

### Fields

| Field Name            | Sitecore Type | Required | Description                               | Validation/Constraints                    |
| --------------------- | ------------- | -------- | ----------------------------------------- | ----------------------------------------- |
| heading               | Single-Line Text | Yes   | Main headline displayed over the video    | Recommended max 60 characters             |
| backgroundVideo       | Image/File    | Yes      | MP4 video file for background             | MP4 format required, recommended <10MB    |
| backgroundImage       | Image         | No       | Fallback image when video cannot play     | Recommended 1920x1080px                   |
| backgroundImageMobile | Image         | No       | Mobile fallback image                     | Recommended 800x800px                     |

### Rendering Parameters (Styles)

| Parameter        | Type     | Options                                           | Default                                    | Description                          |
| ---------------- | -------- | ------------------------------------------------- | ------------------------------------------ | ------------------------------------ |
| textColor        | Droplist | text-white, text-black, text-content              | text-white                                 | Color of the heading text            |
| contentAlignment | Droplist | items-start justify-start text-left, items-center justify-center text-center, items-end justify-end text-right | items-center justify-center text-center | Text and content alignment           |
| padding (top)    | Droplist | top-none, top-xs, top-sm, top-md, top-lg, top-xl  | none                                       | Top padding                          |
| padding (bottom) | Droplist | bottom-none, bottom-xs, bottom-sm, bottom-md, bottom-lg, bottom-xl | none                                   | Bottom padding                       |

## JSS Field Component Mapping

| Sitecore Field  | JSS Component                                               | Import                                                  |
| --------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| heading         | `<Text field={fields?.heading} tag="h1" className="..." />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| backgroundVideo | Native `<video>` with `<source src={...} type="video/mp4">` | N/A - uses native HTML5 video element                   |

## Placeholders

| Placeholder Name | Description                                         | Allowed Components |
| ---------------- | --------------------------------------------------- | ------------------ |
| buttons          | CTA buttons displayed below the heading             | Button, LinkButton |

## Component Variants

The VideoBanner exports 1 rendering variant:

| Variant | Export Name | Use Case                                    |
| ------- | ----------- | ------------------------------------------- |
| Default | `Default`   | Full-width video background banner          |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The primary headline displayed over the video
- **Tone/Style:** Bold, attention-grabbing, concise
- **Character limit:** 60 characters recommended for best display
- **Example:** "Experience the Future Today"

#### backgroundVideo

- **Format:** MP4 (H.264 codec recommended)
- **File size:** Under 10MB recommended for fast loading
- **Dimensions:** 1920x1080px minimum
- **Duration:** 10-30 seconds (loops automatically)
- **Audio:** Must be silent or audio-free (video plays muted)
- **Media Library path:** `/sitecore/media library/Project/[Site]/Videos/Banners/`
- **Tips:**
  - Compress videos for web delivery
  - Use subtle motion; avoid fast cuts
  - Ensure video works without audio (no dialogue)
  - Test on mobile devices for performance

#### backgroundImage (Fallback)

- **Purpose:** Displayed if video cannot load or on mobile devices with slow connections
- **Recommended dimensions:** 1920x1080px
- **Aspect ratio:** 16:9 (landscape)
- **File formats:** JPG, PNG, WebP
- **Media Library path:** `/sitecore/media library/Project/[Site]/Banners/`

#### backgroundImageMobile

- **Purpose:** Mobile-specific fallback image
- **Recommended dimensions:** 800x800px
- **Aspect ratio:** 1:1 or 4:5 (square/portrait)
- **File formats:** JPG, PNG, WebP
- **Media Library path:** `/sitecore/media library/Project/[Site]/Banners/Mobile/`

### Content Matrix (Variations)

| Variation | Required Fields         | Optional Fields                         | Use Case                           |
| --------- | ----------------------- | --------------------------------------- | ---------------------------------- |
| Minimal   | heading, backgroundVideo | -                                       | Simple video banner                |
| Standard  | heading, backgroundVideo | backgroundImage                         | Video with fallback                |
| Full      | heading, backgroundVideo | backgroundImage, backgroundImageMobile + buttons | Complete video section      |

## Component Props Interface

```typescript
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { BackgroundImageProps } from 'lib/hooks/useBackgroundImage';

type VideoBannerFields = BackgroundImageProps & {
  backgroundVideo: ImageField;
  heading: Field<string>;
};

export type VideoBannerProps = ComponentProps & {
  fields: VideoBannerFields;
};

// BackgroundImageProps includes:
// - backgroundImage: ImageField (optional fallback)
// - backgroundImageMobile: ImageField (optional fallback)
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Experience the Future Today" },
    "backgroundVideo": {
      "value": {
        "src": "/-/media/Project/Site/Videos/hero-video.mp4"
      }
    }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Experience the Future of Innovation" },
    "backgroundVideo": {
      "value": {
        "src": "/-/media/Project/Site/Videos/innovation-hero.mp4"
      }
    },
    "backgroundImage": {
      "value": {
        "src": "/-/media/Project/Site/Banners/innovation-fallback.jpg",
        "alt": "Innovation concept image",
        "width": "1920",
        "height": "1080"
      }
    },
    "backgroundImageMobile": {
      "value": {
        "src": "/-/media/Project/Site/Banners/Mobile/innovation-mobile.jpg",
        "alt": "Innovation concept",
        "width": "800",
        "height": "800"
      }
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Data sources: `/sitecore/content/[Site]/Home/Data/Video Banners/`
- Videos: `/sitecore/media library/Project/[Site]/Videos/`

### Experience Editor Behavior

- **Inline editable fields:** heading
- **Forms panel required:** backgroundVideo, backgroundImage, backgroundImageMobile
- **Video preview:** Video may not autoplay in Experience Editor
- **Placeholder:** Add buttons via the "buttons" placeholder

### Video Player Behavior

- **Autoplay:** Yes (required for background video effect)
- **Muted:** Yes (required for autoplay to work)
- **Loop:** Yes (continuous playback)
- **PlaysInline:** Yes (prevents fullscreen on iOS)
- **Controls:** Hidden (no user controls shown)

### Accessibility Features

- **role="region":** Component has region role for landmark navigation
- **aria-label:** Set to the heading value (or "Video banner" fallback)
- **aria-hidden:** Video and overlay are hidden from assistive technology
- **sr-only:** Fallback text "Your browser does not support the video tag" for screen readers

### Personalization Opportunities

- **heading:** Personalize messaging based on visitor segments
- **backgroundVideo:** Use different videos for different campaigns
- **Buttons:** Show different CTAs based on visitor behavior

## Common Mistakes to Avoid

1. **Large video files:** Keep videos under 10MB for fast loading. Compress using tools like HandBrake.

2. **Videos with audio:** Background videos must be silent. Autoplay with audio is blocked by browsers.

3. **Fast-moving content:** Subtle, slow motion works best for background videos. Avoid quick cuts or fast action.

4. **Missing fallback image:** Always provide a fallback image for users on slow connections or older browsers.

5. **Overly long headings:** Keep headlines short for readability over moving backgrounds.

6. **No video source:** If `backgroundVideo.value.src` is missing, the component shows only the overlay.

7. **Performance on mobile:** Consider whether video is necessary on mobile; images may provide better performance.

## Related Components

- `HeroBanner` - Static image background banner
- `ContentBanner` - Banner with gradient overlay
- `SplitBanner` - Side-by-side image and content layout
- `TextBanner` - Text-only banner without media

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the VideoBanner component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the VideoBanner rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)
4. Have media IDs for video and fallback images

### Step 1: Find the Target Page

```javascript
// Search for the page where VideoBanner will be added
await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Home Page"
});
// Returns: { itemId: "page-guid", name: "PageName", path: "/sitecore/..." }
```

### Step 2: Add VideoBanner to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "video-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "VideoBanner_1",
  language: "en",
  fields: {
    "heading": "Experience the Future Today"
  }
});

// Returns:
// {
//   "datasourceId": "created-datasource-guid",
//   "placeholderId": "headless-main"
// }
```

**IMPORTANT:** Save the `datasourceId` - it's needed for updating media fields.

### Step 3: Update Video and Image Fields

Video and image fields require XML format with specific syntax:

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,  // From Step 2
  language: "en",
  fields: {
    "backgroundVideo": "<image mediaid='{VIDEO-GUID-HERE}' />",
    "backgroundImage": "<image mediaid='{IMAGE-GUID-HERE}' />",
    "backgroundImageMobile": "<image mediaid='{MOBILE-IMAGE-GUID}' />"
  }
});
```

**Video/Image Field Rules:**

- MUST use single quotes around attribute values
- GUID MUST be wrapped in braces: `{GUID}`
- GUID should be UPPERCASE
- Video uses same XML format as images
- If media needs uploading first, use `/sitecore-upload-media` skill

### Step 4: Add Button Components (Optional)

Add buttons to the buttons placeholder:

```javascript
await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "button-rendering-id",
  placeholderPath: "headless-main/buttons-{VIDEO-BANNER-UID}",
  componentItemName: "VideoBanner_CTA",
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
// STEP 2: Add VideoBanner component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "video-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "VideoBanner_Hero",
  language: "en",
  fields: {
    "heading": "Experience the Future of Innovation"
  }
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update video and image fields
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "backgroundVideo": "<image mediaid='{ABC12345-DEF6-7890-GHIJ-KLMNOPQRSTUV}' />",
    "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "backgroundImageMobile": "<image mediaid='{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: VideoBanner with all fields populated
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field                 | Type             | MCP Format                          |
| :-------------------- | :--------------- | :---------------------------------- |
| heading               | Single-Line Text | `"Plain text value"`                |
| backgroundVideo       | File/Image       | `<image mediaid='{GUID}' />`        |
| backgroundImage       | Image            | `<image mediaid='{GUID}' />`        |
| backgroundImageMobile | Image            | `<image mediaid='{GUID}' />`        |

### MCP Authoring Checklist

Before authoring VideoBanner via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have VideoBanner rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `VideoBanner_1`)
- [ ] Have media GUID for backgroundVideo (MP4 file)
- [ ] Video is uploaded to Media Library as MP4
- [ ] Media XML uses single quotes and braces: `<image mediaid='{GUID}' />`

### MCP Error Handling

| Error                  | Cause                   | Solution                                    |
| :--------------------- | :---------------------- | :------------------------------------------ |
| "Item already exists"  | Duplicate component name | Use unique suffix: `VideoBanner_2`         |
| Component not visible  | Wrong placeholder path   | Use `"headless-main"` without leading slash |
| Video not playing      | Wrong media format       | Ensure MP4 format, check GUID               |
| `updatedFields: {}`    | Normal response          | Update succeeded despite empty response    |
| "Cannot find field"    | Wrong field name         | Field names are case-sensitive             |

### Related Skills for MCP Authoring

| Skill                          | Purpose                                  |
| :----------------------------- | :--------------------------------------- |
| `/sitecore-author-placeholder` | Placeholder path construction rules      |
| `/sitecore-author-image`       | Media field XML formatting details       |
| `/sitecore-upload-media`       | Upload videos to Media Library first     |
| `/sitecore-pagebuilder`        | Full page creation workflow              |

---

## Change Log

| Date       | Change                | Author      |
| ---------- | --------------------- | ----------- |
| 2026-02-09 | Initial documentation | Claude Code |
