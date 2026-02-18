# PeopleSearch Component

## Purpose

The PeopleSearch component provides a people/team member search experience using Sitecore Search (RFK). It displays searchable and filterable listings of people profiles with faceted filtering and pagination. The search query is read from URL query parameters, enabling deep linking and bookmarkable search results. This component is typically used on dedicated people directory or team listing pages.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Search/People Search`
- **Template Name:** `People Search`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| widgetId | Single-Line Text | Yes | Sitecore Search widget ID (RFK ID) for people search | Must match configured Search widget |
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

## Component Variants

| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard people search listing (wrapped with `withDatasourceCheck`) |

## Content Authoring Instructions

### Field-by-Field Guidance

#### widgetId (Required)

- **What to enter:** The Sitecore Search (Discover) widget ID for people search
- **How to obtain:** Get from Sitecore Search portal under Widgets configuration
- **Format:** Alphanumeric string (e.g., "rfkid_people")
- **Important:** This field MUST be configured for the component to function. Without it, a "No Widget ID" error message displays.

#### PageSizeCount

- **What to enter:** Number of people results to display per page
- **Recommended values:** 10, 12, or 20
- **Example:** `12`

#### facetsToExpand

- **What to enter:** Number of facet groups to show expanded by default
- **Recommended values:** 2-3 for people search (role, department, location)
- **Example:** `3`

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | widgetId | - | Basic people search |
| Standard | widgetId | PageSizeCount | Search with custom pagination |
| Full | widgetId | PageSizeCount, facetsToExpand | Complete search experience |

## Component Props Interface

```typescript
import { Field } from '@sitecore-content-sdk/nextjs';
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

## URL Query Parameter Integration

The component reads search parameters from URL query parameters:

| Query Parameter | Description | Example |
|-----------------|-------------|---------|
| searchQuery | Search keyphrase | `?searchQuery=engineer` |

The component uses `router.query.searchQuery` from Next.js router to extract the search term and passes it to the PeopleSearchComponentWidget as the `defaultKeyphrase`.

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "widgetId": { "value": "rfkid_people" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "widgetId": { "value": "rfkid_people" },
    "PageSizeCount": { "value": 12 },
    "facetsToExpand": { "value": 3 }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Search/`
- People search page: `/sitecore/content/[Site]/Home/People` or `/sitecore/content/[Site]/Home/Team`

### Experience Editor Behavior

- **Inline editable fields:** None (configuration-only fields)
- **Forms panel required:** widgetId, PageSizeCount, facetsToExpand
- **Search widget:** Requires Sitecore Search configuration to be active

### Sitecore Search Integration

This component integrates with Sitecore Search (formerly Discover/RFK). Prerequisites:

1. Sitecore Search account configured
2. People search widget created in Sitecore Search portal
3. API keys configured in environment variables (SEARCH_CONFIG)
4. All person/people content types indexed in Sitecore Search
5. `PeopleSearchComponentWidget` configured in `src/widgets/SearchResults/PeopleSearch`

## Page Setup

The people search page should:

1. Be created at a predictable URL (e.g., `/people` or `/team`)
2. Have this component as the main content
3. Be linked from the site navigation
4. Accept search queries via URL query parameters

### Linking to People Search

From other parts of the site, link to people search using:
```
/people?searchQuery=engineer
```

The component will wait for `router.isReady` before extracting the search query to prevent hydration mismatches.

## Common Mistakes to Avoid

1. **Missing widgetId:** The component will show a NoWidgetIdError if widgetId is not configured.

2. **Wrong widget type:** Ensure the widget is configured specifically for people content types, not general site search.

3. **Not waiting for router:** The component sets search query via `useEffect` after `router.isReady` to ensure URL params are available.

4. **Wrong content types indexed:** Ensure people/person pages are indexed in Sitecore Search with appropriate facets (role, department, location).

5. **Forgetting Search configuration:** The SEARCH_CONFIG environment variables must be set with valid API keys.

## Related Components

- `SearchResults` - Global site search across all content types
- `AuthorsSearch` - Search for article authors specifically
- `PersonProfile` - Individual person profile page
- `SimplePageListingWithFilters` - Generic filtered page listing

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "No Widget ID" error | widgetId field is empty | Add valid Sitecore Search widget ID |
| Component not rendering | Router not ready | Normal behavior; wait for `router.isReady` |
| Search query not applied | Wrong URL format | Use query format: `?searchQuery=term` |
| Missing people | Widget not configured for people | Verify people content types are indexed |
| Blank results on load | Search service unavailable | Check SEARCH_CONFIG env variables |

---

## MCP Authoring Instructions

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer-mcp__search_site`)
2. Have the PeopleSearch rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"`)
4. Have a valid Sitecore Search widget ID for people search

### Step 1: Add Component to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "people-page-guid",
  componentRenderingId: "people-search-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "PeopleSearch_1",
  language: "en",
  fields: {
    "widgetId": "rfkid_people"
  }
});

const datasourceId = result.datasourceId;
```

### Step 2: Update Configuration (Optional)

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "PageSizeCount": "12",
    "facetsToExpand": "3"
  }
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| widgetId | Single-Line Text | `"rfkid_people"` |
| PageSizeCount | Number | `"12"` |
| facetsToExpand | Number | `"3"` |

### MCP Authoring Checklist

- [ ] Have page ID from search
- [ ] Have rendering ID from component manifest
- [ ] Placeholder is `"headless-main"` (no leading slash)
- [ ] Component name is unique
- [ ] widgetId is a valid Sitecore Search widget ID for people search
- [ ] Datasource check is satisfied (fields provided)

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `PeopleSearch_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| NoWidgetIdError shown | Missing widgetId | Provide valid widget ID in fields |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |
| "Cannot find field" | Wrong field name | Field names are case-sensitive |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-author` | Full orchestration workflow |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-18 | Initial documentation | Claude Code |
