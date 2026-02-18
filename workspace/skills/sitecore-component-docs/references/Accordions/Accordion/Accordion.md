# Accordion Component

## Purpose

The Accordion component provides a collapsible content section with a heading, subheading, and optional call-to-action link. It serves as a **parent container** that holds multiple AccordionDrawer child components, managing single-open-at-a-time state through an AccordionProvider context. Only one drawer within the group can be expanded at any time. The component is ideal for FAQ sections, product details, or any content that benefits from progressive disclosure.

**Important:** This component is always used together with the `AccordionDrawer` component. The Accordion is the parent container; AccordionDrawer components are placed inside its placeholder as individual collapsible panels. See [AccordionDrawer.md](../AccordionDrawer/AccordionDrawer.md) for child component details.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Accordions/Accordion`
- **Template Name:** `Accordion`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Main heading for the accordion section | Rendered as H2; recommended max 80 characters |
| subheading | Rich Text | Yes | Supporting text below the heading | Supports rich text formatting |
| link | General Link | No | Optional CTA button displayed beside the heading | Internal, External, or Media link |

### Rendering Parameters (Styles)

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| theme | Droplist | primary, secondary, tertiary | primary | Color theme for the section |
| transparent | Checkbox | true, false | false | Makes background transparent |

### Placeholder

| Placeholder Key | Allowed Components | Description |
|-----------------|-------------------|-------------|
| accordion-{DynamicPlaceholderId} | AccordionDrawer | Dynamic placeholder for accordion drawer panels |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text field={fields?.heading} tag="h2" className="heading-3xl leading-none" />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| subheading | `<RichText field={fields?.subheading} className="richtext copy-xl leading-none" />` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| link | `<Button variant="button" color={buttonColor} link={fields?.link} />` | Internal Button child component |

## Component Variants

| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard accordion with datasource check and Frame wrapper |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The main title for the accordion section
- **Tone/Style:** Clear, descriptive section title
- **Character limit:** 80 characters recommended
- **Example:** "Frequently Asked Questions"

#### subheading

- **What to enter:** Supporting descriptive text that appears below the heading
- **Tone/Style:** Brief explanatory text; supports HTML rich text
- **Format:** Rich Text (use `<p>` tags for paragraphs)
- **Example:** `"<p>Find answers to our most commonly asked questions below.</p>"`

#### link (Optional)

- **What to enter:** A call-to-action link displayed as a button beside the heading
- **Link types supported:** Internal, External, Media, Anchor
- **Guidance:** Use when you want a secondary action alongside the accordion (e.g., "View All FAQs", "Contact Support")
- **Note:** Button color is automatically determined by the theme: primary/tertiary themes produce a secondary-colored button; other themes produce a tertiary-colored button

### Experience Editor Behavior

- **Inline editable fields:** heading, subheading
- **Forms panel required:** link (General Link field)
- **Placeholder editing:** Click within the accordion area to add/edit AccordionDrawer children
- **Note:** In Experience Editor, all AccordionDrawer panels are forced open for editing visibility

### Content Matrix

| Configuration | AccordionDrawer Count | Use Case |
|---------------|----------------------|----------|
| Minimal | 2-3 AccordionDrawers | Simple FAQ or feature list |
| Standard | 4-6 AccordionDrawers | Comprehensive FAQ section |
| Extended | 7+ AccordionDrawers | Detailed knowledge base section |

## Component Props Interface

```typescript
import { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

type AccordionFields = {
  heading: Field<string>;
  subheading: Field<string>;
  link?: LinkField;
};

export type AccordionProps = ComponentProps & {
  fields: AccordionFields;
};
```

## Key Behavior

- **Single-open state:** The AccordionProvider context ensures only one AccordionDrawer can be open at a time within this Accordion group. Opening a new drawer automatically closes the previously open one.
- **Theme-aware button:** The optional link field renders as a Button component whose color adapts to the active theme (secondary for primary/tertiary themes, tertiary otherwise).
- **Layout:** Uses ContainedWrapper for consistent max-width containment and responsive padding (px-8 mobile, lg:px-16 desktop).

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "Frequently Asked Questions" },
    "subheading": { "value": "<p>Find answers to common questions below.</p>" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "Frequently Asked Questions" },
    "subheading": { "value": "<p>Browse our FAQ section or contact us for more help.</p>" },
    "link": {
      "value": {
        "href": "/contact",
        "text": "Contact Support",
        "target": ""
      }
    }
  }
}
```

## Page Layout Structure

```
Page
└── headless-main (placeholder)
    └── Accordion
        ├── [heading, subheading, link fields]
        └── accordion-{DynamicPlaceholderId} (placeholder)
            ├── AccordionDrawer (Drawer 1)
            │   └── buttons-{DynamicPlaceholderId} (placeholder)
            │       └── Button (optional)
            ├── AccordionDrawer (Drawer 2)
            │   └── buttons-{DynamicPlaceholderId} (placeholder)
            │       └── Button (optional)
            └── AccordionDrawer (Drawer 3)
                └── buttons-{DynamicPlaceholderId} (placeholder)
                    └── Button (optional)
```

## Common Mistakes to Avoid

1. **Empty accordion:** Always add at least 2 AccordionDrawer children. An Accordion with 0-1 drawers provides no value as a collapsible interface.

2. **Placing AccordionDrawer outside Accordion:** AccordionDrawer requires the AccordionProvider context from a parent Accordion. It will not function correctly as a standalone component -- the toggle and isOpen functions fall back to no-ops.

3. **Expecting multiple drawers open simultaneously:** The Accordion enforces single-open-at-a-time behavior by design. If you need multiple sections open at once, use separate components.

4. **Using literal newlines in subheading:** Never use `\n` in the subheading field. Use HTML tags (`<p>`, `<br />`) since it is a Rich Text field.

5. **Forgetting the link is optional:** The link field is not required. If no link is provided, the button area simply does not render.

## Related Components

- `AccordionDrawer` - **Required child component** that provides individual collapsible panels within this Accordion. See [AccordionDrawer.md](../AccordionDrawer/AccordionDrawer.md).
- `Button` - Child component used within AccordionDrawer's `buttons` placeholder for drawer-level CTAs
- `TabsContainer` - Alternative pattern for tabbed content organization (shows one panel at a time with tab navigation)
- `ContentBlock` - For non-collapsible content sections

## Accessibility

- Accordion wraps all children in `AccordionProvider` context for coordinated state
- Individual drawer accessibility is handled by AccordionDrawer (see AccordionDrawer.md)
- Theme-aware focus ring styling via CSS custom property `--focus-ring`

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the Accordion component using the Marketer MCP tools. The Accordion is a **parent container** that requires a multi-step authoring workflow: first add the Accordion, then retrieve its dynamic placeholder ID, then add AccordionDrawer children to its placeholder.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the Accordion rendering ID: `8cb91616-d630-4732-b520-4d3a0c4931e4`
3. Have the AccordionDrawer rendering ID: `4e1df4d2-a674-4502-a9e0-7828a9536cd9`
4. Know the target placeholder (typically `"headless-main"` for root placement)
5. Plan the AccordionDrawer children to add after creating the container

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Page Name"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add Accordion to Page

```javascript
const accordionResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "8cb91616-d630-4732-b520-4d3a0c4931e4",
  placeholderPath: "headless-main",
  componentItemName: "Accordion_FAQ",
  language: "en",
  fields: {
    "heading": "Frequently Asked Questions",
    "subheading": "<p>Find answers to common questions below.</p>"
  }
});

const accordionDatasourceId = accordionResult.datasourceId;
```

### Step 3: Retrieve the Dynamic Placeholder ID

**This step is critical.** You must query the page to find the Accordion's DynamicPlaceholderId before you can add children.

```javascript
const pageData = await mcp__marketer__get_components_on_page({
  pageId: pageId
});

const accordionComponent = pageData.components.find(c =>
  c.dataSource === accordionDatasourceId
);

const dynamicId = accordionComponent.parameters.DynamicPlaceholderId;
```

### Step 4: Construct the AccordionDrawer Placeholder Path

```javascript
// CRITICAL: Nested placeholders MUST have a leading slash
const accordionPlaceholder = `/headless-main/accordion-${dynamicId}`;
// Example result: "/headless-main/accordion-1"
```

### Step 5: Add AccordionDrawer Children

See **AccordionDrawer.md** for detailed child authoring instructions.

```javascript
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "4e1df4d2-a674-4502-a9e0-7828a9536cd9",
  placeholderPath: accordionPlaceholder,
  componentItemName: "AccordionDrawer_WhatIsProduct",
  language: "en",
  fields: {
    "heading": "What is this product?",
    "body": "<p>Our product is a comprehensive solution for managing your digital presence.</p>"
  }
});
```

### Step 6: Update Link Field (Optional)

If the Accordion has a CTA link, update it after creation:

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: accordionDatasourceId,
  language: "en",
  fields: {
    "link": "<link linktype='internal' id='{PAGE-GUID}' text='Contact Support' />"
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
  search_query: "FAQ Page"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add Accordion component
// ═══════════════════════════════════════════════════════════════
const accordionResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "8cb91616-d630-4732-b520-4d3a0c4931e4",
  placeholderPath: "headless-main",
  componentItemName: "Accordion_FAQ",
  language: "en",
  fields: {
    "heading": "Frequently Asked Questions",
    "subheading": "<p>Browse our FAQ section or contact us for more help.</p>"
  }
});

