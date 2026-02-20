# AlertBanner Component

## Purpose
AlertBanner displays a full-width, dismissible notification banner fetched from a dedicated API endpoint at runtime. It supports three visual categories (default, warning, information) and persists dismissed state in `sessionStorage` so the banner does not reappear within the same browser session. In Experience Editor mode it renders a static edit placeholder (`AlertBannerEditRendering`) instead of making the live API call, preventing accidental live-data fetches during authoring.

The rendering logic is split between the page-level entry point (`components/Page Content/AlertBanner/AlertBanner.tsx`) and the reusable child components (`component-children/Page Content/AlertBanner/AlertBanner.tsx`), which export `AlertBanner`, `AlertBannerEditRendering`, and `fetchAlertBannerData`. Data is resolved server-side via `getComponentServerProps`, which reads the `ALERT_BANNER_FOLDER_ID` environment variable and passes the folder item ID as `datasourceId`.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `e47956bb-0dd7-47fa-a28c-2c9b3358c0f9` |
| **Component Name** | `AlertBanner` |
| **Category** | `Page Content` |

## Fields
| Field Name | Sitecore Type | Required | Description |
|------------|--------------|----------|-------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Bold headline text displayed in the banner |
| `body` | Rich Text (`Field<string>`) | No | Supporting rich-text body content shown alongside the heading |
| `alertCategory` | Droplist (`Field<AlertCategoryType>`) | No | Controls banner colour: `default` (surface), `warning` (red tint), `information` (blue tint) |

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `body` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Standard full-width alert banner rendered at the top of a page |

## Props Interface
```typescript
export type AlertBannerFields = {
  id: string;
  heading: QueryField;           // { jsonValue: { value: string } }
  body: QueryField;              // { jsonValue: { value: string } }
  alertCategory?: Field<'warning' | 'information' | 'default'>;
};

export type AlertBannerComponentProps = ComponentProps & {
  datasourceId?: string;         // Injected by getComponentServerProps
  layoutData?: LayoutServiceData;
  storageKey?: string;
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "fields": {
    "heading": { "value": "Site maintenance scheduled for Saturday" }
  }
}
```

### Full Content Example
```json
{
  "fields": {
    "heading": { "value": "Important: System maintenance window" },
    "body": { "value": "<p>Services will be unavailable <strong>Saturday 2–4 AM EST</strong>.</p>" },
    "alertCategory": { "value": "warning" }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
```javascript
await mcp__marketer-mcp__add_component_on_page({
  itemId: "<page-item-id>",
  renderingId: "e47956bb-0dd7-47fa-a28c-2c9b3358c0f9",
  placeholderName: "<target-placeholder>",
  datasource: "<alert-banner-datasource-item-id>"
});
```

### Step 2: Set Fields on Datasource Item
```javascript
// Set heading
await mcp__marketer-mcp__edit_item_fields({
  itemId: "<alert-banner-datasource-item-id>",
  fields: {
    "heading": "Site maintenance scheduled",
    "body": "<p>Details about the maintenance window.</p>",
    "alertCategory": "warning"
  }
});
```

### Field Type Quick Reference
| Field | Type | MCP Format |
|-------|------|-----------|
| `heading` | Single-Line Text | Plain string |
| `body` | Rich Text | HTML string |
| `alertCategory` | Droplist | `"default"` \| `"warning"` \| `"information"` |

> **Note:** The `ALERT_BANNER_FOLDER_ID` environment variable must point to the Sitecore folder item that contains the active AlertBanner datasource. The banner is fetched client-side via `/api/v1/alert-banner`; no banner renders if the API returns empty data.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
