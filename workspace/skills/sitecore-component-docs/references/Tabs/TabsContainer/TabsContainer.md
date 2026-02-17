# TabsContainer Component

## Purpose

The TabsContainer component provides a tabbed interface for organizing content into switchable panels. It serves as a parent container that holds multiple TabItem child components, displaying tab buttons for navigation and the corresponding content panel for the active tab. The component supports three layout variants: horizontal tabs (default), vertical tabs on the left, and vertical tabs on the right. On mobile viewports, vertical layouts automatically switch to horizontal for better usability.

## Sitecore Template Requirements

### Data Source

**Important:** TabsContainer is a **container component** that does not have its own data source fields. It uses a placeholder to house child TabItem components that provide the actual content.

### Template Path

- **Rendering Item:** `/sitecore/layout/Renderings/Project/[Site]/Tabs/TabsContainer`
- **No datasource template** - uses placeholder for child components

### Placeholder

| Placeholder Key | Allowed Components | Description |
|-----------------|-------------------|-------------|
| tabscontainer-{uid} | TabItem | Dynamic placeholder for tab content panels |

## Fields

This component has **no Sitecore fields**. All content comes from child TabItem components placed in the placeholder.

## Component Variants

The TabsContainer exports 3 rendering variants with different tab layouts:

| Variant | Export Name | Layout | Use Case |
|---------|-------------|--------|----------|
| Default | `Default` | Horizontal | Standard top-aligned tabs, best for 2-5 tabs |
| Vertical Left | `VerticalLeft` | Vertical (left-aligned) | Side navigation style, good for many tabs or longer labels |
| Vertical Right | `VerticalRight` | Vertical (right-aligned) | Alternative side navigation, right-to-left reading flow |

### Layout Behavior

- **Horizontal:** Tab buttons appear in a row above the content panel. If tabs overflow, horizontal scroll arrows appear.
- **Vertical Left:** Tab buttons appear in a column on the left side of the content panel (desktop only, switches to horizontal on mobile).
- **Vertical Right:** Tab buttons appear in a column on the right side of the content panel (desktop only, switches to horizontal on mobile).

## Component Props Interface

```typescript
import { ComponentProps } from 'lib/component-props';
import { TabsLayout } from 'lib/helpers/tabs';

export type TabsContainerProps = ComponentProps & {
  layout: TabsLayout;
};

// TabsLayout = 'horizontal' | 'vertical-left' | 'vertical-right'

// Child TabItems are accessed via placeholders:
export type TabItemType = {
  uid: string;
  heading: Field<string>;
  body: RichTextField;
};
```

## JSS Placeholder Mapping

| Placeholder | JSS Component | Usage |
|-------------|---------------|-------|
| tabscontainer-{uid} | `<Placeholder name={phKey} rendering={props.rendering} />` | Houses TabItem components |

## Content Authoring Instructions

### Adding Tabs to a Page

1. Add the TabsContainer component to your page layout
2. Select the appropriate variant (Default, VerticalLeft, or VerticalRight)
3. Add TabItem components inside the TabsContainer placeholder
4. Each TabItem becomes one tab with its own heading and content

### Choosing the Right Variant

| Scenario | Recommended Variant |
|----------|-------------------|
| 2-5 short tab labels | Default (Horizontal) |
| 6+ tabs or long labels | VerticalLeft or VerticalRight |
| Content-heavy sections | Vertical layouts (more space for content) |
| Mobile-first design | Default (Horizontal) |

### Experience Editor Behavior

In Experience Editor, TabsContainer displays in **Edit Mode**:
- All TabItem children are shown simultaneously (not in tabs)
- A notice explains this is for editing purposes only
- Tab switching functionality is disabled during editing
- This allows content authors to edit all tabs without switching

### Content Matrix

| Configuration | TabItem Count | Use Case |
|---------------|---------------|----------|
| Minimal | 2 TabItems | Simple binary choice (e.g., Overview/Details) |
| Standard | 3-4 TabItems | Common tabbed content organization |
| Extended | 5+ TabItems | Comprehensive content sections (consider vertical layout) |

## Example Content Structure

### Page Layout with TabsContainer

```
Page
└── headless-main (placeholder)
    └── TabsContainer
        └── tabscontainer-{uid} (placeholder)
            ├── TabItem (Tab 1)
            ├── TabItem (Tab 2)
            └── TabItem (Tab 3)
```

## Common Mistakes to Avoid

1. **Empty container:** Always add at least 2 TabItem children. A TabsContainer with 0-1 tabs provides no value.

2. **Too many horizontal tabs:** If you have more than 5 tabs, consider using VerticalLeft or VerticalRight variants to prevent overflow scrolling.

3. **Inconsistent tab naming:** Keep tab headings concise and parallel in structure (e.g., all nouns or all verbs).

