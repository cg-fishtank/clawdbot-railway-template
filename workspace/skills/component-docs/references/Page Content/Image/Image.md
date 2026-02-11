# Image

## Purpose

The Image component displays a full-width image with an optional caption derived from the image's alt text. It renders images in a 16:9 aspect ratio (video aspect) within a full-width container, with a centered caption displayed below. This component is ideal for hero images, feature illustrations, or any visual content that deserves full-width presentation.

## Sitecore Configuration

### Template Path

`/sitecore/templates/Project/[Site]/Page Content/Image`

### Data Source Location

`/sitecore/content/[Site]/Home/Data/Images/`

## Fields

| Field       | Sitecore Type | Required | Constraints                | Description                              |
| ----------- | ------------- | -------- | -------------------------- | ---------------------------------------- |
| image       | Image         | Yes      | 16:9 aspect ratio display  | Desktop/primary image                    |
| imageMobile | Image         | No       | 16:9 aspect ratio display  | Mobile-specific image (fallback to image)|

### Field Details

#### image

- **Type:** Image
- **Required:** Yes
- **Dimensions:** 1920x1080px recommended (16:9 aspect ratio)
- **Aspect Ratio:** 16:9 (video) - displayed with object-cover
- **Formats:** JPG, PNG, WebP
- **Alt Text:** Required - displays as caption below image
- **Example:**
  ```json
  {
    "value": {
      "src": "/-/media/Project/Site/Images/team-collaboration.jpg",
      "alt": "Our team collaborating in the modern office space",
      "width": "1920",
      "height": "1080"
    }
  }
  ```

#### imageMobile

- **Type:** Image
- **Required:** No
- **Dimensions:** 1024x576px recommended
- **Aspect Ratio:** 16:9
- **Formats:** JPG, PNG, WebP
- **Guidance:** Provide a mobile-optimized version. Falls back to `image` if not set.
- **Example:**
  ```json
  {
    "value": {
      "src": "/-/media/Project/Site/Images/Mobile/team-collaboration-mobile.jpg",
      "alt": "Team collaboration",
      "width": "1024",
      "height": "576"
    }
  }
  ```

## Rendering Parameters

| Parameter | Type     | Options                      | Default | Description              |
| --------- | -------- | ---------------------------- | ------- | ------------------------ |
| theme     | Droplist | primary, secondary, tertiary | primary | Caption text theme       |

## Component Interface

```typescript
// ImageProps from lib/hooks/useImage
type ImageProps = {
  image: ImageField;
  imageMobile: ImageField;
};

type ImageComponentFields = {
  fields: ImageProps;
};

type ImageComponentProps = ComponentProps & ImageComponentFields;
```

## JSS Field Mapping

| Field | JSS Component                                    | Usage                             |
| ----- | ------------------------------------------------ | --------------------------------- |
| image | `<NextImage field={image} />`                    | Full-width with object-cover      |
| alt   | `<p>{image?.value?.alt as string}</p>`           | Displayed as caption below image  |

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Images/hero-image.jpg",
        "alt": "Hero image description"
      }
    }
  }
}
```

### Complete (All Fields)

```json
{
  "fields": {
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Images/office-aerial.jpg",
        "alt": "Aerial view of our corporate headquarters in downtown Seattle",
        "width": "1920",
        "height": "1080"
      }
    },
    "imageMobile": {
      "value": {
        "src": "/-/media/Project/Site/Images/Mobile/office-aerial-mobile.jpg",
        "alt": "Our corporate headquarters",
        "width": "1024",
        "height": "576"
      }
    }
  }
}
```

## Authoring Rules

1. **Descriptive alt text is critical:** The alt text serves dual purposes - accessibility and as the visible caption. Write it accordingly.
2. **16:9 aspect ratio:** Upload images in 16:9 ratio or ensure the subject matter works well when cropped to this ratio.
3. **High resolution:** Full-width images need high resolution. Minimum 1920px wide for desktop.
4. **Mobile optimization:** Provide imageMobile for better performance on mobile devices.

## Common Mistakes

| Mistake                   | Why It's Wrong                               | Correct Approach                           |
| ------------------------- | -------------------------------------------- | ------------------------------------------ |
| Generic alt text          | Alt text becomes the caption                 | Write descriptive, caption-worthy alt text |
| Low resolution images     | Images appear blurry at full width           | Use 1920x1080px minimum for desktop        |
| Wrong aspect ratio        | Important content may be cropped             | Upload images in 16:9 or test cropping     |
| Missing alt text          | Breaks caption display and accessibility     | Always provide meaningful alt text         |

## Related Components

- `ContentBlock` - For smaller images with heading and body text
- `CTACard` - For square images in card format
- `HeroBanner` - For full-width images with text overlay

## Visual Layout

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│                                                                    │
│                         Full-Width Image                           │
│                        (16:9 Aspect Ratio)                        │
│                                                                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
              Alt text displayed as caption here
```

## Special Behavior

### Alt Text as Caption

The component uses the image's alt text as the displayed caption. This means:
- Alt text should be written as a caption (sentence case, descriptive)
- It serves both accessibility and visual purposes
- Missing alt text results in no caption display

### Responsive Image Switching

The component uses the `useImage` hook to automatically switch between `image` and `imageMobile` based on viewport width (breakpoint at 1024px).

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the Image component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the Image rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)
4. Have media IDs for the image fields

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "About Page"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add Image Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "image-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "Image_1",
  language: "en",
  fields: {}
});

const datasourceId = result.datasourceId;
```

### Step 3: Update Image Fields

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "image": "<image mediaid='{IMAGE-GUID}' alt='Aerial view of corporate headquarters' />",
    "imageMobile": "<image mediaid='{MOBILE-IMAGE-GUID}' alt='Corporate headquarters' />"
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
  search_query: "Company Overview"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add Image component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "image-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "Image_Headquarters",
  language: "en",
  fields: {}
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
    "image": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "imageMobile": "<image mediaid='{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: Image component with desktop and mobile images
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field       | Type  | MCP Format                       |
|:------------|:------|:---------------------------------|
| image       | Image | `<image mediaid='{GUID}' />`     |
| imageMobile | Image | `<image mediaid='{GUID}' />`     |

### MCP Authoring Checklist

Before authoring Image via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have Image rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `Image_1`)
- [ ] Have media GUIDs for image fields
- [ ] Image XML uses single quotes and braces: `<image mediaid='{GUID}' />`
- [ ] Images have alt text set in Media Library

### MCP Error Handling

| Error                 | Cause                    | Solution                                |
|:----------------------|:-------------------------|:----------------------------------------|
| "Item already exists" | Duplicate component name | Use unique suffix: `Image_2`            |
| Component not visible | Wrong placeholder path   | Use `"headless-main"` without leading slash |
| Image not showing     | Wrong XML format         | Verify single quotes, braces around GUID|
| Missing caption       | No alt text on image     | Set alt text in Media Library item      |

### Note on Alt Text

The alt text that displays as the caption comes from the Media Library item, not from the image field XML. Ensure the media item has appropriate alt text before adding it to this component.

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
