# TextBanner Component

## Purpose

The TextBanner component displays a clean, text-focused banner section with a prominent heading, optional subheading, and call-to-action buttons. It uses the surface background color (no image) with configurable content alignment and theme. This component is ideal for section introductions, simple announcements, page headers without imagery, and transitional sections between content blocks.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Components/Banners/Text Banner`
- **Template Name:** `Text Banner`

### Fields

| Field Name | Sitecore Type    | Required | Description                               | Validation/Constraints                    |
| ---------- | ---------------- | -------- | ----------------------------------------- | ----------------------------------------- |
| heading    | Single-Line Text | Yes      | Main headline displayed prominently       | Recommended max 80 characters             |
| subheading | Rich Text        | No       | Supporting text below the headline        | Supports basic formatting, max-width 800px |

### Rendering Parameters (Styles)

| Parameter        | Type     | Options                                           | Default                                    | Description                          |
| ---------------- | -------- | ------------------------------------------------- | ------------------------------------------ | ------------------------------------ |
| theme            | Droplist | primary, secondary, tertiary                      | primary                                    | Color theme (background and text)    |
| contentAlignment | Droplist | items-start justify-start text-left, items-center justify-center text-center, items-end justify-end text-right | items-center justify-center text-center | Text and content alignment           |
| padding (top)    | Droplist | top-none, top-xs, top-sm, top-md, top-lg, top-xl  | none                                       | Top padding                          |
| padding (bottom) | Droplist | bottom-none, bottom-xs, bottom-sm, bottom-md, bottom-lg, bottom-xl | none                                   | Bottom padding                       |

## JSS Field Component Mapping

| Sitecore Field | JSS Component                                               | Import                                                  |
| -------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| heading        | `<Text field={fields?.heading} tag="h1" className="..." />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| subheading     | `<RichText field={fields?.subheading} className="..." />`   | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Placeholders

| Placeholder Name | Description                                         | Allowed Components |
| ---------------- | --------------------------------------------------- | ------------------ |
| buttons          | CTA buttons displayed below the content             | Button, LinkButton |

## Component Variants

The TextBanner exports 1 rendering variant:

| Variant | Export Name | Use Case                                    |
| ------- | ----------- | ------------------------------------------- |
| Default | `Default`   | Standard text banner with centered content  |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The primary section or page headline
- **Tone/Style:** Clear, direct, attention-grabbing
- **Character limit:** 80 characters recommended for best display
- **Example:** "Ready to Get Started?"

#### subheading

- **What to enter:** Supporting context or call-to-action text
- **Tone/Style:** Informative, complements the headline
- **Formatting:** Basic rich text - bold, italic, links
- **Max width:** Content is constrained to 800px (max-w-200)
- **Example:** "<p>Join thousands of customers who have transformed their business with our solutions.</p>"

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields       | Use Case                           |
| --------- | --------------- | --------------------- | ---------------------------------- |
| Minimal   | heading         | -                     | Simple section header              |
| Standard  | heading, subheading | -                  | Section with description           |
| Full      | heading, subheading | buttons            | Complete CTA section               |

## Component Props Interface

