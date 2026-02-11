# Callout

## Purpose

The Callout component displays a highlighted content block with a distinctive left border accent. It includes a heading, body text, and an optional link rendered as a subtle text link with an arrow icon. The component is ideal for drawing attention to important information, quotes, or key points within page content without overwhelming the layout.

## Sitecore Configuration

### Template Path

`/sitecore/templates/Project/[Site]/Page Content/Callout`

### Data Source Location

`/sitecore/content/[Site]/Home/Data/Callouts/`

## Fields

| Field   | Sitecore Type | Required | Constraints                  | Description                              |
| ------- | ------------- | -------- | ---------------------------- | ---------------------------------------- |
| heading | Single-Line Text | Yes   | Max 100 characters           | Callout headline                         |
| body    | Rich Text     | Yes      | Basic formatting supported   | Main callout content                     |
| link    | General Link  | Yes      | Internal or External         | Action link with arrow icon              |

### Field Details

#### heading

- **Type:** Single-Line Text
- **Required:** Yes
- **Constraints:** Maximum 100 characters recommended
- **Guidance:** Create a clear, attention-grabbing headline that summarizes the callout's purpose.
- **Example:** `Important Update`

#### body

- **Type:** Rich Text
- **Required:** Yes
- **Constraints:** Supports basic formatting (bold, italic, lists, links)
- **Guidance:** Provide the key information or message. Keep it concise and focused.
- **Example:**
  ```html
  <p>Our annual maintenance window has been moved to accommodate holiday schedules. <strong>Please note the new date below.</strong></p>
  ```

#### link

- **Type:** General Link
- **Required:** Yes
- **Link Types:** Internal, External
- **Guidance:** Provide a clear action link. Displayed as text link with arrow icon.
- **Example:**
  ```json
  {
    "value": {
      "href": "/updates/maintenance-schedule",
      "text": "View Updated Schedule",
      "target": ""
    }
  }
  ```

## Rendering Parameters

| Parameter | Type     | Options                      | Default | Description                     |
| --------- | -------- | ---------------------------- | ------- | ------------------------------- |
| theme     | Droplist | primary, secondary, tertiary | primary | Callout background/border theme |

## Component Interface

```typescript
type CalloutFields = {
  heading: Field<string>;
  body: RichTextField;
  link: LinkField;
};

type CalloutProps = {
  fields: CalloutFields;
} & ComponentProps;
```

## JSS Field Mapping

| Field   | JSS Component                                | Usage                             |
| ------- | -------------------------------------------- | --------------------------------- |
| heading | `<Text tag="h2" field={fields.heading} />`   | Rendered with heading-2xl class   |
| body    | `<RichText field={fields.body} />`           | Rendered with richtext class      |
| link    | `<Button link={fields.link} variant="link" iconRight="arrow-right-long" />` | Text link with arrow |

## Content Examples

### Complete (All Fields Required)

```json
{
  "fields": {
    "heading": { "value": "Important Policy Update" },
    "body": { "value": "<p>Effective January 1st, our return policy will be updated to provide you with more flexibility. <strong>All purchases made after this date</strong> will qualify for the extended 60-day return window.</p>" },
    "link": {
      "value": {
        "href": "/policies/returns",
        "text": "Read Full Policy",
        "target": ""
      }
    }
  }
}
```

## Authoring Rules

1. **All fields required:** Unlike some components, the Callout requires heading, body, and link to display properly.
2. **Focused content:** Keep the callout focused on a single topic or announcement.
3. **Action-oriented link:** The link should lead to more detailed information or a relevant action.
4. **Visual hierarchy:** The callout's border accent draws attention—use sparingly to maintain impact.

## Common Mistakes

| Mistake                   | Why It's Wrong                               | Correct Approach                           |
| ------------------------- | -------------------------------------------- | ------------------------------------------ |
| Missing link field        | Link is visually expected in the design      | Always provide a link with descriptive text|
| Overusing callouts        | Diminishes the attention-drawing effect      | Use 1-2 per page maximum                   |
| Very long body content    | Callouts should be scannable                 | Keep to 2-3 sentences, link for details    |
| Generic link text         | "Click here" provides no context             | Use descriptive: "View Updated Policy"     |

## Related Components

- `CTABlock` - For more prominent call-to-action with button
- `AlertBanner` - For site-wide dismissable alerts
- `ContentBlock` - For detailed content with image

## Visual Layout

```
┌────────────────────────────────────────────────────┐
│ ▌                                                  │
│ ▌  Heading Text                                    │
│ ▌                                                  │
│ ▌  Body text content that provides important      │
│ ▌  information to the user...                     │
│ ▌                                                  │
│ ▌  Link Text →                                    │
│ ▌                                                  │
└────────────────────────────────────────────────────┘
```

The left border (▌) provides visual accent based on the theme color.

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the Callout component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the Callout rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "About Page"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add Callout to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "callout-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "Callout_1",
  language: "en",
  fields: {
    "heading": "Important Policy Update",
    "body": "<p>Effective January 1st, our return policy will be updated.</p>"
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
    "link": "<link linktype=\"internal\" url=\"/policies/returns\" text=\"Read Full Policy\" />"
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
  search_query: "Policies"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add Callout component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "callout-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "Callout_PolicyUpdate",
  language: "en",
  fields: {
    "heading": "Important Policy Update",
    "body": "<p>Effective January 1st, our return policy will be updated to provide you with more flexibility. <strong>All purchases made after this date</strong> will qualify for the extended 60-day return window.</p>"
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
    "link": "<link linktype=\"internal\" url=\"/policies/returns\" text=\"Read Full Policy\" />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: Callout with heading, body, and link
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field   | Type             | MCP Format                                              |
|:--------|:-----------------|:--------------------------------------------------------|
| heading | Single-Line Text | `"Plain text value"`                                    |
| body    | Rich Text        | `"<p>HTML content</p>"`                                 |
| link    | General Link     | `<link linktype="internal" url="/path" text="Text" />`  |

### MCP Authoring Checklist

Before authoring Callout via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have Callout rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `Callout_1`)
- [ ] All three fields (heading, body, link) are populated
- [ ] Link XML uses correct syntax with linktype attribute

### MCP Error Handling

| Error                 | Cause                    | Solution                                |
|:----------------------|:-------------------------|:----------------------------------------|
| "Item already exists" | Duplicate component name | Use unique suffix: `Callout_2`          |
| Component not visible | Wrong placeholder path   | Use `"headless-main"` without leading slash |
| Link not rendering    | Invalid XML format       | Verify linktype attribute and syntax    |
| Missing arrow icon    | Link variant issue       | Component handles variant automatically  |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
