# SearchResults Component

## Purpose

The SearchResults component provides a global site search experience using Sitecore Search (RFK). It displays search results from across all content types on the site, with faceted filtering and pagination. The search query is read from URL hash parameters, enabling deep linking and bookmarkable search results. This component is typically used on dedicated search results pages.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Search/Search Results`
- **Template Name:** `Search Results`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| widgetId | Single-Line Text | Yes | Sitecore Search widget ID (RFK ID) | Must match configured Search widget |
| PageSizeCount | Number | No | Number of results per page | Default varies by widget config |
| facetsToExpand | Number | No | Number of facet groups to show expanded | Default: all collapsed |

### Rendering Parameters (Styles)

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| theme | Droplist | primary, secondary, tertiary | primary | Color theme for the component |
| padding (top) | Droplist | top-none, top-xs, top-sm, top-md, top-lg, top-xl | none | Top padding |
| padding (bottom) | Droplist | bottom-none, bottom-xs, bottom-sm, bottom-md, bottom-lg, bottom-xl | none | Bottom padding |

## JSS Field Component Mapping

This component primarily uses Sitecore Search widget for display. Fields are configuration-based rather than content-driven.

| Sitecore Field | Usage | Notes |
|----------------|-------|-------|
| widgetId | Search widget configuration | Required for component to function |
| PageSizeCount | Pagination configuration | Passed to search widget |
| facetsToExpand | UI configuration | Controls facet panel behavior |

## Component Props Interface

```typescript
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export type GlobalSearchFields = {
  PageSizeCount?: Field<number>;
  widgetId?: Field<string>;
  facetsToExpand?: Field<number>;
};

export type GlobalSearchProps = ComponentProps & {
  fields: GlobalSearchFields;
};
```

## URL Hash Parameter Integration

The component reads search parameters from URL hash (fragment):

| Hash Parameter | Description | Example |
|----------------|-------------|---------|
| searchQuery | Search keyphrase | `#searchQuery=product+demo` |

**Important:** Unlike other search components that use query parameters (`?searchQuery=`), this component uses hash parameters (`#searchQuery=`) for client-side state management.

The component uses `extractHashParams` utility to parse the URL fragment and apply initial search state.

## Content Authoring Instructions

### Field-by-Field Guidance

#### widgetId (Required)

- **What to enter:** The Sitecore Search (Discover) widget ID for global search
- **How to obtain:** Get from Sitecore Search portal under Widgets configuration
- **Format:** Alphanumeric string (e.g., "rfkid_global")
- **Important:** This field MUST be configured for the component to function

#### PageSizeCount

- **What to enter:** Number of results to display per page
- **Recommended values:** 10, 15, or 20
- **Example:** `15`

#### facetsToExpand

- **What to enter:** Number of facet groups to show expanded by default
- **Recommended values:** 2-4 for global search (more content types = more facets)
- **Example:** `3`

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | widgetId | - | Basic global search |
| Standard | widgetId | PageSizeCount | Search with custom pagination |
| Full | widgetId | PageSizeCount, facetsToExpand | Complete search experience |

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "widgetId": { "value": "rfkid_global" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "widgetId": { "value": "rfkid_global" },
    "PageSizeCount": { "value": 15 },
    "facetsToExpand": { "value": 3 }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Search/`
- Search results page: `/sitecore/content/[Site]/Home/Search`

### Experience Editor Behavior

- **Inline editable fields:** None (configuration-only fields)
- **Forms panel required:** widgetId, PageSizeCount, facetsToExpand
- **Search widget:** Requires Sitecore Search configuration to be active

### Sitecore Search Integration

This component integrates with Sitecore Search (formerly Discover/RFK). Prerequisites:

1. Sitecore Search account configured
2. Global search widget created in Sitecore Search portal
3. API keys configured in environment variables (SEARCH_CONFIG)
4. All searchable content types indexed in Sitecore Search

## Page Setup

The search results page should:

1. Be created at a predictable URL (e.g., `/search`)
2. Have this component as the main content
3. Be linked from the site header search functionality
4. Accept search queries via URL hash parameters

### Linking to Search Results

From other parts of the site, link to search results using:
```
/search#searchQuery=your+search+term
```

The component will wait for `router.isReady` before rendering to ensure hash parameters are available.

## Common Mistakes to Avoid

1. **Missing widgetId:** The component will show an error message in editing mode if widgetId is not configured.

2. **Using query parameters instead of hash:** This component uses URL hash (`#searchQuery=`) not query strings (`?searchQuery=`).

3. **Not waiting for router:** The component returns null until `router.isReady` to prevent hydration mismatches.

4. **Wrong widget scope:** Ensure the widget indexes all content types for global search, not just a subset.

5. **Forgetting Search configuration:** The SEARCH_CONFIG environment variables must be set with valid API keys.

## Related Components

- `ArticleListingWithFilters` - Filtered listing for specific content types
- `KnowledgeCenterSearch` - Specialized search for help content
- `AuthorsSearch` - Search for author profiles

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "No widget id configured" error | widgetId field is empty | Add valid Sitecore Search widget ID |
| Component not rendering | Router not ready | Normal behavior; wait for router |
| Search query not applied | Wrong URL format | Use hash format: `#searchQuery=term` |
| Missing content types | Widget not configured | Verify all content types are indexed |
| Blank page on load | Hash not parsed | Check `extractHashParams` utility |

---

## MCP Authoring Instructions

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the SearchResults rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"`)
4. Have a valid Sitecore Search widget ID for global search

### Step 1: Add Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "search-page-guid",
  componentRenderingId: "search-results-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "SearchResults_1",
  language: "en",
  fields: {
    "widgetId": "rfkid_global"
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
    "PageSizeCount": "15",
    "facetsToExpand": "3"
  }
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| widgetId | Single-Line Text | `"rfkid_global"` |
| PageSizeCount | Number | `"15"` |
| facetsToExpand | Number | `"3"` |

### MCP Authoring Checklist

- [ ] Have page ID from search
- [ ] Have rendering ID from component manifest
- [ ] Placeholder is `"headless-main"` (no leading slash)
- [ ] Component name is unique
- [ ] widgetId is a valid Sitecore Search widget ID for global search

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
