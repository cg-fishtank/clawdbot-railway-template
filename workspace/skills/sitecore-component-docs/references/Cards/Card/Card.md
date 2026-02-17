# Card Component

## Purpose

The Card component displays a content card featuring an image, heading, body text, and a call-to-action link. It includes an optional badge overlay on the image. Cards are typically placed inside container components like CardGrid, CardCarousel, or CardBanner to create collections of related content. The entire card is clickable when a link is provided.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Cards/Card`
- **Template Name:** `Card`

### Fields

| Field Name  | Sitecore Type   | Required | Description                              | Validation/Constraints                    |
| ----------- | --------------- | -------- | ---------------------------------------- | ----------------------------------------- |
| heading     | Single-Line Text| Yes      | Card title displayed below the image     | Recommended max 60 characters             |
| body        | Rich Text       | No       | Supporting text/description              | Supports basic formatting                 |
| link        | General Link    | No       | CTA link (entire card becomes clickable) | Internal or external URL                  |
| image       | Image           | Yes      | Main card image (desktop)                | Recommended 640x360px, 16:9 aspect ratio  |
| imageMobile | Image           | No       | Mobile-specific image (falls back to image) | Recommended 640x640px, 1:1 aspect ratio|
| badge       | Single-Line Text| No       | Optional badge text overlay on image     | Short text, 1-2 words recommended         |

### Rendering Parameters (Styles)

| Parameter        | Type     | Options                                           | Default | Description                      |
| ---------------- | -------- | ------------------------------------------------- | ------- | -------------------------------- |
| theme            | Droplist | primary, secondary, tertiary                      | none    | Color theme for card styling     |
| contentAlignment | Droplist | items-start, items-center, items-end              | start   | Alignment of text content        |

## JSS Field Component Mapping

| Sitecore Field | JSS Component                                    | Import                                              |
| -------------- | ------------------------------------------------ | --------------------------------------------------- |
| heading        | `<Text field={fields.heading} tag="h3" />`       | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| body           | `<RichText field={fields.body} />`               | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| link           | `<Link field={fields.link} />` / `<Button />`    | `import { Link } from '@sitecore-jss/sitecore-jss-nextjs'` |
| image          | `<NextImage field={imageSrc} />`                 | `import { NextImage } from '@sitecore-jss/sitecore-jss-nextjs'` |
| badge          | `<Text field={badge} />`                         | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

The Card component exports a single Default variant:

| Variant | Export Name | Description                           | Use Case               |
| ------- | ----------- | ------------------------------------- | ---------------------- |
| Default | `Default`   | Standard card with image, text, link  | All card use cases     |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** A concise, descriptive title for the card content
- **Tone/Style:** Clear, action-oriented, attention-grabbing
- **Character limit:** 60 characters recommended (2 lines max before truncation)
- **Example:** "Digital Transformation Solutions"

#### body

- **What to enter:** Brief description or supporting context
- **Tone/Style:** Informative, complements the heading
- **Formatting:** Basic rich text - keep formatting simple
- **Example:** "Discover how our solutions can help modernize your business operations and drive growth."

#### link

- **What to enter:** The destination URL and link text for the CTA
- **Link Types:** Internal, External
- **Link Text:** Used as the button text (e.g., "Learn More", "Read More")
- **Example:**
  ```json
  {
    "value": {
      "href": "/solutions/digital-transformation",
      "text": "Learn More",
      "target": ""
    }
  }
  ```

#### image (Desktop)

- **Recommended dimensions:** 640x360px or larger
- **Aspect ratio:** 16:9 (landscape) or 1:1 (square)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Descriptive text that conveys image content
- **Media Library path:** `/sitecore/media library/Project/[Site]/Cards/`
- **Tips:** Image will be cropped to square aspect ratio in the card display

#### imageMobile

- **Recommended dimensions:** 640x640px
- **Aspect ratio:** 1:1 (square preferred for mobile)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Can be same as desktop image
- **Tips:** Falls back to main image if not provided; displays below 1024px viewport

#### badge

- **What to enter:** Short label text for the badge overlay
- **Character limit:** 15 characters maximum
- **Example:** "NEW", "FEATURED", "SALE"
- **Tips:** Badge appears in top-left corner of image; leave empty to hide

### Content Matrix (Variations)

| Variation | Required Fields   | Optional Fields              | Use Case                        |
| --------- | ----------------- | ---------------------------- | ------------------------------- |
| Minimal   | heading, image    | -                            | Simple display card             |
| Standard  | heading, image    | body, link                   | Typical clickable content card  |
| Full      | heading, image    | body, link, imageMobile, badge| Featured content with badge    |

## Component Props Interface

```typescript
import {
  Field,
  LinkField,
  RichTextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { ImageProps } from 'lib/hooks/useImage';

export type CardBadgeProps = {
  badge?: Field<string>;
};

export type CardFields = CardBadgeProps &
  ImageProps & {
    heading: Field<string>;
    body: RichTextField;
    link: LinkField;
  };

export type CardFieldsProps = {
  fields: CardFields;
  textColor?: string;
};

export type CardProps = ComponentProps & CardFieldsProps;

// ImageProps includes:
// - image: ImageField
// - imageMobile: ImageField
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Card Title" },
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Cards/card-image.jpg",
        "alt": "Descriptive alt text",
        "width": "640",
        "height": "360"
      }
    }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Digital Transformation Solutions" },
    "body": {
      "value": "<p>Discover how our solutions can help modernize your business operations and drive growth.</p>"
    },
    "link": {
      "value": {
        "href": "/solutions/digital-transformation",
        "text": "Learn More",
        "target": "",
        "title": "Learn about digital transformation"
      }
    },
    "image": {
      "value": {
        "src": "/-/media/Project/Site/Cards/digital-transformation.jpg",
        "alt": "Digital transformation concept illustration",
        "width": "640",
        "height": "360"
      }
    },
    "imageMobile": {
      "value": {
        "src": "/-/media/Project/Site/Cards/Mobile/digital-transformation-mobile.jpg",
        "alt": "Digital transformation concept",
        "width": "640",
        "height": "640"
      }
    },
    "badge": { "value": "NEW" }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Card data sources: `/sitecore/content/[Site]/Home/Data/Cards/`

