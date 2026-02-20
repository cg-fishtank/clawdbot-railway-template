# CTACard Component

## Purpose
CTACard renders a compact media card combining a square image thumbnail with a heading, body text (both clamped in render mode), and one or more CTA buttons. It is designed for use within grid layouts such as carousels or card grids, where consistent card heights are important. The image is resolved via the shared `useImage` hook, which selects between desktop and mobile image sources. In Experience Editor mode, clamping is disabled so authors can see the full content length.

The `buttons` placeholder is dynamically generated from `params` via `placeholderGenerator`, accepting any number of Button components arranged in a horizontal flex row below the text content.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `af4506a4-555c-4847-bc15-58ef83108dea` |
| **Component Name** | `CTACard` |
| **Category** | `Page Content` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Card headline rendered as `<h4>` with `heading-lg` styling; clamped to 2 lines in render mode |
| `body` | Rich Text (`Field<string>`) | No | Supporting body text; clamped to 4 lines in render mode |
| `image` | Image (`ImageField`) | No | Square thumbnail displayed at a fixed width of 200 px on desktop; full-width on mobile |

> The `useImage` hook (`lib/hooks/useImage`) also checks for a `mobileImage` field on `ImageProps`, though `CTACard` exposes it via `ImageProps` type composition.

## Placeholders
| Placeholder | Allowed Components | Notes |
|-------------|-------------------|-------|
| `buttons` | Button | Displayed in a flex row below the text content; auto-pushes to the bottom of the card |

> The placeholder name is dynamically generated as `{rendering-uid}_buttons`.

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `image` | `<NextImage>` | `import { NextImage } from '@sitecore-content-sdk/nextjs'` |
| `heading` | `<Text tag="h4">` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `body` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Standard CTA card with image, heading, body, and buttons |

## Props Interface
```typescript
// ImageProps from lib/hooks/useImage includes image and optional mobileImage
type CTACardFields = ImageProps & {
  heading: Field<string>;
  body: Field<string>;
};

type CTACardFieldsProps = {
  fields: CTACardFields;
};

type CTACardProps = ComponentProps & CTACardFieldsProps;
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "Explore Our Services" }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "image": {
      "value": {
        "src": "/media/services-thumbnail.jpg",
        "alt": "Professional services team",
        "width": 640,
        "height": 640
      }
    },
    "heading": { "value": "Explore Our Services" },
    "body": { "value": "<p>We offer end-to-end consulting, implementation, and support across a range of industry verticals.</p>" }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer-mcp__add_component_on_page({
  itemId: "<page-item-id>",
  renderingId: "af4506a4-555c-4847-bc15-58ef83108dea",
  placeholderName: "<target-placeholder>",
  datasource: "<ctacard-datasource-item-id>"
});
```

### Step 2: Set Fields
```javascript
await mcp__marketer-mcp__edit_item_fields({
  itemId: "<ctacard-datasource-item-id>",
  fields: {
    "heading": "Explore Our Services",
    "body": "<p>Supporting description.</p>",
    "image": { "src": "/media/image.jpg", "alt": "Alt text" }
  }
});
```

### Step 3: Add Buttons (optional)
```javascript
await mcp__marketer-mcp__add_component_on_page({
  itemId: "<page-item-id>",
  renderingId: "c152f7dc-6c01-4380-babb-97c9f080cf00",
  placeholderName: "<ctacard-rendering-uid>_buttons",
  datasource: "<button-datasource-item-id>"
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | Plain string |
| `body` | Rich Text | HTML string |
| `image` | Image | `{ "src": string, "alt": string, "width": number, "height": number }` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
