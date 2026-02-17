# Header Component

## Purpose

The Header component provides the main site navigation, featuring a logo, mega menu navigation links (fetched via GraphQL from child items), search functionality, and responsive mobile menu with hamburger toggle. It includes placeholders for tertiary navigation and supports hiding via a demo field. The component uses a secondary theme (dark background) by default.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Navigation/Header`
- **Template Name:** `Header`

### Child Item Templates

The header navigation is built from a hierarchy of child items:

| Template | Purpose |
|----------|---------|
| Header Child | Top-level nav item (may contain link groups) |
| Header Link | Individual navigation link |
| Header Link Group | Grouped links within a mega menu |

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| logo | Image | Yes | Site logo displayed in header | Recommended: SVG, height auto-scales |
| searchLink | General Link | No | Link for search functionality | [VERIFY: May be deprecated] |
| demo | Checkbox | No | When checked, hides the component | For staging/demo purposes |

### Navigation Structure (Child Items)

Navigation is built from child items under the Header datasource:

```
Header (datasource)
├── Products (HeaderChild)
│   ├── link: /products
│   ├── Software (HeaderLinkGroup)
│   │   ├── link: /products/software
│   │   ├── Enterprise (HeaderLink)
│   │   └── SMB (HeaderLink)
│   └── Services (HeaderLinkGroup)
│       ├── link: /products/services
│       └── Consulting (HeaderLink)
├── About Us (HeaderChild)
│   └── link: /about
└── Contact (HeaderChild)
    └── link: /contact
```

## GraphQL Query

```graphql
query GetHeaderNavigation(
  $datasourcePath: String!
  $linkTemplateId: String!
  $childTemplateId: String!
  $linkGroupTemplateId: String!
  $language: String = "en"
) {
  item(path: $datasourcePath, language: $language) {
    id
    name
    links: children(includeTemplateIDs: [$childTemplateId]) {
      results {
        displayName
        ... on HeaderChild {
          ...LinkListFieldFragment
          link { ...LinkFieldFragment }
          linkGroup: children(includeTemplateIDs: [$linkGroupTemplateId]) {
            results {
              displayName
              ... on HeaderLinkGroup {
                ...LinkListFieldFragment
                link { ...LinkFieldFragment }
              }
            }
          }
        }
      }
    }
  }
}
```

## Placeholder Configuration

| Placeholder Key | Purpose | Allowed Components |
|-----------------|---------|-------------------|
| `tertiarynav` | Secondary navigation bar | TertiaryNav, LanguageSwitcher, Login |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| logo | `<Image className="h-6 w-auto invert lg:h-8" field={fields?.logo} />` | `import { Image } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Content Authoring Instructions

### Field-by-Field Guidance

#### logo

- **Type:** Image
- **Required:** Yes
- **Recommended format:** SVG or transparent PNG
- **Note:** Logo is automatically inverted (white) for dark background
- **Dimensions:** Height auto-scales to 24px (mobile) / 32px (desktop)
- **Media Library path:** `/sitecore/media library/Project/[Site]/Logos/`
- **Example:**
  ```json
  {
    "value": {
      "src": "/-/media/Project/Site/Logos/logo.svg",
      "alt": "Company Name"
    }
  }
  ```

#### demo

- **Type:** Checkbox
- **Required:** No
- **Purpose:** When checked, hides the entire component
- **Use case:** Hide component on production while testing

### Creating Navigation Items

#### Step 1: Create Header Child (Top-Level Nav)

1. Under the Header datasource, create items using `Header Child` template
2. Set the `link` field for the main navigation link
3. Add display name for the nav label

#### Step 2: Create Link Groups (Mega Menu Categories)

1. Under each Header Child, create items using `Header Link Group` template
2. Set the `link` field for the category link
3. Add display name for the category label

#### Step 3: Create Individual Links

1. Under Link Groups or Header Children, create items using `Header Link` template
2. Set the `link` field for each navigation link

## Component Props Interface

