# InsightsListingWithFilters Component

## Purpose

The InsightsListingWithFilters component displays a searchable, filterable listing of "Insights" content type articles using Sitecore Search (RFK). It provides faceted filtering, keyword search, and pagination specifically configured for the Insights article variant. This component is typically used on insights hub or research library pages.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Search/Insights Listing With Filters`
- **Template Name:** `Insights Listing With Filters`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | No | Main heading displayed above the listing | Recommended max 80 characters |
| tagsHeading | Single-Line Text | No | Label for the tags/filter section | e.g., "Filter by topic" |
| noResultsText | Single-Line Text | No | Message shown when no results match filters | e.g., "No insights found" |
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

## Content Type Filtering

This component automatically filters results to the Insights content type using:

- **Template ID:** `INSIGHTS_TEMPLATE_ID` from `lib/graphql/id`
- **Variant:** `ARTICLE_VARIANTS.INSIGHTS` for card display styling

This ensures only Insights-type articles appear in the listing, regardless of other filter selections.

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The main title for the insights listing section
- **Tone/Style:** Professional, research-oriented
- **Character limit:** 80 characters recommended
- **Example:** "Industry Insights" or "Research & Analysis"

#### tagsHeading

- **What to enter:** Label text for the filter/tags section
- **Tone/Style:** Instructional, concise
- **Example:** "Filter by topic" or "Browse by industry"

#### noResultsText

- **What to enter:** Message displayed when no insights match the current filters
- **Tone/Style:** Helpful, encouraging
- **Example:** "No insights found. Try broadening your search." or "No research matches your criteria."

#### widgetId (Required)

- **What to enter:** The Sitecore Search (Discover) widget ID
- **How to obtain:** Get from Sitecore Search portal under Widgets configuration
- **Format:** Alphanumeric string (e.g., "rfkid_insights")
- **Important:** This field MUST be configured for the component to function

#### PageSizeCount

- **What to enter:** Number of insights to display per page
- **Recommended values:** 6, 9, or 12 (multiples of 3 for grid layout)
- **Example:** `9`

#### filterByKeyword

- **What to select:** Keyword items that enable pre-filtering
- **Selection path:** `/sitecore/content/[Site]/Data/Keywords/`

#### tags

- **What to select:** Category or tag items for filter facets
- **Selection path:** `/sitecore/content/[Site]/Data/Page Categories/` or `/sitecore/content/[Site]/Data/Tags/`

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | widgetId | - | Basic insights listing |
| Standard | widgetId, heading | tagsHeading, noResultsText | Typical insights hub page |
| Full | widgetId, heading, tagsHeading | noResultsText, tags, filterByKeyword, PageSizeCount | Complete research library |

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "widgetId": { "value": "rfkid_insights" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Industry Insights" },
    "tagsHeading": { "value": "Filter by topic" },
    "noResultsText": { "value": "No insights found. Try broadening your search." },
    "widgetId": { "value": "rfkid_insights" },
    "PageSizeCount": { "value": 9 },
    "tags": [
      {
        "displayName": "Market Analysis",
        "fields": { "pageCategory": { "value": "Market Analysis" } }
      },
      {
        "displayName": "Technology Trends",
        "fields": { "pageCategory": { "value": "Technology Trends" } }
      }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Insights Listings/`

### Experience Editor Behavior

- **Inline editable fields:** heading, tagsHeading, noResultsText
- **Forms panel required:** widgetId, PageSizeCount, tags, filterByKeyword
- **Search widget:** Requires Sitecore Search configuration to be active

### Sitecore Search Integration

This component integrates with Sitecore Search (formerly Discover/RFK). Prerequisites:

1. Sitecore Search account configured
2. Search widget created in Sitecore Search portal
3. API keys configured in environment variables (SEARCH_CONFIG)
4. Insights content indexed with proper template ID

## Relationship to ArticleBanner Variants

Insights displayed by this component typically link to article detail pages using the **ArticleBanner-Insights** variant, which displays with:
- Secondary (gray) badge theme
- Outline button style

## Common Mistakes to Avoid

1. **Missing widgetId:** The component will show an error message in editing mode if widgetId is not configured.

2. **Wrong content type indexed:** Ensure Insights content is properly indexed with the `INSIGHTS_TEMPLATE_ID` for filtering to work.

3. **Using general article widget:** This component filters by template ID, so the search widget should index all articles (filtering happens client-side).

4. **Forgetting Search configuration:** The SEARCH_CONFIG environment variables must be set with valid API keys.

## Related Components

- `ArticleListingWithFilters` - Generic article listing without content type filter
- `NewsListingWithFilters` - Similar listing for News content type
- `ArticleBanner-Insights` - Detail page banner variant for Insights

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "No widget id configured" error | widgetId field is empty | Add valid Sitecore Search widget ID |
| No results displayed | Search not configured or content not indexed | Verify SEARCH_CONFIG and index status |
| Non-insights content appearing | Template ID filtering not working | Verify INSIGHTS_TEMPLATE_ID constant |
| Wrong card styling | Variant not applied | Check ARTICLE_VARIANTS.INSIGHTS usage |

---

## MCP Authoring Instructions

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the InsightsListingWithFilters rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"`)
4. Have a valid Sitecore Search widget ID

### Step 1: Add Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "insights-listing-with-filters-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "InsightsListingWithFilters_1",
  language: "en",
  fields: {
    "heading": "Industry Insights",
    "tagsHeading": "Filter by topic",
    "noResultsText": "No insights found.",
    "widgetId": "rfkid_insights"
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
    "PageSizeCount": "9"
  }
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| tagsHeading | Single-Line Text | `"Plain text value"` |
| noResultsText | Single-Line Text | `"Plain text value"` |
| widgetId | Single-Line Text | `"rfkid_insights"` |
| PageSizeCount | Number | `"9"` |
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
