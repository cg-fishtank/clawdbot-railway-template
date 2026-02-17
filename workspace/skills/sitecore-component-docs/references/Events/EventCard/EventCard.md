# EventCard Component

## Purpose

The EventCard component displays a compact summary of an event in a card format, featuring the event date, heading, category badge, location, and time details. It is used within event listing components to provide clickable navigation to full event detail pages. The card displays a date block, event header with category, and event details including date range, location, and time.

## Sitecore Template Requirements

### Data Source

This component uses a **datasource** that references an Event Page item. The datasource must point to an Event Page to retrieve the event's fields.

### Template Path

- **Event Page Template:** `/sitecore/templates/Project/[Site]/Events/Event Page`
- **Datasource:** References Event Page items

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Event title displayed in the card | Recommended max 80 characters |
| startDate | Date | Yes | Event start date and time | ISO date format with time |
| endDate | Date | No | Event end date and time | ISO date format with time |
| eventTime | Single-Line Text | No | Display time text (e.g., "9:00 AM - 5:00 PM") | Free text format |
| pageCategory | Multilist/Treelist | No | Reference to Page Category taxonomy items | Links to `/sitecore/content/[Site]/Data/Page Categories/` |
| location | Multilist/Treelist | No | Reference to Location taxonomy items | Links to `/sitecore/content/[Site]/Data/Locations/` |

### Component-Level Fields (Datasource)

