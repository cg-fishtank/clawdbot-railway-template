# EventListing Component

## Purpose

The EventListing component displays a grid of event cards, automatically fetching all events from the site's content tree. It supports optional tag-based filtering to show only events matching specific SxaTags. The component features a section heading, filter status display, and a responsive grid layout with EventCard child components. It includes toggle functionality to switch between current/upcoming events and past events.

## Sitecore Template Requirements

### Data Source

This component uses a **datasource** for configuration fields (heading, filter settings, labels). Event data is fetched automatically via GraphQL at build/request time based on the site's content root.

### Template Path

- **Component Datasource Template:** `/sitecore/templates/Project/[Site]/Components/Event Listing`
- **Event Pages:** Fetched automatically from `/sitecore/content/[Site]/Home/Events/`

### Fields (Datasource)

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Section heading above the event grid | Recommended max 60 characters |
| filterByTags | Checkbox | No | Enable tag-based filtering | When true, filters by page SxaTags |
| tagsHeading | Single-Line Text | No | Label shown before active filter tags | Default: "Filtering by tags:" |
| noResultsText | Single-Line Text | No | Message when no events match filters | Default: "No event pages found." |

### Rendering Parameters

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| filter / tagFilteringEnabled | String | "1", "true" | - | Alternative way to enable tag filtering |
| theme | Droplist | primary, secondary, tertiary | primary | Color theme for component |
| padding (top) | Droplist | top-none, top-xs, top-sm, top-md, top-lg, top-xl | none | Top padding |
| padding (bottom) | Droplist | bottom-none, bottom-xs, bottom-sm, bottom-md, bottom-lg, bottom-xl | none | Bottom padding |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text tag="h2" field={fields?.heading} className="heading-lg mb-6" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| tagsHeading | `<Text field={fields.tagsHeading} tag="span" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| noResultsText | `<Text field={fields.noResultsText} />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

The EventListing exports a single default variant:

| Variant | Export Name | Description | Use Case |
|---------|-------------|-------------|----------|
| Default | `Default` | Standard event grid listing | Events landing page, homepage sections |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** Section title for the event listing
- **Tone/Style:** Clear, descriptive
- **Character limit:** 60 characters recommended
- **Examples:** "Upcoming Events", "Events & Conferences", "What's Happening"

#### filterByTags (Checkbox)

- **What to set:** Check to enable tag-based filtering
- **Behavior when enabled:**
  - Reads SxaTags from the current page context
  - Filters events to only show those with matching tags
  - Displays active filter tags below heading
  - If no matches found, shows all events with warning message

#### tagsHeading

- **What to enter:** Label shown before the list of active filter tags
- **Default:** "Filtering by tags:"
- **Example:** "Showing events tagged with:"
- **Only visible when:** filterByTags is enabled AND page has tags

#### noResultsText

- **What to enter:** Message displayed when no events match the active filters
- **Default:** "No event pages found."
- **Example:** "No matching events found. Showing all events instead."

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Basic | heading | - | Simple event listing without filtering |
| Filtered | heading, filterByTags=true | tagsHeading, noResultsText | Tag-filtered event display |

## Component Props Interface

```typescript
import { ComponentWithContextProps } from 'lib/component-props';
import { Field, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import { EventDataType } from 'lib/types';

type EventListingFields = {
  heading: Field<string>;
  filterByTags?: Field<boolean>;
  tagsHeading?: Field<string>;
  noResultsText?: Field<string>;
};

type EventListingRenderingType = {
  rendering: ComponentRendering & {
    data: EventDataType[];  // Populated at build/request time
  };
};

export type EventListingProps = ComponentWithContextProps &
  EventListingRenderingType & {
    fields: EventListingFields;
  };
```

## Example Content Entry

### Datasource Content

```json
{
  "fields": {
    "heading": { "value": "Upcoming Events" },
    "filterByTags": { "value": false },
    "tagsHeading": { "value": "Filtering by tags:" },
    "noResultsText": { "value": "No events found matching your criteria." }
  }
}
```

### With Tag Filtering Enabled

```json
{
  "fields": {
    "heading": { "value": "Related Events" },
    "filterByTags": { "value": true },
    "tagsHeading": { "value": "Showing events for:" },
    "noResultsText": { "value": "No related events found. Displaying all events." }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Event Listings/`
