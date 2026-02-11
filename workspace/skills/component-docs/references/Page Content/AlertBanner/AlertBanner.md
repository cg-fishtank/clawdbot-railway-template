# AlertBanner

## Purpose

The AlertBanner component displays a dismissable site-wide alert banner at the top of pages. It features a heading, body text, and an optional category that determines the color theme (warning, information, or default). Users can dismiss the banner, and the dismissed state is persisted in session storage. The component fetches its data via an API call, making it suitable for centrally managed site alerts.

## Sitecore Configuration

### Template Path

`/sitecore/templates/Project/[Site]/Page Content/Alert Banner`

### Data Source Location

`/sitecore/content/[Site]/Home/Data/Alert Banners/`

## Fields

| Field         | Sitecore Type    | Required | Constraints                          | Description                              |
| ------------- | ---------------- | -------- | ------------------------------------ | ---------------------------------------- |
| heading       | Single-Line Text | Yes      | Max 100 characters recommended       | Main alert heading displayed prominently |
| body          | Rich Text        | Yes      | Basic formatting only                | Supporting message content               |
| alertCategory | Droplist         | No       | warning, information, default        | Determines banner color theme            |

### Field Details

#### heading

- **Type:** Single-Line Text
- **Required:** Yes
- **Constraints:** Maximum 100 characters recommended for single-line display
- **Guidance:** Keep the heading concise and action-oriented. Should clearly communicate the alert type.
- **Example:** `Site Maintenance Scheduled`

#### body

- **Type:** Rich Text
- **Required:** Yes
- **Constraints:** Keep content brief for banner display; avoid complex formatting
- **Guidance:** Provide supporting details about the alert. Use simple formatting only (bold, italic, links).
- **Example:**
  ```html
  <p>Our systems will be unavailable on Saturday from 2-4 AM EST. <a href="/maintenance">Learn more</a></p>
  ```

#### alertCategory

- **Type:** Droplist
- **Required:** No
- **Options:** `warning`, `information`, `default`
- **Default:** `default`
- **Guidance:** Choose based on alert severity - warning for urgent issues, information for general notices, default for neutral announcements.
- **Example:** `warning`

## Rendering Parameters

| Parameter | Type     | Options                               | Default   | Description                |
| --------- | -------- | ------------------------------------- | --------- | -------------------------- |
| theme     | Droplist | primary, secondary, tertiary          | primary   | Base color theme           |
| padding   | Droplist | none, xs, sm, md, lg, xl              | none      | Vertical padding           |

## Component Interface

```typescript
export type AlertBannerFields = {
  id: string;
  heading: QueryField;
  body: QueryField;
  alertCategory?: Field<AlertCategoryType>;
};

export type AlertBannerComponentProps = ComponentProps & {
  datasourceId?: string;
  layoutData?: LayoutServiceData;
  storageKey?: string;
};

type AlertCategoryType = 'warning' | 'information' | 'default';
```

## JSS Field Mapping

| Field         | JSS Component                                  | Usage                      |
| ------------- | ---------------------------------------------- | -------------------------- |
| heading       | `<Text field={fields?.heading?.jsonValue} />`  | Displayed as h1 with bold  |
| body          | `<RichText field={fields?.body?.jsonValue} />` | Displayed as body text     |
| alertCategory | Used for CSS class selection                   | Determines banner color    |

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "heading": { "value": "System Update" },
    "body": { "value": "<p>A new version is available.</p>" }
  }
}
```

### Complete (All Fields)

```json
{
  "fields": {
    "heading": { "value": "Scheduled Maintenance Notice" },
    "body": { "value": "<p>Our services will be temporarily unavailable on Saturday, March 15 from 2:00 AM to 4:00 AM EST for scheduled maintenance. <a href=\"/maintenance-info\">Learn more</a></p>" },
    "alertCategory": { "value": "warning" }
  }
}
```

## Authoring Rules

1. **Keep it brief:** Alert banners should be scannable. Limit heading to a few words and body to 1-2 sentences.
2. **Use appropriate category:** Match the alertCategory to the urgency - warning (red) for critical issues, information (blue) for updates.
3. **Include action links:** When relevant, include a link in the body for users to learn more or take action.
4. **Session persistence:** Dismissed banners stay hidden for the user's session but reappear on new sessions.

## Common Mistakes

| Mistake                      | Why It's Wrong                                    | Correct Approach                              |
| ---------------------------- | ------------------------------------------------- | --------------------------------------------- |
| Long body content            | Banners should be quick to read                   | Keep to 1-2 sentences, link for details       |
| Missing action link          | Users need to know what to do                     | Include a "Learn more" or action link         |
| Using warning for non-urgent | Dilutes the meaning of warning colors             | Reserve warning for truly urgent items        |
| HTML formatting in heading   | Heading renders as plain text                     | Use body field for any HTML formatting        |

## Related Components

- `HeroBanner` - For promotional content, not alerts
- `ContentBanner` - For page-level hero sections
- `Callout` - For inline highlighted content within page body

## Special Behavior

### API-Driven Content

The AlertBanner fetches content via API (`/api/v1/alert-banner`) rather than directly from the datasource. This allows for:
- Centralized alert management across pages
- Dynamic content updates without page republishing
- Environment-based alert folder configuration via `ALERT_BANNER_FOLDER_ID`

### Dismissal Persistence

- Dismissed banners are stored in `sessionStorage` with key `alert-banner-{id}`
- Dismissal state persists only for the current browser session
- New sessions will show the banner again

### Experience Editor

In Experience Editor, a placeholder rendering is displayed instead of the API-driven content, allowing authors to see the component placement.

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the AlertBanner component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer__search_site`)
2. Have the AlertBanner rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)

### Step 1: Find the Target Page

```javascript
// Search for the page where AlertBanner will be added
await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Page Name"
});
// Returns: { itemId: "page-guid", name: "PageName", path: "/sitecore/..." }
```

### Step 2: Add AlertBanner to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "alert-banner-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "AlertBanner_1",
  language: "en",
  fields: {
    "heading": "System Maintenance Notice",
    "body": "<p>Our services will be unavailable on Saturday from 2-4 AM EST.</p>",
    "alertCategory": "warning"
  }
});
```

### Field Type Quick Reference

| Field         | Type             | MCP Format                    |
|:--------------|:-----------------|:------------------------------|
| heading       | Single-Line Text | `"Plain text value"`          |
| body          | Rich Text        | `"<p>HTML content</p>"`       |
| alertCategory | Droplist         | `"warning"` or `"information"` or `"default"` |

### MCP Authoring Checklist

Before authoring AlertBanner via MCP, verify:

- [ ] Have page ID (from `mcp__marketer__search_site`)
- [ ] Have AlertBanner rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `AlertBanner_1`)

### MCP Error Handling

| Error                 | Cause                    | Solution                               |
|:----------------------|:-------------------------|:---------------------------------------|
| "Item already exists" | Duplicate component name | Use unique suffix: `AlertBanner_2`     |
| Component not visible | Wrong placeholder path   | Use `"headless-main"` without leading slash |
| `updatedFields: {}`   | Normal response          | Update succeeded despite empty response |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
