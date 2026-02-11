# ProductTechSpecs Component

## Purpose

The ProductTechSpecs component displays a table of technical specifications for a product. It parses a URL-encoded key-value string into a structured table with "Parameter" and "Value" columns. The component features a responsive layout with a collapsible accordion view on mobile/tablet and an expanded table on desktop.

## Sitecore Template Requirements

### Data Source

**Important:** This component reads all fields from the **page/route context**, not from a component-level datasource. The Product Page Template must contain the productTechnicalSpecs field.

### Template Path

- **Page Template:** `/sitecore/templates/Project/[Site]/Products/Product Page`
- **No separate datasource template** - uses page-level fields

### Fields (Route/Page Level)

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| productTechnicalSpecs | Single-Line Text or Multi-Line Text | Yes* | URL-encoded key-value pairs | Format: `key1=value1&key2=value2` |

*Component won't render if productTechnicalSpecs is empty or missing.

## JSS Field Component Mapping

The component parses the field and renders a custom table:

| Element | Rendering |
|---------|-----------|
| Section heading | "Technical Specs" (localized) |
| Table header | "Parameter" / "Value" columns |
| Table rows | Parsed from `key=value&key=value` format |

## Component Variants

The ProductTechSpecs exports a single default variant:

| Variant | Export Name | Description | Use Case |
|---------|-------------|-------------|----------|
| Default | `Default` | Technical specs table | Product detail pages |

### Layout Behavior

| Viewport | Layout | Behavior |
|----------|--------|----------|
| Mobile/Tablet | Accordion | Collapsed by default, expands on click |
| Desktop (lg+) | Table | Always expanded, full-width table |

## Content Authoring Instructions

### Field-by-Field Guidance

#### productTechnicalSpecs

- **What to enter:** URL-encoded key-value pairs
- **Format:** `Parameter1=Value1&Parameter2=Value2&Parameter3=Value3`
- **Encoding:** Values should be URL-encoded if they contain special characters
- **Tips:** Use consistent parameter naming across products

### Format Specification

The field value uses ampersand-separated key-value pairs:

```
Capacity=10000 gallons/day&Power=220V/60Hz&Weight=500 lbs&Dimensions=48" x 36" x 72"&Operating Temp=32-120°F
```

**Parsing behavior:**
1. Split by `&` to get key-value pairs
2. Split each pair by `=` to separate parameter and value
3. URL-decode the value
4. Skip entries with empty values

### Example Values

#### Simple Product

```
Weight=25 lbs&Dimensions=12" x 8" x 4"&Material=Stainless Steel&Warranty=2 Years
```

#### Complex Product

```
Capacity=10000 gallons/day&Flow Rate=7 GPM&Power Requirements=220V/60Hz&Operating Temperature=32-120%C2%B0F&Weight=500 lbs&Dimensions=48%22 x 36%22 x 72%22&Noise Level=%3C65 dB&Filtration Stages=5&Membrane Type=Reverse Osmosis&Warranty=5 Years
```

**Note:** Special characters need URL encoding:
- `°` → `%C2%B0`
- `"` → `%22`
- `<` → `%3C`
- Space → `%20` (or leave as space)

### Content Matrix (Variations)

| Variation | Spec Count | Use Case |
|-----------|------------|----------|
| Minimal | 3-5 specs | Basic product info |
| Standard | 6-10 specs | Most common setup |
| Comprehensive | 11-15 specs | Detailed technical product |

## Component Props Interface

```typescript
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export type ProductTechSpecsFields = {
  productTechnicalSpecs?: Field<string>;
};

export type ProductTechSpecsProps = ComponentProps & {
  fields: ProductTechSpecsFields;
};
```

## Example Content Entry

### Page-Level Content (Product Page)

```json
{
  "fields": {
    "productTechnicalSpecs": {
      "value": "Capacity=10000 gallons/day&Flow Rate=7 GPM&Power Requirements=220V/60Hz&Operating Temperature=32-120°F&Weight=500 lbs&Dimensions=48\" x 36\" x 72\"&Noise Level=<65 dB&Filtration Stages=5&Membrane Type=Reverse Osmosis&Warranty=5 Years"
    }
  }
}
```

### Rendered Table Output

| Parameter | Value |
|-----------|-------|
| Capacity | 10000 gallons/day |
| Flow Rate | 7 GPM |
| Power Requirements | 220V/60Hz |
| Operating Temperature | 32-120°F |
| Weight | 500 lbs |
| Dimensions | 48" x 36" x 72" |
| Noise Level | <65 dB |
| Filtration Stages | 5 |
| Membrane Type | Reverse Osmosis |
| Warranty | 5 Years |

## Sitecore XM Cloud Specifics

### Content Editor Path

- Product pages: `/sitecore/content/[Site]/Home/Products/[Product Name]`
- Field is edited directly on the product page item

### Experience Editor Behavior

- **Field editing:** Use Forms panel to edit productTechnicalSpecs
- **Text field:** Standard single-line or multi-line text editor
- **Mobile accordion:** In Experience Editor, accordion is always expanded

### Section Heading

The section heading is localized via translation system:
- "Technical Specs"

### Table Column Headers

Column headers are localized:
- "Parameter"
- "Value"

### Accordion State Persistence

The accordion state is persisted in localStorage via `useProductAccordion` hook:
- Key: `product-accordion-techspecs`
- Persists open/closed state across page navigations

## Common Mistakes to Avoid

