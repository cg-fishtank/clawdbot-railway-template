# ContentBlock Component

## Purpose
ContentBlock is a flexible content card that pairs an image with a heading, rich-text body, and one or more CTA buttons. It provides two layout variants: `Default` (image stacked above text, left-aligned) and `ImageLeft` (image positioned to the left in a two-column row layout). Both variants delegate their rendering to child components in `component-children/Page Content/ContentBlock/` — `ContentBlock.tsx` for the default layout and `ContentBlockImageLeft.tsx` for the image-left layout — which handle responsive image sizing, theme-aware container classes, and the `buttons` placeholder.

The `buttons` placeholder is dynamically generated from `params` via `placeholderGenerator`, allowing any number of Button components to be inserted below the text content.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `8c914279-4a11-4de7-a6bc-ef0c9d9d253a` |
| **Component Name** | `ContentBlock` |
| **Category** | `Page Content` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `image` | Image (`ImageField`) | No | Desktop/primary image displayed at the top (Default) or left (ImageLeft) of the block |
| `mobileImage` | Image (`ImageField`) | No | Alternative image used on mobile viewports (handled by `useImage` hook) |
| `heading` | Single-Line Text (`Field<string>`) | Yes | Block headline rendered as `<h2>` with `heading-3xl` styling |
| `body` | Rich Text (`Field<string>`) | No | Supporting body text; clamped to 5 lines outside Experience Editor |

## Placeholders
| Placeholder | Allowed Components | Notes |
|-------------|-------------------|-------|
| `buttons` | Button | Rendered below body content; supports multiple buttons in a flex row |

> The placeholder name is dynamically generated as `{rendering-uid}_buttons`.

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `image` | `<NextImage>` | `import { NextImage } from '@sitecore-content-sdk/nextjs'` |
| `mobileImage` | `<NextImage>` (via `useImage` hook) | `import { NextImage } from '@sitecore-content-sdk/nextjs'` |
| `heading` | `<Text tag="h2">` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `body` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Image on top, text below | `Default` | Standard content card; image stacked above heading and body |
| Image left, text right | `ImageLeft` | Two-column layout; image at fixed width on the left, text fills remaining width |

## Props Interface
```typescript
type ContentBlockFields = {
  image?: ImageField;
  mobileImage?: ImageField;
  heading: Field<string>;
  body?: Field<string>;
};

export type ContentBlockProps = ComponentProps & {
  fields: ContentBlockFields;
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "Our Approach" }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "image": {
      "value": {
        "src": "/media/approach-hero.jpg",
        "alt": "Team collaborating around a table",
        "width": 640,
        "height": 360
      }
    },
    "mobileImage": {
      "value": {
        "src": "/media/approach-hero-mobile.jpg",
        "alt": "Team collaborating",
        "width": 320,
        "height": 320
      }
    },
    "heading": { "value": "Our Approach" },
    "body": { "value": "<p>We believe in a collaborative, research-driven methodology that puts client outcomes first.</p>" }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
// Add Default variant
await mcp__marketer-mcp__add_component_on_page({
  itemId: "<page-item-id>",
  renderingId: "8c914279-4a11-4de7-a6bc-ef0c9d9d253a",
  placeholderName: "<target-placeholder>",
  datasource: "<contentblock-datasource-item-id>"
});

// To use ImageLeft variant, specify the variant name in the rendering parameters
```

### Step 2: Set Fields
```javascript
await mcp__marketer-mcp__edit_item_fields({
  itemId: "<contentblock-datasource-item-id>",
  fields: {
    "heading": "Our Approach",
    "body": "<p>Supporting body content.</p>",
    "image": { "src": "/media/image.jpg", "alt": "Description" }
  }
});
```

### Step 3: Add Buttons (optional)
```javascript
// Add a Button component into the `buttons` placeholder
await mcp__marketer-mcp__add_component_on_page({
  itemId: "<page-item-id>",
  renderingId: "c152f7dc-6c01-4380-babb-97c9f080cf00",
  placeholderName: "<contentblock-rendering-uid>_buttons",
  datasource: "<button-datasource-item-id>"
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `image` | Image | `{ "src": string, "alt": string, "width": number, "height": number }` |
| `mobileImage` | Image | `{ "src": string, "alt": string, "width": number, "height": number }` |
| `heading` | Single-Line Text | Plain string |
| `body` | Rich Text | HTML string |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
