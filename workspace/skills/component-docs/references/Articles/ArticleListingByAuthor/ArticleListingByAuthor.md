# ArticleListingByAuthor Component

## Purpose

The ArticleListingByAuthor component displays a list of articles filtered by the current author context. It automatically detects the author from the page context (typically on Author Profile pages) and filters articles to show only those written by that author. The component supports a `${name}` template variable in the heading for dynamic author name insertion and provides multiple content variants (Default, Careers, Insights, News).

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Articles/Article Listing By Author`
- **Template Name:** `Article Listing By Author`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Section heading, supports `${name}` variable | Recommended max 60 characters |

### Special Variable: `${name}`

The heading field supports a special template variable `${name}` that gets replaced with the author's full name at runtime.

**Example:** `"Articles by ${name}"` becomes `"Articles by John Smith"`

**Name Resolution Order:**
1. `displayName` (if available)
2. `firstName` + `lastName` concatenated
3. Falls back to "Articles by [Author Name]" default format

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | Rendered via `<h2>` with processed text | Native `<h2>` element (not JSS Text for dynamic replacement) |

## Component Variants

The ArticleListingByAuthor exports 4 rendering variants, each fetching content from different article templates:

| Variant | Export Name | Article Template | Use Case |
|---------|-------------|------------------|----------|
| Default | `Default` | Article | General articles, blog posts |
| Careers | `Careers` | Careers Article | Job postings, career-related content |
| Insights | `Insights` | Insights Article | Research, whitepapers, industry insights |
| News | `News` | News Article | News articles, press releases |

### Author Context Behavior

The component relies on `useAuthor()` hook to get author context:

1. **With Author Context:** Filters articles where `profiles.targetItems` contains the author's name
2. **Without Author Context:** Displays all articles (component should be placed on Author Profile pages)

### Article Filtering Logic

```javascript
// Filters articles by matching author name against article profiles
const filtered = allResults.filter((article) => {
  const profiles = article.profiles?.targetItems || [];
  return profiles.some((item) =>
    item?.name?.toLowerCase() === authorName.toLowerCase()
  );
});
```

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** Section title, optionally including `${name}` for dynamic author name
- **Tone/Style:** Personal, professional, focused on the author's work
- **Character limit:** 60 characters recommended (excluding variable length)
- **Template variable:** Use `${name}` where you want the author's name inserted

**Examples:**
- `"Articles by ${name}"` → "Articles by John Smith"
- `"${name}'s Latest Publications"` → "John Smith's Latest Publications"
- `"Insights from ${name}"` → "Insights from John Smith"
- `"All Articles"` → "All Articles" (no substitution)

### Content Matrix (Variations)

| Variation | Heading Pattern | Result | Use Case |
|-----------|-----------------|--------|----------|
| Dynamic | `"Articles by ${name}"` | "Articles by Jane Doe" | Personalized author attribution |
| Possessive | `"${name}'s Work"` | "Jane Doe's Work" | Author portfolio style |
| Static | `"Author Publications"` | "Author Publications" | Generic heading |

## Component Props Interface

```typescript
import { ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentWithContextProps } from 'lib/component-props';
import { ArticleDataType } from 'lib/types';
import { ProfileGQL } from 'lib/types/page/profile';
import { ArticleVariant } from 'lib/helpers/article-variants';

type ArticleListingFields = {
  heading: Field<string>;
};

type ArticleListingRenderingType = {
  rendering: ComponentRendering & {
    data: ArticleDataType[];
  };
};

export type ArticleListingProps = ComponentWithContextProps &
  ArticleListingRenderingType & {
    fields: ArticleListingFields;
    authorContext?: ProfileGQL | null;
    variant?: ArticleVariant;
  };

