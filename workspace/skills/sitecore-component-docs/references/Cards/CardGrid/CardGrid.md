# CardGrid Component

## Purpose
CardGrid renders a responsive CSS grid of Card components beneath a section heading. The number of columns is configurable via the parent Frame context (`cardGrid` value: `md:grid-cols-2`, `md:grid-cols-3`, or `md:grid-cols-4`), defaulting to 3 columns when no Frame override is present. Three layout variants control the container behaviour: `Default` uses a `ContainedWrapper` with left-aligned heading, `ContentCentered` uses a `ContainedWrapper` with a centred heading, and `FullWidth` stretches to the full viewport edge using `FullWidthWrapper`.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `e78b588a-a213-411d-bfae-dd607ffd2c8b` |
| **Component Name** | `CardGrid` |
| **Category** | `Cards` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation / Constraints |
|------------|--------------|----------|-------------|--------------------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Section heading displayed above the card grid | Non-empty; displayed at `heading-3xl` |

## Placeholders
| Placeholder Key | Allowed Components | Notes |
|----------------|--------------------|-------|
| `cardgrid` | Card | Generated via `placeholderGenerator(params, 'cardgrid')`; all variants use the same placeholder key |

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Contained-width grid; heading is left-aligned; supports Frame `componentName` for variant-aware styling |
| ContentCentered | `ContentCentered` | Contained-width grid; heading and grid are centred; suitable for editorial sections |
| FullWidth | `FullWidth` | Full-viewport-width grid; heading and grid are centred; suitable for campaign or marketing sections |

### Variant Implementation Notes
- `Default` wraps content in `ContainedWrapper` and passes `componentName` to Frame for variant attribution.
- `ContentCentered` wraps in `ContainedWrapper` with `items-center` flex alignment on the outer div.
- `FullWidth` wraps in `FullWidthWrapper` with the same centred alignment, removing the max-width constraint.
- All three variants share `PlaceholderContainer`, which reads `cardGrid` from the Frame context to set the responsive column class.

## Column Configuration
The grid column count is driven by the Frame context's `cardGrid` property, not by a direct field on the component. The `PlaceholderContainer` defaults to `md:grid-cols-3` when no Frame override is set.

| Frame `cardGrid` value | Columns (md+) |
|------------------------|--------------|
| `md:grid-cols-2` | 2 |
| `md:grid-cols-3` | 3 (default) |
| `md:grid-cols-4` | 4 |

All variants are always 1 column on mobile (`grid-cols-1`).

## Props Interface
```typescript
// Defined in components/Cards/CardGrid/CardGrid.tsx
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

type CardGridFields = {
  heading: Field<string>;
};

type CardGridProps = ComponentProps & {
  fields: CardGridFields;
};

export const Default: React.FC<CardGridProps>;
export const ContentCentered: React.FC<CardGridProps>;
export const FullWidth: React.FC<CardGridProps>;
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "componentName": "CardGrid",
  "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCardGrid",
  "fields": {
    "heading": { "value": "Our Products" }
  },
  "placeholders": {
    "cardgrid": [
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard1" }
    ]
  }
}
```

### Full Content Example (ContentCentered, 3-column)
```json
{
  "componentName": "CardGrid",
  "variant": "ContentCentered",
  "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCardGrid",
  "fields": {
    "heading": { "value": "Our Products" }
  },
  "placeholders": {
    "cardgrid": [
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard1" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard2" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard3" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard4" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard5" },
      { "componentName": "Card", "dataSource": "/sitecore/content/MySite/Data/Cards/ProductCard6" }
    ]
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
1. Open the target page in Sitecore Pages or Experience Editor.
2. Click **Add component** in the desired layout slot.
3. Search for **CardGrid** and select the desired variant (**Default**, **ContentCentered**, or **FullWidth**).
4. Assign or create a datasource under the site's Data/Cards folder.

### Step 2: Choose a Variant
| Variant | When to Use |
|---------|-------------|
| Default | Standard content grid — heading aligns left, constrained to page content width |
| ContentCentered | Centred editorial grid — heading and cards centred, constrained width |
| FullWidth | Campaign/marketing grid — centred, no max-width constraint |

### Step 3: Populate Fields
| Field | Action |
|-------|--------|
| `heading` | Enter the section heading text (required). |

### Step 4: Configure Columns
Column count is controlled by the Frame context's `cardGrid` setting. Contact your developer or page template configurator to set the desired column count (2, 3, or 4). The default is 3 columns on `md+` breakpoints.

### Step 5: Add Cards
1. In the `cardgrid` placeholder, click **Add component** and select **Card**.
2. Assign a Card datasource item.
3. Repeat for each card. Cards wrap automatically to the next row when they exceed the column count.

### Layout Notes
- Cards are always 1 column on mobile, regardless of the `cardGrid` Frame setting.
- A `gap-4` spacing is applied between all cards.
- The grid respects the `transparent` Frame flag: if `transparent` is set, the container background becomes transparent.

### Field Type Quick Reference
| Field | Sitecore Template Field Type | Notes |
|-------|------------------------------|-------|
| `heading` | Single-Line Text | Renders as `<h2>`; plain text only |

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
