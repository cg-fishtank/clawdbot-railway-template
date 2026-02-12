---
name: sitecore-pagebuilder
description: You MUST use this skill when creating new pages in SitecoreAI. Provides end-to-end page creation guidance — template selection, component layout planning, CTA placement, naming conventions, and the full build workflow. Use when the user wants to create a new page from scratch or build out a page with multiple components.
allowed-tools:
  - mcp__marketer-mcp__create_page
  - mcp__marketer-mcp__get_page
  - mcp__marketer-mcp__get_page_template_by_id
  - mcp__marketer-mcp__list_available_insertoptions
  - mcp__marketer-mcp__add_component_on_page
  - mcp__marketer-mcp__get_allowed_components_by_placeholder
  - mcp__marketer-mcp__get_components_on_page
  - mcp__marketer-mcp__list_sites
  - mcp__marketer-mcp__get_site_information
  - mcp__marketer-mcp__list_components
---

# Sitecore Page Builder

**End-to-end page creation guidance for SitecoreAI via marketer-mcp. Covers template selection, component layout planning, CTA placement, naming conventions, and the full build workflow.**

---

## Context Efficiency — Check Local Files First

**The context window is a public good.** Before making MCP calls, check local reference files from the `sitecore-content-author` skill.

### Reference Data Files

| File | Replaces MCP Call | Use For |
|:-----|:------------------|:--------|
| `sitecore-content-author/references/page-templates.md` | `list_available_insertoptions` | Template IDs and use cases |
| `sitecore-content-author/references/component-registry.md` | `list_components` | Rendering IDs, field schemas, placeholder keys |
| `sitecore-content-author/references/site-config.md` | `list_sites`, `get_site_information` | Site name, Home page ID |
| `sitecore-content-author/references/placeholder-patterns.md` | Manual placeholder construction | Dynamic placeholder path rules |

**Only use MCP for:**
- Creating pages (`create_page`)
- Adding components (`add_component_on_page`)
- Querying live page state (`get_components_on_page`, `get_page`)
- Information not available in local reference files

---

## Page Creation Workflow (5 Phases)

```
+---------------------------------------------------------------+
| PAGE BUILDER WORKFLOW                                          |
+---------------------------------------------------------------+
|                                                                |
|  PHASE 1: PLAN                                                 |
|  Gather requirements -> select template -> plan component      |
|  layout -> define naming scheme -> get user approval           |
|  |                                                             |
|  PHASE 2: CREATE PAGE                                          |
|  create_page with correct template under correct parent        |
|  -> returns page ID                                            |
|  |                                                             |
|  PHASE 3: ADD COMPONENTS                                       |
|  Add root components to headless-main in visual order          |
|  -> track dynamic IDs for child components                     |
|  |                                                             |
|  PHASE 4: ADD CHILD COMPONENTS                                 |
|  Add Buttons, Cards, AccordionDrawers to parent placeholders   |
|  -> use dynamic placeholder paths                              |
|  |                                                             |
|  PHASE 5: VERIFY                                               |
|  get_components_on_page to confirm structure                   |
|  -> get preview URL for visual review                          |
|  -> present summary to user                                    |
|                                                                |
+---------------------------------------------------------------+
```

---

## Phase 1: Plan the Page

Before creating anything, gather requirements and present a plan for user approval.

### Step 1.1: Determine the Page Template

Select the template based on the page's purpose:

