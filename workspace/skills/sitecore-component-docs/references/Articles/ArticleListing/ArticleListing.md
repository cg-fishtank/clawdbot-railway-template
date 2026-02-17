# ArticleListing Component

## Purpose

The ArticleListing component displays a paginated, filterable list of articles from the site's content repository. It supports tag-based filtering via page context, multiple content variants (Default, Careers, Insights, News), and uses server-side GraphQL data fetching for optimal performance. The component is typically used on article index pages or category landing pages to present browsable article collections.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Articles/Article Listing`
- **Template Name:** `Article Listing`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Section heading displayed above the article grid | Recommended max 60 characters |
| filterByTags | Checkbox | No | When checked, filters articles based on tags from page context | Boolean field |
| tagsHeading | Single-Line Text | No | Custom label for the tag filter display | Falls back to "Filtering by tags:" if not set |
| noResultsText | Single-Line Text | No | Message shown when tag filtering returns no matches | Falls back to variant-specific default message |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text tag="h2" field={fields?.heading} className="heading-lg mb-6" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| filterByTags | Read via `rendering.fields.filterByTags.value` | N/A (boolean check) |
| tagsHeading | `<Text field={fields.tagsHeading} tag="span" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| noResultsText | `<Text field={fields.noResultsText} />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

The ArticleListing exports 4 rendering variants, each fetching content from different article templates:

| Variant | Export Name | Article Template | Use Case |
|---------|-------------|------------------|----------|
| Default | `Default` | Article | General articles, blog posts |
| Careers | `Careers` | Careers Article | Job postings, career-related content |
| Insights | `Insights` | Insights Article | Research, whitepapers, industry insights |
| News | `News` | News Article | News articles, press releases |

### Pagination Behavior

- Articles display in a paginated grid (6 items per page by default)
- Pagination controls appear when results exceed page size
- Results sorted by `datePublished` descending (newest first)

### Tag Filtering Behavior

When `filterByTags` is enabled:
1. Component reads tags from page context (via `useContextPageTags`)
2. Articles are filtered to show only those matching the page's tags
3. If no matches found, displays all articles with a warning message
4. Custom filter messages can be configured via `tagsHeading` and `noResultsText`

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The section title displayed above the article grid
- **Tone/Style:** Clear, descriptive, action-oriented
- **Character limit:** 60 characters recommended
- **Example:** "Latest Articles", "Industry Insights", "Career Opportunities"

#### filterByTags

- **What to enter:** Check this box to enable tag-based filtering
- **Behavior:** When enabled, the component filters articles to match tags assigned to the current page
- **Use case:** Use on category pages where you want to show only relevant articles based on page taxonomy

#### tagsHeading

- **What to enter:** Label text that appears before the tag names in the filter display
- **Default:** "Filtering by tags:" (when left empty)
- **Example:** "Showing articles tagged:", "Category filter:"

#### noResultsText

- **What to enter:** Message displayed when tag filtering returns no matching articles
- **Default:** Variant-specific message (e.g., "No articles found matching your criteria")
- **Example:** "No matching articles found. Showing all results."

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Basic | heading | - | Simple article listing without filtering |
| Filtered | heading, filterByTags | tagsHeading, noResultsText | Category page with tag-based filtering |
| Custom Messages | heading, filterByTags | tagsHeading, noResultsText | Filtered listing with branded messaging |

## Component Props Interface

```typescript
import { ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentWithContextProps } from 'lib/component-props';
import { ArticleDataType } from 'lib/types';
import { ArticleVariant } from 'lib/helpers/article-variants';

type ArticleListingFields = {
  heading: Field<string>;
  filterByTags?: Field<boolean>;
  tagsHeading?: Field<string>;
  noResultsText?: Field<string>;
};

type ArticleListingRenderingType = {
  rendering: ComponentRendering & {
    data: ArticleDataType[];
  };
};

export type ArticleListingProps = ComponentWithContextProps &
  ArticleListingRenderingType & {
    fields: ArticleListingFields;
    variant?: ArticleVariant;
  };

// ArticleVariant = 'default' | 'careers' | 'insights' | 'news'
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Latest Articles" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Industry Insights & Analysis" },
    "filterByTags": { "value": true },
    "tagsHeading": { "value": "Showing articles for:" },
    "noResultsText": { "value": "No articles match your selected tags. Displaying all available content." }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Article Listings/`
- Article content: `/sitecore/content/[Site]/Home/Articles/`

### Experience Editor Behavior

