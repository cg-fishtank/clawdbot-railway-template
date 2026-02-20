# ProductOverview Component

## Purpose
ProductOverview displays a three-section overview of a product, covering Key Benefits, Features, and Applications. It reads all three Rich Text fields (`productKeyBenefits`, `productFeatures`, `productApplications`) from the route (page item) context and renders nothing unless all three fields are present. Each section is conditionally rendered as a bordered card only when its field has a value; otherwise the `RichText` component is rendered inline without a card wrapper. The component uses an accordion on mobile/tablet and a side-by-side row layout on desktop.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `7ce575b4-2b03-4650-a325-22db4e7349ce` |
| **Component Name** | `ProductOverview` |
| **Category** | `Products` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `productKeyBenefits` | Rich Text (`RichTextField`) | No* | Content for the "Key Benefits" card section | *All three fields must be present on the route for the component to render at all; individual cards only display when their field has a value |
| `productFeatures` | Rich Text (`RichTextField`) | No* | Content for the "Features" card section | Same constraint as above |
| `productApplications` | Rich Text (`RichTextField`) | No* | Content for the "Applications" card section | Same constraint as above |

> Important: The parent component (`ProductOverviewDefault`) guards on all three fields simultaneously — if any one of `productKeyBenefits`, `productFeatures`, or `productApplications` is missing from the route, the entire component is suppressed. At least one should contain authored content for meaningful output.

**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `productKeyBenefits` | `RichText` | `@sitecore-content-sdk/nextjs` |
| `productFeatures` | `RichText` | `@sitecore-content-sdk/nextjs` |
| `productApplications` | `RichText` | `@sitecore-content-sdk/nextjs` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-----------|----------|
| Default | `Default` | Standard three-section overview with accordion on mobile and horizontal card row on desktop |

## Props Interface
```typescript
// From lib/types/components/Products/product-overview

type ProductOverviewFields = {
  productKeyBenefits?: RichTextField;
  productFeatures?: RichTextField;
  productApplications?: RichTextField;
};

type ProductOverviewProps = {
  params: Record<string, string>;
  rendering: ComponentRendering;
  fields?: ProductOverviewFields;
};

type ProductOverviewCardProps = {
  field?: RichTextField;
  title: string;
  cardClasses: string;
  headingClasses: string;
  richtextClasses: string;
};
```

## Example Content Entry
### Minimum Viable Content
Ensure all three fields exist on the Product Page template (even if some are empty strings). Author content in at least one:
- **productKeyBenefits**: `<ul><li>High precision output</li><li>Low power consumption</li></ul>`
- **productFeatures**: `<ul><li>IP67 rated housing</li></ul>`
- **productApplications**: (leave empty — card will not render but component still appears)

### Full Content Example
- **productKeyBenefits**:
  ```html
  <ul>
    <li>Sub-millisecond response time</li>
    <li>±0.1% full-scale accuracy</li>
    <li>Wide temperature range: -40°C to +85°C</li>
  </ul>
  ```
- **productFeatures**:
  ```html
  <ul>
    <li>IP67 rated stainless steel housing</li>
    <li>4–20 mA and 0–10 V analog outputs</li>
    <li>IO-Link compatible</li>
  </ul>
  ```
- **productApplications**:
  ```html
  <ul>
    <li>Industrial process monitoring</li>
    <li>HVAC and building automation</li>
    <li>Food and beverage production</li>
  </ul>
  ```

## MCP Authoring Instructions
### Step 1: Add to Page
1. Open the Product Page item in Sitecore Content Editor or Experience Editor.
2. In the Presentation Details, add the `ProductOverview` rendering (ID: `7ce575b4-2b03-4650-a325-22db4e7349ce`) to the appropriate placeholder on the Product Page layout.
3. No datasource is required — the component reads from the route (page item) fields.

### Step 2: Configure Fields
1. On the Product Page item, locate the three Rich Text fields: **productKeyBenefits**, **productFeatures**, and **productApplications**.
2. All three fields must exist on the page template for the component to render. Author content using the Rich Text editor — bulleted lists work well for each section.
3. Individual cards are suppressed when their specific field has no content, but the component shell still renders as long as all three route fields are present.
4. Save and publish the Product Page item.

### Field Type Quick Reference
| Field | Type | Notes |
|-------|------|-------|
| `productKeyBenefits` | Rich Text | "Key Benefits" card; card hidden when field has no value |
| `productFeatures` | Rich Text | "Features" card; card hidden when field has no value |
| `productApplications` | Rich Text | "Applications" card; card hidden when field has no value |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
