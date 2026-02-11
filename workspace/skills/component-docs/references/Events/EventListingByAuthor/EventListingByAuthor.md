# EventListingByAuthor Component

## Purpose

The EventListingByAuthor component displays a grid of event cards filtered by a specific author/profile. It is designed for use on Author Profile pages to show all events where that author is a speaker or presenter. The component fetches all events and performs client-side filtering based on the author's profile reference. Like EventListing, it supports toggle functionality to switch between current/upcoming events and past events.

## Sitecore Template Requirements

### Data Source

This component uses a **datasource** for configuration fields and performs client-side filtering based on the author profile from the current page context. Event data is fetched automatically via GraphQL at build/request time.

### Template Path

- **Component Datasource Template:** `/sitecore/templates/Project/[Site]/Components/Event Listing By Author`
- **Event Pages:** Fetched automatically from `/sitecore/content/[Site]/Home/Events/`
- **Author Profile Pages:** `/sitecore/content/[Site]/Home/Authors/[Author Name]`

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
| theme | Droplist | primary, secondary, tertiary | primary | Color theme for component |
| padding (top) | Droplist | top-none, top-xs, top-sm, top-md, top-lg, top-xl | none | Top padding |
| padding (bottom) | Droplist | bottom-none, bottom-xs, bottom-sm, bottom-md, bottom-lg, bottom-xl | none | Bottom padding |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text tag="h2" field={fields?.heading} className="heading-lg" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| tagsHeading | `<Text field={fields.tagsHeading} tag="span" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| noResultsText | `<Text field={fields.noResultsText} />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

The EventListingByAuthor exports a single default variant:

| Variant | Export Name | Description | Use Case |
|---------|-------------|-------------|----------|
| Default | `Default` | Event grid filtered by current page author | Author profile pages |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** Section title indicating author-specific events
- **Tone/Style:** Clear, personalized
- **Character limit:** 60 characters recommended
- **Examples:** "Events", "Speaking Engagements", "Upcoming Presentations"

#### filterByTags (Checkbox)

- **What to set:** Check to enable additional tag-based filtering
- **Behavior when enabled:**
  - First filters by author profile
  - Then applies additional SxaTags filtering
  - Shows only events matching both author AND tags

#### tagsHeading

- **What to enter:** Label shown before the list of active filter tags
- **Default:** "Filtering by tags:"
- **Example:** "Also filtered by:"
- **Only visible when:** filterByTags is enabled AND page has tags

#### noResultsText

