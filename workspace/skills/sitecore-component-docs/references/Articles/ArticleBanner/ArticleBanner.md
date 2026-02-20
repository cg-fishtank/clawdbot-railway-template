# ArticleBanner Component

## Purpose
ArticleBanner renders a full-width or contained hero-style banner for article pages, displaying a heading, optional subheading, category badge, and a half-width image. It reads its fields from the datasource item (resolved via `getItemPathString`) and delegates rendering to either `ArticleBanner` (Default, Insights, News) or `ContainedArticleBanner` (Contained) child components. The component also emits a "Read More" link using the resolved datasource item path, making it suitable for use on listing or hub pages that reference individual article items.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `c764d302-9571-4fa3-b2c0-a239c6a77a7d` |
| **Component Name** | `ArticleBanner` |
| **Category** | `Articles` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Primary article heading, rendered as `<h2>` in the banner content area | Should not be empty; drives `aria-label` on the section element |
| `subheading` | Rich Text (`Field<string>` / RichTextField) | No | Supporting copy beneath the heading, rendered via `<RichText>` | HTML allowed |
| `image` | Image (`ImageField`) | Yes | Desktop banner image, rendered as a half-width image alongside the content | Displayed at right (or left if `bannerImgLeft` Frame param is set) |
| `imageMobile` | Image (`ImageField`) | No | Alternative image for mobile viewports via `useImage` hook | Falls back to `image` if not provided |
| `pageCategory` | Multilist | No | Reference to page category items; first category value is shown as a badge | Only first category rendered |
| `datePublished` | Date (`Field<string>`) | No | Publication date; stored on the page route item | ISO 8601 date string |
| `lastUpdated` | Date (`Field<string>`) | No | Last-updated date; stored on the page route item | ISO 8601 date string |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text field={fields?.heading} tag="h2" />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `subheading` | `<RichText field={fields?.subheading} />` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `image` | `<NextImage field={fields?.image} />` (via `useImage` / `HalfWidthImage`) | `import { NextImage } from '@sitecore-content-sdk/nextjs'` |
| `pageCategory` | Resolved via `getPageCategories(fields?.pageCategory)`, first item rendered with `<Text field={category} />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Standard full-bleed article banner on article hub or listing pages |
| Contained | `Contained` | Banner wrapped in a `ContainedWrapper` for constrained-width layouts |
| Insights | `Insights` | Styled for Insights article type; uses `ARTICLE_VARIANTS.INSIGHTS` data-variant |
| News | `News` | Styled for News article type; uses `ARTICLE_VARIANTS.NEWS` data-variant |

## Props Interface
```typescript
// From lib/types/components/Articles/article-banner.ts
import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ArticleRouteFieldsType } from 'lib/types';

export type ArticleBannerProps = ComponentProps & {
  fields: ArticleRouteFieldsType;
  variant?: string;
  rendering: ComponentRendering & {
    path?: string; // Resolved datasource item path (set by getComponentServerProps)
  };
};

// ArticleRouteFieldsType (lib/types/page/article.ts + page/page.ts)
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
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "How AI Is Reshaping Modern Manufacturing" },
    "image": { "value": { "src": "/media/articles/ai-manufacturing.jpg", "alt": "AI manufacturing floor" } }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "heading": { "value": "How AI Is Reshaping Modern Manufacturing" },
    "subheading": { "value": "<p>Explore the latest trends driving factory automation and predictive maintenance.</p>" },
    "image": { "value": { "src": "/media/articles/ai-manufacturing.jpg", "alt": "AI manufacturing floor", "width": 1200, "height": 675 } },
    "imageMobile": { "value": { "src": "/media/articles/ai-manufacturing-mobile.jpg", "alt": "AI manufacturing floor", "width": 600, "height": 400 } },
    "pageCategory": [{ "fields": { "pageCategory": { "value": "Technology" } } }],
    "datePublished": { "value": "2026-02-19T00:00:00Z" },
    "lastUpdated": { "value": "2026-02-19T00:00:00Z" }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add Component to Page
```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "c764d302-9571-4fa3-b2c0-a239c6a77a7d",
  placeholderPath: "headless-main",
  componentItemName: "ArticleBanner_1",
  language: "en",
  fields: {
    "heading": "How AI Is Reshaping Modern Manufacturing",
    "image": "/media/articles/ai-manufacturing.jpg"
  }
});
```

### Step 2: Choose a Variant
Set the rendering parameter `Variant` to one of: `Default`, `Contained`, `Insights`, `News`.

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | `"heading": "Plain text string"` |
| `subheading` | Rich Text | `"subheading": "<p>HTML content</p>"` |
| `image` | Image | `"image": "/media/path/image.jpg"` |
| `imageMobile` | Image | `"imageMobile": "/media/path/image-mobile.jpg"` |
| `pageCategory` | Multilist | Reference to category item GUIDs |
| `datePublished` | Date | `"datePublished": "2026-02-19T00:00:00Z"` |
| `lastUpdated` | Date | `"lastUpdated": "2026-02-19T00:00:00Z"` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