| Content Type | Template | Template ID |
|:-------------|:---------|:------------|
| General marketing page | Landing Page | `300f3d1b-52ef-4734-8eab-ae2e2a422759` |
| Blog index / article archive | Article Listing Page | `7a6105a8-f696-4a58-865a-510e8998956b` |
| Event calendar / webinar listing | Event Listing Page | `959f1c50-f8f6-4c59-9cd0-2f8f21301835` |
| Basic page listing | Simple Page Listing | `a7a46a68-a7e1-439d-bdd1-c5011daddd6f` |
| Author profiles listing | Author Listing Page | `aeba6e45-26a3-4f97-a7f0-e76a3f852d18` |
| Insights / blog posts listing | Insight Listing Page | `3bf160f3-9328-4591-87fa-4383a4abbe2e` |
| News articles listing | News Listing Page | `739f1c8e-e25a-4d57-8a69-4842bae5b91f` |
| Career opportunities listing | Career Listing Page | `64e3be7c-32e5-417e-a540-d59f9eaed502` |
| Error page (404/500) | Error Page | `13db779e-4ae1-44f9-b83d-1500ef844adc` |
| URL redirect | Redirect | `c14b6289-8ac2-439c-9e5b-40de9f820c3f` |

**Default choice:** Use **Landing Page** for most new pages. It supports full component flexibility.

**Decision tree:**
1. Is this a listing page (articles, events, news, careers, insights, authors)? -> Use the matching listing template
2. Is this an error page? -> Use Error Page template
3. Is this a redirect? -> Use Redirect template
4. Everything else -> Use Landing Page

### Step 1.2: Plan the Component Layout

Map the page content to components. Present this as a visual plan:

```
Plan for [Page Name]:

Template: Landing Page (300f3d1b-52ef-4734-8eab-ae2e2a422759)
Parent: /sitecore/content/sites/main/home

Components (in visual order):
1. HeroBanner (headless-main)
   - heading: "..."
   - subheading: "..."
   - backgroundImage: [needs media ID]
   - Child: Button with CTA link

2. CardGrid (headless-main)
   - heading: "Our Services"
   - Children: 3x Card with image, heading, body, link

3. CTABlock (headless-main)
   - heading: "Ready to get started?"
   - Child: Button with CTA link

Total: 3 root components + 5 child components = 8 operations

Proceed? (yes/no)
```

### Step 1.3: Define Naming Scheme

All component item names must be **unique** within the page. Use this convention:

| Pattern | Example | When to Use |
|:--------|:--------|:------------|
| `{ComponentType}_{PageSlug}_{N}` | `HeroBanner_about_1` | Default pattern for all components |
| `{ComponentType}_{PageSlug}_{N}_{M}` | `Button_about_1_1` | Child components (N = parent index, M = child index) |
| `Card_{PageSlug}_{ParentN}_{CardN}` | `Card_services_2_1` | Cards within a CardGrid |

**Rules:**
- Use PascalCase for the component type
- Use lowercase-with-hyphens for the page slug
- Always include a numeric suffix to prevent collisions
- Child components reference their parent's index number

---

## Phase 2: Create the Page

### Step 2.1: Create Page via MCP

```
mcp__marketer-mcp__create_page({
  templateId: "300f3d1b-52ef-4734-8eab-ae2e2a422759",
  parentId: "b132d115-7893-49aa-a06f-f1719a8704e3",
  name: "About Us",
  language: "en"
})
```

**Parameters:**
- `templateId`: From the template selection in Phase 1 (required)
- `parentId`: Parent page GUID — use Home page ID from site-config.md, NOT a path (required)
- `name`: The display name of the page, use Title Case (required)
- `language`: Default `"en"` (optional)

**Result:** Returns the new page's item ID. Store this for all subsequent operations.

### Page Naming Conventions

| Page Type | Name Format | Example |
|:----------|:------------|:--------|
| Marketing page | Title Case, descriptive | `"About Us"`, `"Our Services"` |
| Campaign landing | Title Case with context | `"Spring 2026 Campaign"` |
| Sub-page | Title Case, matches navigation | `"Team Members"` |

**Rules:**
- Use Title Case (capitalize major words)
- Keep names concise but descriptive
- Avoid special characters except hyphens
- Page name becomes part of the URL slug (Sitecore auto-generates the slug)

---

## Phase 3: Add Root Components

Add root-level components to the `headless-main` placeholder in visual order (top to bottom as they appear on the page).

### Typical Page Layouts

