# Callout Component

## Purpose
Callout renders a highlighted aside box with a left border accent, heading, rich-text body, and an optional arrow link. It is designed to draw attention to supplementary information on a page without taking full-width prominence. The component inherits its colour scheme from the parent `Frame` via `useFrame()`, so the left-border accent and background tint automatically match the surrounding theme.

The inner `Callout` sub-component wraps content in a `ContainedWrapper` for consistent horizontal spacing, uses semantic `role="region"` and `aria-labelledby` for accessibility, and renders the link via the shared `Button` child with the `link` variant and a right-pointing arrow icon.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `a5968db4-1d40-437e-9e9d-23733660f793` |
| **Component Name** | `Callout` |
| **Category** | `Page Content` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | The callout headline, rendered as `<h2>` with `heading-2xl` styling |
| `body` | Rich Text (`RichTextField`) | No | Supporting body content rendered as formatted rich text |
| `link` | General Link (`LinkField`) | No | Optional CTA link rendered as an underlined arrow-link below the body |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text tag="h2">` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `body` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `link` | Shared `<Button variant="link">` | `import { Button } from 'component-children/Shared/Button/Button'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Standard callout box with heading, body, and optional link |

## Props Interface
```typescript
type CalloutFields = {
  heading: Field<string>;
  body: RichTextField;
  link: LinkField;
};

type CalloutProps = {
  fields: CalloutFields;
} & ComponentProps;
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "Did you know?" }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "heading": { "value": "Important Notice" },
    "body": { "value": "<p>Please review the updated policy document before proceeding with your application.</p>" },
    "link": {
      "value": {
        "href": "/policies/updated-policy",
        "text": "Read the full policy",
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
  renderingId: "a5968db4-1d40-437e-9e9d-23733660f793",
  placeholderName: "<target-placeholder>",
  datasource: "<callout-datasource-item-id>"
});
```

### Step 2: Set Fields
```javascript
await mcp__marketer-mcp__edit_item_fields({
  itemId: "<callout-datasource-item-id>",
  fields: {
    "heading": "Important Notice",
    "body": "<p>Supporting information here.</p>",
    "link": {
      "href": "/target-page",
      "text": "Learn more",
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
| `link` | General Link | `{ "href": string, "text": string, "target": string }` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
