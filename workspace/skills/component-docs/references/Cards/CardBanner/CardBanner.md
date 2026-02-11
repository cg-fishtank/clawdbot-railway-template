# CardBanner Component

## Purpose

The CardBanner component creates a full-width banner section with a background image, heading, subheading, and a placeholder for child Card components. It provides a visually striking way to feature a collection of cards with a themed background. The component applies an overlay to ensure text readability over the background image and supports theme-based styling.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Cards/Card Banner`
- **Template Name:** `Card Banner`

### Fields

| Field Name             | Sitecore Type   | Required | Description                                | Validation/Constraints                    |
| ---------------------- | --------------- | -------- | ------------------------------------------ | ----------------------------------------- |
| heading                | Single-Line Text| Yes      | Main section heading                       | Recommended max 80 characters             |
| subheading             | Single-Line Text| No       | Supporting text below the heading          | Recommended max 150 characters            |
| backgroundImage        | Image           | No       | Desktop background image                   | Recommended 1920x600px minimum            |
| backgroundImageMobile  | Image           | No       | Mobile-specific background image           | Recommended 800x800px, falls back to desktop |

### Rendering Parameters (Styles)

| Parameter        | Type     | Options                              | Default | Description                                |
| ---------------- | -------- | ------------------------------------ | ------- | ------------------------------------------ |
| theme            | Droplist | primary, secondary, tertiary         | none    | Color theme affecting text and overlay     |

## Placeholder Configuration

The CardBanner exposes a placeholder for child components:

| Placeholder Key | Allowed Components | Description                |
| --------------- | ------------------ | -------------------------- |
| `cards-{*}`     | Card               | Container for Card components |

**Dynamic Placeholder:** The placeholder uses the pattern `cards-{DynamicPlaceholderId}` where `{DynamicPlaceholderId}` is replaced with the component's unique identifier.

## JSS Field Component Mapping

| Sitecore Field        | JSS Component                              | Import                                              |
| --------------------- | ------------------------------------------ | --------------------------------------------------- |
| heading               | `<Text field={fields.heading} tag="h2" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| subheading            | `<RichText field={fields.subheading} />`   | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| backgroundImage       | `<BackgroundImage fields={fields} />`      | Custom BackgroundImage component                    |

## Component Variants

The CardBanner component exports a single Default variant:

| Variant | Export Name | Description                              | Use Case                        |
| ------- | ----------- | ---------------------------------------- | ------------------------------- |
| Default | `Default`   | Full-width banner with background image  | Featured card collections       |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The main section title that introduces the card collection
- **Tone/Style:** Clear, compelling, descriptive of the content theme
- **Character limit:** 80 characters recommended
- **Example:** "Our Services" or "Featured Solutions"

#### subheading

- **What to enter:** Supporting context or brief description
- **Tone/Style:** Informative, complements the heading
- **Character limit:** 150 characters recommended
- **Example:** "Explore our comprehensive range of solutions designed to transform your business"

#### backgroundImage (Desktop)

- **Recommended dimensions:** 1920x600px or larger
- **Aspect ratio:** 3:1 (wide landscape)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Descriptive text for accessibility
- **Media Library path:** `/sitecore/media library/Project/[Site]/Banners/`
- **Tips:** Use images with lower contrast areas for text readability; overlay is applied automatically

#### backgroundImageMobile

- **Recommended dimensions:** 800x800px
- **Aspect ratio:** 1:1 (square preferred for mobile)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Can be same as desktop image
- **Media Library path:** `/sitecore/media library/Project/[Site]/Banners/Mobile/`
- **Tips:** Falls back to desktop image if not provided; displays below 1024px viewport

### Content Matrix (Variations)

| Variation    | Required Fields | Optional Fields                    | Use Case                            |
| ------------ | --------------- | ---------------------------------- | ----------------------------------- |
| Minimal      | heading         | -                                  | Simple section header with cards    |
| With Text    | heading         | subheading                         | Section with description            |
| With Image   | heading         | backgroundImage                    | Visual section with background      |
| Full         | heading         | subheading, backgroundImage, backgroundImageMobile | Complete featured section |

## Component Props Interface

