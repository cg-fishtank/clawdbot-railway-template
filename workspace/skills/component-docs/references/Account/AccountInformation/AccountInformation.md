# AccountInformation Component

## Purpose

The AccountInformation component displays the authenticated user's profile information including their profile picture, name, email, account status, and membership date. It reads the page heading from the route context and retrieves user data from the NextAuth session. This component is used on account/profile pages to provide users with their account details.

## Sitecore Template Requirements

### Data Source

**Important:** This component reads fields from the **page/route context**, not from a component-level datasource. The `heading` field must be defined on the Page Template.

### Template Path

- **Page Template:** `/sitecore/templates/Project/[Site]/Pages/Account Page`
- **No separate datasource template** - uses page-level fields

### Fields

| Field Name | Sitecore Type    | Required | Description                      | Validation/Constraints            |
| ---------- | ---------------- | -------- | -------------------------------- | --------------------------------- |
| heading    | Single-Line Text | No       | Page heading displayed on the page | Recommended max 60 characters    |

## JSS Field Component Mapping

| Sitecore Field | JSS Component                                        | Import                                                |
| -------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| heading        | `<Text tag="h2" field={heading} className="..." />`  | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |

## Component Variants

The AccountInformation component exports 1 rendering variant:

| Variant | Export Name | Use Case                                     |
| ------- | ----------- | -------------------------------------------- |
| Default | `Default`   | Standard account information display page    |

## Content Authoring Instructions

### Field-by-Field Guidance

#### heading

- **What to enter:** The page title for the account information section
- **Tone/Style:** Clear, direct, user-focused
- **Character limit:** 60 characters recommended for best display
- **Example:** "My Account" or "Account Information"

### Content Guidelines

| Aspect      | Recommendation                                           |
| ----------- | -------------------------------------------------------- |
| Heading     | Keep concise and action-oriented                         |
| Tone        | Professional but friendly                                |
| Localization | Ensure heading is translated for multi-language sites  |

## Component Props Interface

```typescript
import { ComponentProps } from 'lib/component-props';

type AccountInformationProps = ComponentProps;

// The heading field comes from route context:
// CommonPageRouteFieldsType.heading: Field<string>
```

## Example Content Entry

### Page-Level Content (Account Page)

```json
{
  "fields": {
    "heading": { "value": "My Account" }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Account pages: `/sitecore/content/[Site]/Home/Account/`
- The `heading` field is edited directly on the account page item

### Experience Editor Behavior

- **Inline editable:** Yes - the heading can be edited directly in Experience Editor
- **Real-time preview:** Changes render immediately
- **Note:** User-specific data (name, email, image) comes from authentication session, not Sitecore

### Rendering Variant Selection

This component has only one variant (Default).

## Authentication Requirements

This component requires:

1. **NextAuth Configuration:** The site must have NextAuth properly configured
2. **Active Session:** User must be logged in to see their account details
3. **User Profile Data:** Session must include user's name, email, and optionally image

### Display States

| State           | Display                                        |
| --------------- | ---------------------------------------------- |
| Loading         | Shows "Loading..." message                     |
| Not Logged In   | Shows heading with "Account Requires Login"    |
| Logged In       | Shows full account information card            |

## Common Mistakes to Avoid

1. **Missing authentication setup:** Ensure NextAuth is properly configured for the site.

2. **Assuming Sitecore data:** User data (name, email, image) comes from the authentication provider, not Sitecore fields.

3. **Overly long headings:** Keep headings concise for mobile responsiveness.

4. **Missing translations:** If using multi-language, ensure the `t()` function translations are available for labels like "Account Status", "Active", and "Account Member Since".

## Related Components

- `LoginForm` - Component for user authentication
- `LogoutButton` - Component for logging out
- `ProfileCard` - Alternative profile display component

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the AccountInformation component using the Marketer MCP tools.

### Important: Route-Context Component

The AccountInformation component reads the `heading` field from the **page route context**, not from a component datasource. This means:

1. The `heading` field is authored on the **Account Page** itself
2. Adding the AccountInformation component to the page does not create a separate datasource
3. Content updates go to the page item, not a component datasource

### Step 1: Find or Create the Account Page

```javascript
// Search for existing account page
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Account"
});
const pageId = pageSearch.results[0].itemId;

// Or get page by path
const page = await mcp__marketer__get_content_item_by_path({
  itemPath: "/sitecore/content/Site/Home/Account"
});
```

### Step 2: Add AccountInformation Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "account-information-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "AccountInformation_1",
  language: "en",
  fields: {}  // No component-level fields
});
```

### Step 3: Update the Heading Field on the Page

Since `heading` is a page-level field, update it on the page item:

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,  // The page ID, not a datasource
  language: "en",
  fields: {
    "heading": "My Account"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find the account page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer__search_site({
  site_name: "main",
  search_query: "Account"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add AccountInformation component to the page
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "account-information-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "AccountInformation_Main",
  language: "en",
  fields: {}
});

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update the heading field on the page
// ═══════════════════════════════════════════════════════════════
await mcp__marketer__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "heading": "My Account"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: AccountInformation displays the page's heading
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field   | Type             | Location  | MCP Format         |
| :------ | :--------------- | :-------- | :----------------- |
| heading | Single-Line Text | Page item | `"Plain text value"` |

### MCP Authoring Checklist

Before authoring AccountInformation via MCP, verify:

- [ ] Have account page ID (from `mcp__marketer__search_site`)
- [ ] Have AccountInformation rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Update goes to page item, not datasource

### MCP Error Handling

| Error                  | Cause                     | Solution                                     |
| :--------------------- | :------------------------ | :------------------------------------------- |
| "Item already exists"  | Duplicate component name  | Use unique suffix: `AccountInformation_2`    |
| Component not visible  | Wrong placeholder path    | Use `"headless-main"` without leading slash  |
| Heading not showing    | Updated wrong item        | Ensure you're updating the page ID           |
| `updatedFields: {}`    | Normal response           | Update succeeded despite empty response      |

### Related Skills for MCP Authoring

| Skill                          | Purpose                            |
| :----------------------------- | :--------------------------------- |
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-pagebuilder`        | Page creation and component placement |

---

## Change Log

| Date       | Change                | Author      |
| ---------- | --------------------- | ----------- |
| 2026-02-09 | Initial documentation | Claude Code |
