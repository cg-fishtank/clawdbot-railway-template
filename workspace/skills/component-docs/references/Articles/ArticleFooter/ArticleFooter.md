# ArticleFooter Component

## Purpose

The ArticleFooter component displays article metadata at the bottom of article pages, including a tags section with configurable label and author profile cards. It renders author information with images, roles, and descriptions, along with SXA taxonomy tags. The component supports multiple variants (Default, Careers, Insights, News) and is typically placed after the ArticleBody component.

## Sitecore Template Requirements

### Data Source Configuration

This component uses a **hybrid approach**:
- **Component field:** `tagsLabel` (from component datasource)
- **Route fields:** `profiles`, `SxaTags` (from page context)

### Template Paths

- **Component Datasource Template:** `/sitecore/templates/Project/[Site]/Articles/Article Footer`
- **Page Template (for route fields):** `/sitecore/templates/Project/[Site]/Articles/Article Page`
- **Profile Template:** `/sitecore/templates/Project/[Site]/Profiles/Profile`

### Fields

#### Component Datasource Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| tagsLabel | Single-Line Text | No | Label displayed above the tags list | Recommended max 30 characters |

#### Route-Level Fields (from Article Page)

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| profiles | Multilist | No | Reference to Profile items (authors) | Links to `/sitecore/content/[Site]/Data/Profiles/` |
| SxaTags | Treelist | No | SXA taxonomy tags for the article | Standard SXA Tags implementation |

#### Profile Item Fields (referenced via profiles field)

| Field Name | Sitecore Type | Required | Description |
|------------|---------------|----------|-------------|
| displayName | Single-Line Text | Yes | Author's display name |
| firstName | Single-Line Text | No | Author's first name |
| lastName | Single-Line Text | No | Author's last name |
| role | Single-Line Text | No | Author's job title/role |
| description | Rich Text | No | Author bio (rendered with line clamp) |
| image | Image | No | Author headshot/photo |
| imageMobile | Image | No | Mobile-specific author image |
| email | Single-Line Text | No | Author email address |
| company | Single-Line Text | No | Author's company |
| website | General Link | No | Author's website URL |
| linkedInLink | General Link | No | Author's LinkedIn profile |
| expertise | Multilist | No | Author's areas of expertise |
| location | Multilist | No | Author's location(s) |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| tagsLabel | `<Text className="heading-xl text-black" field={tagsLabel} tag="h3" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| profiles[].fields.image | `<NextImage width={320} height={180} field={author.fields.image} />` | `import { NextImage } from '@sitecore-jss/sitecore-jss-nextjs'` |
| profiles[].fields.role | `<Text className="copy-base text-black" field={author.fields?.role} tag="p" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| profiles[].fields.description | `<RichText className="richtext line-clamp-4 pt-2 leading-relaxed md:pt-4" field={author.fields?.description} />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| SxaTags | Rendered via `<Tag theme="secondary">` component | Custom Tag component |

## Component Variants

The ArticleFooter exports 4 rendering variants:

| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | General articles, blog posts |
| Careers | `Careers` | Job postings, career-related content |
| Insights | `Insights` | Research, whitepapers, industry insights |
| News | `News` | News articles, press releases |

## Content Authoring Instructions

### Field-by-Field Guidance

#### tagsLabel (Component Datasource)

- **What to enter:** Label text for the tags section (e.g., "Topics", "Related Topics", "Categories")
- **Tone/Style:** Clear and concise
- **Character limit:** 30 characters recommended
- **Example:** "Topics"

#### profiles (Page-Level Field)

- **What to select:** One or more Profile items representing article authors
- **Selection path:** `/sitecore/content/[Site]/Data/Profiles/`
- **Display:** Each author shows image, name, role, and description (4-line clamp)
- **Order:** Authors display in the order selected

#### SxaTags (Page-Level Field)

- **What to select:** Relevant taxonomy tags from SXA Tags structure
- **Display:** Tags render as secondary-themed badges
- **Best practice:** Select 3-5 relevant tags for optimal display

