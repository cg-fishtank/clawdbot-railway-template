# PersonProfile Component

## Purpose

The PersonProfile component displays a detailed profile page for a person/team member, featuring their name, role, expertise tags, contact information (email, phone, website, LinkedIn), biography, and expandable accordion sections for Achievements, Education, Involvements, Speaking Events, and Recent Articles. It uses a two-column layout with a sidebar (image + contact info) and main content area (biography + accordions). Data comes from a person context hook, not from component-level datasource fields.

## Sitecore Template Requirements

### Data Source

**Important:** This component reads all fields from **person context** via the `usePerson()` hook, which pulls data from a GraphQL query against the person page item. The Person Page Template must contain all profile fields.

### Template Path

- **Page Template:** `/sitecore/templates/Project/[Site]/People/Person Page`
- **No separate datasource template** - uses page-level fields via context

### Fields (Page Level)

| Field Name | Sitecore Type | Required | Description | Validation/Constraints |
|------------|---------------|----------|-------------|------------------------|
| firstName | Single-Line Text | Yes | Person's first name | Max 50 characters |
| lastName | Single-Line Text | Yes | Person's last name | Max 50 characters |
| role | Single-Line Text | No | Job title or role | Max 120 characters |
| email | Single-Line Text | No | Contact email address | Valid email format |
| phone | Single-Line Text | No | Contact phone number | Standard phone format |
| description | Rich Text | No | Biography / about section | Supports full rich text formatting |
| image | Image | No | Desktop profile image | Recommended square 1:1 aspect ratio |
| imageMobile | Image | No | Mobile-specific profile image | Recommended square 1:1 aspect ratio |
| expertise | Multilist | No | Expertise/specialty tags | Links to expertise taxonomy items |
| company | Single-Line Text | No | Company or organization name | Max 100 characters |
| location | Multilist | No | Location references | Links to location taxonomy items |
| website | General Link | No | Personal or company website | External link |
| linkedInLink | General Link | No | LinkedIn profile URL | External link to LinkedIn |

### Child Content Folders

The person page item can have child folders for structured content sections:

| Folder Name | Contains | Child Fields |
|-------------|----------|--------------|
| Achievements | Achievement items | `description` (Rich Text) |
| Education | Education items | `description` (Rich Text) |
| Involvements | Involvement items | `heading` (Single-Line Text), `description` (Rich Text) |

### Rendering Parameters (Styles)

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| theme | Droplist | primary, secondary, tertiary | primary | Color theme affecting icons and borders |

## JSS Field Component Mapping

