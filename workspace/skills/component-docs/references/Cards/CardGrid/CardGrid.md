# CardGrid Component

## Purpose

The CardGrid component displays a collection of Card components in a responsive grid layout. It features a heading and a placeholder for child cards that automatically adjusts columns based on viewport width. The component supports multiple variants for different visual presentations: Default (left-aligned heading), ContentCentered (centered heading), and FullWidth (full-bleed layout). It's ideal for showcasing a collection of related content cards.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Cards/Card Grid`
- **Template Name:** `Card Grid`

### Fields

| Field Name | Sitecore Type    | Required | Description            | Validation/Constraints       |
| ---------- | ---------------- | -------- | ---------------------- | ---------------------------- |
| heading    | Single-Line Text | Yes      | Grid section heading   | Recommended max 80 characters|

### Rendering Parameters (Styles)

| Parameter | Type     | Options                      | Default   | Description                     |
| --------- | -------- | ---------------------------- | --------- | ------------------------------- |
| theme     | Droplist | primary, secondary, tertiary | none      | Color theme for the section     |
| cardGrid  | Droplist | md:grid-cols-2, md:grid-cols-3, md:grid-cols-4 | md:grid-cols-3 | Number of columns at medium+ breakpoint |
| transparent | Checkbox | true, false                | false     | Makes background transparent    |

## Placeholder Configuration

The CardGrid exposes a placeholder for child components:

| Placeholder Key  | Allowed Components | Description                    |
| ---------------- | ------------------ | ------------------------------ |
| `cardgrid-{*}`   | Card               | Container for Card components  |

**Dynamic Placeholder:** The placeholder uses the pattern `cardgrid-{DynamicPlaceholderId}` where `{DynamicPlaceholderId}` is replaced with the component's unique identifier.

## JSS Field Component Mapping

| Sitecore Field | JSS Component                              | Import                                              |
| -------------- | ------------------------------------------ | --------------------------------------------------- |
| heading        | `<Text field={fields.heading} tag="h2" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

The CardGrid component exports three rendering variants:

| Variant        | Export Name      | Description                              | Use Case                        |
| -------------- | ---------------- | ---------------------------------------- | ------------------------------- |
| Default        | `Default`        | Contained width, left-aligned heading    | Standard card collections       |
| ContentCentered| `ContentCentered`| Contained width, centered heading        | Featured or highlighted sections|
| FullWidth      | `FullWidth`      | Full bleed width, centered heading       | Hero-style card sections        |

## Responsive Grid Behavior

| Viewport          | Columns (Default) | Layout                          |
| ----------------- | ----------------- | ------------------------------- |
| Mobile (<768px)   | 1                 | Single column stack             |
| Tablet+ (768px+)  | 2-4 (configurable)| Multi-column grid              |

**Note:** The default is 3 columns at medium breakpoint and above. This can be customized via the `cardGrid` rendering parameter.

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The section title that introduces the card collection
- **Tone/Style:** Clear, descriptive of the content theme
- **Character limit:** 80 characters recommended
- **Example:** "Our Solutions" or "Featured Resources"

### Variant Selection Guide

| Content Type          | Recommended Variant | Reasoning                           |
| --------------------- | ------------------- | ----------------------------------- |
| General content       | Default             | Standard presentation               |
| Featured/highlighted  | ContentCentered     | Draws attention with centered layout|
| Hero sections         | FullWidth           | Maximum visual impact               |

### Content Matrix (Variations)

| Variation | Required Fields | Child Components | Use Case                      |
| --------- | --------------- | ---------------- | ----------------------------- |
| Minimal   | heading         | 2-3 Cards        | Small card collection         |
| Standard  | heading         | 3-6 Cards        | Typical grid layout           |
| Large     | heading         | 6-12 Cards       | Comprehensive content grid    |

## Component Props Interface

```typescript
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type CardGridFields = {
  heading: Field<string>;
};

type CardGridProps = ComponentProps & {
  fields: CardGridFields;
};
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Our Solutions" }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- CardGrid data sources: `/sitecore/content/[Site]/Home/Data/Card Grids/`

### Experience Editor Behavior

- **Inline editable fields:** heading
- **Placeholder editing:** Click within the cards area to add/edit child Card components

### Rendering Variant Selection

In Experience Editor or Content Editor:
1. Select the CardGrid component
2. Open "Rendering Properties" or "Component Properties"
3. Choose variant from dropdown: Default, ContentCentered, or FullWidth

## Common Mistakes to Avoid

1. **Missing heading:** Always provide a heading to give context to the card collection.

2. **Mismatched card count:** For visual balance:
   - 3-column grid: Use 3, 6, or 9 cards
   - 4-column grid: Use 4, 8, or 12 cards

3. **Inconsistent card content:** Ensure all cards have similar content lengths for visual consistency.

4. **Wrong variant for context:**
   - Use Default for general sections
   - Use FullWidth only for high-impact hero sections

5. **Too many cards:** For large collections (12+), consider pagination or multiple CardGrid components with different categories.

## Related Components

- `Card` - Child component placed inside CardGrid's placeholder
- `CardCarousel` - Alternative container with carousel/slider functionality
- `CardBanner` - Alternative container with background image and cards

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the CardGrid component using the Marketer MCP tools.

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Page Name"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add CardGrid to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-grid-rendering-id",  // Or variant-specific ID
  placeholderPath: "headless-main",
  componentItemName: "CardGrid_Solutions",
  language: "en",
  fields: {
    "heading": "Our Solutions"
  }
});