- Event pages (auto-fetched): `/sitecore/content/[Site]/Home/Events/`

### Experience Editor Behavior

- **Inline editable fields:** heading, tagsHeading, noResultsText
- **Forms panel required:** filterByTags checkbox
- **Dynamic data:** Event cards are fetched dynamically; add new Event Pages to populate

### Data Fetching

The component uses `getStaticProps` / `getServerSideProps` to:
1. Fetch site content root via `fetchSiteRootInfo`
2. Query all Event Pages under the content root
3. Pass event data to the rendering via `rendering.data`

### Tag Filtering Behavior

When `filterByTags` is enabled:
1. Component reads `pageTags` from page context
2. Filters events by matching `sxaTags.targetItems`
3. Uses `hasMatchingTags` helper for comparison
4. Falls back to showing all events if no matches found

## Common Mistakes to Avoid

1. **Missing heading:** Always provide a heading for accessibility and context.

2. **Enabling filters without page tags:** If `filterByTags` is true but the current page has no SxaTags, filtering effectively does nothing.

3. **Expecting manual event selection:** Events are fetched automatically from the Events folder. You cannot manually select which events appear.

4. **No Event Pages exist:** If no Event Pages exist under the site's content root, the listing will be empty.

5. **Wrong tag taxonomy:** Ensure Event Pages and the current page use the same SxaTags taxonomy for filtering to work.

## Related Components

- `EventCard` - Child component rendered for each event
- `EventListingByAuthor` - Similar component filtered by author profile
- `EventDetails` - Full event detail page component
- `EventListGrid` - Child component managing the grid display and toggle

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the EventListing component using the Marketer MCP tools.

### Important: Auto-Fetching Component

The EventListing component:
1. Uses a datasource only for configuration (heading, filter settings)
2. Automatically fetches all Event Pages from the site's Events folder
3. Does NOT require manual event selection

To populate the event grid, create Event Pages under `/sitecore/content/[Site]/Home/Events/`.

### Step 1: Find Target Page for Placement

```javascript
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Events Landing"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add EventListing Component

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "event-listing-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "EventListing_Main",
  language: "en",
  fields: {
    "heading": "Upcoming Events"
  }
});

const datasourceId = result.datasourceId;
```

### Step 3: Configure Filter Settings (Optional)

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "filterByTags": "1",  // Enable tag filtering
    "tagsHeading": "Events for:",
    "noResultsText": "No matching events found."
  }
});
```

### Step 4: Create Event Pages (to Populate Grid)

```javascript
// Create individual Event Pages to populate the listing
const newEvent = await mcp__marketer-mcp__create_page({
  siteName: "main",
  pageName: "Annual Conference 2024",
  parentItemId: "{EVENTS-FOLDER-GUID}",
  pageTemplateId: "{EVENT-PAGE-TEMPLATE-GUID}",
  language: "en"
});

// Then update the event page fields
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: newEvent.itemId,
  language: "en",
  fields: {
    "heading": "Annual Conference 2024",
    "startDate": "20240315T090000Z",
    "location": "{LOCATION-GUID}"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find the events landing page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Events"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add EventListing component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "event-listing-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "EventListing_Main",
  language: "en",
  fields: {
    "heading": "Upcoming Events"
  }
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: (Optional) Enable tag filtering
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "filterByTags": "1",
    "tagsHeading": "Showing events tagged:",
    "noResultsText": "No matching events. Showing all events."
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: EventListing configured
// Events are auto-fetched from /Home/Events/ folder
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| heading | Single-Line Text | Datasource | `"Plain text value"` |
| filterByTags | Checkbox | Datasource | `"1"` (true) or `""` (false) |
| tagsHeading | Single-Line Text | Datasource | `"Plain text value"` |
| noResultsText | Single-Line Text | Datasource | `"Plain text value"` |

### MCP Authoring Checklist

Before authoring EventListing via MCP, verify:

- [ ] Have target page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have EventListing rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] heading field has content (required)
- [ ] Event Pages exist under `/Home/Events/` folder to display

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `EventListing_2` |
| No events displayed | No Event Pages exist | Create Event Pages under Events folder |
| Filter not working | Page has no SxaTags | Add SxaTags to the current page |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
