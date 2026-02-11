# EventListingWithFilters Component

## Purpose

The EventListingWithFilters component displays a searchable, filterable listing of events using Sitecore Search (RFK). It includes specialized features for event content including date range filtering and a toggle to show past vs. upcoming events. URL state is preserved for deep linking and browser navigation. This component is typically used on event hub or calendar pages.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Search/Event Listing With Filters`
- **Template Name:** `Event Listing With Filters`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | No | Main heading displayed above the listing | Recommended max 80 characters |
| tagsHeading | Single-Line Text | No | Label for the tags/filter section | e.g., "Filter by type" |
| noResultsText | Single-Line Text | No | Message shown when no results match filters | e.g., "No events found" |
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

## URL State Management

The component maintains state in URL hash parameters for deep linking:

| Hash Parameter | Description | Example |
|----------------|-------------|---------|
| pastEvents | Show past events toggle | `#pastEvents=true` |
| dateRange | Selected date range (ISO format) | `#dateRange=2024-01-01|2024-03-31` |

State is synchronized with URL on every change for bookmarkability and browser back/forward navigation support.

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The main title for the event listing section
- **Tone/Style:** Clear, descriptive, action-oriented
- **Character limit:** 80 characters recommended
- **Example:** "Upcoming Events" or "Event Calendar"

#### tagsHeading

- **What to enter:** Label text for the filter/tags section
- **Tone/Style:** Instructional, concise
- **Example:** "Filter by event type" or "Browse by category"

#### noResultsText

- **What to enter:** Message displayed when no events match the current filters
- **Tone/Style:** Helpful, encouraging
- **Example:** "No events found for the selected dates." or "No upcoming events match your criteria."

#### widgetId (Required)

- **What to enter:** The Sitecore Search (Discover) widget ID for events
- **How to obtain:** Get from Sitecore Search portal under Widgets configuration
- **Format:** Alphanumeric string (e.g., "rfkid_events")
- **Important:** This field MUST be configured for the component to function

#### PageSizeCount

- **What to enter:** Number of events to display per page
- **Recommended values:** 6, 9, or 12 (multiples of 3 for grid layout)
- **Example:** `9`

#### filterByKeyword

- **What to select:** Keyword items that enable pre-filtering
- **Selection path:** `/sitecore/content/[Site]/Data/Keywords/`

#### tags

- **What to select:** Category or tag items for filter facets
- **Selection path:** `/sitecore/content/[Site]/Data/Event Categories/` or `/sitecore/content/[Site]/Data/Tags/`

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | widgetId | - | Basic event listing |
| Standard | widgetId, heading | tagsHeading, noResultsText | Typical event hub page |
| Full | widgetId, heading, tagsHeading | noResultsText, tags, filterByKeyword, PageSizeCount | Complete filterable event calendar |

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "widgetId": { "value": "rfkid_events" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Upcoming Events" },
    "tagsHeading": { "value": "Filter by event type" },
    "noResultsText": { "value": "No events found for the selected dates." },
    "widgetId": { "value": "rfkid_events" },
    "PageSizeCount": { "value": 9 },
    "tags": [
      {
        "displayName": "Webinar",
        "fields": { "pageCategory": { "value": "Webinar" } }
      },
      {
        "displayName": "Conference",
        "fields": { "pageCategory": { "value": "Conference" } }
      },
      {
        "displayName": "Workshop",
        "fields": { "pageCategory": { "value": "Workshop" } }
      }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Event Listings/`

### Experience Editor Behavior

- **Inline editable fields:** heading, tagsHeading, noResultsText
- **Forms panel required:** widgetId, PageSizeCount, tags, filterByKeyword
- **Search widget:** Requires Sitecore Search configuration to be active

### Sitecore Search Integration

This component integrates with Sitecore Search (formerly Discover/RFK). Prerequisites:

1. Sitecore Search account configured with event content type
2. Search widget created for events in Sitecore Search portal
3. API keys configured in environment variables (SEARCH_CONFIG)
4. Event content indexed in Sitecore Search with date fields

## Special Features

### Past Events Toggle

The component includes a toggle to switch between:
- **Upcoming events** (default): Shows events with dates in the future
- **Past events**: Shows events that have already occurred

### Date Range Filter

Users can filter events by a custom date range:
- Uses date picker UI (rendered by widget)
- Format: ISO 8601 date strings
- Persisted in URL hash as `dateRange=START|END`

## Common Mistakes to Avoid

1. **Missing widgetId:** The component will show an error message in editing mode if widgetId is not configured.

2. **Wrong content type widget:** Ensure the widget ID points to an event-specific search widget with date field support.

3. **Invalid date indexing:** Event dates must be properly indexed in Sitecore Search for date filtering to work.

4. **URL encoding issues:** Date range with special characters must be properly encoded in URLs.

5. **Time zone considerations:** Event dates should account for time zone handling in search queries.

## Related Components

- `ArticleListingWithFilters` - Similar listing for article content
- `EventCard` - Individual event card display used in results
- `EventDetails` - Full event detail page component

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "No widget id configured" error | widgetId field is empty | Add valid Sitecore Search widget ID |
| No results displayed | Search not configured or events not indexed | Verify SEARCH_CONFIG and index status |
| Date filter not working | Event dates not indexed correctly | Check Sitecore Search field mapping |
| Past events toggle not working | Widget not configured for date filtering | Verify widget supports date queries |
| URL state lost on navigation | Hash parameters not being read | Check router.isReady handling |

---

## MCP Authoring Instructions

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the EventListingWithFilters rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"`)
4. Have a valid Sitecore Search widget ID for events

### Step 1: Add Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "event-listing-with-filters-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "EventListingWithFilters_1",
  language: "en",
  fields: {
    "heading": "Upcoming Events",
    "tagsHeading": "Filter by event type",
    "noResultsText": "No events found.",
    "widgetId": "rfkid_events"
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
| widgetId | Single-Line Text | `"rfkid_events"` |
| PageSizeCount | Number | `"9"` |
| tags | Treelist | `"{GUID1}|{GUID2}"` |
| filterByKeyword | Treelist | `"{GUID1}|{GUID2}"` |

### MCP Authoring Checklist

- [ ] Have page ID from search
- [ ] Have rendering ID from component manifest
- [ ] Placeholder is `"headless-main"` (no leading slash)
- [ ] Component name is unique
- [ ] widgetId is a valid Sitecore Search widget ID for events

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