#### Marketing Landing Page
```
1. HeroBanner — full-width hero with heading, background image, CTA button
2. CardGrid or CardBanner — feature highlights with 3-4 cards
3. SplitBanner — alternating image/text section
4. ContentBlock — body copy section
5. CTABlock — bottom call-to-action with button
```

#### Content/Information Page
```
1. HeroBanner or ContentBanner — page header
2. CommonRichtext — main body content
3. Accordion — FAQ or expandable sections
4. CTABlock — next steps / contact CTA
```

#### Service Detail Page
```
1. HeroBanner — service hero with CTA
2. IconFeatureCardGrid — key features/benefits
3. SplitBanner — detailed explanation with image
4. CardGrid — related services or case studies
5. CTABlock — conversion CTA
```

### Component Selection Guide

| Content Need | Component | Notes |
|:-------------|:----------|:------|
| Page hero / banner | HeroBanner | Full-width, requires background image + mobile image |
| Image + text side by side | SplitBanner | Has image, heading, subheading, body, link |
| Text-only banner | ContentBanner or TextBanner | Heading + optional subheading/body |
| Video header | VideoBanner | Heading + video URL |
| Grid of feature cards | CardGrid | Parent with Card children |
| Scrollable card row | CardCarousel | Parent with Card children |
| Cards with banner heading | CardBanner | Parent with Card children, has subheading |
| Icon-based features | IconFeatureCardGrid | Parent with IconFeatureCard children |
| Rich body text | CommonRichtext | Single rich text body field |
| Simple text block | ContentBlock | Heading + body + optional image |
| Expandable sections | Accordion | Parent with AccordionDrawer children |
| Tabbed content | TabsContainer | Parent with TabItem children |
| Call-to-action strip | CTABlock | Heading + body + Button child |
| Standalone CTA card | CTACard | Heading + body + image (no child button) |
| Alert / notification | AlertBanner | Heading + body, dismissible |
| Visual separator | Separator | No fields, purely visual |
| Standalone image | Image | Single image + alt text |
| Standalone video | Video | Video URL + optional heading |
| Informational callout | Callout | Heading + body + optional image |

### Adding Root Components

Root components use `headless-main` with **NO leading slash**:

```
mcp__marketer-mcp__add_component_on_page({
  pageId: "{page-id}",
  componentRenderingId: "{rendering-id}",
  placeholderPath: "headless-main",
  componentItemName: "HeroBanner_about_1",
  fields: {
    "heading": "About Us",
    "subheading": "Learn about our mission"
  }
})
```

**Track the order of components added.** Each component gets a sequential dynamic ID (1, 2, 3...) that you need for child placeholder paths.

---

## Phase 4: Add Child Components

After adding root components, add their children (Buttons, Cards, AccordionDrawers, etc.).

### CTA Mapping Rules

Different components handle CTAs differently:

| Parent Component | CTA Method | How to Implement |
|:-----------------|:-----------|:-----------------|
| HeroBanner | Separate Button child | Add Button component to `/headless-main/buttons-{dynamicId}` |
| SplitBanner | Separate Button child | Add Button component to `/headless-main/buttons-{dynamicId}` |
| ContentBanner | Separate Button child | Add Button component to `/headless-main/buttons-{dynamicId}` |
| TextBanner | Separate Button child | Add Button component to `/headless-main/buttons-{dynamicId}` |
| ContentBlock | Separate Button child | Add Button component to `/headless-main/buttons-{dynamicId}` |
| CTABlock | Separate Button child | Add Button component to `/headless-main/buttons-{dynamicId}` |
| AccordionDrawer | Separate Button child | Add Button to `/headless-main/accordion-{parentId}/buttons-{dynamicId}` |
| Card | **Inline link field** | Set the `link` field on the Card itself — do NOT create a separate Button |
| CTACard | **No CTA** | Has no link field and no button placeholder |
| IconFeatureCard | **No CTA** | Has no link field and no button placeholder |

