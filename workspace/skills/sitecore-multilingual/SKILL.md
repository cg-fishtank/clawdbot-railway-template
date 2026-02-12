---
name: sitecore-multilingual
description: Add language versions to SitecoreAI pages and populate them with translated content. Use when the user wants to create a new language version of an existing page (e.g., French, Spanish, German, Japanese). Handles language version creation, field population with translated content, and preview verification. All changes are drafts — never publishes automatically.
allowed-tools:
  - mcp__marketer-mcp__add_language_to_page
  - mcp__marketer-mcp__get_page
  - mcp__marketer-mcp__update_content
  - mcp__marketer-mcp__get_components_on_page
  - mcp__marketer-mcp__get_content_item_by_id
  - mcp__marketer-mcp__get_page_preview_url
  - mcp__marketer-mcp__search_site
---

# Sitecore Multilingual

**Add language versions to SitecoreAI pages and populate translated content via marketer-mcp. All changes produce drafts only — publishing requires separate approval.**

---

## Capabilities

1. **Add language versions** — Create a new language version of any existing page
2. **Populate translated fields** — Copy source content structure and populate with translated text
3. **Preview language versions** — Get preview URLs for specific language versions
4. **Audit language coverage** — Check which languages exist on a page or across pages

---

## Language Code Reference

Sitecore uses IETF BCP 47 language tags. The following are the most commonly used codes:

### Primary Languages

| Language | Code | Notes |
|:---------|:-----|:------|
| English | `en` | Default site language |
| French (Canada) | `fr-CA` | Canadian French |
| French (France) | `fr-FR` | European French |
| Spanish (Mexico) | `es-MX` | Latin American Spanish |
| Spanish (Spain) | `es-ES` | European Spanish |
| German (Germany) | `de-DE` | Standard German |
| Japanese | `ja-JP` | Japanese |
| Chinese (Simplified) | `zh-CN` | Mainland China |
| Chinese (Traditional) | `zh-TW` | Taiwan |
| Korean | `ko-KR` | Korean |
| Portuguese (Brazil) | `pt-BR` | Brazilian Portuguese |
| Italian | `it-IT` | Italian |
| Dutch | `nl-NL` | Dutch |
| Arabic | `ar-SA` | Arabic (Saudi Arabia) |

### Common Shorthand Mappings

When a user says a language name without a region, use these defaults:

| User Says | Use Code | Reason |
|:----------|:---------|:-------|
| "French" | `fr-CA` | Canadian French is the primary non-English market |
| "Spanish" | `es-MX` | Latin American Spanish is the primary Spanish market |
| "German" | `de-DE` | Standard German |
| "Japanese" | `ja-JP` | Standard Japanese |
| "Chinese" | `zh-CN` | Simplified Chinese (most common) |
| "Korean" | `ko-KR` | Standard Korean |
| "Portuguese" | `pt-BR` | Brazilian Portuguese (largest market) |
| "Italian" | `it-IT` | Standard Italian |
| "Arabic" | `ar-SA` | Saudi Arabic (most common) |

**Always confirm the language code with the user if ambiguous** (e.g., "French" could be fr-CA or fr-FR depending on the target market).

---

## Workflow: Add a Language Version to a Page

This is the primary workflow. Follow these steps in order.

```
+-----------------------------------------------------------------+
| MULTILINGUAL AUTHORING WORKFLOW                                  |
+-----------------------------------------------------------------+
|                                                                  |
|  1. IDENTIFY PAGE: Find the page to add a language version to    |
|     |                                                            |
|  2. READ SOURCE CONTENT: Get all components and field values     |
|     in the source language (usually "en")                        |
|     |                                                            |
|  3. ADD LANGUAGE VERSION: Create the new language version         |
|     on the page                                                  |
|     |                                                            |
|  4. POPULATE TRANSLATED FIELDS: Update each component's fields   |
|     with translated content, preserving structure                |
|     |                                                            |
|  5. VERIFY: Preview the page in the new language                 |
|                                                                  |
+-----------------------------------------------------------------+
```

### Step 1: Identify the Page

- If user provides a page ID, use it directly
- If user provides a page name, use `mcp__marketer-mcp__search_site` to find it
- For the Home page, ID is `b132d115-7893-49aa-a06f-f1719a8704e3` (no MCP needed)

```
mcp__marketer-mcp__search_site({ site_name: "main", search_query: "Products" })
```

### Step 2: Read Source Content

Before adding a language version, capture the full source content so you can translate it accurately.

1. Use `mcp__marketer-mcp__get_page` to get the page details
2. Use `mcp__marketer-mcp__get_components_on_page` to get all components
3. For each component with a datasource, use `mcp__marketer-mcp__get_content_item_by_id` to read all field values

