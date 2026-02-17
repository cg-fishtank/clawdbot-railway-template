# Breadcrumbs Component

## Purpose

The Breadcrumbs component displays a hierarchical navigation path showing the user's current location within the site structure. It automatically builds the breadcrumb trail from the page hierarchy in Sitecore, using page display names and URLs. The component reads from route context rather than a datasource, making it fully automatic based on content tree structure.

## Sitecore Template Requirements

### Data Source

**Important:** This component does NOT use a datasource. It reads the page hierarchy from the **route context** and layout service data automatically.

### Template Path

- No dedicated template required
- Uses page item `displayName` fields for breadcrumb labels
- Uses page URLs for navigation

### Route Context Fields

| Field Name | Source | Description |
|------------|--------|-------------|
| heading | Page item fields | Used for current page title (optional override) |
| displayName | Page item | Default breadcrumb label |
| path | URL path | Navigation URL for each breadcrumb level |

## Content Authoring Instructions

### Automatic Behavior

Breadcrumbs are **automatically generated** from the Sitecore content tree structure:

1. **Display Names:** Each breadcrumb uses the page's `displayName` or `name` field
2. **URLs:** Links are built from the content tree path
3. **Current Page:** The last item shows only the page title (not clickable)

### Optimizing Breadcrumbs

To customize breadcrumb display:

1. **Set Display Names:** Edit each page's `displayName` field for user-friendly labels
2. **Content Structure:** Organize content tree logically for meaningful paths
3. **Page Titles:** Ensure `heading` field on pages is set for proper current page display

### Example Path Generation

For a page at `/sitecore/content/Site/Home/Products/Software/Enterprise`:

```
Home > Products > Software > Enterprise
  ↓        ↓         ↓          ↓
  /     /products  /products   (current
                   /software    page)
```

## Component Props Interface

```typescript
type BreadcrumbPathType = {
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

## Content Examples

### Generated Output Example

For URL `/products/software/enterprise`:

```json
{
  "breadcrumbs": [
    { "name": "Products", "path": "/products" },
    { "name": "Software", "path": "/products/software" }
  ],
  "currentPage": "Enterprise Solutions"
}
```

## Visual Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│  Products  >  Software  >  Enterprise Solutions                        │
│     ↑            ↑              ↑                                      │
│   (link)      (link)       (current - no link)                         │
└────────────────────────────────────────────────────────────────────────┘
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- No dedicated item path - uses page hierarchy
- Configure page display names at each level

### Experience Editor Behavior

- **Not directly editable:** Breadcrumbs are auto-generated
- **Updating breadcrumbs:** Edit page `displayName` fields in Content Editor
- **Theming:** Inherits theme from parent/Frame context

### Rendering Parameters (Styles)

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| theme | Droplist | primary, secondary, tertiary | (inherited) | Background/text theme |

## Authoring Rules

1. **Display Names:** Always set meaningful display names on pages
2. **Avoid Deep Nesting:** Keep content tree reasonably shallow (4-5 levels max)
3. **Consistent Naming:** Use consistent naming conventions across sections
4. **Home Page:** Home page is excluded from visible breadcrumbs (implicit)

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Missing display names | Shows item names (technical) | Set displayName on all pages |
| Deep nesting | Long, unwieldy breadcrumbs | Restructure content tree |
| Confusing page names | Users get lost | Use clear, descriptive names |
| Inconsistent capitalization | Unprofessional appearance | Use title case consistently |

## Related Components

- `Header` - Main navigation typically appears above breadcrumbs
- `ContentTreeSideNav` - Alternative navigation showing sibling pages
- `SideNav` - Manual side navigation component

---

## MCP Authoring Instructions

### Adding Breadcrumbs to Page

Since Breadcrumbs has no datasource, simply add the component:

```javascript
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "breadcrumbs-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "Breadcrumbs_1",
  language: "en",
  fields: {}  // No fields to set
});
```

### Updating Breadcrumb Labels

To change breadcrumb labels, update page display names:

```javascript
// Update a parent page's display name
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: parentPageId,
  language: "en",
  fields: {
    "displayName": "Products & Services"  // Standard Sitecore field
  }
});
```

### MCP Authoring Checklist

- [ ] Have page ID for component placement
- [ ] Have Breadcrumbs rendering ID
- [ ] Verify parent pages have appropriate displayName values
- [ ] Test breadcrumb trail after deployment

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
