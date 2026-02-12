# ProductResources Component

## Purpose

The ProductResources component displays a grid of resource cards linking to related documents, application notes, technical guides, and other supporting materials for a product. It features a responsive layout with a collapsible accordion view on mobile/tablet and an expanded three-column card grid on desktop. Each resource card shows tags, a title, and a brief description with a link to the resource.

## Sitecore Template Requirements

### Data Source

**Important:** This component reads all fields from the **page/route context**, not from a component-level datasource. The Product Page Template must contain the productResources field linking to resource items.

### Template Path

- **Page Template:** `/sitecore/templates/Project/[Site]/Products/Product Page`
- **Resource Item Template:** `/sitecore/templates/Project/[Site]/Resources/Resource`
- **No separate datasource template** - uses page-level fields

### Fields (Route/Page Level)

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| productResources | Multilist/Treelist | Yes* | References to Resource items | Links to Resources folder |

*Component won't render if productResources is empty or missing.

### Resource Item Fields

Each referenced Resource item should have:

| Field Name | Sitecore Type | Required | Description |
|------------|---------------|----------|-------------|
| name | Single-Line Text | Yes | Resource title displayed on card |
| url | General Link | Yes | Link to the resource (internal page or media) |
| SxaTags | Multilist | No | Tags/categories for the resource |

## JSS Field Component Mapping

The component uses custom rendering for resource cards:

| Resource Field | Display | Component |
|----------------|---------|-----------|
| name | Card title | `<p className="copy-base font-semibold">{fields?.name}</p>` |
| url | Card link | `<Link href={fields?.url ?? '/'}>{...}</Link>` |
| SxaTags | Tag badges | Via `Tag` component |

## Component Variants

The ProductResources exports a single default variant:

| Variant | Export Name | Description | Use Case |
|---------|-------------|-------------|----------|
| Default | `Default` | Resource card grid | Product detail pages |

### Layout Behavior

| Viewport | Layout | Behavior |
|----------|--------|----------|
| Mobile/Tablet | Accordion | Collapsed by default, expands on click |
| Desktop (lg+) | Grid | Always expanded, three-column layout |

### Theme Support

The component adapts tag colors based on theme:

| Theme | Tag Background |
|-------|---------------|
| primary | Content color (dark) |
| secondary | Tertiary color |
| tertiary | Content color (dark) |

## Content Authoring Instructions

### Field-by-Field Guidance

#### productResources (Multilist)

- **What to select:** Resource items relevant to this product
- **Selection path:** `/sitecore/content/[Site]/Data/Resources/`
- **Display:** Each selected item renders as a card
- **Order:** Cards display in selection order
- **Tips:** Select 3-9 resources for best visual balance

### Resource Item Content

When creating Resource items to reference:

#### name

- **What to enter:** Resource title/name
- **Tone/Style:** Descriptive, action-oriented
- **Character limit:** 60 characters recommended
- **Examples:** "Installation Guide", "Technical Specifications PDF", "Application Note: Food Processing"

#### url

- **What to enter:** Link to the resource
- **Link Types:**
  - Internal page: `/resources/installation-guide`
  - Media file: `/-/media/resources/spec-sheet.pdf`
  - External: `https://example.com/docs`
- **Target:** `_blank` recommended for PDFs

#### SxaTags (on Resource item)

- **What to select:** Relevant category tags
- **Selection path:** `/sitecore/content/[Site]/Data/SxaTags/`
- **Display:** Appears as badges above the resource title
- **Examples:** "PDF", "Video", "Technical", "Installation"

### Content Matrix (Variations)

| Variation | Resources Count | Use Case |
|-----------|-----------------|----------|
| Minimal | 1-3 resources | Basic product support |
| Standard | 4-6 resources | Most common setup |
| Comprehensive | 7-9 resources | Full resource library |

## Component Props Interface

```typescript
import { ComponentProps } from 'lib/component-props';
import { TagType } from 'lib/types/page/metadata';

export type ProductResourcesFields = {
  productResources?: Array<{
    name?: string;
    url?: string;
    fields?: { SxaTags?: TagType[] };
  }>;
};

export type ProductResourcesProps = ComponentProps & {
  fields?: ProductResourcesFields;
};
```

## Example Content Entry

### Page-Level Content (Product Page)

