# ArticleListingWithFilters Component

## Purpose

The ArticleListingWithFilters component displays a searchable, filterable listing of articles using Sitecore Search (RFK). It provides faceted filtering, keyword search, and pagination for article content. This component is typically used on article hub or listing pages where visitors browse and discover article content.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Search/Article Listing With Filters`
- **Template Name:** `Article Listing With Filters`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | No | Main heading displayed above the listing | Recommended max 80 characters |
| tagsHeading | Single-Line Text | No | Label for the tags/filter section | e.g., "Filter by topic" |
| noResultsText | Single-Line Text | No | Message shown when no results match filters | e.g., "No articles found" |
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

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The main title for the article listing section
- **Tone/Style:** Clear, descriptive, action-oriented
- **Character limit:** 80 characters recommended
- **Example:** "Latest Articles" or "Explore Our Insights"

#### tagsHeading

- **What to enter:** Label text for the filter/tags section
- **Tone/Style:** Instructional, concise
- **Example:** "Filter by topic" or "Browse by category"

#### noResultsText

- **What to enter:** Message displayed when no articles match the current filters
- **Tone/Style:** Helpful, encouraging
- **Example:** "No articles found. Try adjusting your filters." or "No results match your search criteria."

#### widgetId (Required)

- **What to enter:** The Sitecore Search (Discover) widget ID
- **How to obtain:** Get from Sitecore Search portal under Widgets configuration
- **Format:** Alphanumeric string (e.g., "rfkid_7")
- **Important:** This field MUST be configured for the component to function

#### PageSizeCount

- **What to enter:** Number of articles to display per page
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
| Minimal | widgetId | - | Basic listing without custom text |
| Standard | widgetId, heading | tagsHeading, noResultsText | Typical article hub page |
| Full | widgetId, heading, tagsHeading | noResultsText, tags, filterByKeyword | Complete filterable listing |

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "widgetId": { "value": "rfkid_7" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Latest Articles" },
    "tagsHeading": { "value": "Filter by topic" },
    "noResultsText": { "value": "No articles found. Try adjusting your filters." },
    "widgetId": { "value": "rfkid_7" },
    "PageSizeCount": { "value": 12 },
    "tags": [
      {
        "displayName": "Technology",
        "fields": { "pageCategory": { "value": "Technology" } }
      },
      {
        "displayName": "Healthcare",
        "fields": { "pageCategory": { "value": "Healthcare" } }
      }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Article Listings/`

### Experience Editor Behavior

- **Inline editable fields:** heading, tagsHeading, noResultsText
- **Forms panel required:** widgetId, PageSizeCount, tags, filterByKeyword
- **Search widget:** Requires Sitecore Search configuration to be active

### Sitecore Search Integration

This component integrates with Sitecore Search (formerly Discover/RFK). Prerequisites:

1. Sitecore Search account configured
2. Search widget created in Sitecore Search portal
3. API keys configured in environment variables (SEARCH_CONFIG)
4. Content indexed in Sitecore Search

## Common Mistakes to Avoid

1. **Missing widgetId:** The component will show an error message in editing mode if widgetId is not configured. Always set this field.

2. **Invalid widgetId:** Using a non-existent or incorrectly formatted widget ID will cause the search to fail silently. Verify the ID in Sitecore Search portal.

3. **Forgetting Search configuration:** The SEARCH_CONFIG environment variables must be set with valid API keys for the component to connect to Sitecore Search.

4. **Unpublished filter items:** If tags or filterByKeyword reference unpublished items, the filters won't appear. Ensure all referenced items are published.

5. **Incorrect PageSizeCount:** Using non-standard page sizes may cause layout issues. Stick to multiples of 3.

## Related Components

- `InsightsListingWithFilters` - Similar listing filtered specifically for Insights content type
- `NewsListingWithFilters` - Similar listing filtered specifically for News content type
- `SearchResults` - Global search results page component
- `SimplePageListingWithFilters` - Generic page listing without article-specific features

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "No widget id configured" error | widgetId field is empty | Add valid Sitecore Search widget ID |
| No results displayed | Search not configured or content not indexed | Verify SEARCH_CONFIG and index status |
| Filters not showing | tags/filterByKeyword empty or unpublished | Add and publish filter items |
| Layout issues | Invalid PageSizeCount | Use multiples of 3 (9, 12, 15) |
| Component not rendering | Missing WidgetsProvider | Ensure Sitecore Search package is installed |

---

## MCP Authoring Instructions

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the ArticleListingWithFilters rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"`)
4. Have a valid Sitecore Search widget ID

### Step 1: Add Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "article-listing-with-filters-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ArticleListingWithFilters_1",
  language: "en",
  fields: {
    "heading": "Latest Articles",
    "tagsHeading": "Filter by topic",
    "noResultsText": "No articles found.",
    "widgetId": "rfkid_7"
  }
});
```

### Step 2: Update Numeric Fields (Optional)

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
| widgetId | Single-Line Text | `"rfkid_7"` |
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
