# Login Component

## Purpose
The Login component renders an authentication UI element in the site header, allowing users to sign in and view their account details. The component shell (`Default` / `LoginDefault`) first checks the `NEXT_PUBLIC_ENABLE_AUTH` environment variable via `isAuthEnabled()` — if authentication is disabled it returns `null` and logs an error. When auth is enabled it renders the child `Login` component, which uses `next-auth/react` (`useSession`, `signIn`, `signOut`) together with an Auth0 OAuth provider. The child rendering shows a "Log in" button for unauthenticated users, and for authenticated users shows the user's avatar and name with a dropdown drawer (`AuthDrawer`) providing links to account management and sign-out. Auth configuration (account page URL, sign-out redirect URL) is fetched server-side per site via `fetchAuthConfig` in `getComponentServerProps`.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `1b6ddc7a-d7cf-4137-8b2d-95d40de82d79` |
| **Component Name** | `Login` |
| **Category** | `Navigation` |

## Fields
**Fields:** None — this is a system component. Authentication state and configuration are managed through NextAuth.js session handling and server-side config fetching, not through Sitecore datasource fields.

## Placeholders
**Placeholders:** None — this component does not expose any placeholders.

## JSS Field Component Mapping
This component has no JSS field bindings. Runtime data sources:

| Data | Source |
|------|--------|
| Auth enabled | `process.env.NEXT_PUBLIC_ENABLE_AUTH` via `isAuthEnabled()` |
| Session / user info | `useSession()` from `next-auth/react` |
| Auth config (account/sign-out URLs) | `fetchAuthConfig(siteName)` called in `getComponentServerProps` |
| Site name | `layoutData.sitecore.context.site.name` from layout data |
| Editing mode | `useSitecore()` → `page.mode.isEditing` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Auth-gated login/account button; renders nothing if auth is disabled |

## Props Interface
```typescript
// From: src/components/Navigation/Login/Login.tsx

type LoginDefaultProps = {
  authConfig?: AuthConfig | null;
};

// From: src/component-children/Navigation/Login/Login.tsx

type LoginProps = {
  authConfig?: AuthConfig | null;
};

// AuthConfig (from lib/helpers/site-config-helpers):
// {
//   accountPageLink: string;   // URL for the account management page
//   signOutPageLink: string;   // URL to redirect to after sign-out
// }

type AuthCommonProps = {
  session: Session | null;
  isOpen: boolean;
  theme?: ThemeType;
};

type AuthButtonProps = AuthCommonProps & {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
```

## Example Content Entry
No content entry is required. This is a system/infrastructure component. It is typically placed inside the `tertiarynavcomponents` placeholder of a `TertiaryNav` component.

## MCP Authoring Instructions

### Step 1: Add to Page (via TertiaryNav placeholder)
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemId: "<target-page-item-id>",
  renderingId: "1b6ddc7a-d7cf-4137-8b2d-95d40de82d79",
  placeholderName: "tertiarynavcomponents-{uid}",
  // No datasource required
});
```

### Notes
- **Critical:** This component will render `null` and log a console error unless `NEXT_PUBLIC_ENABLE_AUTH=true` is set in the environment.
- Authentication uses Auth0 as the OAuth provider (hardcoded `'auth0'` provider string in `AuthButton`).
- The `AuthDrawer` links are driven by `authConfig.accountPageLink` and `authConfig.signOutPageLink`, which are fetched from Sitecore site configuration via `fetchAuthConfig`. If these are not configured, fallbacks of `/account` and `/` are used.
- In Experience Editor (`page.mode.isEditing`), the sign-in button is non-functional (click is suppressed) to prevent navigation away from the editor.
- The auth dropdown closes when the user clicks outside the component (`useClickOutside` hook).

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
