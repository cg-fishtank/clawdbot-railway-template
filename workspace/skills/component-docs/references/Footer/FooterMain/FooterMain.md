# FooterMain Component

## Purpose

The FooterMain component displays a comprehensive footer section featuring a logo, newsletter signup area with heading/body/CTA, and a placeholder for footer menu columns. It includes a "scroll to top" button and serves as the primary footer layout when a newsletter call-to-action is desired. The component uses a secondary theme (dark background) and supports hiding via a demo field.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Footer/Footer Main`
- **Template Name:** `Footer Main`

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| logo | Image | Yes | Company/brand logo displayed in footer | Recommended: SVG or transparent PNG |
| newsletterHeading | Single-Line Text | Yes | Newsletter section heading | Recommended max 50 characters |
| newsletterBody | Rich Text | No | Newsletter description/supporting text | Brief, compelling copy |
| newsletterLink | General Link | Yes | CTA button link for newsletter signup | Internal or external link |
| demo | Checkbox | No | When checked, hides the component | For staging/demo purposes |

## Placeholder Configuration

The FooterMain component includes a placeholder for footer navigation:

| Placeholder Key | Purpose | Allowed Components |
|-----------------|---------|-------------------|
| `footermenu` | Footer navigation columns | FooterCol |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| logo | `<Image className="h-5 w-auto invert lg:h-8" field={fields?.logo} />` | `import { Image } from '@sitecore-jss/sitecore-jss-nextjs'` |
| newsletterHeading | `<Text field={fields?.newsletterHeading} tag="h3" className="heading-base text-center" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| newsletterBody | `<RichText field={fields?.newsletterBody} className="richtext text-center" />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| newsletterLink | `<Button link={fields?.newsletterLink} variant="button" color="tertiary" />` | Custom Button component |

## Content Authoring Instructions

### Field-by-Field Guidance

#### logo

- **Type:** Image
- **Required:** Yes
- **Recommended format:** SVG or transparent PNG
- **Note:** Logo is automatically inverted (white) for dark background
- **Dimensions:** Height auto-scales to 20px (mobile) / 32px (desktop)
- **Media Library path:** `/sitecore/media library/Project/[Site]/Logos/`
- **Example:**
  ```json
  {
    "value": {
      "src": "/-/media/Project/Site/Logos/logo-white.svg",
      "alt": "Company Name"
    }
  }
  ```

#### newsletterHeading

- **Type:** Single-Line Text
- **Required:** Yes
- **What to enter:** Compelling newsletter signup headline
- **Character limit:** 50 characters recommended
- **Example:** "Stay Connected"

#### newsletterBody

- **Type:** Rich Text
- **Required:** No
- **What to enter:** Brief description of newsletter value proposition
- **Tone/Style:** Engaging, benefit-focused
- **Example:**
  ```html
  <p>Subscribe to our newsletter for the latest updates, insights, and exclusive content delivered to your inbox.</p>
  ```

#### newsletterLink

- **Type:** General Link
- **Required:** Yes
- **Guidance:** Link to newsletter signup page or modal trigger
- **Button styling:** Displays as tertiary (accent color) button
- **Example:**
  ```json
  {
    "value": {
      "href": "/newsletter-signup",
      "text": "Subscribe Now",
      "title": "Sign up for our newsletter"
    }
  }
  ```

#### demo

- **Type:** Checkbox
- **Required:** No
- **Purpose:** When checked (value "1" or true), hides the entire component
- **Use case:** Hide component on production while testing

## Component Props Interface

```typescript
type FooterMainFields = {
  newsletterHeading: Field<string>;
  newsletterBody: Field<string>;
  newsletterLink: LinkField;
  logo: ImageField;
  demo?: Field<string | boolean>;
};

type FooterMainProps = ComponentProps & {
  fields: FooterMainFields;
};
```

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "logo": {
      "value": {
        "src": "/-/media/Project/Site/Logos/logo.svg",
        "alt": "Company Logo"
      }
    },
    "newsletterHeading": { "value": "Stay Connected" },
    "newsletterLink": {
      "value": {
        "href": "/newsletter",
        "text": "Subscribe"
      }
    }
  }
}
```

