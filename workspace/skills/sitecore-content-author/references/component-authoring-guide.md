# Component Authoring Guide (MCP Quick Reference)

> Condensed from Docs.md files for all registered components. Use this as the primary
> reference when authoring components via `mcp__marketer-mcp__add_component_on_page` and
> `mcp__marketer-mcp__update_content`.

---

## 1. Universal Formatting Rules

These rules apply to EVERY component. Get these wrong and the field silently fails.

### Image Fields (XML)
`<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />`
- Single quotes around attribute values (NOT double quotes)
- GUID wrapped in braces `{...}`, must be UPPERCASE
- Images CANNOT be set in `add_component_on_page` -- must use `update_content` separately

### Link Fields (XML)
- **External:** `<link text='Learn More' linktype='external' url='https://example.com' anchor='' target='_blank' />`
- **Internal (by ID):** `<link text='Learn More' linktype='internal' id='{PAGE-GUID}' url='' anchor='' target='' />`
- **Internal (by path):** `<link text='Learn More' linktype='internal' url='/page-path' anchor='' target='' />`
- Single quotes around ALL attribute values; `linktype` is one word
- Prefer `id='{GUID}'` for internal links when target page GUID is known

### Rich Text Fields
`"<p>Paragraph text with <strong>bold</strong> and <em>italic</em>.</p>"`
- Wrap in `<p>` tags; use `<br />` for line breaks (NOT `\n`)
- Use `&quot;` for literal quotes (NOT `\"`), `&#10;` for newlines in code blocks
- Supports: `<h2>`-`<h6>`, `<p>`, `<ul>`, `<ol>`, `<li>`, `<strong>`, `<em>`, `<a>`

### Other Field Types
- **Single-Line Text:** `"Plain text value"` (no HTML)
- **Checkbox:** `"1"` (true) or `"0"` (false)
- **Date:** `"20240115T120000Z"`

### General Rules
- Field names are **case-sensitive** (e.g., `backgroundImage` not `BackgroundImage`)
- `updatedFields: {}` in response is normal -- update succeeded
- Placeholder paths: Root = NO leading slash (`headless-main`), Nested = WITH leading slash (`/headless-main/buttons-1`)
- Component item names must be unique per page (use suffixes: `_1`, `_2`, etc.)

---

## 2. Two-Step Authoring Pattern

Most components with images or links follow this pattern:

```
Step 1: add_component_on_page  -->  set text fields (heading, body, etc.)
                                    returns datasourceId
Step 2: update_content          -->  set image/link fields using datasourceId
                                    uses XML format
```

Components with ONLY text fields (TextBanner, CommonRichtext) can be fully authored in Step 1.

---

## 3. Banners

### HeroBanner

| Field                 | Type             | MCP Format                    | Required |
|:----------------------|:-----------------|:------------------------------|:---------|
| heading               | Single-Line Text | `"Plain text value"`          | Yes      |
| subheading            | Rich Text        | `"<p>HTML content</p>"`      | No       |
| backgroundImage       | Image            | `<image mediaid='{GUID}' />`  | Yes      |
| backgroundImageMobile | Image            | `<image mediaid='{GUID}' />`  | No       |

**Placeholder:** `buttons` -- accepts Button components
**Placeholder path:** `/headless-main/buttons-{dynamicId}`
**Variants:** Default
**Gotchas:**
- Max 60 chars for heading
- Subheading has max-width 600px constraint
- Dark overlay (25% black) is applied over background image

### SplitBanner

| Field       | Type             | MCP Format                          | Required |
|:------------|:-----------------|:------------------------------------|:---------|
| heading     | Single-Line Text | `"Plain text value"`                | Yes      |
| subheading  | Rich Text        | `"<p>HTML content</p>"`            | No       |
| body        | Rich Text        | `"<p>HTML content</p>"`            | No       |
| image       | Image            | `<image mediaid='{GUID}' />`        | Yes      |
| imageMobile | Image            | `<image mediaid='{GUID}' />`        | No       |
| link        | General Link     | `<link linktype='internal' ... />`  | No       |

**Placeholder:** `buttons` -- accepts Button components
**Placeholder path:** `/headless-main/buttons-{dynamicId}`
**Variants:** Default, Contained (`SplitBanner-Contained`)
**Gotchas:**
- Max 80 chars for heading
- Image fills half the component width on desktop
- `bannerImgLeft` rendering param controls image side (default: right)

### ContentBanner

| Field                 | Type             | MCP Format                    | Required |
|:----------------------|:-----------------|:------------------------------|:---------|
| heading               | Single-Line Text | `"Plain text value"`          | Yes      |
| body                  | Rich Text        | `"<p>HTML content</p>"`      | No       |
| backgroundImage       | Image            | `<image mediaid='{GUID}' />`  | Yes      |
| backgroundImageMobile | Image            | `<image mediaid='{GUID}' />`  | No       |

