# FooterCol Component

## Purpose
FooterCol renders a single navigational column in the site footer, consisting of a heading and a list of page links fetched via GraphQL at server time. On desktop it displays as a static vertical list; on mobile it collapses into an accordion controlled by the parent `AccordionProvider` (supplied by `FooterMenu`). The link list items are typed as `FOOTER_LINK_TEMPLATE_ID` children of the datasource item and are resolved server-side via `getComponentServerProps`.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `267ec5a1-36d9-4a3c-92b2-620a56806568` |
| **Component Name** | `FooterCol` |
| **Category** | `Footer` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `heading` | Single-Line Text | Yes | Column heading rendered as `<h3>` (e.g. "About Us") |

**Note:** The link list is **not** a standard field. It is fetched via GraphQL (`GetFooterColumnLinks`) using the `FOOTER_LINK_TEMPLATE_ID` filter on children of the datasource item, then injected into `rendering.data.item.links.results`.

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `Text` | `@sitecore-content-sdk/nextjs` |
| Link items | `Button` (variant: `"link"`) | `component-children/Shared/Button/Button` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Mobile accordion + desktop static list |
| Static | `StaticView` (internal) | Rendered when no `AccordionContext` is available |

## Props Interface
```typescript
import {
  ComponentRendering,
  Field,
  GetComponentServerProps,
} from '@sitecore-content-sdk/nextjs';
import { LinkGQLType } from 'lib/types';

type FooterColFields = {
  heading: Field<string>;
};

type FooterColRenderingType = {
  rendering: ComponentRendering & {
    data?: {
      item?: {
        links?: {
          results?: PageLinkType[];
        };
      };
    };
  };
};

type FooterColProps = ComponentProps & FooterColRenderingType & {
  fields: FooterColFields;
};

type PageLinkType = {
  link: LinkGQLType;
  isFirst?: boolean;
};
```

## Server Props
`getComponentServerProps` fetches the column's link list from Sitecore using GraphQL. If no datasource is set, it returns the rendering unchanged.

```typescript
export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const language = getLayoutLanguage(layoutData);
  const graphQLClient = getGraphQlClient();

  if (!rendering.dataSource) {
    return { rendering, route: layoutData?.sitecore?.route };
  }

  const data = await graphQLClient.request(GetFooterColumnLinks.loc?.source.body || '', {
    datasourcePath: rendering.dataSource,
    language,
    templateId: FOOTER_LINK_TEMPLATE_ID,
  });

  return {
    rendering: { ...rendering, data },
    route: layoutData?.sitecore?.route,
  };
};
```

## Accordion Behavior
- FooterCol reads accordion state from the parent `AccordionProvider` (set up by `FooterMenu`).
- On mobile (`lg:hidden`): clicking the heading toggles the link list open/closed with `AccordionMotion` animation.
- On desktop (`lg:flex`): the heading and links are always visible as a static column.
- In Experience Editor: the accordion is always expanded (`isEditing || isOpen(accordionId)`).
- If no `AccordionContext` exists (`noContext === true`), the `StaticView` fallback is rendered without accordion controls.

## Example Content Entry

### Minimum Viable Content (datasource item)
```json
{
  "fields": {
    "heading": { "value": "About Us" }
  }
}
```

### Full Content Example
Datasource item structure in Sitecore content tree:
```
/sitecore/content/MySite/Global/Footer/FooterCol-About
  - Template: Footer Column
  - Fields:
      heading: "About Us"
  - Children (each using FOOTER_LINK_TEMPLATE_ID template):
      /FooterLink-Mission  → link: /about/mission
      /FooterLink-Team     → link: /about/team
      /FooterLink-Careers  → link: /careers
```

## MCP Authoring Instructions

### Step 1: Add FooterCol into FooterMenu Placeholder
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Global/Footer-Page",
  componentName: "FooterCol",
  placeholderName: "footermenu",
  dataSource: "/sitecore/content/MySite/Global/Footer/FooterCol-About"
});
```

### Step 2: Set Heading
```javascript
await mcp__marketer_mcp__update_component_fields({
  itemPath: "/sitecore/content/MySite/Global/Footer/FooterCol-About",
  fields: {
    "heading": { "value": "About Us" }
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | `{ "value": "Column Title" }` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
