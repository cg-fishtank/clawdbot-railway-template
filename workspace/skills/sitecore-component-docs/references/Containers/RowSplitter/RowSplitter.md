# RowSplitter Component

## Purpose
RowSplitter is a purely layout-driven container that stacks between 1 and 8 rows vertically inside a contained wrapper. Like ColumnSplitter, it requires no datasource — all configuration comes from rendering parameters. Each active row is backed by a dynamic placeholder (`row-{n}-{*}`) that accepts any component. The component wraps output in a `ContainedWrapper` and `ContainerProvider` so child ColumnSplitters can detect they are nested and apply inner padding accordingly.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `[VERIFY: Rendering ID not found in Sitecore]` |
| **Component Name** | `RowSplitter` |
| **Category** | `Containers` |

## Fields
**Fields:** None — RowSplitter has no datasource and no Sitecore content fields. All configuration is supplied through rendering parameters.

## Rendering Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `EnabledPlaceholders` | `string` (comma-separated numbers) | Determines which row slots are active, e.g. `"1,2,3"` for a 3-row layout |
| `GridParameters` | `string` | Tailwind / utility classes applied to the outer `<div>` |
| `Styles` | `string` | Additional CSS classes applied to the outer `<div>` (appended to GridParameters) |
| `Styles{N}` (N = 1–8) | `string` | Additional CSS classes applied to the wrapper of row N |
| `RenderingIdentifier` | `string` | Optional HTML `id` applied to the container `<div>` |

## Placeholders
| Placeholder Name | Pattern | Allowed Components |
|-----------------|---------|-------------------|
| `row-1-{*}` | Dynamic | Any component |
| `row-2-{*}` | Dynamic | Any component |
| `row-3-{*}` | Dynamic | Any component |
| `row-4-{*}` | Dynamic | Any component |
| `row-5-{*}` | Dynamic | Any component |
| `row-6-{*}` | Dynamic | Any component |
| `row-7-{*}` | Dynamic | Any component |
| `row-8-{*}` | Dynamic | Any component |

Only the rows listed in `EnabledPlaceholders` are rendered at runtime.

## JSS Field Component Mapping
**Fields:** None — no JSS field components are used. Layout is driven entirely by rendering parameters.

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard stacked row layout |

## Props Interface
```typescript
import { ComponentRendering } from '@sitecore-content-sdk/nextjs';

type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type RowStyles = {
  [K in `Styles${RowNumber}`]?: string;
};

interface RowSplitterProps extends ComponentProps {
  rendering: ComponentRendering;
  params: ComponentProps['params'] & RowStyles;
}
```

## Nesting Behavior
When a `ColumnSplitter` is placed inside a `RowSplitter` placeholder, the `ContainerProvider` context exposes `containerName = 'RowSplitter'` to the child. The `ColumnSplitter` reads this and applies inner padding (`innerClassname`) to avoid double-padding at the row level.

## Example Content Entry

### Minimum Viable Content
```json
{
  "params": {
    "EnabledPlaceholders": "1,2"
  }
}
```

### Full Content Example (3 rows with custom styles)
```json
{
  "params": {
    "EnabledPlaceholders": "1,2,3",
    "GridParameters": "gap-y-8",
    "Styles1": "border-b border-gray-200 pb-8",
    "Styles2": "py-8",
    "Styles3": "pt-8",
    "RenderingIdentifier": "content-rows"
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Home",
  componentName: "RowSplitter",
  placeholderName: "main",
  params: {
    EnabledPlaceholders: "1,2",
    GridParameters: "gap-y-8"
  }
});
```

### Field Type Quick Reference
| Parameter | MCP Format |
|-----------|-----------|
| `EnabledPlaceholders` | Comma-separated integers as string: `"1,2,3"` |
| `Styles{N}` | Tailwind class string applied to row N wrapper |
| `GridParameters` | Tailwind class string for the outer container |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