**Placeholder:** `buttons` -- accepts Button components
**Placeholder path:** `/headless-main/buttons-{dynamicId}`
**Variants:** Default
**Gotchas:**
- Max 80 chars for heading
- Gradient overlay transitions from image to surface color
- `bannerContentAlignment` param: `md:mr-auto` (left) or `md:ml-auto` (right, default)

### TextBanner

| Field      | Type             | MCP Format              | Required |
|:-----------|:-----------------|:------------------------|:---------|
| heading    | Single-Line Text | `"Plain text value"`    | Yes      |
| subheading | Rich Text        | `"<p>HTML content</p>"` | No       |

**Placeholder:** `buttons` -- accepts Button components
**Placeholder path:** `/headless-main/buttons-{dynamicId}`
**Variants:** Default
**Gotchas:**
- No images -- text-only banner with surface background
- Subheading max-width 800px
- All fields can be set in `add_component_on_page` (no update_content needed)
- Default alignment is centered

---

## 4. Cards

### CardGrid (Container)

| Field   | Type             | MCP Format           | Required |
|:--------|:-----------------|:---------------------|:---------|
| heading | Single-Line Text | `"Plain text value"` | Yes      |

**Placeholder:** `cards` -- accepts Card components (NOTE: use `cards` not `cardgrid` from manifest)
**Child placeholder path:** `/headless-main/cards-{dynamicId}`
**Variants:** Default (`CardGrid`), ContentCentered (`CardGrid-ContentCentered`), FullWidth (`CardGrid-FullWidth`)
**Gotchas:**
- The `DYNAMIC_PLACEHOLDER_ID` is returned when you add the CardGrid component
- Balance card count with grid columns (3-col: use 3, 6, 9 cards)
- `cardGrid` rendering param controls columns: `md:grid-cols-2`, `md:grid-cols-3`, `md:grid-cols-4`

### Card (Child -- placed inside CardGrid)

| Field       | Type             | MCP Format                                              | Required |
|:------------|:-----------------|:--------------------------------------------------------|:---------|
| heading     | Single-Line Text | `"Plain text value"`                                    | Yes      |
| body        | Rich Text        | `"<p>HTML content</p>"`                                 | No       |
| link        | General Link     | `<link linktype='internal' id='{GUID}' text='Text' />`  | No       |
| image       | Image            | `<image mediaid='{GUID}' />`                            | Yes      |
| imageMobile | Image            | `<image mediaid='{GUID}' />`                            | No       |
| badge       | Single-Line Text | `"Plain text value"`                                    | No       |

**No placeholder** -- Card is a leaf component (no children)
**Gotchas:**
- Cards must be placed inside a container (CardGrid, CardCarousel, CardBanner)
- Entire card is clickable when link is provided
- Badge max 15 chars, appears in top-left of image
- Images displayed in square aspect ratio (cropped)
- Max 60 chars for heading (truncates after 2 lines)

---

## 5. Page Content

### Button (Child -- placed inside parent placeholders)

| Field | Type         | MCP Format                                                       | Required |
|:------|:-------------|:-----------------------------------------------------------------|:---------|
| link  | General Link | `<link linktype='internal' url='/path' text='Link Text' />`      | Yes      |

**No placeholder** -- Button is a leaf component
**Typical parent placeholder path:** `headless-main/{parent-component}-{UID}-buttons`
**Gotchas:**
- Link field CANNOT be set in `add_component_on_page` -- use `update_content`
- Button auto-selects contrasting color based on parent theme
- Use action-oriented link text (not "Click here")

### ContentBlock

| Field       | Type             | MCP Format                   | Required |
|:------------|:-----------------|:-----------------------------|:---------|
| heading     | Single-Line Text | `"Plain text value"`         | Yes      |
| body        | Rich Text        | `"<p>HTML content</p>"`     | No       |
| image       | Image            | `<image mediaid='{GUID}' />` | No       |
| mobileImage | Image            | `<image mediaid='{GUID}' />` | No       |

**Placeholder:** `buttons` -- accepts Button components
**Placeholder path:** `/headless-main/buttons-{dynamicId}`
**Variants:** Default (`ContentBlock`), ImageLeft (`ContentBlock-ImageLeft`)
**Gotchas:**
- NOTE: mobile image field is `mobileImage` (NOT `imageMobile` like other components)
- Images displayed in 1:1 square aspect ratio (cropped)
- Body text is truncated to 5 lines in display
- Max 100 chars for heading

### CTABlock

| Field   | Type             | MCP Format                                                     | Required |
|:--------|:-----------------|:---------------------------------------------------------------|:---------|
| heading | Single-Line Text | `"Plain text value"`                                           | Yes      |
| body    | Rich Text        | `"<p>HTML content</p>"`                                       | No       |
| link    | General Link     | `<link linktype='internal' url='/path' text='Link Text' />`    | No       |

**No placeholder** -- link renders as inline button (not via Button child)
**Variants:** Default
**Gotchas:**
- Link renders as a solid button (built-in, not via placeholder)
- Keep body to 1-2 sentences (CTA should be scannable)
- Max 80 chars for heading

### CommonRichtext

