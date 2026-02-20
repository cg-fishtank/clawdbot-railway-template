# Field Authoring Examples

## Creating a New Article Page

### Basic Article Creation

```javascript
const newPage = await marketer_create_page({
  templateId: "f201f27e-c1ca-4949-be52-539bcc3b89d0",
  parentId: articlesParentId,
  name: "Article Title",
  language: "en",
  fields: [
    { name: "heading", value: "Article Title" },
    { name: "subheading", value: "<p>Article summary</p>" },
    { name: "datePublished", value: "20260220T120000Z" }
  ]
});
```

### Get Articles Folder Parent

```javascript
const articlesFolder = await marketer_search_site({
  site_name: "main",
  search_query: "articles"
});
// Or use known parent ID from site-config
```

## Updating Article Fields

### Text Fields

```javascript
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: {
    heading: "Updated Title",
    subheading: "<p>Updated summary</p>",
    NavigationTitle: "Nav Title"
  }
});
```

### Rich Text Fields

Rich text fields accept HTML:

```javascript
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: {
    subheading: "<p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>"
  }
});
```

### Checkbox Fields

```javascript
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: {
    pageRequiresAuth: "1" // "1" = checked, "0" = unchecked
  }
});
```

### Date Fields

See `date-formatting.md` for date format details.

```javascript
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: {
    datePublished: "20260220T120000Z",
    lastUpdated: "20260220T120000Z"
  }
});
```

### Image Fields

**Use `/sitecore-author-image` skill for proper XML formatting.**

### Tag Fields

**Use `/sitecore-author-tags` skill for deterministic tag management.**

## Common Workflows

### Create New Blog Post

```
/sitecore-author-article-page
Create article "The Future of AI" under /Articles
- Heading: "The Future of AI"
- Subheading: "Exploring innovations in artificial intelligence"
- Tags: Technology, Innovation
- Date: Today
```

**Steps:**
1. Search for /Articles folder
2. Create page with Article Page template
   - **Page branch automatically creates ArticleHeader, ArticleBody, ArticleFooter components**
3. Populate page fields (heading, subheading, datePublished)
4. Use `/sitecore-author-tags` to add tags
5. Get preview URL

### Update Article Metadata

```
/sitecore-author-article-page
Update "The Art of Mindful Living" article
- Add tags: Healthcare, Wellness
- Update publish date: February 20, 2026
```

**Steps:**
1. Search for article by name
2. Update datePublished field
3. Use `/sitecore-author-tags` to add tags
4. Get preview URL

### Update Article Component Fields

**IMPORTANT:** Article Pages use a page branch that automatically creates ArticleHeader, ArticleBody, and ArticleFooter. DO NOT manually add these components.

If you need to update fields on these existing components:

**Steps:**
1. Use `marketer_get_components_on_page` to get component list
2. Find the component by rendering name (ArticleHeader, ArticleBody, or ArticleFooter)
3. Extract the datasource ID from the component
4. Update fields using `marketer_update_content` with the datasource ID
5. Get preview URL

**Example:**
```javascript
// Get all components on the page
const pageData = await marketer_get_components_on_page({
  pageId: pageId,
  language: "en"
});

// Find ArticleHeader component
const articleHeader = pageData.components.find(c => c.renderingName === "ArticleHeader");
const headerDatasourceId = articleHeader.dataSource;

// Update ArticleHeader fields
await marketer_update_content({
  itemId: headerDatasourceId,
  siteName: "main",
  fields: {
    title: "Custom Header Title"
  }
});
```

## Multi-Language Fields

```javascript
// Add language version first
await marketer_add_language_to_page({
  pageId: pageId,
  language_request: { language: "fr" }
});

// Then update fields for that language
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: {
    heading: "Titre de l'article",
    subheading: "<p>Résumé de l'article</p>"
  }
});
```
