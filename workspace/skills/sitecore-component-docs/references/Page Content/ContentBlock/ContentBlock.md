# ContentBlock

## Purpose

The ContentBlock component displays a content section featuring an optional image, heading, body text, and a placeholder for action buttons. It offers two layout variants: Default (image above content) and ImageLeft (image positioned to the left of content on desktop). The component is commonly used for feature highlights, service descriptions, or any content that benefits from visual accompaniment.

## Sitecore Configuration

### Template Path

`/sitecore/templates/Project/[Site]/Page Content/Content Block`

### Data Source Location

`/sitecore/content/[Site]/Home/Data/Content Blocks/`

## Fields

| Field       | Sitecore Type    | Required | Constraints                | Description                              |
| ----------- | ---------------- | -------- | -------------------------- | ---------------------------------------- |
| heading     | Single-Line Text | Yes      | Max 100 characters         | Block headline                           |
| body        | Rich Text        | No       | 5-line clamp in display    | Supporting descriptive content           |
| image       | Image            | No       | Square aspect ratio        | Desktop/primary image                    |
| mobileImage | Image            | No       | Square aspect ratio        | Mobile-specific image (fallback to image)|

### Field Details

#### heading

- **Type:** Single-Line Text
- **Required:** Yes
- **Constraints:** Maximum 100 characters recommended
- **Guidance:** Create a clear, descriptive headline that summarizes the content block's topic.
- **Example:** `Enterprise-Grade Security`

#### body

- **Type:** Rich Text
- **Required:** No
- **Constraints:** Displays with 5-line clamp in non-edit mode; basic formatting supported
- **Guidance:** Provide supporting details. Keep concise as content is truncated on display.
- **Example:**
  ```html
  <p>Our platform is built with security at its core. We implement industry-leading practices to protect your data and ensure compliance with global standards.</p>
  ```

#### image

- **Type:** Image
- **Required:** No
- **Dimensions:** 640x360px minimum (displayed as square)
- **Aspect Ratio:** 1:1 (square) - images are cropped to fit
- **Formats:** JPG, PNG, WebP
- **Alt Text:** Required for accessibility
- **Example:**
  ```json
  {
    "value": {
      "src": "/-/media/Project/Site/Features/security-shield.jpg",
      "alt": "Security shield icon representing data protection",
      "width": "640",
      "height": "640"
    }
  }
  ```

#### mobileImage

- **Type:** Image
- **Required:** No
- **Dimensions:** 640x360px minimum
- **Aspect Ratio:** 1:1 (square)
- **Formats:** JPG, PNG, WebP
- **Guidance:** Provide a mobile-optimized version. Falls back to `image` if not set.

## Rendering Parameters

| Parameter   | Type     | Options                      | Default | Description                     |
| ----------- | -------- | ---------------------------- | ------- | ------------------------------- |
| theme       | Droplist | primary, secondary, tertiary | primary | Background/text theme           |
| transparent | Checkbox | true, false                  | false   | Transparent background (ImageLeft only) |

## Component Variants

| Variant   | Export Name | Layout Description                      | Use Case                        |
|-----------|-------------|----------------------------------------|----------------------------------|
| Default   | `Default`   | Image above, content below (stacked)   | Standard feature blocks          |
| ImageLeft | `ImageLeft` | Image left, content right (side-by-side)| Feature highlights with emphasis |

## Placeholder

The ContentBlock includes a `buttons` placeholder for adding Button components:

| Placeholder | Key       | Allowed Components | Description                    |
| ----------- | --------- | ------------------ | ------------------------------ |
| buttons     | `buttons` | Button             | Action buttons for the block   |

## Component Interface

```typescript
type ContentBlockFields = {
  image?: ImageField;
  mobileImage?: ImageField;
  heading: Field<string>;
  body?: Field<string>;
};

export type ContentBlockProps = ComponentProps & {
  fields: ContentBlockFields;
};
```

## JSS Field Mapping

