# SearchResults Component

## Purpose
Renders the site-wide global search results page, powered by Sitecore Search (Reflektion). It indexes all content types rather than a single template, making it suitable for a unified search results page. The component reads the initial search keyphrase from the URL hash (e.g. `#searchQuery=keyword`) so that search state survives client-side navigation and can be shared via URL. The component waits until the Next.js router is ready before rendering to avoid hydration mismatches. If no widget ID is configured the component shows `NoWidgetIdError` in Experience Editor.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `c63e40d8-c58e-452f-91b6-cb500d550cca` |
| **Component Name** | `SearchResults` |
| **Category** | `Search` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `widgetId` | Single-Line Text (`Field<string>`) | Yes | Sitecore Search widget ID (`rfkId`) | Must match a configured global search widget in the Sitecore Search portal |
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
| Default | `Default` | Global search results page across all content types |

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
| `widgetId` | `rfkid_global_search` |

### Full Content Example
| Field | Value |
|-------|-------|
| `widgetId` | `rfkid_global_search` |
| `PageSizeCount` | `10` |
| `facetsToExpand` | `4` |

## MCP Authoring Instructions
To add this component to a page:
1. Insert the `SearchResults` rendering onto a dedicated search results page (typically `/search`).
2. Set the **datasource** to an item with the fields above (typically under `/sitecore/content/{Site}/Data/Search`).
3. The **`widgetId`** field is mandatory — obtain the correct `rfkId` from the Sitecore Search portal for the Global Search widget.
4. This component indexes **all content types** — it is intended for a site-wide search results page, not a content-type-specific listing.
5. To pre-populate the search from a site search bar, pass the keyphrase in the URL hash: `#searchQuery=keyword`.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
