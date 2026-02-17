# AccordionDrawer Component

## Purpose

The AccordionDrawer component represents an individual collapsible panel within an Accordion parent. It provides a clickable header with a heading and an expandable body area containing rich text content and an optional Button placeholder. Only one AccordionDrawer can be open at a time within its parent Accordion group. The component uses framer-motion for smooth expand/collapse animation (0.25s duration).

**Important:** This component **must** be placed inside an Accordion's placeholder. It requires the AccordionProvider context from the parent Accordion to manage open/close state. See [Accordion.md](../Accordion/Accordion.md) for parent component details. Without the parent Accordion, the toggle and isOpen functions fall back to no-ops and the drawer will not function.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Accordions/Accordion Drawer`
- **Template Name:** `Accordion Drawer`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| heading | Single-Line Text | Yes | Drawer button label displayed as the clickable header | Rendered as H3; keep concise for readability |
| body | Rich Text | Yes | Content displayed inside the drawer when expanded | Supports full rich text formatting |

### Placeholder

| Placeholder Key | Allowed Components | Description |
|-----------------|-------------------|-------------|
| buttons-{DynamicPlaceholderId} | Button | Dynamic placeholder for optional CTA buttons within the drawer |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| heading | `<Text field={fields?.heading} tag="h3" className="heading-base text-start text-content" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| body | `<RichText className="richtext" field={fields?.body} />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard collapsible drawer with datasource check and Frame wrapper |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** Short, descriptive label for the drawer header button
- **Tone/Style:** Question format for FAQs, or concise descriptive titles for feature sections
- **Character limit:** No strict limit, but keep concise for readability
- **Examples:** "What is this product?", "Shipping & Returns", "System Requirements"
- **Tips:** Keep headings parallel in structure across all drawers in the same Accordion

#### body

- **What to enter:** Full content for the expandable panel
- **Tone/Style:** Match the site's content guidelines
- **Format:** Rich Text (supports full HTML formatting)
- **Formatting supported:**
  - Paragraphs (`<p>`)
  - Headings (H4-H6 recommended since the drawer heading is H3)
  - Lists (ordered and unordered)
  - Links
  - Bold, italic, underline
  - Tables
- **Tips:** Content can be as long as needed; the panel will expand to accommodate

### Content Matrix

| Variation | Required Fields | Optional Components | Use Case |
|-----------|-----------------|---------------------|----------|
| Text only | heading, body | - | Simple FAQ answer or description |
| With CTA | heading, body | Button in buttons placeholder | Answer with a call-to-action link |

### Experience Editor Behavior

- **Edit Mode:** All AccordionDrawer panels display fully expanded for easy content editing
- **Inline editable fields:** heading, body (both fully editable inline)
- **Note:** Accordion expand/collapse interaction is disabled during editing so all content is accessible

## Component Props Interface

```typescript
import { Field, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type AccordionDrawerFields = {
  heading: Field<string>;
  body: RichTextField;
};

export type AccordionDrawerProps = ComponentProps & {
  fields: AccordionDrawerFields;
  id?: string;
};
```

## Key Behavior

