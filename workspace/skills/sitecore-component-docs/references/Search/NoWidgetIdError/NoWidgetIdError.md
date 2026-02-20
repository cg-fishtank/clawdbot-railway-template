# NoWidgetIdError Component

## Purpose
A shared error-indicator component used by all Search widget components. It renders a red warning message ("No widget id configured") inside the standard `Frame` wrapper when the Sitecore page is in Experience Editor editing mode and a required `widgetId` field has not been populated on the datasource item. In normal (non-editing) delivery mode the component renders nothing at all, ensuring no error state is visible to end users.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | N/A — error display component, not a Sitecore rendering |
| **Component Name** | `NoWidgetIdError` |
| **Category** | `Search` (internal utility) |

## Fields
**Fields:** None — this component has no Sitecore fields. It is passed the parent rendering's `params` prop only.

## Placeholders
**Placeholders:** None

## JSS Field Component Mapping
**JSS Field Component Mapping:** None — no Sitecore fields are rendered.

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Named export | `NoWidgetIdError` | Inline error display inside Search widget components |

## Props Interface
```typescript
// Search/NoWidgetIdError.tsx
import { ComponentProps } from 'lib/component-props';

type NoWidgetIdErrorProps = {
  params?: ComponentProps['params'];
};

export const NoWidgetIdError: React.FC<NoWidgetIdErrorProps> = ({ params }) => { ... };
```

## Example Content Entry

### Minimum Viable Content
This component accepts no content. It is rendered programmatically by sibling Search components when `props.fields?.widgetId?.value` is falsy.

### Full Content Example
N/A — no content entry is created for this component.

## MCP Authoring Instructions
This is a system/utility component and is **not** authored directly via MCP. It is invoked automatically by the following Search components when the `widgetId` datasource field is empty:
- `ArticleListingWithFilters`
- `EventListingWithFilters`
- `InsightsListingWithFilters`
- `KnowledgeCenterSearch`
- `NewsListingWithFilters`
- `PeopleSearch`
- `ProductSearch`
- `SearchResults`
- `SimplePageListingWithFilters`

To resolve the error, populate the `widgetId` field on the datasource item of the parent Search component.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