```typescript
type HeaderRenderingProps = {
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

## Content Examples

### Header Datasource Fields

```json
{
  "fields": {
    "logo": {
      "value": {
        "src": "/-/media/Project/Site/Logos/logo.svg",
        "alt": "Company Name"
      }
    },
    "demo": { "value": false }
  }
}
```

### Navigation Child Item (Header Child)

```json
{
  "displayName": "Products",
  "link": {
    "value": {
      "href": "/products",
      "text": "Products"
    }
  }
}
```

## Visual Layout

### Desktop
```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Logo]    Products ▼    About Us    Contact              [🔍]          │
│            ┌─────────────────────────────────────┐                       │
│            │ Software          Services          │  (mega menu dropdown) │
│            │  • Enterprise      • Consulting     │                       │
│            │  • SMB             • Support        │                       │
│            └─────────────────────────────────────┘                       │
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile
```
┌──────────────────────────────────────┐
│  [☰]        [Logo]           [🔍]    │
├──────────────────────────────────────┤
│  Products ▼                          │  (accordion menu)
│    • Software                        │
│    • Services                        │
│  About Us                            │
│  Contact                             │
│  [Tertiary Nav items]                │
└──────────────────────────────────────┘
```

## Responsive Behavior

| Viewport | Navigation Style | Search |
|----------|-----------------|--------|
| Desktop (≥ 1024px) | Horizontal with mega menu dropdowns | Icon button |
| Mobile (< 1024px) | Hamburger menu with accordion | Icon button |

## Sitecore XM Cloud Specifics

### Content Editor Path

- Header: `/sitecore/content/[Site]/Home/Data/Navigation/Header`
- Navigation items: Created as children under Header item

### Experience Editor Behavior

- **Inline editable:** Logo selection
- **Navigation editing:** Manage child items in Content Editor
- **Mobile menu:** Not visible in Experience Editor
- **Mega menu:** Hover states work in preview mode

### Theme Configuration

- Uses `secondary` theme (dark background, light text)
- Logo is inverted for visibility

## Authoring Rules

1. **Logo Format:** Use SVG or transparent PNG
2. **Nav Structure:** Keep top-level items to 5-7 for usability
3. **Mega Menu:** Use link groups for complex navigation
4. **Mobile Testing:** Test accordion behavior on mobile
5. **Link Text:** Keep nav labels short and descriptive

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Non-transparent logo | White background on dark header | Use transparent PNG or SVG |
| Too many top-level items | Navigation overwhelming | Limit to 5-7 items |
| Missing links | Nav items not clickable | Set link field on all items |
| Deep nesting | Complex mega menus confuse users | Keep to 2-3 levels max |

## Related Components

- `TertiaryNav` - Secondary navigation placed in header placeholder
- `FooterMain` - Footer component (shares logo styling)
- `LanguageSwitcher` - Language selector in tertiarynav placeholder
- `Login` - Authentication component in tertiarynav placeholder

---

## MCP Authoring Instructions

### Step 1: Create Header Datasource

```javascript
const headerDatasource = await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentPath: "/sitecore/content/Site/Home/Data/Navigation",
  templatePath: "/sitecore/templates/Project/Site/Navigation/Header",
  name: "Main Header",
  language: "en"
});
```

### Step 2: Set Logo Field

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: headerDatasource.itemId,
  language: "en",
  fields: {
    "logo": "<image mediaid='{LOGO-MEDIA-GUID}' />"
  }
});
```

### Step 3: Create Navigation Items

```javascript
// Create top-level nav item
const productsNav = await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentPath: headerDatasource.itemPath,
  templatePath: "/sitecore/templates/Project/Site/Navigation/Header Child",
  name: "Products",
  language: "en"
});

await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: productsNav.itemId,
  language: "en",
  fields: {
    "link": "<link text='Products' linktype='internal' url='/products' />"
  }
});

// Create link group under Products
const softwareGroup = await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentPath: productsNav.itemPath,
  templatePath: "/sitecore/templates/Project/Site/Navigation/Header Link Group",
  name: "Software",
  language: "en"
});
```

### Step 4: Add Header to Page

```javascript
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "header-rendering-id",
  placeholderPath: "headless-header",
  componentItemName: "Header_Main",
  language: "en",
  dataSourceId: headerDatasource.itemId
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| logo | Image | `<image mediaid='{GUID}' />` |
| demo | Checkbox | `"1"` (checked) or `""` (unchecked) |
| link (child items) | General Link | `<link text='Text' linktype='internal' url='/path' />` |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
