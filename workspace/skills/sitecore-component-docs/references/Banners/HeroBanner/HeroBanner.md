# HeroBanner Component

## Purpose
HeroBanner is the primary page hero section, designed to display a full-viewport-height background image with an `<h1>` heading, optional rich-text subheading, and a `buttons` placeholder for CTA links. It applies a semi-transparent black overlay (`bg-black/25`) on top of the background image to ensure text legibility across diverse imagery. Content alignment, theme, and text direction are all controlled by the parent Frame context.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `5e9d7b60-f61b-407b-b04b-2eeba60b0ec0` |
| **Component Name** | `HeroBanner` |
| **Category** | `Banners` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation / Constraints |
|------------|--------------|----------|-------------|--------------------------|
| `backgroundImage` | Image (`ImageField`) | Yes | Desktop background image covering the full hero area | Recommended min-width 1920px; used by `BackgroundImage` helper |
| `backgroundImageMobile` | Image (`ImageField`) | Yes | Mobile-specific background image | Recommended min-width 768px; swapped in below `md` breakpoint |
| `heading` | Single-Line Text (`Field<string>`) | Yes | Page-level `<h1>` headline | Non-empty; displayed at `heading-4xl` / `heading-5xl` (md+) |
| `subheading` | Rich Text (`Field<string>`) | No | Supporting subheadline rendered beneath the main heading | Supports inline HTML via `RichText` |

## Placeholders
| Placeholder Key | Allowed Components | Notes |
|----------------|--------------------|-------|
| `buttons` | Button | Rendered in a flex row aligned to the Frame's `contentAlignment`; supports multiple buttons |

> The placeholder name is generated via `placeholderGenerator(params, 'buttons')`.

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `subheading` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `backgroundImage` / `backgroundImageMobile` | `<BackgroundImage>` (shared) | `import { BackgroundImage } from 'component-children/Shared/BackgroundImage/BackgroundImage'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Standard full-hero background image with heading and optional subheading |

## Props Interface
```typescript
// From components/Banners/HeroBanner/HeroBanner.tsx
import { HeroBannerProps } from 'lib/types/components/Banners/hero-banner';

// Inferred shape:
type HeroBannerProps = ComponentProps & {
  fields: {
    backgroundImage: ImageField;
    backgroundImageMobile: ImageField;
    heading: Field<string>;
    subheading?: Field<string>;
  };
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "componentName": "HeroBanner",
  "dataSource": "/sitecore/content/MySite/Data/Banners/HomeHero",
  "fields": {
    "backgroundImage": {
      "value": { "src": "/media/banners/hero-desktop.jpg", "alt": "Hero image", "width": 1920, "height": 900 }
    },
    "backgroundImageMobile": {
      "value": { "src": "/media/banners/hero-mobile.jpg", "alt": "Hero image", "width": 768, "height": 600 }
    },
    "heading": { "value": "Welcome to Our Brand" }
  }
}
```

### Full Content Example
```json
{
  "componentName": "HeroBanner",
  "dataSource": "/sitecore/content/MySite/Data/Banners/HomeHero",
  "fields": {
    "backgroundImage": {
      "value": { "src": "/media/banners/hero-desktop.jpg", "alt": "Aerial cityscape at sunrise", "width": 1920, "height": 900 }
    },
    "backgroundImageMobile": {
      "value": { "src": "/media/banners/hero-mobile.jpg", "alt": "Aerial cityscape at sunrise", "width": 768, "height": 600 }
    },
    "heading": { "value": "Welcome to Our Brand" },
    "subheading": { "value": "<p>The best products. The best service. Every time.</p>" }
  },
  "placeholders": {
    "buttons": [
      { "componentName": "Button", "fields": { "link": { "value": { "href": "/shop", "text": "Shop Now" } } } },
      { "componentName": "Button", "fields": { "link": { "value": { "href": "/about", "text": "Learn More" } } } }
    ]
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
1. Open the target page in Sitecore Pages or Experience Editor.
2. Click **Add component** in the desired layout slot (typically the first row at the top of the page).
3. Search for **HeroBanner** and select it.
4. Assign or create a datasource under the site's Data/Banners folder.

### Step 2: Populate Fields
| Field | Action |
|-------|--------|
| `backgroundImage` | Select a landscape image from the Media Library (required). Provide descriptive alt text. |
| `backgroundImageMobile` | Select or upload a portrait/cropped version for mobile (required). |
| `heading` | Enter the primary page headline (required). This becomes the page's `<h1>`. |
| `subheading` | Optionally add a supporting sentence or two using the rich-text editor. |

### Step 3: Add Buttons
1. In the `buttons` placeholder, click **Add component** and select **Button**.
2. Configure the link URL, text, and optional styling variant.
3. Add a second button for a secondary CTA if needed.

### Field Type Quick Reference
| Field | Sitecore Template Field Type | Notes |
|-------|------------------------------|-------|
| `backgroundImage` | Image | Use Media Library; recommended 1920×900px minimum |
| `backgroundImageMobile` | Image | Use Media Library; recommended 768×600px minimum |
| `heading` | Single-Line Text | Plain text; renders as `<h1>` |
| `subheading` | Rich Text | Supports bold, italic, links |

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
