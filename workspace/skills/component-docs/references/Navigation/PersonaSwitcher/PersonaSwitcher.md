# PersonaSwitcher Component

## Purpose

The PersonaSwitcher component provides a UI for switching between different visitor personas, typically used for demonstrating personalization features in Sitecore. It allows users to simulate different audience segments to see how personalized content changes. This is a system/demo component with no CMS-authored fields.

## Sitecore Template Requirements

### Data Source

**Important:** This component does NOT use a datasource or CMS fields. Persona definitions are managed in code or fetched from Sitecore's personalization system.

### Fields

None - This is a code-driven component.

## Configuration

The PersonaSwitcher component is implemented in:
- `component-children/Navigation/PersonaSwitcher/PersonaSwitcher.tsx`

Personas are typically defined based on:
- Sitecore personalization rules
- Marketing automation segments
- Custom persona definitions in code

## Component Props Interface

```typescript
// No props required - component manages its own state
const PersonaSwitcher: React.FC = () => {
  return <PersonaSwitcher />;
};
```

## Content Authoring Instructions

### No CMS Configuration Required

The PersonaSwitcher is fully configured in code. Content authors do not need to create or configure any Sitecore items for this component.

### Setting Up Personalization

To leverage the PersonaSwitcher effectively:

1. **Define Personas:** Configure personas in Sitecore's Marketing Control Panel
2. **Create Rules:** Set up personalization rules on components
3. **Create Variants:** Create personalized content variants
4. **Test with Switcher:** Use PersonaSwitcher to preview different experiences

## Visual Layout

```
┌────────────────────────┐
│  Persona: Default  ▼   │
├────────────────────────┤
│  ○ Default             │
│  ○ Business User       │
│  ○ Developer           │
│  ○ Marketing Manager   │
└────────────────────────┘
```

## Sitecore XM Cloud Specifics

### Personalization Setup

1. Navigate to Marketing Control Panel
2. Define visitor personas and segments
3. Set up personalization rules on components
4. Create personalized content variants

### Experience Editor Behavior

- **Persona simulation:** May work in Experience Editor for preview
- **Testing:** Full testing recommended in preview mode
- **Production:** Often hidden in production via conditional rendering

### Use Cases

| Scenario | Description |
|----------|-------------|
| Demo environments | Show personalization capabilities |
| Content preview | Preview content for different audiences |
| QA testing | Verify personalization rules work correctly |
| Training | Teach content authors about personalization |

## Authoring Rules

1. **Demo Only:** Consider hiding in production environments
2. **Placement:** Place in header/utility area for easy access
3. **Persona Alignment:** Ensure personas match marketing definitions

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| No personas defined | Switcher has no options | Define personas in Sitecore |
| Left in production | Confuses real users | Conditionally hide in prod |
| No personalized content | Switching has no effect | Create personalized variants |

## Related Components

- `Header` - May contain PersonaSwitcher in tertiary nav
- `TertiaryNav` - Placeholder for PersonaSwitcher
- `Login` - Related user/session component

---

## MCP Authoring Instructions

### Adding PersonaSwitcher to Page

Since this component has no datasource:

```javascript
await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "persona-switcher-rendering-id",
  placeholderPath: "tertiarynavcomponents-{dynamic-id}",
  componentItemName: "PersonaSwitcher_1",
  language: "en",
  fields: {}  // No fields to set
});
```

### Setting Up Personalization Rules

After adding PersonaSwitcher, set up personalization on content:

1. Edit a component in Sitecore
2. Add personalization rules
3. Create variants for different personas
4. Test using PersonaSwitcher

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
