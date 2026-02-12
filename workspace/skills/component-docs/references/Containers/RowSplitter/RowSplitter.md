# RowSplitter Component

## Purpose

The RowSplitter component creates a vertical layout container that stacks content into up to 8 configurable rows. It provides placeholders for each enabled row where other components can be placed. This is a structural/layout component with no content fields of its own - all configuration is done through rendering parameters. It's commonly used to create vertical sections within a page or to organize content into distinct horizontal bands.

## Sitecore Template Requirements

### Data Source Template

This component does **not** require a data source. All configuration is done via rendering parameters.

### Fields

This component has **no content fields**. It is purely a layout container configured through rendering parameters.

### Rendering Parameters

| Parameter           | Type     | Options                              | Default | Description                              |
| ------------------- | -------- | ------------------------------------ | ------- | ---------------------------------------- |
| EnabledPlaceholders | Text     | Comma-separated numbers (e.g., "1,2,3") | "1,2"| Which row placeholders to enable         |
| GridParameters      | Text     | Tailwind CSS classes                 | none    | Grid layout classes for the container    |
| Styles              | Text     | Tailwind CSS classes                 | none    | Additional styling for the container     |
| Styles1             | Text     | Tailwind CSS classes                 | none    | Styling for row 1                        |
| Styles2             | Text     | Tailwind CSS classes                 | none    | Styling for row 2                        |
| Styles3             | Text     | Tailwind CSS classes                 | none    | Styling for row 3                        |
| Styles4             | Text     | Tailwind CSS classes                 | none    | Styling for row 4                        |
| Styles5             | Text     | Tailwind CSS classes                 | none    | Styling for row 5                        |
| Styles6             | Text     | Tailwind CSS classes                 | none    | Styling for row 6                        |
| Styles7             | Text     | Tailwind CSS classes                 | none    | Styling for row 7                        |
| Styles8             | Text     | Tailwind CSS classes                 | none    | Styling for row 8                        |
| theme               | Droplist | primary, secondary, tertiary         | none    | Color theme for the container            |
| RenderingIdentifier | Text     | Any string                           | none    | Optional ID for anchor links             |

## Placeholder Configuration

The RowSplitter creates dynamic placeholders for each enabled row:

| Placeholder Key | Allowed Components | Description          |
| --------------- | ------------------ | -------------------- |
| `row-1-{*}`     | Any                | Row 1 placeholder    |
| `row-2-{*}`     | Any                | Row 2 placeholder    |
| `row-3-{*}`     | Any                | Row 3 placeholder    |
| `row-4-{*}`     | Any                | Row 4 placeholder    |
| `row-5-{*}`     | Any                | Row 5 placeholder    |
| `row-6-{*}`     | Any                | Row 6 placeholder    |
| `row-7-{*}`     | Any                | Row 7 placeholder    |
| `row-8-{*}`     | Any                | Row 8 placeholder    |

**Note:** Only rows listed in `EnabledPlaceholders` will render.

## Component Variants

The RowSplitter exports a single Default variant:

| Variant | Export Name | Description                    | Use Case            |
| ------- | ----------- | ------------------------------ | ------------------- |
| Default | `Default`   | Flexible multi-row container   | All row layouts     |

## Common Layout Configurations

### Two Rows (Header + Content)

```
EnabledPlaceholders: "1,2"
Styles1: "py-4 bg-gray-100"
Styles2: "py-8"
```

### Three Rows (Header + Content + Footer)

```
EnabledPlaceholders: "1,2,3"
Styles1: "py-4"
Styles2: "py-8 flex-grow"
Styles3: "py-4 bg-gray-100"
```

### Alternating Background Rows

```
EnabledPlaceholders: "1,2,3,4"
Styles1: "py-8 bg-white"
Styles2: "py-8 bg-gray-50"
Styles3: "py-8 bg-white"
Styles4: "py-8 bg-gray-50"
```

## Content Authoring Instructions

### Configuration Guide

#### EnabledPlaceholders

- **What to enter:** Comma-separated row numbers to enable
- **Example:** "1,2" for two rows, "1,2,3" for three rows
- **Max rows:** 8

#### Styles[N]

- **What to enter:** Tailwind CSS classes for each row
- **Common values:**
  - `py-4` - Vertical padding (16px)
  - `py-8` - Larger vertical padding (32px)
  - `bg-gray-50` - Light gray background
  - `bg-white` - White background
  - `flex-grow` - Row expands to fill available space

### Content Matrix

| Layout Type           | EnabledPlaceholders | Row Styles                           |
| --------------------- | ------------------- | ------------------------------------ |
| Two sections          | "1,2"               | Default styling                      |
| Header + content      | "1,2"               | Styles1: header, Styles2: main       |
| Three sections        | "1,2,3"             | Header, content, footer              |
| Alternating sections  | "1,2,3,4"           | Alternating backgrounds              |

## Component Props Interface

```typescript
import { ComponentProps } from 'lib/component-props';

// No specific fields - configuration is through rendering parameters
type RowSplitterProps = ComponentProps;

// Rendering parameters accessed via props.params:
// - EnabledPlaceholders: string
// - GridParameters: string
// - Styles: string
// - Styles1-8: string
// - RenderingIdentifier: string
```

## Sitecore XM Cloud Specifics

### Content Editor Path

This component does not create data source items. It is added directly to the page presentation details.

### Experience Editor Behavior

