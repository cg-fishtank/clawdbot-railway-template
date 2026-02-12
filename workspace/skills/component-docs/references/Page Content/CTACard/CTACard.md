# CTACard

## Purpose

The CTACard component displays a horizontal card layout featuring an image, heading, body text, and a placeholder for action buttons. It's designed for showcasing content teasers or promotional items in a compact, visually engaging format. The component is commonly used within grid layouts or as standalone promotional blocks.

## Sitecore Configuration

### Template Path

`/sitecore/templates/Project/[Site]/Page Content/CTA Card`

### Data Source Location

`/sitecore/content/[Site]/Home/Data/CTA Cards/`

## Fields

| Field       | Sitecore Type | Required | Constraints                | Description                              |
| ----------- | ------------- | -------- | -------------------------- | ---------------------------------------- |
| heading     | Single-Line Text | Yes   | Max 80 characters          | Card headline                            |
| body        | Rich Text     | Yes      | Displays with 4-line clamp | Supporting description text              |
| image       | Image         | Yes      | Square aspect ratio        | Desktop/primary card image               |
| imageMobile | Image         | No       | Square aspect ratio        | Mobile-specific image (falls back to image) |

### Field Details

#### heading

- **Type:** Single-Line Text
- **Required:** Yes
- **Constraints:** Maximum 80 characters; displays with 2-line clamp
- **Guidance:** Create a concise, compelling headline that captures the card's main message.
- **Example:** `Streamline Your Workflow`

#### body

- **Type:** Rich Text
- **Required:** Yes
- **Constraints:** Displays with 4-line clamp in non-edit mode; basic formatting only
- **Guidance:** Provide a brief description. Content will be truncated if too long.
- **Example:**
  ```html
  <p>Discover tools and features designed to help you work smarter, not harder.</p>
  ```

#### image

- **Type:** Image
- **Required:** Yes
- **Dimensions:** 640x360px minimum (displayed as square)
- **Aspect Ratio:** 1:1 (square) - images are cropped to square
- **Formats:** JPG, PNG, WebP
- **Alt Text:** Required for accessibility
- **Example:**
  ```json
  {
    "value": {
      "src": "/-/media/Project/Site/Cards/workflow-feature.jpg",
      "alt": "Person using workflow management dashboard",
      "width": "640",
      "height": "640"
    }
  }
  ```

#### imageMobile

- **Type:** Image
- **Required:** No
- **Dimensions:** 640x360px minimum
- **Aspect Ratio:** 1:1 (square)
- **Formats:** JPG, PNG, WebP
- **Guidance:** Provide a mobile-optimized version. Falls back to `image` if not set.
- **Example:**
  ```json
  {
    "value": {
      "src": "/-/media/Project/Site/Cards/Mobile/workflow-feature-mobile.jpg",
      "alt": "Workflow dashboard mobile view",
      "width": "640",
      "height": "640"
    }
  }
  ```

## Rendering Parameters

| Parameter | Type     | Options                      | Default | Description              |
| --------- | -------- | ---------------------------- | ------- | ------------------------ |
| theme     | Droplist | primary, secondary, tertiary | primary | Card background/text theme |

## Placeholder

The CTACard includes a `buttons` placeholder for adding Button components:

| Placeholder | Key       | Allowed Components | Description                    |
| ----------- | --------- | ------------------ | ------------------------------ |
| buttons     | `buttons` | Button             | Action buttons for the card    |

## Component Interface

```typescript
type CTACardFields = ImageProps & {
  heading: Field<string>;
  body: Field<string>;
};

type CTACardFieldsProps = {
  fields: CTACardFields;
};

type CTACardProps = ComponentProps & CTACardFieldsProps;

// ImageProps from lib/hooks/useImage
type ImageProps = {
  image: ImageField;
  imageMobile: ImageField;
};
```

## JSS Field Mapping

