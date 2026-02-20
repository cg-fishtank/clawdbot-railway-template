# AccordionDrawer Component

## Purpose
The AccordionDrawer component renders a single collapsible drawer within an Accordion group. It displays a clickable heading button that toggles an animated panel open or closed, revealing rich text body content and optional Button child components. The drawer is fully accessible, implementing `aria-expanded` and keyboard interaction (`Enter`/`Space`), and adapts its visual theme from the parent frame context.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `4e1df4d2-a674-4502-a9e0-7828a9536cd9` |
| **Component Name** | `AccordionDrawer` |
| **Category** | `Accordions` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `heading` | Single-Line Text | Yes | The drawer toggle label rendered inside the clickable button | Displayed as an `<h3>` with `heading-base` styling |
| `body` | Rich Text | Yes | The expandable body content shown when the drawer is open | Rendered via `RichText` with full richtext class support |

## Placeholders
| Placeholder Key | Allowed Components | Notes |
|----------------|-------------------|-------|
| `buttons` | Button | Dynamically generated via `placeholderGenerator(params, 'buttons')`; renders child buttons in a flex-wrap row inside the open drawer panel |

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `body` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard collapsible drawer with heading toggle and rich text body; intended as a child of Accordion |

## Props Interface
```typescript
type AccordionDrawerFields = {
  heading: Field<string>;
  body: RichTextField;
};

export type AccordionDrawerProps = ComponentProps & {
  fields: AccordionDrawerFields;
  id?: string;
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "componentName": "AccordionDrawer",
  "dataSource": "{4E1DF4D2-A674-4502-A9E0-7828A9536CD9}",
  "fields": {
    "heading": {
      "value": "What is your return policy?"
    },
    "body": {
      "value": "<p>We accept returns within 30 days of purchase with a valid receipt.</p>"
    }
  }
}
```

### Full Content Example
```json
{
  "componentName": "AccordionDrawer",
  "dataSource": "{4E1DF4D2-A674-4502-A9E0-7828A9536CD9}",
  "fields": {
    "heading": {
      "value": "What is your return policy?"
    },
    "body": {
      "value": "<p>We accept returns within 30 days of purchase with a valid receipt.</p><p>Items must be in <strong>original condition</strong> and unused. See our <a href='/returns'>full returns guide</a> for details.</p>"
    }
  },
  "placeholders": {
    "buttons": [
      {
        "componentName": "Button",
        "fields": {
          "link": {
            "value": {
              "href": "/returns",
              "text": "View Return Policy",
              "linktype": "internal"
            }
          }
        }
      }
    ]
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
AccordionDrawer must be placed inside an Accordion component's `accordion` placeholder. Use the MCP `add_component` tool targeting the accordion's placeholder:

```json
{
  "tool": "add_component",
  "params": {
    "route": "/en/your-page",
    "renderingId": "4e1df4d2-a674-4502-a9e0-7828a9536cd9",
    "placeholder": "accordion",
    "fields": {
      "heading": "What is your return policy?",
      "body": "<p>We accept returns within 30 days of purchase with a valid receipt.</p>"
    }
  }
}
```

### Step 2: Add Button children (optional)
To add call-to-action buttons inside the drawer's open panel, add Button components into the `buttons` placeholder nested within this AccordionDrawer rendering.

### Editing mode behavior
When `page.mode.isEditing` is `true` (Experience Editor / Pages), all drawers are forced open regardless of toggle state. This ensures authors can access and edit the body content without needing to interact with the drawer controls.

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | Plain string value: `"My Question"` |
| `body` | Rich Text | HTML string: `"<p>Answer content with <strong>markup</strong></p>"` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
