# PersonProfile Component

## Purpose
PersonProfile is a route context component — all fields are read directly from the page item rather than a separate datasource. It renders a full biographical profile page for a person, split into a sticky sidebar (photo, name, role, expertise tags, contact links) and a main biography column (rich-text description, plus collapsible accordion sections for Achievements, Education, Involvements, Speaking Events, and Recent Articles). Data is accessed via the `usePerson()` context hook provided by `PersonProfileRendering` in `component-children/People/PersonProfile/PersonProfile.tsx`.

The `PersonMetadata` child (`component-children/People/PersonProfile/PersonMetadata.tsx`) injects Open Graph `<meta>` tags into `<Head>` for SEO — populating profile name, role, email, phone, description, expertise, company, location, website, LinkedIn URL, and portrait image URLs. The component does not use `withDatasourceCheck` since it reads from the route context, not a datasource.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `36673e6e-ec10-4685-b065-1d07edf99cef` |
| **Component Name** | `PersonProfile` |
| **Category** | `People` |

## Fields
> All fields are on the **page item** (route context). No separate datasource is used.

| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `firstName` | Single-Line Text (`Field<string>`) | Yes | Person's first name; combined with `lastName` for display and SEO meta |
| `lastName` | Single-Line Text (`Field<string>`) | Yes | Person's last name; also used to compute alphabetic index initial |
| `role` | Single-Line Text (`Field<string>`) | No | Job title or role displayed below the full name in the sidebar |
| `email` | Single-Line Text (`Field<string>`) | No | Email address rendered as a `mailto:` link with envelope icon |
| `phone` | Single-Line Text (`Field<string>`) | No | Phone number rendered as a `tel:` link with phone icon |
| `description` | Rich Text (`RichTextField`) | No | Full biographical text rendered in the main column with `richtext-lg` styling |
| `image` | Image (`ImageField`) | No | Desktop portrait photo displayed in the sidebar; hidden on mobile when `imageMobile` is set |
| `imageMobile` | Image (`ImageField`) | No | Mobile portrait photo shown only on small viewports |
| `expertise` | Multilist (`QueryField`) | No | List of expertise tag items; each exposes a `Title` field rendered as comma-separated labels |
| `company` | Single-Line Text (`Field<string>`) | No | Company or organisation affiliation for SEO meta only |
| `location` | Multilist (`QueryField`) | No | Location items; each exposes a `contentName` field for SEO meta only |
| `website` | General Link (`LinkField`) | No | Personal/company website link rendered in the sidebar with globe icon |
| `linkedInLink` | General Link (`LinkField`) | No | LinkedIn profile link rendered in the sidebar with LinkedIn brand icon |

## Child Data Sections (Accordion)
The component reads child item folders from the page item's children. Each folder is matched by name (translated):

| Section | Content Type | Child Item Fields |
|---------|-------------|-------------------|
| **Achievements** | Text items | `description` (Rich Text) |
| **Education** | Text items | `description` (Rich Text) |
| **Involvements** | Bordered items | `heading` (Single-Line Text), `description` (Rich Text) |
| **Speaking Events** | Event cards | Rendered via `EventCard` component |
| **Recent Articles** | Article cards | Rendered via `ArticleCard` (Insights variant) |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `image` | `<Image>` | `import { Image } from '@sitecore-content-sdk/nextjs'` |
| `imageMobile` | `<Image>` | `import { Image } from '@sitecore-content-sdk/nextjs'` |
| `description` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `heading` (child items) | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `description` (child items) | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Full person profile page layout with sidebar and biography accordion |

## Props Interface
```typescript
// Route-context component — reads from usePerson() context
interface ComponentProps {
  rendering: ComponentRendering;
  params: { [key: string]: string };
}

// ProfileGQL (from lib/types/page/profile) — shape of usePerson() return value
interface ProfileGQL {
  firstName?: Field<string>;
  lastName?: Field<string>;
  role?: Field<string>;
  email?: Field<string>;
  phone?: Field<string>;
  description?: Field<string>;    // Rich Text stored as Field<string>
  image?: QueryField;             // { jsonValue: ImageField }
  imageMobile?: QueryField;
  expertise?: QueryField;         // { jsonValue: ExpertiseTag[] }
  company?: Field<string>;
  location?: QueryField;
  website?: QueryField;           // { jsonValue: LinkField }
  linkedInLink?: QueryField;
  children?: { results: ProfileChildrenFolder[] };
  events?: EventItem[];
  articles?: ArticleItem[];
  displayName?: string;
}
```

