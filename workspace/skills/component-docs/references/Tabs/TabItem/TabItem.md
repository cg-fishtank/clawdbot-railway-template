# TabItem Component

## Purpose

The TabItem component represents an individual tab panel within a TabsContainer. It provides both the tab button heading and the associated content panel that displays when the tab is active. TabItem must always be placed inside a TabsContainer's placeholder - it cannot be used standalone. In Experience Editor, all TabItems display their content simultaneously for easy editing; at runtime, only the active tab's content is visible.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Tabs/Tab Item`
- **Template Name:** `Tab Item`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Tab button label displayed in the tab navigation | Recommended max 30 characters for horizontal, 50 for vertical layouts |
| body | Rich Text | Yes | Content displayed in the tab panel when active | Supports full rich text formatting |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text field={fields?.heading} />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| body | `<RichText field={fields?.body} className="richtext" />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Props Interface

```typescript
import { ComponentRendering, Field, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export type TabItemProps = ComponentProps & {
  rendering: ComponentRendering & {
    fields: {
      heading: Field<string>;
      body: RichTextField;
    };
  };
};
```

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** Short, descriptive label for the tab button
- **Tone/Style:** Concise, action-oriented or descriptive nouns
- **Character limit:** 30 characters recommended for horizontal layouts, 50 for vertical
- **Examples:** "Overview", "Features", "Technical Specs", "Reviews", "FAQ"
- **Tips:** Keep labels parallel in structure across all tabs in a container

#### body

- **What to enter:** Full content for the tab panel
- **Tone/Style:** Match the site's content guidelines
- **Formatting:** Supports full rich text including:
  - Headings (H2-H6)
  - Paragraphs
  - Lists (ordered and unordered)
  - Links
  - Bold, italic, underline
  - Tables
  - Images (inline)
- **Tips:** Content can be as long as needed; the panel will accommodate scrolling if necessary

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Standard | heading, body | - | All TabItems require both fields |

### Experience Editor Behavior

