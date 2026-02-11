# SideNav Component

## Purpose

The SideNav component displays a manually configured side navigation with collapsible accordion groups. Unlike ContentTreeSideNav (which auto-generates from content tree), SideNav uses a datasource with explicitly defined navigation groups and links. It's ideal for curated navigation that doesn't follow the content tree structure, such as documentation sidebars or filtered resource listings.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Navigation/Side Navigation`
- **Template Name:** `Side Navigation`

### Child Item Templates

| Template | Purpose |
|----------|---------|
| SideNavGroups | Navigation group with heading (accordion section) |
| SideNavLinks | Individual link within a group |

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Main SideNav heading (H2) | Recommended max 40 characters |

### Navigation Structure (Child Items)

Navigation is built from a two-level hierarchy:

```
SideNav (datasource)
├── heading: "Documentation"
├── Getting Started (SideNavGroups)
│   ├── heading: "Getting Started"
│   ├── Installation (SideNavLinks)
│   │   └── link: /docs/installation
│   └── Configuration (SideNavLinks)
│       └── link: /docs/configuration
└── Advanced (SideNavGroups)
    ├── heading: "Advanced Topics"
    ├── API Reference (SideNavLinks)
    └── Customization (SideNavLinks)
```

### Child Item Fields (SideNavGroups)

| Field Name | Sitecore Type | Required | Description |
|------------|---------------|----------|-------------|
| heading | Single-Line Text | Yes | Accordion section heading |

### Child Item Fields (SideNavLinks)

| Field Name | Sitecore Type | Required | Description |
|------------|---------------|----------|-------------|
| link | General Link | Yes | Navigation link |

## GraphQL Query

```graphql
query GetSideNavigation(
  $datasourcePath: String!
  $language: String!
  $sideNavGroupTemplateId: String!
  $sideNavLinkTemplateId: String!
) {
  item(path: $datasourcePath, language: $language) {
    children(includeTemplateIDs: [$sideNavGroupTemplateId]) {
      results {
        ... on SideNavGroups {
          heading { value }
          children(includeTemplateIDs: [$sideNavLinkTemplateId]) {
            results {
              ... on SideNavLinks {
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

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading (main) | `<Text field={props.fields?.heading} tag="h2" className="heading-xl mb-6" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| heading (group) | `<Text field={heading} tag="span" className="heading-base" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| link | `<Button link={link?.jsonValue} variant="link" />` | Custom Button component |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading (Main)

- **Type:** Single-Line Text
- **Required:** Yes
- **What to enter:** Overall section heading for the side navigation
- **Example:** "Documentation"

### Creating Navigation Groups

1. Under the SideNav datasource, create items using `SideNavGroups` template
2. Set the `heading` field for the accordion section title
3. Create child `SideNavLinks` items for each navigation link

#### Group heading

- **Type:** Single-Line Text
- **Required:** Yes
- **What to enter:** Accordion section label
- **Example:** "Getting Started"

### Creating Navigation Links

1. Under each SideNavGroups item, create items using `SideNavLinks` template
2. Set the `link` field with URL and display text

#### link

- **Type:** General Link
- **Required:** Yes
- **Link Types:** Internal, External
- **Guidance:** Use descriptive link text
- **Example:**
  ```json
  {
    "value": {
      "href": "/docs/installation",
      "text": "Installation Guide",
      "linktype": "internal"
    }
  }
  ```

## Component Props Interface

```typescript
type SideNavFields = {
  heading: Field<string>;
};

type SideNavProps = ComponentProps & {
  fields: SideNavFields;
  rendering?: SideNavRenderingType & (ComponentRendering | string);
};

type SideNavDropdownFields = {
  heading: Field<string>;
  links: LinkGQLType[];
};

type SideNavGroupDataType = {
  heading: { value: string };
  children: {
    results: SideNavLinkDataType[];
  };
};
```

## Content Examples

### Datasource Item

```json
{
  "fields": {
    "heading": { "value": "Documentation" }
  }
}
```

### Navigation Group (SideNavGroups)

```json
{
  "heading": { "value": "Getting Started" }
}
```

### Navigation Link (SideNavLinks)

```json
{
  "link": {
    "value": {
      "href": "/docs/installation",
      "text": "Installation Guide",
      "linktype": "internal"
    }
  }
}
```

## Visual Layout

```
┌─────────────────────────┐
│  Documentation          │  (main heading)
│                         │
│  ▼ Getting Started      │  (group - expanded)
│    • Installation       │  (link)
│    • Configuration      │  (link)
│    • Quick Start        │  (link)
│                         │
│  ▶ Advanced Topics      │  (group - collapsed)
│                         │
│  ▶ API Reference        │  (group - collapsed)
└─────────────────────────┘
```

## Accordion Behavior

- **Initial State:** First group expanded by default
- **Toggle:** Click group heading to expand/collapse
- **Multiple Open:** Multiple groups can be open simultaneously
- **Animation:** Smooth height transition on toggle

## Sitecore XM Cloud Specifics

### Content Editor Path

- SideNav: `/sitecore/content/[Site]/Home/Data/Navigation/[SideNav Name]`
- Groups: Created as children under SideNav item
- Links: Created as children under each Group item

### Experience Editor Behavior

- **Inline editable:** Main heading, group headings
- **Link management:** Edit links via Content Editor
- **Accordion preview:** Accordion works in Experience Editor

### Styling

- Container: Rounded border, primary background, padding
- Groups: Separated by border, padding
- Links: Primary color, hover underline, external link icon for external URLs

## Authoring Rules

1. **Logical Grouping:** Group related links under meaningful headings
2. **Link Limit:** 3-8 links per group for optimal usability
3. **Consistent Naming:** Use clear, consistent naming conventions
4. **External Links:** Mark external links appropriately

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Too many groups | Overwhelming navigation | Limit to 4-6 groups |
| Empty groups | Accordion collapses to nothing | Remove empty groups |
| Unclear headings | Users can't find content | Use descriptive group names |
| Missing links | Groups appear incomplete | Ensure all links populated |

## Related Components

- `ContentTreeSideNav` - Auto-generated side navigation from content tree
- `Breadcrumbs` - Complementary navigation showing page path
- `Header` - Main site navigation

---

## MCP Authoring Instructions

### Step 1: Create SideNav Datasource

```javascript
const sideNavDatasource = await mcp__marketer__create_content_item({
  siteName: "main",
  parentPath: "/sitecore/content/Site/Home/Data/Navigation",
  templatePath: "/sitecore/templates/Project/Site/Navigation/Side Navigation",
  itemName: "Documentation SideNav",
  language: "en"
});

// Set main heading
await mcp__marketer__update_content({
  siteName: "main",
  itemId: sideNavDatasource.itemId,
  language: "en",
  fields: {
    "heading": "Documentation"
  }
});
```

### Step 2: Create Navigation Groups

```javascript
const gettingStartedGroup = await mcp__marketer__create_content_item({
  siteName: "main",
  parentPath: sideNavDatasource.itemPath,
  templatePath: "/sitecore/templates/Project/Site/Navigation/SideNavGroups",
  itemName: "Getting Started",
  language: "en"
});

await mcp__marketer__update_content({
  siteName: "main",
  itemId: gettingStartedGroup.itemId,
  language: "en",
  fields: {
    "heading": "Getting Started"
  }
});
```

### Step 3: Create Navigation Links

```javascript
const installationLink = await mcp__marketer__create_content_item({
  siteName: "main",
  parentPath: gettingStartedGroup.itemPath,
  templatePath: "/sitecore/templates/Project/Site/Navigation/SideNavLinks",
  itemName: "Installation",
  language: "en"
});

await mcp__marketer__update_content({
  siteName: "main",
  itemId: installationLink.itemId,
  language: "en",
  fields: {
    "link": "<link text='Installation Guide' linktype='internal' url='/docs/installation' />"
  }
});
```

### Step 4: Add SideNav to Page

```javascript
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "sidenav-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "SideNav_Docs",
  language: "en",
  dataSourceId: sideNavDatasource.itemId
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| link | General Link | `<link text='Text' linktype='internal' url='/path' />` |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
