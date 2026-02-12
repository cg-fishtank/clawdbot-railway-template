# ColumnSplitter Component

## Purpose

The ColumnSplitter component creates a flexible multi-column layout container that allows content authors to divide content into up to 8 columns with configurable widths. It provides placeholders for each enabled column where other components can be placed. This is a structural/layout component with no content fields of its own - all configuration is done through rendering parameters. It's commonly used to create side-by-side content layouts like text with images, multi-column text, or feature grids.

## Sitecore Template Requirements

### Data Source Template

This component does **not** require a data source. All configuration is done via rendering parameters.

### Fields

This component has **no content fields**. It is purely a layout container configured through rendering parameters.

### Rendering Parameters

| Parameter            | Type     | Options                                           | Default  | Description                              |
| -------------------- | -------- | ------------------------------------------------- | -------- | ---------------------------------------- |
| EnabledPlaceholders  | Text     | Comma-separated numbers (e.g., "1,2,3")           | "1,2"    | Which column placeholders to enable      |
| GridParameters       | Text     | Tailwind CSS classes                              | none     | Grid layout classes for the container    |
| ColumnWidth1         | Text     | Tailwind width classes (e.g., "w-full md:w-1/2") | w-full   | Width of column 1                        |
| ColumnWidth2         | Text     | Tailwind width classes                            | w-full   | Width of column 2                        |
| ColumnWidth3         | Text     | Tailwind width classes                            | w-full   | Width of column 3                        |
| ColumnWidth4         | Text     | Tailwind width classes                            | w-full   | Width of column 4                        |
| ColumnWidth5         | Text     | Tailwind width classes                            | w-full   | Width of column 5                        |
| ColumnWidth6         | Text     | Tailwind width classes                            | w-full   | Width of column 6                        |
| ColumnWidth7         | Text     | Tailwind width classes                            | w-full   | Width of column 7                        |
| ColumnWidth8         | Text     | Tailwind width classes                            | w-full   | Width of column 8                        |
| Styles1-8            | Text     | Tailwind CSS classes                              | none     | Additional styling for each column       |
| theme                | Droplist | primary, secondary, tertiary                      | none     | Color theme for the container            |
| gap                  | Droplist | none, md, lg                                      | none     | Gap spacing between columns              |
| padding              | Droplist | Padding options                                   | none     | Padding around the container             |
| paddingDesktop       | Droplist | Desktop padding options                           | none     | Desktop-specific padding                 |
| RenderingIdentifier  | Text     | Any string                                        | none     | Optional ID for anchor links             |

## Placeholder Configuration

The ColumnSplitter creates dynamic placeholders for each enabled column:

| Placeholder Key     | Allowed Components | Description                 |
| ------------------- | ------------------ | --------------------------- |
| `column-1-{*}`      | Any                | Column 1 placeholder        |
| `column-2-{*}`      | Any                | Column 2 placeholder        |
| `column-3-{*}`      | Any                | Column 3 placeholder        |
| `column-4-{*}`      | Any                | Column 4 placeholder        |
| `column-5-{*}`      | Any                | Column 5 placeholder        |
| `column-6-{*}`      | Any                | Column 6 placeholder        |
| `column-7-{*}`      | Any                | Column 7 placeholder        |
| `column-8-{*}`      | Any                | Column 8 placeholder        |

**Note:** Only columns listed in `EnabledPlaceholders` will render.

## Component Variants

The ColumnSplitter exports a single Default variant:

| Variant | Export Name | Description                      | Use Case              |
| ------- | ----------- | -------------------------------- | --------------------- |
| Default | `Default`   | Flexible multi-column container  | All column layouts    |

## Common Layout Configurations

### Two Equal Columns (50/50)

```
EnabledPlaceholders: "1,2"
ColumnWidth1: "w-full md:w-1/2"
ColumnWidth2: "w-full md:w-1/2"
```

### Two Columns (33/67)

```
EnabledPlaceholders: "1,2"
ColumnWidth1: "w-full md:w-1/3"
ColumnWidth2: "w-full md:w-2/3"
```

### Two Columns (67/33)

