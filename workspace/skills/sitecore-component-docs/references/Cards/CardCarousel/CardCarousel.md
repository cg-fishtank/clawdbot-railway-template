# CardCarousel Component

## Purpose
CardCarousel renders a horizontally scrollable carousel of Card components powered by `react-slick`. It displays a section heading alongside previous/next arrow buttons (shown only when there are more cards than the current `slidesToShow` value). The number of visible slides is responsive: 1 on mobile (< 768px), 2 on tablet (768–1023px), and 3 on desktop (≥ 1024px). In Experience Editor mode, the carousel degrades gracefully to a wrapped flex grid so authors can still add and manage cards without the carousel interaction getting in the way.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `4180edc5-2601-4b67-bea5-586bdd311311` |
| **Component Name** | `CardCarousel` |
| **Category** | `Cards` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation / Constraints |
|------------|--------------|----------|-------------|--------------------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Section heading displayed above the carousel controls | Non-empty; displayed at `heading-4xl` in display mode, `heading-2xl` in edit mode |

## Placeholders
| Placeholder Key | Allowed Components | Notes |
|----------------|--------------------|-------|
| `cardcarousel` | Card | Placeholder key includes the dynamic placeholder suffix: `cardcarousel-{DynamicPlaceholderId}` |

> Unlike most components that use `placeholderGenerator`, CardCarousel constructs its placeholder key directly as `` `cardcarousel-${props.params.DynamicPlaceholderId}` ``. This means `DynamicPlaceholderId` must be set in the rendering parameters for the placeholder to resolve correctly.

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| Edit-mode check | `useSitecore()` → `page.mode.isEditing` | `import { useSitecore } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Responsive sliding carousel with arrow navigation and dot indicators |

## Carousel Behaviour Details
| Breakpoint | Slides Shown |
|-----------|-------------|
| < 768px (mobile) | 1 |
| 768–1023px (tablet) | 2 |
| ≥ 1024px (desktop) | 3 |

- **Infinite scroll:** Disabled (`infinite: false`) — carousel stops at the last slide.
- **Dot indicators:** Enabled; dot colour theme adapts to the effective Frame theme.
- **Arrow buttons:** Only rendered when there are more cards than `slidesToShow`.
- **Accessibility:** Hidden slides have their focusable child elements set to `tabindex="-1"` and `aria-hidden="true"` via a `MutationObserver` to prevent keyboard focus on off-screen cards.

## Props Interface
```typescript
// Defined in component-children/Cards/CardCarousel/CardCarousel.tsx
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

type CardCarouselFields = {
  heading: Field<string>;
};

export type CardCarouselProps = ComponentProps & {
  fields: CardCarouselFields;
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "componentName": "CardCarousel",
  "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCarousel",
  "params": {
    "DynamicPlaceholderId": "1"
  },
  "fields": {
    "heading": { "value": "Browse Our Range" }
  },
  "placeholders": {
    "cardcarousel-1": [
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard1" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard2" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard3" }
    ]
  }
}
```

### Full Content Example
```json
{
  "componentName": "CardCarousel",
  "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCarousel",
  "params": {
    "DynamicPlaceholderId": "1"
  },
  "fields": {
    "heading": { "value": "Browse Our Range" }
  },
  "placeholders": {
    "cardcarousel-1": [
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard1" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard2" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard3" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard4" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard5" }
    ]
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
1. Open the target page in Sitecore Pages or Experience Editor.
2. Click **Add component** in the desired layout slot.
3. Search for **CardCarousel** and select it.
4. Assign or create a datasource under the site's Data/Cards folder.

### Step 2: Populate Fields
| Field | Action |
|-------|--------|
| `heading` | Enter the carousel section heading (required). |

### Step 3: Add Cards
1. In the `cardcarousel` placeholder, click **Add component** and select **Card**.
2. Assign a Card datasource item.
3. Repeat for each additional card. A minimum of 4 cards is recommended to make the carousel controls visible on desktop (where 3 slides are shown simultaneously).

### Important Notes
- Arrow navigation only appears when the total number of cards exceeds the current `slidesToShow` count for the viewport.
- In Experience Editor mode, cards render as a flat wrapped grid instead of the carousel to enable authoring. Preview or CD delivery mode shows the carousel behaviour.
- The `DynamicPlaceholderId` rendering parameter must be set to ensure the placeholder key is unique when multiple CardCarousels appear on the same page.

### Field Type Quick Reference
| Field | Sitecore Template Field Type | Notes |
|-------|------------------------------|-------|
| `heading` | Single-Line Text | Renders as `<h3>`; plain text only |

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