const accordionDatasourceId = accordionResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Get dynamic placeholder ID
// ═══════════════════════════════════════════════════════════════
const pageData = await mcp__marketer__get_components_on_page({
  pageId: pageId
});

const accordionComponent = pageData.components.find(c =>
  c.dataSource === accordionDatasourceId
);

const dynamicId = accordionComponent.parameters.DynamicPlaceholderId;
const accordionPlaceholder = `/headless-main/accordion-${dynamicId}`;

// ═══════════════════════════════════════════════════════════════
// STEP 4: Add AccordionDrawer - Question 1
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "4e1df4d2-a674-4502-a9e0-7828a9536cd9",
  placeholderPath: accordionPlaceholder,
  componentItemName: "AccordionDrawer_WhatIsProduct",
  language: "en",
  fields: {
    "heading": "What is this product?",
    "body": "<p>Our product is a comprehensive solution for managing your digital presence across multiple channels.</p>"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 5: Add AccordionDrawer - Question 2
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "4e1df4d2-a674-4502-a9e0-7828a9536cd9",
  placeholderPath: accordionPlaceholder,
  componentItemName: "AccordionDrawer_HowToStart",
  language: "en",
  fields: {
    "heading": "How do I get started?",
    "body": "<p>Getting started is easy. Simply sign up for an account and follow our onboarding guide.</p>"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 6: Add AccordionDrawer - Question 3
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "4e1df4d2-a674-4502-a9e0-7828a9536cd9",
  placeholderPath: accordionPlaceholder,
  componentItemName: "AccordionDrawer_Pricing",
  language: "en",
  fields: {
    "heading": "What are the pricing options?",
    "body": "<p>We offer flexible pricing plans to suit businesses of all sizes. Visit our pricing page for details.</p>"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 7 (Optional): Update Accordion link field
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: accordionDatasourceId,
  language: "en",
  fields: {
    "link": "<link linktype='internal' id='{PAGE-GUID}' text='Contact Support' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: Accordion with 3 AccordionDrawers + CTA link
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| subheading | Rich Text | `"<p>HTML content</p>"` |
| link | General Link | `<link linktype='internal' id='{GUID}' text='Link Text' />` |

### MCP Authoring Checklist

Before authoring Accordion via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have Accordion rendering ID: `8cb91616-d630-4732-b520-4d3a0c4931e4`
- [ ] Have AccordionDrawer rendering ID: `4e1df4d2-a674-4502-a9e0-7828a9536cd9`
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `Accordion_FAQ`)
- [ ] Plan at least 2 AccordionDrawer children
- [ ] Know the placeholder pattern: `/{parent-placeholder}/accordion-{dynamicId}` (leading slash for nested)
- [ ] Image XML uses single quotes and braces if applicable: `<image mediaid='{GUID}' />`

### Placeholder Path Construction

| Parent Placeholder | Accordion Dynamic ID | AccordionDrawer Placeholder Path |
|--------------------|---------------------|----------------------------------|
| `headless-main` | `1` | `/headless-main/accordion-1` |
| `headless-main` | `3` | `/headless-main/accordion-3` |

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `Accordion_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash for root |
| AccordionDrawers not appearing | Wrong nested placeholder | Verify `/{parent}/accordion-{dynamicId}` format with leading slash |
| Missing dynamic ID | Skipped Step 3 | Must call `get_components_on_page` after adding Accordion to retrieve DynamicPlaceholderId |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-pagebuilder` | Page creation and component placement |
| `/sitecore-author-link` | Link field XML formatting for optional CTA |
| `AccordionDrawer.md` | Child component field details and three-level nesting |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-17 | Initial documentation | Claude Code |
