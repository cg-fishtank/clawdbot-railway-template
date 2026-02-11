# EventDetails Component

## Purpose

The EventDetails component displays the complete detail view for an event page, featuring a two-column layout with event metadata on the left (title, description, date, time, location, cost, CTA button, calendar download, social sharing) and main content on the right (hero image, body content, speaker profiles, sponsors). It serves as the primary content component for event detail pages and outputs structured metadata for SEO.

## Sitecore Template Requirements

### Data Source

**Important:** This component reads most fields from the **page/route context**, not from a component-level datasource. The Event Page Template must contain all event fields. The component does have a datasource for the CTA link field.

### Template Path

- **Page Template:** `/sitecore/templates/Project/[Site]/Events/Event Page`
- **Component Datasource:** Used only for the `link` field (CTA button)

### Fields (Route/Page Level)

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Event title (H1) | Recommended max 100 characters |
| subheading | Rich Text | No | Event summary/description | Supports basic formatting |
| startDate | Date | Yes | Event start date and time | ISO date format with time |
| endDate | Date | No | Event end date and time | ISO date format with time |
| eventTime | Single-Line Text | No | Display time text | Free text format |
| eventCost | Single-Line Text | No | Cost/pricing information | Free text (e.g., "Free", "$50") |
| location | Multilist/Treelist | No | Reference to Location taxonomy items | Links to Locations folder |
| body | Rich Text | No | Main event content/description | Full rich text support |
| image | Image | No | Hero image for the event | Recommended 16:9 aspect ratio |
| profiles | Multilist/Treelist | No | Reference to Speaker/Profile items | Links to Profiles folder |
| sponsors | Multilist/Treelist | No | Reference to Sponsor items | Links to Sponsors folder |

### Component-Level Fields (Datasource)

| Field Name | Sitecore Type | Required | Description |
|------------|---------------|----------|-------------|
| link | General Link | No | CTA button link (e.g., "Register Now") |
| publishedLabel | Single-Line Text | No | Label for published date |
| lastUpdatedLabel | Single-Line Text | No | Label for last updated date |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text className="heading-3xl lg:heading-4xl" field={heading} tag="h1" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| subheading | `<RichText className="richtext text-base" field={subheading} />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| body | `<RichText field={body} className="richtext richtext-h1-4xl w-full" />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| image | `<NextImage field={image} fill className="object-cover" />` | `import { NextImage } from '@sitecore-jss/sitecore-jss-nextjs'` |
| link | Via `Button` component | `import Button from 'component-children/Shared/Button/Button'` |

## Component Variants

The EventDetails exports a single default variant:

| Variant | Export Name | Description | Use Case |
|---------|-------------|-------------|----------|
| Default | `Default` | Full event detail layout | Event detail pages |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The event title that serves as the H1
- **Tone/Style:** Clear, descriptive, engaging
- **Character limit:** 100 characters recommended
- **Example:** "Annual Technology Innovation Summit 2024"

#### subheading

- **What to enter:** Brief event summary or tagline
- **Tone/Style:** Informative, supports the headline
- **Formatting:** Basic rich text - keep it concise
- **Example:** "Join industry leaders for three days of innovation, networking, and hands-on workshops."

#### startDate / endDate

- **What to enter:** Event start and end dates/times
- **Format:** Use Sitecore's date/time picker
- **Display:** Formatted as date range (e.g., "March 15-17, 2024")
- **Note:** endDate is optional for single-day events

#### eventTime

- **What to enter:** Human-readable time description
- **Format:** Free text
- **Display:** Shown with calendar icon
- **Example:** "9:00 AM - 5:00 PM EST"

#### eventCost

- **What to enter:** Pricing information
- **Format:** Free text
- **Display:** Shown with ticket icon prefixed by "Cost:"
- **Examples:** "Free", "$199 Early Bird", "€50 - €150"

#### location

- **What to select:** Location items from the Locations folder
- **Selection path:** `/sitecore/content/[Site]/Data/Locations/`
- **Display:** Shows location name with map pin icon
- **Example locations:** "Virtual", "Chicago Convention Center", "Online + In-Person"

#### body

- **What to enter:** Full event description and details
- **Format:** Full rich text support
- **Content:** Agenda, highlights, what attendees will learn, etc.
- **Headings:** Use H2-H4 for structure; H1 styling is applied via CSS

#### image

- **Recommended dimensions:** 1920x1080px (16:9 aspect ratio)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Descriptive text for accessibility
- **Media Library path:** `/sitecore/media library/Project/[Site]/Events/`

#### profiles (Speakers)

- **What to select:** Profile items representing speakers/presenters
- **Selection path:** `/sitecore/content/[Site]/Data/Profiles/`
- **Display:** Shows profile image, name, role, company
- **Profile fields required:** firstName, lastName, role, company, image

#### sponsors

- **What to select:** Sponsor items with logos
- **Selection path:** `/sitecore/content/[Site]/Data/Sponsors/`
- **Display:** Shows sponsor logos in grid format

