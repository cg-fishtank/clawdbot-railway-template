# LatestArticleGrid Component

## Purpose
LatestArticleGrid fetches and displays the most recent articles (up to 6) from the Sitecore GraphQL API, sorted by publication date. It supports two layout variants (Default grid and VerticalList) and three content-type variants (Default articles, Insights, News), with `getComponentServerProps` selecting the appropriate GraphQL query (`GetLatestArticles`, `GetLatestInsights`, or `GetLatestNews`) based on the active variant. Results are cached in an in-memory `Map` per variant/language/content-root combination with a 5-minute TTL to reduce GraphQL load. The child components `DefaultRendering` and `VerticalListRendering` (from `component-children/Articles/LatestArticleGrid/LatestArticleGrid.tsx`) handle the visual grid or list layout, and both are aware of `ColumnSplitter` container context to adapt their wrapping accordingly.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `91821aa1-e6be-4404-8d00-cf6e859cdf0b` |
| **Component Name** | `LatestArticleGrid` |
| **Category** | `Articles` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Section heading displayed above the article grid or list | Rendered as `<h2>` with `heading-4xl` class |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text tag="h2" field={fields?.heading} className="heading-4xl" />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |

## Component Variants

### Layout Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | 3-column grid layout (2-column on medium, 1-column on mobile); adapts to 4-column + 2-col grid inside `ColumnSplitter` |
| VerticalList | `VerticalList` | Stacked row layout displaying up to 3 articles; renders without `Frame` wrapper when inside `ColumnSplitter` |

### Content Type Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Fetches from general article template (`ARTICLE_TEMPLATE_ID`) |
| Insights | `Insights` | Fetches from Insights template (`INSIGHTS_TEMPLATE_ID`) using `GetLatestInsights` query |
| News | `News` | Fetches from News template (`NEWS_TEMPLATE_ID`) using `GetLatestNews` query |

> The `Insights` and `News` exports use the `DefaultRendering` (grid) layout with the respective content-type variant.

## Props Interface
```typescript
// From components/Articles/LatestArticleGrid/LatestArticleGrid.tsx
import { ComponentRendering, Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ArticleDataType } from 'lib/types';
import { ArticleVariant } from 'lib/helpers/article-variants';

export type LatestArticleGridFields = {
  heading: Field<string>;
};

export type LatestArticleGridProps = ComponentProps &
  ArticleListingRenderingType & {
    className?: string;
    fields: LatestArticleGridFields;
    max?: number;        // Max articles to show; defaults to 3 in child renderings (server fetches max 6)
    variant?: ArticleVariant;
  };

type ArticleListingRenderingType = {
  rendering: ComponentRendering & {
    data: ArticleDataType[]; // Populated by getComponentServerProps (up to 6 items, sorted by datePublished)
  };
};

// Internal query cache type:
type ArticleListQueryType = {
  search: {
    results: ArticleDataType[];
    total: number;
    pageInfo: {
      endCursor: string;
      hasNext: boolean;
    };
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
    "heading": { "value": "Latest Insights" }
  }
}
```

> LatestArticleGrid has only one authored field. All article data is fetched automatically server-side from GraphQL based on the variant and site content root.

## MCP Authoring Instructions

### Step 1: Add Component to Page
```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "91821aa1-e6be-4404-8d00-cf6e859cdf0b",
  placeholderPath: "headless-main",
  componentItemName: "LatestArticleGrid_1",
  language: "en",
  fields: {
    "heading": "Latest Articles"
  }
});
```

### Step 2: Choose Layout and Content Variant
- Use `Default` for the 3-column grid of general articles.
- Use `VerticalList` for a stacked list layout (e.g. inside a `ColumnSplitter`).
- Use `Insights` or `News` exports for type-specific content grids.

### Step 3: Understand Caching Behavior
The component maintains an in-memory server-side cache keyed by `variant + templateId + contentRootId + language`. Cached results expire after **5 minutes**. No manual cache invalidation is available — a server restart or cache TTL expiry will refresh the data.

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | `"heading": "Latest Insights"` |

### Data Fetch Behavior Reference
| Variant | GraphQL Query | Template ID Constant | Max Items |
|---------|--------------|---------------------|-----------|
| Default | `GetLatestArticles` | `ARTICLE_TEMPLATE_ID` | 6 |
| Insights | `GetLatestInsights` | `INSIGHTS_TEMPLATE_ID` | 6 |
| News | `GetLatestNews` | `NEWS_TEMPLATE_ID` | 6 |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
