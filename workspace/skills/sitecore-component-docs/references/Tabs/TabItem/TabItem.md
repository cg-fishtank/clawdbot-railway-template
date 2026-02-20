# TabItem Component

## Purpose
Represents a single tab panel inside a `TabsContainer`. It reads the currently active tab UID from `TabsContext` and conditionally shows or hides its content using CSS (`block`/`hidden`) for smooth tab switching without unmounting. In Experience Editor the heading is always shown with a visual border indicator so authors can identify individual tab items while editing all tabs simultaneously. The component delegates the actual content rendering logic to the shared `TabItem` component from `component-children`.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `186e303e-912a-404d-a73f-8e205bfb970e` |
| **Component Name** | `TabItem` |
| **Category** | `Tabs` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|--------------|----------|-------------|----------------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | The tab button label displayed in the tab navigation row | Should be concise (1–5 words) |
| `body` | Rich Text (`RichTextField`) | Yes | The full HTML content displayed in the tab panel body | Full rich text editor support |

## Placeholders
**Placeholders:** None — `TabItem` is a leaf component; it does not contain additional placeholders.

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `body` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard tab panel — must be placed inside a `TabsContainer` placeholder |

## Props Interface
```typescript
// component-children/Tabs/TabItem/TabItem.tsx
import {
  ComponentRendering,
  Field,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export type TabItemProps = ComponentProps & {
  rendering: ComponentRendering & {
    fields: {
      heading: Field<string>;
      body: RichTextField;
    };
  };
};
```

## Example Content Entry

### Minimum Viable Content
| Field | Value |
|-------|-------|
| `heading` | `Overview` |
| `body` | `<p>Tab panel content goes here.</p>` |

### Full Content Example
| Field | Value |
|-------|-------|
| `heading` | `Technical Specifications` |
| `body` | `<h3>Dimensions</h3><p>Width: 120cm, Height: 80cm</p><ul><li>Feature A</li><li>Feature B</li></ul>` |

## MCP Authoring Instructions
To add a `TabItem` to a page:
1. `TabItem` **must** be placed inside the `tabscontainer` placeholder of a `TabsContainer` component — it cannot be used standalone.
2. Add a `TabsContainer` rendering to the page first, then insert one or more `TabItem` renderings into the `tabscontainer` placeholder.
3. Set a concise **`heading`** for the tab button label and provide rich text **`body`** content for the panel.
4. The first `TabItem` in the placeholder will be active (visible) by default on page load.
5. In Experience Editor all tabs are shown simultaneously with a blue border indicator for orientation.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
