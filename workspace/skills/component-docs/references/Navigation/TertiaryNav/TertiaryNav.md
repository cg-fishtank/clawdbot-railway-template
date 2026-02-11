# TertiaryNav Component

## Purpose

The TertiaryNav component displays a secondary navigation bar, typically placed above the main header. It contains utility links (like "Contact Sales", "Support") and provides a placeholder for additional components such as LanguageSwitcher, Login, or PersonaSwitcher. The component uses a secondary theme and supports hiding via a demo field.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Navigation/Tertiary Navigation`
- **Template Name:** `Tertiary Navigation`

### Child Item Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Navigation/Header Child`
- **Template Name:** `Header Child`
- **Purpose:** Individual navigation links

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| demo | Checkbox | No | When checked, hides the component | For staging/demo purposes |

### Child Item Fields (Header Child)

| Field Name | Sitecore Type | Required | Description |
|------------|---------------|----------|-------------|
| link | General Link | Yes | Navigation link with text and URL |

## Placeholder Configuration

| Placeholder Key | Purpose | Allowed Components |
|-----------------|---------|-------------------|
| `tertiarynavcomponents` | Utility components | LanguageSwitcher, Login, PersonaSwitcher |

## GraphQL Query

```graphql
query GetTertiaryNavigation($datasourcePath: String!, $language: String!, $templateId: String!) {
  item(path: $datasourcePath, language: $language) {
    links: children(includeTemplateIDs: [$templateId]) {
      results {
        ... on HeaderChild {
          link {
            ...LinkFieldFragment
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
| link (child items) | `<Button link={link?.jsonValue} variant="link" className="copy-xs no-underline" />` | Custom Button component |

## Content Authoring Instructions

### Field-by-Field Guidance

#### demo

- **Type:** Checkbox
- **Required:** No
- **Purpose:** When checked, hides the entire component
- **Use case:** Hide component on production while testing

### Creating Navigation Links

1. Under the TertiaryNav datasource, create items using `Header Child` template
2. Set the `link` field with URL and display text
3. Links appear in order of item sort order

#### link (Child Item)

- **Type:** General Link
- **Required:** Yes
- **Link Types:** Internal, External
- **Guidance:** Use concise, utility-focused link text
- **Example:**
  ```json
  {
    "value": {
      "href": "/contact-sales",
      "text": "Contact Sales",
      "linktype": "internal"
    }
  }
  ```

### Common Tertiary Nav Links

| Link Text | URL | Purpose |
|-----------|-----|---------|
| Contact Sales | /contact-sales | Sales inquiries |
| Support | /support | Customer support |
| Partners | /partners | Partner portal |
| Careers | /careers | Job listings |
| Investors | /investors | Investor relations |

## Component Props Interface

```typescript
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
```

## Content Examples

### Datasource Fields

```json
{
  "fields": {
    "demo": { "value": false }
  }
}
```

### Child Link Items

```json
[
  {
    "link": {
      "value": {
        "href": "/contact-sales",
        "text": "Contact Sales",
        "linktype": "internal"
      }
    }
  },
  {
    "link": {
      "value": {
        "href": "/support",
        "text": "Support",
        "linktype": "internal"
      }
    }
  },
  {
    "link": {
      "value": {
        "href": "/partners",
        "text": "Partners",
        "linktype": "internal"
      }
    }
  }
]
```

## Visual Layout

### Desktop
```
┌────────────────────────────────────────────────────────────────────────┐
│  Contact Sales    Support    Partners       [Language ▼] [Login]       │
│       ↑              ↑           ↑                 ↑          ↑        │
│   (nav links from child items)              (placeholder components)   │
└────────────────────────────────────────────────────────────────────────┘
```

### Mobile
```
┌────────────────────────────────────┐
│  Contact Sales                     │
│  Support                           │
│  Partners                          │
│  [Language ▼]                      │
│  [Login]                           │
└────────────────────────────────────┘
```

## Responsive Behavior

| Viewport | Layout |
|----------|--------|
| Desktop (≥ 1024px) | Horizontal row, right-aligned |
| Mobile (< 1024px) | Vertical stack within mobile menu |

## Sitecore XM Cloud Specifics

### Content Editor Path

- TertiaryNav: `/sitecore/content/[Site]/Home/Data/Navigation/Tertiary Navigation`
- Child links: Created under TertiaryNav item

### Experience Editor Behavior

- **Not inline editable:** Links managed via child items
- **Placeholder editing:** Add LanguageSwitcher, Login, PersonaSwitcher
- **Desktop only:** TertiaryNav hidden at mobile breakpoints in normal flow

### Theme Configuration

- Uses `secondary` theme (dark background, light text)
- Small text size (`copy-xs` on desktop)

## Authoring Rules

1. **Keep It Brief:** Limit to 3-5 utility links
2. **Link Order:** Place most important links first
3. **No Overlap:** Don't duplicate main navigation links
4. **Utility Focus:** Reserve for utility/support links

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Too many links | Cluttered, hard to scan | Limit to 3-5 links |
| Duplicate links | Redundant with main nav | Use unique utility links |
| Long link text | Doesn't fit on mobile | Use concise text |
| Missing placeholder components | Incomplete functionality | Add LanguageSwitcher/Login |

## Related Components

- `Header` - Contains TertiaryNav in placeholder, main navigation
- `LanguageSwitcher` - Language selection in tertiarynavcomponents placeholder
- `Login` - Authentication in tertiarynavcomponents placeholder
- `PersonaSwitcher` - Demo component in tertiarynavcomponents placeholder

---

## MCP Authoring Instructions

### Step 1: Create TertiaryNav Datasource

```javascript
const tertiaryNavDatasource = await mcp__marketer__create_content_item({
  siteName: "main",
  parentPath: "/sitecore/content/Site/Home/Data/Navigation",
  templatePath: "/sitecore/templates/Project/Site/Navigation/Tertiary Navigation",
  itemName: "Tertiary Navigation",
  language: "en"
});
```

### Step 2: Create Navigation Links

```javascript
// Create Contact Sales link
const contactLink = await mcp__marketer__create_content_item({
  siteName: "main",
  parentPath: tertiaryNavDatasource.itemPath,
  templatePath: "/sitecore/templates/Project/Site/Navigation/Header Child",
  itemName: "Contact Sales",
  language: "en"
});

