# FooterMenu Component

## Purpose
FooterMenu is a container component that wraps a `footermenu` placeholder in an `AccordionProvider`, enabling its `FooterCol` children to function as mobile accordions without each child needing its own accordion state. It forces the secondary theme via `FrameProvider` and renders a 4-column grid on desktop that collapses to a stacked layout on mobile. Like `FooterMain`, it supports a `demo` field to hide the component from production while keeping it visible in the CMS, and fetches the datasource item name server-side for debugging.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `a6f3622c-d750-4887-8a4b-22a3bd0f4e87` |
| **Component Name** | `FooterMenu` |
| **Category** | `Footer` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `demo` | Checkbox | No | When checked (`true` / `"1"` / `"true"`), adds `hidden` class to hide the component from site visitors |

## Placeholders
| Placeholder Name | Pattern | Allowed Components |
|-----------------|---------|-------------------|
| `footermenu` | `placeholderGenerator(params, 'footermenu')` | `FooterCol` |

The placeholder renders inside a 4-column CSS grid (`lg:grid-cols-4 lg:gap-5`), so placing 4 `FooterCol` components fills the row evenly on desktop.

## JSS Field Component Mapping
No JSS field rendering components are used directly. The `footermenu` placeholder accepts `FooterCol` components which use `Text`, `Button`, etc. internally.

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard footer menu grid with `withDatasourceCheck` |

## Props Interface
```typescript
import {
  ComponentRendering,
  Field,
  GetComponentServerProps,
} from '@sitecore-content-sdk/nextjs';

type FooterMenuProps = ComponentProps & {
  fields?: {
    demo?: Field<string | boolean>;
  };
};
```

## Server Props
`getComponentServerProps` fetches the datasource item's name for the `data-source-name` debug attribute.

```typescript
export const getComponentServerProps: GetComponentServerProps = async (rendering) => {
  const graphQLClient = getGraphQlClient();
  let itemName = null;

  if (rendering.dataSource && GetItemById.loc?.source.body) {
    const itemData = await graphQLClient.request(GetItemById.loc.source.body, {
      itemId: rendering.dataSource,
      language: 'en',
    });
    itemName = (itemData as { item?: { name?: string } })?.item?.name || null;
  }

  return {
    rendering: { ...rendering, itemName },
  };
};
```

## Accordion Integration
`FooterMenu` wraps the placeholder in `<AccordionProvider>`, which exposes accordion state via React context. Each `FooterCol` inside the placeholder uses `useAccordion()` to:
- Toggle open/closed state by `rendering.uid`
- Render mobile accordion expand/collapse controls
- Always expand when in Experience Editor (`isEditing`)

Without this parent `AccordionProvider`, `FooterCol` components fall back to `StaticView` (no accordion, always expanded).

## Demo Field Behavior
`fields?.demo?.value === '1' || === true || === 'true'` — any of these values hides the component with the Tailwind `hidden` class.

## Typical Page Structure
```
Footer Layout Page
  └── footer-main placeholder
        └── FooterMain (datasource: FooterMain-Data)
              └── footermenu placeholder
                    └── FooterMenu (datasource: FooterMenu-Data)
                          └── footermenu placeholder
                                ├── FooterCol (datasource: FooterCol-About)
                                ├── FooterCol (datasource: FooterCol-Services)
                                ├── FooterCol (datasource: FooterCol-Resources)
                                └── FooterCol (datasource: FooterCol-Contact)
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "demo": { "value": false }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "demo": { "value": false }
  }
}
```

FooterMenu itself has minimal fields — the content lives in its `FooterCol` children.

## MCP Authoring Instructions

### Step 1: Add to Footer Page
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Global/Footer-Page",
  componentName: "FooterMenu",
  placeholderName: "footermenu",
  dataSource: "/sitecore/content/MySite/Global/Footer/FooterMenu-Data"
});
```

### Step 2: Add FooterCol Children
```javascript
// Add first FooterCol to FooterMenu's footermenu placeholder
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Global/Footer-Page",
  componentName: "FooterCol",
  placeholderName: "footermenu",
  dataSource: "/sitecore/content/MySite/Global/Footer/FooterCol-About"
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `demo` | Checkbox | `{ "value": false }` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
