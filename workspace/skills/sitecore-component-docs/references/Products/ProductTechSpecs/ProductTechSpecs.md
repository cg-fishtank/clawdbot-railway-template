# ProductTechSpecs Component

## Purpose
ProductTechSpecs displays a two-column table of technical specification parameters and their values for a product. It reads the `productTechnicalSpecs` single-line text field from the route (page item) context, which stores specifications in a URL-encoded `key=value&key=value` format. The component parses this string, URL-decodes each value, and renders a row per pair — skipping any row where the value is empty. It renders nothing if the field is absent or produces no valid rows. The component uses an accordion layout on mobile/tablet and an expanded table on desktop.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `2811b4c4-d991-453c-a045-78a8187a2e06` |
| **Component Name** | `ProductTechSpecs` |
| **Category** | `Products` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `productTechnicalSpecs` | Single-Line Text (`Field<string>`) | No | URL-encoded technical specifications in `key=value&key=value` format; each `&`-separated pair becomes a table row | Values must be URL-encoded (e.g. spaces as `%20`); rows with an empty value after decoding are skipped; component renders nothing if the parsed array is empty |

**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `productTechnicalSpecs` | None (value accessed via `.value` property and parsed manually) | `@sitecore-content-sdk/nextjs` (`useSitecore`) |

> Note: The field value is read as a raw string and parsed with `split('&')` and `split('=')` — no JSS `Text` or `RichText` rendering components are used in the output table. Each pair is decoded with `decodeURIComponent`.

## Component Variants
| Variant | Export Name | Use Case |
|---------|-----------|----------|
| Default | `Default` | Standard two-column technical specs table with accordion on mobile and expanded view on desktop |

## Props Interface
```typescript
// From lib/types/components/Products/product-tech-specs

type ProductTechSpecsFields = {
  productTechnicalSpecs?: Field<string>;
};

type ProductTechSpecsProps = {
  params: Record<string, string>;
  rendering: ComponentRendering & { componentName?: string };
  fields: ProductTechSpecsFields;
};

// Parsed internal representation (not a Sitecore type):
type TechSpecRow = {
  parameter: string;
  value: string;
};
```

## Example Content Entry
### Minimum Viable Content
- **productTechnicalSpecs**: `Operating%20Voltage=12-24V%20DC`
  - Produces one row: Parameter = "Operating Voltage", Value = "12-24V DC"

### Full Content Example
- **productTechnicalSpecs**:
  ```
  Operating%20Voltage=12-24V%20DC&Supply%20Current=50mA%20max&Output%20Type=4-20mA%20%2F%200-10V&Accuracy=%C2%B10.1%25%20FS&Response%20Time=%3C1ms&IP%20Rating=IP67&Operating%20Temperature=-40%C2%B0C%20to%20%2B85%C2%B0C&Housing%20Material=316L%20Stainless%20Steel
  ```
  Produces rows:
  | Parameter | Value |
  |-----------|-------|
  | Operating Voltage | 12-24V DC |
  | Supply Current | 50mA max |
  | Output Type | 4-20mA / 0-10V |
  | Accuracy | ±0.1% FS |
  | Response Time | <1ms |
  | IP Rating | IP67 |
  | Operating Temperature | -40°C to +85°C |
  | Housing Material | 316L Stainless Steel |

## MCP Authoring Instructions
### Step 1: Add to Page
1. Open the Product Page item in Sitecore Content Editor or Experience Editor.
2. In the Presentation Details, add the `ProductTechSpecs` rendering (ID: `2811b4c4-d991-453c-a045-78a8187a2e06`) to the appropriate placeholder on the Product Page layout.
3. No datasource is required — the component reads from the route (page item) fields.

### Step 2: Configure Fields
1. On the Product Page item, locate the **productTechnicalSpecs** single-line text field.
2. Author the value in the following URL-encoded `key=value` format, with `&` as the pair separator:
   - Each **key** is the parameter name (use `%20` for spaces, or use plain text if the parameter name has no special characters).
   - Each **value** must be URL-encoded using standard percent-encoding (e.g. `±` → `%C2%B1`, `°C` → `%C2%B0C`, `/` → `%2F`).
   - Example: `Voltage=12-24V%20DC&Accuracy=%C2%B10.1%25`
3. Rows with an empty decoded value are automatically skipped.
4. The component renders nothing if the field is absent or no rows have values.
5. Save and publish the Product Page item.

### Field Type Quick Reference
| Field | Type | Notes |
|-------|------|-------|
| `productTechnicalSpecs` | Single-Line Text | URL-encoded `param=value&param=value` string; parsed at render time |

### URL Encoding Reference
| Character | Encoded |
|-----------|---------|
| Space | `%20` |
| `±` | `%C2%B1` |
| `°` | `%C2%B0` |
| `%` | `%25` |
| `/` | `%2F` |
| `<` | `%3C` |
| `>` | `%3E` |
| `+` | `%2B` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