| Field Name | Sitecore Type | Required | Description |
|------------|---------------|----------|-------------|
| dateLabel | Single-Line Text | No | Label for date (localization) |
| timeLabel | Single-Line Text | No | Label for time (localization) |
| locationLabel | Single-Line Text | No | Label for location (localization) |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | Via `EventCardHeader` child component | Custom component |
| startDate | Via `EventCardDateBlock` child component | Custom component |
| endDate | Via `EventCardDetails` child component | Custom component |
| pageCategory | `<Text field={category} editable={false} />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

The EventCard exports a single default variant:

| Variant | Export Name | Description | Use Case |
|---------|-------------|-------------|----------|
| Default | `Default` | Standard event card with date block | Event listings |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The event title/name
- **Tone/Style:** Clear, descriptive, engaging
- **Character limit:** 80 characters recommended for best display
- **Example:** "Annual Technology Conference 2024"

#### startDate

- **What to enter:** The event start date and time
- **Format:** Use Sitecore's date/time picker
- **Display:** Shows as a visual date block (month/day) and in date range
- **Example:** "2024-03-15T09:00:00Z"

#### endDate

- **What to enter:** The event end date and time
- **Format:** Use Sitecore's date/time picker
- **Display:** Combined with startDate to show date range (e.g., "March 15-17, 2024")
- **Example:** "2024-03-17T17:00:00Z"

#### eventTime

- **What to enter:** Human-readable time description
- **Format:** Free text
- **Display:** Shown below the date range
- **Example:** "9:00 AM - 5:00 PM EST"

#### pageCategory

- **What to select:** One category item from the Page Categories folder
- **Selection path:** `/sitecore/content/[Site]/Data/Page Categories/`
- **Display:** Shows as uppercase badge text
- **Example categories:** "Conference", "Workshop", "Webinar", "Meetup"

#### location

- **What to select:** One or more location items from the Locations folder
- **Selection path:** `/sitecore/content/[Site]/Data/Locations/`
- **Display:** Shows location name with icon
- **Example locations:** "New York", "Virtual", "Chicago Convention Center"

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | heading, startDate | - | Basic event display |
| Standard | heading, startDate, location | endDate, eventTime, pageCategory | Most common setup |
| Full | heading, startDate, endDate, eventTime, location, pageCategory | - | Complete event card |

## Component Props Interface

```typescript
import { ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { EventRouteFieldsType } from 'lib/types';

type EventCardProps = {
  fields?: EventRouteFieldsType;
  rendering: ComponentRendering & {
    path?: string;  // Resolved item path for card link
  };
} & ComponentProps;

type EventCardFields = {
  fields: {
    dateLabel?: Field<string>;
    timeLabel?: Field<string>;
    locationLabel?: Field<string>;
  };
};

// EventRouteFieldsType includes:
// - heading: Field<string>
// - subheading: Field<string>
// - startDate: CustomField
// - endDate: CustomField
// - eventTime: Field<string>
// - eventCost: Field<string>
// - pageCategory: PageCategoryField
// - location: LocationField
// - profiles: ProfileType[]
// - sponsors: SponsorType[]
// - body: CustomField
// - image: ImageField
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Annual Technology Conference" },
    "startDate": { "value": "2024-03-15T09:00:00Z" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Annual Technology Conference 2024" },
    "startDate": { "value": "2024-03-15T09:00:00Z" },
    "endDate": { "value": "2024-03-17T17:00:00Z" },
    "eventTime": { "value": "9:00 AM - 5:00 PM EST" },
    "pageCategory": [
      {
        "id": "{CATEGORY-GUID}",
        "displayName": "Conference",
        "fields": {
          "pageCategory": { "value": "Conference" }
        }
      }
    ],
    "location": [
      {
        "id": "{LOCATION-GUID}",
        "fields": {
          "contentName": { "value": "Chicago Convention Center" }
        }
      }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Event pages: `/sitecore/content/[Site]/Home/Events/[Event Name]`
- Page Categories: `/sitecore/content/[Site]/Data/Page Categories/`
- Locations: `/sitecore/content/[Site]/Data/Locations/`

### Experience Editor Behavior

- **Not directly editable:** EventCard is typically rendered within EventListing components
- **Datasource editing:** Edit the source Event Page item to update card content
- **Link behavior:** Card links to the full Event Page

### Rendering Variant Selection

No variants - single default rendering.

## Common Mistakes to Avoid

1. **Missing startDate:** The date block requires a startDate to display properly. Always ensure startDate is set.

2. **Invalid date formats:** Ensure dates are in ISO format for proper parsing and localization.

3. **Missing location data:** If location is set, ensure the referenced Location item has a `contentName` field value.

4. **Overly long headings:** Headlines exceeding 80 characters may truncate in the card layout.

5. **Missing event page path:** The component uses server-side props to resolve the item path. Ensure datasource is properly set.

## Related Components

- `EventListing` - Parent component that renders EventCard items
- `EventListingByAuthor` - Alternative parent component filtered by author
- `EventDetails` - Full event detail page component
- `EventCardDateBlock` - Child component for date display
- `EventCardHeader` - Child component for heading/category display
- `EventCardDetails` - Child component for date range/location/time display

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring content that the EventCard component will display using the Marketer MCP tools.

### Important: Datasource-Based Component

The EventCard component:
1. References an Event Page as its datasource
2. Displays content from the Event Page fields
3. Links to the Event Page when clicked

To populate EventCard content, you author the **Event Page** that the component references.

### Step 1: Create or Find Event Page

```javascript
// Search for existing event page
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Annual Technology Conference"
});

// Or create a new event page
const newPage = await mcp__marketer-mcp__create_page({
  siteName: "main",
  pageName: "Annual Technology Conference 2024",
  parentItemId: "{EVENTS-FOLDER-GUID}",
  pageTemplateId: "{EVENT-PAGE-TEMPLATE-GUID}",
  language: "en"
});
```

### Step 2: Update Event Page Fields

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: eventPageId,
  language: "en",
  fields: {
    "heading": "Annual Technology Conference 2024",
    "startDate": "20240315T090000Z",
    "endDate": "20240317T170000Z",
    "eventTime": "9:00 AM - 5:00 PM EST"
  }
});
```

### Step 3: Set Location Reference

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: eventPageId,
  language: "en",
  fields: {
    "location": "{LOCATION-ITEM-GUID}"
  }
});
```

### Step 4: Set Page Category

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: eventPageId,
  language: "en",
  fields: {
    "pageCategory": "{CONFERENCE-CATEGORY-GUID}"
  }
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| startDate | Date | `"20240315T090000Z"` |
| endDate | Date | `"20240317T170000Z"` |
| eventTime | Single-Line Text | `"9:00 AM - 5:00 PM EST"` |
| pageCategory | Multilist | `"{GUID}"` |
| location | Multilist | `"{GUID}"` |

### MCP Authoring Checklist

Before authoring EventCard content via MCP, verify:

- [ ] Have Event Page ID or create new Event Page
- [ ] heading field has content (required)
- [ ] startDate is in correct format (`YYYYMMDDTHHMMSSZ`)
- [ ] Have Location GUID if setting location
- [ ] Have Category GUID if categorizing

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| Date not displaying | Wrong date format | Use ISO format: `20240315T090000Z` |
| Location not showing | Invalid GUID | Verify GUID from Locations folder |
| Category not showing | Invalid GUID | Verify GUID from Page Categories |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
