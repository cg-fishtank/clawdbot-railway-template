# ArticleHeader Component

## Purpose

The ArticleHeader component displays the header section of article pages, featuring the article title (heading), subheading, category badge, publication date, and social sharing buttons. It includes structured data metadata output for SEO (via variant-specific metadata components). The component supports multiple variants (Default, Careers, Insights, News) with different date formatting and metadata schemas. It is typically placed at the top of article detail pages, after any banner components.

## Sitecore Template Requirements

### Data Source

**Important:** This component reads all fields from the **page/route context**, not from a component-level datasource. Fields must be defined on the Article Page Template.

### Template Path

- **Page Template:** `/sitecore/templates/Project/[Site]/Articles/Article Page`
- **No separate datasource template** - uses page-level fields

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Main article title (H1) | Recommended max 100 characters |
| subheading | Rich Text | No | Supporting text/article summary | Supports basic formatting |
| pageCategory | Multilist/Treelist | No | Reference to Page Category taxonomy items | Links to `/sitecore/content/[Site]/Data/Page Categories/` |
| datePublished | Date | No | Publication date of the article | ISO date format |
| displayDateTime | Date | No | Override display date/time (used by News variant) | ISO date format with time |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text className="heading-4xl" field={heading} tag="h1" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| subheading | `<RichText className="richtext" field={subheading} />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| pageCategory | `<Text editable={false} field={category} tag="p" className="heading-base uppercase" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| datePublished | Formatted via `getLocalizedFormattedDate()` helper | Custom date formatting |

## Component Variants

The ArticleHeader exports 4 rendering variants with different metadata schemas and date display:

| Variant | Export Name | Metadata Schema | Date Display | Use Case |
|---------|-------------|-----------------|--------------|----------|
| Default | `Default` | ArticleMetadata | Date only | General articles, blog posts |
| Careers | `Careers` | CareersMetadata | Date only | Job postings, career-related content |
| Insights | `Insights` | InsightsMetadata | Date only | Research, whitepapers, industry insights |
| News | `News` | NewsMetadata | Date + Time | News articles, press releases |

### Date Display Behavior

- **Default/Careers/Insights:** Shows date in localized format (e.g., "January 15, 2024")
- **News:** Shows date and time; uses `displayDateTime` if set, falls back to `datePublished`

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The main article title that serves as the H1
- **Tone/Style:** Clear, compelling, SEO-friendly
- **Character limit:** 100 characters recommended for optimal display and SEO
- **Example:** "Transforming Healthcare Through Digital Innovation"

#### subheading

- **What to enter:** Brief summary or supporting context for the article
- **Tone/Style:** Informative, complements the headline
- **Formatting:** Basic rich text - keep formatting simple (bold, italic, links only)
- **Example:** "Discover how emerging technologies are reshaping patient care and improving outcomes across the healthcare industry."

#### pageCategory

- **What to select:** One category item from the Page Categories folder
- **Selection path:** `/sitecore/content/[Site]/Data/Page Categories/`
- **Display:** Shows as uppercase text above the heading
- **Example categories:** "Technology", "Healthcare", "Finance", "Careers", "News"

#### datePublished

- **What to enter:** The publication date of the article
- **Format:** Use Sitecore's date picker
- **Display:** Formatted based on site language (e.g., "January 15, 2024" for en-US)
- **Note:** For News articles, consider also setting displayDateTime for precise timing

#### displayDateTime (News variant)

- **What to enter:** The display date/time for News articles
- **Format:** Date with time component
- **Display:** Overrides datePublished when set; shows time in News variant
- **Use case:** When you need to show exact publication time for breaking news

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | heading | - | Quick article with just title |
| Standard | heading, datePublished | subheading, pageCategory | Most common setup |
| Full | heading, subheading, pageCategory, datePublished | displayDateTime | Complete header with all metadata |

## Component Props Interface

