# ContentBanner Component

## Purpose
ContentBanner is a full-width banner section that combines a background image with a gradient overlay and authored text content. It renders a heading, optional rich-text body copy, and a `buttons` placeholder for one or more CTA buttons. Content alignment and theme are driven by the parent Frame context, allowing the banner to adapt to both left- and right-aligned layouts without requiring per-instance configuration.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `c03d8136-d9f7-498c-b6dc-a0db7ef4aa91` |
| **Component Name** | `ContentBanner` |
| **Category** | `Banners` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation / Constraints |
|------------|--------------|----------|-------------|--------------------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Primary banner headline rendered as an `<h2>` | Non-empty; displayed at `heading-4xl` scale |
| `body` | Rich Text (`Field<string>`) | No | Supporting body copy rendered beneath the heading | Supports inline HTML via `RichText` |
| `backgroundImage` | Image (`ImageField`) | No | Desktop background image for the banner section | Recommended min-width 1920px; used by `BackgroundImage` helper |
| `backgroundImageMobile` | Image (`ImageField`) | No | Mobile-specific background image | Recommended min-width 768px; swapped in below `md` breakpoint |

## Placeholders
| Placeholder Key | Allowed Components | Notes |
|----------------|--------------------|-------|
| `buttons` | Button | Rendered inside a flex row; supports multiple buttons side-by-side |

> The placeholder name is generated via `placeholderGenerator(params, 'buttons')` and will include the dynamic placeholder suffix when used inside a repeating region.

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `body` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `backgroundImage` / `backgroundImageMobile` | `<BackgroundImage>` (shared) | `import { BackgroundImage } from 'component-children/Shared/BackgroundImage/BackgroundImage'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Standard full-width banner with background image and gradient |

## Props Interface
```typescript
// From components/Banners/ContentBanner/ContentBanner.tsx
import { ContentBannerProps } from 'lib/types/components/Banners/content-banner';

// Inferred shape:
type ContentBannerProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    body?: Field<string>;
    backgroundImage?: ImageField;
    backgroundImageMobile?: ImageField;
  };
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "componentName": "ContentBanner",
  "dataSource": "/sitecore/content/MySite/Data/Banners/HomepageContentBanner",
  "fields": {
    "heading": { "value": "Discover What's Possible" }
  }
}
```

### Full Content Example
```json
{
  "componentName": "ContentBanner",
  "dataSource": "/sitecore/content/MySite/Data/Banners/HomepageContentBanner",
  "fields": {
    "heading": { "value": "Discover What's Possible" },
    "body": { "value": "<p>Explore our full range of products and find the solution that fits your needs.</p>" },
    "backgroundImage": {
      "value": {
        "src": "/media/banners/content-banner-desktop.jpg",
        "alt": "Team collaborating in a modern office",
        "width": 1920,
        "height": 700
      }
    },
    "backgroundImageMobile": {
      "value": {
        "src": "/media/banners/content-banner-mobile.jpg",
        "alt": "Team collaborating in a modern office",
        "width": 768,
        "height": 500
      }
    }
  },
  "placeholders": {
    "buttons": [
      { "componentName": "Button", "fields": { "link": { "value": { "href": "/products", "text": "Shop Now" } } } }
    ]
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
1. Open the target page in Sitecore Pages or Experience Editor.
2. Locate the desired layout row/column and click **Add component**.
3. Search for **ContentBanner** and select it.
4. Assign a datasource item or create a new one under the site's Data/Banners folder.

### Step 2: Populate Fields
| Field | Action |
|-------|--------|
| `heading` | Enter the primary headline text (required). |
| `body` | Optionally enter supporting rich-text copy using the WYSIWYG editor. |
| `backgroundImage` | Upload or select a desktop image from the Media Library. |
| `backgroundImageMobile` | Upload or select a mobile image; leave blank to fall back to desktop image. |

### Step 3: Add Buttons
1. Inside the `buttons` placeholder on the banner, click **Add component**.
2. Select **Button** and configure its link and label.
3. Repeat for additional CTAs (they will render side-by-side in a flex row).

### Field Type Quick Reference
| Field | Sitecore Template Field Type | Notes |
|-------|------------------------------|-------|
| `heading` | Single-Line Text | Plain text only |
| `body` | Rich Text | Supports bold, italic, links, lists |
| `backgroundImage` | Image | Use Media Library; provide alt text |
| `backgroundImageMobile` | Image | Use Media Library; provide alt text |

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
