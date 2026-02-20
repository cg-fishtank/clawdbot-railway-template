# CTABlock Component

## Purpose
CTABlock is a prominent call-to-action panel that pairs a large heading and body text with a single themed button. It is designed for high-visibility CTAs such as newsletter sign-ups, contact prompts, or section transitions. The component delegates rendering to `component-children/Page Content/CTABlock/CTABlock.tsx`, which wraps content in a `ContainedWrapper`, applies a rounded border, and uses smart button colour logic — light-themed parents yield dark (`secondary`) buttons, dark-themed parents yield yellow (`tertiary`) buttons.

The layout shifts from a stacked column (mobile) to a horizontal row (desktop via `md:flex-row`) so the text block and button appear side by side on wider screens.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `e276274f-5c13-4b76-ac83-d7a867975696` |
| **Component Name** | `CTABlock` |
| **Category** | `Page Content` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Primary headline rendered as `<h2>` with `heading-2xl` styling |
| `body` | Rich Text (`Field<string>`) | No | Supporting body rendered as rich text below the heading |
| `link` | General Link (`LinkField`) | No | The CTA button link (href, text, target) |

> **Note:** The `subheading` field referenced in the spec is not present in the current TSX implementation. The `CTABlock` child renders `heading`, `body`, and `link` only.

## Placeholders
**Placeholders:** None

> The `buttons` placeholder referenced in the spec is not rendered by the current `CTABlock` child component. The single CTA link is rendered directly as a `<Button>` using the `fields.link` value.

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text tag="h2">` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `body` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `link` | Shared `<Button variant="button">` | `import Button from 'component-children/Shared/Button/Button'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Bordered CTA panel with heading, body, and a single button |

## Props Interface
```typescript
type CTABlockFields = {
  heading: Field<string>;
  body?: Field<string>;
  link?: LinkField;
};

export type CTABlockProps = ComponentProps & {
  fields: CTABlockFields;
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "Ready to get started?" }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "heading": { "value": "Ready to get started?" },
    "body": { "value": "<p>Join thousands of professionals who trust our platform to manage their work.</p>" },
    "link": {
      "value": {
        "href": "/sign-up",
        "text": "Create a free account",
        "target": ""
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
  renderingId: "e276274f-5c13-4b76-ac83-d7a867975696",
  placeholderName: "<target-placeholder>",
  datasource: "<ctablock-datasource-item-id>"
});
```

### Step 2: Set Fields
```javascript
await mcp__marketer-mcp__edit_item_fields({
  itemId: "<ctablock-datasource-item-id>",
  fields: {
    "heading": "Ready to get started?",
    "body": "<p>Supporting description text.</p>",
    "link": {
      "href": "/sign-up",
      "text": "Get Started",
      "target": ""
    }
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | Plain string |
| `body` | Rich Text | HTML string |
| `link` | General Link | `{ "href": string, "text": string, "target": "" \| "_blank" }` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
