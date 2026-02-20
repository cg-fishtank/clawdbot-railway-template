# LanguageSwitcher Component

## Purpose
The LanguageSwitcher component renders a dropdown UI element that allows visitors to switch the site's active language. The main component shell (`Default`) wraps the rendering in a `Frame` and passes the application's configured `availableLanguages` list (from `lib/i18n/i18n-config`) down to the child `LanguageSwitcher` rendering component. The child component reads the current locale from `useSitecore()` (`page.locale`), displays the active language name as a toggle button, and shows a dropdown list of all available locales. Selecting a language calls a custom `/api/v1/language-switcher` API route to resolve the equivalent URL in the target language, then performs a Next.js router push followed by a page reload to ensure Sitecore Search and other locale-sensitive services receive the updated locale.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `0f8af5fd-1363-456c-bb35-65625e1ee354` |
| **Component Name** | `LanguageSwitcher` |
| **Category** | `Navigation` |

## Fields
**Fields:** None — this is a system component. All language data is sourced from the application's i18n configuration (`availableLanguages`) and the current Sitecore context (`page.locale`). No datasource fields are required.

## Placeholders
**Placeholders:** None — this component does not expose any placeholders.

## JSS Field Component Mapping
This component has no JSS field bindings. Data sources:

| Data | Source |
|------|--------|
| Current locale | `useSitecore()` → `page.locale` |
| Available languages | `availableLanguages` from `lib/i18n/i18n-config` |
| Language switch path | `/api/v1/language-switcher?destinationLanguage=&itemId=` API route |
| Current page item ID | `useSitecore()` → `page.layout.sitecore.route.itemId` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard language switcher toggle with dropdown list |

## Props Interface
```typescript
// From: src/components/Navigation/LanguageSwitcher/LanguageSwitcher.tsx
// (delegates immediately to the child component)

// Child: src/component-children/Navigation/LanguageSwitcher/LanguageSwitcher.tsx

type LanguageSwitcherLanguagesProps = {
  languages: string[];  // Array of locale codes, e.g. ["en", "fr-CA", "de-DE"]
};

type LanguageSwitcherProps = ComponentProps & LanguageSwitcherLanguagesProps;

type LanguageSwitcherToggleProps = {
  displayDropdown: boolean;
  contextLanguage: string;
  setDisplayDropdown: Dispatch<SetStateAction<boolean>>;
  theme?: ThemeType;
};

type LanguageSwitcherDropdownProps = {
  displayDropdown: boolean;
  contextLanguage: string;
  languages: string[];
  theme?: ThemeType;
};

type LanguageSwitcherItemProps = {
  locale: string;
  contextLanguage: string;
  languageName: string;
};
```

## Example Content Entry
No content entry is required. This is a system component that reads from application configuration. It is typically placed inside the `tertiarynavcomponents` placeholder of a `TertiaryNav` component.

## MCP Authoring Instructions

### Step 1: Add to Page (via TertiaryNav placeholder)
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemId: "<target-page-item-id>",
  renderingId: "0f8af5fd-1363-456c-bb35-65625e1ee354",
  placeholderName: "tertiarynavcomponents-{uid}",
  // No datasource required
});
```

### Notes
- This component requires `NEXT_PUBLIC_ENABLE_LANGUAGES` to be configured. If only one language is available, the switcher still renders but shows a single option.
- The `NEXT_PUBLIC_API_URL` environment variable must point to the Next.js API host so the `/api/v1/language-switcher` route can be called client-side.
- In Experience Editor (`page.mode.isEditing`), the dropdown toggle is disabled to prevent accidental navigation during editing.
- The dropdown closes automatically when the user clicks outside (`useClickOutside` hook) or when the locale changes.
- Language names are displayed using `getLanguageName()` which formats locale codes (e.g., `"en"` → `"English"`, `"fr-CA"` → `"French (Canada)"`).

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