```typescript
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { BackgroundImageProps } from 'lib/hooks/useBackgroundImage';

export type CardBannerFields = BackgroundImageProps & {
  heading: Field<string>;
  subheading: Field<string>;
};

export type CardBannerProps = ComponentProps & {
  fields: CardBannerFields;
};

// BackgroundImageProps includes:
// - backgroundImage: ImageField
// - backgroundImageMobile: ImageField
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Our Services" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Featured Solutions" },
    "subheading": { "value": "Explore our comprehensive range of solutions designed to transform your business" },
    "backgroundImage": {
      "value": {
        "src": "/-/media/Project/Site/Banners/services-background.jpg",
        "alt": "Abstract technology background",
        "width": "1920",
        "height": "600"
      }
    },
    "backgroundImageMobile": {
      "value": {
        "src": "/-/media/Project/Site/Banners/Mobile/services-background-mobile.jpg",
        "alt": "Abstract technology background",
        "width": "800",
        "height": "800"
      }
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- CardBanner data sources: `/sitecore/content/[Site]/Home/Data/Card Banners/`

### Experience Editor Behavior

- **Inline editable fields:** heading, subheading
- **Forms panel required:** backgroundImage, backgroundImageMobile
- **Placeholder editing:** Click within the cards area to add/edit child Card components

### Theme Behavior

The component applies different overlay colors based on the theme:

| Theme               | Overlay Color | Best For                    |
| ------------------- | ------------- | --------------------------- |
| primary / tertiary  | Black (20%)   | Light background images     |
| secondary           | White (20%)   | Dark background images      |

## Common Mistakes to Avoid

1. **Missing heading:** The heading provides context for the card collection. Always provide a section title.

2. **Too many cards:** The layout works best with 2-4 cards. More cards may cause layout issues.

3. **Low-contrast background:** Ensure background images have enough contrast with the text overlay for readability.

4. **Overly long subheading:** Keep subheading text concise - it's meant for brief context, not full paragraphs.

5. **Wrong theme for image:** Match the theme to your background image - use primary/tertiary for light images, secondary for dark.

## Related Components

- `Card` - Child component placed inside CardBanner's placeholder
- `CardGrid` - Alternative container for cards without background image
- `CardCarousel` - Alternative container with carousel/slider functionality
- `ContentBanner` - Similar banner component without card placeholder

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the CardBanner component using the Marketer MCP tools.

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Page Name"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add CardBanner to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "CardBanner_Featured",
  language: "en",
  fields: {
    "heading": "Featured Solutions",
    "subheading": "Explore our comprehensive range of solutions"
  }
});

const datasourceId = result.datasourceId;
const dynamicPlaceholderId = result.placeholderId;  // Needed for adding child cards
```

### Step 3: Update Background Image Fields

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "backgroundImage": "<image mediaid='{IMAGE-GUID}' />",
    "backgroundImageMobile": "<image mediaid='{MOBILE-IMAGE-GUID}' />"
  }
});
```

### Step 4: Add Child Card Components

```javascript
// Add cards to the CardBanner's placeholder
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: `headless-main/cards-{${dynamicPlaceholderId}}`,
  componentItemName: "Card_Service1",
  language: "en",
  fields: {
    "heading": "Service One",
    "body": "<p>Description of service one.</p>"
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
  search_query: "Services Page"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add CardBanner component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "CardBanner_Services",
  language: "en",
  fields: {
    "heading": "Our Services",
    "subheading": "Explore our comprehensive range of solutions designed to transform your business"
  }
});

const datasourceId = addResult.datasourceId;
const dynamicId = addResult.placeholderId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update background image
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Add child Card components
// ═══════════════════════════════════════════════════════════════
const cardPlaceholder = `headless-main/cards-{${dynamicId}}`;

// Card 1
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: cardPlaceholder,
  componentItemName: "Card_Consulting",
  language: "en",
  fields: {
    "heading": "Consulting",
    "body": "<p>Expert guidance for your digital journey.</p>"
  }
});

// Card 2
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: cardPlaceholder,
  componentItemName: "Card_Development",
  language: "en",
  fields: {
    "heading": "Development",
    "body": "<p>Custom solutions built for your needs.</p>"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: CardBanner with background and child cards
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field                  | Type             | MCP Format                         |
|:-----------------------|:-----------------|:-----------------------------------|
| heading                | Single-Line Text | `"Plain text value"`               |
| subheading             | Single-Line Text | `"Plain text value"`               |
| backgroundImage        | Image            | `<image mediaid='{GUID}' />`       |
| backgroundImageMobile  | Image            | `<image mediaid='{GUID}' />`       |

### Placeholder Path Pattern

For CardBanner's child placeholder:
```
headless-main/cards-{DYNAMIC_PLACEHOLDER_ID}
```

The `DYNAMIC_PLACEHOLDER_ID` is returned when you add the CardBanner component.

### MCP Authoring Checklist

Before authoring CardBanner via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have CardBanner rendering ID (from component manifest)
- [ ] Have Card rendering ID (for child cards)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Save the dynamic placeholder ID returned when adding CardBanner
- [ ] Have media GUIDs for background image fields
- [ ] Image XML uses single quotes and braces: `<image mediaid='{GUID}' />`

### MCP Error Handling

| Error                  | Cause                        | Solution                                      |
|:-----------------------|:-----------------------------|:----------------------------------------------|
| "Item already exists"  | Duplicate component name     | Use unique suffix: `CardBanner_2`             |
| Component not visible  | Wrong placeholder path       | Use `"headless-main"` without leading slash   |
| Cards not appearing    | Wrong child placeholder path | Use dynamic ID from CardBanner response       |
| Image not showing      | Wrong XML format             | Verify single quotes, braces around GUID      |
| `updatedFields: {}`    | Normal response              | Update succeeded despite empty response       |

### Related Skills for MCP Authoring

| Skill                         | Purpose                                |
|:------------------------------|:---------------------------------------|
| `/sitecore-author-placeholder`| Placeholder path construction rules    |
| `/sitecore-author-image`      | Image field XML formatting details     |
| `/sitecore-upload-media`      | Upload images to Media Library first   |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