4. **Mixing content types:** Each tab should contain related content. Don't mix unrelated topics in the same TabsContainer.

5. **Forgetting mobile:** Vertical layouts switch to horizontal on mobile. Ensure your tab labels work well horizontally too.

6. **Nesting TabsContainers:** Avoid placing a TabsContainer inside a TabItem. Nested tabs create confusion.

## Related Components

- `TabItem` - Required child component that provides tab heading and content
- `Accordion` - Alternative pattern for expandable content sections
- `ContentBlock` - For non-tabbed content sections

## Accessibility

- Tab buttons use proper ARIA roles (`role="tablist"`, `role="tab"`)
- Tab panels use `role="tabpanel"` with `aria-controls` linking
- `aria-orientation` indicates horizontal vs vertical layout
- Keyboard navigation supported for tab switching

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the TabsContainer component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer-mcp__search_site`)
2. Have the TabsContainer rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)
4. Plan the TabItem children to add after creating the container

### Step 1: Find the Target Page

```javascript
// Search for the page where TabsContainer will be added
await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Page Name"
});
// Returns: { itemId: "page-guid", name: "PageName", path: "/sitecore/..." }
```

### Step 2: Add TabsContainer to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "tabscontainer-rendering-id",  // Use variant-specific ID
  placeholderPath: "headless-main",
  componentItemName: "TabsContainer_1",
  language: "en",
  fields: {}  // No component-level fields
});

// Returns:
// {
//   "componentId": "created-component-guid",
//   "placeholderId": "headless-main"
// }
```

**Save the `componentId`** - it's needed for constructing the child placeholder path.

### Step 3: Add TabItem Children

After adding TabsContainer, add TabItem components to its placeholder:

```javascript
// The placeholder path for TabItem children uses the TabsContainer's UID
const tabsPlaceholderPath = "headless-main/tabscontainer-{TABSCONTAINER-UID}";

await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "tabitem-rendering-id",
  placeholderPath: tabsPlaceholderPath,
  componentItemName: "TabItem_Overview",
  language: "en",
  fields: {
    "heading": "Overview",
    "body": "<p>Overview tab content goes here.</p>"
  }
});
```

### Variant Selection

To use a specific layout variant, use the corresponding rendering ID:

| Variant | Rendering Name | Layout |
|---------|----------------|--------|
| Default | `TabsContainer` | Horizontal tabs |
| Vertical Left | `TabsContainer-VerticalLeft` | Left-side vertical tabs |
| Vertical Right | `TabsContainer-VerticalRight` | Right-side vertical tabs |

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Product Details"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add TabsContainer component
// ═══════════════════════════════════════════════════════════════
const tabsResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "tabscontainer-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ProductTabs",
  language: "en",
  fields: {}
});

const tabsContainerUid = tabsResult.componentId;
const tabsPlaceholder = `headless-main/tabscontainer-${tabsContainerUid}`;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Add first TabItem
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "tabitem-rendering-id",
  placeholderPath: tabsPlaceholder,
  componentItemName: "TabItem_Overview",
  language: "en",
  fields: {
    "heading": "Overview",
    "body": "<p>Product overview content with features and benefits.</p>"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Add second TabItem
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "tabitem-rendering-id",
  placeholderPath: tabsPlaceholder,
  componentItemName: "TabItem_Specs",
  language: "en",
  fields: {
    "heading": "Specifications",
    "body": "<p>Technical specifications and dimensions.</p>"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 5: Add third TabItem
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "tabitem-rendering-id",
  placeholderPath: tabsPlaceholder,
  componentItemName: "TabItem_Reviews",
  language: "en",
  fields: {
    "heading": "Reviews",
    "body": "<p>Customer reviews and ratings.</p>"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: TabsContainer with 3 TabItems
// ═══════════════════════════════════════════════════════════════
```

### MCP Authoring Checklist

Before authoring TabsContainer via MCP, verify:

- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have TabsContainer rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `TabsContainer_1`)
- [ ] Plan at least 2 TabItem children
- [ ] Have TabItem rendering ID for children
- [ ] Know the placeholder pattern: `{parent-placeholder}/tabscontainer-{uid}`

### Placeholder Path Construction

For nested TabItem components, construct the placeholder path:

| Parent Placeholder | TabsContainer UID | TabItem Placeholder Path |
|--------------------|-------------------|--------------------------|
| `headless-main` | `abc-123-def` | `headless-main/tabscontainer-abc-123-def` |
| `column-1` | `xyz-789` | `column-1/tabscontainer-xyz-789` |

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `TabsContainer_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| TabItems not appearing | Wrong nested placeholder | Verify `tabscontainer-{uid}` format |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-pagebuilder` | Page creation and component placement |
| `TabItem Docs.md` | Child component field details |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
