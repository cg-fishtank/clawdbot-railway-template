# PersonaSwitcher Component

## Purpose
The PersonaSwitcher component renders a button in the navigation bar that opens a persona selection popup, allowing content authors and demo operators to simulate personalized visitor experiences on the site. It is a thin wrapper that delegates entirely to the `PersonaSwitcher` child component from `component-children/Navigation/PersonaSwitcher/PersonaSwitcher.tsx`. The child component reads the current editing mode from `useSitecore()` (`page.mode.isEditing`) to disable the popup trigger in the Experience Editor, and it integrates with the application's persona system via the `usePersona` hook. While personas are loading the component renders nothing; once loaded, clicking the button opens a `PersonaSelectionPopup` modal overlay.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `e1c34e3c-f878-46f1-8453-7cd18c796585` |
| **Component Name** | `PersonaSwitcher` |
| **Category** | `Navigation` |

## Fields
**Fields:** None — this is a system/demo component. It has no datasource and no Sitecore fields.

## Placeholders
**Placeholders:** None — this component does not expose any placeholders.

## JSS Field Component Mapping
This component has no JSS field bindings. Runtime data sources:

| Data | Source |
|------|--------|
| Persona loading state | `usePersona()` hook → `isLoading` |
| Editing mode | `useSitecore()` → `page.mode.isEditing` |
| Theme | `useFrame()` → `effectiveTheme` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Persona trigger button with popup; typically used in demo or authoring environments |

## Props Interface
```typescript
// From: src/components/Navigation/PersonaSwitcher/PersonaSwitcher.tsx
// The Default export takes no props:
export const Default = (): JSX.Element => {
  return <PersonaSwitcher />;
};

// From: src/component-children/Navigation/PersonaSwitcher/PersonaSwitcher.tsx
// The child component also takes no props:
export const PersonaSwitcher: React.FC = () => { ... };
```

## Example Content Entry
No content entry is required. This is a system/demo utility component with no datasource. It is typically placed inside the `tertiarynavcomponents` placeholder of a `TertiaryNav` component, visible only in non-production or demo environments.

## MCP Authoring Instructions

### Step 1: Add to Page (via TertiaryNav placeholder)
```javascript
await mcp__marketer_mcp__add_component_on_page({
  itemId: "<target-page-item-id>",
  renderingId: "e1c34e3c-f878-46f1-8453-7cd18c796585",
  placeholderName: "tertiarynavcomponents-{uid}",
  // No datasource required
});
```

### Notes
- This component is intended for **demo and authoring use only** and is typically hidden or removed in production deployments.
- The component renders `null` while the persona system is initializing (`personaLoading === true`).
- In Experience Editor (`page.mode.isEditing`), the popup is suppressed (button click is a no-op) to prevent disruption during editing.
- The `PersonaSelectionPopup` modal is rendered from `component-children/Persona/PersonaSelectionPopup` — ensure that component and the persona configuration are properly set up.
- Theme styling is inherited via the `useFrame()` hook (`effectiveTheme`), allowing it to adopt the secondary theme used inside the TertiaryNav/Header area.

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