```
EnabledPlaceholders: "1,2"
ColumnWidth1: "w-full md:w-2/3"
ColumnWidth2: "w-full md:w-1/3"
```

### Three Equal Columns

```
EnabledPlaceholders: "1,2,3"
ColumnWidth1: "w-full md:w-1/3"
ColumnWidth2: "w-full md:w-1/3"
ColumnWidth3: "w-full md:w-1/3"
```

### Four Equal Columns

```
EnabledPlaceholders: "1,2,3,4"
ColumnWidth1: "w-full md:w-1/4"
ColumnWidth2: "w-full md:w-1/4"
ColumnWidth3: "w-full md:w-1/4"
ColumnWidth4: "w-full md:w-1/4"
```

## Content Authoring Instructions

### Configuration Guide

#### EnabledPlaceholders

- **What to enter:** Comma-separated column numbers to enable
- **Example:** "1,2" for two columns, "1,2,3" for three columns
- **Max columns:** 8

#### ColumnWidth[N]

- **What to enter:** Tailwind CSS width classes
- **Common values:**
  - `w-full` - Full width (mobile default)
  - `md:w-1/2` - Half width at medium breakpoint
  - `md:w-1/3` - One third width
  - `md:w-2/3` - Two thirds width
  - `md:w-1/4` - Quarter width
  - `lg:w-1/2` - Half width at large breakpoint

#### gap

- **none:** No gap between columns
- **md:** Medium gap (16px/1rem)
- **lg:** Large gap (24px/1.5rem)

### Content Matrix

| Layout Type        | EnabledPlaceholders | Column Widths                         |
| ------------------ | ------------------- | ------------------------------------- |
| Two equal columns  | "1,2"               | w-full md:w-1/2, w-full md:w-1/2     |
| Sidebar left       | "1,2"               | w-full md:w-1/3, w-full md:w-2/3     |
| Sidebar right      | "1,2"               | w-full md:w-2/3, w-full md:w-1/3     |
| Three columns      | "1,2,3"             | w-full md:w-1/3 (all)                |
| Four columns       | "1,2,3,4"           | w-full md:w-1/4 (all)                |

## Component Props Interface

```typescript
import { ComponentProps } from 'lib/component-props';

// No specific fields - configuration is through rendering parameters
type ColumnSplitterProps = ComponentProps;

// Rendering parameters accessed via props.params:
// - EnabledPlaceholders: string
// - GridParameters: string
// - ColumnWidth1-8: string
// - Styles1-8: string
// - RenderingIdentifier: string
```

## Sitecore XM Cloud Specifics

### Content Editor Path

This component does not create data source items. It is added directly to the page presentation details.

### Experience Editor Behavior

- **Placeholder editing:** Click within any column to add/edit child components
- **Column visualization:** Columns display side-by-side in Experience Editor based on width settings
- **Responsive preview:** Use Experience Editor's device preview to test column stacking

## Common Mistakes to Avoid

1. **Missing EnabledPlaceholders:** If this parameter is empty or missing, no columns will render.

2. **Inconsistent width classes:** Ensure column widths add up to 100% at each breakpoint:
   - `md:w-1/2 + md:w-1/2 = 100%` ✓
   - `md:w-1/3 + md:w-1/2 = 83%` ✗

3. **Missing mobile width:** Always include `w-full` for mobile stacking before responsive prefixes:
   - `w-full md:w-1/2` ✓
   - `md:w-1/2` (no mobile fallback) ✗

4. **Too many columns:** More than 4 columns becomes cramped on most screens. Consider alternative layouts for 5+ items.

5. **Nested ColumnSplitters:** While possible, nesting column splitters can create complex, hard-to-maintain layouts. Use sparingly.

## Related Components

- `RowSplitter` - Similar container for vertical (row) layouts
- `FullWidth` - Container for full-bleed content with background image support

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ColumnSplitter component using the Marketer MCP tools.

### Important: No Data Source

ColumnSplitter does not create a datasource - it's purely a structural component configured via rendering parameters.

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Page Name"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add ColumnSplitter to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "column-splitter-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ColumnSplitter_TwoCol",
  language: "en",
  fields: {}  // No content fields
});

