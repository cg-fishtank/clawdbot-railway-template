# Header Component

## Purpose
The Header component renders the primary site-wide navigation bar, supporting both desktop and mobile layouts. On desktop it displays a logo, a mega-menu/dropdown navigation powered by `PageList` and its child components (`DropdownMenu`, `MegaMenu`, `MenuItems`), a search button that opens `SearchModal`, and the tertiary navigation bar via a dynamic Placeholder. On mobile it collapses into a hamburger menu with an accordion-animated drawer (`AccordionMotion`) containing the full page list and tertiary nav items. Navigation link data is fetched server-side via `getComponentServerProps` using the `GetHeaderNavigation` GraphQL query against the component's datasource, and the `demo` field on the datasource allows the entire header to be hidden in demo/preview scenarios. An accessibility `BypassBlock` child component provides a skip-to-content link for keyboard users.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `ddd5f8c3-6e84-404a-b49d-43bbf28d00f4` |
| **Component Name** | `Header` |
| **Category** | `Navigation` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `logo` | Image Field | No | Site logo image displayed in the header bar and linked to the home page (`/`) |
| `searchLink` | Link Field | No | Reserved link field for search; currently search is triggered via the modal button rather than a direct link |
| `demo` | Checkbox (`Field<string \| boolean>`) | No | When checked (`true`/`"1"`/`"true"`), hides the entire header — used to suppress display in demo/preview modes |

## Placeholders
| Placeholder | Key Pattern | Accepted Components | Description |
|-------------|-------------|---------------------|-------------|
| Tertiary Navigation | `tertiarynav-{uid}` (generated via `placeholderGenerator`) | TertiaryNav | Rendered above the main nav bar on desktop; also rendered inside the mobile drawer |

## JSS Field Component Mapping
| Field | JSS Component | Notes |
|-------|---------------|-------|
| `fields.logo` | `<Image field={fields?.logo} />` | Rendered as an `<img>` via the JSS `Image` component; inverted via CSS (`invert` class) |
| Navigation links | Not JSS fields — fetched via GraphQL into `rendering.data.item.links.results` | Consumed by `PageList` child component |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Full site header with logo, mega-menu, search, and tertiary nav; wrapped with `withDatasourceCheck` |

## Props Interface
```typescript
// From: src/components/Navigation/Header/Header.tsx

export type HeaderRenderingProps = {
  rendering: ComponentRendering & {
    data?: {
      item?: {
        links?: {
          results?: LinkGQLProps[];
        };
      };
    };
  };
};

type HeaderProps = ComponentProps &
  HeaderRenderingProps & {
    fields: {
      searchLink: LinkField;
      logo: ImageField;
      demo?: Field<string | boolean>;
    };
  };
```

## Child Component Summary

| File | Role |
|------|------|
| `component-children/Navigation/Header/BypassBlock.tsx` | Accessibility skip-to-content link; appears on Tab key press, stays hidden otherwise |
| `component-children/Navigation/Header/PageList.tsx` | Renders the list of top-level nav items; switches between `DesktopPageItem` and `MobilePageItem` based on `isMobile` prop |
| `component-children/Navigation/Header/DropdownMenu.tsx` | Simple dropdown panel for nav items that have direct child links (no link groups) |
| `component-children/Navigation/Header/MegaMenu.tsx` | Full mega-menu panel with link groups and column layout; handles overflow detection to prevent viewport clipping |
| `component-children/Navigation/Header/MenuItems.tsx` | Renders an accessible `<ul>` list of navigation links; supports Tab-key focus management callbacks |

## GraphQL Data Structure (from `rendering.data`)
```
item
  links
    results[]
      link { jsonValue { value { href, text, id, linktype } } }
      links { results[] { link { jsonValue } } }           // simple dropdown items
      linkGroup { results[] {                              // mega-menu columns
        displayName
        link { jsonValue }
        links { results[] { link { jsonValue } } }
      }}
```

## Example Content Entry
1. Create a datasource item in Sitecore under the site's navigation folder (e.g., `/sitecore/content/{site}/Navigation/Header`).
2. Upload a logo image and set it on the `logo` field.
3. Create child items of type **Header Child** for each top-level nav entry.
4. Each Header Child can contain child items of type **Header Link** (for dropdown) or **Header Link Group** (for mega-menu columns).
5. Assign the datasource to the Header rendering in Page Builder.

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemId: "<target-page-item-id>",
  renderingId: "ddd5f8c3-6e84-404a-b49d-43bbf28d00f4",
  placeholderName: "<placeholder-name>",
  datasource: "<header-datasource-item-id>",
});
```

### Step 2: Set Logo Field
```javascript
await mcp__marketer_mcp__update_component_fields({
  itemId: "<datasource-item-id>",
  fields: {
    logo: "<sitecore-media-item-id>",
  },
});
```

### Notes
- The component is wrapped with `withDatasourceCheck` — a datasource item is required or the component will not render.
- The `demo` checkbox field can be toggled to hide the header during content review/demo sessions.
- The tertiary nav placeholder (`tertiarynav-{uid}`) accepts `TertiaryNav` components and is rendered both above the desktop header and inside the mobile drawer.
- Search is hidden automatically on the search results page (path matched against `SEARCH_CONFIG.searchPageUrl`).

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