**Build a content map:**
```
Source Language: en
Page: Products (b132d115-...)

Components:
1. HeroBanner (datasource: abc-123)
   - heading: "Our Products"
   - subheading: "Discover what we offer"
   - backgroundImage: <image mediaid='{GUID}' />

2. ContentBlock (datasource: def-456)
   - heading: "Featured Items"
   - body: "<p>Browse our collection...</p>"
```

**IMPORTANT:** Non-text fields (images, links, checkboxes, dates, multilists) typically do NOT need translation. Copy them as-is to the new language version.

### Step 3: Add Language Version

Use `mcp__marketer-mcp__add_language_to_page` to create the new language version:

```
mcp__marketer-mcp__add_language_to_page({
  pageId: "page-guid",
  language_request: { language: "fr-CA" }
})
```

**Check before adding:** If the user is unsure whether a language version already exists, use `mcp__marketer-mcp__get_page` with the target language to check. If the language version already exists, inform the user and ask whether they want to update the existing version instead.

### Step 4: Populate Translated Fields

For each component datasource, use `mcp__marketer-mcp__update_content` to populate the translated fields.

**Text fields — translate these:**
```
mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: "abc-123",
  language: "fr-CA",
  fields: {
    "heading": "Nos produits",
    "subheading": "D&eacute;couvrez ce que nous offrons"
  }
})
```

**Non-text fields — copy as-is:**
```
mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: "abc-123",
  language: "fr-CA",
  fields: {
    "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
  }
})
```

### Step 5: Verify

Get the preview URL for the new language version:

```
mcp__marketer-mcp__get_page_preview_url({
  pageId: "page-guid",
  language: "fr-CA"
})
```

If `get_page_preview_url` does not accept a language parameter, construct the preview URL manually using the template from `references/site-config.md`:

```
https://xmc-4qlgtraf1kmzc2kz5jkd33-eh.sitecorecloud.io/api/editing/render?sc_itemid={PAGE_ID}&sc_lang=fr-CA&sc_site=main&sc_version=1&mode=preview&sc_layoutkind=final&route={PAGE_ROUTE}&tenant_id=10053d8f-5120-4d89-f891-08de2910c96f&secret=5HB80HYQdXqyr2SnWsaCgT
```

Replace `{PAGE_ID}` and `{PAGE_ROUTE}` with the actual values. Replace `sc_lang=fr-CA` with the target language code.

---

## Workflow: Audit Language Coverage

When the user wants to check which languages exist on a page or set of pages:

1. Use `mcp__marketer-mcp__get_page` for each target page, querying each potential language
2. Report which languages have versions and which do not

**Report format:**
```
Language Coverage Report: [Page Name]

Available versions:
- en (English) - source language
- fr-CA (French Canadian) - all fields populated

Missing versions:
- es-MX (Spanish Mexico)
- de-DE (German)

Recommendation: [Based on user's target markets]
```

---

## Translation Guidelines

### What to Translate

| Field Type | Translate? | Notes |
|:-----------|:-----------|:------|
| Single-Line Text | Yes | Headings, labels, button text |
| Multi-Line Text | Yes | Preserve `<br />` tags for line breaks |
| Rich Text | Yes | Translate text content, preserve HTML structure |
| Image | No | Copy image XML as-is (same asset, all languages) |
| General Link (external) | Partial | Translate `text` attribute; update `url` only if locale-specific URL exists |
| General Link (internal) | Partial | Translate `text` attribute; keep same `id` unless pointing to a different page |
| Checkbox | No | Copy as-is |
| Date | No | Copy as-is |
| Number | No | Copy as-is |
| Multilist | No | Copy as-is |

### Special Characters in Translations

**Use HTML entities for accented characters and special symbols** to ensure reliable rendering:

| Character | Entity | Example |
|:----------|:-------|:--------|
| e with accent (e) | `&eacute;` | `D&eacute;couvrir` (Decouvrir) |
| e with grave (e) | `&egrave;` | `Acc&egrave;s` |
| a with accent (a) | `&agrave;` | `D&agrave;` |
| c with cedilla (c) | `&ccedil;` | `Fran&ccedil;ais` |
| Quotation marks | `&quot;` | `&quot;Bienvenue&quot;` |
| En dash | `&ndash;` | `2024&ndash;2025` |

**IMPORTANT:** Same rules as the content-author skill apply — never use escaped double quotes (`\"`) or literal `\n` in field values. Use `&quot;` for quotes and `<br />` for line breaks.

### Translation Quality

- If the user provides translations, use them as-is
- If the user asks you to translate, provide your best translation but **always present it for review before applying**
- For professional/marketing content, recommend the user have translations reviewed by a native speaker
- Maintain the same tone and style as the source content
- Preserve brand names, product names, and technical terms unless the user specifies localized versions

---

## Pre-Translation Checklist

Before starting a multilingual authoring session, verify:

