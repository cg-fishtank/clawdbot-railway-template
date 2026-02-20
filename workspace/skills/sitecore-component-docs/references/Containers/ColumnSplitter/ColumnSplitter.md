# ColumnSplitter Component

## Purpose
ColumnSplitter is a purely layout-driven container that renders between 2 and 8 horizontal columns inside a single row. It reads its column configuration from rendering parameters — no datasource is required. Each active column is wrapped in a dynamic placeholder (`column-{n}-{*}`) so that authors can drop any component into any column slot. The component integrates with the `Frame`, `Wrapper`, and `ContainerProvider` context system to inherit theming, gap, and padding from its parent container.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `[VERIFY: Rendering ID not found in Sitecore]` |
| **Component Name** | `ColumnSplitter` |
| **Category** | `Containers` |

## Fields
**Fields:** None — ColumnSplitter has no datasource and no Sitecore content fields. All configuration is supplied through rendering parameters.

## Rendering Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `EnabledPlaceholders` | `string` (comma-separated numbers) | Determines which column slots are active, e.g. `"1,2"` for a 2-column layout |
| `GridParameters` | `string` | Tailwind / utility classes applied to the outer flex container |
| `ColumnWidth{N}` (N = 1–8) | `string` | Width utility class for column N, e.g. `"w-1/2"` |
| `Styles{N}` (N = 1–8) | `string` | Additional CSS classes for column N |
| `RenderingIdentifier` | `string` | Optional HTML `id` applied to the container `<div>` |

## Placeholders
| Placeholder Name | Pattern | Allowed Components |
|-----------------|---------|-------------------|
| `column-1-{*}` | Dynamic | Any component |
| `column-2-{*}` | Dynamic | Any component |
| `column-3-{*}` | Dynamic | Any component |
| `column-4-{*}` | Dynamic | Any component |
| `column-5-{*}` | Dynamic | Any component |
| `column-6-{*}` | Dynamic | Any component |
| `column-7-{*}` | Dynamic | Any component |
| `column-8-{*}` | Dynamic | Any component |

Only the columns listed in `EnabledPlaceholders` are rendered at runtime.

## JSS Field Component Mapping
**Fields:** None — no JSS field components are used. Layout is driven entirely by rendering parameters.

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard column layout |

## Props Interface
```typescript
type ColumnNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type ColumnWidths = {
  [K in ColumnNumber as `ColumnWidth${K}`]?: string;
};

type ColumnStyles = {
  [K in ColumnNumber as `Styles${K}`]?: string;
};

interface ColumnSplitterProps extends ComponentProps {
  params: ComponentProps['params'] & ColumnWidths & ColumnStyles;
}
```

## Gap Class Map
The component uses a `GAP_CLASS_MAP` driven by the parent `Frame`'s `gap` value:

| Gap Value | Container Class | Column Class |
|-----------|-----------------|-------------|
| `none` | _(empty)_ | _(empty)_ |
| `md` | `-m-4` | `p-4` |
| `lg` | `-m-4` | `p-6` |

## Example Content Entry

### Minimum Viable Content
```json
{
  "params": {
    "EnabledPlaceholders": "1,2"
  }
}
```

### Full Content Example (4-column, equal widths)
```json
{
  "params": {
    "EnabledPlaceholders": "1,2,3,4",
    "GridParameters": "gap-8",
    "ColumnWidth1": "w-1/4",
    "ColumnWidth2": "w-1/4",
    "ColumnWidth3": "w-1/4",
    "ColumnWidth4": "w-1/4",
    "RenderingIdentifier": "main-columns"
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Home",
  componentName: "ColumnSplitter",
  placeholderName: "main",
  params: {
    EnabledPlaceholders: "1,2",
    ColumnWidth1: "w-1/2",
    ColumnWidth2: "w-1/2"
  }
});
```

### Field Type Quick Reference
| Parameter | MCP Format |
|-----------|-----------|
| `EnabledPlaceholders` | Comma-separated integers as string: `"1,2,3"` |
| `ColumnWidth{N}` | Tailwind width class string: `"w-1/3"` |
| `Styles{N}` | Additional Tailwind class string |
| `GridParameters` | Tailwind container class string |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
