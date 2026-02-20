# ProductResources Component

## Purpose
ProductResources displays a collection of related resources and application links for a product page. It reads the `productResources` multilist from the route (page item) context and renders nothing if the field is absent or empty. Each resource item is rendered as a card showing the first SXA tag (as a category label), the resource name, and a "Learn More" link button. The component uses an accordion on mobile/tablet and a responsive card grid (1–3 columns) on desktop.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `f55fcc88-6710-4571-9c7d-a440e35ac287` |
| **Component Name** | `ProductResources` |
| **Category** | `Products` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `productResources` | Multilist | No | References Resource content items; each item exposes `name`, `url`, and `SxaTags` | Component renders nothing if field is absent or the array is empty; only the first `SxaTags` entry is displayed per card |

**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| N/A (`name` and `url` accessed as plain JS properties; `SxaTags` as array) | — | `@sitecore-content-sdk/nextjs` (`useSitecore`) |

> Note: The resource item's `name` and `url` are plain string properties, not Sitecore `Field<string>` types. No JSS `Text`, `Link`, or `Image` rendering components are used. The "Learn More" button is constructed with a literal link object. SXA tags are rendered via a custom `Tag` component.

## Component Variants
| Variant | Export Name | Use Case |
|---------|-----------|----------|
| Default | `Default` | Standard resources card grid with accordion on mobile and 3-column grid on desktop |

## Props Interface
```typescript
// From lib/types/components/Products/product-resources

type SxaTag = {
  displayName: string;
};

type ResourceItem = {
  name: string;
  url: string;
  fields?: {
    SxaTags?: SxaTag[];
  };
};

type ProductResourcesFields = {
  productResources?: ResourceItem[];
};

type ProductResourcesProps = {
  params: Record<string, string>;
  rendering: ComponentRendering;
  fields?: ProductResourcesFields;
};

type ProductResourcesCardProps = {
  fields: ResourceItem;
  effectiveTheme: string;
};
```

## Example Content Entry
### Minimum Viable Content
- **productResources**: Select at least one Resource item with a `name` and `url` value.
  - Resource item: name = `Application Note: XR-500 in HVAC`, url = `/resources/an-xr500-hvac`

### Full Content Example
- **productResources**: Select multiple Resource items:
  - Item 1: name = `Application Note: XR-500 in HVAC`, url = `/resources/an-xr500-hvac`, SxaTags = ["Application Notes"]
  - Item 2: name = `White Paper: Industrial Sensor Best Practices`, url = `/resources/wp-sensor-best-practices`, SxaTags = ["White Papers"]
  - Item 3: name = `Case Study: Food & Beverage Deployment`, url = `/resources/cs-food-beverage`, SxaTags = ["Case Studies"]

## MCP Authoring Instructions
### Step 1: Add to Page
1. Open the Product Page item in Sitecore Content Editor or Experience Editor.
2. In the Presentation Details, add the `ProductResources` rendering (ID: `f55fcc88-6710-4571-9c7d-a440e35ac287`) to the appropriate placeholder on the Product Page layout.
3. No datasource is required — the component reads from the route (page item) fields.

### Step 2: Configure Fields
1. On the Product Page item, locate the **productResources** multilist field.
2. Select one or more Resource content items from the Sitecore content tree. Each referenced Resource item should have the following fields authored:
   - **name**: The display title of the resource (plain text property).
   - **url**: The URL or path the "Learn More" button links to (plain text property).
   - **SxaTags**: Assign SXA taxonomy tags — only the first tag's `displayName` is shown on the card as a category label.
3. The component renders nothing if `productResources` is absent or empty.
4. Save and publish the Product Page item.

### Field Type Quick Reference
| Field | Type | Notes |
|-------|------|-------|
| `productResources` | Multilist | References Resource content items |
| `name` (child property) | String | Resource card title; displayed as bold copy |
| `url` (child property) | String | Destination URL for the "Learn More" button |
| `SxaTags` (child property) | Multilist | Only the first tag's `displayName` is shown as a category chip |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
