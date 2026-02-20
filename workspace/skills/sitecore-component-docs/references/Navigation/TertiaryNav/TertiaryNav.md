# TertiaryNav Component

## Purpose
The TertiaryNav component renders the thin utility navigation bar that sits above the main Header on desktop and inside the Header's mobile drawer. It serves two purposes simultaneously: it renders a horizontal list of direct links from its datasource (fetched via the `GetTertiaryNavigation` GraphQL query on **Header Child** template items), and it exposes a `tertiarynavcomponents` placeholder that accepts system components such as `LanguageSwitcher`, `Login`, and `PersonaSwitcher`. The `demo` field allows the entire bar to be hidden for demo or preview scenarios. Like the Header, `getComponentServerProps` also fetches the datasource item name to populate the `data-source-name` debug attribute, and the component is wrapped with `withDatasourceCheck`.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `5b957e87-7c1f-4fa6-b0f8-be2e9df59303` |
| **Component Name** | `TertiaryNav` |
| **Category** | `Navigation` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `demo` | Checkbox (`Field<string \| boolean>`) | No | When checked (`true`/`"1"`/`"true"`), hides the entire TertiaryNav bar — mirrors the same pattern used in the Header component |

## Placeholders
| Placeholder | Key Pattern | Accepted Components | Description |
|-------------|-------------|---------------------|-------------|
| Tertiary Nav Components | `tertiarynavcomponents-{uid}` (generated via `placeholderGenerator`) | LanguageSwitcher, Login, PersonaSwitcher | Slot for system/utility components rendered at the right side of the bar on desktop and stacked on mobile |

## JSS Field Component Mapping
| Field | JSS Component | Notes |
|-------|---------------|-------|
| `fields.demo` | No JSS component — read as raw value | Evaluates to `true` when `value === '1'`, `true`, or `'true'`; hides the component via `cn(..., isDemoHidden && 'hidden')` |
| Navigation links | Not JSS fields — fetched via GraphQL into `rendering.data.item.links.results` | Rendered by `NavList` / `NavItem` sub-components using the `Button` component |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Full tertiary bar with link list and system-component placeholder; wrapped with `withDatasourceCheck` |

## Props Interface
```typescript
// From: src/components/Navigation/TertiaryNav/TertiaryNav.tsx

type TertiaryNavRenderingProps = {
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

type TertiaryNavProps = ComponentProps &
  TertiaryNavRenderingProps & {
    fields?: {
      demo?: Field<string | boolean>;
    };
  };

type NavListProps = TertiaryNavRenderingProps & ClassNameProps;
```

## GraphQL Data Structure (from `rendering.data`)
```
item (datasource root)
  links
    results[]          ← Header Child template items
      link { jsonValue { value { href, text, linktype } } }
```

The query filters children by `HEADER_CHILD_ID` template (`lib/graphql/id`), ensuring only items of the correct template type appear in the nav list.

## Example Content Entry

### Datasource Structure in Sitecore
```
/sitecore/content/{site}/Navigation/TertiaryNav/My Tertiary Nav   ← datasource item
  demo: (unchecked)
  ├── Header Child: "About Us" → /about
  ├── Header Child: "Careers" → /careers
  └── Header Child: "Contact" → /contact
```

The `tertiarynavcomponents` placeholder accepts:
- `LanguageSwitcher` (rendering ID: `0f8af5fd-1363-456c-bb35-65625e1ee354`)
- `Login` (rendering ID: `1b6ddc7a-d7cf-4137-8b2d-95d40de82d79`)
- `PersonaSwitcher` (rendering ID: `e1c34e3c-f878-46f1-8453-7cd18c796585`)

## MCP Authoring Instructions

### Step 1: Create Datasource Item
```javascript
await mcp__marketer_mcp__create_item({
  parentId: "<navigation-folder-id>",
  templateId: "<tertiarynav-datasource-template-id>",
  name: "My Tertiary Nav",
  fields: {
    demo: "0", // 0 = visible, 1 = hidden
  },
});
```

### Step 2: Create Link Items (Header Child template)
```javascript
await mcp__marketer_mcp__create_item({
  parentId: "<datasource-item-id>",
  templateId: "<header-child-template-id>", // HEADER_CHILD_ID from lib/graphql/id
  name: "About Us",
  fields: {
    link: { href: "/about", text: "About Us", linktype: "internal" },
  },
});
```

### Step 3: Add TertiaryNav to Page
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemId: "<target-page-item-id>",
  renderingId: "5b957e87-7c1f-4fa6-b0f8-be2e9df59303",
  placeholderName: "<placeholder-name>",
  datasource: "<datasource-item-id>",
});
```

### Step 4: Add System Components to the Placeholder
```javascript
// Add LanguageSwitcher
await mcp__marketer_mcp__add_component_on_page({
  itemId: "<target-page-item-id>",
  renderingId: "0f8af5fd-1363-456c-bb35-65625e1ee354",
  placeholderName: "tertiarynavcomponents-{uid}",
});

// Add Login (requires NEXT_PUBLIC_ENABLE_AUTH=true)
await mcp__marketer_mcp__add_component_on_page({
  itemId: "<target-page-item-id>",
  renderingId: "1b6ddc7a-d7cf-4137-8b2d-95d40de82d79",
  placeholderName: "tertiarynavcomponents-{uid}",
});
```

### Notes
- The component is wrapped with `withDatasourceCheck` — a datasource is required or the component will not render.
- The `tertiarynavcomponents` placeholder is displayed only when it contains at least one component (guarded by `components.length > 0` in the `render` callback).
- The TertiaryNav is rendered inside a `FrameProvider` with `{ Styles: 'theme:secondary' }`, which sets the secondary theme for all child components including `LanguageSwitcher`, `Login`, and `PersonaSwitcher`.
- The `demo` field mirrors the pattern in the Header — it allows both bars to be hidden together during demos by checking a single checkbox on each.
- The `data-source-name` attribute is populated with the actual Sitecore item name (fetched via `GetItemById`) to aid debugging in the browser dev tools.

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
