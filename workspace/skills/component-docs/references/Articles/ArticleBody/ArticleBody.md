# ArticleBody Component

## Purpose

The ArticleBody component renders the main content body of article pages using a Rich Text field. It displays the full article content within a contained wrapper, centered on the page with responsive layout. The component supports multiple variants (Default, Careers, Insights, News) to match different article types while maintaining consistent styling.

## Sitecore Template Requirements

### Data Source

**Important:** This component reads the `body` field from the **page/route context**, not from a component-level datasource. The field must be defined on the Article Page Template.

### Template Path

- **Page Template:** `/sitecore/templates/Project/[Site]/Articles/Article Page`
- **No separate datasource template** - uses page-level fields

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| body | Rich Text | Yes | Main article content body | Full HTML support, no strict character limit |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| body | `<RichText field={body} className="richtext richtext-h1-4xl w-full" />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

The ArticleBody exports 4 rendering variants with identical functionality but different data attributes for styling/tracking:

| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | General articles, blog posts |
| Careers | `Careers` | Job postings, career-related content |
| Insights | `Insights` | Research, whitepapers, industry insights |
| News | `News` | News articles, press releases |

## Content Authoring Instructions

### Field-by-Field Guidance

#### body

- **What to enter:** The full article content including paragraphs, headings, lists, images, and other rich content
- **Tone/Style:** Consistent with the article type and brand voice
- **Formatting Support:**
  - Headings (H1-H6) - rendered with `richtext-h1-4xl` styling
  - Paragraphs and line breaks
  - Bold, italic, underline text
  - Ordered and unordered lists
  - Links (internal and external)
  - Embedded images
  - Tables
  - Block quotes
- **Example:**
```html
<h2>Introduction</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
<h3>Key Points</h3>
<ul>
  <li>First important point with <strong>emphasis</strong></li>
  <li>Second point with <a href="/related-topic">internal link</a></li>
  <li>Third point summarizing the concept</li>
</ul>
```

### Content Guidelines

| Aspect | Recommendation |
|--------|----------------|
| Structure | Use clear heading hierarchy (H2, H3, H4) |
| Paragraphs | Keep paragraphs focused and scannable |
| Links | Use descriptive link text, not "click here" |
| Images | Embed images with alt text for accessibility |
| Lists | Use lists for 3+ related items |

## Component Props Interface

```typescript
import { ComponentProps } from 'lib/component-props';

type ArticleBodyProps = ComponentProps & {
  variant?: string;
};

// The body field comes from route context:
// EventRouteFieldsType.body: CustomField (value?: string)
```

## Example Content Entry

### Page-Level Content (Article Page)

```json
{
  "fields": {
    "body": {
      "value": "<h2>Understanding Digital Transformation</h2><p>Digital transformation is reshaping how businesses operate and deliver value to customers.</p><h3>Key Benefits</h3><ul><li>Improved efficiency through automation</li><li>Enhanced customer experiences</li><li>Data-driven decision making</li></ul><p>Organizations that embrace digital transformation are better positioned for long-term success.</p>"
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Article pages: `/sitecore/content/[Site]/Home/Articles/[Article Name]`
- The `body` field is edited directly on the article page item

### Experience Editor Behavior

- **Inline editable:** Yes - the Rich Text field can be edited directly in Experience Editor
- **Rich Text Editor:** Opens full RTE with formatting toolbar
- **Real-time preview:** Changes render immediately in the contained layout

### Rendering Variant Selection

In Experience Editor or Content Editor:
1. Select the ArticleBody component
2. Open "Rendering Properties" or "Component Properties"
3. Choose variant from dropdown: Default, Careers, Insights, or News

## Common Mistakes to Avoid

1. **Inconsistent heading hierarchy:** Start with H2 for main sections (H1 is typically the page title in ArticleHeader). Progress to H3, H4 for subsections.

2. **Missing alt text on embedded images:** Always provide descriptive alt text for images embedded in the Rich Text field.

3. **Inline styles:** Avoid inline CSS styles - use semantic HTML and let the `richtext` CSS classes handle styling.

4. **Excessive formatting:** Don't over-format text. Use bold and italic sparingly for emphasis, not for visual decoration.

5. **Broken internal links:** Verify internal links point to published pages. Use Sitecore's internal link picker rather than hardcoded URLs.

6. **Large unstructured content:** Break long articles into sections with headings to improve readability and SEO.

## Related Components

- `ArticleHeader` - Displays the article title, subheading, category, and date above the body
- `ArticleBanner` - Alternative header component with hero image
- `ArticleFooter` - Displays author profiles and tags below the body
- `RichTextBlock` - Generic rich text component for non-article pages

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ArticleBody component using the Marketer MCP tools.

### Important: Route-Context Component

The ArticleBody component reads the `body` field from the **page route context**, not from a component datasource. This means:

1. The `body` field is authored on the **Article Page** itself
2. Adding the ArticleBody component to the page does not create a separate datasource
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

### Step 2: Add ArticleBody Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "article-body-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ArticleBody_1",
  language: "en",
  fields: {}  // No component-level fields
});
```

### Step 3: Update the Body Field on the Page

Since `body` is a page-level field, update it on the page item:

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,  // The page ID, not a datasource
  language: "en",
  fields: {
    "body": "<h2>Article Content</h2><p>Your rich text content here.</p>"
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
// STEP 2: Add ArticleBody component to the page
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "article-body-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ArticleBody_Main",
  language: "en",
  fields: {}
});

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update the body field on the page
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "body": `<h2>Understanding Digital Transformation</h2>
<p>Digital transformation is reshaping how businesses operate and deliver value to customers. Organizations across industries are leveraging technology to improve efficiency, enhance customer experiences, and drive innovation.</p>
<h3>Key Benefits</h3>
<ul>
  <li><strong>Improved Efficiency:</strong> Automation reduces manual processes</li>
  <li><strong>Enhanced Experiences:</strong> Better customer and employee interactions</li>
  <li><strong>Data-Driven Decisions:</strong> Analytics inform strategy</li>
</ul>
<p>Organizations that embrace digital transformation are better positioned for long-term success in an increasingly competitive landscape.</p>`
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: ArticleBody displays the page's body content
// ═══════════════════════════════════════════════════════════════
```

### Variant Selection via Rendering

To use a specific variant, use the corresponding rendering ID:

| Variant | Rendering Name |
|---------|----------------|
| Default | `ArticleBody` |
| Careers | `ArticleBody-Careers` |
| Insights | `ArticleBody-Insights` |
| News | `ArticleBody-News` |

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| body | Rich Text | Page item | `"<p>HTML content</p>"` |

### MCP Authoring Checklist

Before authoring ArticleBody via MCP, verify:

- [ ] Have article page ID (from `mcp__marketer__search_site`)
- [ ] Have ArticleBody rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Body content is valid HTML
- [ ] Update goes to page item, not datasource

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ArticleBody_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| Body content not showing | Updated wrong item | Ensure you're updating the page ID, not a datasource |
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
