# ProductHeader Component

## Purpose

The ProductHeader component displays the header section of product detail pages, featuring the product name, description, SKU, tags/badges, hero image, and CTA buttons. It includes a two-column layout with content on the left and a product image on the right. The component also outputs structured Product metadata for SEO via the ProductMetaData child component.

## Sitecore Template Requirements

### Data Source

**Important:** This component reads all fields from the **page/route context**, not from a component-level datasource. The Product Page Template must contain all product header fields.

### Template Path

- **Page Template:** `/sitecore/templates/Project/[Site]/Products/Product Page`
- **No separate datasource template** - uses page-level fields

### Fields (Route/Page Level)

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| productName | Single-Line Text | Yes | Product name/title displayed prominently | Recommended max 80 characters |
| productDescription | Rich Text | No | Product summary/description | Supports basic formatting |
| productSubheading | Single-Line Text | No | Secondary tagline or subtitle | Recommended max 120 characters |
| productSku | Single-Line Text | No | Product SKU identifier | Alphanumeric format |
| image | Image | Yes | Main product image | Recommended square 1:1, min 500x500px |
| link | General Link | No | Primary CTA button | Internal or external link |
| link2 | General Link | No | Secondary CTA button (outline style) | Internal or external link |
| SxaTags | Multilist/Treelist | No | Product tags/categories | Links to SxaTags taxonomy |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| productName | `<Text className="lg:heading-4xl heading-3xl" field={fields?.productName} tag="p" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| productDescription | `<RichText className="copy-lg" field={fields?.productDescription} />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| productSku | `<Text className="copy-base" field={fields?.productSku} tag="span" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| image | `<NextImage field={fields?.image} width={500} height={500} />` | `import { NextImage } from '@sitecore-jss/sitecore-jss-nextjs'` |
| link | Via `Button` component | `import { Button } from 'component-children/Shared/Button/Button'` |
| link2 | Via `Button` component (outline variant) | `import { Button } from 'component-children/Shared/Button/Button'` |
| SxaTags | Via `Tag` component | `import Tag from 'component-children/Shared/Tag/Tag'` |

## Component Variants

The ProductHeader exports a single default variant:

| Variant | Export Name | Description | Use Case |
|---------|-------------|-------------|----------|
| Default | `Default` | Standard product header layout | Product detail pages |

### Theme Support

The component supports theme customization via rendering parameters:

| Theme | Background | Text | Tag Style |
|-------|------------|------|-----------|
| primary | Surface color | Content color | Dark background |
| secondary | Surface color | Content color | Tertiary background |
| tertiary | Surface color | Content color | Dark background |

## Content Authoring Instructions

### Field-by-Field Guidance

#### productName

- **What to enter:** The official product name
- **Tone/Style:** Clear, branded, professional
- **Character limit:** 80 characters recommended
- **Example:** "Industrial Water Purification System X500"

#### productDescription

- **What to enter:** Product overview and key value proposition
- **Tone/Style:** Benefits-focused, engaging
- **Formatting:** Basic rich text - paragraphs, bold, links
- **Example:** "Experience industry-leading water purification with our advanced X500 system. Designed for commercial applications, it delivers up to 10,000 gallons of purified water daily."

#### productSubheading

- **What to enter:** Secondary tagline or brief descriptor
- **Tone/Style:** Concise, complementary to name
- **Character limit:** 120 characters recommended
- **Example:** "Professional-Grade Filtration for Industrial Applications"

#### productSku

- **What to enter:** Product SKU or model number
- **Format:** Alphanumeric (your product catalog format)
- **Display:** Shown prefixed with "SKU:"
- **Example:** "WPS-X500-PRO"

#### image

- **Recommended dimensions:** 500x500px minimum (1:1 aspect ratio)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Product name + brief description
- **Media Library path:** `/sitecore/media library/Project/[Site]/Products/`
- **Tips:** Use high-quality product photography on transparent or neutral background

#### link (Primary CTA)

- **What to enter:** Main action link (e.g., "Buy Now", "Request Quote")
- **Link Types:** Internal, External
- **Display:** Solid button style
- **Example text:** "Request a Quote", "Buy Now", "Learn More"

#### link2 (Secondary CTA)

- **What to enter:** Secondary action link (e.g., "Download Specs")
- **Link Types:** Internal, External
- **Display:** Outline button style
- **Example text:** "Download Brochure", "View Demo", "Compare Models"

#### SxaTags

- **What to select:** Relevant product category/feature tags
- **Selection path:** `/sitecore/content/[Site]/Data/SxaTags/`
- **Display:** Appears as badges above the product name
- **Examples:** "New", "Best Seller", "Industrial", "Eco-Friendly"

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | productName, image | - | Basic product display |
| Standard | productName, productDescription, image, link | productSku, link2, SxaTags | Most common setup |
| Full | All fields | - | Premium product showcase |

## Component Props Interface

```typescript
import { Field, LinkField, RichTextField, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { TagType } from 'lib/types/page/metadata';

export type ProductHeaderFields = {
  productName: Field<string>;
  productDescription?: RichTextField;
  productSubheading?: Field<string>;
  productSku?: Field<string>;
  image?: ImageField;
  link?: LinkField;
  link2?: LinkField;
  SxaTags?: TagType[];
};

export type ProductHeaderProps = ComponentProps & {
  fields: ProductHeaderFields;
};
```

## Example Content Entry

### Page-Level Content (Product Page)

```json
{
  "fields": {
    "productName": { "value": "Industrial Water Purification System X500" },
    "productDescription": {
      "value": "<p>Experience industry-leading water purification with our advanced X500 system. Designed for commercial applications.</p>"
    },
    "productSubheading": { "value": "Professional-Grade Filtration" },
    "productSku": { "value": "WPS-X500-PRO" },
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Products/x500-system.jpg",
        "alt": "X500 Water Purification System",
        "width": "500",
        "height": "500"
      }
    },
    "link": {
      "value": {
        "href": "/contact/request-quote",
        "text": "Request a Quote",
        "target": ""
      }
    },
    "link2": {
      "value": {
        "href": "/-/media/brochures/x500-brochure.pdf",
        "text": "Download Brochure",
        "target": "_blank"
      }
    },
    "SxaTags": [
      {
        "id": "{TAG-GUID}",
        "displayName": "Industrial"
      },
      {
        "id": "{TAG-GUID-2}",
        "displayName": "Best Seller"
      }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Product pages: `/sitecore/content/[Site]/Home/Products/[Product Name]`
- SxaTags: `/sitecore/content/[Site]/Data/SxaTags/`
- All fields are edited directly on the product page item

### Experience Editor Behavior

- **Inline editable fields:** productName, productDescription, productSku
- **Forms panel required:** image, link, link2, SxaTags
- **Image selection:** Click image area to open media browser
- **Tags editing:** Use multilist picker for SxaTags

### SEO Metadata Output

The ProductMetaData child component outputs structured Product data:
- Product name and description
- SKU identifier
- Image reference
- Brand/organization info

## Common Mistakes to Avoid

1. **Missing productName:** The product name is essential for display and SEO. Never leave it empty.

2. **Wrong image aspect ratio:** Use square images (1:1) for best display. Non-square images may appear cropped or distorted.

3. **Missing alt text on image:** Always provide meaningful alt text for accessibility and SEO.

4. **Overly long descriptions:** Keep productDescription focused on key benefits. Detailed specs should go in ProductOverview or ProductTechSpecs.

5. **Missing primary CTA:** Without a link, visitors have no clear action to take.

6. **Duplicate link text:** Use distinct, action-oriented text for link and link2 (e.g., "Buy Now" vs "Compare").

## Related Components

- `ProductOverview` - Key benefits, features, and applications section
- `ProductResources` - Related resources and application notes
- `ProductTechSpecs` - Technical specifications table
- `ProductMetaData` - Child component for SEO structured data

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ProductHeader component using the Marketer MCP tools.

### Important: Route-Context Component

The ProductHeader component reads all fields from the **page route context**, not from a component datasource. This means:

1. All fields are authored on the **Product Page** itself
2. Adding the ProductHeader component does not create a separate datasource
3. Content updates go to the page item, not a component datasource

### Step 1: Find or Create Product Page

```javascript
// Search for existing product page
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "X500 System"
});
const pageId = pageSearch.results[0].itemId;

// Or create a new product page
const newPage = await mcp__marketer__create_page({
  siteName: "main",
  pageName: "Industrial Water Purification System X500",
  parentItemId: "{PRODUCTS-FOLDER-GUID}",
  pageTemplateId: "{PRODUCT-PAGE-TEMPLATE-GUID}",
  language: "en"
});
```

### Step 2: Add ProductHeader Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "product-header-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ProductHeader_Main",
  language: "en",
  fields: {}  // No component-level fields
});
```

### Step 3: Update Page-Level Fields

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,  // The page ID, not a datasource
  language: "en",
  fields: {
    "productName": "Industrial Water Purification System X500",
    "productDescription": "<p>Experience industry-leading water purification with our advanced X500 system.</p>",
    "productSubheading": "Professional-Grade Filtration",
    "productSku": "WPS-X500-PRO"
  }
});
```

