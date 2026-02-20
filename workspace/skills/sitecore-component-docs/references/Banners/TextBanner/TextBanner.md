# TextBanner Component

## Purpose
TextBanner is a text-only banner section — there is no background image. It renders a large `<h1>` heading and an optional rich-text subheading, centered (or aligned by Frame context) within a contained-width wrapper. A `buttons` placeholder sits beneath the text, allowing one or more CTAs to be placed without an image distraction. It is ideal for section dividers, announcement strips, and call-to-action panels where imagery would compete with the copy.

## Rendering Information
| Property | Value |
|----------|-------|
| **Rendering ID** | `e1c23b3a-a5fd-45b3-a686-6e08a04a5fe6` |
| **Component Name** | `TextBanner` |
| **Category** | `Banners` |

## Fields
| Field Name | Sitecore Type | Required | Description | Validation / Constraints |
|------------|--------------|----------|-------------|--------------------------|
| `heading` | Single-Line Text (`Field<string>`) | Yes | Primary headline rendered as an `<h1>` | Non-empty; displayed at `heading-4xl` / `heading-5xl` (md+) |
| `subheading` | Rich Text (`Field<string>`) | No | Supporting text below the heading; rendered as rich text up to `max-w-200` | Supports inline HTML |

## Placeholders
| Placeholder Key | Allowed Components | Notes |
|----------------|--------------------|-------|
| `buttons` | Button | Rendered only when at least one component is present; flex row with Frame-driven alignment |

> The placeholder name is generated via `placeholderGenerator(params, 'buttons')`. Buttons are conditionally rendered: the wrapper `<div>` is only emitted when `components?.length > 0`.

## JSS Field Component Mapping
| Sitecore Field | JSS Component | Import |
|---------------|--------------|--------|
| `heading` | `<Text>` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| `subheading` | `<RichText>` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |

## Component Variants
| Variant | Export Name | Use Case |
|---------|------------|----------|
| Default | `Default` | Text-only banner with heading, subheading, and optional buttons |

## Props Interface
```typescript
// From lib/types/components/Banners/text-banner (inferred)
import { TextBannerProps } from 'lib/types/components/Banners/text-banner';

type TextBannerProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    subheading?: Field<string>;
  };
};
```

## Example Content Entry

### Minimum Viable Content
```json
{
  "componentName": "TextBanner",
  "dataSource": "/sitecore/content/MySite/Data/Banners/CtaTextBanner",
  "fields": {
    "heading": { "value": "Ready to Get Started?" }
  }
}
```

### Full Content Example
```json
{
  "componentName": "TextBanner",
  "dataSource": "/sitecore/content/MySite/Data/Banners/CtaTextBanner",
  "fields": {
    "heading": { "value": "Ready to Get Started?" },
    "subheading": { "value": "<p>Join thousands of customers who trust our platform every day. No contracts, no hidden fees.</p>" }
  },
  "placeholders": {
    "buttons": [
      { "componentName": "Button", "fields": { "link": { "value": { "href": "/sign-up", "text": "Create Free Account" } } } },
      { "componentName": "Button", "fields": { "link": { "value": { "href": "/pricing", "text": "See Pricing" } } } }
    ]
  }
}
```

## MCP Authoring Instructions

### Step 1: Add to Page
1. Open the target page in Sitecore Pages or Experience Editor.
2. Click **Add component** in the desired layout slot.
3. Search for **TextBanner** and select it.
4. Assign or create a datasource under the site's Data/Banners folder.

### Step 2: Populate Fields
| Field | Action |
|-------|--------|
| `heading` | Enter the primary headline text (required). This renders as the page's `<h1>`. |
| `subheading` | Optionally add supporting copy via the rich-text editor. Keep concise — the banner has no image to balance longer text. |

### Step 3: Add Buttons (Optional)
1. In the `buttons` placeholder, click **Add component** and select **Button**.
2. Configure the link URL, display text, and variant.
3. If no buttons are added, the placeholder wrapper is suppressed entirely — no empty space is left behind.

### Field Type Quick Reference
| Field | Sitecore Template Field Type | Notes |
|-------|------------------------------|-------|
| `heading` | Single-Line Text | Renders as `<h1>`; plain text only |
| `subheading` | Rich Text | Supports bold, italic, inline links |

---

## Change Log
| Date | Change | Author |
|------|--------|--------|
| 2026-02-19 | Initial documentation | Claude Code |
