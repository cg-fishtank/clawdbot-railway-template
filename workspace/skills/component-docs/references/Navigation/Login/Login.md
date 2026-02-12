# Login Component

## Purpose

The Login component provides user authentication functionality, displaying login/logout states and user information. It integrates with the application's authentication system (when enabled) and renders nothing if authentication is not configured. This is a system component with no CMS-authored fields.

## Sitecore Template Requirements

### Data Source

**Important:** This component does NOT use a datasource or CMS fields. Authentication behavior is controlled by environment configuration.

### Fields

None - This is a code-driven component.

## Configuration

### Authentication Setup

Authentication is controlled by environment variables:

```env
NEXT_PUBLIC_ENABLE_AUTH=true
```

When `NEXT_PUBLIC_ENABLE_AUTH` is not set or set to `false`, the component renders nothing and logs an error.

### Authentication Provider

The actual authentication logic is implemented in:
- `component-children/Navigation/Login/Login.tsx` - UI rendering
- `lib/helpers/auth.ts` - Authentication helpers

## Component Props Interface

```typescript
// No props required - component uses authentication context
const LoginDefault: React.FC = () => {
  if (!isAuthEnabled()) {
    console.error('Auth is not enabled...');
    return null;
  }
  return <Login />;
};
```

## Content Authoring Instructions

### No CMS Configuration Required

The Login component is fully configured in code and environment variables. Content authors do not need to create or configure any Sitecore items.

### Placement

The Login component is typically placed in:
- Header's `tertiarynav` placeholder
- TertiaryNav's `tertiarynavcomponents` placeholder

## Visual Layout

### Logged Out State
```
┌─────────────────┐
│  [Login]        │
└─────────────────┘
```

### Logged In State
```
┌─────────────────────────┐
│  Welcome, John  [▼]     │
│  ├── Profile            │
│  └── Logout             │
└─────────────────────────┘
```

## Sitecore XM Cloud Specifics

### Experience Editor Behavior

- **Not editable:** Component has no CMS fields
- **Authentication state:** May not reflect actual auth state in editing mode
- **Testing:** Test authentication flows in preview/live mode

### Partial Design Placement

Add to partial designs that include the header:

1. Select the header/tertiary nav area
2. Add Login component to appropriate placeholder
3. Publish partial design

## Authoring Rules

1. **Environment Config:** Ensure auth is properly configured in deployment
2. **Placeholder Position:** Place consistently across all pages
3. **Styling Consistency:** Works with header's theme

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Auth not enabled | Component doesn't render | Set NEXT_PUBLIC_ENABLE_AUTH=true |
| Wrong placeholder | Component misaligned | Use tertiarynav placeholder |
| Missing auth config | Login fails | Configure full auth stack |

## Related Components

- `Header` - Parent component containing Login in placeholder
- `TertiaryNav` - Often contains Login component
- `PersonaSwitcher` - Alternative/complementary user component

---

## MCP Authoring Instructions

### Adding Login to Page

Since this component has no datasource:

```javascript
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "login-rendering-id",
  placeholderPath: "tertiarynavcomponents-{dynamic-id}",
  componentItemName: "Login_1",
  language: "en",
  fields: {}  // No fields to set
});
```

### Prerequisites

Before the Login component will work:

1. Set `NEXT_PUBLIC_ENABLE_AUTH=true` in environment
2. Configure authentication provider (OAuth, OIDC, etc.)
3. Deploy with authentication enabled

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