### Step 4: Update Image Field

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "image": "<image mediaid='{PRODUCT-IMAGE-GUID}' />"
  }
});
```

### Step 5: Update Link Fields

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "link": "<link linktype=\"internal\" text=\"Request a Quote\" url=\"/contact/request-quote\" />",
    "link2": "<link linktype=\"media\" text=\"Download Brochure\" url=\"/-/media/brochures/x500.pdf\" target=\"_blank\" />"
  }
});
```

### Step 6: Set SxaTags (Optional)

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "SxaTags": "{INDUSTRIAL-TAG-GUID}|{BESTSELLER-TAG-GUID}"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find or create the product page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "X500 Water Purification"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add ProductHeader component
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "product-header-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ProductHeader_Main",
  language: "en",
  fields: {}
});

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update text fields on page
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "productName": "Industrial Water Purification System X500",
    "productDescription": "<p>Experience industry-leading water purification with our advanced X500 system.</p>",
    "productSubheading": "Professional-Grade Filtration for Industrial Applications",
    "productSku": "WPS-X500-PRO"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Update image
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "image": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 5: Update CTA links
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "link": "<link linktype=\"internal\" text=\"Request a Quote\" url=\"/contact/request-quote\" />",
    "link2": "<link linktype=\"media\" text=\"Download Brochure\" url=\"/-/media/brochures/x500.pdf\" target=\"_blank\" />"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 6: Set product tags
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "SxaTags": "{INDUSTRIAL-TAG-GUID}|{BESTSELLER-TAG-GUID}"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: ProductHeader displays page metadata
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| productName | Single-Line Text | Page item | `"Plain text value"` |
| productDescription | Rich Text | Page item | `"<p>HTML content</p>"` |
| productSubheading | Single-Line Text | Page item | `"Plain text value"` |
| productSku | Single-Line Text | Page item | `"SKU-123"` |
| image | Image | Page item | `<image mediaid='{GUID}' />` |
| link | General Link | Page item | `<link linktype="internal" text="..." url="..." />` |
| link2 | General Link | Page item | `<link linktype="internal" text="..." url="..." />` |
| SxaTags | Multilist | Page item | `"{GUID}"` or `"{GUID1}\|{GUID2}"` |

### MCP Authoring Checklist

Before authoring ProductHeader via MCP, verify:

- [ ] Have Product Page ID (from `mcp__marketer__search_site`)
- [ ] Have ProductHeader rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] productName field has content (required)
- [ ] Have media GUID for image field
- [ ] Image is square (1:1 aspect ratio recommended)
- [ ] Link XML uses correct format with single quotes

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ProductHeader_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| Image not showing | Wrong XML format | Verify: `<image mediaid='{GUID}' />` |
| Link not working | Wrong link format | Use correct XML with single quotes |
| Tags not showing | Invalid SxaTags GUIDs | Verify GUIDs from SxaTags folder |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-author-image` | Image field XML formatting details |
| `/sitecore-author-link` | Link field XML formatting details |
| `/sitecore-upload-media` | Upload images to Media Library first |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
