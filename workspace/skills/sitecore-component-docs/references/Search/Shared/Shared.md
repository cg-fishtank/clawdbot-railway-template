# NoWidgetIdError Component (Shared)

## Purpose

The NoWidgetIdError is a shared utility component that displays an error message when a Search component is missing its required `widgetId` configuration. It only renders in Experience Editor (page editing mode) to alert content authors about the missing configuration. This component is used internally by all Search listing components.

## Usage Context

This component is **NOT** directly placed on pages. It is imported and used by:

- `ArticleListingWithFilters`
- `AuthorsSearch`
- `EventListingWithFilters`
- `InsightsListingWithFilters`
- `KnowledgeCenterSearch`
- `NewsListingWithFilters`
- `SearchResults`
- `SimplePageListingWithFilters`

## Component Props Interface

```typescript
import { ComponentProps } from 'lib/component-props';

type NoWidgetIdErrorProps = {
  params?: ComponentProps['params'];
};
```

## Behavior

| Context | Behavior |
|---------|----------|
| Experience Editor | Displays red error message: "No widget id configured" |
| Published site (preview/live) | Returns `null` (renders nothing) |

## Implementation Details

```typescript
export const NoWidgetIdError: React.FC<NoWidgetIdErrorProps> = ({ params }) => {
  const { sitecoreContext } = useSitecoreContext();

  if (!sitecoreContext.pageEditing) return null;

  return (
    <Frame params={params}>
      <div className="text-red-600 p-4 text-center">No widget id configured</div>
    </Frame>
  );
};
```

## Why This Exists

Sitecore Search components require a `widgetId` to connect to the correct search widget. Without it:

1. The component cannot fetch or display search results
2. The page would appear broken or empty
3. Content authors need clear feedback about what's missing

By showing the error only in editing mode:
- Authors are alerted during content setup
- Published pages don't show error messages to visitors
- The problem is visible exactly where it needs to be fixed

## Styling

| Class | Effect |
|-------|--------|
| `text-red-600` | Red text color for visibility |
| `p-4` | Padding for spacing |
| `text-center` | Centered text alignment |

## Related Files

- `lib/component-props.ts` - ComponentProps type definition
- `@sitecore-jss/sitecore-jss-nextjs` - useSitecoreContext hook
- `component-children/Shared/Frame/Frame` - Wrapper component for styling

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Error message visible on published site | Check `sitecoreContext.pageEditing` logic |
| Error not showing in Experience Editor | Verify useSitecoreContext is returning correct state |
| Styling not applied | Ensure Tailwind CSS is processing the component |

## Best Practices

When adding new Search components:

1. Import `NoWidgetIdError` from `'../Shared/NoWidgetIdError'`
2. Check for `widgetId` early in the component
3. Return `<NoWidgetIdError params={props.params} />` if missing
4. Continue with normal rendering only if widgetId exists

Example pattern:
```typescript
const rfkId = props.fields?.widgetId?.value;

if (!rfkId) {
  return <NoWidgetIdError params={props.params} />;
}

// Continue with normal component rendering...
```

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
