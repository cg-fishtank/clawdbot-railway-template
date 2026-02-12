# FooterLegal Component

## Purpose

The FooterLegal component displays the legal section of the footer, featuring privacy policy, terms of service, and cookie policy links, along with copyright text, social media icons, and an optional land acknowledgement statement. It provides the standard legal footer information required for most websites and supports social media integration through child items.

## Sitecore Template Requirements

### Data Source Template

- **Template Path:** `/sitecore/templates/Project/[Site]/Footer/Footer Legal`
- **Template Name:** `Footer Legal`

### Child Item Template (Social Links)

- **Template Path:** `/sitecore/templates/Project/[Site]/Footer/Footer Social Link`
- **Template Name:** `Footer Social Link`
- **Purpose:** Child items containing social media icons and links

### Fields

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| copyright | Single-Line Text | Yes | Copyright text (year auto-prepended) | Company/brand name only |
| privacyPolicyLink | General Link | Yes | Link to privacy policy page | Internal link recommended |
| tosLink | General Link | Yes | Link to terms of service page | Internal link recommended |
| cookiePolicyLink | General Link | No | Link to cookie policy page | Internal link recommended |
| landAcknowledgement | Single-Line Text | No | Land acknowledgement statement | Full text of acknowledgement |

### Child Item Fields (Footer Social Link)

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| socialIcon | Single-Line Text | Yes | Social media icon identifier | Values: facebook, twitter, linkedin, instagram, youtube |
| link | General Link | Yes | URL to social media profile | External link |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| copyright | `<Text className="copy-sm" field={copyright} />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |
| privacyPolicyLink | `<Button link={privacyPolicyLink} variant="link" />` | Custom Button component |
| tosLink | `<Button link={tosLink} variant="link" />` | Custom Button component |
| cookiePolicyLink | `<Button link={cookiePolicyLink} variant="link" />` | Custom Button component |
| landAcknowledgement | `<Text field={fields?.landAcknowledgement} tag="p" />` | `import { Text } from '@sitecore-jss/sitecore-jss-nextjs'` |

## GraphQL Query

The component fetches social link child items via GraphQL:

```graphql
query GetFooterLegalSocialLinks(
  $datasourcePath: String!
  $language: String!
  $templateId: String!
) {
  item(path: $datasourcePath, language: $language) {
    socialLinks: children(includeTemplateIDs: [$templateId]) {
      results {
        ... on FooterSocialLink {
          name
          socialIcon {
            value
          }
          link {
            ...LinkFieldFragment
          }
        }
      }
    }
  }
}
```

## Content Authoring Instructions

### Field-by-Field Guidance

#### copyright

- **What to enter:** Company or brand name (year is auto-generated)
- **Tone/Style:** Official brand name
- **Display format:** "©2024 [Your Text]"
- **Example:** "Acme Corporation. All rights reserved."

#### privacyPolicyLink

- **Type:** General Link
- **Required:** Yes
- **Guidance:** Link to the site's privacy policy page
- **Example:**
  ```json
  {
    "value": {
      "href": "/privacy-policy",
      "text": "Privacy Policy",
      "linktype": "internal"
    }
  }
  ```

#### tosLink

- **Type:** General Link
- **Required:** Yes
- **Guidance:** Link to the terms of service page
- **Example:**
  ```json
  {
    "value": {
      "href": "/terms-of-service",
      "text": "Terms of Service",
      "linktype": "internal"
    }
  }
  ```

#### cookiePolicyLink

- **Type:** General Link
- **Required:** No
- **Guidance:** Link to cookie policy page (if separate from privacy policy)
- **Example:**
  ```json
  {
    "value": {
      "href": "/cookie-policy",
      "text": "Cookie Policy",
      "linktype": "internal"
    }
  }
  ```

#### landAcknowledgement

- **Type:** Single-Line Text
- **Required:** No
- **Guidance:** Land acknowledgement statement for Indigenous territory recognition
- **Display:** Appears in a separate primary-themed bar below the main legal section
- **Example:** "We acknowledge that our offices are located on the traditional territory of Indigenous peoples."

### Creating Social Links (Child Items)

1. Navigate to the Footer Legal datasource item
2. Create child items using the `Footer Social Link` template
3. For each social link:
   - Set `socialIcon` to the platform name
   - Set `link` to the social media profile URL

#### Supported Social Icons

| Icon Value | Platform |
|------------|----------|
| `facebook` | Facebook |
| `twitter` | Twitter/X |
| `linkedin` | LinkedIn |
| `instagram` | Instagram |
| `youtube` | YouTube |

## Component Props Interface

```typescript
type FooterLegalFields = {
  fields: {
    copyright: Field<string>;
    privacyPolicyLink: LinkField;
    tosLink: LinkField;
    cookiePolicyLink: LinkField;
    landAcknowledgement: Field<string>;
  };
};

type SocialLinkType = {
  link: LinkGQLType;
  socialIcon: {
    value: IconSocialType;
  };
};

type FooterLegalRenderingType = {
  rendering: ComponentRendering & {
    socialLinks: SocialLinkType[];
  };
};

type FooterLegalProps = ComponentProps &
  FooterLegalFields &
  FooterLegalRenderingType & {
    className?: string;
  };
