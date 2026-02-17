# CardCarousel Component

## Purpose

The CardCarousel component displays a collection of Card components in a responsive slider/carousel format with navigation controls. It features a heading, previous/next arrow buttons, and dot pagination. The carousel automatically adjusts the number of visible slides based on viewport width (1 on mobile, 2 on tablet, 3 on desktop). It's ideal for showcasing multiple cards when horizontal space needs to be conserved.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Cards/Card Carousel`
- **Template Name:** `Card Carousel`

### Fields

| Field Name | Sitecore Type    | Required | Description               | Validation/Constraints       |
| ---------- | ---------------- | -------- | ------------------------- | ---------------------------- |
| heading    | Single-Line Text | Yes      | Carousel section heading  | Recommended max 80 characters|

### Rendering Parameters (Styles)

| Parameter | Type     | Options                      | Default | Description                         |
| --------- | -------- | ---------------------------- | ------- | ----------------------------------- |
| theme     | Droplist | primary, secondary, tertiary | none    | Color theme affecting dots styling  |

## Placeholder Configuration

The CardCarousel exposes a placeholder for child components:

| Placeholder Key       | Allowed Components | Description                    |
| --------------------- | ------------------ | ------------------------------ |
| `cardcarousel-{*}`    | Card               | Container for Card components  |

**Dynamic Placeholder:** The placeholder uses the pattern `cardcarousel-{DynamicPlaceholderId}` where `{DynamicPlaceholderId}` is replaced with the component's unique identifier.

## JSS Field Component Mapping

| Sitecore Field | JSS Component                              | Import                                              |
| -------------- | ------------------------------------------ | --------------------------------------------------- |
| heading        | `<Text field={fields.heading} tag="h3" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

The CardCarousel component exports a single Default variant:

| Variant | Export Name | Description                           | Use Case                  |
| ------- | ----------- | ------------------------------------- | ------------------------- |
| Default | `Default`   | Responsive carousel with navigation   | Card collections (4+)     |

## Responsive Behavior

| Viewport        | Slides Visible | Navigation                    |
| --------------- | -------------- | ----------------------------- |
| Mobile (<768px) | 1              | Arrows + Dots                 |
| Tablet (768-1023px) | 2          | Arrows + Dots                 |
| Desktop (1024px+) | 3            | Arrows + Dots                 |

**Note:** Navigation arrows are hidden when all slides are visible at once.

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The section title that introduces the carousel content
- **Tone/Style:** Clear, descriptive of the content collection
- **Character limit:** 80 characters recommended
- **Example:** "Related Articles" or "Featured Products"

### Content Matrix (Variations)

| Variation | Required Fields | Child Components | Use Case                      |
| --------- | --------------- | ---------------- | ----------------------------- |
| Minimal   | heading         | 3+ Cards         | Basic carousel with title     |
| Full      | heading         | 4-8 Cards        | Full carousel with pagination |

## Component Props Interface

```typescript
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type CardCarouselFields = {
  heading: Field<string>;
};

export type CardCarouselProps = ComponentProps & {
  fields: CardCarouselFields;
};
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Related Articles" }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- CardCarousel data sources: `/sitecore/content/[Site]/Home/Data/Card Carousels/`

### Experience Editor Behavior

- **Inline editable fields:** heading
- **Carousel display:** In Experience Editor, cards display in a flex-wrap layout (not carousel) for easier editing
- **Placeholder editing:** Click within the cards area to add/edit child Card components

### Accessibility Features

- Arrow buttons include proper `aria-label` attributes ("Previous Card", "Next Card")
- Hidden slides have `tabindex="-1"` and `aria-hidden="true"` to prevent focus
- Carousel container has `aria-roledescription="carousel"`

## Common Mistakes to Avoid

1. **Too few cards:** Carousels work best with 4+ cards. For 3 or fewer cards, consider using CardGrid instead.

2. **Missing heading:** Always provide a heading to give context to the card collection.

3. **Inconsistent card content:** Ensure all cards in the carousel have similar content lengths for visual consistency.

4. **Too many cards:** While technically unlimited, carousels with 10+ cards can be cumbersome. Consider pagination or filtering instead.

5. **Wrong component choice:** If all cards should be visible at once, use CardGrid instead of CardCarousel.

## Related Components

- `Card` - Child component placed inside CardCarousel's placeholder
- `CardGrid` - Alternative container displaying all cards in a grid (no carousel)
- `CardBanner` - Alternative container with background image and cards

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the CardCarousel component using the Marketer MCP tools.

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Page Name"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add CardCarousel to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-carousel-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "CardCarousel_Related",
  language: "en",
  fields: {
    "heading": "Related Articles"
  }
});

