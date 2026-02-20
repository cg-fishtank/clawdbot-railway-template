# CdpPageView Component

## Purpose
A client-side system component that fires a Sitecore CDP (Customer Data Platform) `pageView` event on every page navigation. It uses `@sitecore-cloudsdk/events/browser` to send the event with the channel, currency, page name, page variant ID (computed via `CdpHelper.getPageVariantId`), and current language. The event is suppressed in Experience Editor/Preview modes (`mode.isNormal` guard), in development (`NODE_ENV === 'development'`), and silently when the Events SDK has not been initialised. The component renders an empty React fragment — it has no visible output.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | N/A — system component, not a Sitecore rendering |
| **Component Name** | `CdpPageView` |
| **Category** | `content-sdk` (system) |

## Fields
**Fields:** None — this is a system component with no Sitecore datasource fields.

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
**JSS Field Component Mapping:** None

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default export | `CdpPageView` (default) | Placed once in the global `_app.tsx` or layout to track every page view |

## Props Interface
```typescript
// content-sdk/CdpPageView.tsx
// No props — the component reads all data from useSitecore() and sitecore.config

const CdpPageView = (): React.JSX.Element => { ... };

export default CdpPageView;
```

## Example Content Entry
This is a system component and is not authored via MCP.

## MCP Authoring Instructions
This is a system component and is not authored via MCP. It is placed once in the application layout (typically `src/pages/_app.tsx` or `src/Layout.tsx`) by developers. No Sitecore content item, datasource, or rendering configuration is required.

To enable/disable CDP page view tracking, adjust:
- `process.env.NODE_ENV` — events are disabled in `development` by default.
- The `disabled()` function body in the component to integrate your cookie consent management solution.
- `sitecore.config.personalize.scope` — controls the CDP scope used for page variant ID computation.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