- **What to enter:** Message displayed when author has no events
- **Default:** "No event pages found."
- **Example:** "No speaking engagements scheduled."

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Basic | heading | - | Simple author events listing |
| Filtered | heading, filterByTags=true | tagsHeading, noResultsText | Events filtered by author AND tags |

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
    data: EventDataType[];  // All events, filtered client-side by author
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
    "heading": { "value": "Speaking Engagements" },
    "filterByTags": { "value": false },
    "tagsHeading": { "value": "Also filtering by:" },
    "noResultsText": { "value": "No speaking engagements scheduled." }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Event Listings/`
- Author profile pages: `/sitecore/content/[Site]/Home/Authors/[Author Name]`
- Event pages (auto-fetched): `/sitecore/content/[Site]/Home/Events/`

### Experience Editor Behavior

- **Inline editable fields:** heading, tagsHeading, noResultsText
- **Forms panel required:** filterByTags checkbox
- **Dynamic data:** Events filtered client-side based on author profile

### Filtering Mechanism

The component performs client-side filtering:
1. Fetches all Event Pages via GraphQL
2. Gets current author profile from route context
3. Filters events where `profiles` array contains the author
4. Optional: Applies additional SxaTags filtering if enabled

### Profile Matching

Events must have the author referenced in their `profiles` field:
- Event Page → profiles field → includes Author Profile item
- Author Profile page → route context provides author identity
- Client-side filter matches author against event profiles

## Common Mistakes to Avoid

1. **Missing heading:** Always provide a heading for accessibility and context.

2. **Using on non-author pages:** This component is designed for Author Profile pages. On other pages, it won't have an author context to filter by.

3. **Author not referenced in events:** For events to appear, the author must be added to each Event Page's `profiles` field.

4. **Expecting page-level filtering:** Filtering happens client-side, not at the GraphQL level. All events are fetched first.

5. **Wrong profile reference:** Ensure Event Pages reference the same Profile item that backs the Author Profile page.

## Related Components

- `EventCard` - Child component rendered for each event
- `EventListing` - Similar component without author filtering
- `EventDetails` - Full event detail page component
- `EventListGrid` - Child component managing the grid display and toggle
- `AuthorProfile` - Author profile page component

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the EventListingByAuthor component using the Marketer MCP tools.

### Important: Author Context Component

The EventListingByAuthor component:
1. Uses a datasource only for configuration (heading, filter settings)
2. Automatically fetches all Event Pages
3. Filters events client-side based on the current page's author profile
4. Must be placed on an Author Profile page to function correctly

### Step 1: Find Author Profile Page

```javascript
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "John Smith"  // Author name
});
const authorPageId = pageSearch.results[0].itemId;
```

### Step 2: Add EventListingByAuthor Component

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: authorPageId,
  componentRenderingId: "event-listing-by-author-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "EventListingByAuthor_Main",
  language: "en",
  fields: {
    "heading": "Speaking Engagements"
  }
});

const datasourceId = result.datasourceId;
```

### Step 3: Configure Settings (Optional)

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "noResultsText": "No speaking engagements scheduled."
  }
});
```

### Step 4: Link Author to Events

For events to appear in the listing, update each Event Page's `profiles` field:

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: "{EVENT-PAGE-GUID}",
  language: "en",
  fields: {
    "profiles": "{AUTHOR-PROFILE-ITEM-GUID}"  // Same profile referenced by author page
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find the author profile page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "John Smith"
});
const authorPageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add EventListingByAuthor component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer__add_component_on_page({
  pageId: authorPageId,
  componentRenderingId: "event-listing-by-author-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "EventListingByAuthor_Main",
  language: "en",
  fields: {
    "heading": "Speaking Engagements"
  }
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Configure no results message
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "noResultsText": "No speaking engagements scheduled at this time."
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Ensure events reference this author
// ═══════════════════════════════════════════════════════════════
// Get the author's profile item GUID
const authorProfile = await mcp__marketer__get_content_item_by_path({
  itemPath: "/sitecore/content/Site/Data/Profiles/John Smith"
});

// Update event pages to include this author as speaker
await mcp__marketer__update_content({
  siteName: "main",
  itemId: "{EVENT-PAGE-GUID}",
  language: "en",
  fields: {
    "profiles": authorProfile.itemId
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: EventListingByAuthor shows author's events
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| heading | Single-Line Text | Datasource | `"Plain text value"` |
| filterByTags | Checkbox | Datasource | `"1"` (true) or `""` (false) |
| tagsHeading | Single-Line Text | Datasource | `"Plain text value"` |
| noResultsText | Single-Line Text | Datasource | `"Plain text value"` |

### Event Profile Linking

For events to appear in the author's listing:

| Field | Item | MCP Format |
|:------|:-----|:-----------|
| profiles | Event Page | `"{PROFILE-GUID}"` or `"{GUID1}\|{GUID2}"` for multiple speakers |

### MCP Authoring Checklist

Before authoring EventListingByAuthor via MCP, verify:

- [ ] Have Author Profile page ID (from `mcp__marketer__search_site`)
- [ ] Have EventListingByAuthor rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] heading field has content (required)
- [ ] Event Pages have author in their `profiles` field

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `EventListingByAuthor_2` |
| No events displayed | Author not in event profiles | Add author GUID to event `profiles` field |
| Wrong events showing | Wrong profile GUID referenced | Verify profile GUID matches author page |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
