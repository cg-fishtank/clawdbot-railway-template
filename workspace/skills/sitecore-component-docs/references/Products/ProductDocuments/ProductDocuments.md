# ProductDocuments Component

## Purpose

The ProductDocuments component displays downloadable PDF documents associated with a product. It fetches document data from Sitecore's Media Library via GraphQL at the server side, then filters results against the product page's `productDocumetation` multilist field to display only relevant documents. On mobile/tablet it renders as an accordion, and on desktop as an expanded list. Each document shows its title, file size, extension icon, and a download button.

## Sitecore Template Requirements

### Data Source

**Important:** This component reads fields from two sources:
1. **Route context** (`productDocumetation` field) - a multilist reference selecting which document folders to display
2. **Server-side GraphQL** - fetches the actual PDF file metadata from a configured Media Library folder

### Template Path

- **Page Template:** `/sitecore/templates/Project/[Site]/Products/Product Page`
- **No separate datasource template** - uses page-level fields + server-side data fetching

### Fields (Route/Page Level)

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| productDocumetation | Multilist | No | References to document folder items to display | Links to document category folders in Media Library |

### Server-Side Data (GraphQL)

The component fetches document metadata via the `GetProductDocuments` GraphQL query:

| Data Field | Source | Description |
|------------|--------|-------------|
| name | Folder item | Document category/folder name |
| url | File child item | Download URL for the file |
| extension | File child item field | File extension (e.g., "pdf") |
| title | File child item field | Display title of the document |
| size | File child item field | File size string |

### Rendering Parameters (Styles)

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| theme | Droplist | primary, secondary, tertiary | primary | Color theme |

## JSS Field Component Mapping

This component does not use JSS field components directly. It uses:

| Data | Rendering Approach | Notes |
|------|-------------------|-------|
| productDocumetation | Route context via `useSitecore()` | Multilist reference for filtering |
| Document metadata | Server-side props via GraphQL | Fetched and mapped in `getComponentServerProps` |
| Document title | Plain text rendering | From `PDFFileFields.title` |
| Document size | Plain text rendering | From `PDFFileFields.size` |
| Download URL | Anchor link | From `PDFFileFields.url` |

## Component Variants

| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard product documents list |

### Server-Side Data Fetching

This component exports `getComponentServerProps` for server-side data fetching:

```typescript
export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  // Fetches documents via GetProductDocuments GraphQL query
  // Returns filtered PDF data based on productDocumetation field
};
```

## Content Authoring Instructions

### Field-by-Field Guidance

#### productDocumetation (Multilist)

- **What to select:** Document category folders that contain PDF files for this product
- **Selection path:** Configured Media Library folder (hardcoded location folder path in component)
- **Display:** Selected folders' documents appear as downloadable items
- **Important:** The field name has a known typo (`productDocumetation` not `productDocumentation`)

### Document Folder Structure

Documents must be organized in Sitecore Media Library as:
```
/sitecore/media library/[configured path]/
  ├── Category Folder 1/
  │   ├── Document1.pdf (with title, size fields)
  │   └── Document2.pdf
  └── Category Folder 2/
      └── Document3.pdf
```

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | productDocumetation (1 folder) | - | Single document category |
| Standard | productDocumetation (2-3 folders) | - | Multiple document categories |
| Full | productDocumetation (all folders) | - | Complete product documentation |

## Component Props Interface

```typescript
import { ComponentProps } from 'lib/component-props';

export type PDFFileFields = {
  url?: string;
  extension?: string;
  title?: string;
  size?: string;
};

export type PDFFileType = {
  name?: string;
  fields?: PDFFileFields[];
};

export type ProductDocumentsFields = {
  productDocumetation?: { name: string }[];
  fields?: PDFFileType[];
};

export type ProductDocumentsProps = ComponentProps & {
  fields?: ProductDocumentsFields;
  buttonVariant?: string;
};
```

## GraphQL Query

```graphql
query GetProductDocuments($locationFolderPath: String!, $language: String!) {
  item(path: $locationFolderPath, language: $language) {
    folder_documents: children {
      results {
        name
        file_fields: children {
          results {
            url {
              url
            }
            fields {
              value
            }
          }
        }
      }
    }
  }
}
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "productDocumetation": [
      { "name": "Technical Specifications" }
    ]
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "productDocumetation": [
      { "name": "Technical Specifications" },
      { "name": "Installation Guides" },
      { "name": "Safety Data Sheets" }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Product pages: `/sitecore/content/[Site]/Home/Products/[Product Name]`
- Document folders: Configured in Media Library (location folder path hardcoded in component)
- The `productDocumetation` field is edited directly on the product page item

### Experience Editor Behavior

- **Inline editable fields:** None (data is fetched server-side and rendered programmatically)
- **Forms panel required:** productDocumetation (multilist picker)
- **Responsive behavior:** Accordion on mobile/tablet, expanded list on desktop

## Common Mistakes to Avoid

1. **Misspelling the field name:** The field is `productDocumetation` (with typo), not `productDocumentation`. Use the exact field name.

2. **Missing document files:** Ensure PDF files are uploaded to the correct Media Library folder structure before referencing them.

3. **Empty folder references:** If a selected folder has no files, no documents will display for that category.

4. **Wrong folder structure:** Documents must be organized as folder > file children with proper metadata fields (title, size, extension).

5. **Missing server-side config:** The GraphQL endpoint and location folder path must be properly configured for documents to load.

## Related Components

- `ProductHeader` - Product name, description, and hero image
- `ProductOverview` - Product features and applications
- `ProductResources` - Related resources and application notes
- `ProductTechSpecs` - Technical specifications table
- `ProductOrderingInfo` - Ordering information and part numbers

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ProductDocuments component using the Marketer MCP tools.

### Important: Route-Context + Server-Side Component

The ProductDocuments component uses:
1. **Route context** for the `productDocumetation` multilist field (page-level)
2. **Server-side GraphQL** for fetching actual document metadata

This means document content must exist in the Media Library before the component can display it.

### Step 1: Find or Create Product Page

```javascript
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Product Name"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add ProductDocuments Component to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "product-documents-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ProductDocuments_1",
  language: "en",
  fields: {}  // No component-level fields
});
```

### Step 3: Update productDocumetation Field on Page

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "productDocumetation": "{FOLDER-GUID-1}|{FOLDER-GUID-2}"
  }
});
```

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| productDocumetation | Multilist | Page item | `"{GUID1}\|{GUID2}"` |

### MCP Authoring Checklist

- [ ] Have Product Page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have ProductDocuments rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Document folders exist in Media Library with PDF files
- [ ] Have GUIDs for document folder items to reference in `productDocumetation`
- [ ] Field name uses exact spelling: `productDocumetation` (with typo)

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ProductDocuments_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| No documents showing | Missing Media Library content | Upload PDFs to configured folder first |
| No documents showing | Wrong folder GUIDs | Verify folder GUIDs in `productDocumetation` |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |
| "Cannot find field" | Wrong field name | Use exact name: `productDocumetation` |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-upload-media` | Upload PDF documents to Media Library first |
| `/sitecore-author` | Full orchestration workflow |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-18 | Initial documentation | Claude Code |
