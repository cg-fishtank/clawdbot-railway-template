# FEAASScripts Component

## Purpose
A system bootstrap component for the Sitecore FEAAS (Front-End as a Service / Component Builder) integration. It overrides the default `img` element implementation registered with the FEAAS `@sitecore-feaas/clientside` library so that images rendered inside FEAAS/Component Builder components use the Next.js `<Image>` component for optimisation. The component also applies a pattern-matching heuristic to determine whether a given image URL should be run through Next.js image optimisation (based on `next.config` `domains` and `remotePatterns` settings). The component renders an empty React fragment — it has no visible output.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | N/A — system component, not a Sitecore rendering |
| **Component Name** | `FEAASScripts` |
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
| Default export | `FEAASScripts` (default) | Placed once in the global layout to register FEAAS element overrides |

## Props Interface
```typescript
// content-sdk/FEAASScripts.tsx
// No props

const FEAASScripts = (): React.JSX.Element => { ... };

export default FEAASScripts;
```

## Example Content Entry
This is a system component and is not authored via MCP.

## MCP Authoring Instructions
This is a system component and is not authored via MCP. It is placed once in the application layout (typically `src/pages/_app.tsx` or `src/Layout.tsx`) by developers. No Sitecore content item, datasource, or rendering configuration is required.

To extend FEAAS element overrides, add additional `FEAAS.setElementImplementation(...)` calls inside the component body. Ensure that any external image domains used by Component Builder components are registered in `next.config.js` under `images.domains` or `images.remotePatterns` so the optimisation logic resolves them correctly.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