- **Inline editable fields:** heading, tagsHeading, noResultsText
- **Forms panel required:** filterByTags (checkbox)
- **Article grid:** Not directly editable - displays server-fetched content

### Rendering Variant Selection

In Experience Editor or Content Editor:
1. Select the ArticleListing component
2. Open "Rendering Properties" or "Component Properties"
3. Choose variant from dropdown: Default, Careers, Insights, or News

### Server-Side Data Fetching

The component uses `getStaticProps` / `getServerSideProps` to:
1. Fetch all articles of the selected variant type via GraphQL
2. Process and normalize tag data for filtering
3. Sort articles by publication date (newest first)
4. Pass processed data to client-side rendering

## Common Mistakes to Avoid

1. **Missing heading:** Always provide a heading value - it's required for proper component rendering and accessibility.

2. **Wrong variant for content type:** Match the component variant to your article templates:
   - General articles → Default variant
   - Job postings → Careers variant
   - Research/whitepapers → Insights variant
   - Press releases → News variant

3. **Enabling filterByTags without page tags:** If `filterByTags` is enabled but the page has no assigned tags, the component will display all articles (no filtering occurs).

4. **Expecting instant filtering:** Tag filtering happens on page load based on page context - it's not interactive/real-time filtering.

5. **Mixing article types:** Each variant only displays articles from its corresponding template. Don't expect a Careers listing to show general articles.

6. **Forgetting noResultsText:** If using tag filtering, always configure `noResultsText` to provide meaningful feedback when no matches are found.

## Related Components

- `LatestArticleGrid` - Displays a fixed number of latest articles (no pagination)
- `ArticleListingByAuthor` - Filters articles by author context
- `ArticleBanner` - Banner component for individual article pages
- `ArticleCard` - Card format used within the listing grid

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ArticleListing component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer-mcp__search_site`)
2. Have the ArticleListing rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)

### Step 1: Find the Target Page

```javascript
// Search for the page where ArticleListing will be added
await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Articles Index Page"
});
// Returns: { itemId: "page-guid", name: "PageName", path: "/sitecore/..." }
```

### Step 2: Add ArticleListing to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "article-listing-rendering-id",
  placeholderPath: "headless-main",  // Root level = NO leading slash
  componentItemName: "ArticleListing_1",  // Must be unique on page
  language: "en",
  fields: {
    "heading": "Latest Articles"
  }
});

// Returns:
// {
//   "datasourceId": "created-datasource-guid",
//   "placeholderId": "headless-main"
// }
```

**IMPORTANT:** Save the `datasourceId` - it's needed for updating fields later.

### Step 3: Enable Tag Filtering (Optional)

To enable tag-based filtering, update the datasource with checkbox field:

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,  // From Step 2
  language: "en",
  fields: {
    "filterByTags": "1"  // "1" enables checkbox, "0" or "" disables
  }
});
```

### Step 4: Configure Filter Messages (Optional)

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "tagsHeading": "Showing articles for:",
    "noResultsText": "No matching articles found. Displaying all content."
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Insights Landing Page"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add ArticleListing component (Insights variant)
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "article-listing-insights-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "InsightsListing_Main",
  language: "en",
  fields: {
    "heading": "Industry Insights & Analysis"
  }
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Enable tag filtering with custom messages
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "filterByTags": "1",
    "tagsHeading": "Filtered by topic:",
    "noResultsText": "No insights match your criteria. Showing all available research."
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: ArticleListing with tag filtering enabled
// ═══════════════════════════════════════════════════════════════
```

### Variant Selection via Rendering

To use a specific variant, use the corresponding rendering ID:

| Variant | Rendering Name |
|---------|----------------|
| Default | `ArticleListing` |
| Careers | `ArticleListing-Careers` |
| Insights | `ArticleListing-Insights` |
| News | `ArticleListing-News` |

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| filterByTags | Checkbox | `"1"` (enabled) or `""` (disabled) |
| tagsHeading | Single-Line Text | `"Plain text value"` |
| noResultsText | Single-Line Text | `"Plain text value"` |

### MCP Authoring Checklist

Before authoring ArticleListing via MCP, verify:

- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have ArticleListing rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `ArticleListing_1`)
- [ ] heading field has content (required)
- [ ] filterByTags uses `"1"` for enabled (not `"true"` or `true`)
- [ ] Using correct variant rendering for content type

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ArticleListing_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| No articles displayed | Wrong variant for templates | Verify variant matches article template type |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |
| "Cannot find field" | Wrong field name | Field names are case-sensitive |
| Filtering not working | Checkbox format wrong | Use `"1"` string, not boolean or "true" |

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
