# ProductOverview Component

## Purpose

The ProductOverview component displays a section with three content cards highlighting the product's key benefits, features, and applications. It features a responsive layout with a collapsible accordion view on mobile/tablet and an expanded card grid on desktop. Each card contains a title and rich text content describing different aspects of the product's value proposition.

## Sitecore Template Requirements

### Data Source

**Important:** This component reads all fields from the **page/route context**, not from a component-level datasource. The Product Page Template must contain all product overview fields.

### Template Path

- **Page Template:** `/sitecore/templates/Project/[Site]/Products/Product Page`
- **No separate datasource template** - uses page-level fields

### Fields (Route/Page Level)

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| productKeyBenefits | Rich Text | Yes* | Key benefits of the product | Bullet points recommended |
| productFeatures | Rich Text | Yes* | Product features list | Bullet points recommended |
| productApplications | Rich Text | Yes* | Use cases and applications | Bullet points recommended |

*At least one field must have content for the component to render.

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| productKeyBenefits | `<RichText field={field} className={richtextClasses} />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| productFeatures | `<RichText field={field} className={richtextClasses} />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| productApplications | `<RichText field={field} className={richtextClasses} />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

The ProductOverview exports a single default variant:

| Variant | Export Name | Description | Use Case |
|---------|-------------|-------------|----------|
| Default | `Default` | Three-card overview layout | Product detail pages |

### Layout Behavior

| Viewport | Layout | Behavior |
|----------|--------|----------|
| Mobile/Tablet | Accordion | Collapsed by default, expands on click |
| Desktop (lg+) | Grid | Always expanded, three-column layout |

### Theme Support

The component adapts bullet point colors based on theme:

| Theme | List Marker Color |
|-------|------------------|
| primary | Tertiary color |
| secondary | Tertiary color |
| tertiary | Secondary color |

## Content Authoring Instructions

### Field-by-Field Guidance

#### productKeyBenefits

- **What to enter:** Primary value propositions and benefits
- **Format:** Bulleted list recommended
- **Tone/Style:** Benefits-focused, customer-centric
- **Content ideas:** ROI, efficiency gains, cost savings, quality improvements
- **Example:**
  ```html
  <ul>
    <li>Reduces operating costs by up to 40%</li>
    <li>Extends equipment lifespan by 3x</li>
    <li>Zero maintenance required for 5 years</li>
    <li>Industry-leading energy efficiency rating</li>
  </ul>
  ```

#### productFeatures

- **What to enter:** Technical features and capabilities
- **Format:** Bulleted list recommended
- **Tone/Style:** Technical but accessible
- **Content ideas:** Specifications, technologies, materials, innovations
- **Example:**
  ```html
  <ul>
    <li>5-stage advanced filtration system</li>
    <li>Smart monitoring with IoT connectivity</li>
    <li>Stainless steel construction</li>
    <li>Automatic self-cleaning mechanism</li>
  </ul>
  ```

#### productApplications

- **What to enter:** Use cases and industry applications
- **Format:** Bulleted list recommended
- **Tone/Style:** Industry-specific, practical
- **Content ideas:** Industries, use cases, environments, scenarios
- **Example:**
  ```html
  <ul>
    <li>Food and beverage manufacturing</li>
    <li>Pharmaceutical production</li>
    <li>Data center cooling systems</li>
    <li>Municipal water treatment</li>
  </ul>
  ```

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | Any one field | Other two fields | Basic product overview |
| Standard | productKeyBenefits, productFeatures | productApplications | Most common setup |
| Full | All three fields | - | Complete product overview |

## Component Props Interface

```typescript
import { RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export type ProductOverviewFields = {
  productApplications?: RichTextField;
  productFeatures?: RichTextField;
  productKeyBenefits?: RichTextField;
};

export type ProductOverviewProps = ComponentProps & {
  fields: ProductOverviewFields;
};
```

## Example Content Entry

### Page-Level Content (Product Page)

```json
{
  "fields": {
    "productKeyBenefits": {
      "value": "<ul><li>Reduces operating costs by up to 40%</li><li>Extends equipment lifespan by 3x</li><li>Zero maintenance required for 5 years</li><li>Industry-leading energy efficiency</li></ul>"
    },
    "productFeatures": {
      "value": "<ul><li>5-stage advanced filtration system</li><li>Smart monitoring with IoT connectivity</li><li>Stainless steel construction</li><li>Automatic self-cleaning mechanism</li></ul>"
    },
    "productApplications": {
      "value": "<ul><li>Food and beverage manufacturing</li><li>Pharmaceutical production</li><li>Data center cooling systems</li><li>Municipal water treatment</li></ul>"
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Product pages: `/sitecore/content/[Site]/Home/Products/[Product Name]`
- All fields are edited directly on the product page item

### Experience Editor Behavior

- **Inline editable fields:** productKeyBenefits, productFeatures, productApplications
- **Mobile accordion:** In Experience Editor, accordion is always expanded for editing
- **Rich text toolbar:** Standard RTE controls available for formatting

### Section Headings

The section headings are localized via translation system, not authored:
- "Overview" - Section title
- "Key Benefits" - First card heading
- "Features" - Second card heading
- "Applications" - Third card heading

### Accordion State Persistence

The accordion state is persisted in localStorage via `useProductAccordion` hook:
- Key: `product-accordion-overview`
- Persists open/closed state across page navigations
- Resets when session ends

## Common Mistakes to Avoid

1. **Empty fields:** If all three fields are empty, the component won't render. Ensure at least one field has content.

2. **Non-list content:** While any rich text is supported, bulleted lists display best in the card format.

3. **Overly long lists:** Keep each section to 4-6 bullet points for readability.

4. **Missing bullets in Experience Editor:** When editing, ensure list formatting is applied (not just line breaks).

5. **Inconsistent formatting:** Use the same list style across all three cards for visual consistency.

6. **Duplicate content:** Each section should contain unique content - don't repeat benefits in features.

## Related Components

- `ProductHeader` - Product name, image, and CTA section
- `ProductResources` - Related resources and documents
- `ProductTechSpecs` - Technical specifications table
- `AccordionMotion` - Child component for mobile accordion animation

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ProductOverview component using the Marketer MCP tools.

### Important: Route-Context Component

The ProductOverview component reads all fields from the **page route context**, not from a component datasource. This means:

1. All fields are authored on the **Product Page** itself
2. Adding the ProductOverview component does not create a separate datasource
3. Content updates go to the page item, not a component datasource

### Step 1: Find the Product Page

```javascript
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "X500 Water System"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add ProductOverview Component to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "product-overview-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ProductOverview_Main",
  language: "en",
  fields: {}  // No component-level fields
});
```

### Step 3: Update Page-Level Fields

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,  // The page ID, not a datasource
  language: "en",
  fields: {
    "productKeyBenefits": "<ul><li>Reduces operating costs by up to 40%</li><li>Extends equipment lifespan by 3x</li><li>Zero maintenance required for 5 years</li></ul>",
    "productFeatures": "<ul><li>5-stage advanced filtration system</li><li>Smart monitoring with IoT connectivity</li><li>Stainless steel construction</li></ul>",
    "productApplications": "<ul><li>Food and beverage manufacturing</li><li>Pharmaceutical production</li><li>Data center cooling systems</li></ul>"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find the product page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "X500 Water Purification"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add ProductOverview component
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "product-overview-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ProductOverview_Main",
  language: "en",
  fields: {}
});

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update overview fields on page
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "productKeyBenefits": "<ul><li>Reduces operating costs by up to 40%</li><li>Extends equipment lifespan by 3x</li><li>Zero maintenance required for 5 years</li><li>Industry-leading energy efficiency rating</li></ul>",
    "productFeatures": "<ul><li>5-stage advanced filtration system</li><li>Smart monitoring with IoT connectivity</li><li>Stainless steel construction</li><li>Automatic self-cleaning mechanism</li></ul>",
    "productApplications": "<ul><li>Food and beverage manufacturing</li><li>Pharmaceutical production</li><li>Data center cooling systems</li><li>Municipal water treatment</li></ul>"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: ProductOverview displays page content
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| productKeyBenefits | Rich Text | Page item | `"<ul><li>Benefit 1</li><li>Benefit 2</li></ul>"` |
| productFeatures | Rich Text | Page item | `"<ul><li>Feature 1</li><li>Feature 2</li></ul>"` |
| productApplications | Rich Text | Page item | `"<ul><li>Application 1</li><li>Application 2</li></ul>"` |

### Recommended HTML Structure

For best display, use unordered lists:

```html
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
  <li>Fourth item</li>
</ul>
```

### MCP Authoring Checklist

Before authoring ProductOverview via MCP, verify:

- [ ] Have Product Page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have ProductOverview rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] At least one of the three fields has content
- [ ] Rich text uses `<ul><li>` structure for lists

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ProductOverview_2` |
| Component not visible | Missing required fields | Ensure at least one field has content |
| Lists not displaying | Wrong HTML structure | Use `<ul><li>` format |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
