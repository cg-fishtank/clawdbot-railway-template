# SplitBanner Component

## Purpose

The SplitBanner component displays a side-by-side layout with an image on one side and content (heading, subheading, body text, and CTAs) on the other. It supports configurable image positioning (left or right) and responsive behavior that stacks content vertically on mobile. This component is ideal for feature highlights, product showcases, and content sections that benefit from visual separation between imagery and text.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Components/Banners/Split Banner`
- **Template Name:** `Split Banner`

### Fields

| Field Name  | Sitecore Type    | Required | Description                               | Validation/Constraints                    |
| ----------- | ---------------- | -------- | ----------------------------------------- | ----------------------------------------- |
| heading     | Single-Line Text | Yes      | Main headline displayed in the content area | Recommended max 80 characters           |
| subheading  | Rich Text        | No       | Emphasized supporting text                | Supports basic formatting                 |
| body        | Rich Text        | No       | Detailed description or body text         | Supports full rich text formatting        |
| image       | Image            | Yes      | Desktop image (displays on half the width) | Recommended 960x640px minimum            |
| imageMobile | Image            | No       | Mobile-specific image                     | Recommended 800x600px                     |
| link        | General Link     | No       | [VERIFY: May not be used in rendering]    | Internal or external link                 |

### Rendering Parameters (Styles)

| Parameter        | Type     | Options                                           | Default                  | Description                          |
| ---------------- | -------- | ------------------------------------------------- | ------------------------ | ------------------------------------ |
| theme            | Droplist | primary, secondary, tertiary                      | primary                  | Color theme for the content area     |
| bannerImgLeft    | Checkbox | true, false                                       | false                    | When true, positions image on left   |
| contentAlignment | Droplist | items-start text-left, items-center text-center, items-end text-right | items-start text-left | Text alignment within content area   |
| padding (top)    | Droplist | top-none, top-xs, top-sm, top-md, top-lg, top-xl  | none                     | Top padding                          |
| padding (bottom) | Droplist | bottom-none, bottom-xs, bottom-sm, bottom-md, bottom-lg, bottom-xl | none                 | Bottom padding                       |

## JSS Field Component Mapping

| Sitecore Field | JSS Component                                               | Import                                                  |
| -------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| heading        | `<Text field={fields?.heading} tag="h2" className="..." />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| subheading     | `<RichText field={fields?.subheading} className="..." />`   | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| body           | `<RichText field={fields?.body} className="..." />`         | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| image          | `<HalfWidthImage image={imageSrc} />`                       | Custom component using `useImage` hook                  |
| imageMobile    | `<HalfWidthImage image={imageSrc} />`                       | Falls back to image if not provided                     |

## Placeholders

| Placeholder Name | Description                                         | Allowed Components |
| ---------------- | --------------------------------------------------- | ------------------ |
| buttons          | CTA buttons displayed below the body text           | Button, LinkButton |

## Component Variants

The SplitBanner exports 2 rendering variants:

| Variant   | Export Name | Layout                               | Use Case                                    |
| --------- | ----------- | ------------------------------------ | ------------------------------------------- |
| Default   | `Default`   | Full-width split layout              | Primary feature sections                    |
| Contained | `Contained` | Max-width constrained split layout   | Contained sections with side margins        |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The main feature or section headline
- **Tone/Style:** Clear, benefit-focused, action-oriented
- **Character limit:** 80 characters recommended for best display
- **Example:** "Streamline Your Workflow with Automation"

#### subheading

- **What to enter:** Emphasized supporting statement or tagline
- **Tone/Style:** Complements the headline, highlights key benefit
- **Formatting:** Basic rich text, typically 1 line
- **Example:** "<p>Reduce manual tasks by 50% with intelligent process automation.</p>"

#### body

- **What to enter:** Detailed description or explanation
- **Tone/Style:** Informative, expands on the headline/subheading
- **Formatting:** Full rich text support - paragraphs, lists, bold, links
- **Example:** "<p>Our automation platform helps teams focus on high-value work by handling repetitive tasks automatically.</p>"

#### image (Desktop)