#### link (CTA Button)

- **What to enter:** Registration or action link
- **Link Types:** Internal, External
- **Display:** Prominent button below event details
- **Example:** "Register Now" → registration page

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | heading, startDate | - | Basic event announcement |
| Standard | heading, startDate, subheading, body, location | endDate, eventTime, image | Most common setup |
| Full | All fields | - | Premium event with speakers/sponsors |

## Component Props Interface

```typescript
import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { EventRouteFieldsType, ProfileType, SponsorType } from 'lib/types';

type EventDetailsFields = {
  publishedLabel?: Field<string>;
  lastUpdatedLabel?: Field<string>;
  link?: LinkField;
};

type EventDetailsProps = ComponentProps & {
  fields: EventDetailsFields;
};

// Route fields (from useSitecoreContext):
// EventRouteFieldsType includes:
// - heading: Field<string>
// - subheading: Field<string>
// - startDate: CustomField
// - endDate: CustomField
// - eventTime: Field<string>
// - eventCost: Field<string>
// - body: CustomField
// - image: ImageField
// - location: LocationField
// - profiles: ProfileType[]
// - sponsors: SponsorType[]
// - pageCategory: PageCategoryField
```

## Example Content Entry

### Page-Level Content (Event Page)

```json
{
  "fields": {
    "heading": { "value": "Annual Technology Innovation Summit 2024" },
    "subheading": {
      "value": "<p>Join industry leaders for three days of innovation, networking, and hands-on workshops.</p>"
    },
    "startDate": { "value": "2024-03-15T09:00:00Z" },
    "endDate": { "value": "2024-03-17T17:00:00Z" },
    "eventTime": { "value": "9:00 AM - 5:00 PM EST" },
    "eventCost": { "value": "$199 Early Bird / $299 Regular" },
    "body": {
      "value": "<h2>What You'll Learn</h2><p>Discover the latest trends in AI, cloud computing, and digital transformation...</p>"
    },
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Events/summit-2024-hero.jpg",
        "alt": "Technology Summit 2024 main stage",
        "width": "1920",
        "height": "1080"
      }
    },
    "location": [
      {
        "id": "{LOCATION-GUID}",
        "fields": {
          "contentName": { "value": "Chicago Convention Center" }
        }
      }
    ],
    "profiles": [
      {
        "name": "John Smith",
        "fields": {
          "firstName": { "value": "John" },
          "lastName": { "value": "Smith" },
          "role": { "value": "CEO" },
          "company": { "value": "Tech Corp" },
          "image": { "value": { "src": "/-/media/profiles/john-smith.jpg" } }
        }
      }
    ]
  }
}
```

### Component Datasource (CTA Link)

```json
{
  "fields": {
    "link": {
      "value": {
        "href": "/events/summit-2024/register",
        "text": "Register Now",
        "target": ""
      }
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Event pages: `/sitecore/content/[Site]/Home/Events/[Event Name]`
- Component datasources: `/sitecore/content/[Site]/Home/Data/Event Details/`
- Locations: `/sitecore/content/[Site]/Data/Locations/`
- Profiles: `/sitecore/content/[Site]/Data/Profiles/`
- Sponsors: `/sitecore/content/[Site]/Data/Sponsors/`

### Experience Editor Behavior

- **Inline editable fields:** heading, subheading, body
- **Forms panel required:** startDate, endDate, eventTime, eventCost, location, profiles, sponsors, image
- **Image selection:** Click image area to open media browser
- **CTA editing:** Edit datasource item for link field

### Features

- **Add to Calendar:** Generates downloadable ICS file with event details
- **Social Share:** Built-in social sharing buttons (Twitter, Facebook, LinkedIn)
- **SEO Metadata:** Outputs Event structured data via EventMetadata component
- **Mobile Sticky CTA:** On mobile, CTA button becomes sticky at bottom when scrolling past header

## Common Mistakes to Avoid

1. **Missing heading:** The heading field is the H1 and critical for SEO. Never leave it empty.

2. **Invalid date formats:** Ensure dates are in ISO format for proper parsing and Add to Calendar functionality.

3. **Missing CTA link:** Without a link, the "Register Now" button won't appear. Set up datasource with link field.

4. **Empty profiles/speakers:** If profiles are selected but lack firstName/lastName, they won't display properly.

5. **Large images without optimization:** Use appropriately sized images (16:9 ratio, max 1920px wide) for performance.

6. **Body content without structure:** Use proper heading hierarchy (H2, H3) in body content for readability and SEO.

## Related Components

- `EventCard` - Compact card view linking to EventDetails page
- `EventListing` - Lists EventCard items
- `EventMetadata` - Child component for SEO structured data
- `EventBodySponsors` - Child component for sponsor display
- `SocialShare` - Child component for social sharing buttons
- `Button` - Child component for CTA button

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the EventDetails component using the Marketer MCP tools.

### Important: Route-Context + Datasource Component

The EventDetails component:
1. Reads most fields from the **Event Page** (route context)
2. Uses a **datasource** only for the CTA link field
3. Requires both page and component datasource to be fully populated

### Step 1: Find or Create Event Page

```javascript
// Search for existing event page
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Technology Summit"
});
const pageId = pageSearch.results[0].itemId;

