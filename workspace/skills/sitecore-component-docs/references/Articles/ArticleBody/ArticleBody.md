# ArticleBody Component

## Purpose
ArticleBody renders the main rich-text body content of an article page. Unlike datasource-driven components, it reads the `body` field directly from the Sitecore page route context via `useSitecore()` (`page.layout.sitecore.route.fields`), making it a route context component — the content is authored on the page item itself, not a separate datasource item. Three variant wrapper components (Default, Insights, News) control the `data-variant` attribute so that CSS or analytics tooling can differentiate article types; the core rendering logic is shared.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `231f637c-0461-4bc6-a18a-683e039a884c` |
| **Component Name** | `ArticleBody` |
| **Category** | `Articles` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `body` | Rich Text (RichTextField) | Yes | The main article body content; read from the page route fields via `useSitecore()` | Full HTML supported; rendered with `richtext richtext-h1-4xl` Tailwind classes |

> **Note:** This is a route context component. The `body` field must be authored on the page item (route), not on a datasource. No datasource is required for content population; `withDatasourceCheck` is present for edit-mode safety only.

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `body` | `<RichText field={body} className="richtext richtext-h1-4xl w-full text-content" />` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Standard article body for general article pages |
| Insights | `Insights` | Body for Insights-type articles; sets `data-variant="Insights"` |
| News | `News` | Body for News-type articles; sets `data-variant="News"` |

## Props Interface
```typescript
// Defined inline in ArticleBody.tsx
import { ComponentProps } from 'lib/component-props';

type ArticleBodyProps = ComponentProps & {
  variant?: string;
};

// Route fields consumed via useSitecore() — not passed as props:
// EventRouteFieldsType includes:
//   body: Field<string> (RichTextField) — the article body content
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "body": { "value": "<p>This article explores the impact of modern automation on supply chains.</p>" }
  }
}
```

> The above fields are authored on the **page item** (route), not on the component datasource.

### Full Content Example
```json
{
  "fields": {
    "body": {
      "value": "<h2>Introduction</h2><p>Modern manufacturing is changing rapidly...</p><h2>Key Trends</h2><ul><li>AI-driven quality control</li><li>Predictive maintenance</li></ul><p>These technologies are enabling factories to...</p>"
    }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add Component to Page
```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "231f637c-0461-4bc6-a18a-683e039a884c",
  placeholderPath: "headless-main",
  componentItemName: "ArticleBody_1",
  language: "en",
  fields: {}
});
```

### Step 2: Author Body Content on the Page Item
The `body` field is on the **page item**, not the component datasource. Update it separately:
```javascript
const result = await mcp__marketer-mcp__update_page_fields({
  pageId: "page-guid",
  language: "en",
  fields: {
    "body": "<p>Full article body HTML content goes here.</p>"
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `body` | Rich Text (on page item) | `"body": "<p>HTML content</p>"` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