### Experience Editor Behavior

- **Inline editable fields:** heading, body, badge
- **Forms panel required:** link, image, imageMobile
- **Image selection:** Click image area to open media browser

### Personalization Opportunities

- **badge:** Show/hide based on campaign or visitor segment
- **link:** Personalize CTA destination for different audiences

## Common Mistakes to Avoid

1. **Missing image:** The card layout depends on the image. Always provide at least the desktop image.

2. **Overly long headings:** Headlines exceeding 60 characters will truncate after 2 lines. Keep titles concise.

3. **Missing link text:** If link is provided, ensure the text field is populated for the CTA button.

4. **Badge too long:** Badge text longer than 15 characters will overflow. Use short labels.

5. **Poor image quality:** Cards display images prominently. Use high-quality images at recommended dimensions.

6. **Rich text overload in body:** Keep body text simple - it's meant for brief descriptions, not full paragraphs.

## Related Components

- `CardGrid` - Container for displaying multiple cards in a grid layout
- `CardCarousel` - Container for displaying cards in a carousel/slider
- `CardBanner` - Banner component that contains cards with a background image

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the Card component using the Marketer MCP tools.

### Important: Card Placement

Card components are typically placed inside container components (CardGrid, CardCarousel, CardBanner) rather than directly on the page. You'll need:

1. The parent container's datasource ID
2. The container's placeholder key (e.g., `cardgrid-{*}`, `cardcarousel-{*}`)

### Step 1: Find the Target Page and Container

```javascript
// Search for the page
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Page with CardGrid"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add Card to Container Placeholder

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: "headless-main/cardgrid-{dynamicId}",  // Dynamic placeholder path
  componentItemName: "Card_1",
  language: "en",
  fields: {
    "heading": "Digital Transformation Solutions",
    "body": "<p>Discover how our solutions can help modernize your business.</p>"
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

### Step 4: Update Link Field

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "link": "<link linktype='internal' id='{TARGET-PAGE-GUID}' text='Learn More' />"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page with CardGrid
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Solutions Page"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add Card component to CardGrid placeholder
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: "headless-main/cardgrid-{dynamic-id}",
  componentItemName: "Card_DigitalTransformation",
  language: "en",
  fields: {
    "heading": "Digital Transformation Solutions",
    "body": "<p>Discover how our solutions can help modernize your business operations and drive growth.</p>",
    "badge": "NEW"
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
// STEP 4: Update link field
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "link": "<link linktype='internal' id='{TARGET-PAGE-GUID}' text='Learn More' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: Card with all fields populated
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field       | Type             | MCP Format                                                |
|:------------|:-----------------|:----------------------------------------------------------|
| heading     | Single-Line Text | `"Plain text value"`                                      |
| body        | Rich Text        | `"<p>HTML content</p>"`                                   |
| link        | General Link     | `<link linktype='internal' id='{GUID}' text='Text' />`    |
| image       | Image            | `<image mediaid='{GUID}' />`                              |
| imageMobile | Image            | `<image mediaid='{GUID}' />`                              |
| badge       | Single-Line Text | `"Plain text value"`                                      |

### MCP Authoring Checklist

Before authoring Card via MCP, verify:

- [ ] Have parent container (CardGrid/CardCarousel) already on page
- [ ] Know the dynamic placeholder path for the container
- [ ] Have Card rendering ID (from component manifest)
- [ ] Have media GUIDs for image fields
- [ ] Image XML uses single quotes and braces: `<image mediaid='{GUID}' />`
- [ ] Link XML uses correct format for link type (internal/external)

### MCP Error Handling

| Error                  | Cause                        | Solution                                      |
|:-----------------------|:-----------------------------|:----------------------------------------------|
| "Item already exists"  | Duplicate component name     | Use unique suffix: `Card_2`                   |
| Component not visible  | Wrong placeholder path       | Verify dynamic placeholder ID from parent     |
| Image not showing      | Wrong XML format             | Verify single quotes, braces around GUID      |
| Link not working       | Wrong linktype or GUID       | Use correct linktype (internal/external)      |
| `updatedFields: {}`    | Normal response              | Update succeeded despite empty response       |

### Related Skills for MCP Authoring

| Skill                         | Purpose                                |
|:------------------------------|:---------------------------------------|
| `/sitecore-author-placeholder`| Placeholder path construction rules    |
| `/sitecore-author-image`      | Image field XML formatting details     |
| `/sitecore-author-link`       | Link field XML formatting details      |
| `/sitecore-upload-media`      | Upload images to Media Library first   |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