await mcp__marketer__update_content({
  siteName: "main",
  itemId: contactLink.itemId,
  language: "en",
  fields: {
    "link": "<link text='Contact Sales' linktype='internal' url='/contact-sales' />"
  }
});

// Create Support link
const supportLink = await mcp__marketer__create_content_item({
  siteName: "main",
  parentPath: tertiaryNavDatasource.itemPath,
  templatePath: "/sitecore/templates/Project/Site/Navigation/Header Child",
  itemName: "Support",
  language: "en"
});

await mcp__marketer__update_content({
  siteName: "main",
  itemId: supportLink.itemId,
  language: "en",
  fields: {
    "link": "<link text='Support' linktype='internal' url='/support' />"
  }
});
```

### Step 3: Add TertiaryNav to Page/Header

TertiaryNav is typically added to the Header's `tertiarynav` placeholder:

```javascript
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "tertiary-nav-rendering-id",
  placeholderPath: "tertiarynav-{header-dynamic-id}",
  componentItemName: "TertiaryNav_Main",
  language: "en",
  dataSourceId: tertiaryNavDatasource.itemId
});
```

### Step 4: Add Placeholder Components

Add LanguageSwitcher and Login to the TertiaryNav's placeholder:

```javascript
// Add LanguageSwitcher
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "language-switcher-rendering-id",
  placeholderPath: "tertiarynavcomponents-{tertiarynav-dynamic-id}",
  componentItemName: "LanguageSwitcher_1",
  language: "en",
  fields: {}
});

// Add Login
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "login-rendering-id",
  placeholderPath: "tertiarynavcomponents-{tertiarynav-dynamic-id}",
  componentItemName: "Login_1",
  language: "en",
  fields: {}
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| demo | Checkbox | `"1"` (checked) or `""` (unchecked) |
| link (child) | General Link | `<link text='Text' linktype='internal' url='/path' />` |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