// Author context from useAuthor() hook:
// - id: string
// - displayName?: string
// - firstName: Field<string>
// - lastName: Field<string>
```

## Example Content Entry

### With Dynamic Name Variable

```json
{
  "fields": {
    "heading": { "value": "Articles by ${name}" }
  }
}
```

### Static Heading

```json
{
  "fields": {
    "heading": { "value": "Author's Publications" }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Article Listings/`
- Author Profile pages: `/sitecore/content/[Site]/Home/Authors/`
- Article content: `/sitecore/content/[Site]/Home/Articles/`

### Experience Editor Behavior

- **Inline editable fields:** heading (shows variable syntax, not replaced value)
- **Runtime behavior:** `${name}` replacement happens at render time, not in editor
- **Preview:** To see actual author name, preview the full page in author context

### Rendering Variant Selection

In Experience Editor or Content Editor:
1. Select the ArticleListingByAuthor component
2. Open "Rendering Properties" or "Component Properties"
3. Choose variant from dropdown: Default, Careers, Insights, or News

### Page Placement Requirements

**CRITICAL:** This component must be placed on pages that provide author context:

- **Author Profile Pages:** Pages using Author Profile template
- **Pages with AuthorContext Provider:** Any page wrapped with `AuthorProvider`

Without author context, the component displays all articles unfiltered.

## Common Mistakes to Avoid

1. **Placing on non-author pages:** The component requires author context to filter. Placing it on regular content pages shows all articles, defeating the purpose.

2. **Forgetting the `${name}` syntax:** Use `${name}` (with curly braces and dollar sign) for variable substitution. Common mistakes:
   - `$name` - Won't work (missing braces)
   - `{name}` - Won't work (missing dollar sign)
   - `%name%` - Won't work (wrong syntax)

3. **Wrong variant for author's content type:** If an author primarily writes News articles, use the News variant. Matching variants ensures their articles appear.

4. **Assuming real-time filtering:** Articles are filtered server-side on page load. The filtering isn't interactive.

5. **Missing author profiles on articles:** Articles must have the author assigned in their `profiles` field to appear. Verify author assignments if expected articles are missing.

6. **Case sensitivity issues:** Author name matching is case-insensitive, but ensure author names are consistent across profile and article assignments.

7. **Expecting pagination:** Unlike ArticleListing, this component doesn't have built-in pagination. All matching articles display in a single grid.

## Related Components

- `ArticleListing` - General article listing with tag filtering (no author context)
- `LatestArticleGrid` - Displays fixed number of latest articles
- `AuthorProfile` - Displays author bio information (provides author context)
- `AuthorProvider` - Context provider that supplies author data

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ArticleListingByAuthor component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target Author Profile page ID (use `mcp__marketer-mcp__search_site`)
2. Have the ArticleListingByAuthor rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)
4. Ensure the page provides author context

### Step 1: Find the Target Author Page

```javascript
// Search for the author profile page
await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "John Smith"  // Author name
});
// Returns: { itemId: "author-page-guid", name: "John Smith", path: "/sitecore/.../Authors/john-smith" }
```

### Step 2: Add ArticleListingByAuthor to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "author-page-guid",
  componentRenderingId: "article-listing-by-author-rendering-id",
  placeholderPath: "headless-main",  // Root level = NO leading slash
  componentItemName: "ArticlesByAuthor_1",  // Must be unique on page
  language: "en",
  fields: {
    "heading": "Articles by ${name}"  // Uses template variable
  }
});

// Returns:
// {
//   "datasourceId": "created-datasource-guid",
//   "placeholderId": "headless-main"
// }
```

### Step 3: Update Heading (Optional)

To change the heading after initial creation:

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,  // From Step 2
  language: "en",
  fields: {
    "heading": "${name}'s Latest Publications"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find the author profile page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Sarah Johnson"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add ArticleListingByAuthor component (Insights variant)
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "article-listing-by-author-insights-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "SarahsArticles_Insights",
  language: "en",
  fields: {
    "heading": "Research & Insights by ${name}"
  }
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// COMPLETE: Component displays articles filtered by Sarah Johnson
// The ${name} variable will render as "Research & Insights by Sarah Johnson"
// ═══════════════════════════════════════════════════════════════
```

### Variant Selection via Rendering

To use a specific variant, use the corresponding rendering ID:

| Variant | Rendering Name |
|---------|----------------|
| Default | `ArticleListingByAuthor` |
| Careers | `ArticleListingByAuthor-Careers` |
| Insights | `ArticleListingByAuthor-Insights` |
| News | `ArticleListingByAuthor-News` |

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text with optional ${name} variable"` |

### Template Variable Reference

| Variable | Description | Example Output |
|----------|-------------|----------------|
| `${name}` | Author's full name | "John Smith" |

**Name Resolution:**
1. Uses `displayName` if available
2. Falls back to `firstName` + " " + `lastName`
3. If heading has no `${name}`, uses heading as-is
4. If heading is empty, defaults to "Articles by [Author Name]"

### MCP Authoring Checklist

Before authoring ArticleListingByAuthor via MCP, verify:

- [ ] Target page is an Author Profile page (has author context)
- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have ArticleListingByAuthor rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `ArticlesByAuthor_1`)
- [ ] heading field uses correct `${name}` syntax if dynamic name needed
- [ ] Using correct variant rendering for author's content type

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ArticlesByAuthor_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| No articles displayed | No author context | Ensure page is an Author Profile page |
| Author name not showing | Wrong variable syntax | Use exactly `${name}` with braces |
| Wrong articles shown | Articles missing author profile | Assign author in article's profiles field |
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
| 2026-02-06 | Initial documentation | Claude Code |
