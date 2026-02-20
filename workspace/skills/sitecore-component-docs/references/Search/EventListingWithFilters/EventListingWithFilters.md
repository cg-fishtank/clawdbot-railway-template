# EventListingWithFilters Component

## Purpose
Renders a filterable event listing powered by Sitecore Search (Reflektion), with additional support for date-range filtering and a past/upcoming events toggle. Filter state is persisted in the URL hash (e.g. `#pastEvents=true&dateRange=2026-01-01|2026-03-31`) so users can share or bookmark filtered views. A new `WidgetsProvider` is keyed on the current filter state so the widget remounts cleanly when filters change. If no widget ID is configured the component shows `NoWidgetIdError` in Experience Editor.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `d8158778-d624-40e3-9ff1-c5bffe97b195` |
| **Component Name** | `EventListingWithFilters` |
| **Category** | `Search` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `widgetId` | Single-Line Text (`Field<string>`) | Yes | Sitecore Search widget ID (`rfkId`) | Must match a configured widget in the Sitecore Search portal |
| `heading` | Single-Line Text (`Field<string>`) | No | Optional heading rendered above the widget | — |
| `tagsHeading` | Single-Line Text (`Field<string>`) | No | Label displayed above the tag filter group | — |
| `noResultsText` | Single-Line Text (`Field<string>`) | No | Message shown when search returns zero results | — |
| `PageSizeCount` | Integer (`Field<number>`) | No | Number of results per page | Positive integer |
| `filterByKeyword` | Treelist (`TagType[]`) | No | Pre-selected keyword filter items | Treelist of Tag items |
| `tags` | Treelist (`TagType[] \| CategoryType[]`) | No | Pre-selected tag/category filter items | Treelist of Tag/Category items |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `widgetId` | `props.fields?.widgetId?.value` (raw string) | — |
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `noResultsText` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard event listing with date-range and past/upcoming filters |

## Props Interface
```typescript
// lib/types/components/Search/search-listing-filters.ts
import { Field } from '@sitecore-content-sdk/nextjs';
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

## Example Content Entry

### Minimum Viable Content
| Field | Value |
|-------|-------|
| `widgetId` | `rfkid_events_listing` |

### Full Content Example
| Field | Value |
|-------|-------|
| `widgetId` | `rfkid_events_listing` |
| `heading` | `Upcoming Events` |
| `tagsHeading` | `Filter by Topic` |
| `noResultsText` | `No events found for the selected dates.` |
| `PageSizeCount` | `9` |
| `filterByKeyword` | _(Treelist: Tag items)_ |
| `tags` | _(Treelist: Category items)_ |

## MCP Authoring Instructions
To add this component to a page:
1. Insert the `EventListingWithFilters` rendering onto the page in the desired placeholder.
2. Set the **datasource** to an item with the fields above (typically under `/sitecore/content/{Site}/Data/Search`).
3. The **`widgetId`** field is mandatory — obtain the correct `rfkId` from the Sitecore Search portal for the Event Listing widget.
4. The date-range filter and past/upcoming toggle are UI controls managed in the URL hash; no additional Sitecore fields are needed to enable them.
5. `filterByKeyword` and `tags` accept Treelist items from the site taxonomy to pre-apply filters on page load.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