```typescript
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { ArticleVariant } from 'lib/helpers/article-variants';

type ArticleHeaderProps = ComponentProps & {
  variant?: ArticleVariant;
};

// ArticleVariant = 'default' | 'careers' | 'insights' | 'news'

// Route fields accessed via useSitecoreContext():
// ArticleRouteFieldsType includes:
// - heading: Field<string>
// - subheading: Field<string>
// - pageCategory: PageCategoryField
// - datePublished: Field<string>
// - displayDateTime: QueryField | Field<string>
```

## Example Content Entry

### Page-Level Content (Article Page)

```json
{
  "fields": {
    "heading": { "value": "Transforming Healthcare Through Digital Innovation" },
    "subheading": {
      "value": "<p>Discover how emerging technologies are reshaping patient care and improving outcomes across the healthcare industry.</p>"
    },
    "pageCategory": [
      {
        "id": "{CATEGORY-GUID}",
        "displayName": "Healthcare",
        "fields": {
          "pageCategory": { "value": "Healthcare" }
        }
      }
    ],
    "datePublished": { "value": "2024-01-15T00:00:00Z" }
  }
}
```

### News Article Example

```json
{
  "fields": {
    "heading": { "value": "Breaking: Major Healthcare Partnership Announced" },
    "subheading": {
      "value": "<p>Two industry leaders join forces to revolutionize patient care delivery.</p>"
    },
    "pageCategory": [
      {
        "id": "{NEWS-CATEGORY-GUID}",
        "fields": {
          "pageCategory": { "value": "News" }
        }
      }
    ],
    "datePublished": { "value": "2024-01-15T00:00:00Z" },
    "displayDateTime": { "value": "2024-01-15T14:30:00Z" }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Article pages: `/sitecore/content/[Site]/Home/Articles/[Article Name]`
- Page Categories: `/sitecore/content/[Site]/Data/Page Categories/`
- All fields are edited directly on the article page item

### Experience Editor Behavior

- **Inline editable fields:** heading, subheading
- **Forms panel required:** pageCategory, datePublished, displayDateTime
- **Social Share buttons:** Not editable - renders automatically based on page URL

### Rendering Variant Selection

In Experience Editor or Content Editor:
1. Select the ArticleHeader component
2. Open "Rendering Properties" or "Component Properties"
3. Choose variant from dropdown: Default, Careers, Insights, or News

### SEO Metadata Output

Each variant outputs specific structured data:
- **ArticleMetadata:** Standard Article schema
- **CareersMetadata:** JobPosting schema
- **InsightsMetadata:** Report/Article schema
- **NewsMetadata:** NewsArticle schema with datePublished/dateModified

## Common Mistakes to Avoid

1. **Missing heading:** The heading field is the H1 and critical for SEO. Never leave it empty.

2. **Wrong variant for content type:** Match the variant to your content for correct metadata schema:
   - Job postings → Careers variant
   - Industry analysis → Insights variant
   - Press releases → News variant
   - General articles → Default variant

3. **Overly long headlines:** Headlines exceeding 100 characters may truncate in search results and look awkward in the UI.

4. **Missing datePublished:** Without a date, the article appears undated which reduces credibility and SEO value.

5. **Using displayDateTime incorrectly:** Only use displayDateTime for News variant when you need to show specific time. For other variants, it's ignored.

6. **Rich text overload in subheading:** Keep subheading simple - it's meant for a brief summary, not full paragraphs of content.

7. **Mismatched variants across components:** Use the same variant for ArticleHeader, ArticleBody, and ArticleFooter to maintain consistency.

## Related Components

- `ArticleBanner` - Alternative header with hero image layout
- `ArticleBody` - Main article content section
- `ArticleFooter` - Author profiles and tags section
- `SocialShare` - Child component rendered within ArticleHeader
- `ArticleMetadata` / `NewsMetadata` / `InsightsMetadata` / `CareersMetadata` - SEO metadata components

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ArticleHeader component using the Marketer MCP tools.

### Important: Route-Context Component

The ArticleHeader component reads all fields from the **page route context**, not from a component datasource. This means:

1. All fields are authored on the **Article Page** itself
2. Adding the ArticleHeader component does not create a separate datasource
3. Content updates go to the page item, not a component datasource

### Step 1: Find or Create the Article Page

```javascript
// Search for existing article page
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Article Title"
});
const pageId = pageSearch.results[0].itemId;

