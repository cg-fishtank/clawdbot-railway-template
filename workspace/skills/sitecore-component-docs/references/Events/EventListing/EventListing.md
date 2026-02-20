# EventListing Component

## Purpose
EventListing automatically fetches and displays all Event Pages under the current site's content root using a server-side two-step GraphQL query (`getEventListingWithDetails`). It renders a paginated, filterable grid of `EventCard` items via the `EventListGrid` child component. A toggle switch lets users switch between upcoming/current and past events. The component also supports tag-based filtering: when `filterByTags` is enabled, it reads page-level SXA tags from context and filters the event set accordingly, falling back to the full list if no matching results are found.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `d5c1d2d5-959b-478b-be7d-50b1cd6b5ab9` |
| **Component Name** | `EventListing` |
| **Category** | `Events` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `heading` | Single-Line Text | Yes | Section heading rendered above the event grid |
| `filterByTags` | Checkbox | No | When checked, filters events by the current page's SXA tags |
| `tagsHeading` | Single-Line Text | No | Label displayed before the active tag list (default: "Filtering by tags:") |
| `noResultsText` | Single-Line Text | No | Message shown when tag filtering yields no matches (before falling back to full list) |
| `PageSizeCount` | Number | No | Number of events per paginated page (passed to `EventListGrid`) |

## Placeholders
**Placeholders:** None — the event grid is populated entirely from server-fetched data, not from CMS-placed components.

## Child Components
| File | Purpose |
|------|---------|
| `component-children/Events/EventListing/EventListing.tsx` | Rendering shell: applies `ContainedWrapper`, tag filtering logic, and renders `EventListGrid` |
| `component-children/Events/EventListing/EventListGrid.tsx` | Paginated grid with current/past toggle, smooth transition animations, and `EventCard` mapping |

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `Text` | `@sitecore-content-sdk/nextjs` |
| `tagsHeading` | `Text` | `@sitecore-content-sdk/nextjs` |
| `noResultsText` | `Text` | `@sitecore-content-sdk/nextjs` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard event listing with `withDatasourceCheck` |

## Props Interface
```typescript
import { Field } from '@sitecore-content-sdk/nextjs';
import { EventListingProps } from 'lib/types/components/Events/event-listing';

// EventListingProps (from lib/types/components/Events/event-listing)
type EventListingFields = {
  heading: Field<string>;
  filterByTags?: Field<boolean>;
  tagsHeading?: Field<string>;
  noResultsText?: Field<string>;
  PageSizeCount?: Field<number>;
};

type EventListingProps = ComponentProps & {
  fields: EventListingFields;
  // rendering.data is injected by getComponentServerProps:
  // EventDataType[] — the full fetched event list
};
```

## Server Props
`getComponentServerProps` fetches all event pages under the current site's content root before the component renders. Results are attached to `rendering.data`.

```typescript
export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const language = getLayoutLanguage(layoutData);
  const siteName = getSiteName(layoutData);
  const { contentRoot } = await fetchSiteRootInfo(siteName, language);

  const eventListingData = await getEventListingWithDetails(
    contentRootIdNullChecker(contentRoot?.id),
    language
  );

  return {
    rendering: { ...rendering, data: eventListingData.results },
    route: layoutData?.sitecore?.route,
  };
};
```

## Key Behaviors

### Toggle (Current vs Past Events)
`EventListGrid` compares each event's `endDate` (or `startDate` as fallback) against the current UTC date. The toggle switches between:
- **On (default)**: shows events whose end date is today or in the future
- **Off**: shows events whose end date has already passed

The toggle is hidden if no events exist in one of the two buckets.

### Tag Filtering
When `filterByTags` is `true` (or `"1"`), the component reads `pageTags` from `useContextPageTags()` and keeps only events that share at least one SXA tag. If filtering produces zero results, it falls back to the full event list and shows `noResultsText`.

### Pagination
`EventListGrid` paginates results using `PageSizeCount` (validated via `getValidPageSize`). A `Pagination` component is rendered below the grid when there is more than one page. Page changes scroll the user back to the top of the listing via `searchRef`.

### Edit Mode
`EditModeClickDisabler` wraps the grid in Experience Editor to prevent accidental card-link navigation while editing.

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "Upcoming Events" }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "heading": { "value": "All Events" },
    "filterByTags": { "value": true },
    "tagsHeading": { "value": "Showing events tagged:" },
    "noResultsText": { "value": "No events matched your current tags. Showing all events." },
    "PageSizeCount": { "value": 9 }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Events/Events-Landing",
  componentName: "EventListing",
  placeholderName: "main",
  dataSource: "/sitecore/content/MySite/Events/Events-Landing/EventListing-Data"
});
```

### Step 2: Configure Fields
```javascript
await mcp__marketer_mcp__update_component_fields({
  itemPath: "/sitecore/content/MySite/Events/Events-Landing/EventListing-Data",
  fields: {
    "heading": { "value": "Upcoming Events" },
    "filterByTags": { "value": false },
    "PageSizeCount": { "value": 9 }
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | `{ "value": "Upcoming Events" }` |
| `filterByTags` | Checkbox | `{ "value": true }` |
| `tagsHeading` | Single-Line Text | `{ "value": "Filtering by:" }` |
| `noResultsText` | Single-Line Text | `{ "value": "No matching events found." }` |
| `PageSizeCount` | Number | `{ "value": 9 }` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
