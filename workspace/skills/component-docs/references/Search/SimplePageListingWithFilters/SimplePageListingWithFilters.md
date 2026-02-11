# SimplePageListingWithFilters Component

## Purpose

The SimplePageListingWithFilters component displays a searchable, filterable listing of generic page content using Sitecore Search (RFK). It provides faceted filtering, keyword search, and pagination for any page type that doesn't fit into specialized categories like articles, events, or news. This component is typically used for product listings, resource libraries, or general page collections.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Search/Simple Page Listing With Filters`
- **Template Name:** `Simple Page Listing With Filters`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | No | Main heading displayed above the listing | Recommended max 80 characters |
| tagsHeading | Single-Line Text | No | Label for the tags/filter section | e.g., "Filter by category" |
| noResultsText | Single-Line Text | No | Message shown when no results match filters | e.g., "No pages found" |
| widgetId | Single-Line Text | Yes | Sitecore Search widget ID (RFK ID) | Must match configured Search widget |
| PageSizeCount | Number | No | Number of results per page | Default varies by widget config |
| filterByKeyword | Treelist | No | Pre-configured keyword filters | Links to tag items |
| tags | Treelist | No | Category/tag filter options | Links to tag or category items |

### Rendering Parameters (Styles)

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| theme | Droplist | primary, secondary, tertiary | primary | Color theme for the component |
| padding (top) | Droplist | top-none, top-xs, top-sm, top-md, top-lg, top-xl | none | Top padding |
| padding (bottom) | Droplist | bottom-none, bottom-xs, bottom-sm, bottom-md, bottom-lg, bottom-xl | none | Bottom padding |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text field={fields?.heading} tag="h2" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| tagsHeading | `<Text field={fields?.tagsHeading} />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| noResultsText | `<Text field={fields?.noResultsText} />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Props Interface

```typescript
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { CategoryType } from 'lib/helpers/page-category';
import { TagType } from 'lib/types';

export type SearchListingWithFiltersFields = {
  heading?: Field<string>;
  tagsHeading?: Field<string>;
  noResultsText?: Field<string>;
  widgetId?: Field<string>;
  PageSizeCount?: Field<number>;
  filterByKeyword?: TagType[];
  tags?: (TagType | CategoryType)[];
};

export type SearchListingWithFiltersProps = ComponentProps & {
  fields: SearchListingWithFiltersFields;
};
```

## Differences from Article Listing Components

Unlike `ArticleListingWithFilters`, `InsightsListingWithFilters`, and `NewsListingWithFilters`:

- **No template ID filtering:** Does not filter by a specific content type template
- **Generic card display:** Uses a simpler card layout without article-specific styling
- **Flexible content:** Can display any page type indexed in Sitecore Search

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The main title for the page listing section
- **Tone/Style:** Clear, descriptive
- **Character limit:** 80 characters recommended
- **Example:** "Browse Resources" or "All Products"

#### tagsHeading

- **What to enter:** Label text for the filter/tags section
- **Tone/Style:** Instructional, concise
- **Example:** "Filter by category" or "Browse by type"

#### noResultsText

- **What to enter:** Message displayed when no pages match the current filters
- **Tone/Style:** Helpful, encouraging
- **Example:** "No pages found. Try adjusting your filters." or "No results match your criteria."

#### widgetId (Required)

- **What to enter:** The Sitecore Search (Discover) widget ID
- **How to obtain:** Get from Sitecore Search portal under Widgets configuration
- **Format:** Alphanumeric string (e.g., "rfkid_pages")
- **Important:** This field MUST be configured for the component to function

#### PageSizeCount

- **What to enter:** Number of pages to display per page
- **Recommended values:** 9, 12, or 15 (multiples of 3 for grid layout)
- **Example:** `12`

#### filterByKeyword

- **What to select:** Keyword items that enable pre-filtering
- **Selection path:** `/sitecore/content/[Site]/Data/Keywords/`

#### tags

