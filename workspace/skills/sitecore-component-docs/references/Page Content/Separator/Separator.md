# Separator Component

## Purpose
Separator renders a thin horizontal rule that visually divides content sections on a page. It has no fields and requires no datasource — its sole output is a `0.5 rem`-tall `div` styled with `bg-surface/10` (10% opacity of the surface colour token), giving a subtle divider that adapts to the parent Frame's theme automatically via `useFrame()`. The component is wrapped in `ContainedWrapper` for consistent horizontal padding alignment with surrounding content.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `21ef8e28-97a9-4b50-850e-ab87fa7dc0dc` |
| **Component Name** | `Separator` |
| **Category** | `Page Content` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| *(none)* | — | — | This component has no author-configurable fields |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
*(No fields — no JSS field components used)*

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Full-width horizontal rule at 10% surface opacity |

## Props Interface
```typescript
// SeparatorProps extends ComponentProps with no additional fields
type SeparatorProps = ComponentProps;
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {}
}
```

### Full Content Example
```json
{
  "fields": {}
}
```

> This component has no configurable content. Drop it onto the page to insert a visual divider.

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer-mcp__add_component_on_page({
  itemId: "<page-item-id>",
  renderingId: "21ef8e28-97a9-4b50-850e-ab87fa7dc0dc",
  placeholderName: "<target-placeholder>"
  // No datasource required — Separator has no fields
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| *(none)* | — | — |

> **Note:** No datasource item is needed. The Separator is a structural/layout component only. Its visual weight adjusts automatically to the parent Frame theme.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
