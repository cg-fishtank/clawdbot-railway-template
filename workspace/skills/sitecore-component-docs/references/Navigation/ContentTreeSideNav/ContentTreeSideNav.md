# ContentTreeSideNav Component

## Purpose
The ContentTreeSideNav component renders a contextual sidebar navigation panel that auto-generates its link structure from the Sitecore content tree hierarchy — no datasource configuration is required by authors. At render time, `getComponentServerProps` executes a `GetContentTreeNavigation` GraphQL query using the current page's item ID to fetch the current page, its parent page, and all sibling pages (children of the parent) as well as the current page's own children. The sidebar displays the parent page as a bold back-link at the top, lists all sibling pages below it (highlighting the active page in bold), and expands a sub-list of the current page's children beneath the active sibling.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `ee2de1d3-7190-4265-b528-f6d8f9c82fcf` |
| **Component Name** | `ContentTreeSideNav` |
| **Category** | `Navigation` |

## Fields
**Fields:** None — this component has no datasource fields. All navigation data is automatically derived from the content tree using the current page's item ID.

## Placeholders
**Placeholders:** None — this component does not expose any placeholders.

## JSS Field Component Mapping
This component has no JSS field bindings. All data is fetched via GraphQL and passed through the `rendering.data` object:

| Data Path | Description |
|-----------|-------------|
| `rendering.data.item` | Current page node (`id`, `name`, `displayName`, `url.path`) |
| `rendering.data.item.children.results` | Direct children of the current page |
| `rendering.data.item.parent` | Parent page node (used as the top back-link) |
| `rendering.data.item.parent.children.results` | Sibling pages (all children of parent, used as the peer list) |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard content-tree sidebar panel rendered inside a `Frame` wrapper |

## Props Interface
```typescript
// From: src/components/Navigation/ContentTreeSideNav/ContentTreeSideNav.tsx

type TreePageType = {
  id: string;
  name: string;
  displayName: string;
  url?: {
    path: string;
  };
};

type ContentTreeSideNavProps = ComponentProps & {
  rendering: ComponentRendering & {
    data?: {
      item?: TreePageType & {
        children?: {
          results: TreePageType[];
        };
        parent?: TreePageType & {
          children: {
            results: TreePageType[];
          };
        };
      };
    };
  };
};

type TreeNavItemProps = {
  page: TreePageType;
  isCurrentPage: boolean;
};
```

## Server-Side Data Fetching
```typescript
// getComponentServerProps fetches content tree data using:
const BASE_PAGE_ID = '{F34E99C9-9782-4E4B-AA95-9FF88394F3F2}'; // Base page template filter
// Query: GetContentTreeNavigation
// Variables: { pageID, language, templateId: BASE_PAGE_ID }
```

## Example Content Entry
No content entry is required. This is a fully structural/system component. Place it on any page or layout design where a contextual sidebar is needed — the navigation items are populated automatically from the content tree at request time.

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemId: "<target-page-item-id>",
  renderingId: "ee2de1d3-7190-4265-b528-f6d8f9c82fcf",
  placeholderName: "<placeholder-name>",
  // No datasource required
});
```

### Notes
- No datasource is needed. The component uses the current page's item ID from layout data.
- Pages that do not inherit from the base page template (`F34E99C9-9782-4E4B-AA95-9FF88394F3F2`) are excluded from sibling/child results.
- If the current page has no parent or its GraphQL data cannot be fetched, the component renders `null` silently.
- Theme styling is inherited from the `useFrame` hook (`effectiveTheme`).

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
