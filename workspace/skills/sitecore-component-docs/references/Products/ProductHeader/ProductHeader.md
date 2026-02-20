# ProductHeader Component

## Purpose
ProductHeader renders the primary hero section for a product page, displaying the product name, description, SKU, optional tags, CTA buttons, and a product image. It reads all fields directly from the route (page item) context rather than a datasource and also injects structured `<meta>` tags for product name, subheading, and SKU via a companion `ProductMetaData` child component. The component does not render if route fields are absent.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `f2b2608c-1e3b-4073-a5c8-911bf5605eb8` |
| **Component Name** | `ProductHeader` |
| **Category** | `Products` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `productName` | Single-Line Text (`Field<string>`) | Yes | Primary product heading rendered as `<p>` with heading classes; also used as `aria-label` for the section and injected as `product:name` meta tag | Must not be empty |
| `productDescription` | Rich Text (`RichTextField`) | No | Product description rendered below the name | Supports inline HTML formatting |
| `productSubheading` | Single-Line Text (`Field<string>`) | No | Injected as `product:subheading` meta tag only; not rendered visually in the component | Used for SEO/meta purposes |
| `productSku` | Single-Line Text (`Field<string>`) | No | Displayed inline with a "SKU:" label prefix; also injected as `product:sku` meta tag | Only rendered when value is non-empty |
| `image` | Image (`ImageField`) | Yes | Product image displayed at 500x500, full-cover; occupies half the layout on desktop | Rendered with `NextImage`; layout collapses to 4/5 width if image is absent |
| `link` | General Link (`LinkField`) | No | Primary CTA button (solid variant) | Optional |
| `link2` | General Link (`LinkField`) | No | Secondary CTA button (outline/primary variant) | Optional |
| `SxaTags` | Multilist | No | SXA taxonomy tags displayed as styled tag chips above the product name | Only the `displayName` property is used from each tag item |

**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `productName` | `Text` | `@sitecore-content-sdk/nextjs` |
| `productDescription` | `RichText` | `@sitecore-content-sdk/nextjs` |
| `productSku` | `Text` | `@sitecore-content-sdk/nextjs` |
| `image` | `NextImage` | `@sitecore-content-sdk/nextjs` |
| `link` | `Button` (custom) | `component-children/Shared/Button/Button` |
| `link2` | `Button` (custom, outline) | `component-children/Shared/Button/Button` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-----------|----------|
| Default | `Default` | Standard product header with image, text content, and CTA buttons |

## Props Interface
```typescript
// From lib/types/components/Products/product-header

type ProductHeaderFields = {
  productName?: Field<string>;
  productDescription?: RichTextField;
  productSubheading?: Field<string>;
  productSku?: Field<string>;
  image?: ImageField;
  link?: LinkField;
  link2?: LinkField;
  SxaTags?: TagType[]; // TagType: { id: string; displayName: string }
};

type ProductHeaderProps = {
  params: Record<string, string>;
  rendering: ComponentRendering & { componentName?: string };
  fields?: ProductHeaderFields; // passed from route context
};
```

## Example Content Entry
### Minimum Viable Content
- **productName**: `XR-500 Industrial Sensor`
- **image**: Upload or select a product image (500x500 recommended)

### Full Content Example
- **productName**: `XR-500 Industrial Sensor`
- **productDescription**: `<p>The XR-500 is a high-precision industrial sensor designed for demanding environments. It delivers real-time monitoring with sub-millisecond response times.</p>`
- **productSubheading**: `High-Precision Series`
- **productSku**: `XR500-001-US`
- **image**: Product photo at 500x500px
- **link**: `{ href: "/contact", text: "Request a Quote" }`
- **link2**: `{ href: "/downloads/xr500-datasheet.pdf", text: "Download Datasheet" }`
- **SxaTags**: Select relevant taxonomy tags, e.g. "Industrial", "Sensors"

## MCP Authoring Instructions
### Step 1: Add to Page
1. Open the Product Page item in Sitecore Content Editor or Experience Editor.
2. In the Presentation Details, add the `ProductHeader` rendering (ID: `f2b2608c-1e3b-4073-a5c8-911bf5605eb8`) to the appropriate placeholder on the Product Page layout.
3. No datasource is required — the component reads from the route (page item) fields.

### Step 2: Configure Fields
1. **productName** (required): Enter the product's display name.
2. **image** (required): Select or upload the main product image.
3. **productDescription** (optional): Use the Rich Text editor to author the product description.
4. **productSubheading** (optional): Enter a short subheading string (used for meta tags only, not rendered visually).
5. **productSku** (optional): Enter the SKU string; it will appear prefixed with "SKU:" on the page.
6. **link** / **link2** (optional): Configure general link fields for CTA buttons. `link` renders solid; `link2` renders outline.
7. **SxaTags** (optional): Select SXA taxonomy tag items to display as chips above the product name.
8. Save and publish the Product Page item.

### Field Type Quick Reference
| Field | Type | Notes |
|-------|------|-------|
| `productName` | Single-Line Text | Required; drives aria-label and meta tag |
| `productDescription` | Rich Text | Optional; supports HTML |
| `productSubheading` | Single-Line Text | Optional; meta tag only |
| `productSku` | Single-Line Text | Optional; displayed with "SKU:" prefix |
| `image` | Image | Required for full layout; component still renders without it |
| `link` | General Link | Optional; primary CTA |
| `link2` | General Link | Optional; secondary CTA |
| `SxaTags` | Multilist | Optional; SXA taxonomy tags |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
