---
name: sitecore-author-article-page
description: Use when user wants to create/edit/author article pages, blog posts, or update article fields (heading, tags, publish date). Auto-invoked for "create article", "edit article", "update article tags", "publish article" requests. (project)
---

# Article Page Author Skill

**Version:** 2.0

## What I do

- Create new Article Pages under `/Articles` with the correct template
  - **Article Page template uses a page branch that auto-creates ArticleHeader, ArticleBody, and ArticleFooter**
- Populate article-specific fields (heading, subheading, images, dates, tags, categories)
- Update existing article component fields if needed
- Update tags, personas, and page categories
- Handle article metadata (publish dates, author info)
- **ALWAYS provide preview URL** in final response

## Expected Output Format (REQUIRED)

Every successful authoring response MUST include:

```
Done! [Action summary]:
• Field: value
• Field: value

Preview: https://xmc-main-xxx.sitecorecloud.io/...
```

## When to use

Use this skill when:

- Creating a new article/blog post page
- Editing article content (headlines, body, images)
- Adding or updating tags on article pages
- Setting article metadata (publish dates, categories)
- Working specifically with Article Page template pages

## Trigger Patterns (Auto-Invoke)

**Automatically invoke this skill when user says:**

| User Input | Action | Example |
|:-----------|:-------|:--------|
| "create article [title]" | Create new article | "Create article about AI innovation" |
| "new blog post about [topic]" | Create new article | "New blog post about healthcare" |
| "author article [title]" | Create new article | "Author article The Future of Work" |
| "edit article [name]" | Edit existing article | "Edit The Art of Mindful Living" |
| "update article [field]" | Update article fields | "Update article tags to Healthcare" |
| "publish article" | Set publish date/status | "Publish article with today's date" |
| "add tags to article" | Update article tags | "Add Healthcare and Tech tags to article" |

**Keywords that trigger this skill:**
- article, blog post, publish, author (when referring to pages)
- Article-specific fields: heading, subheading, datePublished, lastUpdated
- When working in `/Articles` folder

**Do NOT use this skill for:**
- Creating Landing Pages (use `/sitecore-author`)
- Adding components (use `/sitecore-author`)
- General page creation outside `/Articles` folder

---

## Article Page Template

**Template ID:** `f201f27e-c1ca-4949-be52-539bcc3b89d0`
**Template Name:** Article Page
**Parent Location:** `/sitecore/content/sites/main/home/articles`

### Most Common Fields

| Field Name | Type | Purpose |
|:-----------|:-----|:--------|
| `heading` | single-line text | Article title/headline |
| `subheading` | rich text | Article subtitle or summary |
| `image` | image | Featured image (use `/sitecore-author-image`) |
| `datePublished` | date | Publication date (`YYYYMMDDTHHmmssZ`) |
| `SxaTags` | treelistex | Content tags (use `/sitecore-author-tags`) |

**For complete field list** (20+ fields including SEO, social media, etc.):
Read `references/article-page-template.md`

---

## Article Components

**IMPORTANT:** Article Pages use a **page branch** that automatically creates these components:

### 1. ArticleHeader
**Rendering ID:** `3fb16cce-b455-4a98-8610-a025e9f96c6c`
**Placeholder:** `headless-main`

### 2. ArticleBody
**Rendering ID:** `231f637c-0461-4bc6-a18a-683e039a884c`
**Placeholder:** `headless-main`

### 3. ArticleFooter
**Rendering ID:** `07b66e75-e473-4f15-8880-509e6a6ff54c`
**Placeholder:** `headless-main`

**These components are automatically added when you create a new Article Page. DO NOT manually add them.**

If you need to populate fields on these components, use `marketer_get_components_on_page` to get their datasource IDs, then update fields with `marketer_update_content`.

---

## Workflow

### Creating a New Article Page

1. **Get parent location** (search for /Articles folder)
2. **Create page** with Article Page template (ID: `f201f27e-c1ca-4949-be52-539bcc3b89d0`)
   - **Page branch automatically creates ArticleHeader, ArticleBody, and ArticleFooter components**
   - DO NOT manually add these components - they're already there!
3. **Populate page fields** (heading, subheading, datePublished, image, tags)
4. **(Optional) Update component fields** if needed:
   - Use `marketer_get_components_on_page` to get component datasource IDs
   - Update fields with `marketer_update_content`
5. **Get preview URL (MANDATORY)**

**For detailed code examples:**
Read `references/field-authoring-examples.md`

### Updating Article Fields

- **Tags**: Use `/sitecore-author-tags` skill
- **Profiles**: Use `/sitecore-author-profiles` skill
- **Images**: Use `/sitecore-author-image` skill
- **Text fields**: Use `marketer_update_fields_on_content_item`
- **Checkboxes**: `"1"` = checked, `"0"` = unchecked

**For detailed code examples:**
Read `references/field-authoring-examples.md`

---

## Date Formatting

Sitecore date fields use ISO 8601 format:

- **Format:** `YYYYMMDDTHHmmssZ`
- **Example:** `20260220T120000Z` = February 20, 2026 at 12:00 PM UTC

**For detailed format guide and examples:**
Read `references/date-formatting.md`

---

## Tag Management

**IMPORTANT:** Always use `/sitecore-author-tags` skill for tag operations.

The skill handles:
- Tag name → ID mapping
- Proper field format (pipe-separated GUIDs)
- Adding/removing/replacing tags

---

## Profile Management

**IMPORTANT:** Always use `/sitecore-author-profiles` skill for profile operations.

The skill handles:
- Profile name → ID mapping
- Proper field format (pipe-separated GUIDs)
- Adding/removing/replacing profiles
- Author attribution by name

---

## Error Handling

**If you encounter errors:**
Read `references/troubleshooting.md` for common issues and solutions.

---

## Context Efficiency

**Check local data sources first:**

1. **Field definitions** - `references/article-page-template.md`
2. **Code examples** - `references/field-authoring-examples.md`
3. **Date formatting** - `references/date-formatting.md`
4. **Troubleshooting** - `references/troubleshooting.md`
5. **Component docs** - `.claude/skills/sitecore-component-docs/references/`
6. **Site config** - `.claude/data/site-config.md`
7. **Tag reference** - Use `/sitecore-author-tags` skill

**Only use MCP for:**
- Creating/updating actual content
- Searching for pages
- Getting latest page state
- Preview URLs

---

## Related Skills

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author` | General component authoring |
| `/sitecore-author-tags` | Tag management (name → ID mapping) |
| `/sitecore-author-profiles` | Profile management (name → ID mapping) |
| `/sitecore-component-docs` | Component field documentation |
| `/sitecore-author-image` | Image field XML formatting |
| `/sitecore-author-link` | Link field XML formatting |
| `/sitecore-upload-media` | Upload article images |

---

## Preview URL (MANDATORY)

**ALWAYS call `marketer_get_page_preview_url` after ANY article authoring operation.**

```javascript
const previewUrl = await marketer_get_page_preview_url({
  pageId: pageId,
  language: "en"
});
```

**This is NOT optional - include in every final response.**