- **Placeholder editing:** Click within any row to add/edit child components
- **Row visualization:** Rows stack vertically in Experience Editor
- **Styling preview:** Row styles apply immediately

## Common Mistakes to Avoid

1. **Missing EnabledPlaceholders:** If this parameter is empty or missing, no rows will render.

2. **Too many rows:** More than 4-5 rows can create very long pages. Consider breaking into multiple pages or using navigation.

3. **Inconsistent spacing:** Use consistent padding values across rows for visual harmony.

4. **Deeply nested splitters:** Avoid putting RowSplitter inside RowSplitter inside ColumnSplitter - creates maintenance complexity.

5. **Empty rows:** Always add content to enabled rows. Empty rows create confusing blank space.

## Related Components

- `ColumnSplitter` - Multi-column layout container (horizontal divisions)
- `FullWidth` - Full-bleed container with background image support

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the RowSplitter component using the Marketer MCP tools.

### Important: No Data Source

RowSplitter does not create a datasource - it's purely a structural component configured via rendering parameters.

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Page Name"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add RowSplitter to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "row-splitter-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "RowSplitter_PageSections",
  language: "en",
  fields: {}  // No content fields
});

const dynamicPlaceholderId = result.placeholderId;
```

### Step 3: Add Components to Row Placeholders

```javascript
// Add component to row 1
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "hero-banner-rendering-id",
  placeholderPath: `headless-main/row-1-{${dynamicPlaceholderId}}`,
  componentItemName: "HeroBanner_Top",
  language: "en",
  fields: {
    "heading": "Welcome Section"
  }
});

// Add component to row 2
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-grid-rendering-id",
  placeholderPath: `headless-main/row-2-{${dynamicPlaceholderId}}`,
  componentItemName: "CardGrid_Features",
  language: "en",
  fields: {
    "heading": "Our Features"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Services Page"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add RowSplitter component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "row-splitter-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "RowSplitter_MainContent",
  language: "en",
  fields: {}
});

const dynamicId = addResult.placeholderId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Add content to row 1 (hero section)
// ═══════════════════════════════════════════════════════════════
const heroResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "hero-banner-rendering-id",
  placeholderPath: `headless-main/row-1-{${dynamicId}}`,
  componentItemName: "HeroBanner_Services",
  language: "en",
  fields: {
    "heading": "Our Services",
    "subheading": "Comprehensive solutions for your business needs"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Add content to row 2 (features section)
// ═══════════════════════════════════════════════════════════════
const featuresResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-grid-rendering-id",
  placeholderPath: `headless-main/row-2-{${dynamicId}}`,
  componentItemName: "CardGrid_ServiceFeatures",
  language: "en",
  fields: {
    "heading": "What We Offer"
  }
});

// Add cards to the CardGrid (nested placeholder)
const cardGridDynamicId = featuresResult.placeholderId;

await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: `headless-main/row-2-{${dynamicId}}/cardgrid-{${cardGridDynamicId}}`,
  componentItemName: "Card_Consulting",
  language: "en",
  fields: {
    "heading": "Consulting"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 5: Add content to row 3 (CTA section)
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "cta-banner-rendering-id",
  placeholderPath: `headless-main/row-3-{${dynamicId}}`,
  componentItemName: "CTABanner_Contact",
  language: "en",
  fields: {
    "heading": "Ready to Get Started?",
    "buttonText": "Contact Us"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: Three-row layout with hero, features, and CTA
// ═══════════════════════════════════════════════════════════════
```

### Placeholder Path Patterns

For RowSplitter's row placeholders:
```
headless-main/row-1-{DYNAMIC_PLACEHOLDER_ID}
headless-main/row-2-{DYNAMIC_PLACEHOLDER_ID}
headless-main/row-3-{DYNAMIC_PLACEHOLDER_ID}
... up to row-8
```

The `DYNAMIC_PLACEHOLDER_ID` is returned when you add the RowSplitter component.

### Pre-configured RowSplitter Variants

Many implementations include pre-configured RowSplitter renderings:

| Rendering Name             | EnabledPlaceholders | Use Case                    |
|---------------------------|---------------------|----------------------------|
| `RowSplitter-TwoRows`     | "1,2"               | Header + content           |
| `RowSplitter-ThreeRows`   | "1,2,3"             | Header + content + footer  |
| `RowSplitter-FourRows`    | "1,2,3,4"           | Multi-section page         |

### Nested Placeholder Paths

When placing components inside containers that are already in a RowSplitter row, build the full path:

```javascript
// Component path inside CardGrid which is inside RowSplitter row 2:
`headless-main/row-2-{ROW_DYNAMIC_ID}/cardgrid-{CARDGRID_DYNAMIC_ID}`
```

### MCP Authoring Checklist

Before authoring RowSplitter via MCP, verify:

- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have RowSplitter rendering ID (or variant from component manifest)
- [ ] Know which row placeholders are enabled by the rendering
- [ ] Have rendering IDs for child components
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Save the dynamic placeholder ID for adding child components

### MCP Error Handling

| Error                       | Cause                        | Solution                                      |
|:----------------------------|:-----------------------------|:----------------------------------------------|
| "Item already exists"       | Duplicate component name     | Use unique suffix: `RowSplitter_2`            |
| Component not visible       | Wrong placeholder path       | Use `"headless-main"` without leading slash   |
| Child not appearing         | Wrong row placeholder        | Verify row number in EnabledPlaceholders      |
| Row empty                   | Wrong dynamic ID             | Use dynamic ID from RowSplitter response      |

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
