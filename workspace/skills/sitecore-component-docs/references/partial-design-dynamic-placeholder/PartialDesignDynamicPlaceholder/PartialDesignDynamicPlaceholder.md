# PartialDesignDynamicPlaceholder Component

## Purpose
A thin system wrapper that enables Sitecore Partial Designs (shared page sections such as headers and footers) to define dynamic placeholder insertion points. It reads the `sig` parameter from the rendering's `params` (which Sitecore populates with the partial design's signature/unique key) and renders a `<Placeholder>` component targeting that key. This allows partial design items in the Sitecore Page Designer to expose configurable placeholder slots that editors can populate with other renderings.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | N/A — system component used internally by Sitecore Partial Designs |
| **Component Name** | `PartialDesignDynamicPlaceholder` |
| **Category** | `partial-design-dynamic-placeholder` (system) |

## Fields
**Fields:** None — this component has no Sitecore datasource fields. The placeholder name is derived entirely from `rendering.params.sig`.

## Placeholders
| Placeholder Key | Allowed Components | Notes |
|----------------|--------------------|-------|
| `{rendering.params.sig}` | Any rendering allowed by the Sitecore placeholder settings | The placeholder key is dynamic and injected by Sitecore from the partial design's `sig` parameter |

## JSS Field Component Mapping
**JSS Field Component Mapping:** None

## Component Variants
| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default export | `PartialDesignDynamicPlaceholder` (default) | Used within Sitecore Partial Design items to create editable placeholder zones |

## Props Interface
```typescript
// partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder.tsx
import React, { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

const PartialDesignDynamicPlaceholder = (props: ComponentProps): JSX.Element => (
  <Placeholder name={props.rendering?.params?.sig || ''} rendering={props.rendering} />
);

export default PartialDesignDynamicPlaceholder;
```

## Example Content Entry
This is a system component and is not authored via MCP.

## MCP Authoring Instructions
This is a system component and is not authored via MCP in the conventional sense. It is used exclusively by Sitecore developers or architects when configuring Partial Designs in the Sitecore Page Designer.

Typical use:
1. A developer creates a Partial Design item in Sitecore (e.g. a shared Header partial).
2. They add the `PartialDesignDynamicPlaceholder` rendering to the Partial Design's layout.
3. Sitecore automatically sets the `sig` parameter to a unique signature for that placeholder slot.
4. Content authors can then add renderings into that slot via the Page Designer when the Partial Design is applied to a page.

Do not add this component directly to regular page layouts — it is intended only for use inside Partial Design items.

---
## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
