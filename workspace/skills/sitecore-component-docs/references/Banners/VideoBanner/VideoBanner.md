# VideoBanner Component

## Purpose
VideoBanner renders a full-viewport-height banner with an auto-playing, muted, looping background video. When a video URL is provided, it is loaded as an MP4 source inside a `<video>` element with a `bg-black/40` overlay to ensure heading legibility. An optional fallback background image is shown when no video URL is present. A `buttons` placeholder is available for CTAs positioned below the heading. Video errors are caught and logged; lazy loading is handled via a `useEffect` with an error listener.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `77685258-dca2-4a26-90ab-1844f73548f7` |
| **Component Name** | `VideoBanner` |
| **Category** | `Banners` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation / Constraints |
|------------|--------------|----------|-------------|--------------------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Primary banner headline rendered as `<h1>` | Non-empty; displayed at `heading-4xl` / `heading-5xl` (md+) |
| `backgroundVideo` | File / Single-Line Text (`Field<string>`) | Yes | URL or path to the background video file | Must resolve to a valid MP4; loaded as `<source type="video/mp4">` |
| `backgroundImage` | Image (`ImageField`) | No | Fallback desktop background image when video is absent | Used by `BackgroundImage` helper; recommended 1920px+ wide |
| `backgroundImageMobile` | Image (`ImageField`) | No | Fallback mobile background image | Recommended 768px+ wide; swapped in below `md` breakpoint |

## Placeholders
| Placeholder Key | Allowed Components | Notes |
|----------------|--------------------|-------|
| `buttons` | Button | Rendered in a centered flex row; `editable={false}` is set on the Placeholder (buttons cannot be edited inline in Experience Editor — use the placeholder settings panel) |

> The placeholder name is generated via `placeholderGenerator(params, 'buttons')`.

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `backgroundImage` / `backgroundImageMobile` | `<BackgroundImage>` (shared) | `import { BackgroundImage } from 'component-children/Shared/BackgroundImage/BackgroundImage'` |
| `backgroundVideo` | Native `<video>` / `<source>` | Value accessed via `fields?.backgroundVideo?.value?.src` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Full-width video background banner with heading and optional buttons |

## Props Interface
```typescript
// From lib/types/components/Banners/video-banner (inferred)
import { VideoBannerProps } from 'lib/types/components/Banners/video-banner';

type VideoBannerProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    backgroundVideo: Field<string>;   // .value.src holds the video URL
    backgroundImage?: ImageField;
    backgroundImageMobile?: ImageField;
  };
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "componentName": "VideoBanner",
  "dataSource": "/sitecore/content/MySite/Data/Banners/HomeVideoBanner",
  "fields": {
    "heading": { "value": "Innovation in Motion" },
    "backgroundVideo": { "value": { "src": "/media/videos/hero-loop.mp4" } }
  }
}
```

### Full Content Example
```json
{
  "componentName": "VideoBanner",
  "dataSource": "/sitecore/content/MySite/Data/Banners/HomeVideoBanner",
  "fields": {
    "heading": { "value": "Innovation in Motion" },
    "backgroundVideo": { "value": { "src": "/media/videos/hero-loop.mp4" } },
    "backgroundImage": {
      "value": { "src": "/media/banners/video-fallback-desktop.jpg", "alt": "Abstract flowing light", "width": 1920, "height": 900 }
    },
    "backgroundImageMobile": {
      "value": { "src": "/media/banners/video-fallback-mobile.jpg", "alt": "Abstract flowing light", "width": 768, "height": 600 }
    }
  },
  "placeholders": {
    "buttons": [
      { "componentName": "Button", "fields": { "link": { "value": { "href": "/explore", "text": "Explore Now" } } } }
    ]
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
1. Open the target page in Sitecore Pages or Experience Editor.
2. Click **Add component** in the desired layout slot.
3. Search for **VideoBanner** and select it.
4. Assign or create a datasource under the site's Data/Banners folder.

### Step 2: Populate Fields
| Field | Action |
|-------|--------|
| `heading` | Enter the primary headline text (required). This renders as `<h1>`. |
| `backgroundVideo` | Enter the MP4 video URL or upload to the Media Library and link the file (required). |
| `backgroundImage` | Optionally add a desktop fallback image shown before video loads or if video fails. |
| `backgroundImageMobile` | Optionally add a mobile fallback image. |

### Step 3: Add Buttons (Optional)
1. In the `buttons` placeholder, click **Add component** and select **Button**.
2. Note: because `editable={false}` is set, inline editing of buttons is disabled. Use the placeholder settings panel or datasource configuration to manage buttons.

### Accessibility Notes
- The `<video>` element is marked `aria-hidden="true"` — it is decorative.
- The section has `role="region"` and `aria-label` set to the heading text for screen reader navigation.
- A screen-reader-only `<p>` with translation key `'Your browser does not support the video tag.'` is provided as fallback copy inside the `<video>` element.

### Field Type Quick Reference
| Field | Sitecore Template Field Type | Notes |
|-------|------------------------------|-------|
| `heading` | Single-Line Text | Renders as `<h1>`; plain text only |
| `backgroundVideo` | File or Single-Line Text | Must be an MP4 URL; `.value.src` is read directly |
| `backgroundImage` | Image | Fallback for desktop; provide alt text |
| `backgroundImageMobile` | Image | Fallback for mobile; provide alt text |

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
