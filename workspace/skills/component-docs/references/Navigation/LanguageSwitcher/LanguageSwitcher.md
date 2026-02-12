# LanguageSwitcher Component

## Purpose

The LanguageSwitcher component provides a dropdown interface for users to switch between available site languages. It reads available languages from the application configuration (not CMS content) and handles navigation to the equivalent page in the selected language. This is a system component with no CMS-authored fields.

## Sitecore Template Requirements

### Data Source

**Important:** This component does NOT use a datasource or CMS fields. Language options are configured in the application code via `lib/i18n/i18n-config.ts`.

### Fields

None - This is a code-driven component.

## Configuration

### Available Languages

Languages are configured in the application code:

```typescript
// lib/i18n/i18n-config.ts
export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  // Add more languages as needed
];
```

### Adding a New Language

1. Add the language to Sitecore (System > Languages)
2. Create language versions of content items
3. Update `availableLanguages` array in the config file
4. Rebuild and deploy the application

## Component Props Interface

```typescript
// The component receives languages from configuration
type LanguageSwitcherProps = ComponentProps & {
  languages: Array<{
    code: string;
    name: string;
  }>;
};
```

## Content Authoring Instructions

### No CMS Configuration Required

The LanguageSwitcher is fully configured in code. Content authors do not need to create or configure any Sitecore items for this component.

### Ensuring Content Availability

For the language switcher to work properly:

1. **Create Language Versions:** Ensure pages have content in all supported languages
2. **Translate Content:** Provide localized content for each language version
3. **Publish Translations:** Publish all language versions

## Visual Layout

```
┌─────────────────┐
│ English ▼       │
├─────────────────┤
│ English      ✓  │
│ Français        │
│ Deutsch         │
└─────────────────┘
```

## Sitecore XM Cloud Specifics

### Language Setup

1. Navigate to System > Languages in Content Editor
2. Add required languages
3. Create language versions for content items

### Experience Editor Behavior

- **Not editable:** Component has no CMS fields
- **Language switching:** May not work in Experience Editor
- **Testing:** Test language switching in preview mode

## Authoring Rules

1. **Content Consistency:** Ensure all pages exist in all supported languages
2. **Translation Quality:** Provide proper translations, not auto-translated content
3. **Fallback Behavior:** Understand fallback behavior for missing translations

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Missing translations | Users see empty pages | Create all language versions |
| Incomplete config | Languages don't appear | Update i18n-config.ts |
| Unpublished content | 404 on language switch | Publish all versions |

## Related Components

- `Header` - Typically contains LanguageSwitcher in tertiarynav placeholder
- `TertiaryNav` - Often paired with LanguageSwitcher

---

## MCP Authoring Instructions

### Adding LanguageSwitcher to Page

Since this component has no datasource:

```javascript
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "language-switcher-rendering-id",
  placeholderPath: "tertiarynav-{dynamic-id}",  // Or tertiarynavcomponents
  componentItemName: "LanguageSwitcher_1",
  language: "en",
  fields: {}  // No fields to set
});
```

### Creating Language Versions of Content

To support the language switcher, create content in multiple languages:

```javascript
// Update page content in French
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "fr",  // French version
  fields: {
    "heading": "Bienvenue",
    "body": "<p>Contenu en français...</p>"
  }
});
```

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