```json
{
  "fields": {
    "productResources": [
      {
        "name": "Installation Guide",
        "url": "/-/media/resources/x500-installation-guide.pdf",
        "fields": {
          "SxaTags": [
            { "id": "{TAG-GUID}", "displayName": "PDF" },
            { "id": "{TAG-GUID-2}", "displayName": "Installation" }
          ]
        }
      },
      {
        "name": "Technical Specifications",
        "url": "/products/x500/specifications",
        "fields": {
          "SxaTags": [
            { "id": "{TAG-GUID}", "displayName": "Technical" }
          ]
        }
      },
      {
        "name": "Application Note: Food Processing",
        "url": "/-/media/resources/x500-food-processing.pdf",
        "fields": {
          "SxaTags": [
            { "id": "{TAG-GUID}", "displayName": "Application Note" }
          ]
        }
      }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Product pages: `/sitecore/content/[Site]/Home/Products/[Product Name]`
- Resource items: `/sitecore/content/[Site]/Data/Resources/`
- SxaTags: `/sitecore/content/[Site]/Data/SxaTags/`

### Experience Editor Behavior

- **Field editing:** Use Forms panel to select/reorder productResources
- **Resource item editing:** Double-click resource cards to edit source items
- **Mobile accordion:** In Experience Editor, accordion is always expanded

### Resource Item Creation

Before linking resources, create Resource items:
1. Navigate to `/sitecore/content/[Site]/Data/Resources/`
2. Create new Resource item
3. Set name, url, and SxaTags fields
4. Publish the Resource item
5. Select in Product Page's productResources field

### Section Heading

The section heading is localized via translation system:
- "Resources & Applications"

### Accordion State Persistence

The accordion state is persisted in localStorage via `useProductAccordion` hook:
- Key: `product-accordion-resources`
- Persists open/closed state across page navigations

## Common Mistakes to Avoid

1. **Empty productResources:** If no resources are selected, the component won't render. Always ensure at least one resource is linked.

2. **Missing url on Resource items:** Resources without URLs will link to homepage. Always set the url field.

3. **Broken media links:** Ensure PDF and document links are valid and files are published.

4. **Missing name field:** Resources without names will display empty titles.

5. **Too many resources:** More than 9 resources can overwhelm the user. Consider categorizing or paginating.

6. **Unpublished Resource items:** Remember to publish Resource items after creation.

## Related Components

- `ProductHeader` - Product name, image, and CTA section
- `ProductOverview` - Key benefits, features, and applications
- `ProductTechSpecs` - Technical specifications table
- `Tag` - Child component for resource tags
- `AccordionMotion` - Child component for mobile accordion animation

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ProductResources component using the Marketer MCP tools.

### Important: Route-Context Component with Resource Items

The ProductResources component:
1. Reads the productResources field from the **page route context**
2. Requires **Resource items** to exist before they can be referenced
3. Resource items contain the actual content (name, url, tags)

### Step 1: Create Resource Items

First, create the Resource items that will be linked:

```javascript
// Create a Resource item
const resource1 = await mcp__marketer-mcp__create_content_item({
  name: "X500 Installation Guide",
  parentId: "{RESOURCES-FOLDER-GUID}",
  templateId: "{RESOURCE-TEMPLATE-GUID}",
  language: "en"
});

// Update Resource item fields
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: resource1.itemId,
  language: "en",
  fields: {
    "name": "Installation Guide",
    "url": "/-/media/resources/x500-installation-guide.pdf",
    "SxaTags": "{PDF-TAG-GUID}|{INSTALLATION-TAG-GUID}"
  }
});
```

### Step 2: Find the Product Page

```javascript
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "X500 Water System"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 3: Add ProductResources Component to Page

```javascript
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "product-resources-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ProductResources_Main",
  language: "en",
  fields: {}  // No component-level fields
});
```

### Step 4: Link Resources to Product Page

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,  // The page ID
  language: "en",
  fields: {
    "productResources": "{RESOURCE1-GUID}|{RESOURCE2-GUID}|{RESOURCE3-GUID}"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Create Resource items
// ═══════════════════════════════════════════════════════════════
// Create Installation Guide resource
const resource1 = await mcp__marketer-mcp__create_content_item({
  name: "X500 Installation Guide",
  parentId: "{RESOURCES-FOLDER-GUID}",
  templateId: "{RESOURCE-TEMPLATE-GUID}",
  language: "en"
});

await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: resource1.itemId,
  language: "en",
  fields: {
    "name": "Installation Guide",
    "url": "/-/media/resources/x500-installation-guide.pdf",
    "SxaTags": "{PDF-TAG-GUID}"
  }
});

// Create Tech Specs resource
const resource2 = await mcp__marketer-mcp__create_content_item({
  name: "X500 Technical Specifications",
  parentId: "{RESOURCES-FOLDER-GUID}",
  templateId: "{RESOURCE-TEMPLATE-GUID}",
  language: "en"
});

await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: resource2.itemId,
  language: "en",
  fields: {
    "name": "Technical Specifications",
    "url": "/products/x500/specifications",
    "SxaTags": "{TECHNICAL-TAG-GUID}"
  }
});

// Create Application Note resource
const resource3 = await mcp__marketer-mcp__create_content_item({
  name: "X500 Application Note Food Processing",
  parentId: "{RESOURCES-FOLDER-GUID}",
  templateId: "{RESOURCE-TEMPLATE-GUID}",
  language: "en"
});

await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: resource3.itemId,
  language: "en",
  fields: {
    "name": "Application Note: Food Processing",
    "url": "/-/media/resources/x500-food-processing.pdf",
    "SxaTags": "{APP-NOTE-TAG-GUID}"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 2: Find the product page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "X500 Water Purification"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Add ProductResources component
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "product-resources-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ProductResources_Main",
  language: "en",
  fields: {}
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Link resources to product page
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "productResources": `${resource1.itemId}|${resource2.itemId}|${resource3.itemId}`
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: ProductResources displays linked resources
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| productResources | Multilist | Page item | `"{GUID1}\|{GUID2}\|{GUID3}"` |

### Resource Item Fields

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| name | Single-Line Text | Resource item | `"Plain text value"` |
| url | General Link | Resource item | `"/-/media/path.pdf"` or `"/internal/path"` |
| SxaTags | Multilist | Resource item | `"{GUID}"` or `"{GUID1}\|{GUID2}"` |

### MCP Authoring Checklist

Before authoring ProductResources via MCP, verify:

- [ ] Have Product Page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have ProductResources rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Resource items exist in Data/Resources folder
- [ ] Resource items have name and url fields populated
- [ ] Product page's productResources field references Resource item GUIDs

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ProductResources_2` |
| Component not visible | productResources field empty | Link at least one Resource item |
| Cards show no title | Resource item missing name | Update Resource item's name field |
| Cards link to homepage | Resource item missing url | Update Resource item's url field |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
