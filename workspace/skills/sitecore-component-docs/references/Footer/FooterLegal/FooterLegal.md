# FooterLegal Component

## Purpose
FooterLegal renders the bottom-most legal strip of the site footer. It presents three regions side-by-side on desktop (stacked on mobile): a row of legal links (Privacy Policy, Terms of Service, Cookie Policy), an auto-generated copyright notice that prepends the current year, and a row of social media icon links fetched from Sitecore via GraphQL. An optional land acknowledgement band renders in the primary theme below the main strip. The component forces the tertiary theme via `FrameProvider` regardless of its placement context.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `77d7145d-775c-4fac-9191-bdb7ad03de9f` |
| **Component Name** | `FooterLegal` |
| **Category** | `Footer` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `copyright` | Single-Line Text | No | Copyright holder name; the current year is prepended automatically (e.g. "© 2026 Acme Corp") |
| `privacyPolicyLink` | General Link | No | Rendered as a text button link to the privacy policy page |
| `tosLink` | General Link | No | Rendered as a text button link to the Terms of Service page |
| `cookiePolicyLink` | General Link | No | Rendered as a text button link to the Cookie Policy page |
| `landAcknowledgement` | Single-Line Text | No | Land acknowledgement text shown in a full-width primary-themed band below the legal strip; hidden when empty |

**Note:** Social media links are **not** standard fields. They are fetched via GraphQL (`GetFooterLegalSocialLinks`) using `FOOTER_SOCIAL_LINK_TEMPLATE_ID` on children of the datasource item, then injected into `rendering.socialLinks`.

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `copyright` | `Text` | `@sitecore-content-sdk/nextjs` |
| `privacyPolicyLink` | `Button` (variant: `"link"`) | `component-children/Shared/Button/Button` |
| `tosLink` | `Button` (variant: `"link"`) | `component-children/Shared/Button/Button` |
| `cookiePolicyLink` | `Button` (variant: `"link"`) | `component-children/Shared/Button/Button` |
| `landAcknowledgement` | `Text` | `@sitecore-content-sdk/nextjs` |
| Social icon links | `Link` + `IconSocial` | `@sitecore-content-sdk/nextjs` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard legal footer strip with `withDatasourceCheck` |

## Props Interface
```typescript
import {
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-content-sdk/nextjs';
import { IconSocialType, IconType, LinkGQLType } from 'lib/types';

type SocialLinkType = {
  link: LinkGQLType;
  socialIcon: {
    value: IconSocialType;
  };
};

type FooterLegalFields = {
  fields: {
    copyright: Field<string>;
    privacyPolicyLink: LinkField;
    tosLink: LinkField;
    cookiePolicyLink: LinkField;
    landAcknowledgement: Field<string>;
  };
};

type FooterLegalRenderingType = {
  rendering: ComponentRendering & {
    socialLinks: SocialLinkType[]; // Injected by getComponentServerProps
  };
};

type FooterLegalProps = ComponentProps &
  FooterLegalFields &
  FooterLegalRenderingType & {
    className?: string;
  };
```

## Server Props
`getComponentServerProps` fetches social media links from Sitecore. Falls back to an empty array if no datasource or on error.

```typescript
export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const language = getLayoutLanguage(layoutData);
  const graphQLClient = getGraphQlClient();

  if (!rendering.dataSource) {
    return { rendering: { ...rendering, socialLinks: [] } };
  }

  const data = await graphQLClient.request(GetFooterLegalSocialLinks.loc?.source.body || '', {
    datasourcePath: rendering.dataSource,
    language,
    templateId: FOOTER_SOCIAL_LINK_TEMPLATE_ID,
  });

  const socialLinks = data?.item?.socialLinks?.results || [];
  return { rendering: { ...rendering, socialLinks } };
};
```

## Copyright Year
The copyright year is generated at render time using `moment.utc().format('YYYY')` — no manual update is needed year-over-year.

## Social Icons
Each social link item must be a child of the datasource with template `FOOTER_SOCIAL_LINK_TEMPLATE_ID`. Each item exposes:
- `link` (General Link): the social media profile URL
- `socialIcon.value` (Icon field): the social icon identifier (e.g. `"facebook"`, `"linkedin"`)

In Experience Editor, social icon links render as non-clickable `<div>` wrappers; in delivery they render as `<Link>` elements with `aria-label`.

## Example Content Entry

### Minimum Viable Content (datasource item)
```json
{
  "fields": {
    "copyright": { "value": "Acme Corporation" }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "copyright": { "value": "Acme Corporation" },
    "privacyPolicyLink": {
      "value": { "href": "/privacy-policy", "text": "Privacy Policy" }
    },
    "tosLink": {
      "value": { "href": "/terms-of-service", "text": "Terms of Service" }
    },
    "cookiePolicyLink": {
      "value": { "href": "/cookie-policy", "text": "Cookie Policy" }
    },
    "landAcknowledgement": {
      "value": "We acknowledge the unceded territory of the Coast Salish peoples."
    }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Footer Layout
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemPath: "/sitecore/content/MySite/Global/Footer-Page",
  componentName: "FooterLegal",
  placeholderName: "footer-legal",
  dataSource: "/sitecore/content/MySite/Global/Footer/FooterLegal-Data"
});
```

### Step 2: Set Legal Links and Copyright
```javascript
await mcp__marketer_mcp__update_component_fields({
  itemPath: "/sitecore/content/MySite/Global/Footer/FooterLegal-Data",
  fields: {
    "copyright": { "value": "Acme Corporation" },
    "privacyPolicyLink": { "value": { "href": "/privacy-policy", "text": "Privacy Policy" } },
    "tosLink": { "value": { "href": "/terms-of-service", "text": "Terms of Service" } },
    "cookiePolicyLink": { "value": { "href": "/cookie-policy", "text": "Cookie Policy" } }
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `copyright` | Single-Line Text | `{ "value": "Company Name" }` |
| `privacyPolicyLink` | General Link | `{ "value": { "href": "...", "text": "..." } }` |
| `tosLink` | General Link | `{ "value": { "href": "...", "text": "..." } }` |
| `cookiePolicyLink` | General Link | `{ "value": { "href": "...", "text": "..." } }` |
| `landAcknowledgement` | Single-Line Text | `{ "value": "Acknowledgement text..." }` |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
