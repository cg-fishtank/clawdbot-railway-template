# FooterMain Component

## Purpose
FooterMain is the primary branded footer band that sits above the legal strip. It renders three columns separated by vertical rules: a logo + scroll-to-top section, a newsletter/CTA column, and a link column driven by a `footermenu` placeholder (intended for `FooterMenu` or `FooterCol` components). The component forces the secondary theme via `FrameProvider`. A `demo` field allows the entire component to be hidden from production while keeping it visible in the CMS for demonstration purposes. The datasource item name is resolved at server time and surfaced as a `data-source-name` attribute for debugging.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `d63f334e-d240-47da-87b6-2c61c6413f8a` |
| **Component Name** | `FooterMain` |
| **Category** | `Footer` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `logo` | Image | No | Site logo displayed in the left column; rendered inverted and links to `/` |
| `newsletterHeading` | Single-Line Text | No | Heading above the newsletter/CTA section |
| `newsletterBody` | Rich Text | No | Body copy below the newsletter heading |
| `newsletterLink` | General Link | No | CTA button link in the newsletter section (rendered in tertiary theme) |
| `demo` | Checkbox | No | When checked (`true` / `"1"`), adds `hidden` class to hide the component on the page |

## Placeholders
| Placeholder Name | Pattern | Allowed Components |
|-----------------|---------|-------------------|
| `footermenu` | `placeholderGenerator(params, 'footermenu')` | `FooterMenu`, `FooterCol` |

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `logo` | `Image` | `@sitecore-content-sdk/nextjs` |
| `newsletterHeading` | `Text` | `@sitecore-content-sdk/nextjs` |
| `newsletterBody` | `RichText` | `@sitecore-content-sdk/nextjs` |
| `newsletterLink` | `Button` (variant: `"button"`, color: `"tertiary"`) | `component-children/Shared/Button/Button` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard footer main with `withDatasourceCheck` |

## Props Interface
```typescript
import {
  ComponentRendering,
  Field,
  ImageField,
  LinkField,
  GetComponentServerProps,
} from '@sitecore-content-sdk/nextjs';

type FooterMainFields = {
  newsletterHeading: Field<string>;
  newsletterBody: Field<string>;
  newsletterLink: LinkField;
  logo: ImageField;
  demo?: Field<string | boolean>;
};

type FooterMainProps = ComponentProps & {
  fields: FooterMainFields;
};
```

## Server Props
`getComponentServerProps` fetches the datasource item's name from Sitecore via `GetItemById` for use as a `data-source-name` debug attribute.

```typescript
export const getComponentServerProps: GetComponentServerProps = async (rendering) => {
  const graphQLClient = getGraphQlClient();
  let itemName = null;

  if (rendering.dataSource) {
    const itemData = await graphQLClient.request(GetItemById.loc?.source.body || '', {
      itemId: rendering.dataSource,
      language: 'en',
    });
    itemName = (itemData as { item?: { name?: string } })?.item?.name || null;
  }

  return {
    rendering: { ...rendering, itemName },
  };
};
```

## Scroll-to-Top Button
A `ScrollUpButton` is rendered in both the left column (mobile, shows on small screens) and the right/link column (desktop, shows only on large screens). Clicking it calls `window.scrollTo({ top: 0, behavior: 'smooth' })`.

## Demo Field Behavior
When `fields.demo.value === '1'` or `=== true`, the Tailwind class `hidden` is applied to the root element, hiding it from site visitors while keeping it in the page HTML for preview/authoring purposes.

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "logo": {
      "value": {
        "src": "/-/media/Global/logo.svg",
        "alt": "Acme Corp"
      }
    }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "logo": {
      "value": {
        "src": "/-/media/Global/logo.svg",
        "alt": "Acme Corp",
        "width": 200,
        "height": 50
      }
    },
    "newsletterHeading": { "value": "Stay Connected" },
    "newsletterBody": { "value": "<p>Subscribe to our newsletter for the latest news.</p>" },
    "newsletterLink": {
      "value": {
        "href": "/newsletter-signup",
        "text": "Subscribe Now",
        "target": "_self"
      }
    },
    "demo": { "value": false }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Global Footer
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Global/Footer-Page",
  componentName: "FooterMain",
  placeholderName: "footer-main",
  dataSource: "/sitecore/content/MySite/Global/Footer/FooterMain-Data"
});
```

### Step 2: Set Fields
```javascript
await mcp__marketer_mcp__update_component_fields({
  itemPath: "/sitecore/content/MySite/Global/Footer/FooterMain-Data",
  fields: {
    "newsletterHeading": { "value": "Stay Connected" },
    "newsletterBody": { "value": "<p>Get our latest updates.</p>" },
    "newsletterLink": { "value": { "href": "/newsletter", "text": "Subscribe" } }
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `logo` | Image | `{ "value": { "src": "...", "alt": "..." } }` |
| `newsletterHeading` | Single-Line Text | `{ "value": "Stay Connected" }` |
| `newsletterBody` | Rich Text | `{ "value": "<p>...</p>" }` |
| `newsletterLink` | General Link | `{ "value": { "href": "...", "text": "..." } }` |
| `demo` | Checkbox | `{ "value": false }` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
