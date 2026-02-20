# ProductSearch Component

## Purpose
Renders a product catalogue search experience powered by Sitecore Search (Reflektion). On mount and on router change it reads an optional `searchQuery` URL query-string parameter to pre-populate the search keyphrase, enabling deep-linked product searches. All UI rendering is delegated to `ProductSearchWidget` from `src/widgets/SearchResults/ProductSearch`. If no widget ID is configured on the datasource the component shows `NoWidgetIdError` in Experience Editor.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `f34eb1c4-da48-48bc-95d5-383558dfa3bd` |
| **Component Name** | `ProductSearch` |
| **Category** | `Search` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `widgetId` | Single-Line Text (`Field<string>`) | Yes | Sitecore Search widget ID (`rfkId`) | Must match a configured widget in the Sitecore Search portal |
| `PageSizeCount` | Integer (`Field<number>`) | No | Number of results per page | Positive integer |
| `facetsToExpand` | Integer (`Field<number>`) | No | Number of facet groups expanded by default | Positive integer |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `widgetId` | `props.fields?.widgetId?.value` (raw string) | — |
| `PageSizeCount` | Passed as prop to widget | — |
| `facetsToExpand` | Passed as prop to widget | — |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard product catalogue search with URL keyphrase support |

## Props Interface
```typescript
// lib/types/components/Search/global-search.ts
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export type GlobalSearchFields = {
  PageSizeCount?: Field<number>;
  widgetId?: Field<string>;
  facetsToExpand?: Field<number>;
};

export type GlobalSearchProps = ComponentProps & {
  fields: GlobalSearchFields;
};
```

## Example Content Entry

### Minimum Viable Content
| Field | Value |
|-------|-------|
| `widgetId` | `rfkid_product_search` |

### Full Content Example
| Field | Value |
|-------|-------|
| `widgetId` | `rfkid_product_search` |
| `PageSizeCount` | `16` |
| `facetsToExpand` | `3` |

## MCP Authoring Instructions
To add this component to a page:
1. Insert the `ProductSearch` rendering onto the page in the desired placeholder.
2. Set the **datasource** to an item with the fields above (typically under `/sitecore/content/{Site}/Data/Search`).
3. The **`widgetId`** field is mandatory — obtain the correct `rfkId` from the Sitecore Search portal for the Product Search widget.
4. To deep-link with a pre-populated search keyphrase, append `?searchQuery=product+name` to the page URL.
5. `PageSizeCount` and `facetsToExpand` are optional; the widget's own defaults apply when omitted.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