1. **Empty field:** If productTechnicalSpecs is empty, the component won't render. Always provide at least one key-value pair.

2. **Missing equals sign:** Each parameter must have an equals sign: `Parameter=Value`, not just `Parameter Value`.

3. **Missing ampersand separator:** Multiple specs must be separated by `&`: `A=1&B=2`, not `A=1 B=2`.

4. **Unencoded special characters:** Characters like `<`, `>`, `"`, `&` in values must be URL-encoded.

5. **Empty values:** Entries with empty values (e.g., `Parameter=`) are skipped and won't display.

6. **Inconsistent parameter naming:** Use consistent naming conventions across products (e.g., always "Weight" not sometimes "Weight" and sometimes "Product Weight").

## URL Encoding Reference

| Character | Encoded |
|-----------|---------|
| Space | `%20` or `+` |
| `"` | `%22` |
| `&` (in value) | `%26` |
| `<` | `%3C` |
| `>` | `%3E` |
| `°` | `%C2%B0` |
| `%` | `%25` |
| `/` | `%2F` |

## Related Components

- `ProductHeader` - Product name, image, and CTA section
- `ProductOverview` - Key benefits, features, and applications
- `ProductResources` - Related resources and documents
- `AccordionMotion` - Child component for mobile accordion animation

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ProductTechSpecs component using the Marketer MCP tools.

### Important: Route-Context Component

The ProductTechSpecs component reads all fields from the **page route context**, not from a component datasource. This means:

1. All fields are authored on the **Product Page** itself
2. Adding the ProductTechSpecs component does not create a separate datasource
3. Content updates go to the page item, not a component datasource

### Step 1: Find the Product Page

```javascript
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "X500 Water System"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add ProductTechSpecs Component to Page

```javascript
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "product-tech-specs-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ProductTechSpecs_Main",
  language: "en",
  fields: {}  // No component-level fields
});
```

### Step 3: Update Page-Level Field

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,  // The page ID, not a datasource
  language: "en",
  fields: {
    "productTechnicalSpecs": "Capacity=10000 gallons/day&Flow Rate=7 GPM&Power Requirements=220V/60Hz&Weight=500 lbs&Warranty=5 Years"
  }
});
```

### Building the Tech Specs String

To programmatically build the tech specs string:

```javascript
const specs = {
  "Capacity": "10000 gallons/day",
  "Flow Rate": "7 GPM",
  "Power Requirements": "220V/60Hz",
  "Operating Temperature": "32-120°F",
  "Weight": "500 lbs",
  "Dimensions": "48\" x 36\" x 72\"",
  "Filtration Stages": "5",
  "Warranty": "5 Years"
};

// Build URL-encoded string
const techSpecsString = Object.entries(specs)
  .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  .join('&');

// Result: Capacity=10000%20gallons%2Fday&Flow%20Rate=7%20GPM&...
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find the product page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "X500 Water Purification"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add ProductTechSpecs component
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "product-tech-specs-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ProductTechSpecs_Main",
  language: "en",
  fields: {}
});

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update technical specs field
// ═══════════════════════════════════════════════════════════════
// Build specs object
const specs = {
  "Capacity": "10000 gallons/day",
  "Flow Rate": "7 GPM",
  "Power Requirements": "220V/60Hz",
  "Operating Temperature": "32-120°F",
  "Weight": "500 lbs",
  "Dimensions": "48\" x 36\" x 72\"",
  "Noise Level": "<65 dB",
  "Filtration Stages": "5",
  "Membrane Type": "Reverse Osmosis",
  "Warranty": "5 Years"
};

// Convert to URL-encoded string
const techSpecsString = Object.entries(specs)
  .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  .join('&');

await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "productTechnicalSpecs": techSpecsString
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: ProductTechSpecs displays specs table
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| productTechnicalSpecs | Single-Line Text | Page item | `"Key1=Value1&Key2=Value2"` |

### Common Specification Parameters

Standard parameter names to use consistently:

| Category | Parameters |
|----------|------------|
| Physical | Weight, Dimensions, Material, Color |
| Electrical | Power Requirements, Voltage, Amperage, Frequency |
| Performance | Capacity, Flow Rate, Speed, Efficiency |
| Environmental | Operating Temperature, Humidity Range, IP Rating |
| Compliance | Certifications, Standards, Warranty |

### MCP Authoring Checklist

Before authoring ProductTechSpecs via MCP, verify:

- [ ] Have Product Page ID (from `mcp__marketer__search_site`)
- [ ] Have ProductTechSpecs rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] productTechnicalSpecs field has valid key=value&key=value format
- [ ] Special characters are URL-encoded
- [ ] No empty values (entries with empty values are skipped)

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ProductTechSpecs_2` |
| Component not visible | productTechnicalSpecs field empty | Add at least one key=value pair |
| Table shows wrong data | Parsing error | Check format: `key=value&key=value` |
| Special chars display wrong | Not URL-encoded | Encode special characters |
| Rows missing | Empty values | Ensure all values are non-empty |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |

### Encoding Helper

For MCP authoring, here's how to encode values:

```javascript
// JavaScript encoding helper
function encodeSpecValue(value) {
  return encodeURIComponent(value);
}

// Examples:
encodeSpecValue("32-120°F")        // "32-120%C2%B0F"
encodeSpecValue("48\" x 36\"")     // "48%22%20x%2036%22"
encodeSpecValue("<65 dB")          // "%3C65%20dB"
```

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
