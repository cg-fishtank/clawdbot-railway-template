# KnowledgeCenterSearch Component

## Purpose

The KnowledgeCenterSearch component provides a comprehensive search experience for knowledge center content using Sitecore Search (RFK). It allows visitors to search, filter, and browse knowledge base articles, FAQs, documentation, and other support content. This component is typically used on help center, support, or documentation hub pages.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Search/Knowledge Center Search`
- **Template Name:** `Knowledge Center Search`

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

## URL Parameter Integration

The component reads search parameters from URL query strings:

| Parameter | Description | Example |
|-----------|-------------|---------|
| searchQuery | Initial search keyphrase | `?searchQuery=how+to+reset+password` |

The component uses Next.js router to extract and apply URL parameters on initial load.

## Content Authoring Instructions

### Field-by-Field Guidance

#### widgetId (Required)

- **What to enter:** The Sitecore Search (Discover) widget ID for knowledge center
- **How to obtain:** Get from Sitecore Search portal under Widgets configuration
- **Format:** Alphanumeric string (e.g., "rfkid_knowledge")
- **Important:** This field MUST be configured for the component to function

#### PageSizeCount

- **What to enter:** Number of results to display per page
- **Recommended values:** 10, 15, or 20 (typical for help content)
- **Example:** `15`

#### facetsToExpand

- **What to enter:** Number of facet groups to show expanded by default
- **Recommended values:** 2-3 for better discoverability
- **Example:** `3`

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | widgetId | - | Basic knowledge search |
| Standard | widgetId | PageSizeCount | Search with custom pagination |
| Full | widgetId | PageSizeCount, facetsToExpand | Complete help center experience |

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "widgetId": { "value": "rfkid_knowledge" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "widgetId": { "value": "rfkid_knowledge" },
    "PageSizeCount": { "value": 15 },
    "facetsToExpand": { "value": 3 }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Knowledge Center/`

### Experience Editor Behavior

- **Inline editable fields:** None (configuration-only fields)
- **Forms panel required:** widgetId, PageSizeCount, facetsToExpand
- **Search widget:** Requires Sitecore Search configuration to be active

### Sitecore Search Integration

This component integrates with Sitecore Search (formerly Discover/RFK). Prerequisites:

1. Sitecore Search account configured with knowledge center content type
2. Search widget created for knowledge content in Sitecore Search portal
3. API keys configured in environment variables (SEARCH_CONFIG)
4. Knowledge base content indexed in Sitecore Search

## Use Cases

- **Help Center:** Main search for support articles and FAQs
- **Documentation Hub:** Search technical documentation
- **Support Portal:** Find troubleshooting guides
- **Training Library:** Browse learning resources

## Common Mistakes to Avoid

1. **Missing widgetId:** The component will show an error message in editing mode if widgetId is not configured.

2. **Wrong content type widget:** Ensure the widget ID points to a knowledge-specific search widget with appropriate content types indexed.

3. **Forgetting Search configuration:** The SEARCH_CONFIG environment variables must be set with valid API keys.

4. **Poor facet configuration:** Knowledge content benefits from well-organized facets (topic, category, difficulty level).

## Related Components

- `AuthorsSearch` - Similar search for author profiles
- `SearchResults` - Global search results page
- `SimplePageListingWithFilters` - Generic page listing

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "No widget id configured" error | widgetId field is empty | Add valid Sitecore Search widget ID |
| No results displayed | Search not configured or content not indexed | Verify SEARCH_CONFIG and index status |
| Search query not applied | Router not ready or URL malformed | Check URL encoding and router state |
| Facets not useful | Poor facet configuration | Review Sitecore Search widget facet settings |

---

## MCP Authoring Instructions

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer-mcp__search_site`)
2. Have the KnowledgeCenterSearch rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"`)
4. Have a valid Sitecore Search widget ID for knowledge content

### Step 1: Add Component to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "knowledge-center-search-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "KnowledgeCenterSearch_1",
  language: "en",
  fields: {
    "widgetId": "rfkid_knowledge"
  }
});
```

### Step 2: Update Configuration (Optional)

```javascript
await mcp__marketer-mcp__update_content({
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
| widgetId | Single-Line Text | `"rfkid_knowledge"` |
| PageSizeCount | Number | `"15"` |
| facetsToExpand | Number | `"3"` |

### MCP Authoring Checklist

- [ ] Have page ID from search
- [ ] Have rendering ID from component manifest
- [ ] Placeholder is `"headless-main"` (no leading slash)
- [ ] Component name is unique
- [ ] widgetId is a valid Sitecore Search widget ID for knowledge content

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
