# Sitecore Page Templates

**Comprehensive template reference including HOME and context-specific templates**
Last updated: 2026-02-19
Source: Marketer MCP `list_available_insertoptions`

---

## ⚠️ IMPORTANT: Template Selection Rules

**When creating pages:**

1. **Under /Home** → Use templates from "HOME-Level Templates" section below
2. **Under /Articles** → Use "Article Page" (see Context-Specific Templates)
3. **Under /News** → Use "News Page" (see Context-Specific Templates)
4. **Under /Insights** → Use "Insight Page" (see Context-Specific Templates)
5. **Under /Resources** → Use "Landing Page" or "Redirect" (see Context-Specific Templates)

**NEVER assume Landing Page is correct for all contexts!**

Always call `marketer_list_available_insertoptions` on the parent item to see what's actually available.

---

## HOME-Level Templates

Templates available directly under `/Home`:

| Template Name | Template ID | Use Case |
|:--------------|:------------|:---------|
| Simple Page Listing | `a7a46a68-a7e1-439d-bdd1-c5011daddd6f` | Basic page listings |
| Landing Page | `300f3d1b-52ef-4734-8eab-ae2e2a422759` | General purpose landing pages (default) |
| Article Listing Page | `7a6105a8-f696-4a58-865a-510e8998956b` | Lists articles with filters |
| Event Listing Page | `959f1c50-f8f6-4c59-9cd0-2f8f21301835` | Lists events with calendar |
| Error Page | `13db779e-4ae1-44f9-b83d-1500ef844adc` | 404, 500 error pages |
| Redirect | `c14b6289-8ac2-439c-9e5b-40de9f820c3f` | URL redirects |
| Author Listing Page | `aeba6e45-26a3-4f97-a7f0-e76a3f852d18` | Lists author profiles |
| Insight Listing Page | `3bf160f3-9328-4591-87fa-4383a4abbe2e` | Lists insights/blog posts |
| News Listing Page | `739f1c8e-e25a-4d57-8a69-4842bae5b91f` | Lists news articles |
| Career Listing Page | `64e3be7c-32e5-417e-a540-d59f9eaed502` | Lists career opportunities |

---

## Context-Specific Templates

These templates are ONLY available under specific parent sections.

### Under /Articles

| Template Name | Template ID | Use Case |
|:--------------|:------------|:---------|
| Redirect | `c14b6289-8ac2-439c-9e5b-40de9f820c3f` | URL redirects |
| Article Page | `168d9149-0e91-4eef-ac8c-b242f8cfe6f0` | Individual article/blog post page |

**Parent ID**: `a87f920c-730f-47bf-a0e6-92f4de9b7e5f`
**Path**: `/sitecore/content/sites/main/home/articles`
**When to use**: Creating individual pages under /Articles

### Under /News

| Template Name | Template ID | Use Case |
|:--------------|:------------|:---------|
| News Page | `26fbe5d5-3eb2-4e26-afaa-87da4878da13` | Individual news article page |

**Parent ID**: `a017f997-3fde-4fc4-9875-18551875c698`
**Path**: `/sitecore/content/sites/main/home/news`
**When to use**: Creating individual pages under /News

### Under /Insights

| Template Name | Template ID | Use Case |
|:--------------|:------------|:---------|
| Insight Page | `07fefc8d-0246-415e-8105-9246e29b099b` | Individual insight/case study page |

**Parent ID**: `065a51eb-1f09-45c6-86b4-68c4dd118001`
**Path**: `/sitecore/content/sites/main/home/insights`
**When to use**: Creating individual pages under /Insights

### Under /Resources

| Template Name | Template ID | Use Case |
|:--------------|:------------|:---------|
| Landing Page | `300f3d1b-52ef-4734-8eab-ae2e2a422759` | General purpose landing pages (default) |
| Redirect | `c14b6289-8ac2-439c-9e5b-40de9f820c3f` | URL redirects |

**Parent ID**: `ce0ca687-ab7f-4a66-8f35-7d1c0ce263e1`
**Path**: `/sitecore/content/sites/main/home/resources`
**When to use**: Creating individual pages under /Resources

---

## Most Common Templates

### Landing Page (Default for Home)
- **Template ID**: `300f3d1b-52ef-4734-8eab-ae2e2a422759`
- **Use for**: Marketing pages, product pages, general pages under /Home
- **Supports**: Full component flexibility
- **Available under**: /Home, /Resources

### Article Page (For Articles)
- **Template ID**: `168d9149-0e91-4eef-ac8c-b242f8cfe6f0`
- **Use for**: Blog posts, articles, written content
- **Supports**: Article-specific fields (author, publish date, categories)
- **Available under**: /Articles only

### News Page (For News)
- **Template ID**: `26fbe5d5-3eb2-4e26-afaa-87da4878da13`
- **Use for**: News article pages with date/time/author
- **Supports**: News-specific fields (publish date, author, category)
- **Available under**: /News only

### Insight Page (For Insights)
- **Template ID**: `07fefc8d-0246-415e-8105-9246e29b099b`
- **Use for**: Insight pages, case studies, thought leadership content
- **Supports**: Insight-specific fields (author, publish date, categories)
- **Available under**: /Insights only

### Article Listing Page
- **Template ID**: `7a6105a8-f696-4a58-865a-510e8998956b`
- **Use for**: Blog index, news index, article archives
- **Supports**: Filtering, pagination, search
- **Available under**: /Home

### Error Page
- **Template ID**: `13db779e-4ae1-44f9-b83d-1500ef844adc`
- **Use for**: 404 Not Found, 500 Server Error pages
- **Supports**: Basic content components
- **Available under**: /Home

---

## Usage Notes

- ⚠️ **THIS FILE IS REFERENCE ONLY** - Always call `list_available_insertoptions` on the parent when creating pages
- **Why?** Context-specific templates won't show up under different parents
- **Token cost**: ~600 tokens to verify correct template vs. recreating page with wrong template
- **Default for /Home**: Use Landing Page
- **Default for sections**: Use context-specific template (Article Page, News Page, Insight Page, etc.)

---

## Discovery Summary

Templates discovered from 5 locations:
- /Home: 10 templates
- /Articles: 2 templates
- /News: 1 template
- /Insights: 1 template
- /Resources: 2 templates

**Total templates**: 16
