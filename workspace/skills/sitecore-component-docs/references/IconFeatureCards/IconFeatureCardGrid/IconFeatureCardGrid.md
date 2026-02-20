# IconFeatureCardGrid Component

## Purpose
IconFeatureCardGrid is a section container that renders a heading, an optional rich-text subheading, and a responsive grid of `IconFeatureCard` components via a Sitecore placeholder. The grid uses a custom `render` prop to output a 1-column layout on mobile, 2-column on tablet, and 4-column on desktop with consistent gap spacing. It is wrapped in a `ContainedWrapper` for max-width centering and a `Frame` for theme/spacing context.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `1b8a9932-1383-4d81-aedd-0e86025c0a98` |
| **Component Name** | `IconFeatureCardGrid` |
| **Category** | `IconFeatureCards` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `heading` | Single-Line Text | Yes | Section heading rendered as `<h2>` with `heading-4xl` style |
| `subheading` | Rich Text | No | Optional introductory text below the heading |

## Placeholders
| Placeholder Name | Pattern | Allowed Components |
|-----------------|---------|-------------------|
| `iconfeaturecardgrid` | `placeholderGenerator(params, 'iconfeaturecardgrid')` | `IconFeatureCard` |

The placeholder uses a custom `render` prop that wraps all child components in a responsive grid `<div>`:
- Mobile: `grid-cols-1`
- Tablet (md): `grid-cols-2`
- Desktop (lg): `grid-cols-4`

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `Text` | `@sitecore-content-sdk/nextjs` |
| `subheading` | `RichText` | `@sitecore-content-sdk/nextjs` |
| Placeholder children | `Placeholder` | `@sitecore-content-sdk/nextjs` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard icon feature card grid with `withDatasourceCheck` |

## Props Interface
```typescript
import {
  Field,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';

type IconFeatureCardGridFields = {
  heading: Field<string>;
  subheading: RichTextField;
};

type IconFeatureCardGridProps = ComponentProps & {
  fields: IconFeatureCardGridFields;
};
```

## Grid Layout
The `Placeholder` uses a custom render function to control the grid container:

```tsx
<Placeholder
  name={placeholderGenerator(params, 'iconfeaturecardgrid')}
  rendering={rendering}
  render={(components) => (
    <div className="mt-12 grid w-full grid-cols-1 gap-x-8 gap-y-8 pb-12 first:mt-0 md:grid-cols-2 lg:grid-cols-4">
      {components}
    </div>
  )}
/>
```

This means `IconFeatureCard` components placed in the placeholder are always laid out in the controlled grid — individual card widths should not be overridden.

## Recommended Card Count
- 4 cards fills one desktop row perfectly
- 2 or 8 cards also work cleanly on desktop
- Odd numbers (1, 3, 5, etc.) leave a partial row on desktop

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "Why Choose Us" }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "heading": { "value": "Why Choose Us" },
    "subheading": { "value": "<p>Four reasons our clients trust us with their most important work.</p>" }
  }
}
```

Then place `IconFeatureCard` components in the `iconfeaturecardgrid` placeholder.

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Home",
  componentName: "IconFeatureCardGrid",
  placeholderName: "main",
  dataSource: "/sitecore/content/MySite/Data/IconFeatureCardGrid/WhyChooseUs"
});
```

### Step 2: Set Grid Heading
```javascript
await mcp__marketer_mcp__update_component_fields({
  itemPath: "/sitecore/content/MySite/Data/IconFeatureCardGrid/WhyChooseUs",
  fields: {
    "heading": { "value": "Why Choose Us" },
    "subheading": { "value": "<p>Four reasons our clients trust us.</p>" }
  }
});
```

### Step 3: Add IconFeatureCard Children
```javascript
// Repeat for each card (up to 4 for a full row)
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Home",
  componentName: "IconFeatureCard",
  placeholderName: "iconfeaturecardgrid",
  dataSource: "/sitecore/content/MySite/Data/IconFeatureCards/FastDelivery"
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | `{ "value": "Section Title" }` |
| `subheading` | Rich Text | `{ "value": "<p>Intro text</p>" }` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