const datasourceId = result.datasourceId;
const dynamicPlaceholderId = result.placeholderId;  // Needed for adding child cards
```

### Step 3: Add Child Card Components

```javascript
// Add cards to the CardCarousel's placeholder
const cardPlaceholder = `headless-main/cardcarousel-{${dynamicPlaceholderId}}`;

// Card 1
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: cardPlaceholder,
  componentItemName: "Card_Article1",
  language: "en",
  fields: {
    "heading": "Article One Title",
    "body": "<p>Brief description of article one.</p>"
  }
});

// Card 2
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: cardPlaceholder,
  componentItemName: "Card_Article2",
  language: "en",
  fields: {
    "heading": "Article Two Title",
    "body": "<p>Brief description of article two.</p>"
  }
});

// Continue adding more cards as needed (4+ recommended for carousel)
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Blog Page"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add CardCarousel component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-carousel-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "CardCarousel_RelatedPosts",
  language: "en",
  fields: {
    "heading": "Related Posts"
  }
});

const dynamicId = addResult.placeholderId;
const cardPlaceholder = `headless-main/cardcarousel-{${dynamicId}}`;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Add child Card components (4+ recommended)
// ═══════════════════════════════════════════════════════════════

// Card 1
const card1 = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: cardPlaceholder,
  componentItemName: "Card_Post1",
  language: "en",
  fields: {
    "heading": "Understanding Digital Transformation",
    "body": "<p>A deep dive into modern digital strategies.</p>"
  }
});

// Update Card 1 image
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: card1.datasourceId,
  language: "en",
  fields: {
    "image": "<image mediaid='{IMAGE1-GUID}' />"
  }
});

// Card 2
const card2 = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: cardPlaceholder,
  componentItemName: "Card_Post2",
  language: "en",
  fields: {
    "heading": "Cloud Migration Best Practices",
    "body": "<p>Essential tips for a smooth cloud transition.</p>"
  }
});

await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: card2.datasourceId,
  language: "en",
  fields: {
    "image": "<image mediaid='{IMAGE2-GUID}' />"
  }
});

// Card 3
const card3 = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: cardPlaceholder,
  componentItemName: "Card_Post3",
  language: "en",
  fields: {
    "heading": "AI in Enterprise Applications",
    "body": "<p>How AI is reshaping business software.</p>"
  }
});

await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: card3.datasourceId,
  language: "en",
  fields: {
    "image": "<image mediaid='{IMAGE3-GUID}' />"
  }
});

// Card 4
const card4 = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "card-rendering-id",
  placeholderPath: cardPlaceholder,
  componentItemName: "Card_Post4",
  language: "en",
  fields: {
    "heading": "Security in the Modern Web",
    "body": "<p>Protecting your digital assets today.</p>"
  }
});

await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: card4.datasourceId,
  language: "en",
  fields: {
    "image": "<image mediaid='{IMAGE4-GUID}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: CardCarousel with 4 child cards
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field   | Type             | MCP Format           |
|:--------|:-----------------|:---------------------|
| heading | Single-Line Text | `"Plain text value"` |

### Placeholder Path Pattern

For CardCarousel's child placeholder:
```
headless-main/cardcarousel-{DYNAMIC_PLACEHOLDER_ID}
```

The `DYNAMIC_PLACEHOLDER_ID` is returned when you add the CardCarousel component.

### MCP Authoring Checklist

Before authoring CardCarousel via MCP, verify:

- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have CardCarousel rendering ID (from component manifest)
- [ ] Have Card rendering ID (for child cards)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Save the dynamic placeholder ID returned when adding CardCarousel
- [ ] Plan to add 4+ cards for optimal carousel experience

### MCP Error Handling

| Error                  | Cause                        | Solution                                      |
|:-----------------------|:-----------------------------|:----------------------------------------------|
| "Item already exists"  | Duplicate component name     | Use unique suffix: `CardCarousel_2`           |
| Component not visible  | Wrong placeholder path       | Use `"headless-main"` without leading slash   |
| Cards not appearing    | Wrong child placeholder path | Use dynamic ID from CardCarousel response     |
| No carousel controls   | Too few cards                | Add 4+ cards so slides exceed visible count   |
| `updatedFields: {}`    | Normal response              | Update succeeded despite empty response       |

### Related Skills for MCP Authoring

| Skill                         | Purpose                                |
|:------------------------------|:---------------------------------------|
| `/sitecore-author-placeholder`| Placeholder path construction rules    |
| `/sitecore-author-image`      | Image field XML formatting for cards   |
| `/sitecore-upload-media`      | Upload images to Media Library first   |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
