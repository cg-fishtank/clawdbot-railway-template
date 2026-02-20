# CardBanner Component

## Purpose
CardBanner is a full-width section that combines a background image with a centered heading and optional subheading, followed by a horizontally arranged row of Card components. It is designed to showcase a curated set of featured items (spotlight content) against a branded background. The component applies a translucent colour overlay — black at 20% opacity for dark/tertiary themes, white at 20% for light themes — to ensure the text and cards remain legible regardless of the background image.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `57c51166-b04d-47ef-ad66-2d9b566bc436` |
| **Component Name** | `CardBanner` |
| **Category** | `Cards` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation / Constraints |
|------------|--------------|----------|-------------|--------------------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Section headline rendered as `<h2>` above the card row | Non-empty; displayed at `copy-2xl` / `copy-4xl` (md+) |
| `subheading` | Rich Text (`Field<string>`) | No | Supporting text beneath the heading | Supports inline HTML via `RichText` |
| `backgroundImage` | Image (`ImageField`) | No | Desktop background image | Used by `BackgroundImage` helper; recommended 1920px+ wide |
| `backgroundImageMobile` | Image (`ImageField`) | No | Mobile-specific background image | Recommended 768px+ wide; swapped in below `md` breakpoint |

## Placeholders
| Placeholder Key | Allowed Components | Notes |
|----------------|--------------------|-------|
| `cards` | Card | Cards are rendered using `renderEach`; each card is wrapped in a `basis-60` flex item; layout is `flex-row` on `lg+`, `flex-col` on smaller viewports |

> The placeholder name is generated via `placeholderGenerator(params, 'cards')`.

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `subheading` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `backgroundImage` / `backgroundImageMobile` | `<BackgroundImage>` (shared) | `import { BackgroundImage } from 'component-children/Shared/BackgroundImage/BackgroundImage'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Full-width background image section with heading and horizontal card row |

## Props Interface
```typescript
// From lib/types (inferred via CardBannerProps)
import { CardBannerProps } from 'lib/types';

type CardBannerProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    subheading?: Field<string>;
    backgroundImage?: ImageField;
    backgroundImageMobile?: ImageField;
  };
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "componentName": "CardBanner",
  "dataSource": "/sitecore/content/MySite/Data/Cards/FeaturedCardBanner",
  "fields": {
    "heading": { "value": "Featured Products" }
  },
  "placeholders": {
    "cards": [
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard1" }
    ]
  }
}
```

### Full Content Example
```json
{
  "componentName": "CardBanner",
  "dataSource": "/sitecore/content/MySite/Data/Cards/FeaturedCardBanner",
  "fields": {
    "heading": { "value": "Featured Products" },
    "subheading": { "value": "<p>Hand-picked by our team — explore what's trending this season.</p>" },
    "backgroundImage": {
      "value": { "src": "/media/banners/card-banner-desktop.jpg", "alt": "Product collection backdrop", "width": 1920, "height": 700 }
    },
    "backgroundImageMobile": {
      "value": { "src": "/media/banners/card-banner-mobile.jpg", "alt": "Product collection backdrop", "width": 768, "height": 500 }
    }
  },
  "placeholders": {
    "cards": [
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard1" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard2" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard3" }
    ]
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
1. Open the target page in Sitecore Pages or Experience Editor.
2. Click **Add component** in the desired layout slot.
3. Search for **CardBanner** and select it.
4. Assign or create a datasource under the site's Data/Cards folder.

### Step 2: Populate Fields
| Field | Action |
|-------|--------|
| `heading` | Enter the section headline (required). |
| `subheading` | Optionally add a supporting sentence via the rich-text editor. |
| `backgroundImage` | Optionally select a desktop background image from the Media Library. |
| `backgroundImageMobile` | Optionally select a mobile-specific background image. |

### Step 3: Add Cards
1. In the `cards` placeholder, click **Add component** and select **Card**.
2. Assign a Card datasource item or create a new one.
3. Repeat for each additional card (3 cards is the typical layout for a balanced spotlight row).

### Layout Notes
- Cards stack vertically on mobile and tablet, then switch to a horizontal flex row on `lg+` (≥1024px).
- Each card occupies a `basis-60` flex basis. With 3 cards the section fills up to `max-w-6xl`.

### Field Type Quick Reference
| Field | Sitecore Template Field Type | Notes |
|-------|------------------------------|-------|
| `heading` | Single-Line Text | Renders as `<h2>` |
| `subheading` | Rich Text | Supports bold, italic, inline links |
| `backgroundImage` | Image | Optional; provide alt text |
| `backgroundImageMobile` | Image | Optional; provide alt text |

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
