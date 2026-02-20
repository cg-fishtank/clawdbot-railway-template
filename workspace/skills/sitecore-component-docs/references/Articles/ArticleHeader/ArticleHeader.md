# ArticleHeader Component

## Purpose
ArticleHeader is a route context component that renders the top section of an article page, including the page category, publication date, heading, subheading, and a social sharing widget. All field values — `heading`, `subheading`, `pageCategory`, `datePublished`, and `displayDateTime` — are read directly from the Sitecore page route via `useSitecore()`, so they are authored on the page item rather than a separate datasource. Each variant (Default, Insights, News) also injects appropriate `<meta>` tags into `<head>` using variant-specific `ArticleMetadata`, `InsightsMetadata`, or `NewsMetadata` child components from `component-children/Articles/ArticlePage/ArticleMetadata.tsx`.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `3fb16cce-b455-4a98-8610-a025e9f96c6c` |
| **Component Name** | `ArticleHeader` |
| **Category** | `Articles` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Main article title, rendered as `<h1>`; read from the page route | Should not be empty |
| `subheading` | Rich Text (`Field<string>`) | No | Supporting subheading beneath the title; rendered via `<RichText>` | HTML allowed |
| `pageCategory` | Multilist | No | Page category references; first category value is displayed as a label above the heading | Only first category shown |
| `datePublished` | Date (`Field<string>`) | No | Publication date; displayed for all variants; for News variant, `displayDateTime` takes precedence if set | ISO 8601 date string |
| `displayDateTime` | Date/Time (`Field<string>`) | No | News-specific override date/time; used instead of `datePublished` for the News variant when non-null | ISO 8601 datetime string; only meaningful on News variant |

> **Note:** This is a route context component. All fields above are authored on the **page item** (route). No datasource fields exist for this component.

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text field={heading} tag="h1" className="heading-4xl text-content" />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `subheading` | `<RichText field={subheading} className="richtext text-content" />` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `pageCategory` | Resolved via `getPageCategories(pageCategory)`, first value rendered with `<Text editable={false} field={category} tag="p" />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `datePublished` | Formatted via `getLocalizedFormattedDate()`, rendered as plain `<p>` text | N/A — no JSS field component; formatted string output |
| `displayDateTime` | Same as `datePublished`; used for News variant via `isNullishDateTime()` check | N/A — formatted string output |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Standard article header; injects `ArticleMetadata` `<meta>` tags |
| Insights | `Insights` | Insights article header; injects `InsightsMetadata` `<meta>` tags |
| News | `News` | News article header; injects `NewsMetadata` `<meta>` tags; shows time alongside date |

## Props Interface
```typescript
// Defined inline in ArticleHeader.tsx
import { ComponentProps } from 'lib/component-props';
import { ArticleVariant } from 'lib/helpers/article-variants';

type ArticleHeaderProps = ComponentProps & {
  variant?: ArticleVariant;
};

// Fields consumed via useSitecore() — not passed as props:
// ArticleRouteFieldsType (lib/types/page/article.ts):
export type ArticleRouteFieldsType = {
  heading?: Field<string>;
  subheading?: Field<string>;
  image?: ImageField;
  imageMobile?: ImageField;
  datePublished?: Field<string>;
  lastUpdated?: Field<string>;
  pageCategory?: PageCategoryField;
  profiles?: ProfileType[];
  displayDateTime?: QueryField | Field<string>;
  SxaTags?: TagType[];
};

// DateSectionProps (internal):
type DateSectionProps = {
  variant?: ArticleVariant;
  datePublished: Field<string> | undefined;
  newsDisplayDateTime: Field<string> | undefined;
  locale?: string;
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "The Future of Renewable Energy Storage" }
  }
}
```

> These fields are authored on the **page item** (route), not on a datasource.

### Full Content Example
```json
{
  "fields": {
    "heading": { "value": "The Future of Renewable Energy Storage" },
    "subheading": { "value": "<p>New battery technologies are transforming how we store and distribute clean energy across the grid.</p>" },
    "pageCategory": [{ "fields": { "pageCategory": { "value": "Energy" } } }],
    "datePublished": { "value": "2026-02-19T00:00:00Z" },
    "displayDateTime": { "value": "2026-02-19T09:30:00Z" }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add Component to Page
```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "3fb16cce-b455-4a98-8610-a025e9f96c6c",
  placeholderPath: "headless-main",
  componentItemName: "ArticleHeader_1",
  language: "en",
  fields: {}
});
```

### Step 2: Author Header Fields on the Page Item
All visible fields are page-level route fields:
```javascript
const result = await mcp__marketer-mcp__update_page_fields({
  pageId: "page-guid",
  language: "en",
  fields: {
    "heading": "The Future of Renewable Energy Storage",
    "subheading": "<p>New battery technologies are transforming the grid.</p>",
    "datePublished": "2026-02-19T00:00:00Z"
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text (page item) | `"heading": "Plain text string"` |
| `subheading` | Rich Text (page item) | `"subheading": "<p>HTML content</p>"` |
| `pageCategory` | Multilist (page item) | Array of category item GUIDs |
| `datePublished` | Date (page item) | `"datePublished": "2026-02-19T00:00:00Z"` |
| `displayDateTime` | Date/Time (page item, News variant) | `"displayDateTime": "2026-02-19T09:30:00Z"` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
