# EventDetails Component

## Purpose
EventDetails is the primary full-page detail component for an Event Page. It is a route context + datasource hybrid: most content fields (heading, dates, location, body, profiles, sponsors, image) are read directly from the Sitecore route fields via `useSitecore()`, while the registration `link` field comes from a separate datasource item. The component renders a two-column layout (sidebar + body), injects structured `<meta>` event tags into `<head>` via `EventMetadata`, provides an "Add to Calendar" ICS download, a social sharing widget, a speaker grid (`EventBodyStaffProfile`), a sponsor grid (`EventBodySponsors`), and a mobile sticky CTA button that appears when the sidebar scrolls out of view.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `f0620807-6435-4af8-8551-25faeedca739` |
| **Component Name** | `EventDetails` |
| **Category** | `Events` |

## Fields
Fields sourced from the **Event Page route** (via `useSitecore().page.layout.sitecore.route.fields`):

| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `heading` | Single-Line Text | Yes | Event title rendered as `<h1>` |
| `subheading` | Rich Text | No | Short description below the title |
| `startDate` | Date/Time | Yes | Event start, used in sidebar and Add to Calendar |
| `endDate` | Date/Time | No | Event end date for date range display |
| `eventTime` | Single-Line Text | No | Human-readable time (e.g. "7:00 PM – 9:00 PM") |
| `eventCost` | Single-Line Text | No | Ticket price or cost label |
| `location` | Multilist (Location items) | No | First location `contentName` shown with map-pin icon |
| `body` | Rich Text | No | Main event body content in the right column |
| `image` | Image | No | Hero image displayed at top of right column (aspect-video) |
| `profiles` | Multilist (Profile items) | No | Speakers grid shown below the body |
| `sponsors` | Multilist (Sponsor items) | No | Sponsor logo grid shown at bottom of right column |

Fields sourced from the **datasource item**:

| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `link` | General Link | No | Primary CTA link (e.g. registration URL) |
| `publishedLabel` | Single-Line Text | No | Reserved for display; not currently rendered |
| `lastUpdatedLabel` | Single-Line Text | No | Reserved for display; not currently rendered |

## Placeholders
**Placeholders:** None

## Child Components
| File | Purpose |
|------|---------|
| `component-children/Events/EventPage/EventMetadata.tsx` | Injects `<meta>` tags (event dates, category, profiles, location, sponsors) into `<head>` |
| `component-children/Events/EventPage/EventBodyStaffProfile.tsx` | Individual speaker card with image, name, role, company, location, expertise |
| `component-children/Events/EventPage/EventBodySponsors.tsx` | Sponsor logo grid with optional links |

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `Text` | `@sitecore-content-sdk/nextjs` |
| `subheading` | `RichText` | `@sitecore-content-sdk/nextjs` |
| `body` | `RichText` | `@sitecore-content-sdk/nextjs` |
| `image` | `NextImage` | `@sitecore-content-sdk/nextjs` |
| `link` (CTA) | `Button` child | `component-children/Shared/Button/Button` |
| `startDate` / `endDate` | `getDateRange` helper | `lib/helpers/time-date-helper` |
| `location` | `getLocationData` helper | `lib/helpers/location` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard event detail page with `withDatasourceCheck` |

## Props Interface
```typescript
import {
  Field,
  LinkField,
  GetComponentServerProps,
} from '@sitecore-content-sdk/nextjs';

type EventDetailsFields = {
  publishedLabel?: Field<string>;
  lastUpdatedLabel?: Field<string>;
  link?: LinkField; // Primary CTA — sourced from datasource
};

type EventDetailsProps = ComponentProps & {
  fields: EventDetailsFields;
  peoplePageDisplayName: string; // Injected by getComponentServerProps
};

// Route fields accessed via useSitecore() (not in props directly)
// page.layout.sitecore.route.fields typed as EventRouteFieldsType:
// heading, subheading, startDate, endDate, eventTime, eventCost,
// location, body, image, profiles, sponsors
```

## Server Props
`getComponentServerProps` resolves the People directory page's display name from Sitecore at render time, used to build speaker profile URLs.

```typescript
export const getComponentServerProps: GetComponentServerProps = async (_, layoutData) => {
  const peoplePageDisplayName = await getPeoplePageDisplayName(
    layoutData.sitecore?.context?.language || mainLanguage
  );
  return { peoplePageDisplayName };
};
```

## Key Behaviors
- **Mobile Sticky CTA**: An `IntersectionObserver` watches the sidebar (`headerRef`). When it scrolls off-screen on mobile, a fixed bottom bar with the registration `link` appears.
- **Add to Calendar**: Clicking the "Add to Calendar" button calls `downloadICS()` to generate and download an `.ics` file with event metadata.
- **Social Share**: A `SocialShare` component is rendered in the sidebar.
- **Edit Mode Mocks**: In Experience Editor, mock profile and sponsor data are shown when real data is empty, to allow authors to see the layout.
- **Theme Awareness**: Button colours adapt based on `effectiveTheme` from `useFrame()` (secondary → tertiary, otherwise → secondary).

## Example Content Entry

### Minimum Viable Content (datasource)
```json
{
  "fields": {
    "link": {
      "value": {
        "href": "https://eventbrite.com/e/12345",
        "text": "Register Now",
        "target": "_blank"
      }
    }
  }
}
```

### Full Content Example (route fields set on the Event Page item)
```json
{
  "route": {
    "fields": {
      "heading": { "value": "2026 Leadership Summit" },
      "subheading": { "value": "<p>Join us for a full day of inspiration.</p>" },
      "startDate": { "value": "20260410T090000Z" },
      "endDate": { "value": "20260410T170000Z" },
      "eventTime": { "value": "9:00 AM – 5:00 PM" },
      "eventCost": { "value": "$250 per person" },
      "body": { "value": "<p>Full conference agenda...</p>" },
      "image": { "value": { "src": "/-/media/events/summit.jpg", "alt": "Summit stage" } }
    }
  },
  "fields": {
    "link": { "value": { "href": "/register", "text": "Register Now" } }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Event Page
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Events/2026-Leadership-Summit",
  componentName: "EventDetails",
  placeholderName: "main",
  dataSource: "/sitecore/content/MySite/Events/2026-Leadership-Summit/EventDetails-Data"
});
```

### Step 2: Set the CTA Link
```javascript
await mcp__marketer_mcp__update_component_fields({
  itemPath: "/sitecore/content/MySite/Events/2026-Leadership-Summit/EventDetails-Data",
  fields: {
    "link": { "href": "https://eventbrite.com/e/summit-2026", "text": "Register Now", "target": "_blank" }
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text (route) | `{ "value": "Event Title" }` |
| `startDate` | Date (route) | `{ "value": "20260410T090000Z" }` |
| `endDate` | Date (route) | `{ "value": "20260410T170000Z" }` |
| `eventTime` | Single-Line Text (route) | `{ "value": "9:00 AM – 5:00 PM" }` |
| `eventCost` | Single-Line Text (route) | `{ "value": "$250 per person" }` |
| `body` | Rich Text (route) | `{ "value": "<p>...</p>" }` |
| `image` | Image (route) | `{ "value": { "src": "...", "alt": "..." } }` |
| `link` | General Link (datasource) | `{ "value": { "href": "...", "text": "...", "target": "..." } }` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
