# AuthorsSearch Component

## Purpose

The AuthorsSearch component provides a searchable listing of author profiles using Sitecore Search (RFK). It allows visitors to discover and browse authors by name or keyword, with faceted filtering and pagination. This component is typically used on author directory or "meet the team" pages.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Search/Authors Search`
- **Template Name:** `Authors Search`

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
| searchQuery | Initial search keyphrase | `?searchQuery=John` |

The component uses Next.js router to extract and apply URL parameters on initial load.

## Content Authoring Instructions

### Field-by-Field Guidance

#### widgetId (Required)

- **What to enter:** The Sitecore Search (Discover) widget ID for authors
- **How to obtain:** Get from Sitecore Search portal under Widgets configuration
- **Format:** Alphanumeric string (e.g., "rfkid_authors")
- **Important:** This field MUST be configured for the component to function

#### PageSizeCount

- **What to enter:** Number of author cards to display per page
- **Recommended values:** 8, 12, or 16 (multiples of 4 for grid layout)
- **Example:** `12`

#### facetsToExpand

- **What to enter:** Number of facet groups to show expanded by default
- **Recommended values:** 1-3
- **Example:** `2`

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | widgetId | - | Basic author listing |
| Standard | widgetId | PageSizeCount | Author listing with custom pagination |
| Full | widgetId | PageSizeCount, facetsToExpand | Complete author directory with facets |

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "widgetId": { "value": "rfkid_authors" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "widgetId": { "value": "rfkid_authors" },
    "PageSizeCount": { "value": 12 },
    "facetsToExpand": { "value": 2 }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Author Searches/`

### Experience Editor Behavior

- **Inline editable fields:** None (configuration-only fields)
- **Forms panel required:** widgetId, PageSizeCount, facetsToExpand
- **Search widget:** Requires Sitecore Search configuration to be active

### Sitecore Search Integration

This component integrates with Sitecore Search (formerly Discover/RFK). Prerequisites:

1. Sitecore Search account configured with author content type
2. Search widget created for authors in Sitecore Search portal
3. API keys configured in environment variables (SEARCH_CONFIG)
4. Author profiles indexed in Sitecore Search

## Common Mistakes to Avoid

1. **Missing widgetId:** The component will show an error message in editing mode if widgetId is not configured. Always set this field.

2. **Wrong content type widget:** Ensure the widget ID points to an author-specific search widget, not articles or other content types.

3. **Forgetting Search configuration:** The SEARCH_CONFIG environment variables must be set with valid API keys for the component to connect to Sitecore Search.

4. **URL encoding issues:** If searchQuery parameter contains special characters, ensure proper URL encoding.

## Related Components

- `KnowledgeCenterSearch` - Similar search for knowledge center content
- `SearchResults` - Global search results page component
- `AuthorProfile` - Individual author profile display

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "No widget id configured" error | widgetId field is empty | Add valid Sitecore Search widget ID |
| No results displayed | Search not configured or authors not indexed | Verify SEARCH_CONFIG and index status |
| Search query not applied | Router not ready or URL malformed | Check URL encoding and router state |
| Wrong content returned | Widget configured for wrong content type | Verify widget in Sitecore Search portal |

---

## MCP Authoring Instructions

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the AuthorsSearch rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"`)
4. Have a valid Sitecore Search widget ID for authors

### Step 1: Add Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "authors-search-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "AuthorsSearch_1",
  language: "en",
  fields: {
    "widgetId": "rfkid_authors"
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
    "PageSizeCount": "12",
    "facetsToExpand": "2"
  }
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| widgetId | Single-Line Text | `"rfkid_authors"` |
| PageSizeCount | Number | `"12"` |
| facetsToExpand | Number | `"2"` |

### MCP Authoring Checklist

- [ ] Have page ID from search
- [ ] Have rendering ID from component manifest
- [ ] Placeholder is `"headless-main"` (no leading slash)
- [ ] Component name is unique
- [ ] widgetId is a valid Sitecore Search widget ID for authors

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
