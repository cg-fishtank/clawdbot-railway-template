# KnowledgeCenterSearch Component

## Purpose
Renders a full-featured Knowledge Center search experience powered by Sitecore Search (Reflektion). On mount it reads an optional `searchQuery` URL query-string parameter to pre-populate the search keyphrase, enabling deep-linking into filtered search states. It delegates all UI rendering to `KnowledgeCenterSearchWidget` from the `src/widgets` layer. If no widget ID is configured on the datasource the component shows `NoWidgetIdError` in Experience Editor.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `[VERIFY: Rendering ID not found in Sitecore]` |
| **Component Name** | `KnowledgeCenterSearch` |
| **Category** | `Search` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `widgetId` | Single-Line Text (`Field<string>`) | Yes | Sitecore Search widget ID (`rfkId`) | Must match a configured widget in the Sitecore Search portal |
| `PageSizeCount` | Integer (`Field<number>`) | No | Number of results per page | Positive integer |
| `facetsToExpand` | Integer (`Field<number>`) | No | Number of facet groups to display expanded by default | Positive integer |

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
| Default | `Default` | Standard Knowledge Center search with keyphrase URL parameter support |

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
| `widgetId` | `rfkid_knowledge_center` |

### Full Content Example
| Field | Value |
|-------|-------|
| `widgetId` | `rfkid_knowledge_center` |
| `PageSizeCount` | `10` |
| `facetsToExpand` | `3` |

## MCP Authoring Instructions
To add this component to a page:
1. Insert the `KnowledgeCenterSearch` rendering onto the page in the desired placeholder.
2. Set the **datasource** to an item with the fields above (typically under `/sitecore/content/{Site}/Data/Search`).
3. The **`widgetId`** field is mandatory — obtain the correct `rfkId` from the Sitecore Search portal for the Knowledge Center Search widget.
4. **Note:** The Rendering ID for this component was not found in Sitecore at the time of documentation — verify before publishing to production.
5. To deep-link with a pre-populated search query, append `?searchQuery=your+terms` to the page URL.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