| Field       | JSS Component                                   | Usage                           |
| ----------- | ----------------------------------------------- | ------------------------------- |
| heading     | `<Text field={fields.heading} tag="h4" />`      | Rendered with heading-lg class  |
| body        | `<RichText field={fields.body} />`              | Rendered with richtext class    |
| image       | `<NextImage field={imageSrc} />`                | Square aspect ratio with cover  |

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "heading": { "value": "Feature Highlight" },
    "body": { "value": "<p>Brief description of the feature or offering.</p>" },
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Cards/feature.jpg",
        "alt": "Feature illustration"
      }
    }
  }
}
```

### Complete (All Fields)

```json
{
  "fields": {
    "heading": { "value": "Streamline Your Workflow" },
    "body": { "value": "<p>Discover tools and features designed to help you work smarter, not harder. Our platform integrates seamlessly with your existing processes.</p>" },
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Cards/workflow-feature.jpg",
        "alt": "Person using workflow management dashboard",
        "width": "640",
        "height": "640"
      }
    },
    "imageMobile": {
      "value": {
        "src": "/-/media/Project/Site/Cards/Mobile/workflow-feature-mobile.jpg",
        "alt": "Workflow dashboard on mobile device",
        "width": "640",
        "height": "640"
      }
    }
  }
}
```

## Authoring Rules

1. **Square images:** Images are displayed in a 1:1 square format. Upload images cropped to square or ensure the subject is centered.
2. **Concise content:** Both heading (2-line clamp) and body (4-line clamp) are truncated. Keep content within visible limits.
3. **Add buttons via placeholder:** Use the buttons placeholder to add one or more Button components for actions.
4. **Alt text required:** Always provide descriptive alt text for accessibility.

## Common Mistakes

| Mistake                   | Why It's Wrong                               | Correct Approach                           |
| ------------------------- | -------------------------------------------- | ------------------------------------------ |
| Non-square images         | Image appears cropped unexpectedly           | Upload 1:1 aspect ratio images             |
| Very long body text       | Text gets truncated mid-sentence             | Keep to 2-3 sentences maximum              |
| Missing buttons           | Card has no call to action                   | Add Button components to buttons placeholder|
| Low-resolution images     | Image appears blurry                         | Use 640x640px minimum                      |

## Related Components

- `CTABlock` - Simpler CTA without image or card format
- `ContentBlock` - Similar structure with different visual treatment
- `Button` - Used within the buttons placeholder
- `CardGrid` - Often contains multiple CTACard components

## Visual Layout

Desktop:
```
┌─────────────────────────────────────────────────┐
│ ┌─────────┐                                     │
│ │         │  Heading Text                       │
│ │  Image  │  Body text description that may    │
│ │ (square)│  wrap to multiple lines...         │
│ │         │                                     │
│ └─────────┘  [ Button ]                        │
└─────────────────────────────────────────────────┘
```

Mobile:
```
┌───────────────────────┐
│ ┌───────────────────┐ │
│ │                   │ │
│ │      Image        │ │
│ │     (square)      │ │
│ └───────────────────┘ │
│ Heading Text          │
│ Body text...          │
│                       │
│ [ Button ]            │
└───────────────────────┘
```

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the CTACard component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer-mcp__search_site`)
2. Have the CTACard rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)
4. Have media IDs for the image fields

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Features Page"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add CTACard to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "ctacard-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "CTACard_1",
  language: "en",
  fields: {
    "heading": "Streamline Your Workflow",
    "body": "<p>Discover tools designed to help you work smarter.</p>"
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
    "imageMobile": "<image mediaid='{MOBILE-IMAGE-GUID}' />"
  }
});
```

### Step 4: Add Button to Buttons Placeholder

Get the component UID from the page layout, then add a Button:

```javascript
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "button-rendering-id",
  placeholderPath: "headless-main/ctacard-{UID}-buttons",
  componentItemName: "CTACard_Button",
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
// STEP 2: Add CTACard component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "ctacard-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "CTACard_Workflow",
  language: "en",
  fields: {
    "heading": "Streamline Your Workflow",
    "body": "<p>Discover tools and features designed to help you work smarter, not harder.</p>"
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
    "image": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "imageMobile": "<image mediaid='{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Add button to placeholder (requires component UID)
// ═══════════════════════════════════════════════════════════════
// Note: Get the CTACard's UID from page layout first
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "button-rendering-id",
  placeholderPath: "headless-main/ctacard-abc123-buttons",
  componentItemName: "CTACard_LearnMore_Button",
  language: "en",
  fields: {}
});

// Update button's link field...
```

### Field Type Quick Reference

| Field       | Type             | MCP Format                       |
|:------------|:-----------------|:---------------------------------|
| heading     | Single-Line Text | `"Plain text value"`             |
| body        | Rich Text        | `"<p>HTML content</p>"`          |
| image       | Image            | `<image mediaid='{GUID}' />`     |
| imageMobile | Image            | `<image mediaid='{GUID}' />`     |

### MCP Authoring Checklist

Before authoring CTACard via MCP, verify:

- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have CTACard rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `CTACard_1`)
- [ ] Have media GUIDs for image fields
- [ ] Image XML uses single quotes and braces: `<image mediaid='{GUID}' />`

### MCP Error Handling

| Error                 | Cause                    | Solution                                |
|:----------------------|:-------------------------|:----------------------------------------|
| "Item already exists" | Duplicate component name | Use unique suffix: `CTACard_2`          |
| Component not visible | Wrong placeholder path   | Use `"headless-main"` without leading slash |
| Image not showing     | Wrong XML format         | Verify single quotes, braces around GUID|
| Buttons not showing   | Wrong placeholder path   | Use correct UID suffix for buttons placeholder |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
