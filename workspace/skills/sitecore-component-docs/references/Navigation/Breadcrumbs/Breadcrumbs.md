# Breadcrumbs Component

## Purpose
The Breadcrumbs component renders a contextual navigation trail showing the current page's position within the site hierarchy. It uses a `getComponentServerProps` function to execute a dynamic GraphQL query that traverses the Sitecore content tree upward from the current page, building a parent chain of display names. The component delegates its visual rendering to four child components: `BreadcrumbsRendering` (the root display logic), `BackButton` (a mobile-only back link), `SimplePageTitle` (for top-level pages), and `SubRoutes` (for deep multi-level paths showing intermediate breadcrumb links with caret separators).

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `dbc13b39-e3ea-4974-9623-50116bda8feb` |
| **Component Name** | `Breadcrumbs` |
| **Category** | `Navigation` |

## Fields
**Fields:** None — this component has no datasource fields. It derives all data automatically from the current page's route and content tree position via `getComponentServerProps`.

## Placeholders
**Placeholders:** None — this component does not expose any placeholders.

## JSS Field Component Mapping
This component has no JSS field bindings. Data is derived from the layout service route and a dynamic GraphQL query:
- `route.fields.heading` is read from `RouteData` to populate the page title
- `pathList` is a recursively built parent chain returned from the `getPagePathList` helper

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard breadcrumb trail with home link, intermediate path links, and current page title |

## Props Interface
```typescript
// From: src/components/Navigation/Breadcrumbs/Breadcrumbs.tsx

export type BreadcrumbPathType = {
  name: string;
  path: string;
};

type ParentType = {
  name: string;
  displayName: string;
  parent?: ParentType;
} | null;

type BreadcrumbsProps = ComponentProps & {
  route: RouteData<Record<string, Field | Item | Item[]>> | null;
  pathList: ParentType;
};
```

## Child Component Summary

| File | Role |
|------|------|
| `component-children/Navigation/Breadcrumbs/Breadcrumbs.tsx` | Root rendering — assembles HomeButton, BackButton, CaretIcon, SubRoutes/SimplePageTitle; also contains `getPagePathList` which executes the dynamic GraphQL query |
| `component-children/Navigation/Breadcrumbs/BackButton.tsx` | Mobile-only anchor tag that navigates to the previous breadcrumb path |
| `component-children/Navigation/Breadcrumbs/SimplePageTitle.tsx` | Renders the page title as a static span for top-level (depth-1) pages |
| `component-children/Navigation/Breadcrumbs/SubRoutes.tsx` | Renders intermediate path segments as clickable links with caret separators for deep pages |

## Example Content Entry
No content entry is required. The Breadcrumbs component is a structural/system component that automatically reads from the current page's layout data and content tree hierarchy. Place it on a shared layout or page design.

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemId: "<target-page-item-id>",
  renderingId: "dbc13b39-e3ea-4974-9623-50116bda8feb",
  placeholderName: "<placeholder-name>",
  // No datasource required — component is self-contained
});
```

### Notes
- No datasource is needed. The component reads the current route from layout data.
- The dynamic GraphQL query depth is calculated from the URL path depth. Pages only one level deep render `SimplePageTitle`; deeper pages render the full `SubRoutes` chain.
- The `heading` field on the current route item is used as the final breadcrumb segment (page title).
- The `NEXT_PUBLIC_API_URL` environment variable must be set for the GraphQL client.

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
