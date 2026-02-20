# Card Component

## Purpose
Card is a self-contained content card that combines an image, an optional badge label, a heading, rich-text body copy, and a link. In non-editing mode the entire card surface becomes a clickable `<Link>` wrapping all child elements, giving users a large tap/click target. In Experience Editor mode, the card renders as a plain `<div>` to avoid nested interactive element issues. The image animates with a subtle scale-on-hover effect, and the badge overlays the top-left corner of the image. Card is designed to be used as a child component inside CardBanner, CardCarousel, and CardGrid placeholders.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `022420b6-3db0-4eab-9ea5-1f57e0f345bf` |
| **Component Name** | `Card` |
| **Category** | `Cards` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation / Constraints |
|------------|--------------|----------|-------------|--------------------------|
| `badge` | Single-Line Text (`Field<string>`) | No | Short label rendered as an overlay badge in the top-left of the image | Hidden when value is empty; plain text only |
| `image` | Image (`ImageField`) | Yes | Primary card image rendered at 640×360 | Displayed as `object-cover`; aspect-ratio square container |
| `imageMobile` | Image (`ImageField`) | Yes | Mobile-specific image fallback | Handled by `useImage` hook |
| `heading` | Single-Line Text (`Field<string>`) | Yes | Card headline rendered as `<h3>` | Truncated to 2 lines in non-edit mode (`line-clamp-2`) |
| `body` | Rich Text (`RichTextField`) | Yes | Body copy beneath the heading | Supports inline HTML via `RichText` |
| `link` | General Link (`LinkField`) | Yes | Destination URL and link text; also drives the button and wraps the whole card | href + display text required for the card to be clickable |

## Placeholders
**Placeholders:** None

The Card component does not define any child placeholders. It is itself placed as a child inside CardBanner (`cards`), CardCarousel (`cardcarousel`), and CardGrid (`cardgrid`) placeholders.

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `body` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `image` / `imageMobile` | `<NextImage>` | `import { NextImage } from '@sitecore-content-sdk/nextjs'` |
| `link` (card wrapper) | `<Link>` | `import { Link } from '@sitecore-content-sdk/nextjs'` |
| `badge` | `<Text>` inside `<Badge>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| Edit-mode check | `useSitecore()` → `page.mode.isEditing` | `import { useSitecore } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Standard card with image, badge, heading, body, and link |

## Props Interface
```typescript
// Defined in components/Cards/Card/Card.tsx
import { Field, LinkField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ImageProps } from 'lib/hooks/useImage';

export type CardBadgeProps = {
  badge?: Field<string>;
};

export type CardFields = CardBadgeProps &
  ImageProps & {
    heading: Field<string>;
    body: RichTextField;
    link: LinkField;
  };

export type CardFieldsProps = {
  fields: CardFields;
  textColor?: string;
};

export type CardProps = ComponentProps & CardFieldsProps;
```

> `ImageProps` (from `lib/hooks/useImage`) provides `image: ImageField` and `imageMobile: ImageField`.

## Example Content Entry

### Minimum Viable Content
```json
{
  "componentName": "Card",
  "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard",
  "fields": {
    "image": {
      "value": { "src": "/media/cards/product-card.jpg", "alt": "Product photo", "width": 640, "height": 360 }
    },
    "imageMobile": {
      "value": { "src": "/media/cards/product-card-mobile.jpg", "alt": "Product photo", "width": 400, "height": 400 }
    },
    "heading": { "value": "Product Name" },
    "body": { "value": "<p>A short description of the product and its key benefits.</p>" },
    "link": { "value": { "href": "/products/product-name", "text": "Read More" } }
  }
}
```

### Full Content Example
```json
{
  "componentName": "Card",
  "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard",
  "fields": {
    "badge": { "value": "New" },
    "image": {
      "value": { "src": "/media/cards/product-card.jpg", "alt": "Product photo", "width": 640, "height": 360 }
    },
    "imageMobile": {
      "value": { "src": "/media/cards/product-card-mobile.jpg", "alt": "Product photo", "width": 400, "height": 400 }
    },
    "heading": { "value": "Flagship Product 2026" },
    "body": { "value": "<p>Our most advanced model yet, combining precision engineering with intuitive design for professionals who demand the best.</p>" },
    "link": { "value": { "href": "/products/flagship-2026", "text": "Discover More" } }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
Cards are added through a parent container's placeholder — they are not placed directly on a page layout. To add a Card:
1. Open the parent component (CardBanner, CardCarousel, or CardGrid) already on the page.
2. Click **Add component** inside its card placeholder (`cards`, `cardcarousel`, or `cardgrid`).
3. Select **Card** and assign or create a datasource item.

### Step 2: Populate Fields
| Field | Action |
|-------|--------|
| `image` | Select a landscape image from the Media Library (required). Provide descriptive alt text. |
| `imageMobile` | Select or upload a square or portrait crop for mobile (required). |
| `heading` | Enter the card title (required). Text is clamped to 2 lines in display mode. |
| `body` | Enter supporting copy using the rich-text editor (required). |
| `link` | Set the destination URL and link display text (required). This drives the card's clickable wrapper and the inline button. |
| `badge` | Optionally enter a short badge label (e.g. "New", "Sale"). Leave blank to suppress the badge. |

### Field Type Quick Reference
| Field | Sitecore Template Field Type | Notes |
|-------|------------------------------|-------|
| `badge` | Single-Line Text | Optional; overlay badge; plain text |
| `image` | Image | Recommended 640×360px; always provide alt text |
| `imageMobile` | Image | Recommended 400×400px (square) |
| `heading` | Single-Line Text | Renders as `<h3>`; clamped at 2 lines |
| `body` | Rich Text | Supports bold, italic, links, lists |
| `link` | General Link | href + text required for card to be clickable |

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
