# WhereToBuy Component

## Purpose
A full-featured interactive store locator powered by the Google Maps JavaScript API. It displays a searchable list of business profile locations alongside an interactive map with numbered markers, dynamic clustering for nearby locations, info windows, and geolocation support ("Use My Location"). Business profile data (name, address, phone, email, hours, website, coordinates, and services) is fetched server-side via a GraphQL query (`GetBusinessProfiles`) using `getComponentServerProps` and injected as `rendering.data`. The `HideMap` variant shows only the searchable list without the map panel, useful for mobile-first or space-constrained layouts.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `7c191fdd-39d0-4327-b1af-8546048b5062` |
| **Component Name** | `WhereToBuy` |
| **Category** | `WhereToBuy` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Main heading displayed above the store locator interface | — |
| `subheading` | Rich Text (`RichTextField`) | No | Optional subheading / introductory paragraph below the heading | Rich text supported |
| `defaultMapCenterLatitude` | Number (`Field<number>`) | Yes | Default map centre latitude when no location search is active | Valid latitude: -90 to 90 |
| `defaultMapCenterLongitude` | Number (`Field<number>`) | Yes | Default map centre longitude | Valid longitude: -180 to 180 |
| `defaultMapZoomLevel` | Number (`Field<number>`) | Yes | Google Maps zoom level shown on initial page load | 1–20 (typically 6–10 for country/region) |
| `userLocationZoomLevel` | Number (`Field<number>`) | Yes | Zoom level applied when the user activates "Use My Location" | 1–20 (typically 10–13) |
| `businessLocationZoomLevel` | Number (`Field<number>`) | Yes | Zoom level applied when a specific location is selected | 1–20 (typically 14–16) |
| `userLocationSearchRadius` | Number (`Field<number>`) | No | Search radius in km used to rank locations near the user | Positive number; defaults to component constant |
| `locationsPerPage` | Number (`Field<number>`) | Yes | Number of locations shown in the list before the "Load more" button | Positive integer (e.g. 10) |
| `userLocationIndicatorColor` | Single-Line Text (`Field<string>`) | Yes | Hex colour for the user's location marker and pulse circle | Valid hex code (with or without `#`) |
| `individualLocationMarkerColor` | Single-Line Text (`Field<string>`) | Yes | Hex colour for numbered individual location markers on the map | Valid hex code |
| `clusterLocationMarkerBackgroundColor` | Single-Line Text (`Field<string>`) | Yes | Background hex colour for cluster (multi-location) markers | Valid hex code |
| `clusterLocationMarkerTextAndBorderColor` | Single-Line Text (`Field<string>`) | Yes | Text and border hex colour for cluster markers | Valid hex code |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `subheading` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| Numeric fields | `field?.value` (raw number) | Used directly in Google Maps API calls |
| Color fields | `field?.value` (raw string) | Normalised with internal `normalizeHexColor()` helper |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default (with map) | `Default` | Full store locator with split list + map panel |
| Hide Map (list only) | `HideMap` | List-only view without Google Maps panel — useful for locations without map embeds |

## Props Interface
```typescript
// lib/types/components/WhereToBuy/index.ts
import { Field, RichTextField, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export type WhereToBuyFields = {
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

export type WhereToBuyProps = ComponentProps &
  WhereToBuyRenderingType & {
    fields: WhereToBuyFields;
    isMapHidden?: boolean;  // injected by variant — not a Sitecore field
  };
```

## Server-Side Data Fetching
The component exports `getComponentServerProps` which is invoked at request time (SSR). It:
1. Resolves the current site name and content language from `layoutData`.
2. Fetches the site root's content root ID.
3. Queries Sitecore GraphQL for all Business Profile items (`BUSINESS_PROFILE_TEMPLATE_ID`) under the content root.
4. Returns `rendering.data` as an array of `LocationData` objects (name, address, phone, email, hours, website, lat, lng, services).

Business Profiles must be created as content items under `Settings/Component Settings/Business Profiles` in the site content tree.

## Example Content Entry

### Minimum Viable Content
| Field | Value |
|-------|-------|
| `heading` | `Find a Location` |
| `defaultMapCenterLatitude` | `37.0902` |
| `defaultMapCenterLongitude` | `-95.7129` |
| `defaultMapZoomLevel` | `5` |
| `userLocationZoomLevel` | `12` |
| `businessLocationZoomLevel` | `15` |
| `locationsPerPage` | `10` |
| `userLocationIndicatorColor` | `#3b82f6` |
| `individualLocationMarkerColor` | `#1e3a5f` |
| `clusterLocationMarkerBackgroundColor` | `#ffffff` |
| `clusterLocationMarkerTextAndBorderColor` | `#1e3a5f` |

### Full Content Example
| Field | Value |
|-------|-------|
| `heading` | `Where to Buy` |
| `subheading` | `<p>Find your nearest authorised dealer using the map below.</p>` |
| `defaultMapCenterLatitude` | `37.0902` |
| `defaultMapCenterLongitude` | `-95.7129` |
| `defaultMapZoomLevel` | `5` |
| `userLocationZoomLevel` | `12` |
| `businessLocationZoomLevel` | `15` |
| `userLocationSearchRadius` | `50` |
| `locationsPerPage` | `10` |
| `userLocationIndicatorColor` | `#3b82f6` |
| `individualLocationMarkerColor` | `#1e3a5f` |
| `clusterLocationMarkerBackgroundColor` | `#ffffff` |
| `clusterLocationMarkerTextAndBorderColor` | `#1e3a5f` |

## MCP Authoring Instructions
To add this component to a page:
1. Insert the `WhereToBuy` rendering (variant `Default`) or `WhereToBuy` (variant `HideMap`) onto the page.
2. Set the **datasource** to an item that contains all the required fields listed above.
3. All fields marked **Required** must be populated; the map will not initialise correctly without valid coordinates and zoom levels.
4. Colour fields accept hex codes with or without a leading `#` character.
5. Ensure the environment variable `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in the deployment environment — the map will fail to load without it.
6. Business profile location data is **not** authored on the rendering datasource. Create Business Profile items under `Settings/Component Settings/Business Profiles` in the Sitecore content tree. The component fetches them automatically at request time.
7. In Experience Editor, if no Business Profile items exist an orange warning panel is shown explaining where to create them.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