**Critical rule:** Cards do NOT get separate Button children. Their CTA is the `link` field on the Card component itself.

### Dynamic Placeholder Construction

Child components use placeholder paths with a **leading slash**:

```
/{parent-placeholder}/{child-key}-{dynamic-id}
```

**To get the dynamic ID:**
1. After adding root components, call `mcp__marketer-mcp__get_components_on_page`
2. Find the parent component in the response
3. Read its `DynamicPlaceholderId` value
4. Construct: `/{parent-placeholder}/{child-key}-{dynamicId}`

**Common child placeholder patterns:**

| Parent | Child Key | Child Component | Path Example |
|:-------|:----------|:----------------|:-------------|
| HeroBanner | buttons | Button | `/headless-main/buttons-1` |
| SplitBanner | buttons | Button | `/headless-main/buttons-3` |
| ContentBlock | buttons | Button | `/headless-main/buttons-5` |
| CTABlock | buttons | Button | `/headless-main/buttons-7` |
| CardGrid | cards | Card | `/headless-main/cards-2` |
| CardBanner | cards | Card | `/headless-main/cards-4` |
| CardCarousel | cards | Card | `/headless-main/cards-6` |
| IconFeatureCardGrid | cards | IconFeatureCard | `/headless-main/cards-8` |
| Accordion | accordion | AccordionDrawer | `/headless-main/accordion-1` |
| TabsContainer | tabscontainer | TabItem | `/headless-main/tabscontainer-1` |

**Note:** The numeric IDs above are examples only. Always query `get_components_on_page` for the actual `DynamicPlaceholderId` values.

### Cumulative Counting Rule

Sitecore assigns a unique, sequential ID to **every** component added to the page (both parents and children). The dynamic ID is cumulative across all components.

**Example sequence:**
1. HeroBanner (1st component added) -> dynamic ID: 1. Button placeholder: `/headless-main/buttons-1`
2. Button child (2nd component added) -> dynamic ID: 2
3. SplitBanner (3rd component added) -> dynamic ID: 3. Button placeholder: `/headless-main/buttons-3`
4. Button child (4th component added) -> dynamic ID: 4
5. CardGrid (5th component added) -> dynamic ID: 5. Card placeholder: `/headless-main/cards-5`
6. Card child (6th component added) -> dynamic ID: 6

**Always verify with `get_components_on_page`** rather than relying on manual counting, especially for pages with existing components.

---

## Phase 5: Verify and Present

### Step 5.1: Verify Component Structure

After all components are added:

```
mcp__marketer-mcp__get_components_on_page({ pageId: "{page-id}" })
```

Confirm:
- All planned components are present
- Placeholder paths are correct
- Datasource IDs are assigned
- Parent-child relationships are correct

### Step 5.2: Get Preview URL

```
mcp__marketer-mcp__get_page_preview_url({ pageId: "{page-id}", language: "en" })
```

### Step 5.3: Present Build Summary

```
Page Build Complete: [Page Name]

Template: [Template Name]
Location: /sitecore/content/sites/main/home/[page-name]
Components: [N] total ([X] root + [Y] children)

Component Tree:
+-- HeroBanner (headless-main)
|   +-- Button (buttons-1)
+-- CardGrid (headless-main)
|   +-- Card (cards-3)
|   +-- Card (cards-3)
|   +-- Card (cards-3)
+-- CTABlock (headless-main)
    +-- Button (buttons-8)

Preview: [URL]

Note: This page is a DRAFT. Publishing requires approval via sitecore-content-publisher.
```

---

## Link Field Formatting

When populating link fields (on Buttons, Cards, SplitBanners), use this exact XML format with **single quotes**:

**External link:**
```
<link text='Display Text' linktype='external' url='https://example.com' anchor='' target='_blank' />
```

**Internal link:**
```
<link text='Display Text' linktype='internal' url='' anchor='' target='' id='{GUID}' />
```