- [ ] Source language page exists and has content populated
- [ ] Target language code confirmed with user (especially for ambiguous requests like "French")
- [ ] Source content has been read and mapped (all components + all fields)
- [ ] User has provided or approved translations for text fields
- [ ] Non-text fields identified (to copy as-is)

---

## Complete Example: Add French (fr-CA) to Home Page

```
// STEP 1: Identify page
// Home Page ID: b132d115-7893-49aa-a06f-f1719a8704e3 (from site-config.md)

// STEP 2: Read source content
mcp__marketer-mcp__get_components_on_page({
  pageId: "b132d115-7893-49aa-a06f-f1719a8704e3"
})
// Returns: HeroBanner (datasource: abc-123), ContentBlock (datasource: def-456)

mcp__marketer-mcp__get_content_item_by_id({
  itemId: "abc-123"
})
// Returns: heading="Welcome", subheading="Explore our offerings",
//          backgroundImage="<image mediaid='{GUID}' />"

mcp__marketer-mcp__get_content_item_by_id({
  itemId: "def-456"
})
// Returns: heading="About Us", body="<p>We are a leading...</p>"

// STEP 3: Add French language version
mcp__marketer-mcp__add_language_to_page({
  pageId: "b132d115-7893-49aa-a06f-f1719a8704e3",
  language_request: { language: "fr-CA" }
})

// STEP 4: Populate translated fields

// HeroBanner — translate text fields, copy image as-is
mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: "abc-123",
  language: "fr-CA",
  fields: {
    "heading": "Bienvenue",
    "subheading": "D&eacute;couvrez nos offres",
    "backgroundImage": "<image mediaid='{GUID}' />"
  }
})

// ContentBlock — translate all text fields
mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: "def-456",
  language: "fr-CA",
  fields: {
    "heading": "&Agrave; propos de nous",
    "body": "<p>Nous sommes un leader...</p>"
  }
})

// STEP 5: Verify with preview
// Construct preview URL with sc_lang=fr-CA:
// https://xmc-4qlgtraf1kmzc2kz5jkd33-eh.sitecorecloud.io/api/editing/render?sc_itemid=b132d115-7893-49aa-a06f-f1719a8704e3&sc_lang=fr-CA&sc_site=main&sc_version=1&mode=preview&sc_layoutkind=final&route=/&tenant_id=10053d8f-5120-4d89-f891-08de2910c96f&secret=5HB80HYQdXqyr2SnWsaCgT
```

---

## Confirmation Workflow

### Before Executing

Present the translation plan:
```
I'm going to add a [Language] (code) version to [Page Name] with:

Source content (en):
- HeroBanner: heading="Welcome", subheading="Explore our offerings"
- ContentBlock: heading="About Us"

Translated content ([code]):
- HeroBanner: heading="[translated]", subheading="[translated]"
- ContentBlock: heading="[translated]"

Non-text fields (copied as-is):
- HeroBanner: backgroundImage (same image)

Proceed? (yes/no)
```

### After Executing

Confirm with:
```
Language version added: [Language] ([code]) on [Page Name]

Translated components:
- [Component]: [field count] fields updated
- [Component]: [field count] fields updated

Preview (source): [URL with sc_lang=en]
Preview (translated): [URL with sc_lang=code]

Note: This is a draft. Publishing requires separate approval via sitecore-content-publisher.
```

---

## Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Language version already exists" | Language already added to page | Ask user if they want to update existing version instead |
| "Invalid language code" | Unsupported or malformed code | Check the language code reference above; verify with user |
| "Page not found" | Invalid page ID | Verify the page exists using `search_site` |
| Fields not updating | Wrong `language` parameter | Ensure `language` is passed to `update_content` for the target language |
| Preview shows source language | Wrong `sc_lang` in URL | Manually construct preview URL with correct `sc_lang` parameter |
| `updatedFields: {}` response | Normal behavior | The update succeeded — `update_content` returns empty on success |

---

## Safety Rules

- **Never publish** — this skill creates language version drafts only. Publishing requires the `sitecore-content-publisher` skill and approval workflow.
- **Always read source content first** — never create a language version without capturing the source content structure, or fields will be empty.
- **Always confirm translations before applying** — present the translation plan to the user and wait for approval before writing content.
- **Always confirm the language code** — if the user's request is ambiguous (e.g., "French"), clarify whether they mean fr-CA, fr-FR, or another variant.
- **Never skip non-text fields** — images, links, and other structured fields should be copied to the new language version to avoid broken layouts.
- **Preserve source content structure** — the translated version should have the same components with the same field structure as the source.

---

## Cross-Skill References

- **sitecore-content-reader**: Use to inspect existing page content before translating
- **sitecore-content-author**: Shares the same `update_content` tool and field format rules (image XML, link XML, special characters)
- **sitecore-content-publisher**: Required to publish language versions after approval
