# Button

## Purpose

The Button component renders a single call-to-action button or link within page content. It supports multiple visual styles (solid button or outline) and intelligently adapts its color based on the parent component's theme. The component is designed to be placed within component placeholders (e.g., CTABlock, ContentBlock, CTACard) to provide clickable actions.

## Sitecore Configuration

### Template Path

`/sitecore/templates/Project/[Site]/Page Content/Button`

### Data Source Location

`/sitecore/content/[Site]/Home/Data/Buttons/`

## Fields

| Field | Sitecore Type | Required | Constraints                       | Description                              |
| ----- | ------------- | -------- | --------------------------------- | ---------------------------------------- |
| link  | General Link  | Yes      | Internal, External, or Media link | The destination URL and display text     |

### Field Details

#### link

- **Type:** General Link
- **Required:** Yes
- **Link Types:** Internal, External, Media, Anchor
- **Guidance:** Use internal links for site pages, external links for off-site destinations. Always provide descriptive link text.
- **Example:**
  ```json
  {
    "value": {
      "href": "/products/overview",
      "text": "Learn More",
      "target": "",
      "title": "View our product overview"
    }
  }
  ```

## Rendering Parameters

| Parameter        | Type     | Options                      | Default | Description                              |
| ---------------- | -------- | ---------------------------- | ------- | ---------------------------------------- |
| theme            | Droplist | primary, secondary, tertiary | (auto)  | Button color override                    |
| outline          | Checkbox | true, false                  | false   | Use outline style instead of solid       |
| contentAlignment | Droplist | left, center, right          | left    | Button alignment within container        |

## Component Interface

```typescript
type ButtonFields = {
  link: LinkField;
};

type ButtonProps = ComponentProps & {
  fields: ButtonFields;
  params?: {
    styles?: string[] | string;
    className?: string;
    [key: string]: string | string[] | undefined;
  };
};
```

## JSS Field Mapping

| Field | JSS Component                                        | Usage                           |
| ----- | ---------------------------------------------------- | ------------------------------- |
| link  | `<Button link={fields.link} variant={type} color={buttonColor} />` | Renders as anchor with styling |

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "link": {
      "value": {
        "href": "/contact",
        "text": "Contact Us"
      }
    }
  }
}
```

### Complete (All Fields)

```json
{
  "fields": {
    "link": {
      "value": {
        "href": "https://example.com/demo",
        "text": "Request a Demo",
        "target": "_blank",
        "title": "Opens in a new window"
      }
    }
  }
}
```

## Authoring Rules

1. **Descriptive link text:** Never use "Click here" or "Read more" alone. Use action-oriented text that describes the destination.
2. **External links:** Set `target="_blank"` for external links and include a title indicating the new window behavior.
3. **Color inheritance:** Leave theme empty to let the button auto-select a contrasting color based on its parent.
4. **One action per button:** Each Button component should represent a single, clear action.

## Common Mistakes

| Mistake                    | Why It's Wrong                                  | Correct Approach                              |
| -------------------------- | ----------------------------------------------- | --------------------------------------------- |
| Generic link text          | Poor accessibility and UX                       | Use descriptive text: "View Product Details"  |
| Missing target for external| Unexpected navigation behavior                  | Add `target="_blank"` for external links      |
| Forcing theme color        | May clash with parent container                 | Let auto-color logic work when possible       |
| Empty link href            | Creates invalid links                           | Always provide a valid destination            |

## Related Components

- `CTABlock` - Contains Button in its placeholder
- `CTACard` - Contains Button in its buttons placeholder
- `ContentBlock` - Contains Button in its buttons placeholder
- `Callout` - Has its own integrated link, doesn't use Button

## Smart Color Logic

The Button component automatically selects contrasting colors:

1. If `theme` is explicitly set by author → use that theme
2. If parent uses light theme (primary/tertiary) → button defaults to dark (secondary)
3. If parent uses dark theme (secondary) → button defaults to yellow (tertiary)
4. Otherwise → fallback to primary

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the Button component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the parent component's placeholder path
2. Have the Button rendering ID from the component manifest
3. Know the dynamic placeholder key (typically `buttons`)

### Step 1: Identify the Parent Placeholder

Buttons are typically added to component placeholders. The placeholder path follows the pattern:
```
headless-main/[parent-component-uid]-buttons
```

### Step 2: Add Button to Parent Component

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "button-rendering-id",
  placeholderPath: "headless-main/contentblock-123-buttons",
  componentItemName: "Button_LearnMore",
  language: "en",
  fields: {}
});

const datasourceId = result.datasourceId;
```

### Step 3: Update Link Field

Link fields require XML format:

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "link": "<link linktype=\"internal\" url=\"/products/overview\" text=\"Learn More\" />"
  }
});
```

**Link Field Formats:**

```xml
<!-- Internal link -->
<link linktype="internal" url="/page-path" text="Link Text" />

<!-- External link -->
<link linktype="external" url="https://example.com" text="Link Text" target="_blank" />

<!-- Internal link by ID -->
<link linktype="internal" id="{PAGE-GUID}" text="Link Text" />
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page with parent component
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Products Page"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add Button to parent component's placeholder
// ═══════════════════════════════════════════════════════════════
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "button-rendering-id",
  placeholderPath: "headless-main/ctablock-abc123-buttons",
  componentItemName: "Button_CTA",
  language: "en",
  fields: {}
});

const datasourceId = result.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update link field
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "link": "<link linktype=\"internal\" url=\"/contact\" text=\"Contact Us\" />"
  }
});
```

### Field Type Quick Reference

| Field | Type         | MCP Format                                              |
|:------|:-------------|:--------------------------------------------------------|
| link  | General Link | `<link linktype="internal" url="/path" text="Text" />` |

### MCP Authoring Checklist

Before authoring Button via MCP, verify:

- [ ] Have parent component's placeholder path
- [ ] Have Button rendering ID (from component manifest)
- [ ] Placeholder path includes parent component UID suffix
- [ ] Link XML uses correct linktype attribute

### MCP Error Handling

| Error                   | Cause                         | Solution                                    |
|:------------------------|:------------------------------|:--------------------------------------------|
| "Invalid placeholder"   | Wrong placeholder path        | Get parent UID and construct path correctly |
| Link not rendering      | Invalid XML format            | Verify linktype and attribute syntax        |
| Button in wrong location| Placeholder path mismatch     | Check parent component's placeholder key    |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