- **Recommended dimensions:** 960x640px or larger
- **Aspect ratio:** 3:2 (landscape)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Descriptive text for accessibility
- **Media Library path:** `/sitecore/media library/Project/[Site]/Features/`
- **Tips:** Image fills half the component width on desktop

#### imageMobile

- **Recommended dimensions:** 800x600px
- **Aspect ratio:** 4:3 (landscape)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Can be same as desktop image
- **Media Library path:** `/sitecore/media library/Project/[Site]/Features/Mobile/`
- **Tips:** Displays below 1024px viewport; stacks above or below content

### Content Matrix (Variations)

| Variation | Required Fields    | Optional Fields                      | Use Case                           |
| --------- | ------------------ | ------------------------------------ | ---------------------------------- |
| Minimal   | heading, image     | -                                    | Simple feature highlight           |
| Standard  | heading, subheading, image | body, imageMobile              | Feature with description           |
| Full      | heading, subheading, body, image | imageMobile + buttons       | Complete feature section           |

## Component Props Interface

```typescript
import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { ImageProps } from 'lib/hooks/useImage';

type SplitBannerFields = ImageProps & {
  heading: Field<string>;
  subheading?: Field<string>;
  body?: Field<string>;
  link?: LinkField;
};

export type SplitBannerProps = ComponentProps & {
  fields: SplitBannerFields;
  variant?: string;
};

// ImageProps includes:
// - image: ImageField (required)
// - imageMobile: ImageField (optional)
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Streamline Your Workflow" },
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Features/workflow-automation.jpg",
        "alt": "Dashboard showing workflow automation",
        "width": "960",
        "height": "640"
      }
    }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Streamline Your Workflow with Automation" },
    "subheading": {
      "value": "<p>Reduce manual tasks by 50% with intelligent process automation.</p>"
    },
    "body": {
      "value": "<p>Our automation platform helps teams focus on high-value work by handling repetitive tasks automatically. From data entry to report generation, let technology do the heavy lifting.</p>"
    },
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Features/workflow-automation.jpg",
        "alt": "Dashboard showing workflow automation in action",
        "width": "960",
        "height": "640"
      }
    },
    "imageMobile": {
      "value": {
        "src": "/-/media/Project/Site/Features/Mobile/workflow-automation-mobile.jpg",
        "alt": "Workflow automation dashboard",
        "width": "800",
        "height": "600"
      }
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Data sources: `/sitecore/content/[Site]/Home/Data/Split Banners/`

### Experience Editor Behavior

- **Inline editable fields:** heading, subheading, body
- **Forms panel required:** image, imageMobile
- **Image selection:** Click image area to open media browser
- **Placeholder:** Add buttons via the "buttons" placeholder

### Rendering Variant Selection

In Experience Editor or Content Editor:

1. Select the SplitBanner component
2. Open "Rendering Properties" or "Component Properties"
3. Choose variant from dropdown: Default or Contained

### Personalization Opportunities

- **heading/subheading/body:** Personalize messaging based on visitor segments
- **image:** Use different imagery for different industries or personas
- **bannerImgLeft:** Alternate image positions for visual variety

## Common Mistakes to Avoid

1. **Missing mobile image:** If `imageMobile` is not set, the desktop image is used. Consider providing an optimized mobile crop.

2. **Inconsistent image positioning:** When using multiple SplitBanners on a page, alternate `bannerImgLeft` for visual rhythm.

3. **Overly long body text:** Keep body text concise. Long paragraphs reduce visual balance with the image.

4. **Forgetting buttons:** Add CTAs via the buttons placeholder for engagement.

5. **Wrong variant choice:** Use Default for full-width impact, Contained for content within page margins.

6. **Missing alt text:** Always provide meaningful alt text for accessibility compliance.

## Related Components

- `ContentBanner` - Full-width banner with background image
- `HeroBanner` - Hero section with background image and overlay
- `TextBanner` - Text-only banner without image
- `CardGrid` - For multiple features in card layout

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the SplitBanner component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer-mcp__search_site`)
2. Have the SplitBanner rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)
4. Have media IDs for any images to be used

### Step 1: Find the Target Page

```javascript
// Search for the page where SplitBanner will be added
await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Features Page"
});
// Returns: { itemId: "page-guid", name: "PageName", path: "/sitecore/..." }
```