```

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "copyright": { "value": "Acme Corporation" },
    "privacyPolicyLink": {
      "value": {
        "href": "/privacy-policy",
        "text": "Privacy Policy"
      }
    },
    "tosLink": {
      "value": {
        "href": "/terms-of-service",
        "text": "Terms of Service"
      }
    }
  }
}
```

### Complete (All Fields)

```json
{
  "fields": {
    "copyright": { "value": "Acme Corporation. All rights reserved." },
    "privacyPolicyLink": {
      "value": {
        "href": "/privacy-policy",
        "text": "Privacy Policy",
        "linktype": "internal"
      }
    },
    "tosLink": {
      "value": {
        "href": "/terms-of-service",
        "text": "Terms of Service",
        "linktype": "internal"
      }
    },
    "cookiePolicyLink": {
      "value": {
        "href": "/cookie-policy",
        "text": "Cookie Policy",
        "linktype": "internal"
      }
    },
    "landAcknowledgement": {
      "value": "We acknowledge that our offices are located on the traditional territory of Indigenous peoples."
    }
  }
}
```

### Social Link Child Items

```json
[
  {
    "socialIcon": { "value": "linkedin" },
    "link": {
      "value": {
        "href": "https://linkedin.com/company/acme",
        "target": "_blank"
      }
    }
  },
  {
    "socialIcon": { "value": "twitter" },
    "link": {
      "value": {
        "href": "https://twitter.com/acme",
        "target": "_blank"
      }
    }
  }
]
```

## Visual Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│  Privacy Policy   Terms of Service   Cookie Policy   ©2024 Acme Corp   │
│                                                     [LinkedIn] [Twitter]│
├────────────────────────────────────────────────────────────────────────┤
│  [Land Acknowledgement text displayed here in primary theme bar]        │
└────────────────────────────────────────────────────────────────────────┘
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Footer Legal: `/sitecore/content/[Site]/Home/Data/Footer/Footer Legal`
- Social Links: Created as children under Footer Legal item

### Experience Editor Behavior

- **Inline editable:** copyright, landAcknowledgement
- **Forms panel:** Legal links (privacyPolicyLink, tosLink, cookiePolicyLink)
- **Social links:** Manage via Content Editor

### Theme Configuration

- Main section uses `tertiary` theme (light background)
- Land acknowledgement uses `primary` theme (brand color background)

## Authoring Rules

1. **Legal Compliance:** Ensure all required legal links are populated for compliance
2. **Copyright Format:** Only enter company name; year is auto-generated
3. **Social Links:** Open in new tab for external links
4. **Land Acknowledgement:** Use respectful, accurate language if including

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Including year in copyright | Year is auto-generated | Enter only company name |
| Missing legal links | Non-compliant, poor UX | Always include privacy and ToS |
| Broken social links | Dead links look unprofessional | Verify URLs regularly |
| Wrong social icon value | Icon won't display | Use exact icon names (lowercase) |

## Related Components

- `FooterMain` - Main footer section with logo and newsletter
- `FooterMenu` - Footer navigation columns container
- `FooterCol` - Individual footer navigation column

---

## MCP Authoring Instructions

### Step 1: Create or Find Footer Legal Datasource

```javascript
const datasource = await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentPath: "/sitecore/content/Site/Home/Data/Footer",
  templatePath: "/sitecore/templates/Project/Site/Footer/Footer Legal",
  name: "Footer Legal",
  language: "en"
});
```

### Step 2: Set Main Fields

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasource.itemId,
  language: "en",
  fields: {
    "copyright": "Acme Corporation. All rights reserved.",
    "privacyPolicyLink": "<link text='Privacy Policy' linktype='internal' url='/privacy-policy' />",
    "tosLink": "<link text='Terms of Service' linktype='internal' url='/terms-of-service' />",
    "cookiePolicyLink": "<link text='Cookie Policy' linktype='internal' url='/cookie-policy' />",
    "landAcknowledgement": "We acknowledge that our offices are on traditional Indigenous territory."
  }
});
```

### Step 3: Create Social Link Child Items

```javascript
// Create LinkedIn social link
const linkedinItem = await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentPath: datasource.itemPath,
  templatePath: "/sitecore/templates/Project/Site/Footer/Footer Social Link",
  name: "LinkedIn",
  language: "en"
});

await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: linkedinItem.itemId,
  language: "en",
  fields: {
    "socialIcon": "linkedin",
    "link": "<link linktype='external' url='https://linkedin.com/company/acme' target='_blank' />"
  }
});
```

### Field Type Quick Reference

| Field | Type | MCP Format |
|:------|:-----|:-----------|
| copyright | Single-Line Text | `"Plain text value"` |
| privacyPolicyLink | General Link | `<link text='Text' linktype='internal' url='/path' />` |
| tosLink | General Link | `<link text='Text' linktype='internal' url='/path' />` |
| cookiePolicyLink | General Link | `<link text='Text' linktype='internal' url='/path' />` |
| landAcknowledgement | Single-Line Text | `"Plain text value"` |
| socialIcon (child) | Single-Line Text | `"linkedin"` (lowercase) |
| link (child) | General Link | `<link linktype='external' url='https://...' target='_blank' />` |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial documentation | Claude Code |