| Sitecore Field | JSS Component | Import |
|----------------|---------------|--------|
| image | `<Image field={profile.image?.jsonValue} />` | `import { Image } from '@sitecore-content-sdk/nextjs'` |
| imageMobile | `<Image field={profile.imageMobile?.jsonValue} />` | `import { Image } from '@sitecore-content-sdk/nextjs'` |
| description | `<RichText field={profile.description} />` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| firstName, lastName | Direct value access (`profile.firstName.value`) | N/A (not via JSS component) |
| role | Direct value access (`profile.role.value`) | N/A |
| email | Direct value access (`profile.email.value`) | N/A |
| phone | Direct value access (`profile.phone.value`) | N/A |
| expertise | Direct JSON value access (`profile.expertise.jsonValue`) | N/A |
| website | Direct JSON value access (`profile.website.jsonValue`) | N/A |
| linkedInLink | Direct JSON value access (`profile.linkedInLink.jsonValue`) | N/A |
| Accordion section titles | `<Text field={section.title} tag="p" />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |
| Accordion item descriptions | `<RichText field={item.description} />` | `import { RichText } from '@sitecore-content-sdk/nextjs'` |
| Involvement headings | `<Text field={item.heading} tag="p" />` | `import { Text } from '@sitecore-content-sdk/nextjs'` |

## Component Variants

| Variant | Export Name | Use Case |
|---------|-------------|----------|
| Default | `Default` | Standard person profile page layout |

### Theme Support

The component supports theme customization via rendering parameters:

| Theme | Icon Color | Border Style |
|-------|------------|-------------|
| primary | Primary variant | Tertiary border on involvements |
| secondary | Secondary variant | Tertiary border on involvements |
| tertiary | Tertiary variant | Secondary border on involvements |

## Content Authoring Instructions

### Field-by-Field Guidance

#### firstName

- **What to enter:** Person's first/given name
- **Tone/Style:** Exact legal or preferred name
- **Character limit:** 50 characters
- **Example:** "Jane"

#### lastName

- **What to enter:** Person's last/family name
- **Tone/Style:** Exact legal or preferred name
- **Character limit:** 50 characters
- **Example:** "Smith"

#### role

- **What to enter:** Job title or professional role
- **Tone/Style:** Professional, current title
- **Character limit:** 120 characters
- **Example:** "Senior Research Scientist"

#### email

- **What to enter:** Professional contact email
- **Format:** Valid email address
- **Example:** "jane.smith@company.com"

#### phone

- **What to enter:** Professional contact phone number
- **Format:** Standard phone format with area code
- **Example:** "+1 (555) 123-4567"

#### description (Biography)

- **What to enter:** Professional biography and background
- **Tone/Style:** Third person, professional, engaging
- **Formatting:** Rich text - paragraphs, bold, lists, links
- **Example:** "<p>Jane Smith is a Senior Research Scientist with over 15 years of experience in environmental engineering.</p>"

#### image (Desktop)

- **Recommended dimensions:** Square, minimum 500x500px (1:1 aspect ratio)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Person's full name
- **Media Library path:** `/sitecore/media library/Project/[Site]/People/`

#### imageMobile

- **Recommended dimensions:** Square, minimum 300x300px (1:1 aspect ratio)
- **File formats:** JPG, PNG, WebP
- **Alt text requirements:** Person's full name
- **Notes:** Shown only on mobile; falls back to desktop image if not provided

#### expertise

- **What to select:** Relevant expertise/specialty tags from taxonomy
- **Selection path:** `/sitecore/content/[Site]/Data/Expertise/`
- **Display:** Comma-separated list under name and role
- **Examples:** "Water Treatment", "Environmental Science", "Chemical Engineering"

#### company

- **What to enter:** Company or organization affiliation
- **Example:** "Acme Corp"

#### website

- **What to enter:** Personal or company website URL
- **Link type:** External
- **Example:** `https://www.example.com`

#### linkedInLink

- **What to enter:** LinkedIn profile URL
- **Link type:** External, target _blank
- **Example:** `https://www.linkedin.com/in/janesmith`

### Content Matrix (Variations)

| Variation | Required Fields | Optional Fields | Use Case |
|-----------|-----------------|-----------------|----------|
| Minimal | firstName, lastName | - | Basic person entry |
| Standard | firstName, lastName, role, email, image, description | phone, expertise | Most common setup |
| Full | All fields + child folders | - | Complete person profile |

## Component Props Interface

```typescript
import { ComponentRendering } from '@sitecore-content-sdk/nextjs';

interface ComponentProps {
  rendering: ComponentRendering;
  params: { [key: string]: string };
}
```

### ProfileGQL Type (Data from context)

```typescript
import { Field, ImageField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';

export type ProfileGQL = {
  name: string;
  displayName: string;
  id: string;
  description: {
    value: string;
    jsonValue: { value: string };
  };
  email: { value: string };
  phone: { value: string };
  role: { value: string };
  image?: ImageGQLType;
  imageMobile?: ImageGQLType;
  expertise: { jsonValue: ExpertiseTag[] };
  company: { value: string };
  firstName: { value: string };
  lastName: { value: string };
  location: { value: string; jsonValue: LocationType[] };
  website: { jsonValue: LinkField };
  linkedInLink: { jsonValue: LinkField };
  children?: { results: ProfileChildrenFolder[] };
  events?: EventDataType[];
  articles?: ArticleDataType[];
};
```

## Example Content Entry

### Minimum Viable Content

```json
{
  "fields": {
    "firstName": { "value": "Jane" },
    "lastName": { "value": "Smith" }
  }
}
```

