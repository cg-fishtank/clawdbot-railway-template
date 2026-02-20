# SitecoreStyles Component

## Purpose
A system component that injects Sitecore-managed `<link>` elements into the HTML `<head>` for page-specific styles and themes. It calls `client.getHeadLinks(layoutData, { enableStyles, enableThemes })` from the Sitecore client to retrieve an array of `HTMLLink` objects derived from the current page's layout data, then renders them as `<link rel="..." href="..." />` tags inside a Next.js `<Head>`. If the resolved link array is empty the component renders nothing. This enables Sitecore's per-page style injection (e.g. site themes, component-level CSS) without hardcoding style URLs.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | N/A — system component, not a Sitecore rendering |
| **Component Name** | `SitecoreStyles` |
| **Category** | `content-sdk` (system) |

## Fields
**Fields:** None — this is a system component. All data is derived from `layoutData` passed as a prop by the Next.js page.

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
**JSS Field Component Mapping:** None

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default export | `SitecoreStyles` (default) | Placed in the Next.js page component to inject layout-driven styles and themes |

## Props Interface
```typescript
// content-sdk/SitecoreStyles.tsx
import { LayoutServiceData, HTMLLink } from '@sitecore-content-sdk/nextjs';

const SitecoreStyles = ({
  layoutData,
  enableStyles,
  enableThemes,
}: {
  layoutData: LayoutServiceData;  // the current page layout response
  enableStyles?: boolean;          // whether to include component style links
  enableThemes?: boolean;          // whether to include site theme links
}) => { ... };

export default SitecoreStyles;
```

## Example Content Entry
This is a system component and is not authored via MCP.

## MCP Authoring Instructions
This is a system component and is not authored via MCP. It is placed once per page in the Next.js page component (typically `src/pages/[[...path]].tsx`) by developers. No Sitecore content item or datasource is required.

Typical usage in a Next.js page:
```tsx
import SitecoreStyles from 'components/content-sdk/SitecoreStyles';

// Inside the page component JSX:
<SitecoreStyles
  layoutData={layoutData}
  enableStyles={true}
  enableThemes={true}
/>
```

Set `enableStyles` and `enableThemes` based on whether your Sitecore configuration uses per-component styles or site themes respectively.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