```typescript
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type TextBannerFields = {
  heading: Field<string>;
  subheading?: Field<string>;
};

export type TextBannerProps = ComponentProps & {
  fields: TextBannerFields;
};
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Ready to Get Started?" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Ready to Transform Your Business?" },
    "subheading": {
      "value": "<p>Join thousands of customers who have achieved remarkable results with our platform. Start your journey today.</p>"
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Data sources: `/sitecore/content/[Site]/Home/Data/Text Banners/`

### Experience Editor Behavior

- **Inline editable fields:** heading, subheading
- **Forms panel required:** None (all fields are inline editable)
- **Placeholder:** Add buttons via the "buttons" placeholder

### Layout Notes

- Minimum height: 320px (min-h-80)
- Content is wrapped in ContainedWrapper for max-width constraint
- Vertical padding: 60px (py-15)
- Responsive: Text sizes adjust between mobile and desktop

### Accessibility Features

- **role="region":** Component has region role for landmark navigation
- **aria-label:** Set to the heading value for screen readers

### Personalization Opportunities

- **heading/subheading:** Personalize messaging based on visitor segments
- **theme:** Use different color themes for different campaigns
- **Buttons:** Show different CTAs based on visitor behavior

## Common Mistakes to Avoid

1. **Overly long headings:** Headlines exceeding 80 characters may wrap to multiple lines.

2. **Rich text overload in subheading:** Keep subheading text concise (1-2 sentences). It has a max-width constraint of 800px.

3. **Missing CTAs:** TextBanners are often used for calls-to-action; don't forget to add buttons via the placeholder.

4. **Inconsistent alignment:** Match contentAlignment with your page design. Centered (default) works best for most cases.

5. **Theme mismatch:** Ensure the theme matches surrounding sections for visual consistency.

## Related Components

- `ContentBanner` - Banner with background image
- `HeroBanner` - Full hero section with background image
- `SplitBanner` - Side-by-side image and content layout
- `RichTextBlock` - For longer text content without banner styling

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the TextBanner component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:

1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the TextBanner rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)

### Step 1: Find the Target Page

```javascript
// Search for the page where TextBanner will be added
await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Contact Page"
});
// Returns: { itemId: "page-guid", name: "PageName", path: "/sitecore/..." }
```

### Step 2: Add TextBanner to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "text-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "TextBanner_1",
  language: "en",
  fields: {
    "heading": "Ready to Transform Your Business?",
    "subheading": "<p>Join thousands of customers who have achieved remarkable results.</p>"
  }
});

// Returns:
// {
//   "datasourceId": "created-datasource-guid",
//   "placeholderId": "headless-main"
// }
```

### Step 3: Add Button Components (Optional)

Add buttons to the buttons placeholder:

```javascript
await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "button-rendering-id",
  placeholderPath: "headless-main/buttons-{TEXT-BANNER-UID}",
  componentItemName: "TextBanner_CTA",
  language: "en",
  fields: {
    "linkText": "Contact Us",
    "linkUrl": "/contact"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Home"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add TextBanner component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "text-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "TextBanner_CTA_Section",
  language: "en",
  fields: {
    "heading": "Ready to Transform Your Business?",
    "subheading": "<p>Join thousands of customers who have achieved remarkable results with our platform. Start your journey today.</p>"
  }
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: (Optional) Update fields if needed
// ═══════════════════════════════════════════════════════════════
// All fields are text-based and can be set in add_component_on_page
// No additional update needed unless modifying later

// ═══════════════════════════════════════════════════════════════
// COMPLETE: TextBanner with all fields populated
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field      | Type             | MCP Format              |
| :--------- | :--------------- | :---------------------- |
| heading    | Single-Line Text | `"Plain text value"`    |
| subheading | Rich Text        | `"<p>HTML content</p>"` |

### MCP Authoring Checklist

Before authoring TextBanner via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have TextBanner rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `TextBanner_1`)

### MCP Error Handling

| Error                  | Cause                   | Solution                                    |
| :--------------------- | :---------------------- | :------------------------------------------ |
| "Item already exists"  | Duplicate component name | Use unique suffix: `TextBanner_2`          |
| Component not visible  | Wrong placeholder path   | Use `"headless-main"` without leading slash |
| `updatedFields: {}`    | Normal response          | Update succeeded despite empty response    |
| "Cannot find field"    | Wrong field name         | Field names are case-sensitive             |

### Related Skills for MCP Authoring

| Skill                          | Purpose                                  |
| :----------------------------- | :--------------------------------------- |
| `/sitecore-author-placeholder` | Placeholder path construction rules      |
| `/sitecore-pagebuilder`        | Full page creation workflow              |

---

## Change Log

| Date       | Change                | Author      |
| ---------- | --------------------- | ----------- |
| 2026-02-09 | Initial documentation | Claude Code |