// Or get by path
const page = await mcp__marketer__get_content_item_by_path({
  itemPath: "/sitecore/content/Site/Home/Events/technology-summit-2024"
});
```

### Step 2: Add EventDetails Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "event-details-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "EventDetails_Main",
  language: "en",
  fields: {}
});

const datasourceId = result.datasourceId;
```

### Step 3: Update Page-Level Fields

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,  // The page ID
  language: "en",
  fields: {
    "heading": "Annual Technology Innovation Summit 2024",
    "subheading": "<p>Join industry leaders for three days of innovation and networking.</p>",
    "startDate": "20240315T090000Z",
    "endDate": "20240317T170000Z",
    "eventTime": "9:00 AM - 5:00 PM EST",
    "eventCost": "$199 Early Bird",
    "body": "<h2>What You'll Learn</h2><p>Discover the latest trends in AI and cloud computing.</p>"
  }
});
```

### Step 4: Update Image Field on Page

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "image": "<image mediaid='{EVENT-IMAGE-GUID}' />"
  }
});
```

### Step 5: Set Location, Profiles, Sponsors References

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "location": "{LOCATION-ITEM-GUID}",
    "profiles": "{SPEAKER1-GUID}|{SPEAKER2-GUID}",
    "sponsors": "{SPONSOR1-GUID}|{SPONSOR2-GUID}"
  }
});
```

### Step 6: Update CTA Link on Datasource

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,  // The component datasource
  language: "en",
  fields: {
    "link": "<link linktype=\"internal\" text=\"Register Now\" url=\"/events/register\" target=\"\" />"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find the event page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Technology Summit 2024"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add EventDetails component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "event-details-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "EventDetails_Main",
  language: "en",
  fields: {}
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update page fields (event content)
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "heading": "Annual Technology Innovation Summit 2024",
    "subheading": "<p>Three days of innovation, networking, and hands-on workshops.</p>",
    "startDate": "20240315T090000Z",
    "endDate": "20240317T170000Z",
    "eventTime": "9:00 AM - 5:00 PM EST",
    "eventCost": "$199 Early Bird",
    "body": "<h2>Event Highlights</h2><p>Join us for keynotes, breakout sessions, and more.</p>"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Update image
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "image": "<image mediaid='{EVENT-HERO-IMAGE-GUID}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 5: Set references (location, speakers, sponsors)
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "location": "{CHICAGO-LOCATION-GUID}",
    "profiles": "{SPEAKER-JOHN-GUID}|{SPEAKER-JANE-GUID}",
    "sponsors": "{SPONSOR-ACME-GUID}"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 6: Set CTA link on datasource
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "link": "<link linktype=\"internal\" text=\"Register Now\" url=\"/events/summit-2024/register\" />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: EventDetails fully populated
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| heading | Single-Line Text | Page item | `"Plain text value"` |
| subheading | Rich Text | Page item | `"<p>HTML content</p>"` |
| startDate | Date | Page item | `"20240315T090000Z"` |
| endDate | Date | Page item | `"20240317T170000Z"` |
| eventTime | Single-Line Text | Page item | `"9:00 AM - 5:00 PM"` |
| eventCost | Single-Line Text | Page item | `"$199"` |
| body | Rich Text | Page item | `"<h2>Title</h2><p>Content</p>"` |
| image | Image | Page item | `<image mediaid='{GUID}' />` |
| location | Multilist | Page item | `"{GUID}"` |
| profiles | Multilist | Page item | `"{GUID1}\|{GUID2}"` |
| sponsors | Multilist | Page item | `"{GUID1}\|{GUID2}"` |
| link | General Link | Datasource | `<link linktype="internal" text="..." url="..." />` |

### MCP Authoring Checklist

Before authoring EventDetails via MCP, verify:

- [ ] Have Event Page ID (from `mcp__marketer__search_site`)
- [ ] Have EventDetails rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] heading field has content (required for H1)
- [ ] startDate is in correct format (`YYYYMMDDTHHMMSSZ`)
- [ ] Have media GUID for image field
- [ ] Have Location GUID for location field
- [ ] Have Profile GUIDs for speakers (if applicable)
- [ ] Have Sponsor GUIDs for sponsors (if applicable)
- [ ] Datasource link uses correct XML format

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `EventDetails_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| Date not displaying | Wrong date format | Use ISO format: `20240315T090000Z` |
| Image not showing | Wrong XML format | Verify: `<image mediaid='{GUID}' />` |
| Speakers not showing | Invalid profile GUIDs | Verify GUIDs from Profiles folder |
| CTA missing | Datasource link not set | Update datasource with link field |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-author-image` | Image field XML formatting details |
| `/sitecore-author-link` | Link field XML formatting details |
| `/sitecore-upload-media` | Upload images to Media Library first |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
