# SideNav Component

## Purpose
The SideNav component renders a collapsible sidebar navigation panel with one or more accordion-style dropdown groups, each containing a list of links. Navigation structure is defined in Sitecore under the component's datasource using two template types: **SideNav Group** items (which carry a heading) and **SideNav Link** child items (each with a link field). At request time `getComponentServerProps` executes the `GetSideNavigation` GraphQL query to fetch these groups and their links from the datasource, returning structured data through `rendering.data`. On the client, each group is rendered as an expandable accordion section (`SideNavDropdown` using `AccordionMotion`) with a toggle button; external links are decorated with an external-link icon. The component is wrapped with `withDatasourceCheck`, so it requires a properly configured datasource to render.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `8d0d45d7-6e63-4e9c-a90d-4bfbaeec0787` |
| **Component Name** | `SideNav` |
| **Category** | `Navigation` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `heading` | Single-Line Text (`Field<string>`) | No | Optional heading displayed above the accordion groups using the JSS `<Text>` component |

## Placeholders
**Placeholders:** None — this component does not expose any placeholders.

## JSS Field Component Mapping
| Field | JSS Component | Notes |
|-------|---------------|-------|
| `fields.heading` | `<Text field={props.fields?.heading} tag="h2" />` | Rendered as an `h2` with `heading-xl mb-6 text-content` classes above the navigation groups |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard accordion side navigation panel; wrapped with `withDatasourceCheck` |

## Props Interface
```typescript
// From: src/components/Navigation/SideNav/SideNav.tsx

type SideNavFields = {
  heading: Field<string>;
};

type SideNavProps = ComponentProps & {
  fields: SideNavFields;
  rendering?: SideNavRenderingType & (ComponentRendering | string);
};

export type SideNavDropdownFields = {
  heading: Field<string>;
  links: LinkGQLType[];
};

type SideNavDropdownProps = {
  fields: SideNavDropdownFields;
  params: ComponentParams;
  groupId?: string;
  index: number;
};

export type SideNavLinkDataType = {
  link: LinkGQLType;
};

type SideNavGroupDataType = {
  heading: {
    value: string;
  };
  children: {
    results: SideNavLinkDataType[];
  };
};

type SideNavRenderingType = {
  data: {
    item: {
      children: {
        results: SideNavGroupDataType[];
      };
    };
  };
};
```

## GraphQL Data Structure (from `rendering.data`)
```
item (datasource root)
  children
    results[]          ← SideNav Group items
      heading { value }
      children
        results[]      ← SideNav Link items
          link { jsonValue { value { href, text, linktype } } }
```

## GraphQL Template IDs
| Template | ID |
|----------|----|
| SideNav Group | `{B5661A7F-1BA0-4BEA-9333-8894FDC37924}` |
| SideNav Link | `{93193400-F14B-4614-BC49-A888E15373E7}` |

## Example Content Entry

### Datasource Structure in Sitecore
```
/sitecore/content/{site}/Navigation/SideNav/My Side Nav   ← datasource item
  heading: "Resources"
  ├── Group: "Getting Started"   ← SideNav Group item
  │     ├── Link: "Documentation" → /docs
  │     ├── Link: "API Reference" → /api-ref
  │     └── Link: "GitHub" → https://github.com/...
  └── Group: "Support"           ← SideNav Group item
        ├── Link: "Help Center" → /help
        └── Link: "Contact Us" → /contact
```

## MCP Authoring Instructions

### Step 1: Create Datasource Item
```javascript
await mcp__marketer_mcp__create_item({
  parentId: "<navigation-folder-id>",
  templateId: "<sidenav-datasource-template-id>",
  name: "My Side Nav",
  fields: {
    heading: "Resources",
  },
});
```

### Step 2: Create Group Items
```javascript
await mcp__marketer_mcp__create_item({
  parentId: "<datasource-item-id>",
  templateId: "{B5661A7F-1BA0-4BEA-9333-8894FDC37924}", // SideNav Group
  name: "Getting Started",
  fields: {
    heading: "Getting Started",
  },
});
```

### Step 3: Create Link Items Under Each Group
```javascript
await mcp__marketer_mcp__create_item({
  parentId: "<group-item-id>",
  templateId: "{93193400-F14B-4614-BC49-A888E15373E7}", // SideNav Link
  name: "Documentation",
  fields: {
    link: { href: "/docs", text: "Documentation", linktype: "internal" },
  },
});
```

### Step 4: Add to Page
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemId: "<target-page-item-id>",
  renderingId: "8d0d45d7-6e63-4e9c-a90d-4bfbaeec0787",
  placeholderName: "<placeholder-name>",
  datasource: "<datasource-item-id>",
});
```

### Notes
- The component is wrapped with `withDatasourceCheck` — a datasource is required or the component will not render.
- If `rendering.dataSource` is absent, `getComponentServerProps` returns early without executing the GraphQL query.
- External links (where `linktype === 'external'`) automatically receive an `arrow-up-right-from-square` icon via FontAwesome.
- Each accordion group has independent open/close state managed by the `useAccordion` hook scoped to a `sidenavGroupId`.
- The `heading` field on the datasource root item is rendered via the JSS `<Text>` component and supports Experience Editor inline editing.

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
