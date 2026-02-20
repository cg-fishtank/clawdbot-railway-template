# ArticleListingWithFilters Component

## Purpose
Renders a filterable article listing powered by Sitecore Search (Reflektion). It initialises a `WidgetsProvider` with the configured search environment credentials and delegates rendering to `ArticleListingWithFiltersWidget`, passing the datasource-configured widget ID (`rfkId`) and the current page item ID as a cache-busting key. If no widget ID is configured on the datasource the component surfaces a `NoWidgetIdError` message in Experience Editor and renders nothing in normal mode.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `a4eb594d-4284-40ce-8d5a-ade133fb3707` |
| **Component Name** | `ArticleListingWithFilters` |
| **Category** | `Search` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `widgetId` | Single-Line Text (`Field<string>`) | Yes | Sitecore Search (Reflektion) widget ID (`rfkId`) that drives which search index and configuration to use | Must match a configured widget in the Sitecore Search portal |
| `heading` | Single-Line Text (`Field<string>`) | No | Optional heading rendered above the widget | — |
| `tagsHeading` | Single-Line Text (`Field<string>`) | No | Label displayed above the tag filter group | — |
| `noResultsText` | Single-Line Text (`Field<string>`) | No | Message shown when the search returns zero results | — |
| `PageSizeCount` | Integer (`Field<number>`) | No | Number of results per page; falls back to widget default if omitted | Positive integer |
| `filterByKeyword` | Treelist (`TagType[]`) | No | Pre-selected keyword filter items from Sitecore content tree | Treelist of Tag items |
| `tags` | Treelist (`TagType[] \| CategoryType[]`) | No | Pre-selected tag or category filter items | Treelist of Tag/Category items |

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
| Default | `Default` | Standard article listing with filters |

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
| `widgetId` | `rfkid_articles_listing` |

### Full Content Example
| Field | Value |
|-------|-------|
| `widgetId` | `rfkid_articles_listing` |
| `heading` | `Latest Articles` |
| `tagsHeading` | `Filter by Tag` |
| `noResultsText` | `No articles found matching your criteria.` |
| `PageSizeCount` | `12` |
| `filterByKeyword` | _(Treelist: one or more Tag items)_ |
| `tags` | _(Treelist: one or more Tag/Category items)_ |

## MCP Authoring Instructions
To add this component to a page:
1. Insert the `ArticleListingWithFilters` rendering onto the page in the desired placeholder.
2. Set the **datasource** to an item that has the fields listed above (typically under `/sitecore/content/{Site}/Data/Search`).
3. The **`widgetId`** field is mandatory — obtain the correct `rfkId` value from the Sitecore Search portal for the Article Listing widget.
4. All other fields are optional enhancements; leave blank to use the widget's own defaults.
5. `filterByKeyword` and `tags` Treelist fields accept items from the site tag/category taxonomy; select items to pre-apply filters on page load.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
