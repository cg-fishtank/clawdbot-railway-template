# FullWidth Component

## Purpose

The FullWidth component creates a full-bleed container that spans the entire viewport width, breaking out of any parent container constraints. It supports an optional background image (with responsive mobile variant) and provides a placeholder for child components. This component is ideal for hero sections, feature highlights, or any content that needs to extend edge-to-edge while maintaining proper content containment within.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Containers/Full Width`
- **Template Name:** `Full Width`

### Fields

| Field Name             | Sitecore Type | Required | Description                                | Validation/Constraints                    |
| ---------------------- | ------------- | -------- | ------------------------------------------ | ----------------------------------------- |
| backgroundImage        | Image         | No       | Desktop background image                   | Recommended 1920x800px minimum            |
| backgroundImageMobile  | Image         | No       | Mobile-specific background image           | Recommended 800x600px, falls back to desktop |

### Rendering Parameters (Styles)

| Parameter        | Type     | Options                              | Default | Description                                |
| ---------------- | -------- | ------------------------------------ | ------- | ------------------------------------------ |
| theme            | Droplist | primary, secondary, tertiary         | none    | Color theme for the section                |
| maxWidth         | Droplist | max-w-4xl, max-w-5xl, max-w-6xl, max-w-7xl | none | Maximum width for inner content       |
| contentAlignment | Droplist | items-start, items-center, items-end | start   | Alignment of child content                 |
| anchorId         | Text     | Any string                           | none    | Optional anchor ID for navigation          |
| RenderingIdentifier | Text  | Any string                           | none    | Fallback anchor ID                         |

## Placeholder Configuration

The FullWidth component exposes a single placeholder for child components:

| Placeholder Key   | Allowed Components | Description                        |
| ----------------- | ------------------ | ---------------------------------- |
| `fullwidth-{*}`   | Any                | Container for any child components |

**Dynamic Placeholder:** The placeholder uses the pattern `fullwidth-{DynamicPlaceholderId}` where `{DynamicPlaceholderId}` is replaced with the component's unique identifier.

## JSS Field Component Mapping

| Sitecore Field        | JSS Component                          | Import                          |
| --------------------- | -------------------------------------- | ------------------------------- |
| backgroundImage       | `<BackgroundImage fields={fields} />`  | Custom BackgroundImage component|
| backgroundImageMobile | (Handled by BackgroundImage component) | -                               |

## Component Variants

The FullWidth component exports a single Default variant:

| Variant | Export Name | Description                              | Use Case                    |
| ------- | ----------- | ---------------------------------------- | --------------------------- |
| Default | `Default`   | Full-bleed container with background     | Hero sections, feature areas|

## Content Authoring Instructions

### Field-by-Field Guidance

#### backgroundImage (Desktop)

- **Recommended dimensions:** 1920x800px or larger
- **Aspect ratio:** 2.4:1 (wide landscape) or based on content height
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Descriptive text for accessibility
- **Media Library path:** `/sitecore/media library/Project/[Site]/Backgrounds/`
- **Tips:** Use images that work well with content overlay; consider contrast with text

#### backgroundImageMobile

- **Recommended dimensions:** 800x600px or larger
- **Aspect ratio:** 4:3 (portrait/square preferred for mobile)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Can be same as desktop image
- **Media Library path:** `/sitecore/media library/Project/[Site]/Backgrounds/Mobile/`
- **Tips:** Falls back to desktop image if not provided; displays below 1024px viewport

### Rendering Parameter Guide

#### theme

- **primary:** Primary brand color scheme
- **secondary:** Secondary/muted color scheme
- **tertiary:** Accent color scheme

#### maxWidth

Controls the maximum width of inner content:
- **max-w-4xl:** 896px max width
- **max-w-5xl:** 1024px max width
- **max-w-6xl:** 1152px max width
- **max-w-7xl:** 1280px max width

#### contentAlignment

- **items-start:** Left-aligned content
- **items-center:** Center-aligned content
- **items-end:** Right-aligned content

### Content Matrix (Variations)

| Variation          | Fields                                 | Use Case                        |
| ------------------ | -------------------------------------- | ------------------------------- |
| Solid Background   | (none)                                 | Colored section without image   |
| With Background    | backgroundImage                        | Visual hero or feature section  |
| Full Responsive    | backgroundImage, backgroundImageMobile | Optimized for all devices       |

## Component Props Interface

```typescript
import { ComponentWithContextProps } from 'lib/component-props';
import { BackgroundImageProps } from 'lib/hooks/useBackgroundImage';

type FullWidthFieldsType = {
  fields: BackgroundImageProps;
};

type FullWidthProps = ComponentWithContextProps & FullWidthFieldsType;

