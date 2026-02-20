# SplitBanner Component

## Purpose
SplitBanner is a two-column banner that places an image on one side and authored text content on the other. The image column fills exactly half the banner width on large viewports, while the content column holds a heading, optional subheading, optional body copy, a link field, and a `buttons` placeholder. A `Contained` variant wraps the same layout inside a `ContainedWrapper` to constrain its maximum width to the site's content grid, whereas the `Default` variant spans the full viewport width.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `f22c31f6-9a23-406b-8285-4391a49926f7` |
| **Component Name** | `SplitBanner` |
| **Category** | `Banners` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation / Constraints |
|------------|--------------|----------|-------------|--------------------------|
| `image` | Image (`ImageField`) | Yes | Desktop image displayed in the image half of the banner | Recommended min-width 960px; used by `useImage` hook which falls back to `imageMobile` |
| `imageMobile` | Image (`ImageField`) | Yes | Mobile-specific image | Recommended min-width 768px |
| `heading` | Single-Line Text (`Field<string>`) | Yes | Main banner headline rendered as `<h2>` | Non-empty; displayed at `heading-4xl` / `heading-5xl` (lg+) |
| `subheading` | Rich Text (`Field<string>`) | No | Secondary headline or introductory line beneath the main heading | Supports inline HTML |
| `body` | Rich Text (`Field<string>`) | No | Longer descriptive body copy | Supports inline HTML |
| `link` | General Link (`LinkField`) | No | Optional standalone link (separate from placeholder buttons) | href + link text |

## Placeholders
| Placeholder Key | Allowed Components | Notes |
|----------------|--------------------|-------|
| `buttons` | Button | Rendered in a flex row below the body copy; supports multiple CTAs |

> The placeholder name is generated via `placeholderGenerator(params, 'buttons')`.

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `subheading` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `body` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `image` / `imageMobile` | `<HalfWidthImage>` (shared) | `import { HalfWidthImage } from 'component-children/Shared/Image/Image'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Full-width two-column layout; image fills its half to the viewport edge |
| Contained | `Contained` | Same layout wrapped in `ContainedWrapper`; max-width constrained to site content grid |

### Contained Variant Implementation
The `Contained` export renders `ContainedSplitBanner`, which wraps the base `SplitBanner` child inside a `<ContainedWrapper>` and passes `variant="Contained"` to the child for `data-variant` attribution.

## Props Interface
```typescript
// From lib/types/components/Banners/split-banner (inferred)
import { SplitBannerProps } from 'lib/types/components/Banners/split-banner';

type SplitBannerProps = ComponentProps & {
  fields: {
    image: ImageField;
    imageMobile: ImageField;
    heading: Field<string>;
    subheading?: Field<string>;
    body?: Field<string>;
    link?: LinkField;
  };
  variant?: 'Default' | 'Contained';
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "componentName": "SplitBanner",
  "dataSource": "/sitecore/content/MySite/Data/Banners/FeatureSplitBanner",
  "fields": {
    "image": {
      "value": { "src": "/media/banners/split-desktop.jpg", "alt": "Product in use", "width": 960, "height": 700 }
    },
    "imageMobile": {
      "value": { "src": "/media/banners/split-mobile.jpg", "alt": "Product in use", "width": 768, "height": 500 }
    },
    "heading": { "value": "Built for Performance" }
  }
}
```

### Full Content Example
```json
{
  "componentName": "SplitBanner",
  "dataSource": "/sitecore/content/MySite/Data/Banners/FeatureSplitBanner",
  "fields": {
    "image": {
      "value": { "src": "/media/banners/split-desktop.jpg", "alt": "Product in use", "width": 960, "height": 700 }
    },
    "imageMobile": {
      "value": { "src": "/media/banners/split-mobile.jpg", "alt": "Product in use", "width": 768, "height": 500 }
    },
    "heading": { "value": "Built for Performance" },
    "subheading": { "value": "<p>Engineered to exceed expectations.</p>" },
    "body": { "value": "<p>Our product line combines cutting-edge materials with precision manufacturing to deliver unmatched durability and reliability in every environment.</p>" },
    "link": { "value": { "href": "/products/performance", "text": "View Range" } }
  },
  "placeholders": {
    "buttons": [
      { "componentName": "Button", "fields": { "link": { "value": { "href": "/contact", "text": "Get a Quote" } } } }
    ]
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
1. Open the target page in Sitecore Pages or Experience Editor.
2. Click **Add component** in the desired layout slot.
3. Search for **SplitBanner** and select either the **Default** or **Contained** variant.
4. Assign or create a datasource under the site's Data/Banners folder.

### Step 2: Choose a Variant
| Variant | When to Use |
|---------|-------------|
| Default | When the banner should bleed to the viewport edge (e.g. a hero-like mid-page moment) |
| Contained | When the banner should align to the site's content grid (e.g. inside an article or product page) |

### Step 3: Populate Fields
| Field | Action |
|-------|--------|
| `image` | Select a desktop landscape image from the Media Library (required). |
| `imageMobile` | Select or upload a mobile-optimised crop (required). |
| `heading` | Enter the main headline text (required). |
| `subheading` | Optionally add a secondary headline using the rich-text editor. |
| `body` | Optionally add supporting paragraph copy. |
| `link` | Optionally add a standalone text link (separate from placeholder buttons). |

### Step 4: Add Buttons
1. In the `buttons` placeholder, click **Add component** and select **Button**.
2. Configure the link URL, text, and styling variant.

### Field Type Quick Reference
| Field | Sitecore Template Field Type | Notes |
|-------|------------------------------|-------|
| `image` | Image | Landscape; recommended 960px+ wide |
| `imageMobile` | Image | Portrait/square crop; recommended 768px wide |
| `heading` | Single-Line Text | Renders as `<h2>` |
| `subheading` | Rich Text | Bold/italic/links supported |
| `body` | Rich Text | Full rich-text editing supported |
| `link` | General Link | Internal or external URL + display text |

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
