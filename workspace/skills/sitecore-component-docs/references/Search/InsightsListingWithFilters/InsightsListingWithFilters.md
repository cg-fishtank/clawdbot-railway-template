# InsightsListingWithFilters Component

## Purpose
Renders a filterable insights/thought-leadership article listing powered by Sitecore Search (Reflektion). The component is a specialisation of the generic `SearchListingWithFiltersWidget`, pre-configured with the `INSIGHTS_TEMPLATE_ID` and `ARTICLE_VARIANTS.INSIGHTS` so that only Insights content items are returned. The current page item ID is passed as a React key so that the widget resets correctly during client-side navigation. If no widget ID is configured the component shows `NoWidgetIdError` in Experience Editor.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `365cb673-473f-4638-a967-6f5fcd22a6b4` |
| **Component Name** | `InsightsListingWithFilters` |
| **Category** | `Search` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `widgetId` | Single-Line Text (`Field<string>`) | Yes | Sitecore Search widget ID (`rfkId`) | Must match a configured Insights widget in the Sitecore Search portal |
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
| Default | `Default` | Standard insights listing with filters, scoped to Insights template |

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
| `widgetId` | `rfkid_insights_listing` |

### Full Content Example
| Field | Value |
|-------|-------|
| `widgetId` | `rfkid_insights_listing` |
| `heading` | `Insights` |
| `tagsHeading` | `Filter by Topic` |
| `noResultsText` | `No insights found matching your criteria.` |
| `PageSizeCount` | `12` |
| `filterByKeyword` | _(Treelist: Tag items)_ |
| `tags` | _(Treelist: Category items)_ |

## MCP Authoring Instructions
To add this component to a page:
1. Insert the `InsightsListingWithFilters` rendering onto the page in the desired placeholder.
2. Set the **datasource** to an item with the fields above (typically under `/sitecore/content/{Site}/Data/Search`).
3. The **`widgetId`** field is mandatory — obtain the correct `rfkId` from the Sitecore Search portal for the Insights Listing widget.
4. The component automatically scopes results to the Insights template ID; no additional template configuration is required.
5. `filterByKeyword` and `tags` Treelist fields accept items from the site taxonomy to pre-apply filters on page load.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