### Full Content Example

```json
{
  "fields": {
    "firstName": { "value": "Jane" },
    "lastName": { "value": "Smith" },
    "role": { "value": "Senior Research Scientist" },
    "email": { "value": "jane.smith@company.com" },
    "phone": { "value": "+1 (555) 123-4567" },
    "description": {
      "value": "<p>Jane Smith is a Senior Research Scientist with over 15 years of experience in environmental engineering and water treatment technologies.</p>"
    },
    "image": {
      "value": {
        "src": "/-/media/Project/Site/People/jane-smith.jpg",
        "alt": "Jane Smith",
        "width": "500",
        "height": "500"
      }
    },
    "imageMobile": {
      "value": {
        "src": "/-/media/Project/Site/People/jane-smith-mobile.jpg",
        "alt": "Jane Smith",
        "width": "300",
        "height": "300"
      }
    },
    "company": { "value": "Acme Corp" },
    "website": {
      "value": {
        "href": "https://www.example.com",
        "text": "Personal Website",
        "target": "_blank"
      }
    },
    "linkedInLink": {
      "value": {
        "href": "https://www.linkedin.com/in/janesmith",
        "text": "LinkedIn",
        "target": "_blank"
      }
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Person pages: `/sitecore/content/[Site]/Home/People/[Person Name]`
- Child folders (Achievements, Education, Involvements): Created as child items under the person page
- Expertise taxonomy: `/sitecore/content/[Site]/Data/Expertise/`
- Location taxonomy: `/sitecore/content/[Site]/Data/Locations/`
- All fields are edited directly on the person page item

### Experience Editor Behavior

- **Inline editable fields:** description (biography via RichText)
- **Forms panel required:** image, imageMobile, website, linkedInLink, expertise, location
- **Not inline editable:** firstName, lastName, role, email, phone, company (accessed via context, not JSS field components)

### SEO Metadata Output

The PersonMetadata child component outputs structured profile data via `<meta>` tags:
- Full name, last name, last name initial
- Role, email, phone
- Description (HTML stripped)
- Expertise, company, location
- Desktop and mobile image references
- Website and LinkedIn URLs

## Common Mistakes to Avoid

1. **Missing firstName and lastName:** These are essential for the name display and SEO metadata. Never leave both empty.

2. **Wrong image aspect ratio:** Use square images (1:1) for best display. Non-square images may appear cropped.

3. **Using literal `\n` in description:** Use HTML tags (`<p>`, `<br />`) for line breaks in the rich text biography.

4. **Missing alt text on images:** Always provide meaningful alt text. Falls back to person's full name if not provided.

5. **Accordion sections without child items:** Empty accordion sections are automatically hidden; no action needed.

6. **Forgetting child folder structure:** Achievements, Education, and Involvements must be created as named child folders with child items containing `description` (and `heading` for Involvements).

## Related Components

- `AuthorProfile` - Similar profile component for article authors
- `PeopleSearch` - Search/listing for people profiles
- `EventCard` - Used within the Speaking Events accordion section
- `ArticleCard` - Used within the Recent Articles accordion section

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the PersonProfile component using the Marketer MCP tools.

### Important: Context-Based Component

The PersonProfile component reads all fields from **person page context** via GraphQL, not from a component datasource. This means:

1. All fields are authored on the **Person Page** itself
2. Adding the PersonProfile component does not create a separate datasource
3. Content updates go to the page item, not a component datasource
4. Child content (Achievements, Education, Involvements) must be created as separate items

### Step 1: Find or Create Person Page

```javascript
// Search for existing person page
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Jane Smith"
});
const pageId = pageSearch.results[0].itemId;

// Or create a new person page
const newPage = await mcp__marketer-mcp__create_page({
  siteName: "main",
  pageName: "Jane Smith",
  parentItemId: "{PEOPLE-FOLDER-GUID}",
  pageTemplateId: "{PERSON-PAGE-TEMPLATE-GUID}",
  language: "en"
});
```

### Step 2: Add PersonProfile Component to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "person-profile-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "PersonProfile_Main",
  language: "en",
  fields: {}  // No component-level fields
});
```