- **What to select:** Category or tag items for filter facets
- **Selection path:** `/sitecore/content/[Site]/Data/Page Categories/` or `/sitecore/content/[Site]/Data/Tags/`

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | widgetId | - | Basic page listing |
| Standard | widgetId, heading | tagsHeading, noResultsText | Typical resource page |
| Full | widgetId, heading, tagsHeading | noResultsText, tags, filterByKeyword, PageSizeCount | Complete filterable library |

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "widgetId": { "value": "rfkid_pages" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Browse Resources" },
    "tagsHeading": { "value": "Filter by category" },
    "noResultsText": { "value": "No resources found. Try adjusting your filters." },
    "widgetId": { "value": "rfkid_pages" },
    "PageSizeCount": { "value": 12 },
    "tags": [
      {
        "displayName": "Guides",
        "fields": { "pageCategory": { "value": "Guides" } }
      },
      {
        "displayName": "Tools",
        "fields": { "pageCategory": { "value": "Tools" } }
      },
      {
        "displayName": "Templates",
        "fields": { "pageCategory": { "value": "Templates" } }
      }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Page Listings/`

### Experience Editor Behavior

- **Inline editable fields:** heading, tagsHeading, noResultsText
- **Forms panel required:** widgetId, PageSizeCount, tags, filterByKeyword
- **Search widget:** Requires Sitecore Search configuration to be active

### Sitecore Search Integration

This component integrates with Sitecore Search (formerly Discover/RFK). Prerequisites:

1. Sitecore Search account configured
2. Search widget created in Sitecore Search portal
3. API keys configured in environment variables (SEARCH_CONFIG)
4. Page content indexed in Sitecore Search

## Use Cases

- **Resource Library:** List downloadable resources, guides, templates
- **Product Catalog:** Display product pages (non-commerce)
- **Service Listings:** Browse available services
- **Documentation Index:** List technical documentation pages
- **General Page Collection:** Any collection of pages needing search/filter

## Common Mistakes to Avoid

1. **Missing widgetId:** The component will show an error message in editing mode if widgetId is not configured.

2. **Wrong widget for content:** Ensure the widget ID points to a widget that indexes the correct page types.

3. **Using for articles:** For article-specific content, use ArticleListingWithFilters, InsightsListingWithFilters, or NewsListingWithFilters instead.

4. **Forgetting Search configuration:** The SEARCH_CONFIG environment variables must be set with valid API keys.

## Related Components

- `ArticleListingWithFilters` - Listing for article content with styling
- `SearchResults` - Global search results page
- `KnowledgeCenterSearch` - Specialized for help content

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "No widget id configured" error | widgetId field is empty | Add valid Sitecore Search widget ID |
| No results displayed | Search not configured or content not indexed | Verify SEARCH_CONFIG and index status |
| Wrong content appearing | Widget indexing wrong content types | Verify widget configuration |
| Missing filtering options | tags/filterByKeyword empty | Add filter items |

---

## MCP Authoring Instructions

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the SimplePageListingWithFilters rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"`)
4. Have a valid Sitecore Search widget ID

### Step 1: Add Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "simple-page-listing-with-filters-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "SimplePageListingWithFilters_1",
  language: "en",
  fields: {
    "heading": "Browse Resources",
    "tagsHeading": "Filter by category",
    "noResultsText": "No resources found.",
    "widgetId": "rfkid_pages"
  }
});
```

### Step 2: Update Configuration (Optional)

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "PageSizeCount": "12"
  }
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| tagsHeading | Single-Line Text | `"Plain text value"` |
| noResultsText | Single-Line Text | `"Plain text value"` |
| widgetId | Single-Line Text | `"rfkid_pages"` |
| PageSizeCount | Number | `"12"` |
| tags | Treelist | `"{GUID1}|{GUID2}"` |
| filterByKeyword | Treelist | `"{GUID1}|{GUID2}"` |

### MCP Authoring Checklist

- [ ] Have page ID from search
- [ ] Have rendering ID from component manifest
- [ ] Placeholder is `"headless-main"` (no leading slash)
- [ ] Component name is unique
- [ ] widgetId is a valid Sitecore Search widget ID

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
