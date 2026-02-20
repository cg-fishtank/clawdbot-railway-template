# AccountInformation Component

## Purpose
The AccountInformation component displays the authenticated user's profile information, including their name, email address, profile picture, account status, and membership date. It reads the page heading from the route-level `heading` field (not a component datasource), and conditionally renders based on the NextAuth session state — showing a loading state, a login-required message, or the full profile card depending on authentication status.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `3bde46c0-0eab-4523-b7e3-7831c010cac6` |
| **Component Name** | `AccountInformation` |
| **Category** | `Account` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `heading` | Single-Line Text | No | Page-level heading displayed above the account card (and as a fallback prompt when unauthenticated) | Read from the **route fields** (`page.layout.sitecore.route.fields`), not from a component datasource |

> **Important:** This is a route context component. It does not use a component datasource. The `heading` field must be authored on the Sitecore page item itself, not on a separate datasource item.

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` (route field) | `<Text>` | `import { Text, useSitecore } from '@sitecore-content-sdk/nextjs'` |

> Route fields are accessed via `useSitecore()` → `page.layout.sitecore.route.fields`, cast to `CommonPageRouteFieldsType`.

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Single variant; renders loading state, unauthenticated state, or full profile card based on NextAuth session |

## Props Interface
```typescript
// AccountInformation uses the base ComponentProps with no additional fields.
// Fields are sourced from route context, not the component datasource.
type AccountInformationProps = ComponentProps;

// Route fields are accessed at runtime via useSitecore():
// const { page } = useSitecore();
// const routeFields = page?.layout?.sitecore?.route?.fields as CommonPageRouteFieldsType;
// const { heading } = routeFields;
```

## Session-Driven Render States

| State | Condition | Rendered Output |
|-------|-----------|----------------|
| Loading | `status === 'loading'` | Spinner/loading message inside a `ContainedWrapper` |
| Unauthenticated | `!session` | Route `heading` field + "Account Requires Login" message |
| Authenticated | `session` exists | Full profile card with avatar, name, email, account status, and member-since date |

## Example Content Entry

### Minimum Viable Content
No datasource fields are required. The component reads from the route item. Ensure the page item has a `heading` field:

```json
{
  "route": {
    "fields": {
      "heading": {
        "value": "My Account"
      }
    }
  }
}
```

### Full Content Example
```json
{
  "componentName": "AccountInformation",
  "uid": "3bde46c0-0eab-4523-b7e3-7831c010cac6",
  "params": {},
  "fields": {}
}
```

```json
{
  "route": {
    "name": "account",
    "displayName": "My Account",
    "fields": {
      "heading": {
        "value": "My Account"
      }
    }
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
Because AccountInformation does not use a datasource, simply add the rendering to the page. No datasource selection is needed.

```json
{
  "tool": "add_component",
  "params": {
    "route": "/en/account",
    "renderingId": "3bde46c0-0eab-4523-b7e3-7831c010cac6",
    "placeholder": "main",
    "fields": {}
  }
}
```

### Step 2: Set the page heading
The `heading` field must be set on the page item (route), not on the component. Use the MCP `update_page_fields` tool or the Sitecore Content Editor to set the heading on the account page item:

```json
{
  "tool": "update_item_fields",
  "params": {
    "itemPath": "/sitecore/content/your-site/account",
    "fields": {
      "heading": "My Account"
    }
  }
}
```

### Step 3: Ensure authentication is configured
This component depends on `next-auth` session management. The `useSession()` hook must be available (i.e., the app must be wrapped in a NextAuth `SessionProvider`). No Sitecore-side configuration is needed for this behavior.

### Field Type Quick Reference
| Field | Type | MCP Format | Source |
|-------|------|-----------|--------|
| `heading` | Single-Line Text | Plain string: `"My Account"` | Route item field (not datasource) |

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
