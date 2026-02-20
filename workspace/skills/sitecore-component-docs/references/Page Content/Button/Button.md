# Button Component

## Purpose
Button renders a themed, link-aware call-to-action element that adapts its colour automatically based on the parent `Frame` context theme. It delegates all visual rendering to the shared `component-children/Shared/Button/Button.tsx` child component, which supports three variants (`button`, `outline`, `link`) and smart colour logic: light parent themes produce dark buttons, dark parent themes produce yellow (tertiary) buttons. The outer wrapper reads `useFrame()` to determine `effectiveTheme` and `outline` flags, then maps them to the appropriate `ButtonColorType`.

The shared Button child (`component-children/Shared/Button/Button.tsx`) also handles Experience Editor rendering by switching between `<JSSLink>` (editing mode) and Next.js `<Link>` (render mode), ensuring inline editing of link text works correctly in XM Cloud.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `c152f7dc-6c01-4380-babb-97c9f080cf00` |
| **Component Name** | `Button` |
| **Category** | `Page Content` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `link` | General Link (`LinkField`) | Yes | The anchor link — includes `href`, `text`, `target`, `querystring`, and `anchor` properties |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `link` | `<Link>` (JSSLink in edit mode, Next.js Link in render mode) | `import { LinkField } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default (solid button) | `Default` | Standard filled button; colour determined by parent Frame theme |
| Outline | Controlled via Frame `outline` param | Bordered transparent button for secondary CTAs |
| Link | Controlled via Frame `outline` param | Underlined link-style for inline CTAs |

## Props Interface
```typescript
type ButtonFields = {
  link: LinkField;
};

type ButtonProps = ComponentProps & {
  fields: ButtonFields;
  params?: {
    styles?: string[] | string;
    className?: string;
    [key: string]: string | string[] | undefined;
  };
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "link": {
      "value": {
        "href": "/about",
        "text": "Learn More"
      }
    }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "link": {
      "value": {
        "href": "https://example.com/contact",
        "text": "Contact Us",
        "target": "_blank",
        "querystring": "ref=homepage",
        "anchor": ""
      }
    }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page (typically inside a `buttons` placeholder of a parent component)
```javascript
await mcp__marketer-mcp__add_component_on_page({
  itemId: "<page-item-id>",
  renderingId: "c152f7dc-6c01-4380-babb-97c9f080cf00",
  placeholderName: "<parent-component-uid>_buttons",
  datasource: "<button-datasource-item-id>"
});
```

### Step 2: Set Link Field
```javascript
await mcp__marketer-mcp__edit_item_fields({
  itemId: "<button-datasource-item-id>",
  fields: {
    "link": {
      "href": "/target-page",
      "text": "Button Label",
      "target": ""
    }
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `link` | General Link | `{ "href": string, "text": string, "target": "" \| "_blank" }` |

> **Note:** Button colour is automatically computed from the parent Frame theme via `useFrame()`. There is no colour field on the datasource. To override appearance, configure the Frame component's theme parameter.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