**Rules:**
- MUST use single quotes around ALL attribute values
- ALL attributes required: `text`, `linktype`, `url`, `anchor`, `target`
- External links: populate `url`, leave `id` out
- Internal links: populate `id` with braces, leave `url` empty
- Empty attributes must still be present: `anchor='' target=''`
- Use `target='_blank'` for external links that should open in a new tab

---

## Image Field Formatting

When populating image fields, use this XML format:

```
<image mediaid='{GUID}' />
```

**Rules:**
- MUST use single quotes around attribute values
- GUID MUST have braces: `{GUID}`
- GUID should be UPPERCASE
- Self-closing tag with space before `/>`
- If image needs to be uploaded first, use the `sitecore-upload-media` skill

---

## Content and Naming Conventions

### Content Rules
- **Use exact copy** provided by the user. Do not invent placeholder or lorem ipsum text.
- **If no copy is provided**, ask the user for content rather than generating filler text.
- **Use `&quot;` for double quotes** in all text fields. Never use escaped double quotes (`\"`).
- **Use `<br />` for line breaks** in multi-line text fields. Never use literal `\n`.
- **Use HTML tags for rich text** fields: `<p>`, `<strong>`, `<em>`, `<ul>`, `<li>`, etc.

### Naming Rules
- **Page names:** Title Case, descriptive, no special characters except hyphens
- **Component item names:** `{ComponentType}_{PageSlug}_{Index}` pattern, always unique
- **Child item names:** `{ComponentType}_{PageSlug}_{ParentIndex}_{ChildIndex}` pattern

---

## Safety Rules

- **Never publish** — this skill creates drafts only. Publishing requires the `sitecore-content-publisher` skill and approval workflow.
- **Always present the full plan** before executing any operations. Wait for user approval.
- **Always verify after building** — use `get_components_on_page` and preview URL to confirm.
- **If building 4+ components**, present the plan broken into phases and confirm each phase.
- **Track all operations** — if any step fails, report what succeeded and what failed. Do not retry automatically.

---

## Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Page already exists" | Duplicate page name at same path | Use a different page name or check if the page exists first with `get_page` |
| "Template not found" | Invalid template ID | Verify against the template table in Phase 1 |
| "Item already exists" | Duplicate component item name | Use unique naming convention with numeric suffix |
| Component not visible | Wrong placeholder path | Check leading slash rules (root = no slash, nested = with slash) |
| "Cannot find field" | Wrong field name | Check component-registry.md for exact name (case-sensitive) |
| Child not placed correctly | Wrong dynamic ID | Query `get_components_on_page` for actual `DynamicPlaceholderId` |
| Image not showing | Wrong XML format | Use single quotes, braces around GUID: `<image mediaid='{GUID}' />` |
| Link not working | Missing XML attributes | Include ALL attributes: text, linktype, url, anchor, target |

---

## Complete Example: Building an "About Us" Page

