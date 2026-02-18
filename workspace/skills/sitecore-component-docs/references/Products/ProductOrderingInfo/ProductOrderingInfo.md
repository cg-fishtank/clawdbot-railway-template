# ProductOrderingInfo Component

## Purpose

The ProductOrderingInfo component displays product ordering information in a table format, showing part numbers, descriptions, and lead times. It reads structured data from the product page's `productOrderingInfo` multilist field, which references child items containing ordering details. On mobile/tablet it renders as an accordion, and on desktop as an expanded table.

## Sitecore Template Requirements

### Data Source

**Important:** This component reads all fields from the **page/route context** via `useSitecore()`, not from a component-level datasource. The Product Page Template must contain the `productOrderingInfo` field.

### Template Path

- **Page Template:** `/sitecore/templates/Project/[Site]/Products/Product Page`
- **No separate datasource template** - uses page-level fields

### Fields (Route/Page Level)

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| productOrderingInfo | Multilist | No | References to ordering info items | Links to ordering info child items |

### Ordering Info Item Fields

Each item referenced by `productOrderingInfo` contains:

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| partNumber | Single-Line Text | No | Product part number / SKU | Alphanumeric format |
| description | Rich Text | No | Part description | Supports basic rich text formatting |
| partLeadTime | Single-Line Text | No | Manufacturing/shipping lead time | e.g., "2-4 weeks" |

### Rendering Parameters (Styles)

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| theme | Droplist | primary, secondary, tertiary | primary | Color theme |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| partNumber | `<Text field={item.fields?.partNumber} />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| description | `<RichText field={item.fields?.description} />` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| partLeadTime | `<Text field={item.fields?.partLeadTime} />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |

## Component Variants

| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard ordering info table |

## Content Authoring Instructions

### Field-by-Field Guidance

#### productOrderingInfo (Multilist - Page Level)

- **What to select:** Ordering information items for this product
- **Selection path:** `/sitecore/content/[Site]/Home/Data/ProductOrderingInfo/` or product-specific child items
- **Display:** Each referenced item becomes a row in the ordering table

#### partNumber (Per Item)

- **What to enter:** The product part number or SKU
- **Format:** Alphanumeric, following your catalog numbering scheme
- **Example:** "WPS-X500-01"

#### description (Per Item)

- **What to enter:** Description of this specific part or configuration
- **Tone/Style:** Technical, concise
- **Formatting:** Basic rich text - can include bold, links
- **Example:** "<p>Standard configuration with integrated filtration unit</p>"

#### partLeadTime (Per Item)

- **What to enter:** Expected lead time for manufacturing or shipping
- **Format:** Human-readable time range
- **Example:** "2-4 weeks"

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | productOrderingInfo (1 item with partNumber) | description, partLeadTime | Single part listing |
| Standard | productOrderingInfo (2-5 items with partNumber, description) | partLeadTime | Typical product variants |
| Full | productOrderingInfo (all items, all fields) | - | Complete ordering catalog |

## Component Props Interface