### Step 3: Update Page-Level Text Fields

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "Senior Research Scientist",
    "email": "jane.smith@company.com",
    "phone": "+1 (555) 123-4567",
    "company": "Acme Corp",
    "description": "<p>Jane Smith is a Senior Research Scientist with over 15 years of experience in environmental engineering.</p>"
  }
});
```

### Step 4: Update Image Fields

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "image": "<image mediaid='{DESKTOP-IMAGE-GUID}' />",
    "imageMobile": "<image mediaid='{MOBILE-IMAGE-GUID}' />"
  }
});
```

### Step 5: Update Link Fields

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "website": "<link linktype='external' url='https://www.example.com' text='Personal Website' target='_blank' />",
    "linkedInLink": "<link linktype='external' url='https://www.linkedin.com/in/janesmith' text='LinkedIn' target='_blank' />"
  }
});
```

### Step 6: Set Expertise Tags (Optional)

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "expertise": "{EXPERTISE-TAG-GUID-1}|{EXPERTISE-TAG-GUID-2}"
  }
});
```

### Step 7: Create Child Content Items (Optional)

```javascript
// Create Achievements folder and items
const achievementsFolder = await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentItemId: pageId,
  itemName: "Achievements",
  templateId: "{FOLDER-TEMPLATE-GUID}",
  language: "en"
});

await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentItemId: achievementsFolder.itemId,
  itemName: "Achievement 1",
  templateId: "{ACHIEVEMENT-TEMPLATE-GUID}",
  language: "en",
  fields: {
    "description": "<p>Received the Outstanding Research Award in 2023.</p>"
  }
});
```

### Field Type Quick Reference

| Field | Type | Location | MCP Format |
|:------|:-----|:---------|:-----------|
| firstName | Single-Line Text | Page item | `"Plain text"` |
| lastName | Single-Line Text | Page item | `"Plain text"` |
| role | Single-Line Text | Page item | `"Plain text"` |
| email | Single-Line Text | Page item | `"email@example.com"` |
| phone | Single-Line Text | Page item | `"+1 (555) 123-4567"` |
| description | Rich Text | Page item | `"<p>HTML content</p>"` |
| image | Image | Page item | `<image mediaid='{GUID}' />` |
| imageMobile | Image | Page item | `<image mediaid='{GUID}' />` |
| company | Single-Line Text | Page item | `"Plain text"` |
| expertise | Multilist | Page item | `"{GUID1}\|{GUID2}"` |
| location | Multilist | Page item | `"{GUID1}\|{GUID2}"` |
| website | General Link | Page item | `<link linktype='external' url='...' />` |
| linkedInLink | General Link | Page item | `<link linktype='external' url='...' />` |

### MCP Authoring Checklist

- [ ] Have Person Page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have PersonProfile rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] firstName and lastName fields have content (required)
- [ ] Have media GUIDs for image fields (if applicable)
- [ ] Image is square (1:1 aspect ratio recommended)
- [ ] Link XML uses single quotes for external links
- [ ] Rich text description uses HTML tags, not `\n`

### MCP Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| "Item already exists" | Duplicate component name | Use unique suffix: `PersonProfile_2` |
| Component not visible | Wrong placeholder path | Use `"headless-main"` without leading slash |
| Image not showing | Wrong XML format | Verify: `<image mediaid='{GUID}' />` |
| Link not working | Wrong link format | Use correct XML with single quotes |
| `updatedFields: {}` | Normal response | Update succeeded despite empty response |
| "Cannot find field" | Wrong field name | Field names are case-sensitive |
| Profile not rendering | Missing person context | Ensure page uses Person Page template |

### Related Skills for MCP Authoring

| Skill | Purpose |
|:------|:--------|
| `/sitecore-author-placeholder` | Placeholder path construction rules |
| `/sitecore-author-image` | Image field XML formatting details |
| `/sitecore-author-link` | Link field XML formatting details |
| `/sitecore-upload-media` | Upload images to Media Library first |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-18 | Initial documentation | Claude Code |