```
// PHASE 1: Plan approved by user
// Template: Landing Page (300f3d1b-52ef-4734-8eab-ae2e2a422759)
// Components: HeroBanner + Button, SplitBanner + Button, CTABlock + Button

// PHASE 2: Create the page
mcp__marketer-mcp__create_page({
  templateId: "300f3d1b-52ef-4734-8eab-ae2e2a422759",
  parentId: "b132d115-7893-49aa-a06f-f1719a8704e3",
  name: "About Us",
  language: "en"
})
// -> Returns pageId: "aaa-bbb-ccc-..."

// PHASE 3: Add root components (in visual order)

// 3a. Add HeroBanner (dynamic ID will be 1)
mcp__marketer-mcp__add_component_on_page({
  pageId: "aaa-bbb-ccc-...",
  componentRenderingId: "5e9d7b60-f61b-407b-b04b-2eeba60b0ec0",
  placeholderPath: "headless-main",
  componentItemName: "HeroBanner_about_1",
  fields: {
    "heading": "About Us",
    "subheading": "Building the future together",
    "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "backgroundImageMobile": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
  }
})

// 3b. Add SplitBanner (dynamic ID will be assigned after Button)
mcp__marketer-mcp__add_component_on_page({
  pageId: "aaa-bbb-ccc-...",
  componentRenderingId: "f22c31f6-9a23-406b-8285-4391a49926f7",
  placeholderPath: "headless-main",
  componentItemName: "SplitBanner_about_1",
  fields: {
    "heading": "Our Mission",
    "body": "We believe in creating exceptional experiences.",
    "image": "<image mediaid='{ANOTHER-GUID-HERE}' />",
    "imageMobile": "<image mediaid='{ANOTHER-GUID-HERE}' />"
  }
})

// 3c. Add CTABlock
mcp__marketer-mcp__add_component_on_page({
  pageId: "aaa-bbb-ccc-...",
  componentRenderingId: "e276274f-5c13-4b76-ac83-d7a867975696",
  placeholderPath: "headless-main",
  componentItemName: "CTABlock_about_1",
  fields: {
    "heading": "Ready to work with us?",
    "body": "Get in touch to discuss your project."
  }
})

// PHASE 4: Add child components

// 4a. Query page to get dynamic IDs
mcp__marketer-mcp__get_components_on_page({ pageId: "aaa-bbb-ccc-..." })
// -> HeroBanner DynamicPlaceholderId: 1
// -> SplitBanner DynamicPlaceholderId: 3 (because HeroBanner=1, its Button=2, SplitBanner=3)
// -> CTABlock DynamicPlaceholderId: 5 (SplitBanner Button=4, CTABlock=5)

// 4b. Add Button to HeroBanner
mcp__marketer-mcp__add_component_on_page({
  pageId: "aaa-bbb-ccc-...",
  componentRenderingId: "c152f7dc-6c01-4380-babb-97c9f080cf00",
  placeholderPath: "/headless-main/buttons-1",
  componentItemName: "Button_about_1_1",
  fields: {
    "link": "<link text='Learn More' linktype='external' url='https://example.com/learn' anchor='' target='' />"
  }
})

// 4c. Add Button to SplitBanner
mcp__marketer-mcp__add_component_on_page({
  pageId: "aaa-bbb-ccc-...",
  componentRenderingId: "c152f7dc-6c01-4380-babb-97c9f080cf00",
  placeholderPath: "/headless-main/buttons-3",
  componentItemName: "Button_about_2_1",
  fields: {
    "link": "<link text='Our Work' linktype='external' url='https://example.com/work' anchor='' target='' />"
  }
})

// 4d. Add Button to CTABlock
mcp__marketer-mcp__add_component_on_page({
  pageId: "aaa-bbb-ccc-...",
  componentRenderingId: "c152f7dc-6c01-4380-babb-97c9f080cf00",
  placeholderPath: "/headless-main/buttons-5",
  componentItemName: "Button_about_3_1",
  fields: {
    "link": "<link text='Contact Us' linktype='external' url='https://example.com/contact' anchor='' target='' />"
  }
})

// PHASE 5: Verify
mcp__marketer-mcp__get_components_on_page({ pageId: "aaa-bbb-ccc-..." })
mcp__marketer-mcp__get_page_preview_url({ pageId: "aaa-bbb-ccc-...", language: "en" })
```

---

## Relationship to Other Skills

| Skill | When to Hand Off |
|:------|:-----------------|
| `sitecore-content-author` | After page structure is built, for detailed field editing (complex field types, updates to existing components) |
| `sitecore-content-reader` | To inspect existing pages before creating similar ones, or to verify build results |
| `sitecore-content-publisher` | When the draft page is ready to go live (requires Slack approval) |
| `sitecore-upload-media` | When images need to be uploaded before they can be used in image fields |
| `sitecore-author-image` | For guidance on image XML formatting |
| `sitecore-author-link` | For guidance on link XML formatting |
| `sitecore-author-placeholder` | For guidance on dynamic placeholder path construction |
