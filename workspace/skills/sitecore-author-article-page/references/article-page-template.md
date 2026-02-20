# Article Page Template Reference

**Template ID:** `f201f27e-c1ca-4949-be52-539bcc3b89d0`
**Template Name:** Article Page
**Parent Location:** `/sitecore/content/sites/main/home/articles`
**Parent ID:** Check via `list_available_insertoptions` on Articles folder

## Complete Field Definitions

| Field Name | Type | Purpose | Usage Notes |
|:-----------|:-----|:--------|:------------|
| `heading` | single-line text | Article title/headline | Main H1 title |
| `subheading` | rich text | Article subtitle or summary | Supports HTML formatting |
| `image` | image | Featured image (desktop) | Use `/sitecore-author-image` skill |
| `imageMobile` | image | Featured image (mobile) | Use `/sitecore-author-image` skill |
| `datePublished` | date | Publication date | Format: `YYYYMMDDTHHmmssZ` |
| `lastUpdated` | date | Last modified date | Format: `YYYYMMDDTHHmmssZ` |
| `pageRequiresAuth` | checkbox | Require authentication | "1" = checked, "0" = unchecked |
| `SxaTags` | treelistex | Content tags | Use `/sitecore-author-tags` skill |
| `pageCategory` | treelistex | Page categorization | Pipe-separated GUIDs |
| `personas` | treelistex | Target personas | Pipe-separated GUIDs |
| `profiles` | treelistex | Audience profiles | Pipe-separated GUIDs |
| `OpenGraphTitle` | single-line text | Social media title | OG meta tag |
| `OpenGraphDescription` | multi-line text | Social media description | OG meta tag |
| `OpenGraphImageUrl` | image | Social media image | Use `/sitecore-author-image` skill |
| `TwitterTitle` | single-line text | Twitter card title | Twitter meta tag |
| `TwitterDescription` | multi-line text | Twitter card description | Twitter meta tag |
| `TwitterImage` | image | Twitter card image | Use `/sitecore-author-image` skill |
| `NavigationTitle` | single-line text | Nav menu title | Overrides page name in nav |
| `Priority` | droplink | Sitemap priority | SEO setting |
| `ChangeFrequency` | droplink | Sitemap change frequency | SEO setting |

## Most Common Fields

For quick reference, these are the most frequently used fields:

- **heading** - Article title (required)
- **subheading** - Article summary
- **datePublished** - Publication date
- **SxaTags** - Content tags (use `/sitecore-author-tags`)
- **image** - Featured image
