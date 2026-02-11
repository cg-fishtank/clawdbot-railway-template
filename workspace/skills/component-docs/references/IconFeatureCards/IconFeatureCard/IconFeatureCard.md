# IconFeatureCard Component

## Purpose

The IconFeatureCard component displays a single feature card with an icon, heading, subheading (rich text), and optional CTA link. It's designed to be placed within an IconFeatureCardGrid placeholder to create feature highlight sections. The card supports smart theming that automatically adjusts based on the parent grid's theme, and the entire card can be clickable when a link is provided.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Feature Cards/Icon Feature Card`
- **Template Name:** `Icon Feature Card`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Card title/heading | Recommended max 50 characters |
| subheading | Rich Text | No | Card description/body text | Keep concise, 2-3 sentences |
| imageIcon | Single-Line Text | Yes | FontAwesome icon name | Use FontAwesome solid icon names |
| link | General Link | No | CTA button link (also makes card clickable) | Internal or external link |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text field={fields.heading} tag="h3" className="heading-2xl" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| subheading | `<RichText field={fields.subheading} className="richtext copy-lg" />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| imageIcon | `<IconFas icon={fields.imageIcon?.name} />` | Custom Icon component |
| link | `<Button link={link} variant="button" />` or wrapper `<Link>` | Custom Button / Next.js Link |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **Type:** Single-Line Text
- **Required:** Yes
- **What to enter:** Feature name or benefit title
- **Tone/Style:** Clear, benefit-focused
- **Character limit:** 50 characters recommended
- **Example:** "24/7 Support"

#### subheading

- **Type:** Rich Text
- **Required:** No
- **What to enter:** Brief description of the feature
- **Tone/Style:** Informative, concise
- **Formatting:** Keep simple - avoid complex HTML
- **Example:**
  ```html
  <p>Our dedicated support team is available around the clock to help you with any questions or issues.</p>
  ```

#### imageIcon

- **Type:** Single-Line Text (mapped to IconFieldType)
- **Required:** Yes
- **What to enter:** FontAwesome solid icon name (without "fa-" prefix)
- **Common icons:**
  | Icon Name | Display | Use Case |
  |-----------|---------|----------|
  | `headset` | 🎧 | Support/Contact |
  | `shield-halved` | 🛡️ | Security |
  | `rocket` | 🚀 | Speed/Performance |
  | `clock` | ⏰ | Time/Availability |
  | `chart-line` | 📈 | Analytics/Growth |
  | `users` | 👥 | Team/Community |
  | `cog` | ⚙️ | Settings/Config |
  | `bolt` | ⚡ | Power/Fast |
- **Example:** `"headset"`

#### link

- **Type:** General Link
- **Required:** No
- **Behavior:** When set, entire card becomes clickable, and button displays
- **Guidance:** Use descriptive link text for the button
- **Example:**
  ```json
  {
    "value": {
      "href": "/support",
      "text": "Get Support",
      "title": "Contact our support team"
    }
  }
  ```

## Smart Theming Behavior

The card automatically adjusts its theme based on the parent grid:

| Parent Grid Theme | Card Theme | Icon Background |
|-------------------|------------|-----------------|
| `primary` (light) | `secondary` (dark) | `tertiary` (accent) |
| `tertiary` (accent) | `secondary` (dark) | `tertiary` (accent) |
| `secondary` (dark) | `tertiary` (accent) | `secondary` (dark) |
| No theme set | `primary` (light) | `secondary` (dark) |

Cards can also have explicit themes set via rendering parameters to override this behavior.

## Component Props Interface

```typescript
type IconFeatureCardFields = {
  heading: Field<string>;
  subheading: RichTextField;
  imageIcon: IconFieldType;
  link: LinkField;
};

export type IconFeatureCardFieldsProps = {
  fields: IconFeatureCardFields;
};

export type IconFeatureCardProps = ComponentProps &
  IconFeatureCardFieldsProps & {
    parent?: boolean;
  };

// IconFieldType definition:
type IconFieldType = {
  name: IconType;  // FontAwesome icon name
};
```

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "heading": { "value": "24/7 Support" },
    "imageIcon": { "name": "headset" }
  }
}
```

### Complete (All Fields)

```json
{
  "fields": {
    "heading": { "value": "24/7 Support" },
    "subheading": {
      "value": "<p>Our dedicated support team is available around the clock to help you with any questions or issues.</p>"
    },
    "imageIcon": { "name": "headset" },
    "link": {
      "value": {
        "href": "/support",
        "text": "Get Support",
        "title": "Contact our support team"
      }
    }
  }
}
```

## Visual Layout

```
┌─────────────────────────────┐
│  ┌────┐                     │
│  │ 🎧 │  (icon in circle)   │
│  └────┘                     │
│                             │
│  24/7 Support               │  (heading)
│                             │
│  Our dedicated support      │  (subheading)
│  team is available...       │
│                             │
│  [Get Support]              │  (button, if link set)
└─────────────────────────────┘
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Icon Feature Cards: `/sitecore/content/[Site]/Home/Data/Feature Cards/[Card Name]`

### Experience Editor Behavior

- **Inline editable:** heading, subheading
- **Forms panel:** imageIcon (dropdown/text), link
- **Card click behavior:** Disabled in editing mode for easier editing

### Rendering Parameters (Styles)

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| theme | Droplist | primary, secondary, tertiary | (auto) | Override automatic theme |

## Authoring Rules

1. **Icon Selection:** Use recognizable icons that relate to the feature
2. **Heading Length:** Keep headings short and scannable
3. **Subheading Brevity:** 2-3 sentences maximum
4. **Consistent Style:** Use same icon style across all cards in a grid

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Wrong icon name | Icon won't display | Verify FontAwesome solid icon names |
| Long headings | Text wraps awkwardly | Keep under 50 characters |
| Missing imageIcon | Card looks empty | Always provide an icon |
| Inconsistent icons | Visual discord | Use same icon style/weight |

## Related Components

- `IconFeatureCardGrid` - Parent container that holds IconFeatureCard components
- `CardGrid` - Alternative grid for image-based cards

---

## MCP Authoring Instructions

### Step 1: Create IconFeatureCard Datasource

```javascript
const datasource = await mcp__marketer__create_content_item({
  siteName: "main",
  parentPath: "/sitecore/content/Site/Home/Data/Feature Cards",
  templatePath: "/sitecore/templates/Project/Site/Feature Cards/Icon Feature Card",
  itemName: "Support Card",
  language: "en"
});
```

### Step 2: Set Fields

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasource.itemId,
  language: "en",
  fields: {
    "heading": "24/7 Support",
    "subheading": "<p>Our dedicated support team is available around the clock.</p>",
    "imageIcon": "headset",
    "link": "<link text='Get Support' linktype='internal' url='/support' />"
  }
});
```

### Step 3: Add to IconFeatureCardGrid Placeholder

```javascript
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "icon-feature-card-rendering-id",
  placeholderPath: "iconfeaturecardgrid-{dynamic-id}",
  componentItemName: "IconFeatureCard_Support",
  language: "en",
  dataSourceId: datasource.itemId
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| subheading | Rich Text | `"<p>HTML content</p>"` |
| imageIcon | Single-Line Text | `"icon-name"` (FontAwesome name) |
| link | General Link | `<link text='Text' linktype='internal' url='/path' />` |

### Common FontAwesome Icons

```
headset, shield-halved, rocket, clock, chart-line, users, cog, bolt,
star, heart, check-circle, globe, lock, envelope, phone, calendar,
briefcase, graduation-cap, lightbulb, wrench, database, cloud
```

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
