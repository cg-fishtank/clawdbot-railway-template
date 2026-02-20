# ArticleListing Component

## Purpose
ArticleListing fetches and displays a paginated grid of article cards, supporting optional tag-based filtering. During server-side rendering, `getComponentServerProps` queries the Sitecore GraphQL API for all articles of the appropriate type (Article, Insights, or News) under the site content root, normalizes their SXA tags for serialization, and stores the results on `rendering.data`. The child `ArticleListingRendering` (from `component-children/Articles/ArticleListing/ArticleListing.tsx`) then applies client-side tag filtering via `useContextPageTags` if `filterByTags` is enabled, and delegates paginated display to `ArticleListGrid` (`component-children/Articles/ArticleListing/ArticleListGrid.tsx`).

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `358eaadd-3a03-4fe8-8a04-6d0bf849bf13` |
| **Component Name** | `ArticleListing` |
| **Category** | `Articles` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Section heading displayed above the article grid | Rendered as `<h2>` |
| `filterByTags` | Checkbox (`Field<boolean>`) | No | When `true`, filters the article list to match SXA tags active on the current page context | Boolean; default behavior is to show all articles |
| `tagsHeading` | Single-Line Text (`Field<string>`) | No | Custom label displayed when tag filtering is active (e.g. "Filtering by:") | Falls back to dictionary key `'Filtering by tags:'` |
| `noResultsText` | Single-Line Text (`Field<string>`) | No | Custom message shown when tag filtering produces no matching articles | Falls back to variant-specific dictionary key |
| `PageSizeCount` | Number (`Field<number>`) | No | Number of articles shown per page in the paginated grid | Validated via `getValidPageSize()`; default used if invalid |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text tag="h2" field={fields?.heading} className="heading-lg mb-6" />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `tagsHeading` | `<Text field={fields.tagsHeading} tag="span" className="font-semibold" />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `noResultsText` | `<Text field={fields.noResultsText} />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `filterByTags` | Accessed as `fields.filterByTags.value` (boolean) — no JSS render component | N/A |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Lists all general article types; variant also auto-detected from rendering params `Variant` field |
| Insights | `Insights` | Lists only Insights-type articles; hardcoded `ARTICLE_VARIANTS.INSIGHTS` |
| News | `News` | Lists only News-type articles; hardcoded `ARTICLE_VARIANTS.NEWS` |

## Props Interface
```typescript
// From lib/types/components/Articles/article-listing.ts
import { ComponentRendering, Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ArticleDataType } from 'lib/types';
import { ArticleVariant } from 'lib/helpers/article-variants';

type ArticleListingFields = {
  heading: Field<string>;
  filterByTags?: Field<boolean>;
  tagsHeading?: Field<string>;
  noResultsText?: Field<string>;
  PageSizeCount?: Field<number>;
};

type ArticleListingRenderingType = {
  rendering: ComponentRendering & {
    data: ArticleDataType[]; // Populated by getComponentServerProps
  };
};

export type ArticleListingProps = ComponentProps &
  ArticleListingRenderingType & {
    fields: ArticleListingFields;
    variant?: ArticleVariant;
  };

// ArticleDataType (lib/types/page/article.ts):
export type ArticleDataType = {
  id: string;
  name: string;
  image: ImageGQLType;
  datePublished: DateGQLType;
  displayDateTime?: QueryField;
  pageCategory: PageCategoryField;
  heading?: QueryField;
  subheading?: QueryField;
  body?: QueryField;
  url: ItemUrl;
  sxaTags?: { targetItems?: TagItem[] };
} | null;
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
    "heading": { "value": "Insights Library" },
    "filterByTags": { "value": true },
    "tagsHeading": { "value": "Filtering by:" },
    "noResultsText": { "value": "No articles match the selected topics. Showing all results." },
    "PageSizeCount": { "value": 12 }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add Component to Page
```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "358eaadd-3a03-4fe8-8a04-6d0bf849bf13",
  placeholderPath: "headless-main",
  componentItemName: "ArticleListing_1",
  language: "en",
  fields: {
    "heading": "Latest Articles"
  }
});
```

### Step 2: Choose a Variant
Use `Default` for general articles, `Insights` for insights-only, `News` for news-only. The variant controls which GraphQL template IDs are queried server-side.

### Step 3: Configure Tag Filtering (Optional)
Enable `filterByTags` on the datasource to allow the listing to filter by the active page's SXA tags context.

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | `"heading": "Latest Articles"` |
| `filterByTags` | Checkbox | `"filterByTags": true` |
| `tagsHeading` | Single-Line Text | `"tagsHeading": "Filtering by:"` |
| `noResultsText` | Single-Line Text | `"noResultsText": "No results found."` |
| `PageSizeCount` | Number | `"PageSizeCount": 12` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
