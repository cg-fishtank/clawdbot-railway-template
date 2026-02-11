# IconFeatureCardGrid Component

## Purpose

The IconFeatureCardGrid component serves as a container for displaying a collection of IconFeatureCard components in a responsive grid layout. It includes a heading and subheading for the section, followed by a 4-column grid (desktop) that stacks responsively on smaller screens. The component is ideal for feature highlights, service offerings, or benefit sections.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Feature Cards/Icon Feature Card Grid`
- **Template Name:** `Icon Feature Card Grid`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Section heading (H2) | Recommended max 80 characters |
| subheading | Rich Text | No | Section description/introduction | Keep concise, 1-2 sentences |

## Placeholder Configuration

| Placeholder Key | Purpose | Allowed Components |
|-----------------|---------|-------------------|
| `iconfeaturecardgrid` | Feature card container | IconFeatureCard |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text field={fields?.heading} tag="h2" className="heading-4xl mb-6 leading-none" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| subheading | `<RichText field={fields?.subheading} className="richtext copy-lg leading-none" />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **Type:** Single-Line Text
- **Required:** Yes
- **What to enter:** Section title that introduces the feature cards
- **Tone/Style:** Clear, compelling, benefit-oriented
- **Character limit:** 80 characters recommended
- **Example:** "Why Choose Us"

#### subheading

- **Type:** Rich Text
- **Required:** No
- **What to enter:** Brief introduction to the features being highlighted
- **Tone/Style:** Informative, sets context for the cards
- **Formatting:** Keep simple, typically a single paragraph
- **Example:**
  ```html
  <p>Discover the benefits that set us apart from the competition and make us the right choice for your needs.</p>
  ```

### Adding Feature Cards

After configuring the grid, add IconFeatureCard components to the `iconfeaturecardgrid` placeholder:

1. In Experience Editor, select the IconFeatureCardGrid component
2. Click on the placeholder area
3. Add IconFeatureCard components
4. Configure each card with heading, icon, subheading, and optional link

## Component Props Interface

```typescript
type IconFeatureCardGridFields = {
  heading: Field<string>;
  subheading: RichTextField;
};

type IconFeatureCardGridProps = ComponentProps & {
  fields: IconFeatureCardGridFields;
};
```

## Responsive Grid Layout

| Viewport | Columns | Gap |
|----------|---------|-----|
| Mobile (< 768px) | 1 | 32px vertical |
| Tablet (768px - 1024px) | 2 | 32px |
| Desktop (≥ 1024px) | 4 | 32px |

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "heading": { "value": "Why Choose Us" }
  }
}
```

### Complete (All Fields)

```json
{
  "fields": {
    "heading": { "value": "Why Choose Us" },
    "subheading": {
      "value": "<p>Discover the benefits that set us apart and make us the right choice for your business needs.</p>"
    }
  }
}
```

## Visual Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│  Why Choose Us                                        (heading - H2)   │
│                                                                        │
│  Discover the benefits that set us apart...          (subheading)      │
│                                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │  Card 1  │  │  Card 2  │  │  Card 3  │  │  Card 4  │               │
│  │   🎧     │  │   🛡️     │  │   🚀     │  │   ⏰     │               │
│  │ Support  │  │ Security │  │  Speed   │  │  24/7    │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Icon Feature Card Grid: `/sitecore/content/[Site]/Home/Data/Feature Cards/[Grid Name]`
- Feature Cards: Created as separate items and added via placeholder

### Experience Editor Behavior

- **Inline editable:** heading, subheading
- **Placeholder editing:** Add/remove IconFeatureCard components
- **Grid preview:** Responsive grid visible in preview mode

### Rendering Parameters (Styles)

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| theme | Droplist | primary, secondary, tertiary | primary | Background/text theme |
| padding (top) | Droplist | none, xs, sm, md, lg, xl | none | Top padding |
| padding (bottom) | Droplist | none, xs, sm, md, lg, xl | none | Bottom padding |

## Theme Inheritance

The grid's theme affects child IconFeatureCard components through smart theming:

| Grid Theme | Card Auto-Theme |
|------------|-----------------|
| `primary` | `secondary` (contrast) |
| `secondary` | `tertiary` (contrast) |
| `tertiary` | `secondary` (contrast) |

## Authoring Rules

1. **Balanced Content:** Aim for 4 or 8 cards for optimal grid balance
2. **Consistent Cards:** Use similar content length across all cards
3. **Clear Hierarchy:** Grid heading should be more prominent than card headings
4. **Mobile Testing:** Verify single-column layout on mobile

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Empty placeholder | Section looks incomplete | Add 4+ IconFeatureCard components |
| Uneven card count | Grid looks unbalanced | Use 4, 8, or 12 cards |
| Long subheading | Pushes cards down | Keep to 1-2 sentences |
| Inconsistent card content | Uneven visual appearance | Balance heading/subheading lengths |

## Related Components

- `IconFeatureCard` - Individual feature card placed within grid
- `CardGrid` - Alternative grid for image-based cards
- `ContentGrid` - Generic content grid component

---

## MCP Authoring Instructions

### Step 1: Add IconFeatureCardGrid to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "icon-feature-card-grid-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "IconFeatureCardGrid_WhyChooseUs",
  language: "en",
  fields: {
    "heading": "Why Choose Us",
    "subheading": "<p>Discover the benefits that set us apart.</p>"
  }
});

const gridDatasourceId = result.datasourceId;
```

### Step 2: Create and Add IconFeatureCard Components

```javascript
// Create card datasource
const card1 = await mcp__marketer__create_content_item({
  siteName: "main",
  parentPath: "/sitecore/content/Site/Home/Data/Feature Cards",
  templatePath: "/sitecore/templates/Project/Site/Feature Cards/Icon Feature Card",
  itemName: "Support Card",
  language: "en"
});

// Set card fields
await mcp__marketer__update_content({
  siteName: "main",
  itemId: card1.itemId,
  language: "en",
  fields: {
    "heading": "24/7 Support",
    "subheading": "<p>Always here when you need us.</p>",
    "imageIcon": "headset"
  }
});

// Add card to grid placeholder
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "icon-feature-card-rendering-id",
  placeholderPath: "iconfeaturecardgrid-{dynamic-placeholder-id}",
  componentItemName: "IconFeatureCard_Support",
  language: "en",
  dataSourceId: card1.itemId
});
```

### Step 3: Repeat for Additional Cards

Create and add 3 more cards for a balanced 4-column layout:
- Security card (icon: `shield-halved`)
- Speed card (icon: `rocket`)
- Availability card (icon: `clock`)

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| subheading | Rich Text | `"<p>HTML content</p>"` |

### MCP Authoring Checklist

- [ ] Have page ID
- [ ] Have IconFeatureCardGrid rendering ID
- [ ] Have IconFeatureCard rendering ID
- [ ] Create 4 card datasources
- [ ] Add grid to page
- [ ] Get dynamic placeholder path for grid
- [ ] Add 4 cards to grid placeholder

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