| Field   | JSS Component                                   | Usage                           |
| ------- | ----------------------------------------------- | ------------------------------- |
| heading | `<Text field={fields?.heading} tag="h2" />`     | Rendered with heading-3xl class |
| body    | `<RichText field={fields?.body} />`             | Rendered with richtext class, 5-line clamp |
| image   | `<NextImage field={fields?.image} />`           | Square aspect ratio with cover  |

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "heading": { "value": "Our Commitment to Excellence" }
  }
}
```

### Complete (All Fields)

```json
{
  "fields": {
    "heading": { "value": "Enterprise-Grade Security" },
    "body": { "value": "<p>Our platform is built with security at its core. We implement industry-leading practices to protect your data and ensure compliance with global standards including SOC 2, GDPR, and HIPAA.</p>" },
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Features/security-shield.jpg",
        "alt": "Security shield icon representing data protection",
        "width": "640",
        "height": "640"
      }
    },
    "mobileImage": {
      "value": {
        "src": "/-/media/Project/Site/Features/Mobile/security-shield-mobile.jpg",
        "alt": "Security shield icon",
        "width": "320",
        "height": "320"
      }
    }
  }
}
```

## Authoring Rules

1. **Square images work best:** Images are displayed in 1:1 square format. Crop images appropriately or center the subject.
2. **Concise body text:** Content is truncated to 5 lines. Keep supporting text focused and brief.
3. **Use buttons for actions:** Add Button components to the buttons placeholder for CTAs.
4. **Choose the right variant:** Use ImageLeft for feature highlights where the image deserves more emphasis.

## Common Mistakes

| Mistake                   | Why It's Wrong                               | Correct Approach                           |
| ------------------------- | -------------------------------------------- | ------------------------------------------ |
| Non-square images         | Image appears cropped unexpectedly           | Upload 1:1 aspect ratio images             |
| Very long body text       | Text gets truncated mid-sentence             | Keep to 3-4 sentences maximum              |
| Missing image alt text    | Accessibility violation                      | Always provide descriptive alt text        |
| Empty body with just heading | Looks incomplete                          | Add supporting text or reconsider component |

## Related Components

- `CTACard` - Similar structure in card format for grids
- `CTABlock` - Simpler CTA without image
- `Button` - Used within the buttons placeholder
- `CommonRichtext` - For text-only content without image

## Visual Layout

### Default Variant
```
┌───────────────────────────────────┐
│ ┌───────────────────────────────┐ │
│ │                               │ │
│ │           Image               │ │
│ │          (square)             │ │
│ │                               │ │
│ └───────────────────────────────┘ │
│                                   │
│ Heading Text                      │
│                                   │
│ Body text content that provides   │
│ supporting information...         │
│                                   │
│ [ Button ] [ Button ]             │
└───────────────────────────────────┘
```

### ImageLeft Variant (Desktop)
```
┌─────────────────────────────────────────────────────┐
│ ┌─────────────┐                                     │
│ │             │  Heading Text                       │
│ │   Image     │                                     │
│ │  (square)   │  Body text content that provides   │
│ │             │  supporting information...          │
│ └─────────────┘                                     │
│                  [ Button ] [ Button ]              │
└─────────────────────────────────────────────────────┘
```

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the ContentBlock component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer-mcp__search_site`)
2. Have the ContentBlock rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)
4. Have media IDs for any images

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Features Page"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add ContentBlock to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "contentblock-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ContentBlock_1",
  language: "en",
  fields: {
    "heading": "Enterprise-Grade Security",
    "body": "<p>Our platform is built with security at its core.</p>"
  }
});

const datasourceId = result.datasourceId;
```

### Step 3: Update Image Fields

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "image": "<image mediaid='{IMAGE-GUID}' />",
    "mobileImage": "<image mediaid='{MOBILE-IMAGE-GUID}' />"
  }
});
```

### Step 4: Add Button to Buttons Placeholder

```javascript
// Get the ContentBlock's UID from page layout first
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "button-rendering-id",
  placeholderPath: "headless-main/contentblock-{UID}-buttons",
  componentItemName: "ContentBlock_LearnMore",
  language: "en",
  fields: {}
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Features"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add ContentBlock component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "contentblock-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "ContentBlock_Security",
  language: "en",
  fields: {
    "heading": "Enterprise-Grade Security",
    "body": "<p>Our platform is built with security at its core. We implement industry-leading practices to protect your data.</p>"
  }
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update image fields
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "image": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Add button to placeholder
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "button-rendering-id",
  placeholderPath: "headless-main/contentblock-abc123-buttons",
  componentItemName: "ContentBlock_LearnMore_Button",
  language: "en",
  fields: {}
});
```

### Variant Selection

To use the ImageLeft variant, use the corresponding rendering ID:

| Variant   | Rendering Name          |
|-----------|-------------------------|
| Default   | `ContentBlock`          |
| ImageLeft | `ContentBlock-ImageLeft`|

### Field Type Quick Reference

| Field       | Type             | MCP Format                       |
|:------------|:-----------------|:---------------------------------|
| heading     | Single-Line Text | `"Plain text value"`             |
| body        | Rich Text        | `"<p>HTML content</p>"`          |
| image       | Image            | `<image mediaid='{GUID}' />`     |
| mobileImage | Image            | `<image mediaid='{GUID}' />`     |

### MCP Authoring Checklist

Before authoring ContentBlock via MCP, verify:

- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have ContentBlock rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `ContentBlock_1`)
- [ ] Have media GUIDs for image fields if using images
- [ ] Image XML uses single quotes and braces: `<image mediaid='{GUID}' />`

### MCP Error Handling

| Error                 | Cause                    | Solution                                 |
|:----------------------|:-------------------------|:-----------------------------------------|
| "Item already exists" | Duplicate component name | Use unique suffix: `ContentBlock_2`      |
| Component not visible | Wrong placeholder path   | Use `"headless-main"` without leading slash |
| Image not showing     | Wrong XML format         | Verify single quotes, braces around GUID |
| Buttons not showing   | Wrong placeholder path   | Use correct UID suffix for buttons placeholder |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
