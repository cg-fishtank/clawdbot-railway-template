# SimplePageListing Component

## Purpose
SimplePageListing renders a paginated list of child pages filtered to the Landing Page template, presented as clickable cards. Data is fetched server-side via `getComponentServerProps`, which calls `getPageListingWithDetails` with a configurable starting page (either from the `selectedPage` droptree field or the current page item), retrieving up to 10 items per request. The child `component-children/Page Content/SimplePageListing/SimplePageListing.tsx` handles client-side pagination at 8 cards per page (via `getValidPageSize`), optional tag-based filtering via the `useContextPageTags` context, and no-results messaging.

Each item is rendered by `SimplePageListingCard.tsx`, which displays the page category, heading (with title fallback to item name), subheading, and last-updated date. Cards link directly to the page URL, with click interaction disabled in Experience Editor mode via `EditModeClickDisabler`.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `9bc49a3b-23fb-49d9-811f-0b949f04c1a0` |
| **Component Name** | `SimplePageListing` |
| **Category** | `Page Content` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Section heading displayed above the listing grid as `<h2>` |
| `selectedPage` | Droptree (`SelectedPage`) | No | Root page item whose children are listed; defaults to the current page item if not set |
| `filterByTags` | Checkbox (`Field<boolean>`) | No | When `true`, filters listed pages by tags active in the `useContextPageTags` context |
| `tagsHeading` | Single-Line Text (`Field<string>`) | No | Label displayed before active tag names when filtering is active; defaults to `"Filtering by tags:"` |
| `noResultsText` | Single-Line Text (`Field<string>`) | No | Message displayed when tag filtering yields zero results; falls back to `"No results"` translation |
| `PageSizeCount` | Integer (`Field<number>`) | No | Overrides the default page size (8 items per page) |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text tag="h2">` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `tagsHeading` | `<Text tag="span">` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `noResultsText` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Paginated card list of child Landing Pages with optional tag filtering |

## Props Interface
```typescript
// SimplePageListingProps from lib/types/components/Page Content/simple-page-listing
interface SimplePageListingProps extends ComponentProps {
  fields: {
    heading: Field<string>;
    selectedPage?: SelectedPage;   // Droptree — { id: string, name: string, url: string }
    filterByTags?: Field<boolean>;
    tagsHeading?: Field<string>;
    noResultsText?: Field<string>;
    PageSizeCount?: Field<number>;
  };
}

type SelectedPage = {
  id: string;
  name: string;
  url: string;
};
```

## Server-Side Data Loading
`getComponentServerProps` fetches child page data at request time:

```typescript
export const getComponentServerProps: GetComponentServerProps = async (
  rendering, layoutData
) => {
  const pageID = rendering.fields?.selectedPage?.id ?? layoutData?.sitecore?.route?.itemId ?? '';
  const pageListingData = await getPageListingWithDetails(
    pageID, language, LANDING_PAGE_TEMPLATE_ID, undefined, 10
  );
  return {
    rendering: { ...rendering, data: pageListingData.results },
    route: layoutData?.sitecore?.route,
  };
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "Latest Articles" }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "heading": { "value": "Latest Articles" },
    "selectedPage": {
      "id": "{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}",
      "name": "Articles",
      "url": "/articles"
    },
    "filterByTags": { "value": true },
    "tagsHeading": { "value": "Showing articles tagged:" },
    "noResultsText": { "value": "No articles match the selected tags. Showing all articles." },
    "PageSizeCount": { "value": 6 }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer-mcp__add_component_on_page({
  itemId: "<page-item-id>",
  renderingId: "9bc49a3b-23fb-49d9-811f-0b949f04c1a0",
  placeholderName: "<target-placeholder>",
  datasource: "<simplelisting-datasource-item-id>"
});
```

### Step 2: Set Fields
```javascript
await mcp__marketer-mcp__edit_item_fields({
  itemId: "<simplelisting-datasource-item-id>",
  fields: {
    "heading": "Latest Articles",
    "filterByTags": "1",
    "tagsHeading": "Showing articles tagged:",
    "noResultsText": "No matching articles found."
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | Plain string |
| `selectedPage` | Droptree | Item ID GUID string |
| `filterByTags` | Checkbox | `"1"` (checked) or `"0"` (unchecked) |
| `tagsHeading` | Single-Line Text | Plain string |
| `noResultsText` | Single-Line Text | Plain string |
| `PageSizeCount` | Integer | Numeric string e.g. `"8"` |

> **Note:** The listing is filtered to items matching the `LANDING_PAGE_TEMPLATE_ID` constant. Only Landing Page template items appear as cards regardless of the selected root page. Default page size is 8 items; pagination controls appear when there are more items than the page size.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