// BackgroundImageProps includes:
// - backgroundImage: ImageField
// - backgroundImageMobile: ImageField
```

## Example Content Entry

### Minimum Viable Content (No Background)

```json
{
  "fields": {}
}
```

### Full Content Example

```json
{
  "fields": {
    "backgroundImage": {
      "value": {
        "src": "/-/media/Project/Site/Backgrounds/hero-background.jpg",
        "alt": "Abstract technology background",
        "width": "1920",
        "height": "800"
      }
    },
    "backgroundImageMobile": {
      "value": {
        "src": "/-/media/Project/Site/Backgrounds/Mobile/hero-background-mobile.jpg",
        "alt": "Abstract technology background",
        "width": "800",
        "height": "600"
      }
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- FullWidth data sources: `/sitecore/content/[Site]/Home/Data/Containers/`

### Experience Editor Behavior

- **Placeholder editing:** Click within the container to add/edit child components
- **Background image:** Select via forms panel; may need to scroll to see full container
- **Theme preview:** Theme colors apply immediately in Experience Editor

### Anchor Navigation

Use the `anchorId` rendering parameter to create navigation targets:
- Set `anchorId` to a unique value (e.g., "features")
- Link to the section using `#features` in page links

## Common Mistakes to Avoid

1. **Missing content containment:** Without `maxWidth` set, content may span too wide on large screens. Always set appropriate max-width for readability.

2. **Low-contrast background:** If using background images with text overlay, ensure sufficient contrast for readability.

3. **Oversized background images:** Very large images slow page load. Optimize images for web (compress, use WebP format).

4. **Missing mobile image:** On mobile devices, cropped desktop images may not look good. Provide a mobile-optimized image when the desktop image has important edge content.

5. **Empty container:** FullWidth without child components creates empty space. Always add content components.

## Related Components

- `ColumnSplitter` - Multi-column layout container (within contained width)
- `RowSplitter` - Vertical row layout container
- `ContentBanner` - Similar full-width component with heading/subheading fields

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the FullWidth component using the Marketer MCP tools.

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Page Name"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add FullWidth to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "fullwidth-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "FullWidth_HeroSection",
  language: "en",
  fields: {}  // Optional - add background images later
});

const datasourceId = result.datasourceId;
const dynamicPlaceholderId = result.placeholderId;
```

### Step 3: Update Background Image Fields (Optional)

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "backgroundImage": "<image mediaid='{BACKGROUND-IMAGE-GUID}' />",
    "backgroundImageMobile": "<image mediaid='{MOBILE-BACKGROUND-GUID}' />"
  }
});
```

### Step 4: Add Child Components to Placeholder

```javascript
// Add components to the FullWidth's placeholder
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "hero-banner-rendering-id",
  placeholderPath: `headless-main/fullwidth-{${dynamicPlaceholderId}}`,
  componentItemName: "HeroBanner_Main",
  language: "en",
  fields: {
    "heading": "Welcome to Our Site",
    "subheading": "Discover innovative solutions"
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
  search_query: "Homepage"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add FullWidth container component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "fullwidth-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "FullWidth_HeroArea",
  language: "en",
  fields: {}
});

const datasourceId = addResult.datasourceId;
const dynamicId = addResult.placeholderId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Add background image
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "backgroundImage": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />",
    "backgroundImageMobile": "<image mediaid='{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Add hero content inside FullWidth
// ═══════════════════════════════════════════════════════════════
const heroResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "hero-banner-rendering-id",
  placeholderPath: `headless-main/fullwidth-{${dynamicId}}`,
  componentItemName: "HeroBanner_Welcome",
  language: "en",
  fields: {
    "heading": "Transform Your Business",
    "subheading": "Innovative solutions for the digital age"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: FullWidth container with background and hero content
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field                  | Type  | MCP Format                   |
|:-----------------------|:------|:-----------------------------|
| backgroundImage        | Image | `<image mediaid='{GUID}' />` |
| backgroundImageMobile  | Image | `<image mediaid='{GUID}' />` |

### Placeholder Path Pattern

For FullWidth's child placeholder:
```
headless-main/fullwidth-{DYNAMIC_PLACEHOLDER_ID}
```

The `DYNAMIC_PLACEHOLDER_ID` is returned when you add the FullWidth component.

### MCP Authoring Checklist

Before authoring FullWidth via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have FullWidth rendering ID (from component manifest)
- [ ] Have rendering IDs for child components
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Save the dynamic placeholder ID for adding child components
- [ ] Have media GUIDs for background images (if using)
- [ ] Image XML uses single quotes and braces: `<image mediaid='{GUID}' />`

### MCP Error Handling

| Error                  | Cause                        | Solution                                      |
|:-----------------------|:-----------------------------|:----------------------------------------------|
| "Item already exists"  | Duplicate component name     | Use unique suffix: `FullWidth_2`              |
| Component not visible  | Wrong placeholder path       | Use `"headless-main"` without leading slash   |
| Child not appearing    | Wrong placeholder path       | Use dynamic ID from FullWidth response        |
| Background not showing | Wrong XML format             | Verify single quotes, braces around GUID      |
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