- **Edit Mode:** TabItem content displays with a visible border and the heading shown at the top
- **Inline editable fields:** heading, body (both fully editable)
- **Visual indicator:** Blue border indicates the tab panel boundaries
- **Note:** Tab switching is disabled in edit mode - all tabs display simultaneously

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Overview" },
    "body": { "value": "<p>Product overview content here.</p>" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Technical Specifications" },
    "body": {
      "value": "<h3>Dimensions</h3><ul><li>Width: 24 inches</li><li>Height: 36 inches</li><li>Depth: 12 inches</li></ul><h3>Materials</h3><p>Constructed from high-grade aluminum with powder-coated finish.</p><h3>Weight Capacity</h3><p>Maximum load: 150 lbs distributed evenly.</p>"
    }
  }
}
```

### Multiple TabItems Example (Full Container)

```json
{
  "TabsContainer": {
    "tabs": [
      {
        "heading": { "value": "Overview" },
        "body": { "value": "<p>Product introduction and key features.</p>" }
      },
      {
        "heading": { "value": "Specifications" },
        "body": { "value": "<p>Technical details and dimensions.</p>" }
      },
      {
        "heading": { "value": "Reviews" },
        "body": { "value": "<p>Customer feedback and ratings.</p>" }
      }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- TabItem data sources: `/sitecore/content/[Site]/Home/Data/Tabs/`
- Or created inline with the page

### Data Source Location

TabItems are typically created as:
1. **Local data sources:** Created automatically when adding TabItem in Experience Editor
2. **Shared data sources:** `/sitecore/content/[Site]/Home/Data/Tabs/[TabItem Name]`

### Personalization Opportunities

- **heading:** Can be personalized to show different tab labels per segment
- **body:** Can be personalized to show different content per visitor segment

## Common Mistakes to Avoid

1. **Using TabItem without TabsContainer:** TabItem must be placed inside a TabsContainer's placeholder. It will not render correctly on its own.

2. **Overly long headings:** Tab labels that exceed 30 characters will truncate or cause layout issues in horizontal mode. Keep them concise.

3. **Empty body content:** Always provide content for the body field. Empty tabs confuse users and provide no value.

4. **Inconsistent heading styles:** Use parallel structure across all tabs (e.g., all nouns: "Overview, Features, Specs" not "Overview, Learn Features, Technical").

5. **Too much content:** While body supports unlimited content, consider breaking very long content into multiple tabs or using other components.

6. **Missing alt text on images:** If including images in body rich text, ensure they have proper alt text for accessibility.

## Related Components

- `TabsContainer` - Required parent component that houses TabItems
- `Accordion` - Alternative for expandable content sections
- `ContentBlock` - For standalone rich text content

## Accessibility

- Tab panel uses `role="tabpanel"` attribute
- `id` attribute links panel to its tab button via `aria-controls`
- Content is hidden via CSS (`hidden` class) when inactive, maintaining DOM presence for screen readers
- In edit mode, all content is visible for full accessibility during authoring

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the TabItem component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the parent page ID (use `mcp__marketer__search_site`)
2. Have a TabsContainer already added to the page (see TabsContainer docs)
3. Have the TabsContainer's UID for placeholder path construction
4. Have the TabItem rendering ID from the component manifest

### Important: Child Component

TabItem is a **child component** that must be placed inside a TabsContainer's placeholder. You must:
1. First add TabsContainer to the page
2. Get the TabsContainer's component UID
3. Construct the nested placeholder path
4. Add TabItem to that placeholder

### Step 1: Ensure TabsContainer Exists

```javascript
// If TabsContainer doesn't exist, add it first
const tabsResult = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "tabscontainer-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "TabsContainer_1",
  language: "en",
  fields: {}
});

const tabsContainerUid = tabsResult.componentId;
```

### Step 2: Construct Placeholder Path

```javascript
// TabItem placeholder follows pattern: {parent-placeholder}/tabscontainer-{uid}
const tabsPlaceholderPath = `headless-main/tabscontainer-${tabsContainerUid}`;
```

### Step 3: Add TabItem to TabsContainer

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "tabitem-rendering-id",
  placeholderPath: tabsPlaceholderPath,  // Nested placeholder
  componentItemName: "TabItem_Overview",  // Must be unique
  language: "en",
  fields: {
    "heading": "Overview",
    "body": "<p>Tab content goes here with <strong>rich text</strong> support.</p>"
  }
});

// Returns:
// {
//   "datasourceId": "created-datasource-guid",
//   "placeholderId": "headless-main/tabscontainer-{uid}"
// }
```

### Step 4: Update TabItem Fields (if needed)

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,  // From Step 3
  language: "en",
  fields: {
    "heading": "Updated Heading",
    "body": "<p>Updated body content with more details.</p>"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Product Page"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add TabsContainer (if not already present)
// ═══════════════════════════════════════════════════════════════
const tabsResult = await mcp__marketer__add_component_on_page({
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
// STEP 3: Add TabItem - Overview
// ═══════════════════════════════════════════════════════════════
const tab1 = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "tabitem-rendering-id",
  placeholderPath: tabsPlaceholder,
  componentItemName: "TabItem_Overview",
  language: "en",
  fields: {
    "heading": "Overview",
    "body": "<p>Welcome to our product overview. This innovative solution delivers exceptional performance.</p><h3>Key Benefits</h3><ul><li>Increased efficiency</li><li>Cost savings</li><li>Easy integration</li></ul>"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Add TabItem - Features
// ═══════════════════════════════════════════════════════════════
const tab2 = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "tabitem-rendering-id",
  placeholderPath: tabsPlaceholder,
  componentItemName: "TabItem_Features",
  language: "en",
  fields: {
    "heading": "Features",
    "body": "<h3>Core Features</h3><p>Our product includes:</p><ul><li>Advanced analytics dashboard</li><li>Real-time monitoring</li><li>Customizable alerts</li><li>API integrations</li></ul>"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 5: Add TabItem - Specifications
// ═══════════════════════════════════════════════════════════════
const tab3 = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "tabitem-rendering-id",
  placeholderPath: tabsPlaceholder,
  componentItemName: "TabItem_Specifications",
  language: "en",
  fields: {
    "heading": "Specifications",
    "body": "<table><tr><th>Specification</th><th>Value</th></tr><tr><td>Dimensions</td><td>12 x 8 x 4 inches</td></tr><tr><td>Weight</td><td>2.5 lbs</td></tr><tr><td>Power</td><td>120V AC</td></tr></table>"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: TabsContainer with 3 TabItems
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| body | Rich Text | `"<p>HTML content</p>"` |

### Rich Text Body Examples

```javascript
// Simple paragraph
"body": "<p>Simple text content.</p>"

// With headings
"body": "<h3>Section Title</h3><p>Content under the heading.</p>"

// With list
"body": "<ul><li>Item one</li><li>Item two</li><li>Item three</li></ul>"

// With table
"body": "<table><tr><th>Header</th><th>Header</th></tr><tr><td>Cell</td><td>Cell</td></tr></table>"

// Combined formatting
"body": "<h3>Introduction</h3><p>This is <strong>bold</strong> and <em>italic</em> text.</p><ul><li>First item</li><li>Second item</li></ul>"
```

### MCP Authoring Checklist

Before authoring TabItem via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] TabsContainer already exists on the page
- [ ] Have TabsContainer's UID for placeholder construction
- [ ] Placeholder path follows pattern: `{parent}/tabscontainer-{uid}`
- [ ] Have TabItem rendering ID (from component manifest)
- [ ] Component item name is unique (e.g., `TabItem_Overview`)
- [ ] heading field has content (required)
- [ ] body field has content (required, uses HTML)

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `TabItem_2`, `TabItem_Features` |
| Component not visible | Wrong placeholder path | Verify `tabscontainer-{uid}` format matches TabsContainer UID |
| Tab not in container | Missing placeholder segment | Ensure full path: `headless-main/tabscontainer-{uid}` |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |
| "Cannot find field" | Wrong field name | Field names are case-sensitive: `heading`, `body` |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-pagebuilder` | Page creation and component placement |
| `TabsContainer Docs.md` | Parent component details and placeholder info |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