## Example Content Entry

### Minimum Viable Content (Page Item Fields)
```json
{
  "fields": {
    "firstName": { "value": "Jane" },
    "lastName": { "value": "Smith" }
  }
}
```

### Full Content Example (Page Item Fields)
```json
{
  "fields": {
    "firstName": { "value": "Jane" },
    "lastName": { "value": "Smith" },
    "role": { "value": "Senior Partner" },
    "email": { "value": "jane.smith@example.com" },
    "phone": { "value": "+1 (555) 234-5678" },
    "description": { "value": "<p>Jane Smith is a senior partner with over 20 years of experience in corporate law and M&amp;A advisory.</p>" },
    "image": {
      "value": {
        "src": "/media/jane-smith-portrait.jpg",
        "alt": "Jane Smith",
        "width": 800,
        "height": 800
      }
    },
    "imageMobile": {
      "value": {
        "src": "/media/jane-smith-portrait-mobile.jpg",
        "alt": "Jane Smith",
        "width": 400,
        "height": 400
      }
    },
    "company": { "value": "Smith & Associates LLP" },
    "website": {
      "value": {
        "href": "https://smithassociates.example.com",
        "text": "smithassociates.example.com",
        "target": "_blank"
      }
    },
    "linkedInLink": {
      "value": {
        "href": "https://linkedin.com/in/jane-smith",
        "text": "LinkedIn",
        "target": "_blank"
      }
    }
  }
}
```

## MCP Authoring Instructions

### Step 1: Create or Navigate to the Person Page Item
PersonProfile is a **route context component** — fields live on the page item itself, not a datasource.

```javascript
// Set fields directly on the person page item
await mcp__marketer-mcp__edit_item_fields({
  itemId: "<person-page-item-id>",
  fields: {
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "Senior Partner",
    "email": "jane.smith@example.com",
    "phone": "+1 (555) 234-5678",
    "description": "<p>Biographical text here.</p>"
  }
});
```

### Step 2: Add PersonProfile Rendering to the Page
```javascript
await mcp__marketer-mcp__add_component_on_page({
  itemId: "<person-page-item-id>",
  renderingId: "36673e6e-ec10-4685-b065-1d07edf99cef",
  placeholderName: "<target-placeholder>"
  // No datasource — reads from page item context
});
```

### Step 3: Set Image Fields
```javascript
await mcp__marketer-mcp__edit_item_fields({
  itemId: "<person-page-item-id>",
  fields: {
    "image": { "src": "/media/portrait.jpg", "alt": "Jane Smith", "width": 800, "height": 800 },
    "imageMobile": { "src": "/media/portrait-mobile.jpg", "alt": "Jane Smith", "width": 400, "height": 400 }
  }
});
```

### Step 4: Add Child Section Items (optional)
Create child items under the person page item in the folders: `Achievements`, `Education`, `Involvements`. Each child item should have `heading` and/or `description` fields as appropriate.

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `firstName` | Single-Line Text | Plain string |
| `lastName` | Single-Line Text | Plain string |
| `role` | Single-Line Text | Plain string |
| `email` | Single-Line Text | Email address string |
| `phone` | Single-Line Text | Phone number string |
| `description` | Rich Text | HTML string |
| `image` | Image | `{ "src": string, "alt": string, "width": number, "height": number }` |
| `imageMobile` | Image | `{ "src": string, "alt": string, "width": number, "height": number }` |
| `expertise` | Multilist | Array of item IDs |
| `company` | Single-Line Text | Plain string |
| `location` | Multilist | Array of item IDs |
| `website` | General Link | `{ "href": string, "text": string, "target": "_blank" }` |
| `linkedInLink` | General Link | `{ "href": string, "text": string, "target": "_blank" }` |

> **Route Context Note:** This is a route context component. The `usePerson()` hook reads profile data from the page context rather than from a rendering datasource. Do not set a datasource when adding this rendering to a page. All personal data fields must be authored directly on the person page item.

> **SEO:** The `PersonMetadata` child automatically populates Open Graph profile meta tags from the page item fields. Ensure `firstName`, `lastName`, and `description` are set for complete SEO coverage.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
