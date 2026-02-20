# EventCard Component

## Purpose
EventCard renders a compact summary card for a single Event Page, intended for use inside event listing grids. The card links to the event's URL (resolved at server time via `getComponentServerProps`) and displays an event date block, the event heading with optional category badge, and key metadata (date range, time, location). In Experience Editor the card renders as a non-linked `<div>` to allow inline editing; in delivery mode it wraps in a JSS `<Link>`. Child sub-components — `EventCardDateBlock`, `EventCardHeader`, and `EventCardDetails` — handle each visual region.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `46136932-c423-4152-bc38-abf8d242f881` |
| **Component Name** | `EventCard` |
| **Category** | `Events` |

## Fields
Fields are sourced from the **Event Page route** (`EventRouteFieldsType`) plus optional datasource label overrides:

| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `heading` | Single-Line Text | Yes | The event title displayed in the card header |
| `startDate` | Date/Time | Yes | Event start date — drives the date block and date range display |
| `endDate` | Date/Time | No | Event end date — used in the date range label |
| `eventTime` | Single-Line Text | No | Human-readable time string (e.g. "7:00 PM – 9:00 PM") |
| `pageCategory` | Multilist (Page Category items) | No | First category is shown as an uppercase badge above the heading |
| `location` | Multilist (Location items) | No | Location `contentName` values joined and shown with a map-pin icon |
| `dateLabel` | Single-Line Text | No | Datasource override label for the date row (i18n fallback built in) |
| `timeLabel` | Single-Line Text | No | Datasource override label for the time row |
| `locationLabel` | Single-Line Text | No | Datasource override label for the location row |

## Placeholders
**Placeholders:** None

## Child Components
| File | Purpose |
|------|---------|
| `component-children/Shared/Event/EventCardDateBlock.tsx` | Coloured square block showing month abbreviation and two-digit day |
| `component-children/Shared/Event/EventCardHeader.tsx` | Category badge + event heading `<h3>` |
| `component-children/Shared/Event/EventCardDetails.tsx` | Icon-labelled rows for date range, time, and location |

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `Text` (in `EventCardHeader`) | `@sitecore-content-sdk/nextjs` |
| `pageCategory` | Custom (`getPageCategories` helper) | `lib/helpers/page-category` |
| `location` | Custom (`getLocationData` helper) | `lib/helpers/location` |
| `startDate` / `endDate` | `getDateRange` helper | `lib/helpers/time-date-helper` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard event card with datasource check |

## Props Interface
```typescript
import {
  ComponentRendering,
  Field,
  GetComponentServerProps,
} from '@sitecore-content-sdk/nextjs';
import { EventRouteFieldsType } from 'lib/types';

type EventCardProps = {
  fields?: EventRouteFieldsType;
  rendering: ComponentRendering & {
    path?: string; // Resolved item URL path from getComponentServerProps
  };
} & ComponentProps;

type EventCardFields = {
  fields: {
    dateLabel?: Field<string>;
    timeLabel?: Field<string>;
    locationLabel?: Field<string>;
  };
};

// EventRouteFieldsType (relevant fields)
type EventRouteFieldsType = {
  heading?: { jsonValue: Field<string> };
  startDate?: CustomField;          // DateField wrapper
  endDate?: CustomField;            // DateField wrapper
  eventTime?: Field<string>;
  eventCost?: Field<string>;
  pageCategory?: PageCategoryField; // Multilist
  location?: LocationField;         // Multilist
  profiles?: ProfileType[];
  sponsors?: SponsorType[];
};
```

## Server Props
`getComponentServerProps` resolves the datasource item's CMS URL path at build/request time and injects it as `rendering.path`. This prevents client-side GraphQL calls on every card render.

```typescript
export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const language = getLayoutLanguage(layoutData);
  const itemPath = await getItemPath(rendering?.dataSource as string, language);
  return {
    rendering: { ...rendering, path: (itemPath as ItemPathReturnType)?.item?.url?.path },
  };
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "Annual Gala Dinner" },
    "startDate": { "value": "20260315T190000Z" }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "heading": { "value": "Annual Gala Dinner" },
    "startDate": { "value": "20260315T190000Z" },
    "endDate": { "value": "20260315T220000Z" },
    "eventTime": { "value": "7:00 PM – 10:00 PM" },
    "pageCategory": [
      { "fields": { "pageCategory": { "value": "Fundraising" } } }
    ],
    "location": [
      { "fields": { "contentName": { "value": "Grand Ballroom, Vancouver" } } }
    ],
    "dateLabel": { "value": "Date:" },
    "timeLabel": { "value": "Time:" },
    "locationLabel": { "value": "Location:" }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Events/Annual-Gala",
  componentName: "EventCard",
  placeholderName: "event-listing-cards",
  dataSource: "/sitecore/content/MySite/Events/Annual-Gala"
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | `{ "value": "Event Title" }` |
| `startDate` | Date | `{ "value": "20260315T190000Z" }` (ISO 8601 UTC) |
| `endDate` | Date | `{ "value": "20260315T220000Z" }` |
| `eventTime` | Single-Line Text | `{ "value": "7:00 PM – 10:00 PM" }` |
| `pageCategory` | Multilist | Array of category item references |
| `location` | Multilist | Array of location item references |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
