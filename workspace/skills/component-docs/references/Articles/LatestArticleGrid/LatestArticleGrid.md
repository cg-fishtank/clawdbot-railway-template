# LatestArticleGrid Component

## Purpose

The LatestArticleGrid component displays a fixed grid of the most recently published articles (maximum 6), automatically sorted by publication date descending. It supports multiple rendering variants (Default, VerticalList) and content variants (Careers, Insights, News), with intelligent layout adaptation when placed inside ColumnSplitter containers. The component uses server-side GraphQL data fetching with a 5-minute in-memory cache for optimal performance.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Articles/Latest Article Grid`
- **Template Name:** `Latest Article Grid`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Section heading displayed above the article grid | Recommended max 60 characters |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text tag="h2" field={fields?.heading} className="heading-4xl" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

The LatestArticleGrid exports 5 rendering variants:

### Rendering Variants (Layout)

| Variant | Export Name | Layout | Max Items | Use Case |
|---------|-------------|--------|-----------|----------|
| Default | `Default` | 3-column grid | 6 | Homepage, landing pages |
| VerticalList | `VerticalList` | Single column stack | 3 | Sidebar, narrow containers |

### Content Variants (Article Type)

| Variant | Export Name | Article Template | Use Case |
|---------|-------------|------------------|----------|
| Default | `Default` | Article | General articles, blog posts |
| Careers | `Careers` | Careers Article | Job postings, career-related content |
| Insights | `Insights` | Insights Article | Research, whitepapers, industry insights |
| News | `News` | News Article | News articles, press releases |

### Layout Behavior

**Default Variant:**
- Standalone: 3-column grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Inside ColumnSplitter: 2-column grid (`grid grid-cols-1 md:grid-cols-2`), max 4 items

**VerticalList Variant:**
- Standalone: Wrapped in ContainedWrapper
- Inside ColumnSplitter: No wrapper (direct render), max 3 items

### Caching Behavior

The component implements a 5-minute in-memory cache:
- Cache key: `latest-articles-{variant}-{templateId}-{contentRootId}-{language}-6`
- TTL: 5 minutes (300,000ms)
- Scope: Per variant and language combination

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** Section title displayed above the article grid
- **Tone/Style:** Clear, engaging, action-oriented
- **Character limit:** 60 characters recommended
- **Example:** "Latest News", "Recent Insights", "Featured Articles"

### Content Matrix (Variations)

| Variation | Required Fields | Layout | Use Case |
|-----------|-----------------|--------|----------|
| Grid | heading | 3-column | Homepage featured articles |
| Sidebar | heading | Vertical list | Blog sidebar, related content |
| Split Column | heading | 2-column | Within ColumnSplitter component |

## Component Props Interface

```typescript
import { ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentWithContextProps } from 'lib/component-props';
import { ArticleDataType } from 'lib/types';
import { ArticleVariant } from 'lib/helpers/article-variants';

export type LatestArticleGridFields = {
  heading: Field<string>;
};

type ArticleListingRenderingType = {
  rendering: ComponentRendering & {
    data: ArticleDataType[];
  };
};

