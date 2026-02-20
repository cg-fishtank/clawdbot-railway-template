# CommonRichtext Component

## Purpose
CommonRichtext is a general-purpose rich text container that renders a single RichTextField with full theme awareness. It wraps content in a `Wrapper` component (which applies the `bg-surface` background) and applies the `effectiveTheme` class from the parent Frame so colour tokens respond correctly to theme changes. The component is intentionally minimal — its sole purpose is to give content authors a rich-text editing zone that inherits its visual context from the page layout.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `45d05c34-9edf-48d5-9226-ff2c7bc3abb4` |
| **Component Name** | `CommonRichtext` |
| **Category** | `Page Content` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `body` | Rich Text (`Field<string>`) | Yes | The rich-text content body; supports all standard Sitecore rich-text elements (headings, lists, tables, inline media) |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `body` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Single rich-text block with surface background and theme-aware styling |

## Props Interface
```typescript
type CommonRichtextProps = ComponentProps & {
  params: { [key: string]: string };
  fields: {
    body: Field<string>;
  };
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "body": { "value": "<p>Your content here.</p>" }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "body": {
      "value": "<h2>Section Heading</h2><p>Introductory paragraph with <strong>bold</strong> and <em>italic</em> text.</p><ul><li>Item one</li><li>Item two</li><li>Item three</li></ul><p>Closing remarks with a <a href='/contact'>contact link</a>.</p>"
    }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer-mcp__add_component_on_page({
  itemId: "<page-item-id>",
  renderingId: "45d05c34-9edf-48d5-9226-ff2c7bc3abb4",
  placeholderName: "<target-placeholder>",
  datasource: "<richtext-datasource-item-id>"
});
```

### Step 2: Set Body Content
```javascript
await mcp__marketer-mcp__edit_item_fields({
  itemId: "<richtext-datasource-item-id>",
  fields: {
    "body": "<h2>Heading</h2><p>Body content goes here.</p>"
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `body` | Rich Text | HTML string with standard rich text tags |

> **Note:** The `body` field supports full Sitecore rich-text markup including headings, lists, tables, images, and internal links. Always use valid HTML.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
