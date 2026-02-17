# FooterCol Component

## Purpose

The FooterCol component displays a single column within the footer navigation, featuring a heading and a list of navigation links. It supports responsive behavior with an accordion pattern on mobile devices (collapsible sections) and expanded display on desktop. The component is designed to be placed within a FooterMenu placeholder to create organized footer navigation.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Footer/Footer Column`
- **Template Name:** `Footer Column`

### Child Item Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Footer/Footer Link`
- **Template Name:** `Footer Link`
- **Purpose:** Child items under the Footer Column datasource, each containing a single link

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Column heading displayed above links | Recommended max 30 characters |

### Child Item Fields (Footer Link)

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| link | General Link | Yes | Navigation link with text and URL | Internal, external, or media links |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text tag="h3" className="heading-sm text-content" field={fields?.heading} />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| link (child items) | `<Button link={link?.jsonValue} variant="link" />` | Custom Button component |

## GraphQL Query

The component fetches child link items via GraphQL:

```graphql
query GetFooterColumnLinks($datasourcePath: String!, $language: String!, $templateId: String!) {
  item(path: $datasourcePath, language: $language) {
    links: children(includeTemplateIDs: [$templateId]) {
      results {
        ... on FooterLink {
          link {
            ...LinkFieldFragment
          }
        }
      }
    }
  }
}
```

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The column category name (e.g., "Products", "Resources", "Company")
- **Tone/Style:** Concise, descriptive category labels
- **Character limit:** 30 characters recommended
- **Example:** "Resources"

### Creating Footer Links (Child Items)

1. Navigate to the Footer Column datasource item
2. Create child items using the `Footer Link` template
3. For each link:
   - Set the `link` field with URL and display text
   - Use internal links for site pages
   - Use external links for external resources

#### link (Child Item)

- **Type:** General Link
- **Required:** Yes
- **Link Types:** Internal, External, Media
- **Guidance:** Use descriptive link text; avoid "Click here"
- **Example:**
  ```json
  {
    "value": {
      "href": "/about-us",
      "text": "About Us",
      "target": "",
      "title": "Learn about our company"
    }
  }
  ```

## Component Props Interface

```typescript
type FooterColFields = {
  heading: Field<string>;
};

type FooterColRenderingType = {
  rendering: ComponentRendering & {
    data?: {
      item?: {
        links?: {
          results?: PageLinkType[];
        };
      };
    };
  };
};

type FooterColProps = ComponentProps &
  FooterColRenderingType & {
    fields: FooterColFields;
  };

type PageLinkType = {
  link: LinkGQLType;
  isFirst?: boolean;
};
```

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "heading": { "value": "Resources" }
  }
}
```

### With Child Link Items

**Parent Item:**
```json
{
  "fields": {
    "heading": { "value": "Resources" }
  }
}
```

**Child Items (Footer Links):**
```json
[
  {
    "link": {
      "value": {
        "href": "/documentation",
        "text": "Documentation"
      }
    }
  },
  {
    "link": {
      "value": {
        "href": "/support",
        "text": "Support Center"
      }
    }
  },
  {
    "link": {
      "value": {
        "href": "https://blog.example.com",
        "text": "Blog",
        "target": "_blank"
      }
    }
  }
]
```

## Responsive Behavior

| Viewport | Behavior |
|----------|----------|
| Mobile (< 1024px) | Accordion pattern - heading toggles link visibility |
| Desktop (≥ 1024px) | Expanded - heading and all links always visible |

## Sitecore XM Cloud Specifics

### Content Editor Path

- Footer Columns: `/sitecore/content/[Site]/Home/Data/Footer/[Footer Menu]/[Footer Column]`
- Footer Links: Created as children under each Footer Column

### Experience Editor Behavior

- **Inline editable:** heading field
- **Link management:** Add/edit child link items in Content Editor
- **Accordion testing:** Accordion behavior only visible in preview mode, not Experience Editor

## Authoring Rules

1. **Consistent Column Count:** Keep footer columns balanced across the footer
2. **Link Limit:** Recommend 5-8 links per column for optimal usability
3. **Link Order:** Place most important links at the top
4. **Descriptive Text:** Use clear, action-oriented link text

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Too many links | Overwhelming for users | Limit to 5-8 links per column |
| Generic link text | Poor accessibility/SEO | Use descriptive, unique link text |
| Missing heading | Column appears empty on mobile | Always provide a heading |
| Broken links | Poor user experience | Verify all links before publishing |

## Related Components

- `FooterMenu` - Parent container that holds multiple FooterCol components
- `FooterMain` - Alternative footer layout with newsletter section
- `FooterLegal` - Legal links and copyright section

---

## MCP Authoring Instructions

### Prerequisites

Before authoring FooterCol via MCP:
1. Have the parent FooterMenu page/placeholder ID
2. Have the FooterCol rendering ID from the component manifest
3. Know the target placeholder (typically within FooterMenu)

### Step 1: Create FooterCol Datasource

```javascript
// Create the Footer Column datasource item
const datasource = await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentPath: "/sitecore/content/Site/Home/Data/Footer",
  templatePath: "/sitecore/templates/Project/Site/Footer/Footer Column",
  name: "Resources Column",
  language: "en"
});
```

### Step 2: Set Heading Field

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasource.itemId,
  language: "en",
  fields: {
    "heading": "Resources"
  }
});
```

### Step 3: Create Child Link Items

```javascript
// Create first link
await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentPath: datasource.itemPath,
  templatePath: "/sitecore/templates/Project/Site/Footer/Footer Link",
  name: "Documentation Link",
  language: "en"
});

// Set link field using General Link format
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: linkItemId,
  language: "en",
  fields: {
    "link": "<link text='Documentation' linktype='internal' url='/documentation' />"
  }
});
```

### Step 4: Add Component to Page

```javascript
await mcp__marketer-mcp__add_component_on_page({
  pageId: footerMenuPageId,
  componentRenderingId: "footer-col-rendering-id",
  placeholderPath: "footermenu",
  componentItemName: "FooterCol_Resources",
  language: "en",
  dataSourceId: datasource.itemId
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| link (child) | General Link | `<link text='Text' linktype='internal' url='/path' />` |

### MCP Authoring Checklist

- [ ] Create Footer Column datasource
- [ ] Set heading field
- [ ] Create child Footer Link items
- [ ] Set link fields on each child item
- [ ] Add FooterCol component to FooterMenu placeholder
- [ ] Publish all items

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