### Profile Content Guidelines

When creating/editing Profile items for authors:

| Field | Guidance |
|-------|----------|
| displayName | Full name as it should appear (e.g., "Jane Smith") |
| role | Professional title (e.g., "Senior Consultant", "VP of Marketing") |
| description | Brief bio, 2-4 sentences. Gets truncated after 4 lines on display. |
| image | Square or landscape headshot, recommended 320x180px minimum |

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Tags Only | SxaTags | tagsLabel | Article with tags but no author attribution |
| Authors Only | profiles | - | Single or multi-author article without tags |
| Complete | profiles, SxaTags | tagsLabel | Full footer with authors and categorization |

**Note:** The component returns `null` if no profiles are provided, even if tags exist.

## Component Props Interface

```typescript
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type ArticleFooterProps = ComponentProps & {
  fields: {
    tagsLabel: Field<string>;
  };
  variant?: string;
};

// Route fields accessed via useSitecoreContext():
// - profiles: ProfileData[] (from RouteFields)
// - SxaTags: TagType[] (from RouteFields)

// ProfileData structure:
interface ProfileData {
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

### Component Datasource

```json
{
  "fields": {
    "tagsLabel": { "value": "Related Topics" }
  }
}
```

### Page-Level Content (Article Page)

```json
{
  "fields": {
    "profiles": [
      {
        "id": "{PROFILE-GUID-1}",
        "displayName": "Jane Smith",
        "fields": {
          "role": { "value": "Senior Healthcare Consultant" },
          "description": { "value": "<p>Jane has over 15 years of experience in healthcare technology transformation. She specializes in digital health strategy and patient experience optimization.</p>" },
          "image": {
            "value": {
              "src": "/-/media/Project/Site/Profiles/jane-smith.jpg",
              "alt": "Jane Smith headshot",
              "width": "320",
              "height": "180"
            }
          }
        }
      }
    ],
    "SxaTags": [
      { "name": "healthcare", "displayName": "Healthcare" },
      { "name": "digital-transformation", "displayName": "Digital Transformation" },
      { "name": "technology", "displayName": "Technology" }
    ]
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Paths

- Component datasource: `/sitecore/content/[Site]/Home/Data/Article Footers/`
- Profile items: `/sitecore/content/[Site]/Data/Profiles/`
- Article pages: `/sitecore/content/[Site]/Home/Articles/[Article Name]`

### Experience Editor Behavior

- **Inline editable fields:** tagsLabel (in component datasource)
- **Forms panel required:** profiles, SxaTags (on page item)
- **Profile editing:** Navigate to Profile item to edit author details
- **Tag selection:** Use content tree picker for SxaTags field

### Rendering Variant Selection

In Experience Editor or Content Editor:
1. Select the ArticleFooter component
2. Open "Rendering Properties" or "Component Properties"
3. Choose variant from dropdown: Default, Careers, Insights, or News

## Common Mistakes to Avoid

1. **No profiles selected:** The component returns `null` if profiles array is empty. Ensure at least one author is assigned for the footer to display.

2. **Missing profile images:** While optional, missing images create visual inconsistency. Use placeholder images if real headshots aren't available.

3. **Overly long descriptions:** Profile descriptions are clamped to 4 lines. Write concise bios that communicate key information within this limit.

4. **Mismatched variants:** Use the same variant as ArticleHeader and ArticleBody for visual consistency across the article page.

5. **Too many tags:** While there's no hard limit, 3-5 tags provides optimal readability. Too many tags dilute relevance.

6. **Unpublished profiles:** If a selected profile item isn't published, it may not render. Verify all referenced profiles are published.

## Related Components

- `ArticleHeader` - Displays article title, date, and category at the top
- `ArticleBody` - Renders the main article content
- `ArticleBanner` - Alternative header with hero image
- `ProfileCard` - Standalone profile display component
- `Tag` - Individual tag component used in ArticleTags sub-component

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ArticleFooter component using the Marketer MCP tools.

### Important: Hybrid Data Source

The ArticleFooter uses both:
- **Component datasource:** For `tagsLabel` field
- **Route context:** For `profiles` and `SxaTags` fields (authored on page)

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID
2. Have the ArticleFooter rendering ID
3. Have Profile item GUIDs for authors
4. Know the SXA Tags structure

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Article Page Name"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add ArticleFooter to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "article-footer-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ArticleFooter_1",
  language: "en",
  fields: {
    "tagsLabel": "Related Topics"
  }
});