// Note: For ColumnSplitter, the response may include rendering parameters to set
const dynamicPlaceholderId = result.placeholderId;
```

### Step 3: Add Components to Column Placeholders

```javascript
// Add component to column 1
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "text-component-rendering-id",
  placeholderPath: `headless-main/column-1-{${dynamicPlaceholderId}}`,
  componentItemName: "Text_LeftColumn",
  language: "en",
  fields: {
    "text": "<p>Content for the left column.</p>"
  }
});

// Add component to column 2
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "image-component-rendering-id",
  placeholderPath: `headless-main/column-2-{${dynamicPlaceholderId}}`,
  componentItemName: "Image_RightColumn",
  language: "en",
  fields: {}
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "About Us Page"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add ColumnSplitter component (two-column layout)
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "column-splitter-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ColumnSplitter_AboutSection",
  language: "en",
  fields: {}
});

const dynamicId = addResult.placeholderId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Add content to column 1 (left side - text content)
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "rich-text-rendering-id",
  placeholderPath: `headless-main/column-1-{${dynamicId}}`,
  componentItemName: "RichText_AboutUs",
  language: "en",
  fields: {
    "text": "<h2>About Our Company</h2><p>We are a leading provider of innovative solutions...</p>"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Add content to column 2 (right side - image)
// ═══════════════════════════════════════════════════════════════
const imageResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "image-rendering-id",
  placeholderPath: `headless-main/column-2-{${dynamicId}}`,
  componentItemName: "Image_TeamPhoto",
  language: "en",
  fields: {}
});

await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: imageResult.datasourceId,
  language: "en",
  fields: {
    "image": "<image mediaid='{TEAM-PHOTO-GUID}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: Two-column layout with text and image
// ═══════════════════════════════════════════════════════════════
```

### Placeholder Path Patterns

For ColumnSplitter's column placeholders:
```
headless-main/column-1-{DYNAMIC_PLACEHOLDER_ID}
headless-main/column-2-{DYNAMIC_PLACEHOLDER_ID}
headless-main/column-3-{DYNAMIC_PLACEHOLDER_ID}
... up to column-8
```

The `DYNAMIC_PLACEHOLDER_ID` is returned when you add the ColumnSplitter component.

### Pre-configured ColumnSplitter Variants

Many implementations include pre-configured ColumnSplitter renderings with common layouts:

| Rendering Name               | EnabledPlaceholders | Layout                   |
|-----------------------------|---------------------|--------------------------|
| `ColumnSplitter-TwoEqual`   | "1,2"               | 50/50 split              |
| `ColumnSplitter-SidebarLeft`| "1,2"               | 33/67 split              |
| `ColumnSplitter-SidebarRight`| "1,2"              | 67/33 split              |
| `ColumnSplitter-ThreeEqual` | "1,2,3"             | 33/33/33 split           |
| `ColumnSplitter-FourEqual`  | "1,2,3,4"           | 25/25/25/25 split        |

### MCP Authoring Checklist

Before authoring ColumnSplitter via MCP, verify:

- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have ColumnSplitter rendering ID (or variant from component manifest)
- [ ] Know which column placeholders are enabled by the rendering
- [ ] Have rendering IDs for child components
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Save the dynamic placeholder ID for adding child components

### MCP Error Handling

| Error                       | Cause                        | Solution                                      |
|:----------------------------|:-----------------------------|:----------------------------------------------|
| "Item already exists"       | Duplicate component name     | Use unique suffix: `ColumnSplitter_2`         |
| Component not visible       | Wrong placeholder path       | Use `"headless-main"` without leading slash   |
| Child not appearing         | Wrong column placeholder     | Verify column number in EnabledPlaceholders   |
| Column empty                | Wrong dynamic ID             | Use dynamic ID from ColumnSplitter response   |

### Related Skills for MCP Authoring

| Skill                         | Purpose                                |
|:------------------------------|:---------------------------------------|
| `/sitecore-author-placeholder`| Placeholder path construction rules    |
| `/sitecore-pagebuilder`       | Page layout composition guidance       |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