// Or get page by path
const page = await mcp__marketer__get_content_item_by_path({
  itemPath: "/sitecore/content/Site/Home/Articles/my-article"
});
```

### Step 2: Add ArticleHeader Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "article-header-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ArticleHeader_1",
  language: "en",
  fields: {}  // No component-level fields
});
```

### Step 3: Update Page-Level Fields

All ArticleHeader fields are on the page item:

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,  // The page ID, not a datasource
  language: "en",
  fields: {
    "heading": "Transforming Healthcare Through Digital Innovation",
    "subheading": "<p>Discover how emerging technologies are reshaping patient care.</p>",
    "datePublished": "20240115T120000Z"
  }
});
```

### Step 4: Set Page Category (Optional)

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "pageCategory": "{CATEGORY-ITEM-GUID}"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find the article page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Digital Transformation Guide"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add ArticleHeader component to the page
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "article-header-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ArticleHeader_Main",
  language: "en",
  fields: {}
});

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update page fields for header content
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "heading": "Transforming Healthcare Through Digital Innovation",
    "subheading": "<p>Discover how emerging technologies are reshaping patient care and improving outcomes across the healthcare industry.</p>",
    "datePublished": "20240115T000000Z"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Set page category
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "pageCategory": "{HEALTHCARE-CATEGORY-GUID}"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: ArticleHeader displays page metadata
// ═══════════════════════════════════════════════════════════════
```

### News Variant Example (with Time Display)

```javascript
// For News articles, also set displayDateTime for time display
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "heading": "Breaking: Major Healthcare Partnership Announced",
    "subheading": "<p>Two industry leaders join forces to revolutionize care delivery.</p>",
    "datePublished": "20240115T000000Z",
    "displayDateTime": "20240115T143000Z"  // Shows 2:30 PM in News variant
  }
});
```

### Variant Selection via Rendering

To use a specific variant, use the corresponding rendering ID:

| Variant | Rendering Name | Metadata Schema |
|---------|----------------|-----------------|
| Default | `ArticleHeader` | Article |
| Careers | `ArticleHeader-Careers` | JobPosting |
| Insights | `ArticleHeader-Insights` | Report |
| News | `ArticleHeader-News` | NewsArticle |

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| heading | Single-Line Text | Page item | `"Plain text value"` |
| subheading | Rich Text | Page item | `"<p>HTML content</p>"` |
| pageCategory | Multilist | Page item | `"{GUID}"` |
| datePublished | Date | Page item | `"20240115T120000Z"` |
| displayDateTime | Date | Page item | `"20240115T143000Z"` |

### Date Format Reference

Sitecore dates in MCP use ISO format without separators:

| Example Date | MCP Format |
|--------------|------------|
| January 15, 2024 | `"20240115T000000Z"` |
| January 15, 2024 2:30 PM | `"20240115T143000Z"` |
| March 1, 2024 9:00 AM | `"20240301T090000Z"` |

### MCP Authoring Checklist

Before authoring ArticleHeader via MCP, verify:

- [ ] Have article page ID (from `mcp__marketer__search_site`)
- [ ] Have ArticleHeader rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] heading field has content (required for SEO)
- [ ] datePublished is in correct format (`YYYYMMDDTHHMMSSZ`)
- [ ] Have pageCategory GUID if categorizing
- [ ] Using correct variant for content type

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ArticleHeader_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| Date not displaying | Wrong date format | Use ISO format: `20240115T000000Z` |
| Category not showing | pageCategory GUID invalid | Verify GUID from Page Categories folder |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-pagebuilder` | Page creation and component placement |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-05 | Initial documentation | Claude Code |