- **Context dependency:** Consumes `AccordionProvider` context from the parent Accordion. Without this context, the drawer falls back to a non-functional state (always closed, toggle does nothing).
- **Unique ID generation:** Each drawer generates a unique ID using the pattern `drawer-${params.id}-${params.renderingId}-${params.DynamicPlaceholderId}`. This ID is used for accordion state management.
- **Single-open enforcement:** Only one drawer can be open at a time within an Accordion group. Opening a new drawer automatically closes the currently open one.
- **Experience Editor override:** In Sitecore page editing mode, all drawers are forced open to allow content authors to edit all panels simultaneously.
- **Animation:** Uses `AccordionMotion` (framer-motion) with a 0.25-second ease transition for expand/collapse.
- **Button placeholder:** Each drawer has its own `buttons` placeholder for optional CTA Button components within the expanded content area.

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "heading": { "value": "What is this product?" },
    "body": { "value": "<p>Our product is a comprehensive solution for digital content management.</p>" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "heading": { "value": "What are the system requirements?" },
    "body": {
      "value": "<h4>Minimum Requirements</h4><ul><li>Operating System: Windows 10+ or macOS 12+</li><li>RAM: 8 GB minimum</li><li>Storage: 500 MB available space</li></ul><h4>Recommended</h4><ul><li>RAM: 16 GB</li><li>Modern browser (Chrome, Firefox, Safari, Edge)</li></ul><p>For detailed requirements, visit our technical documentation.</p>"
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- AccordionDrawer data sources: `/sitecore/content/[Site]/Home/Data/Accordions/`
- Or created inline with the page

### Data Source Location

AccordionDrawers are typically created as:
1. **Local data sources:** Created automatically when adding AccordionDrawer in Experience Editor
2. **Shared data sources:** `/sitecore/content/[Site]/Home/Data/Accordions/[Drawer Name]`

## Common Mistakes to Avoid

1. **Using AccordionDrawer without an Accordion parent:** AccordionDrawer must be placed inside an Accordion's `accordion-{DynamicPlaceholderId}` placeholder. It requires the AccordionProvider context to function. Without it, the toggle and isOpen functions fall back to no-ops.

2. **Expecting multiple drawers open at once:** The Accordion enforces mutually exclusive open state. Only one drawer per Accordion group can be open at a time.

3. **Using H1-H3 in body content:** The drawer heading renders as H3. Use H4-H6 within the body to maintain proper heading hierarchy.

4. **Using literal newlines in body:** Never use `\n` escape sequences in the body field. Use HTML tags (`<p>`, `<br />`) since it is a Rich Text field.

5. **Placing wrong components in the buttons placeholder:** Only Button components should be placed in the AccordionDrawer's `buttons` placeholder.

6. **Wrong placeholder path for MCP authoring:** The nested placeholder for AccordionDrawer MUST include a leading slash. See MCP Authoring Instructions below.

## Related Components

- `Accordion` - **Required parent component** that provides the AccordionProvider context and contains AccordionDrawer children. See [Accordion.md](../Accordion/Accordion.md).
- `Button` - Optional child component placed in the drawer's `buttons` placeholder for CTAs
- `TabItem` - Similar child pattern used within TabsContainer (tabs vs. accordion)
- `ContentBlock` - For non-collapsible rich text content

## Accessibility

- Drawer button uses `aria-expanded` attribute to indicate open/close state
- `aria-controls` links the button to its content panel
- Keyboard navigation: Enter and Space keys toggle the drawer
- Visible focus ring styling on both button and drawer container
- Chevron icon rotates to indicate state (chevron-down when closed, chevron-up when open)
- Localized labels ("Open"/"Close") provided via `useTranslation` hook

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the AccordionDrawer component using the Marketer MCP tools. AccordionDrawer is a **child component** that requires a parent Accordion to exist first.

### Prerequisites

Before authoring this component via MCP:
1. Have the parent page ID (use `mcp__marketer__search_site`)
2. Have an Accordion already added to the page (see [Accordion.md](../Accordion/Accordion.md))
3. Have the Accordion's DynamicPlaceholderId for placeholder path construction
4. Have the AccordionDrawer rendering ID: `4e1df4d2-a674-4502-a9e0-7828a9536cd9`

### Important: Child Component -- Multi-Step Workflow Required

AccordionDrawer is a **child component** that must be placed inside an Accordion's placeholder. The authoring workflow is:
1. First add the Accordion to the page (see [Accordion.md](../Accordion/Accordion.md))
2. Call `get_components_on_page` to retrieve the Accordion's DynamicPlaceholderId
3. Construct the nested placeholder path with a leading slash
4. Add AccordionDrawer to that placeholder

### Step 1: Ensure Accordion Exists

```javascript
// If Accordion doesn't exist, add it first (see Accordion.md for full details)
const accordionResult = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "8cb91616-d630-4732-b520-4d3a0c4931e4",
  placeholderPath: "headless-main",
  componentItemName: "Accordion_FAQ",
  language: "en",
  fields: {
    "heading": "Frequently Asked Questions",
    "subheading": "<p>Common questions and answers.</p>"
  }
});

const accordionDatasourceId = accordionResult.datasourceId;
```

### Step 2: Retrieve the Dynamic Placeholder ID

```javascript
const pageData = await mcp__marketer__get_components_on_page({
  pageId: "page-guid"
});

const accordionComponent = pageData.components.find(c =>
  c.dataSource === accordionDatasourceId
);

const dynamicId = accordionComponent.parameters.DynamicPlaceholderId;
```

### Step 3: Construct Placeholder Path

```javascript
// CRITICAL: Nested placeholder path MUST have a leading slash
const accordionPlaceholder = `/headless-main/accordion-${dynamicId}`;
// Example result: "/headless-main/accordion-1"
```

### Step 4: Add AccordionDrawer to Accordion

```javascript
const drawerResult = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "4e1df4d2-a674-4502-a9e0-7828a9536cd9",
  placeholderPath: accordionPlaceholder,  // Nested placeholder with leading slash
  componentItemName: "AccordionDrawer_Question1",  // Must be unique
  language: "en",
  fields: {
    "heading": "What is this product?",
    "body": "<p>Our product is a comprehensive digital content management solution.</p>"
  }
});
```

### Step 5: Add Buttons Inside AccordionDrawer (Optional, Three-Level Nesting)

AccordionDrawer has its own `buttons` placeholder for optional Button components. This creates **three-level nesting**: Accordion > AccordionDrawer > Button.

```javascript
// First, get the AccordionDrawer's DynamicPlaceholderId
const updatedPageData = await mcp__marketer__get_components_on_page({
  pageId: "page-guid"
});

const drawerComponent = updatedPageData.components.find(c =>
  c.dataSource === drawerResult.datasourceId
);

const drawerDynamicId = drawerComponent.parameters.DynamicPlaceholderId;

// Construct the three-level nested placeholder path
// Format: /headless-main/accordion-{accordionId}/buttons-{drawerId}
const buttonPlaceholder = `/headless-main/accordion-${dynamicId}/buttons-${drawerDynamicId}`;
// Example result: "/headless-main/accordion-1/buttons-3"

// Add Button to AccordionDrawer
const buttonResult = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "c152f7dc-6c01-4380-babb-97c9f080cf00",
  placeholderPath: buttonPlaceholder,
  componentItemName: "Button_LearnMore",
  language: "en",
  fields: {}
});

// Update the button's link field
await mcp__marketer__update_content({
  siteName: "main",
  itemId: buttonResult.datasourceId,
  language: "en",
  fields: {
    "link": "<link linktype='internal' url='/products/overview' text='Learn More' />"
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
// STEP 2: Add Accordion parent (if not already present)
// ═══════════════════════════════════════════════════════════════
const accordionResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "8cb91616-d630-4732-b520-4d3a0c4931e4",
  placeholderPath: "headless-main",
  componentItemName: "Accordion_FAQ",
  language: "en",
  fields: {
    "heading": "Frequently Asked Questions",
    "subheading": "<p>Find answers to our most commonly asked questions.</p>"
  }
});

const accordionDatasourceId = accordionResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Get Accordion's dynamic placeholder ID
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
const drawer1 = await mcp__marketer__add_component_on_page({
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
const drawer2 = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "4e1df4d2-a674-4502-a9e0-7828a9536cd9",
  placeholderPath: accordionPlaceholder,
  componentItemName: "AccordionDrawer_HowToStart",
  language: "en",
  fields: {
    "heading": "How do I get started?",
    "body": "<ol><li>Sign up for an account</li><li>Complete the onboarding guide</li><li>Start creating content</li></ol>"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 6: Add AccordionDrawer - Question 3 (with Button)
// ═══════════════════════════════════════════════════════════════
const drawer3 = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "4e1df4d2-a674-4502-a9e0-7828a9536cd9",
  placeholderPath: accordionPlaceholder,
  componentItemName: "AccordionDrawer_Pricing",
  language: "en",
  fields: {
    "heading": "What are the pricing options?",
    "body": "<p>We offer flexible pricing plans to suit businesses of all sizes.</p>"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 7 (Optional): Add Button inside drawer 3
// ═══════════════════════════════════════════════════════════════
const updatedPageData = await mcp__marketer__get_components_on_page({
  pageId: pageId
});

const drawer3Component = updatedPageData.components.find(c =>
  c.dataSource === drawer3.datasourceId
);

const drawer3DynamicId = drawer3Component.parameters.DynamicPlaceholderId;
const buttonPlaceholder = `/headless-main/accordion-${dynamicId}/buttons-${drawer3DynamicId}`;

const buttonResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "c152f7dc-6c01-4380-babb-97c9f080cf00",
  placeholderPath: buttonPlaceholder,
  componentItemName: "Button_ViewPricing",
  language: "en",
  fields: {}
});

await mcp__marketer__update_content({
  siteName: "main",
  itemId: buttonResult.datasourceId,
  language: "en",
  fields: {
    "link": "<link linktype='internal' url='/pricing' text='View Pricing Plans' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: Accordion with 3 AccordionDrawers (one with Button)
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| heading | Single-Line Text | `"Plain text value"` |
| body | Rich Text | `"<p>HTML content</p>"` |

### Rich Text Body Examples

```javascript
// Simple paragraph
"body": "<p>Simple text content.</p>"

// With subheadings (use H4+ since drawer heading is H3)
"body": "<h4>Section Title</h4><p>Content under the heading.</p>"

// With unordered list
"body": "<ul><li>Item one</li><li>Item two</li><li>Item three</li></ul>"

// With ordered list
"body": "<ol><li>Step one</li><li>Step two</li><li>Step three</li></ol>"

// Combined formatting
"body": "<p>This is <strong>bold</strong> and <em>italic</em> text.</p><ul><li>First item</li><li>Second item</li></ul>"
```

### MCP Authoring Checklist

Before authoring AccordionDrawer via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Accordion parent already exists on the page
- [ ] Have Accordion's DynamicPlaceholderId (from `get_components_on_page`)
- [ ] Placeholder path follows pattern: `/{parent-placeholder}/accordion-{dynamicId}` (WITH leading slash)
- [ ] Have AccordionDrawer rendering ID: `4e1df4d2-a674-4502-a9e0-7828a9536cd9`
- [ ] Component item name is unique (e.g., `AccordionDrawer_Question1`)
- [ ] heading field has content (required)
- [ ] body field has HTML content (required, uses Rich Text)
- [ ] For buttons inside drawers: know the drawer's DynamicPlaceholderId too

### Placeholder Path Construction

**Two-level nesting (AccordionDrawer in Accordion):**

| Parent Placeholder | Accordion Dynamic ID | AccordionDrawer Placeholder Path |
|--------------------|---------------------|----------------------------------|
| `headless-main` | `1` | `/headless-main/accordion-1` |
| `headless-main` | `3` | `/headless-main/accordion-3` |

**Three-level nesting (Button in AccordionDrawer in Accordion):**

| Accordion Placeholder | Drawer Dynamic ID | Button Placeholder Path |
|-----------------------|-------------------|-------------------------|
| `/headless-main/accordion-1` | `2` | `/headless-main/accordion-1/buttons-2` |
| `/headless-main/accordion-1` | `3` | `/headless-main/accordion-1/buttons-3` |
| `/headless-main/accordion-3` | `5` | `/headless-main/accordion-3/buttons-5` |

### Technological Limitations

1. **Sequential dynamic IDs:** Sitecore assigns DynamicPlaceholderId values as sequential integers across all components on a page. You cannot predict the ID before adding the component -- you must query for it.

2. **Parent must exist first:** You cannot add an AccordionDrawer before its parent Accordion exists. The placeholder path depends on the Accordion's dynamic ID.

3. **No batch child creation:** Each AccordionDrawer must be added individually with its own `add_component_on_page` call.

4. **Three-level nesting complexity:** Adding a Button inside an AccordionDrawer requires knowing both the Accordion's dynamic ID and the AccordionDrawer's dynamic ID. This means at minimum two `get_components_on_page` queries.

5. **Leading slash requirement:** All nested placeholder paths (anything below root `headless-main`) MUST have a leading slash. Omitting this is the most common authoring error.

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `AccordionDrawer_2`, `AccordionDrawer_Pricing` |
| Component not visible | Wrong placeholder path | Verify `/{parent}/accordion-{dynamicId}` format with leading slash |
| Drawer not in accordion | Missing placeholder segment | Ensure full path includes `/{parent}/accordion-{id}` |
| Drawer does not toggle | Missing AccordionProvider | AccordionDrawer must be inside an Accordion's placeholder |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |
| "Cannot find field" | Wrong field name | Field names are case-sensitive: `heading`, `body` |
| Buttons not appearing in drawer | Wrong three-level path | Must include both accordion and drawer dynamic IDs: `/{parent}/accordion-{accId}/buttons-{drawerId}` |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-pagebuilder` | Page creation and component placement |
| `/sitecore-author-link` | Link field XML formatting for Button children |
| `Accordion.md` | Parent component details and initial setup |
| `Button.md` | Button child component field details |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-17 | Initial documentation | Claude Code |
