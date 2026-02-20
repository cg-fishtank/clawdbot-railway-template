# ProductDocuments Component

## Purpose
ProductDocuments displays downloadable product documentation files (PDFs and other file types) for a product page. It reads the `productDocumetation` multilist from the route context to filter which document folders are shown, then fetches the actual file data from a Sitecore content folder via GraphQL using `getComponentServerProps`. The component adapts its layout between an accordion on mobile/tablet and a card grid on desktop.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `a5785100-904a-4a4d-a4a9-384cbbfc4160` |
| **Component Name** | `ProductDocuments` |
| **Category** | `Products` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `productDocumetation` | Multilist | No | References document folder items in Sitecore; controls which document groups are displayed | Intentional typo in field name — must match exactly; items must exist under the configured folder path (`730C1699-87A4-4CA7-A9CE-294AD7151F13`) |

**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| N/A (data fetched via GraphQL, not JSS field components) | — | `@sitecore-content-sdk/nextjs` |

> Note: File data (url, extension, title, size) is fetched via `getComponentServerProps` using the `GetProductDocuments` GraphQL query. The `productDocumetation` route field is used only for name-based filtering of the fetched results — no JSS field rendering components are used in the output.

## Component Variants
| Variant | Export Name | Use Case |
|---------|-----------|----------|
| Default | `Default` | Standard product documents display with accordion on mobile and card grid on desktop |

## Props Interface
```typescript
// From lib/types/components/Products/product-documents

type PDFFileFields = {
  url: string;
  extension: string;
  title: string;
  size: string;
};

type PDFFileType = {
  name: string;
  fields?: PDFFileFields[];
};

type ProductDocumentsFields = {
  productDocumetation?: { name: string }[]; // route context field (note: intentional typo)
};

type ProductDocumentsProps = {
  params: Record<string, string>;
  rendering: ComponentRendering;
  fields?: {
    fields?: PDFFileType[]; // populated by getComponentServerProps
  };
};
```

## Example Content Entry
### Minimum Viable Content
- **productDocumetation**: Select at least one document folder item whose `name` matches a folder returned by the GraphQL query. If no items are selected or no matching documents are found, the component renders nothing.

### Full Content Example
- **productDocumetation**: Select multiple document folder items, e.g.:
  - "Product Datasheet Folder" (contains PDFs: title "XR-500 Datasheet", extension "pdf", size in bytes)
  - "Installation Guide Folder" (contains PDFs and Word docs)
- The component fetches all folders under the configured path, then filters to only those whose `name` matches a selected item's `name`.

## MCP Authoring Instructions
### Step 1: Add to Page
1. Open the Product Page item in Sitecore Content Editor or Experience Editor.
2. In the Presentation Details, add the `ProductDocuments` rendering (ID: `a5785100-904a-4a4d-a4a9-384cbbfc4160`) to the appropriate placeholder on the Product Page layout.
3. No datasource is required — the component reads from the route (page item) fields.

### Step 2: Configure Fields
1. On the Product Page item, locate the **productDocumetation** field (note the typo — one `n` in "Documentation").
2. Use the Multilist field to select one or more document folder items from the Sitecore media/content tree. The selected items must have `name` values that correspond to folder names returned by the document GraphQL query (folder path GUID: `730C1699-87A4-4CA7-A9CE-294AD7151F13`).
3. Save and publish the Product Page item.

### Field Type Quick Reference
| Field | Type | Notes |
|-------|------|-------|
| `productDocumetation` | Multilist | Intentional typo; selects document folder items; filters displayed files |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
