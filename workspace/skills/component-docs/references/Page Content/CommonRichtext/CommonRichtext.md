# CommonRichtext

## Purpose

The CommonRichtext component renders a simple rich text content block within a contained wrapper. It provides a straightforward way to add formatted text content to pages, supporting full HTML formatting including headings, paragraphs, lists, links, and inline styling. The component adapts to the parent theme context and applies consistent richtext styling.

## Sitecore Configuration

### Template Path

`/sitecore/templates/Project/[Site]/Page Content/Common Richtext`

### Data Source Location

`/sitecore/content/[Site]/Home/Data/Rich Text/`

## Fields

| Field | Sitecore Type | Required | Constraints              | Description                              |
| ----- | ------------- | -------- | ------------------------ | ---------------------------------------- |
| body  | Rich Text     | Yes      | Full HTML support        | Main rich text content                   |

### Field Details

#### body

- **Type:** Rich Text
- **Required:** Yes
- **Constraints:** Supports full HTML formatting; rendered within contained wrapper
- **Guidance:** Use for any formatted text content. Maintain semantic heading hierarchy (start with H2 if page has H1 title).
- **Formatting Support:**
  - Headings (H1-H6)
  - Paragraphs and line breaks
  - Bold, italic, underline text
  - Ordered and unordered lists
  - Links (internal and external)
  - Embedded images
  - Tables
  - Block quotes
- **Example:**
  ```html
  <h2>About Our Services</h2>
  <p>We provide comprehensive solutions tailored to your business needs. Our team of experts works closely with clients to deliver exceptional results.</p>
  <h3>Key Benefits</h3>
  <ul>
    <li><strong>Expert guidance</strong> from industry professionals</li>
    <li>Customized solutions for your unique challenges</li>
    <li>Ongoing support and maintenance</li>
  </ul>
  ```

## Rendering Parameters

| Parameter | Type     | Options                      | Default | Description                     |
| --------- | -------- | ---------------------------- | ------- | ------------------------------- |
| theme     | Droplist | primary, secondary, tertiary | (auto)  | Background/text theme override  |

## Component Interface

```typescript
type CommonRichtextProps = ComponentProps & {
  params: { [key: string]: string };
  fields: {
    body: Field<string>;
  };
  theme?: string;
};
```

## JSS Field Mapping

| Field | JSS Component                          | Usage                        |
| ----- | -------------------------------------- | ---------------------------- |
| body  | `<RichText field={fields.body} />`     | Rendered with richtext class |

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "body": { "value": "<p>Simple paragraph of text content.</p>" }
  }
}
```

### Complete (Full Content Example)

```json
{
  "fields": {
    "body": {
      "value": "<h2>Our Approach</h2><p>We believe in a <strong>collaborative approach</strong> that puts your business goals at the center of everything we do.</p><h3>Our Process</h3><ol><li>Discovery and requirements gathering</li><li>Strategy development</li><li>Implementation and testing</li><li>Launch and ongoing optimization</li></ol><p>Ready to get started? <a href=\"/contact\">Contact our team</a> today.</p>"
    }
  }
}
```

## Authoring Rules

1. **Semantic headings:** Start with H2 if the page already has an H1 title. Maintain proper hierarchy (H2 → H3 → H4).
2. **Accessible links:** Use descriptive link text, not "click here" or "read more" alone.
3. **Structured content:** Use lists for related items, paragraphs for prose. Avoid walls of text.
4. **No inline styles:** Use semantic HTML and let the richtext CSS classes handle styling.

## Common Mistakes

| Mistake                   | Why It's Wrong                               | Correct Approach                           |
| ------------------------- | -------------------------------------------- | ------------------------------------------ |
| Starting with H1          | Conflicts with page-level H1                 | Start body headings at H2                  |
| Inline CSS styles         | Inconsistent with site styling               | Use semantic HTML, rely on CSS classes     |
| Empty paragraphs for space| Creates accessibility issues                 | Use proper CSS margins/padding             |
| "Click here" links        | Poor accessibility and SEO                   | Use descriptive link text                  |

## Related Components

- `ArticleBody` - Rich text specifically for article pages (reads from route context)
- `ContentBlock` - Rich text with image and heading
- `Callout` - Highlighted text block with border accent

## Theme Inheritance

The CommonRichtext component supports theme inheritance:

1. If a `theme` rendering parameter is set on the component → uses that theme
2. If parent component sets a theme context → uses parent theme
3. Otherwise → falls back to default theme

The `bg-surface` class is applied to the wrapper, providing consistent background styling within the theme.

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the CommonRichtext component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the CommonRichtext rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "About Page"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add CommonRichtext to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "commonrichtext-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "CommonRichtext_1",
  language: "en",
  fields: {
    "body": "<h2>About Us</h2><p>We are a leading provider of innovative solutions.</p>"
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
  search_query: "Services"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add CommonRichtext component
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "commonrichtext-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "CommonRichtext_Services",
  language: "en",
  fields: {
    "body": `<h2>Our Services</h2>
<p>We offer a comprehensive suite of services designed to help your business succeed.</p>
<h3>Consulting</h3>
<p>Our expert consultants provide strategic guidance tailored to your unique challenges.</p>
<h3>Implementation</h3>
<p>From planning to deployment, we handle every aspect of your project.</p>
<ul>
  <li>Requirements analysis</li>
  <li>Solution architecture</li>
  <li>Development and testing</li>
  <li>Deployment and support</li>
</ul>`
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: CommonRichtext with formatted content
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field | Type      | MCP Format                |
|:------|:----------|:--------------------------|
| body  | Rich Text | `"<p>HTML content</p>"`   |

### MCP Authoring Checklist

Before authoring CommonRichtext via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have CommonRichtext rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `CommonRichtext_1`)
- [ ] HTML content is valid and properly escaped if needed

### MCP Error Handling

| Error                 | Cause                    | Solution                                  |
|:----------------------|:-------------------------|:------------------------------------------|
| "Item already exists" | Duplicate component name | Use unique suffix: `CommonRichtext_2`     |
| Component not visible | Wrong placeholder path   | Use `"headless-main"` without leading slash |
| HTML not rendering    | Invalid HTML markup      | Validate HTML structure                   |
| `updatedFields: {}`   | Normal response          | Update succeeded despite empty response   |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
