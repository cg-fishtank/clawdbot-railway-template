# ProductOrderingInfo Component

## Purpose
ProductOrderingInfo displays a structured table of ordering information for a product, including part numbers, descriptions, and lead times. It reads the `productOrderingInfo` multilist from the route (page item) context and renders nothing if the field is absent or empty. The component presents an accordion view on mobile and tablet, and an always-expanded table on desktop.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `cfb7b695-6bce-4e2c-b9ab-a8e2d95e6fac` |
| **Component Name** | `ProductOrderingInfo` |
| **Category** | `Products` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `productOrderingInfo` | Multilist | No | References ordering info items; each item exposes `partNumber`, `description`, and `partLeadTime` child fields | Component renders nothing if field is absent or empty; table rows are only shown when at least one of the three sub-fields has a value |

**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `partNumber` (on ordering info item) | `Text` | `@sitecore-content-sdk/nextjs` |
| `description` (on ordering info item) | `RichText` | `@sitecore-content-sdk/nextjs` |
| `partLeadTime` (on ordering info item) | `Text` | `@sitecore-content-sdk/nextjs` |

> Note: In Experience Editor (`isEditing` mode) the fields are rendered using JSS `Text`/`RichText` components. In view mode, plain `<p>` tags are used, with HTML tags stripped from `description` via `stripHtmlTags`.

## Component Variants
| Variant | Export Name | Use Case |
|---------|-----------|----------|
| Default | `Default` | Standard ordering info table with accordion on mobile and expanded table on desktop |

## Props Interface
```typescript
// From lib/types/components/Products/product-ordering-info

type OrderingInfoItem = {
  fields: {
    partNumber?: Field<string>;
    description?: RichTextField;
    partLeadTime?: Field<string>;
  };
};

type ProductOrderingInfoFields = {
  productOrderingInfo?: OrderingInfoItem[];
};

type ProductOrderingInfoProps = {
  params: Record<string, string>;
  rendering: ComponentRendering;
  fields?: ProductOrderingInfoFields;
};

type ProductOrderingInfoItemTableRowProps = {
  item: OrderingInfoItem;
  index: number;
  tableRowClasses: string;
  tableCellClasses: string;
};
```

## Example Content Entry
### Minimum Viable Content
- **productOrderingInfo**: Select at least one ordering info item that has a `partNumber`, `description`, or `partLeadTime` value. A row is only rendered when at least one of these three fields is non-empty.

### Full Content Example
- **productOrderingInfo**: Select multiple ordering info items, e.g.:
  - Item 1: partNumber = `XR500-001-US`, description = `Standard Unit, US Spec`, partLeadTime = `4-6 weeks`
  - Item 2: partNumber = `XR500-002-EU`, description = `Standard Unit, EU Spec`, partLeadTime = `6-8 weeks`
  - Item 3: partNumber = `XR500-001-US-KIT`, description = `Starter Kit with mounting hardware`, partLeadTime = `8-10 weeks`

## MCP Authoring Instructions
### Step 1: Add to Page
1. Open the Product Page item in Sitecore Content Editor or Experience Editor.
2. In the Presentation Details, add the `ProductOrderingInfo` rendering (ID: `cfb7b695-6bce-4e2c-b9ab-a8e2d95e6fac`) to the appropriate placeholder on the Product Page layout.
3. No datasource is required — the component reads from the route (page item) fields.

### Step 2: Configure Fields
1. On the Product Page item, locate the **productOrderingInfo** multilist field.
2. Select one or more ordering info items from the Sitecore content tree. Each referenced item should have the following fields authored:
   - **partNumber**: Single-line text (e.g. `XR500-001-US`)
   - **description**: Rich Text (e.g. short description of the part/variant)
   - **partLeadTime**: Single-line text (e.g. `4-6 weeks`)
3. A table row is only rendered for items where at least one of the three fields has a value.
4. Save and publish the Product Page item.

### Field Type Quick Reference
| Field | Type | Notes |
|-------|------|-------|
| `productOrderingInfo` | Multilist | References ordering info content items |
| `partNumber` (child field) | Single-Line Text | Displayed in "Part Number" column |
| `description` (child field) | Rich Text | HTML stripped in view mode; rendered via RichText in edit mode |
| `partLeadTime` (child field) | Single-Line Text | Displayed in "Lead Time" column |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
