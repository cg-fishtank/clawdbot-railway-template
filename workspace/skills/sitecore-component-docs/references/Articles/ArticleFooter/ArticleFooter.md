# ArticleFooter Component

## Purpose
ArticleFooter is a hybrid component that combines datasource-driven content with page route context data. It renders two sub-sections: an `ArticleTags` block (displaying SXA tags from the page route's `SxaTags` field, with the section label text sourced from the component datasource `tagsLabel` field) and an `ArticlePeopleProfile` block (displaying author profile cards from the page route's `profiles` field). In Experience Editor, if neither tags nor profiles are present, a placeholder message is shown; in live/preview mode the component renders nothing when empty.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `07b66e75-e473-4f15-8880-509e6a6ff54c` |
| **Component Name** | `ArticleFooter` |
| **Category** | `Articles` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `tagsLabel` | Single-Line Text (`Field<string>`) | No | Label text displayed above the tags list (e.g. "Topics"); sourced from component datasource | Falls back to dictionary key `'No Tag and Profile'` message in editing mode if empty |

> **Note:** This is a hybrid component. `tagsLabel` comes from the **component datasource**. `SxaTags` (tag items) and `profiles` (author profile references) come from the **page route fields** via `useSitecore()`.

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `tagsLabel` | `<Text field={fields?.tagsLabel} tag="h3" className="heading-xl text-content" />` (inside `ArticleTags`) | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `profiles[].fields.role` | `<Text field={person.fields?.role} tag="p" />` (inside `ArticlePeopleProfile`) | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `profiles[].fields.description` | `<RichText field={person.fields?.description} />` (inside `ArticlePeopleProfile`) | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| `profiles[].fields.image` | `<NextImage field={person.fields.image} />` (inside `ArticlePeopleProfile`) | `import { NextImage } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Standard article footer for general article pages |
| Insights | `Insights` | Footer for Insights-type articles; sets `data-variant="Insights"` |
| News | `News` | Footer for News-type articles; sets `data-variant="News"` |

## Props Interface
```typescript
// From component-children/Articles/ArticleFooter/ArticleFooter.tsx
import { ComponentProps } from 'lib/component-props';
import { Field } from '@sitecore-content-sdk/nextjs';

export type ArticleFooterProps = ComponentProps & {
  fields: {
    tagsLabel: Field<string>; // From datasource
  };
  variant?: string;
};

// Route fields consumed via useSitecore() — not passed as props:
interface RouteFields {
  profiles?: ProfileData[];   // Author profiles linked on the page item
  SxaTags?: TagType[];        // SXA tags applied to the page item
}

// ProfileData (from ArticlePeopleProfile.tsx)
export interface ProfileData {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: {
    expertise: ExpertiseTag[];
    lastName: Field<string>;
    firstName: Field<string>;
    email: Field<string>;
    role: Field<string>;
    description: Field<string>;
    location: LocationItem[];
    image: ImageField;
    imageMobile: ImageField;
    company: Field<string>;
    website: LinkField;
    linkedInLink: LinkField;
  };
}
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "tagsLabel": { "value": "Topics" }
  }
}
```

> Tags (`SxaTags`) and author profiles (`profiles`) are set on the **page item**, not the component datasource.

### Full Content Example
```json
{
  "fields": {
    "tagsLabel": { "value": "Related Topics" }
  }
}
```

**Page item fields (set separately):**
```json
{
  "SxaTags": [
    { "name": "automation", "displayName": "Automation" },
    { "name": "ai", "displayName": "Artificial Intelligence" }
  ],
  "profiles": [
    {
      "displayName": "Jane Smith",
      "fields": {
        "role": { "value": "Senior Research Analyst" },
        "description": { "value": "<p>Jane specializes in industrial automation research.</p>" },
        "image": { "value": { "src": "/media/people/jane-smith.jpg", "alt": "Jane Smith" } }
      }
    }
  ]
}
```

## MCP Authoring Instructions

### Step 1: Add Component to Page
```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "07b66e75-e473-4f15-8880-509e6a6ff54c",
  placeholderPath: "headless-main",
  componentItemName: "ArticleFooter_1",
  language: "en",
  fields: {
    "tagsLabel": "Related Topics"
  }
});
```

### Step 2: Set Tags and Profiles on the Page Item
Tags and profiles are page-level fields, not datasource fields:
```javascript
// Add SXA tags to the page item via the page's own field editing
const result = await mcp__marketer-mcp__update_page_fields({
  pageId: "page-guid",
  language: "en",
  fields: {
    "SxaTags": ["tag-item-guid-1", "tag-item-guid-2"],
    "profiles": ["profile-item-guid-1"]
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `tagsLabel` | Single-Line Text (datasource) | `"tagsLabel": "Related Topics"` |
| `SxaTags` | Multilist (page item) | Array of SXA tag item GUIDs |
| `profiles` | Multilist (page item) | Array of People profile item GUIDs |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
