# ContentTreeSideNav Component

## Purpose

The ContentTreeSideNav component displays a contextual side navigation based on the current page's position in the Sitecore content tree. It shows the parent page, sibling pages, and child pages of the current page, creating an automatic navigation structure without manual datasource configuration. This is ideal for documentation sites, product catalogs, or any hierarchical content structure.

## Sitecore Template Requirements

### Data Source

**Important:** This component does NOT use a datasource. It reads the page hierarchy from the **route context** via GraphQL, automatically building navigation from the content tree structure.

### GraphQL Query

```graphql
query GetContentTreeNavigation($pageID: String!, $language: String!, $templateId: String!) {
  item(path: $pageID, language: $language) {
    ...PageFieldsFragment
    children(includeTemplateIDs: [$templateId]) {
      total
      results {
        ...PageFieldsFragment
      }
    }
    parent {
      ...PageFieldsFragment
      children(includeTemplateIDs: [$templateId]) {
        total
        results {
          ...PageFieldsFragment
        }
      }
    }
  }
}
```

### Template Filtering

The component filters pages by template ID (Base Page template), ensuring only proper page items appear in navigation.

## Content Authoring Instructions

### Automatic Behavior

Navigation is **automatically generated** from the Sitecore content tree:

1. **Parent Section:** Displays the parent page as the section heading
2. **Sibling Pages:** Lists all pages at the same level as the current page
3. **Child Pages:** When viewing a page, its children appear nested below it
4. **Current Page:** Highlighted (bold, not linked)

### Optimizing Navigation

To customize the navigation display:

1. **Display Names:** Edit each page's `displayName` field for user-friendly labels
2. **Page Order:** Adjust sort order in Sitecore for proper sequencing
3. **Content Structure:** Organize content tree logically for meaningful navigation
4. **Template Assignment:** Only pages using the Base Page template appear

### Example Navigation Structure

For a page at `/documentation/getting-started/installation`:

```
Documentation (parent link)
  ├── Quick Start          (sibling)
  ├── Getting Started      (current - bold)
  │   ├── Installation     (child - if viewing Getting Started)
  │   └── Configuration    (child)
  └── Advanced Topics      (sibling)
```

## Component Props Interface

```typescript
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
```

## Visual Layout

```
┌─────────────────────────────┐
│  Documentation              │  (parent - link)
│  ├── Quick Start            │  (sibling - link)
│  ├── Getting Started        │  (current - bold)
│  │   ├── Installation       │  (child - link)
│  │   └── Configuration      │  (child - link)
│  └── Advanced Topics        │  (sibling - link)
└─────────────────────────────┘
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- No dedicated item path - uses page hierarchy
- Configure page display names and sort order at each level

### Experience Editor Behavior

- **Not directly editable:** Navigation is auto-generated
- **Updating navigation:** Edit page `displayName` fields in Content Editor
- **Adding pages:** Create new pages under the appropriate parent
- **Removing pages:** Delete or unpublish pages

### Styling

- Container: Rounded border, primary theme background, padding
- Parent link: Accent background, bold text
- Current page: Bold black text (not linked)
- Sibling/child links: Blue links with hover underline

## Authoring Rules

1. **Display Names:** Always set meaningful display names on pages
2. **Consistent Structure:** Maintain consistent depth across sections
3. **Logical Grouping:** Group related pages under common parents
4. **Sort Order:** Configure sort order for logical navigation flow

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Missing display names | Shows item names (technical) | Set displayName on all pages |
| Orphan pages | Missing from navigation | Place under appropriate parent |
| Wrong template | Page excluded from nav | Use Base Page template |
| No children | Shows empty parent | Add child pages or use different nav |

## Related Components

- `Breadcrumbs` - Shows hierarchical path to current page
- `SideNav` - Manually configured side navigation
- `Header` - Main navigation header

---

## MCP Authoring Instructions

### Adding ContentTreeSideNav to Page

Since this component has no datasource, simply add it to the page:

```javascript
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "content-tree-side-nav-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ContentTreeSideNav_1",
  language: "en",
  fields: {}  // No fields to set
});
```

### Optimizing Navigation Display

Update page display names for better navigation labels:

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "displayName": "Getting Started Guide"
  }
});
```

### Creating Navigation Structure

Create child pages to build navigation hierarchy:

```javascript
// Create parent section
const parentPage = await mcp__marketer__create_page({
  siteName: "main",
  parentPath: "/sitecore/content/Site/Home",
  pageName: "Documentation",
  templateId: "base-page-template-id",
  language: "en"
});

// Create child pages
await mcp__marketer__create_page({
  siteName: "main",
  parentPath: parentPage.path,
  pageName: "Getting Started",
  templateId: "base-page-template-id",
  language: "en"
});
```

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