const datasourceId = result.datasourceId;
```

### Step 3: Update Page-Level Fields (profiles, SxaTags)

Since `profiles` and `SxaTags` are page-level fields:

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,  // The page ID, not datasource
  language: "en",
  fields: {
    // Profiles field - pipe-separated GUIDs
    "profiles": "{PROFILE-GUID-1}|{PROFILE-GUID-2}",
    // SxaTags field - reference to SXA tag items
    "SxaTags": "{TAG-GUID-1}|{TAG-GUID-2}|{TAG-GUID-3}"
  }
});
```

### Step 4: Update Component Datasource (Optional)

If you need to update `tagsLabel` after initial creation:

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,  // The component datasource
  language: "en",
  fields: {
    "tagsLabel": "Topics"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page and profile items
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Healthcare Innovation Article"
});
const pageId = pageSearch.results[0].itemId;

// Find profile items
const profileSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Jane Smith Profile"
});
const profileId = profileSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add ArticleFooter component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "article-footer-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ArticleFooter_Healthcare",
  language: "en",
  fields: {
    "tagsLabel": "Related Topics"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update page-level fields
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "profiles": profileId,
    "SxaTags": "{HEALTHCARE-TAG}|{TECHNOLOGY-TAG}|{DIGITAL-TAG}"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: ArticleFooter with author and tags
// ═══════════════════════════════════════════════════════════════
```

### Creating Profile Items

If profiles don't exist, create them first:

```javascript
// Create a new profile item
const profile = await mcp__marketer-mcp__create_content_item({
  name: "Jane Smith",
  templateId: "profile-template-id",
  parentId: "profiles-folder-id",
  language: "en",
  fields: {
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "Senior Healthcare Consultant",
    "description": "<p>Jane has over 15 years of experience in healthcare technology transformation.</p>"
  }
});

// Update profile image
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: profile.itemId,
  language: "en",
  fields: {
    "image": "<image mediaid='{PROFILE-IMAGE-GUID}' />"
  }
});
```

### Variant Selection via Rendering

| Variant | Rendering Name |
|---------|----------------|
| Default | `ArticleFooter` |
| Careers | `ArticleFooter-Careers` |
| Insights | `ArticleFooter-Insights` |
| News | `ArticleFooter-News` |

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| tagsLabel | Single-Line Text | Component datasource | `"Plain text value"` |
| profiles | Multilist | Page item | `"{GUID}"` or `"{GUID1}\|{GUID2}"` |
| SxaTags | Treelist | Page item | `"{GUID1}\|{GUID2}"` |

### MCP Authoring Checklist

Before authoring ArticleFooter via MCP, verify:

- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have ArticleFooter rendering ID (from component manifest)
- [ ] Have Profile item GUIDs for authors to assign
- [ ] Have SXA Tag GUIDs for categorization
- [ ] Placeholder path is `"headless-main"` (no leading slash)
- [ ] At least one profile is assigned (component returns null otherwise)

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ArticleFooter_2` |
| Footer not displaying | No profiles assigned | Ensure profiles field has at least one GUID |
| Tags not showing | tagsLabel set but no SxaTags | Assign SxaTags on the page item |
| Profile not showing | Profile item unpublished | Publish the Profile item |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-author-image` | Image field XML formatting for profiles |
| `/sitecore-pagebuilder` | Page creation and component placement |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-05 | Initial documentation | Claude Code |
