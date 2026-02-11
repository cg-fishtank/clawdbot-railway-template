# Separator

## Purpose

The Separator component renders a horizontal divider line to visually separate content sections on a page. It provides a subtle visual break between components without adding significant vertical space. The component adapts to the current theme context, ensuring the separator color harmonizes with the surrounding design.

## Sitecore Configuration

### Template Path

`/sitecore/templates/Project/[Site]/Page Content/Separator`

### Data Source Location

This component does not require a data source as it has no content fields.

## Fields

This component has **no content fields**. It is a purely presentational element.

| Field | Sitecore Type | Required | Description |
| ----- | ------------- | -------- | ----------- |
| N/A   | N/A           | N/A      | No fields   |

## Rendering Parameters

| Parameter | Type     | Options                      | Default | Description                     |
| --------- | -------- | ---------------------------- | ------- | ------------------------------- |
| theme     | Droplist | primary, secondary, tertiary | (auto)  | Separator line color theme      |

## Component Interface

```typescript
type SeparatorProps = ComponentProps;
```

## Content Examples

### Usage (No Fields)

The Separator has no content fields. Simply add it to a placeholder to insert a visual divider.

```json
{
  "fields": {}
}
```

## Authoring Rules

1. **Use sparingly:** Don't overuse separators. Visual hierarchy should primarily come from spacing and typography.
2. **Consistent placement:** Use separators consistently throughout the site for predictable visual rhythm.
3. **Theme awareness:** The separator auto-adapts to theme context. Avoid forcing a theme unless necessary.

## Common Mistakes

| Mistake                   | Why It's Wrong                               | Correct Approach                           |
| ------------------------- | -------------------------------------------- | ------------------------------------------ |
| Overusing separators      | Creates visual clutter                       | Use spacing and layout for hierarchy first |
| Forcing theme color       | May clash with surrounding content           | Let auto-theme work in most cases          |
| Using between tight sections | Adds unnecessary visual noise            | Reserve for major section breaks           |

## Related Components

- `ContentBlock` - Use heading hierarchy instead of separators when possible
- `CommonRichtext` - Horizontal rules (`<hr>`) available in rich text

## Visual Layout

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│    [Previous Component Content]                                    │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                          ─────────────                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│    [Next Component Content]                                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

The separator renders as a thin (0.5px/2px) horizontal line with reduced opacity (`bg-surface/10`).

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the Separator component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the Separator rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Services Page"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add Separator to Page

Since Separator has no content fields, simply add the component:

```javascript
await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "separator-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "Separator_1",
  language: "en",
  fields: {}
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Services"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add Separator component (no fields needed)
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "separator-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "Separator_AfterIntro",
  language: "en",
  fields: {}
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: Separator divider added to page
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| N/A   | N/A  | `{}`       |

### MCP Authoring Checklist

Before authoring Separator via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have Separator rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `Separator_1`)

### MCP Error Handling

| Error                 | Cause                    | Solution                                |
|:----------------------|:-------------------------|:----------------------------------------|
| "Item already exists" | Duplicate component name | Use unique suffix: `Separator_2`        |
| Component not visible | Wrong placeholder path   | Use `"headless-main"` without leading slash |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