export type LatestArticleGridProps = ComponentWithContextProps &
  ArticleListingRenderingType & {
    className?: string;
    fields: LatestArticleGridFields;
    max?: number;
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

### News Section Example

```json
{
  "fields": {
    "heading": { "value": "Breaking News & Updates" }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Component datasources: `/sitecore/content/[Site]/Home/Data/Latest Article Grids/`
- Article content: `/sitecore/content/[Site]/Home/Articles/`

### Experience Editor Behavior

- **Inline editable fields:** heading
- **Article grid:** Not directly editable - displays server-fetched content
- **Layout adaptation:** Preview in ColumnSplitter to see 2-column layout

### Rendering Variant Selection

In Experience Editor or Content Editor:
1. Select the LatestArticleGrid component
2. Open "Rendering Properties" or "Component Properties"
3. Choose from available variants:
   - Default (3-column grid, general articles)
   - VerticalList (single column, general articles)
   - Careers (3-column grid, careers articles)
   - Insights (3-column grid, insights articles)
   - News (3-column grid, news articles)

### Container-Aware Rendering

The component detects its container context using `useContainer()`:

| Container | Default Variant | VerticalList Variant |
|-----------|----------------|---------------------|
| None (root) | 3-col grid, 6 max, wrapped | 1-col, 3 max, wrapped |
| ColumnSplitter | 2-col grid, 4 max, wrapped | 1-col, 3 max, no wrapper |

### Server-Side Data Fetching

The component uses `getStaticProps` / `getServerSideProps` to:
1. Determine variant from rendering parameters
2. Fetch latest 6 articles via GraphQL (variant-specific query)
3. Sort by `datePublished` descending
4. Cache results for 5 minutes
5. Pass to client-side rendering

## Common Mistakes to Avoid

1. **Missing heading:** Always provide a heading value - it's required for proper component rendering and accessibility.

2. **Wrong variant for content type:** Match the component variant to your article templates:
   - General articles → Default or VerticalList variant
   - Job postings → Careers variant
   - Research/whitepapers → Insights variant
   - Press releases → News variant

3. **Expecting more than 6 articles:** The component is hard-coded to fetch and display a maximum of 6 articles. Use `ArticleListing` for paginated full listings.

4. **Expecting real-time updates:** Due to 5-minute caching, newly published articles may take up to 5 minutes to appear. Cache clears on server restart.

5. **Incorrect container expectations:** When placed in ColumnSplitter:
   - Default variant shows 4 articles max (not 6)
   - VerticalList variant removes wrapper for proper spacing

6. **Mixing rendering and content variants:** The Default/VerticalList variants are layout choices. Careers/Insights/News are content type choices. You cannot combine them (e.g., no "VerticalList-Careers" - use VerticalList for layout with general articles, or Careers for careers content with grid layout).

## Related Components

- `ArticleListing` - Full paginated article listing with tag filtering
- `ArticleListingByAuthor` - Articles filtered by author context
- `ColumnSplitter` - Parent container that triggers responsive layout
- `ArticleCard` / `TextCard` - Card components used within the grid
- `TextRow` - Row component used in VerticalList layout

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the LatestArticleGrid component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the LatestArticleGrid rendering ID from the component manifest
3. Know the target placeholder:
   - Root level: `"headless-main"`
   - Inside ColumnSplitter: Dynamic placeholder path

### Step 1: Find the Target Page

```javascript
// Search for the page where LatestArticleGrid will be added
await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Homepage"
});
// Returns: { itemId: "page-guid", name: "Home", path: "/sitecore/..." }
```

### Step 2: Add LatestArticleGrid to Page (Root Level)

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "latest-article-grid-rendering-id",
  placeholderPath: "headless-main",  // Root level = NO leading slash
  componentItemName: "LatestArticles_1",  // Must be unique on page
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

### Step 3: Add to ColumnSplitter (Nested Placement)

When placing inside a ColumnSplitter, use the dynamic placeholder path:

```javascript
// First, add ColumnSplitter to the page
const columnSplitterResult = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "column-splitter-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ColumnSplitter_1",
  language: "en",
  fields: {}
});

// Then add LatestArticleGrid to the left column
// Placeholder format: headless-main/column-splitter-{uid}-left
const latestGridResult = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "latest-article-grid-vertical-list-rendering-id",
  placeholderPath: "headless-main/column-splitter-{uid}-left",  // Replace {uid} with actual UID
  componentItemName: "LatestArticles_Sidebar",
  language: "en",
  fields: {
    "heading": "Recent Posts"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Insights Landing"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add LatestArticleGrid component (Insights variant)
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "latest-article-grid-insights-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "LatestInsights_Hero",
  language: "en",
  fields: {
    "heading": "Latest Research & Insights"
  }
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// COMPLETE: Grid displays 6 most recent Insights articles
// Automatically sorted by datePublished descending
// ═══════════════════════════════════════════════════════════════
```

### Variant Selection via Rendering

To use a specific variant, use the corresponding rendering ID:

| Variant | Rendering Name | Layout | Content Type |
|---------|----------------|--------|--------------|
| Default | `LatestArticleGrid` | 3-col grid | General articles |
| VerticalList | `LatestArticleGrid-VerticalList` | 1-col stack | General articles |
| Careers | `LatestArticleGrid-Careers` | 3-col grid | Careers articles |
| Insights | `LatestArticleGrid-Insights` | 3-col grid | Insights articles |
| News | `LatestArticleGrid-News` | 3-col grid | News articles |

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |

### Placeholder Patterns for Nested Placement

| Container | Placeholder Path Pattern |
|-----------|-------------------------|
| Root level | `"headless-main"` |
| ColumnSplitter left | `"headless-main/column-splitter-{uid}-left"` |
| ColumnSplitter right | `"headless-main/column-splitter-{uid}-right"` |

**Note:** Replace `{uid}` with the actual UID from the ColumnSplitter component.

### MCP Authoring Checklist

Before authoring LatestArticleGrid via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have LatestArticleGrid rendering ID (from component manifest)
- [ ] Correct placeholder path for placement location
- [ ] Component item name is unique (e.g., `LatestArticles_1`)
- [ ] heading field has content (required)
- [ ] Using correct variant for content type and layout needs

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `LatestArticles_2` |
| Component not visible | Wrong placeholder path | Verify placeholder path (no leading slash for root) |
| No articles displayed | Wrong variant for templates | Verify variant matches article template type |
| Only 4 articles shown | Component in ColumnSplitter | Expected behavior - max 4 in split layout |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |
| "Cannot find field" | Wrong field name | Field name is case-sensitive: `heading` |

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
