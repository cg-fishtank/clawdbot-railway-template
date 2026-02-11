# WhereToBuy Component

## Purpose

The WhereToBuy component is a fully-featured store/dealer locator that displays business locations on an interactive Google Map with a searchable, filterable list view. It supports geolocation ("Use My Location"), address-based location search, keyword filtering, marker clustering for nearby locations, and pagination. The component automatically fetches BusinessProfile content items via GraphQL and displays them with contact details, hours, services, and directions links. It's designed for "Where to Buy", "Find a Dealer", or "Store Locator" pages.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Where To Buy/Where To Buy`
- **Template Name:** `Where To Buy`

### Related Templates

#### Business Profile Template

The component fetches and displays BusinessProfile items, which should be created under the site's Settings folder.

- **Template Path:** `/sitecore/templates/Project/[Site]/Business Profile`
- **Content Location:** `/sitecore/content/[Site]/Settings/Component Settings/Business Profiles/`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Main heading displayed above the store locator | Recommended max 60 characters |
| subheading | Rich Text | No | Supporting description text | Supports basic formatting |
| defaultMapCenterLatitude | Number | Yes | Latitude for initial map center | Valid latitude: -90 to 90 |
| defaultMapCenterLongitude | Number | Yes | Longitude for initial map center | Valid longitude: -180 to 180 |
| defaultMapZoomLevel | Number | Yes | Initial map zoom level | Typically 4-18 (4=continent, 18=street) |
| userLocationZoomLevel | Number | Yes | Zoom level when user location is active | Typically 8-12 |
| businessLocationZoomLevel | Number | Yes | Zoom level when clicking a specific location | Typically 14-16 |
| userLocationSearchRadius | Number | No | Search radius in kilometers | Positive number |
| locationsPerPage | Number | Yes | Number of locations shown before "Load More" | Recommended 5-20 |
| userLocationIndicatorColor | Single-Line Text | Yes | Hex color for user location marker | Hex format (e.g., #3b82f6 or 3b82f6) |
| individualLocationMarkerColor | Single-Line Text | Yes | Hex color for business location markers | Hex format (e.g., #000000) |
| clusterLocationMarkerBackgroundColor | Single-Line Text | Yes | Background color for cluster markers | Hex format (e.g., #ffffff) |
| clusterLocationMarkerTextAndBorderColor | Single-Line Text | Yes | Text and border color for cluster markers | Hex format (e.g., #000000) |

## Field Details

### heading

- **Type:** Single-Line Text
- **Required:** Yes
- **Constraints:** Max 60 characters recommended
- **Guidance:** Clear, descriptive title for the store locator section
- **Example:** `"Find a Dealer Near You"`

### subheading

- **Type:** Rich Text
- **Required:** No
- **Guidance:** Brief supporting description; keep formatting simple
- **Example:** `"<p>Locate authorized dealers and service centers in your area.</p>"`

### defaultMapCenterLatitude / defaultMapCenterLongitude

- **Type:** Number
- **Required:** Yes
- **Constraints:** Valid geographic coordinates
- **Guidance:** Set to the center of your primary market area
- **Example (US center):**
  - Latitude: `39.8283`
  - Longitude: `-98.5795`
- **Example (Europe center):**
  - Latitude: `50.0`
  - Longitude: `10.0`

### defaultMapZoomLevel

- **Type:** Number
- **Required:** Yes
- **Constraints:** 1-20 (Google Maps zoom levels)
- **Guidance:** Lower = wider view, higher = closer view
- **Example values:**
  - `4` - Continent view
  - `6` - Country view
  - `10` - Metro area view
  - `14` - Neighborhood view

### userLocationZoomLevel

- **Type:** Number
- **Required:** Yes
- **Constraints:** Typically 8-14
- **Guidance:** Zoom level when user activates "Use My Location"
- **Example:** `10`

### businessLocationZoomLevel

- **Type:** Number
- **Required:** Yes
- **Constraints:** Typically 14-18
- **Guidance:** Zoom level when user clicks a specific business in the list
- **Example:** `15`

### locationsPerPage

- **Type:** Number
- **Required:** Yes
- **Constraints:** Positive integer, typically 5-20
- **Guidance:** Number of locations to display initially; more are loaded via "Load More" button
- **Example:** `10`

### Color Fields (userLocationIndicatorColor, individualLocationMarkerColor, etc.)

- **Type:** Single-Line Text
- **Required:** Yes
- **Format:** Hex color with or without `#` prefix
- **Example values:**
  - `#3b82f6` (blue)
  - `#000000` (black)
  - `ffffff` (white - # is optional)

## Component Variants

The WhereToBuy component exports 2 rendering variants:

| Variant | Export Name | Map Visible | Use Case |
|---------|-------------|-------------|----------|
| Default | `Default` | Yes | Full store locator with interactive map |
| HideMap | `HideMap` | No | List-only view for mobile optimization or simpler layouts |

### Default Variant

- Shows Google Map on the right (desktop) with location list on left
- On mobile, map appears below the list controls
- Includes all geolocation and clustering features

### HideMap Variant

- Shows only the location list without the Google Map
- Useful for pages where map is not needed
- Still supports keyword search and pagination
- "Get Directions" links open Google Maps in new tab

## Component Props Interface

```typescript
type WhereToBuyFields = {
  heading: Field<string>;
  subheading: RichTextField;
  defaultMapCenterLatitude: Field<number>;
  defaultMapCenterLongitude: Field<number>;
  defaultMapZoomLevel: Field<number>;
  userLocationZoomLevel: Field<number>;
  businessLocationZoomLevel: Field<number>;
  userLocationSearchRadius: Field<number>;
  locationsPerPage: Field<number>;
  userLocationIndicatorColor: Field<string>;
  individualLocationMarkerColor: Field<string>;
  clusterLocationMarkerBackgroundColor: Field<string>;
  clusterLocationMarkerTextAndBorderColor: Field<string>;
};

type WhereToBuyProps = ComponentProps & {
  rendering: ComponentRendering & {
    data: LocationData[];  // Populated via getStaticProps/getServerSideProps
  };
  fields: WhereToBuyFields;
  isMapHidden?: boolean;  // Set by variant
};

type LocationData = {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  website: string;
  lat: number;
  lng: number;
  services: string[];
};
```

## JSS Field Mapping

| Sitecore Field | JSS Component | Usage |
|----------------|---------------|-------|
| heading | `<Text field={fields.heading} tag="h2" />` | Block, H2 heading |
| subheading | `<RichText field={fields.subheading} className="richtext" />` | Block, rich text |
| defaultMapCenterLatitude | `fields.defaultMapCenterLatitude?.value` | JavaScript value |
| defaultMapCenterLongitude | `fields.defaultMapCenterLongitude?.value` | JavaScript value |
| defaultMapZoomLevel | `fields.defaultMapZoomLevel?.value` | JavaScript value |
| locationsPerPage | `fields.locationsPerPage?.value` | JavaScript value |
| *Color fields* | `fields.[fieldName]?.value` | Marker styling |

## Business Profile Fields

Each BusinessProfile item displayed in the locator has these fields:

| Field | Sitecore Type | Description |
|-------|---------------|-------------|
| contentName | Single-Line Text | Business/location name (uses item name if not set) |
| address | Multi-Line Text | Full street address |
| phone | Single-Line Text | Contact phone number |
| email | Single-Line Text | Contact email address |
| hours | Multi-Line Text | Operating hours (newlines become `<br>`) |
| lat | Number | Latitude coordinate |
| long | Number | Longitude coordinate |
| website | General Link | Website URL for the location |
| services | Multilist | Services offered (displays as badges) |

## GraphQL Query

The component fetches BusinessProfile items using this GraphQL query:

```graphql
query GetBusinessProfiles(
  $pageID: String!
  $language: String!
  $endCursor: String
  $first: Int = 5
  $templateId: String!
) {
  search(
    where: {
      AND: [
        { name: "_templates", value: $templateId, operator: CONTAINS }
        { name: "_path", value: $pageID, operator: CONTAINS }
        { name: "_language", value: $language, operator: EQ }
      ]
    }
    first: $first
    after: $endCursor
  ) {
    total
    pageInfo { endCursor hasNext }
    results {
      id
      contentName { value }
      address { value }
      email { value }
      phone { value }
      hours { value }
      lat { value }
      long { value }
      website { jsonValue }
      services { jsonValue }
    }
  }
}
```

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** Clear title for the store locator
- **Tone/Style:** Action-oriented or descriptive
- **Examples:** "Find a Dealer", "Store Locator", "Where to Buy", "Locate a Service Center"

#### subheading

- **What to enter:** Brief supporting context
- **Formatting:** Keep it simple - avoid complex HTML
- **Example:** `"<p>Find authorized dealers, service centers, and retailers near you.</p>"`

#### Map Configuration Fields

| Field | Recommended Value | Notes |
|-------|-------------------|-------|
| defaultMapCenterLatitude | Regional center | US: 39.8, EU: 50.0, UK: 54.0 |
| defaultMapCenterLongitude | Regional center | US: -98.5, EU: 10.0, UK: -2.0 |
| defaultMapZoomLevel | 4-6 | Wide initial view |
| userLocationZoomLevel | 10 | Metro area after geolocation |
| businessLocationZoomLevel | 15 | Street level for clicked location |
| locationsPerPage | 10 | Balance between info density and performance |

#### Color Configuration

| Field | Recommended | Purpose |
|-------|-------------|---------|
| userLocationIndicatorColor | `#3b82f6` (blue) | User's current location dot |
| individualLocationMarkerColor | `#000000` (black) | Individual business markers |
| clusterLocationMarkerBackgroundColor | `#ffffff` (white) | Cluster marker background |
| clusterLocationMarkerTextAndBorderColor | `#000000` (black) | Cluster marker text/border |

### Creating Business Profiles

Business profiles must be created under the site's content tree:

1. Navigate to `/sitecore/content/[Site]/Settings/Component Settings/Business Profiles/`
2. Create new items using the Business Profile template
3. Fill in all required fields:
   - **Name:** Business/store name
   - **Address:** Full street address
   - **Phone:** Contact number
   - **Email:** Contact email
   - **Hours:** Operating hours (one line per day)
   - **Latitude/Longitude:** GPS coordinates (use Google Maps to find)
   - **Website:** Link to location-specific page
   - **Services:** Select applicable services from the list

### Finding GPS Coordinates

1. Go to Google Maps
2. Search for the business address
3. Right-click on the location
4. Select "What's here?" or click the coordinates
5. Copy the latitude and longitude values

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Find a Dealer" },
    "defaultMapCenterLatitude": { "value": 39.8283 },
    "defaultMapCenterLongitude": { "value": -98.5795 },
    "defaultMapZoomLevel": { "value": 4 },
    "userLocationZoomLevel": { "value": 10 },
    "businessLocationZoomLevel": { "value": 15 },
    "locationsPerPage": { "value": 10 },
    "userLocationIndicatorColor": { "value": "#3b82f6" },
    "individualLocationMarkerColor": { "value": "#000000" },
    "clusterLocationMarkerBackgroundColor": { "value": "#ffffff" },
    "clusterLocationMarkerTextAndBorderColor": { "value": "#000000" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Find a Dealer Near You" },
    "subheading": {
      "value": "<p>Locate authorized dealers and service centers in your area. Use the search box to filter by name or address, or use your current location to find nearby options.</p>"
    },
    "defaultMapCenterLatitude": { "value": 39.8283 },
    "defaultMapCenterLongitude": { "value": -98.5795 },
    "defaultMapZoomLevel": { "value": 5 },
    "userLocationZoomLevel": { "value": 10 },
    "businessLocationZoomLevel": { "value": 15 },
    "userLocationSearchRadius": { "value": 50 },
    "locationsPerPage": { "value": 10 },
    "userLocationIndicatorColor": { "value": "#3b82f6" },
    "individualLocationMarkerColor": { "value": "#1f2937" },
    "clusterLocationMarkerBackgroundColor": { "value": "#ffffff" },
    "clusterLocationMarkerTextAndBorderColor": { "value": "#1f2937" }
  }
}
```

### Business Profile Example

```json
{
  "fields": {
    "contentName": { "value": "ABC Equipment - Chicago" },
    "address": { "value": "123 Main Street\nChicago, IL 60601" },
    "phone": { "value": "(312) 555-0123" },
    "email": { "value": "chicago@abcequipment.com" },
    "hours": { "value": "Monday-Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Closed" },
    "lat": { "value": 41.8781 },
    "long": { "value": -87.6298 },
    "website": {
      "value": {
        "href": "https://abcequipment.com/locations/chicago",
        "text": "View Location",
        "target": "_blank"
      }
    },
    "services": [
      { "displayName": "Sales" },
      { "displayName": "Service" },
      { "displayName": "Parts" }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Paths

- WhereToBuy datasource: `/sitecore/content/[Site]/Home/Data/Where To Buy/`
- Business Profiles: `/sitecore/content/[Site]/Settings/Component Settings/Business Profiles/`

### Experience Editor Behavior

- **Inline editable fields:** heading, subheading
- **Forms panel required:** All numeric and color fields
- **Map preview:** Map displays in Experience Editor but may have limited functionality
- **Empty state:** Shows warning message if no Business Profiles are found

### Environment Configuration

**Required:** Google Maps API Key must be configured:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key-here
```

The API key must have the following APIs enabled:
- Maps JavaScript API
- Places API
- Geometry library

## Common Mistakes to Avoid

1. **Missing Google Maps API Key:** Component will not display the map without a valid API key in environment variables.

2. **Invalid coordinates:** Ensure lat/long values are valid (-90 to 90 for latitude, -180 to 180 for longitude). Invalid values will cause map errors.

3. **Missing Business Profiles:** If no BusinessProfile items exist, the component shows an empty list. Create profiles under Settings/Component Settings/Business Profiles/.

4. **Wrong coordinate precision:** Use at least 4 decimal places for accurate marker placement (e.g., 41.8781, not 41.87).

5. **Hex color format inconsistency:** The component normalizes colors but for consistency, always use `#RRGGBB` format (e.g., `#3b82f6`).

6. **Zoom levels too high:** Zoom level 18+ can show empty tiles in rural areas. Use 14-16 for business-level zoom.

7. **locationsPerPage too low:** Setting to 1-2 creates excessive pagination. Recommend 5-10 minimum.

8. **Missing required fields on Business Profile:** Items missing lat/long will display at coordinates 0,0 (in the ocean). Always verify coordinate data.

## Related Components

- `ContentBlock` - For simpler informational content without map functionality
- `CardGrid` - Alternative for displaying locations as cards without interactive map

## Accessibility

- Search inputs have proper labels and placeholders
- Map markers have title attributes for screen readers
- Keyboard navigation supported for list items
- Status messages announced for geolocation actions
- Mobile-specific controls ensure touch accessibility

## Features Summary

| Feature | Description |
|---------|-------------|
| Google Maps Integration | Interactive map with custom markers |
| Keyword Search | Filter locations by name or address |
| Geolocation | "Use My Location" with browser geolocation |
| Address Search | Search by city, address, or postal code |
| Marker Clustering | Groups nearby locations at lower zoom levels |
| Distance Sorting | Sorts by distance when user location is active |
| Pagination | "Load More" button for large location lists |
| Mobile Responsive | Separate mobile-optimized controls |
| Expandable Content | "Read More/Less" for long location details |
| Get Directions | Direct link to Google Maps directions |

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the WhereToBuy component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the WhereToBuy rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)
4. Ensure BusinessProfile items exist under Settings/Component Settings/Business Profiles/

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Where To Buy"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add WhereToBuy Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "wheretobuy-rendering-id",  // Or wheretobuy-hidemap for list-only
  placeholderPath: "headless-main",
  componentItemName: "WhereToBuy_1",
  language: "en",
  fields: {
    "heading": "Find a Dealer Near You",
    "subheading": "<p>Locate authorized dealers and service centers in your area.</p>",
    "defaultMapCenterLatitude": "39.8283",
    "defaultMapCenterLongitude": "-98.5795",
    "defaultMapZoomLevel": "5",
    "userLocationZoomLevel": "10",
    "businessLocationZoomLevel": "15",
    "locationsPerPage": "10",
    "userLocationIndicatorColor": "#3b82f6",
    "individualLocationMarkerColor": "#000000",
    "clusterLocationMarkerBackgroundColor": "#ffffff",
    "clusterLocationMarkerTextAndBorderColor": "#000000"
  }
});

const datasourceId = result.datasourceId;
```

### Step 3: Update Fields (if needed)

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "heading": "Updated Dealer Locator",
    "locationsPerPage": "15"
  }
});
```

### Creating Business Profile Items

Business profiles are separate content items that the WhereToBuy component fetches automatically:

```javascript
// 1. Find Business Profiles folder
const folderSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Business Profiles"
});
const businessProfilesFolderId = folderSearch.results[0].itemId;

// 2. Create a Business Profile item
await mcp__marketer__create_content_item({
  siteName: "main",
  parentId: businessProfilesFolderId,
  itemName: "ABC-Equipment-Chicago",
  templateId: "business-profile-template-id",
  language: "en",
  fields: {
    "contentName": "ABC Equipment - Chicago",
    "address": "123 Main Street\nChicago, IL 60601",
    "phone": "(312) 555-0123",
    "email": "chicago@abcequipment.com",
    "hours": "Monday-Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM",
    "lat": "41.8781",
    "long": "-87.6298"
  }
});
```

### Variant Selection

| Variant | Rendering Name | Use Case |
|---------|----------------|----------|
| Default | `WhereToBuy` | Full map + list locator |
| HideMap | `WhereToBuy-HideMap` | List-only view |

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| subheading | Rich Text | `"<p>HTML content</p>"` |
| defaultMapCenterLatitude | Number | `"39.8283"` (string) |
| defaultMapCenterLongitude | Number | `"-98.5795"` (string) |
| defaultMapZoomLevel | Number | `"5"` (string) |
| userLocationZoomLevel | Number | `"10"` (string) |
| businessLocationZoomLevel | Number | `"15"` (string) |
| locationsPerPage | Number | `"10"` (string) |
| *Color fields | Single-Line Text | `"#3b82f6"` |

### MCP Authoring Checklist

Before authoring WhereToBuy via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have WhereToBuy rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `WhereToBuy_1`)
- [ ] All required number fields have values (coordinates, zoom levels)
- [ ] Color fields use hex format (e.g., `#3b82f6`)
- [ ] BusinessProfile items exist for the map to display locations

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `WhereToBuy_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| Map shows no locations | No BusinessProfile items | Create Business Profile content items |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |
| "Cannot find field" | Wrong field name | Field names are case-sensitive |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-pagebuilder` | Page creation and component placement |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
