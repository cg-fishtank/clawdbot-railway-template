# Accordion Component

## Purpose
The Accordion component renders a collapsible content group with a heading, subheading, and optional call-to-action link. It serves as a container for one or more AccordionDrawer child components, which are injected via the `accordion` placeholder. The component adapts its button color based on the active theme (primary/tertiary vs. secondary) and supports transparent background framing.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `8cb91616-d630-4732-b520-4d3a0c4931e4` |
| **Component Name** | `Accordion` |
| **Category** | `Accordions` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `heading` | Single-Line Text | Yes | Primary heading displayed above the accordion group | Rendered as an `<h2>` with `heading-3xl` styling |
| `subheading` | Rich Text | Yes | Supporting text displayed below the heading | Rendered via `RichText` with `copy-xl` styling |
| `link` | General Link | No | Optional call-to-action link rendered as a button next to the heading | Displayed only when a value is provided |

## Placeholders
| Placeholder Key | Allowed Components | Notes |
|----------------|-------------------|-------|
| `accordion` | AccordionDrawer | Dynamically generated via `placeholderGenerator(params, 'accordion')`; supports multiple drawers stacked vertically |

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `subheading` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `link` | `<Button variant="button">` | Internal `component-children/Shared/Button/Button` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard accordion group with heading, subheading, optional link, and injected drawers |

## Props Interface
```typescript
type AccordionFields = {
  heading: Field<string>;
  subheading: Field<string>;
  link?: LinkField;
};

export type AccordionProps = ComponentProps & {
  fields: AccordionFields;
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "componentName": "Accordion",
  "dataSource": "{8CB91616-D630-4732-B520-4D3A0C4931E4}",
  "fields": {
    "heading": {
      "value": "Frequently Asked Questions"
    },
    "subheading": {
      "value": "<p>Browse the questions below to find what you need.</p>"
    }
  }
}
```

### Full Content Example
```json
{
  "componentName": "Accordion",
  "dataSource": "{8CB91616-D630-4732-B520-4D3A0C4931E4}",
  "fields": {
    "heading": {
      "value": "Frequently Asked Questions"
    },
    "subheading": {
      "value": "<p>Browse the questions below to find what you need. Can't find an answer? <strong>Contact us.</strong></p>"
    },
    "link": {
      "value": {
        "href": "/contact",
        "text": "Contact Support",
        "target": "_self",
        "linktype": "internal"
      }
    }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
Use the MCP `add_component` tool to place the Accordion on a page:

```json
{
  "tool": "add_component",
  "params": {
    "route": "/en/your-page",
    "renderingId": "8cb91616-d630-4732-b520-4d3a0c4931e4",
    "placeholder": "main",
    "fields": {
      "heading": "Frequently Asked Questions",
      "subheading": "<p>Find answers to common questions below.</p>",
      "link": {
        "href": "/contact",
        "text": "Contact Us",
        "linktype": "internal"
      }
    }
  }
}
```

### Step 2: Add AccordionDrawer children
After placing the Accordion, add one or more AccordionDrawer components into the `accordion` placeholder. The placeholder key is dynamically namespaced — use the rendering's `params.id` and `params.renderingId` to construct it, or rely on the MCP tool to resolve the placeholder automatically.

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | Plain string value: `"My Heading"` |
| `subheading` | Rich Text | HTML string: `"<p>Some <strong>text</strong></p>"` |
| `link` | General Link | Object with `href`, `text`, `linktype`, optional `target` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