| Field | Type      | MCP Format              | Required |
|:------|:----------|:------------------------|:---------|
| body  | Rich Text | `"<p>HTML content</p>"` | Yes      |

**No placeholder** -- no children
**Variants:** Default
**Gotchas:**
- Only has ONE field (`body`)
- Supports full HTML: headings, lists, tables, links, images
- Start with `<h2>` (not `<h1>`) if page already has a title
- Can be fully authored in `add_component_on_page` (no update_content needed)

### Callout

| Field   | Type             | MCP Format                                                     | Required |
|:--------|:-----------------|:---------------------------------------------------------------|:---------|
| heading | Single-Line Text | `"Plain text value"`                                           | Yes      |
| body    | Rich Text        | `"<p>HTML content</p>"`                                       | Yes      |
| link    | General Link     | `<link linktype='internal' url='/path' text='Link Text' />`    | Yes      |

**No placeholder** -- link renders as text link with arrow icon
**Variants:** Default
**Gotchas:**
- ALL THREE fields are required (unlike most components)
- Link displays as text link with arrow (not a button)
- Use sparingly -- 1-2 per page max for visual impact
- Left border accent based on theme
- Max 100 chars for heading

---

## 6. Tabs

### TabsContainer (Container -- no fields)

| Field | Type | MCP Format | Required |
|:------|:-----|:-----------|:---------|
| (none) | -- | `fields: {}` | -- |

**Placeholder:** `tabscontainer` -- accepts TabItem components (dynamic placeholder)
**Child placeholder path:** `/headless-main/tabscontainer-{dynamicId}`
**Variants:** Default (`TabsContainer`), VerticalLeft (`TabsContainer-VerticalLeft`), VerticalRight (`TabsContainer-VerticalRight`)
**Gotchas:**
- NO DATA SOURCE FIELDS -- pass `fields: {}` when adding
- Must add at least 2 TabItem children for it to be useful
- Save the `componentId` from the response for constructing child placeholder path
- Vertical layouts auto-switch to horizontal on mobile
- Max 5 tabs for horizontal layout; use vertical for 6+

### TabItem (Child -- placed inside TabsContainer)

| Field   | Type             | MCP Format              | Required |
|:--------|:-----------------|:------------------------|:---------|
| heading | Single-Line Text | `"Plain text value"`    | Yes      |
| body    | Rich Text        | `"<p>HTML content</p>"` | Yes      |

**No placeholder** -- TabItem is a leaf component
**Gotchas:**
- heading becomes the tab label text
- Keep tab labels concise and parallel in structure

---

## 7. Common Mistakes to Avoid (Cross-Component)

| # | Mistake | Impact | Fix |
|---|---------|--------|-----|
| 1 | Using double quotes in image XML | Image silently fails to render | Use single quotes: `mediaid='{GUID}'` |
| 2 | Missing braces around GUID | Field not recognized | Always wrap: `{GUID}` |
| 3 | Lowercase GUID | May fail on some Sitecore instances | Use UPPERCASE GUIDs |
| 4 | Setting images in `add_component_on_page` | Images silently ignored | Use separate `update_content` call |
| 5 | Wrong leading slash | Component not placed | Root = `headless-main` (no slash), Nested = `/headless-main/buttons-1` (with slash) |
| 6 | Duplicate `componentItemName` on same page | "Item already exists" error | Add unique suffix: `_1`, `_2` |
| 7 | Wrong field casing | "Cannot find field" error | Field names are case-sensitive |
| 8 | `updatedFields: {}` panic | This is normal | Empty response means success |
| 9 | Using `imageMobile` for ContentBlock | Field not found | ContentBlock uses `mobileImage` |
| 10 | Forgetting to save `datasourceId` | Cannot update image/link fields | Always capture the return value |

---

## 8. Placeholder Path Quick Reference

| Component      | Placeholder Key  | Child Placeholder Path Pattern             |
|:---------------|:-----------------|:-------------------------------------------|
| HeroBanner     | `buttons`        | `/headless-main/buttons-{dynamicId}`       |
| SplitBanner    | `buttons`        | `/headless-main/buttons-{dynamicId}`       |
| ContentBanner  | `buttons`        | `/headless-main/buttons-{dynamicId}`       |
| TextBanner     | `buttons`        | `/headless-main/buttons-{dynamicId}`       |
| CardGrid       | `cards`          | `/headless-main/cards-{dynamicId}`         |
| CardBanner     | `cards`          | `/headless-main/cards-{dynamicId}`         |
| CardCarousel   | `cards`          | `/headless-main/cards-{dynamicId}`         |
| ContentBlock   | `buttons`        | `/headless-main/buttons-{dynamicId}`       |
| CTABlock       | `buttons`        | `/headless-main/buttons-{dynamicId}`       |
| Accordion      | `accordion`      | `/headless-main/accordion-{dynamicId}`     |
| TabsContainer  | `tabscontainer`  | `/headless-main/tabscontainer-{dynamicId}` |

Components with NO placeholder (leaf components): Card, Button, CTABlock, CommonRichtext, Callout, TabItem