```typescript
import { RichTextField, Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export type ProductOrderingInfoFields = {
  productOrderingInfo?: Array<{
    fields?: {
      partNumber?: Field<string>;
      description?: RichTextField;
      partLeadTime?: Field<string>;
    };
  }>;
};

export type ProductOrderingInfoProps = ComponentProps & {
  fields?: ProductOrderingInfoFields;
};

export type ProductOrderingInfoItemTableRowProps = {
  item?: NonNullable<ProductOrderingInfoFields['productOrderingInfo']>[number];
  index?: number;
  tableRowClasses?: string;
  tableCellClasses?: string;
};
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "productOrderingInfo": [
      {
        "fields": {
          "partNumber": { "value": "WPS-X500-01" }
        }
      }
    ]
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "productOrderingInfo": [
      {
        "fields": {
          "partNumber": { "value": "WPS-X500-01" },
          "description": { "value": "<p>Standard configuration with integrated filtration unit</p>" },
          "partLeadTime": { "value": "2-4 weeks" }
        }
      },
      {
        "fields": {
          "partNumber": { "value": "WPS-X500-02" },
          "description": { "value": "<p>Extended capacity model with dual filtration</p>" },
          "partLeadTime": { "value": "4-6 weeks" }
        }
      },
      {
        "fields": {
          "partNumber": { "value": "WPS-X500-ACC" },
          "description": { "value": "<p>Replacement filter cartridge kit</p>" },
          "partLeadTime": { "value": "1-2 weeks" }
        }
      }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Product pages: `/sitecore/content/[Site]/Home/Products/[Product Name]`
- Ordering info items: `/sitecore/content/[Site]/Home/Data/ProductOrderingInfo/` or as child items under the product page
- The `productOrderingInfo` field is edited on the product page item

### Experience Editor Behavior

- **Inline editable fields:** partNumber, description (within table rows)
- **Forms panel required:** productOrderingInfo (multilist picker)
- **Responsive behavior:** Accordion on mobile/tablet, expanded table on desktop

### Table Layout

| Column | Field | Desktop | Mobile/Tablet |
|--------|-------|---------|---------------|
| Part Number | partNumber | Table column | Accordion header |
| Description | description | Table column | Accordion body |
| Lead Time | partLeadTime | Table column | Accordion body |

## Common Mistakes to Avoid

1. **Empty productOrderingInfo:** If no items are selected, the component returns nothing (no empty table displayed).

2. **Missing partNumber:** While technically optional, part numbers are the primary identifier in the table and should always be provided.

3. **Using literal `\n` in description:** Use HTML tags (`<p>`, `<br />`) for formatting in the rich text description field.

4. **Too many ordering items:** Consider pagination or grouping if more than 10-15 items are needed.

5. **Inconsistent lead time format:** Use a consistent format across all items (e.g., always "X-Y weeks").

## Related Components

- `ProductHeader` - Product name, description, and hero image
- `ProductOverview` - Product features and applications
- `ProductResources` - Related resources and application notes
- `ProductTechSpecs` - Technical specifications table
- `ProductDocuments` - Downloadable product documents

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ProductOrderingInfo component using the Marketer MCP tools.

### Important: Route-Context Component

The ProductOrderingInfo component reads all fields from the **page route context**, not from a component datasource. This means:

1. The `productOrderingInfo` field is authored on the **Product Page** itself
2. Individual ordering info items must be created as separate content items
3. The multilist field on the page references the ordering info item GUIDs

### Step 1: Find the Product Page

```javascript
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Product Name"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Create Ordering Info Items

```javascript
// Create individual ordering info items
const item1 = await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentItemId: "{ORDERING-INFO-FOLDER-GUID}",
  itemName: "WPS-X500-01",
  templateId: "{ORDERING-INFO-TEMPLATE-GUID}",
  language: "en",
  fields: {
    "partNumber": "WPS-X500-01",
    "description": "<p>Standard configuration with integrated filtration unit</p>",
    "partLeadTime": "2-4 weeks"
  }
});

const item2 = await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentItemId: "{ORDERING-INFO-FOLDER-GUID}",
  itemName: "WPS-X500-02",
  templateId: "{ORDERING-INFO-TEMPLATE-GUID}",
  language: "en",
  fields: {
    "partNumber": "WPS-X500-02",
    "description": "<p>Extended capacity model with dual filtration</p>",
    "partLeadTime": "4-6 weeks"
  }
});
```

### Step 3: Add ProductOrderingInfo Component to Page

```javascript
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "product-ordering-info-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ProductOrderingInfo_1",
  language: "en",
  fields: {}  // No component-level fields
});
```

### Step 4: Update productOrderingInfo Field on Page

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "productOrderingInfo": "{ITEM1-GUID}|{ITEM2-GUID}"
  }
});
```

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| productOrderingInfo | Multilist | Page item | `"{GUID1}\|{GUID2}"` |
| partNumber | Single-Line Text | Ordering info item | `"WPS-X500-01"` |
| description | Rich Text | Ordering info item | `"<p>HTML content</p>"` |
| partLeadTime | Single-Line Text | Ordering info item | `"2-4 weeks"` |

### MCP Authoring Checklist

- [ ] Have Product Page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have ProductOrderingInfo rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Ordering info items exist and have content
- [ ] Have GUIDs for ordering info items to reference in `productOrderingInfo`
- [ ] Rich text description uses HTML tags, not `\n`

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ProductOrderingInfo_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| Component not rendering | Empty productOrderingInfo | Ensure multilist field references valid items |
| No table rows | Referenced items missing fields | Verify ordering info items have partNumber |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |
| "Cannot find field" | Wrong field name | Field names are case-sensitive |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-author` | Full orchestration workflow |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-18 | Initial documentation | Claude Code |
