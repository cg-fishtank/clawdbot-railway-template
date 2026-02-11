# CTABlock

## Purpose

The CTABlock component displays a contained call-to-action section with a heading, body text, and a prominent button. It renders within a bordered container with rounded corners, creating visual separation from surrounding content. The component is ideal for encouraging user actions like signing up, contacting sales, or navigating to key pages.

## Sitecore Configuration

### Template Path

`/sitecore/templates/Project/[Site]/Page Content/CTA Block`

### Data Source Location

`/sitecore/content/[Site]/Home/Data/CTA Blocks/`

## Fields

| Field   | Sitecore Type | Required | Constraints                  | Description                              |
| ------- | ------------- | -------- | ---------------------------- | ---------------------------------------- |
| heading | Single-Line Text | Yes   | Max 80 characters recommended| Main headline for the CTA                |
| body    | Rich Text     | No       | Keep concise, 1-2 sentences  | Supporting descriptive text              |
| link    | General Link  | No       | Internal or External         | Button destination and text              |

### Field Details

#### heading

- **Type:** Single-Line Text
- **Required:** Yes
- **Constraints:** Maximum 80 characters recommended for optimal display
- **Guidance:** Create a compelling, action-oriented headline that encourages users to engage.
- **Example:** `Ready to Get Started?`

#### body

- **Type:** Rich Text
- **Required:** No
- **Constraints:** Keep to 1-2 sentences; basic formatting only
- **Guidance:** Provide brief supporting context. Avoid lengthy descriptions—let the button be the focus.
- **Example:**
  ```html
  <p>Join thousands of customers who trust our platform for their business needs.</p>
  ```

#### link

- **Type:** General Link
- **Required:** No
- **Link Types:** Internal, External
- **Guidance:** Use clear, action-oriented link text. Keep it short (2-4 words).
- **Example:**
  ```json
  {
    "value": {
      "href": "/signup",
      "text": "Start Free Trial",
      "target": ""
    }
  }
  ```

## Rendering Parameters

| Parameter | Type     | Options                      | Default | Description                     |
| --------- | -------- | ---------------------------- | ------- | ------------------------------- |
| theme     | Droplist | primary, secondary, tertiary | primary | Container background/text theme |

## Component Interface

```typescript
type CTABlockFields = {
  heading: Field<string>;
  body?: Field<string>;
  link?: LinkField;
};

export type CTABlockProps = ComponentProps & {
  fields: CTABlockFields;
};
```

## JSS Field Mapping

| Field   | JSS Component                              | Usage                          |
| ------- | ------------------------------------------ | ------------------------------ |
| heading | `<Text field={fields?.heading} tag="h2" />` | Rendered as heading-2xl h2    |
| body    | `<RichText field={fields?.body} />`        | Rendered with richtext class   |
| link    | `<Button link={fields?.link} />`           | Rendered as solid button       |

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "heading": { "value": "Get Started Today" }
  }
}
```

### Complete (All Fields)

```json
{
  "fields": {
    "heading": { "value": "Ready to Transform Your Business?" },
    "body": { "value": "<p>Schedule a personalized demo with our team and discover how our platform can drive results.</p>" },
    "link": {
      "value": {
        "href": "/contact/demo",
        "text": "Schedule Demo",
        "target": "",
        "title": "Request a product demonstration"
      }
    }
  }
}
```

## Authoring Rules

1. **Strong headline:** Lead with a compelling question or action-oriented statement.
2. **Brief body:** Keep supporting text to 1-2 sentences maximum. The CTA should be quickly scannable.
3. **Clear button text:** Use action verbs like "Get Started", "Learn More", "Contact Us", "Try Free".
4. **Single focus:** Each CTABlock should have one clear action. Don't try to do too much.

## Common Mistakes

| Mistake                   | Why It's Wrong                               | Correct Approach                           |
| ------------------------- | -------------------------------------------- | ------------------------------------------ |
| Long body paragraphs      | CTAs should be quick to scan                 | Limit to 1-2 concise sentences             |
| Generic "Click here" text | Poor accessibility and conversion            | Use specific action text: "Start Trial"    |
| Missing link field        | CTA without action defeats the purpose       | Always include a link for primary action   |
| Passive headline          | Doesn't encourage action                     | Use active voice: "Start Saving Today"     |

## Related Components

- `CTACard` - Card variant with image, heading, body, and button placeholder
- `Callout` - Left-bordered highlight block for inline content emphasis
- `ContentBlock` - Content section with image and button placeholder
- `Button` - Standalone button component for placeholders

## Visual Layout

```
┌────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────┐  │
│  │                                              │  │
│  │  Heading Text                    [  Button  ]│  │
│  │  Body text goes here...                      │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

On mobile, the layout stacks vertically with centered content.

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the CTABlock component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the CTABlock rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Landing Page"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add CTABlock to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "ctablock-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "CTABlock_1",
  language: "en",
  fields: {
    "heading": "Ready to Get Started?",
    "body": "<p>Join thousands of satisfied customers today.</p>"
  }
});

const datasourceId = result.datasourceId;
```

### Step 3: Update Link Field

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "link": "<link linktype=\"internal\" url=\"/signup\" text=\"Start Free Trial\" />"
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
  search_query: "Products"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add CTABlock component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "ctablock-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "CTABlock_Demo",
  language: "en",
  fields: {
    "heading": "Ready to Transform Your Business?",
    "body": "<p>Schedule a personalized demo with our team.</p>"
  }
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update link field
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "link": "<link linktype=\"internal\" url=\"/contact/demo\" text=\"Schedule Demo\" />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: CTABlock with heading, body, and button
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field   | Type             | MCP Format                                              |
|:--------|:-----------------|:--------------------------------------------------------|
| heading | Single-Line Text | `"Plain text value"`                                    |
| body    | Rich Text        | `"<p>HTML content</p>"`                                 |
| link    | General Link     | `<link linktype="internal" url="/path" text="Text" />`  |

### MCP Authoring Checklist

Before authoring CTABlock via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have CTABlock rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `CTABlock_1`)
- [ ] Link XML uses correct syntax with linktype attribute

### MCP Error Handling

| Error                 | Cause                    | Solution                                |
|:----------------------|:-------------------------|:----------------------------------------|
| "Item already exists" | Duplicate component name | Use unique suffix: `CTABlock_2`         |
| Component not visible | Wrong placeholder path   | Use `"headless-main"` without leading slash |
| Link not rendering    | Invalid XML format       | Verify linktype attribute and syntax    |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