### Complete (All Fields)

```json
{
  "fields": {
    "logo": {
      "value": {
        "src": "/-/media/Project/Site/Logos/logo-white.svg",
        "alt": "Acme Corporation",
        "width": "200",
        "height": "50"
      }
    },
    "newsletterHeading": { "value": "Stay Connected With Us" },
    "newsletterBody": {
      "value": "<p>Subscribe to our newsletter for the latest updates, insights, and exclusive content delivered directly to your inbox.</p>"
    },
    "newsletterLink": {
      "value": {
        "href": "/newsletter-signup",
        "text": "Subscribe Now",
        "title": "Sign up for our newsletter",
        "class": ""
      }
    },
    "demo": { "value": false }
  }
}
```

## Visual Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo]  │    📞                    │  [Scroll to Top]                  │
│         │    Stay Connected         │  ┌──────────────┐                │
│         │    Subscribe to our...    │  │ Footer Col 1 │                │
│         │    [Subscribe Now]        │  │ Footer Col 2 │                │
│         │                           │  │ Footer Col 3 │                │
│         │                           │  └──────────────┘                │
└────────────────────────────────────────────────────────────────────────┘
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Footer Main: `/sitecore/content/[Site]/Home/Data/Footer/Footer Main`
- Logo media: `/sitecore/media library/Project/[Site]/Logos/`

### Experience Editor Behavior

- **Inline editable:** newsletterHeading, newsletterBody
- **Forms panel:** logo (image picker), newsletterLink
- **Placeholder editing:** Add FooterCol components to footermenu placeholder

### Theme Configuration

- Uses `secondary` theme (dark background, light text)
- Logo is inverted for visibility on dark background
- CTA button uses `tertiary` color (accent)

## Authoring Rules

1. **Logo Format:** Use SVG or transparent PNG for best quality
2. **Newsletter Copy:** Keep body text concise (2-3 sentences max)
3. **CTA Text:** Use action-oriented button text
4. **Placeholder Content:** Add FooterCol components for navigation links

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Non-transparent logo | White background shows on dark footer | Use transparent PNG or SVG |
| Too much body text | Clutters the footer | Keep to 2-3 sentences |
| Generic CTA text | Lower engagement | Use specific action words |
| Demo field checked | Component hidden unintentionally | Verify demo field before publishing |

## Related Components

- `FooterMenu` - Alternative footer layout for navigation-only footers
- `FooterCol` - Navigation column placed in footermenu placeholder
- `FooterLegal` - Legal section typically placed below FooterMain

---

## MCP Authoring Instructions

### Step 1: Add FooterMain Component to Page

```javascript
const result = await mcp__marketer__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "footer-main-rendering-id",
  placeholderPath: "headless-footer",  // Or appropriate footer placeholder
  componentItemName: "FooterMain_1",
  language: "en",
  fields: {
    "newsletterHeading": "Stay Connected",
    "newsletterBody": "<p>Subscribe to our newsletter for updates.</p>"
  }
});

const datasourceId = result.datasourceId;
```

### Step 2: Update Image Field

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "logo": "<image mediaid='{LOGO-MEDIA-GUID}' />"
  }
});
```

### Step 3: Update Link Field

```javascript
await mcp__marketer__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "newsletterLink": "<link text='Subscribe Now' linktype='internal' url='/newsletter-signup' />"
  }
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| logo | Image | `<image mediaid='{GUID}' />` |
| newsletterHeading | Single-Line Text | `"Plain text value"` |
| newsletterBody | Rich Text | `"<p>HTML content</p>"` |
| newsletterLink | General Link | `<link text='Text' linktype='internal' url='/path' />` |
| demo | Checkbox | `"1"` (checked) or `""` (unchecked) |

### MCP Authoring Checklist

- [ ] Have page ID for footer placement
- [ ] Have FooterMain rendering ID
- [ ] Have logo media GUID
- [ ] Add FooterCol components to footermenu placeholder after FooterMain

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