### Step 2: Add SplitBanner to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "split-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "SplitBanner_1",
  language: "en",
  fields: {
    "heading": "Streamline Your Workflow with Automation",
    "subheading": "<p>Reduce manual tasks by 50%.</p>",
    "body": "<p>Our platform helps teams focus on high-value work.</p>"
  }
});

// Returns:
// {
//   "datasourceId": "created-datasource-guid",
//   "placeholderId": "headless-main"
// }
```

**IMPORTANT:** Save the `datasourceId` - it's needed for updating image fields.

### Step 3: Update Image Fields

Image fields require XML format with specific syntax:

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,  // From Step 2
  language: "en",
  fields: {
    "image": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "imageMobile": "<image mediaid='{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}' />"
  }
});
```

**Image Field Rules:**

- MUST use single quotes around attribute values
- GUID MUST be wrapped in braces: `{GUID}`
- GUID should be UPPERCASE
- If image needs uploading first, use `/sitecore-upload-media` skill

### Step 4: Add Button Components (Optional)

Add buttons to the buttons placeholder:

```javascript
await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "button-rendering-id",
  placeholderPath: "headless-main/buttons-{SPLIT-BANNER-UID}",
  componentItemName: "SplitBanner_CTA",
  language: "en",
  fields: {
    "linkText": "Learn More",
    "linkUrl": "/features/automation"
  }
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
// STEP 2: Add SplitBanner component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "split-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "SplitBanner_Automation",
  language: "en",
  fields: {
    "heading": "Streamline Your Workflow with Automation",
    "subheading": "<p>Reduce manual tasks by 50% with intelligent process automation.</p>",
    "body": "<p>Our automation platform helps teams focus on high-value work by handling repetitive tasks automatically.</p>"
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
// COMPLETE: SplitBanner with all fields populated
// ═══════════════════════════════════════════════════════════════
```

### Variant Selection via Rendering

To use a specific variant, use the corresponding rendering ID:

| Variant   | Rendering Name        |
| --------- | --------------------- |
| Default   | `SplitBanner`         |
| Contained | `SplitBanner-Contained` |

### Field Type Quick Reference

| Field       | Type             | MCP Format                          |
| :---------- | :--------------- | :---------------------------------- |
| heading     | Single-Line Text | `"Plain text value"`                |
| subheading  | Rich Text        | `"<p>HTML content</p>"`             |
| body        | Rich Text        | `"<p>HTML content</p>"`             |
| image       | Image            | `<image mediaid='{GUID}' />`        |
| imageMobile | Image            | `<image mediaid='{GUID}' />`        |
| link        | General Link     | `<link linktype='internal' ... />`  |

### MCP Authoring Checklist

Before authoring SplitBanner via MCP, verify:

- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have SplitBanner rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `SplitBanner_1`)
- [ ] Have media GUIDs for image field
- [ ] Image XML uses single quotes and braces: `<image mediaid='{GUID}' />`

### MCP Error Handling

| Error                  | Cause                   | Solution                                    |
| :--------------------- | :---------------------- | :------------------------------------------ |
| "Item already exists"  | Duplicate component name | Use unique suffix: `SplitBanner_2`         |
| Component not visible  | Wrong placeholder path   | Use `"headless-main"` without leading slash |
| Image not showing      | Wrong XML format         | Verify single quotes, braces around GUID   |
| `updatedFields: {}`    | Normal response          | Update succeeded despite empty response    |
| "Cannot find field"    | Wrong field name         | Field names are case-sensitive             |

### Related Skills for MCP Authoring

| Skill                          | Purpose                                  |
| :----------------------------- | :--------------------------------------- |
| `/sitecore-author-placeholder` | Placeholder path construction rules      |
| `/sitecore-author-image`       | Image field XML formatting details       |
| `/sitecore-upload-media`       | Upload images to Media Library first     |
| `/sitecore-pagebuilder`        | Full page creation workflow              |

---

## Change Log

| Date       | Change                | Author      |
| ---------- | --------------------- | ----------- |
| 2026-02-09 | Initial documentation | Claude Code |
