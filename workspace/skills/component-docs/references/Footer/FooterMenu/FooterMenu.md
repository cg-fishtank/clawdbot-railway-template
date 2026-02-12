# FooterMenu Component

## Purpose

The FooterMenu component serves as a container/wrapper for footer navigation columns (FooterCol components). It provides a responsive grid layout for organizing footer links into multiple columns with accordion behavior on mobile devices. The component uses a secondary theme (dark background) and includes a placeholder for child FooterCol components.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Footer/Footer Menu`
- **Template Name:** `Footer Menu`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| demo | Checkbox | No | When checked, hides the component | For staging/demo purposes |

**Note:** This is a container component with no content fields. Its purpose is to provide layout and placeholder functionality for FooterCol child components.

## Placeholder Configuration

| Placeholder Key | Purpose | Allowed Components |
|-----------------|---------|-------------------|
| `footermenu` | Footer navigation columns | FooterCol |

## Component Props Interface

```typescript
type FooterMenuProps = ComponentProps & {
  fields?: {
    demo?: Field<string | boolean>;
  };
};
```

## Content Authoring Instructions

### Overview

FooterMenu is a structural container component. Content authoring involves:
1. Adding the FooterMenu component to a page/partial design
2. Adding FooterCol components to its placeholder
3. Configuring each FooterCol with headings and child links

### demo Field

- **Type:** Checkbox
- **Required:** No
- **Purpose:** When checked (value "1", "true", or true), hides the entire component
- **Use case:** Hide component on production while testing

## Layout Behavior

### Desktop (≥ 1024px)
- 4-column grid layout
- All FooterCol components display expanded

### Mobile (< 1024px)
- Single column layout
- FooterCol components use accordion pattern (collapsible)
- Wrapped in AccordionProvider for coordinated behavior

## Visual Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│ [FooterCol 1]  │ [FooterCol 2]  │ [FooterCol 3]  │ [FooterCol 4]       │
│   • Link 1     │   • Link 1     │   • Link 1     │   • Link 1          │
│   • Link 2     │   • Link 2     │   • Link 2     │   • Link 2          │
│   • Link 3     │   • Link 3     │   • Link 3     │   • Link 3          │
└────────────────────────────────────────────────────────────────────────┘
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Footer Menu: `/sitecore/content/[Site]/Home/Data/Footer/Footer Menu`

### Experience Editor Behavior

- **Container component:** No directly editable fields
- **Placeholder editing:** Add FooterCol components to footermenu placeholder
- **Accordion preview:** Accordion behavior only visible in preview mode

### Rendering

The component renders:
1. A themed container (`secondary` theme - dark background)
2. A bordered section with padding
3. A 4-column grid (desktop) / 1-column accordion (mobile)
4. The `footermenu` placeholder for child components

## Content Examples

### Minimal Configuration

```json
{
  "fields": {}
}
```

### With Demo Hidden

```json
{
  "fields": {
    "demo": { "value": "1" }
  }
}
```

## Authoring Rules

1. **Always add FooterCol children:** FooterMenu without FooterCol components renders as empty space
2. **Column balance:** Aim for 3-4 columns with similar numbers of links
3. **Mobile testing:** Test accordion behavior on mobile viewports
4. **Demo field:** Only use for staging environments

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Empty placeholder | Renders empty container | Add FooterCol components |
| Too many columns | Layout breaks, hard to scan | Limit to 4 columns |
| Demo field checked | Component hidden | Verify before publishing |
| Missing on pages | Footer incomplete | Add to partial design or all pages |

## Related Components

- `FooterCol` - Navigation column component placed within FooterMenu
- `FooterMain` - Alternative footer with newsletter section (also contains footermenu placeholder)
- `FooterLegal` - Legal section typically placed after FooterMenu

---

## MCP Authoring Instructions

### Step 1: Add FooterMenu Component to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "footer-menu-rendering-id",
  placeholderPath: "headless-footer",  // Or appropriate footer placeholder
  componentItemName: "FooterMenu_1",
  language: "en",
  fields: {}
});
```

### Step 2: Add FooterCol Components to Placeholder

After adding FooterMenu, add FooterCol components to its placeholder:

```javascript
// First FooterCol
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "footer-col-rendering-id",
  placeholderPath: "footermenu-{FooterMenu_1_dynamic_id}",
  componentItemName: "FooterCol_Products",
  language: "en",
  dataSourceId: productsColumnDatasourceId
});

// Second FooterCol
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "footer-col-rendering-id",
  placeholderPath: "footermenu-{FooterMenu_1_dynamic_id}",
  componentItemName: "FooterCol_Resources",
  language: "en",
  dataSourceId: resourcesColumnDatasourceId
});
```

### Dynamic Placeholder Path

The `footermenu` placeholder uses dynamic placeholder naming. The path format depends on the parent component's dynamic ID:

```
footermenu-{dynamic-placeholder-id}
```

Use the `/sitecore-author-placeholder` skill for proper path construction.

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| demo | Checkbox | `"1"` (checked) or `""` (unchecked) |

### MCP Authoring Checklist

- [ ] Have page ID for footer placement
- [ ] Have FooterMenu rendering ID
- [ ] Have FooterCol rendering IDs
- [ ] Have FooterCol datasource IDs (with headings and child links configured)
- [ ] Know the dynamic placeholder path format

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
