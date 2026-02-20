# IconFeatureCard Component

## Purpose
IconFeatureCard displays a single feature card combining a circular icon badge, a heading, a rich-text subheading, and an optional CTA button. In delivery mode, when a `link` field value is set, the entire card becomes a clickable `<Link>` with hover shadow; in Experience Editor the card renders as a static `<div>` to allow inline editing. The icon background color and button icon variant adapt automatically to the parent `effectiveTheme` from `useFrame()` (secondary theme → tertiary icon background; otherwise → secondary icon background). The visual rendering logic lives in the `IconFeatureCard` child component (`component-children/IconFeatureCards/IconFeatureCard/IconFeatureCard.tsx`).

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `a4f9ff7a-3b2f-46b5-a2ca-ee9aee97fac7` |
| **Component Name** | `IconFeatureCard` |
| **Category** | `IconFeatureCards` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `heading` | Single-Line Text | Yes | Card heading rendered as `<h3>` with `heading-2xl` style |
| `subheading` | Rich Text | No | Body copy below the heading |
| `imageIcon` | Icon (custom `IconFieldType`) | No | FontAwesome icon identifier (e.g. `"fa-star"`) displayed in the circular badge |
| `link` | General Link | No | Optional CTA button URL; also wraps the entire card when set |

**Note on field naming discrepancy:** The TSX interface names the icon field `imageIcon` (typed as `IconFieldType`), while the task description refers to it as `icon`. The source file uses `imageIcon` — use this name in Sitecore templates.

## Placeholders
**Placeholders:** None

## Child Components
| File | Purpose |
|------|---------|
| `component-children/IconFeatureCards/IconFeatureCard/IconFeatureCard.tsx` | Full rendering: icon badge, heading, subheading, conditional link wrapper, CTA button |

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `Text` | `@sitecore-content-sdk/nextjs` |
| `subheading` | `RichText` | `@sitecore-content-sdk/nextjs` |
| `imageIcon` | `IconFas` (via `fields.imageIcon?.name`) | `component-children/Shared/Icon/Icon` |
| `link` | `Link` (card wrapper) + `Button` (CTA) | `@sitecore-content-sdk/nextjs` / `Shared/Button/Button` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard icon feature card with `withDatasourceCheck` |

## Props Interface
```typescript
import {
  Field,
  LinkField,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { IconFieldType } from 'lib/types';

type IconFeatureCardFields = {
  heading: Field<string>;
  subheading: RichTextField;
  imageIcon: IconFieldType;
  link: LinkField;
};

export type IconFeatureCardFieldsProps = {
  fields: IconFeatureCardFields;
};

export type IconFeatureCardProps = ComponentProps &
  IconFeatureCardFieldsProps & {
    parent?: boolean;
  };
```

## Theme-Driven Icon Colors
| Parent Theme | Icon Background | Icon Variant |
|-------------|-----------------|-------------|
| `secondary` | `bg-tertiary` | `default` (dark icon) |
| Any other | `bg-secondary` | `white` (light icon) |

## CTA Button Behavior
- In Experience Editor: the `Button` is always rendered with the JSS `link` field prop (for inline editing).
- In delivery: the `Button` only renders if `link.value.text` is non-empty; it renders as a static child element (not a JSS Link) since the entire card is already wrapped in a link.

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "Fast Delivery" }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "heading": { "value": "Fast Delivery" },
    "subheading": { "value": "<p>We ship your order within 24 hours, guaranteed.</p>" },
    "imageIcon": { "name": "truck-fast" },
    "link": {
      "value": {
        "href": "/shipping-info",
        "text": "Learn More",
        "target": "_self"
      }
    }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to IconFeatureCardGrid
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Home",
  componentName: "IconFeatureCard",
  placeholderName: "iconfeaturecardgrid",
  dataSource: "/sitecore/content/MySite/Data/IconFeatureCards/FastDelivery"
});
```

### Step 2: Set Fields
```javascript
await mcp__marketer_mcp__update_component_fields({
  itemPath: "/sitecore/content/MySite/Data/IconFeatureCards/FastDelivery",
  fields: {
    "heading": { "value": "Fast Delivery" },
    "subheading": { "value": "<p>Ships within 24 hours.</p>" },
    "imageIcon": { "name": "truck-fast" },
    "link": { "value": { "href": "/shipping-info", "text": "Learn More" } }
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | `{ "value": "Card Title" }` |
| `subheading` | Rich Text | `{ "value": "<p>Description</p>" }` |
| `imageIcon` | Icon | `{ "name": "fa-icon-name" }` (FontAwesome icon name) |
| `link` | General Link | `{ "value": { "href": "...", "text": "CTA label" } }` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