const datasourceId = result.datasourceId;
const dynamicPlaceholderId = result.placeholderId;  // Needed for adding child cards
```

### Step 3: Add Child Card Components

```javascript
// Add cards to the CardGrid's placeholder
const cardPlaceholder = `headless-main/cardgrid-{${dynamicPlaceholderId}}`;

// Card 1
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: cardPlaceholder,
  componentItemName: "Card_Solution1",
  language: "en",
  fields: {
    "heading": "Solution One",
    "body": "<p>Description of solution one.</p>"
  }
});

// Continue adding more cards...
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Solutions Page"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add CardGrid component (ContentCentered variant)
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-grid-content-centered-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "CardGrid_FeaturedSolutions",
  language: "en",
  fields: {
    "heading": "Featured Solutions"
  }
});

const dynamicId = addResult.placeholderId;
const cardPlaceholder = `headless-main/cardgrid-{${dynamicId}}`;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Add child Card components
// ═══════════════════════════════════════════════════════════════

// Card 1
const card1 = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: cardPlaceholder,
  componentItemName: "Card_Consulting",
  language: "en",
  fields: {
    "heading": "Consulting Services",
    "body": "<p>Expert guidance for your digital transformation journey.</p>"
  }
});

await mcp__marketer__update_content({
  siteName: "main",
  itemId: card1.datasourceId,
  language: "en",
  fields: {
    "image": "<image mediaid='{CONSULTING-IMAGE-GUID}' />",
    "link": "<link linktype='internal' id='{CONSULTING-PAGE-GUID}' text='Learn More' />"
  }
});

// Card 2
const card2 = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: cardPlaceholder,
  componentItemName: "Card_Development",
  language: "en",
  fields: {
    "heading": "Development Services",
    "body": "<p>Custom solutions built to meet your unique needs.</p>"
  }
});

await mcp__marketer__update_content({
  siteName: "main",
  itemId: card2.datasourceId,
  language: "en",
  fields: {
    "image": "<image mediaid='{DEVELOPMENT-IMAGE-GUID}' />",
    "link": "<link linktype='internal' id='{DEVELOPMENT-PAGE-GUID}' text='Learn More' />"
  }
});

// Card 3
const card3 = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: cardPlaceholder,
  componentItemName: "Card_Support",
  language: "en",
  fields: {
    "heading": "Support Services",
    "body": "<p>Ongoing assistance to keep your systems running smoothly.</p>"
  }
});

await mcp__marketer__update_content({
  siteName: "main",
  itemId: card3.datasourceId,
  language: "en",
  fields: {
    "image": "<image mediaid='{SUPPORT-IMAGE-GUID}' />",
    "link": "<link linktype='internal' id='{SUPPORT-PAGE-GUID}' text='Learn More' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: CardGrid with 3 child cards (balanced 3-column grid)
// ═══════════════════════════════════════════════════════════════
```

### Variant Selection via Rendering

To use a specific variant, use the corresponding rendering ID:

| Variant        | Rendering Name           | Use Case                        |
|----------------|--------------------------|--------------------------------|
| Default        | `CardGrid`               | Standard card collections       |
| ContentCentered| `CardGrid-ContentCentered`| Featured/highlighted sections  |
| FullWidth      | `CardGrid-FullWidth`     | Hero-style card sections        |

### Field Type Quick Reference

| Field   | Type             | MCP Format           |
|:--------|:-----------------|:---------------------|
| heading | Single-Line Text | `"Plain text value"` |

### Placeholder Path Pattern

For CardGrid's child placeholder:
```
headless-main/cardgrid-{DYNAMIC_PLACEHOLDER_ID}
```

The `DYNAMIC_PLACEHOLDER_ID` is returned when you add the CardGrid component.

### MCP Authoring Checklist

Before authoring CardGrid via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have CardGrid rendering ID (correct variant from component manifest)
- [ ] Have Card rendering ID (for child cards)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Save the dynamic placeholder ID returned when adding CardGrid
- [ ] Plan card count for visual balance (multiples of grid columns)

### MCP Error Handling

| Error                  | Cause                        | Solution                                      |
|:-----------------------|:-----------------------------|:----------------------------------------------|
| "Item already exists"  | Duplicate component name     | Use unique suffix: `CardGrid_2`               |
| Component not visible  | Wrong placeholder path       | Use `"headless-main"` without leading slash   |
| Cards not appearing    | Wrong child placeholder path | Use dynamic ID from CardGrid response         |
| Unbalanced grid        | Card count not multiple of columns | Add/remove cards to match column count   |
| `updatedFields: {}`    | Normal response              | Update succeeded despite empty response       |

### Related Skills for MCP Authoring

| Skill                         | Purpose                                |
|:------------------------------|:---------------------------------------|
| `/sitecore-author-placeholder`| Placeholder path construction rules    |
| `/sitecore-author-image`      | Image field XML formatting for cards   |
| `/sitecore-author-link`       | Link field XML formatting for cards    |
| `/sitecore-upload-media`      | Upload images to Media Library first   |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
