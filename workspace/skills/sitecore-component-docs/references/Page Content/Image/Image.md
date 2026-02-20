# Image Component

## Purpose
Image renders a full-width, aspect-ratio-locked photograph with an automatically extracted alt-text caption displayed beneath it. The image source is resolved via the shared `useImage` hook from `lib/hooks/useImage`, which selects between desktop and mobile image sources based on the `ImageFields` interface. The component uses `FullWidthWrapper` for edge-to-edge layout while constraining the caption to the standard inner-content max-width with horizontal padding.

The shared `component-children/Shared/Image/Image.tsx` exports a `HalfWidthImage` sub-component (used by other components such as banners) that positions an image absolutely to fill a 50%-wide container — distinct from this full-width rendering.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `5ce3099c-120e-474d-99fe-165eb5804db5` |
| **Component Name** | `Image` |
| **Category** | `Page Content` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `image` | Image (`ImageField`) | Yes | Primary image displayed full-width in a 16:9 (`aspect-video`) container |
| `altText` | Single-Line Text (`Field<string>`) | No | Supplementary alt text; the component actually reads `image.value.alt` directly for the caption paragraph beneath the image |

> **Implementation note:** The caption `<p>` reads `image?.value?.alt` directly from the image field's alt attribute rather than from a separate `altText` field. Ensure the alt text is set on the image media item itself.

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `image` | `<NextImage>` | `import { NextImage } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Full-width image with caption below |

## Props Interface
```typescript
// ImageFields comes from lib/hooks/useImage (ImageProps)
// Includes: image (ImageField) and optional mobileImage (ImageField)
type ImageComponentFields = {
  fields: ImageFields;
};

type ImageProps = ComponentProps & ImageComponentFields;
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "image": {
      "value": {
        "src": "/media/hero-photo.jpg",
        "alt": "Conference keynote speaker at podium",
        "width": 1920,
        "height": 1080
      }
    }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "image": {
      "value": {
        "src": "/media/team-offsite-2025.jpg",
        "alt": "The annual team offsite in Whistler, February 2025",
        "width": 1920,
        "height": 1080
      }
    }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer-mcp__add_component_on_page({
  itemId: "<page-item-id>",
  renderingId: "5ce3099c-120e-474d-99fe-165eb5804db5",
  placeholderName: "<target-placeholder>",
  datasource: "<image-datasource-item-id>"
});
```

### Step 2: Set Image Field
```javascript
await mcp__marketer-mcp__edit_item_fields({
  itemId: "<image-datasource-item-id>",
  fields: {
    "image": {
      "src": "/media/photo.jpg",
      "alt": "Descriptive alt text used as caption",
      "width": 1920,
      "height": 1080
    }
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `image` | Image | `{ "src": string, "alt": string, "width": number, "height": number }` |

> **Important:** The caption shown below the image is sourced from `image.value.alt`. Set a meaningful alt text on the media item to have it appear as the visible caption.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
