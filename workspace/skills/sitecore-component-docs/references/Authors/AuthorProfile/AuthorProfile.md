# AuthorProfile Component

## Purpose

The AuthorProfile component displays a comprehensive author/profile page with a two-column layout featuring a sticky sidebar (profile image, contact information, expertise) and a main content area (biography and accordion sections for achievements, education, and involvements). This component reads profile data from the route context via GraphQL and is typically used on dedicated author/team member profile pages.

## Sitecore Template Requirements

### Data Source

**Important:** This component reads profile data from the **page/route context** via GraphQL, not from a component-level datasource. The profile fields must be defined on the Profile Page Template.

### Template Path

- **Page Template:** `/sitecore/templates/Project/[Site]/Pages/Profile Page` or `/sitecore/templates/Project/[Site]/Authors/Author`
- **No separate datasource template** - uses page-level fields via AuthorContext

### Fields

| Field Name   | Sitecore Type    | Required | Description                               | Validation/Constraints                    |
| ------------ | ---------------- | -------- | ----------------------------------------- | ----------------------------------------- |
| firstName    | Single-Line Text | Yes      | Author's first name                       | Max 50 characters                         |
| lastName     | Single-Line Text | Yes      | Author's last name                        | Max 50 characters                         |
| role         | Single-Line Text | No       | Job title or role                         | Max 100 characters                        |
| description  | Rich Text        | No       | Full biography text                       | Supports full rich text formatting        |
| image        | Image            | No       | Desktop profile photo                     | Square recommended, min 400x400px         |
| imageMobile  | Image            | No       | Mobile profile photo                      | Square recommended, min 300x300px         |
| email        | Single-Line Text | No       | Contact email address                     | Valid email format                        |
| phone        | Single-Line Text | No       | Contact phone number                      | Any format accepted                       |
| website      | General Link     | No       | Personal or company website               | External link                             |
| linkedInLink | General Link     | No       | LinkedIn profile URL                      | External link to LinkedIn                 |
| expertise    | Multilist        | No       | Tags/categories of expertise              | References expertise taxonomy items       |
| company      | Single-Line Text | No       | Company or organization name              | Max 100 characters                        |
| location     | Treelist         | No       | Geographic location reference             | References location taxonomy              |

### Child Content Structure

The profile item can have child folders containing additional content:

| Folder Name  | Item Type           | Description                                    |
| ------------ | ------------------- | ---------------------------------------------- |
| Achievements | Achievement items   | Awards, certifications, notable accomplishments |
| Education    | Education items     | Degrees, certifications, training              |
| Involvements | Involvement items   | Organizations, boards, volunteer work          |

#### Achievement/Education Item Fields

| Field       | Type      | Description               |
| ----------- | --------- | ------------------------- |
| description | Rich Text | Description of the item   |

#### Involvement Item Fields

| Field       | Type             | Description               |
| ----------- | ---------------- | ------------------------- |
| heading     | Single-Line Text | Organization name         |
| description | Rich Text        | Role or involvement details |

### Rendering Parameters (Styles)

| Parameter        | Type     | Options                      | Default | Description                          |
| ---------------- | -------- | ---------------------------- | ------- | ------------------------------------ |
| theme            | Droplist | primary, secondary, tertiary | primary | Color theme for styling              |
| padding (top)    | Droplist | top-none, top-xs, ..., top-xl | none   | Top padding                          |
| padding (bottom) | Droplist | bottom-none, ..., bottom-xl   | none   | Bottom padding                       |

## JSS Field Component Mapping

| Sitecore Field | JSS Component                                               | Import                                                  |
| -------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| firstName, lastName | Direct value access: `profile.firstName?.value`       | Via `useAuthor()` hook                                  |
| description    | `<RichText field={profile.description} className="..." />` | `import { RichText } from '@sitecore-jss/sitecore-jss-nextjs'` |
| image          | `<Image field={profile.image?.jsonValue} className="..." />`| `import { Image } from '@sitecore-jss/sitecore-jss-nextjs'` |
| imageMobile    | `<Image field={profile.imageMobile?.jsonValue} />`          | Displays on mobile only                                 |
| role           | Direct value: `profile.role?.value`                          | Plain text rendering                                    |
| email, phone   | Links: `<a href="mailto:...">` / `<a href="tel:...">`       | Native anchor elements                                  |
| website        | `<a href={profile.website.jsonValue.value.href}>`           | Link with icon                                          |
| linkedInLink   | `<a href={profile.linkedInLink.jsonValue.value.href}>`      | Link with LinkedIn icon                                 |
| expertise      | Mapped: `profile.expertise.jsonValue.map(...).join(', ')`   | Comma-separated list                                    |

## Component Variants

The AuthorProfile exports 1 rendering variant:

| Variant | Export Name | Use Case                                    |
| ------- | ----------- | ------------------------------------------- |
| Default | `Default`   | Full profile page with sidebar and bio      |

## Content Authoring Instructions

### Field-by-Field Guidance

#### firstName / lastName

- **What to enter:** Author's legal or professional name
- **Example:** "John" / "Smith"

#### role

- **What to enter:** Current job title or professional role
- **Example:** "Senior Software Architect" or "Chief Marketing Officer"

#### description (Biography)

- **What to enter:** Full professional biography
- **Tone/Style:** Professional, third-person or first-person depending on brand guidelines
- **Formatting:** Paragraphs, bold for emphasis, links to relevant pages
- **Example:** "<p>John Smith is a Senior Software Architect with over 15 years of experience in enterprise software development...</p>"

#### image (Profile Photo)

- **Recommended dimensions:** 400x400px or larger
- **Aspect ratio:** 1:1 (square)
- **File formats:** JPG, PNG, WebP
- **Alt text:** Use person's name or "Portrait of [Name]"
- **Media Library path:** `/sitecore/media library/Project/[Site]/Authors/`
- **Tips:** Professional headshot with consistent background

#### imageMobile

- **Recommended dimensions:** 300x300px
- **Aspect ratio:** 1:1 (square)
- **Purpose:** Optimized version for mobile devices

#### email

- **What to enter:** Professional email address
- **Format:** Standard email format (name@domain.com)
- **Example:** "john.smith@company.com"

#### phone

- **What to enter:** Contact phone number
- **Format:** Any standard phone format
- **Example:** "+1 (555) 123-4567"

#### website

- **What to enter:** Personal portfolio, company page, or professional website
- **Link type:** External
- **Example:** `{ href: "https://johnsmith.com", text: "johnsmith.com", target: "_blank" }`

#### linkedInLink

- **What to enter:** LinkedIn profile URL
- **Link type:** External
- **Example:** `{ href: "https://linkedin.com/in/johnsmith", text: "LinkedIn", target: "_blank" }`

#### expertise

- **What to select:** Relevant expertise tags from the taxonomy
- **Selection path:** `/sitecore/content/[Site]/Data/Expertise/`
- **Example selections:** "Cloud Architecture", "Digital Transformation", "Agile Leadership"

### Child Content (Accordion Sections)

#### Achievements Folder

Create items under `[Profile]/Achievements/` with:

- **description:** Description of the achievement
- **Example:** "Certified AWS Solutions Architect - Professional (2023)"

#### Education Folder

Create items under `[Profile]/Education/` with:

- **description:** Degree, institution, and year
- **Example:** "M.S. Computer Science, Stanford University, 2010"

#### Involvements Folder

Create items under `[Profile]/Involvements/` with:

- **heading:** Organization name
- **description:** Role or involvement description
- **Example:** heading: "Tech for Good Foundation", description: "Board Member since 2020"

## Component Props Interface

```typescript
// Component uses route context via AuthorContext
import { ProfileGQL } from 'lib/types/page/profile';

// ProfileGQL includes:
export type ProfileGQL = {
  name: string;
  displayName: string;
  id: string;
  description: { value: string; jsonValue: { value: string } };
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
  achievements?: AchievementItem[];
  education?: EducationItem[];
  involvements?: InvolvementItem[];
};
```

## Example Content Entry

### Profile Page Content

```json
{
  "firstName": { "value": "John" },
  "lastName": { "value": "Smith" },
  "role": { "value": "Senior Software Architect" },
  "description": {
    "value": "<p>John Smith is a Senior Software Architect with over 15 years of experience in enterprise software development. He specializes in cloud-native architectures and has led digital transformation initiatives for Fortune 500 companies.</p><p>John is passionate about mentoring junior developers and regularly speaks at technology conferences.</p>"
  },
  "email": { "value": "john.smith@company.com" },
  "phone": { "value": "+1 (555) 123-4567" },
  "image": {
    "value": {
      "src": "/-/media/Project/Site/Authors/john-smith.jpg",
      "alt": "John Smith",
      "width": "400",
      "height": "400"
    }
  },
  "expertise": [
    { "fields": { "Title": { "value": "Cloud Architecture" } } },
    { "fields": { "Title": { "value": "Digital Transformation" } } }
  ],
  "website": {
    "value": {
      "href": "https://johnsmith.dev",
      "text": "johnsmith.dev",
      "target": "_blank"
    }
  },
  "linkedInLink": {
    "value": {
      "href": "https://linkedin.com/in/johnsmith",
      "text": "LinkedIn",
      "target": "_blank"
    }
  }
}
```

## Sitecore XM Cloud Specifics

### Content Editor Path

- Profile pages: `/sitecore/content/[Site]/Home/Team/[Author Name]/`
- Child folders: `/sitecore/content/[Site]/Home/Team/[Author Name]/Achievements/`

### Experience Editor Behavior

- **Inline editable fields:** biography (description)
- **Forms panel required:** image, imageMobile, contact fields, links
- **Accordion content:** Managed via child items in Content Editor

### Layout Structure

- **Desktop:** Two-column grid (32% sidebar, auto main content)
- **Mobile:** Single column, stacked layout
- **Sidebar:** Sticky positioning on desktop

### SEO/Metadata

The component includes an `AuthorMetadata` subcomponent that:

- Generates structured data for the author
- Provides metadata for social sharing
- Supports author schema markup

## Common Mistakes to Avoid

1. **Missing profile context:** Component returns null if no profile data is available. Ensure the page uses the correct template.

2. **Non-square profile images:** Use 1:1 aspect ratio images to prevent cropping or distortion.

3. **Empty accordion sections:** If no items exist in Achievements/Education/Involvements folders, those sections won't display.

4. **Missing translations:** Ensure labels like "Biography", "Contact Information", "Achievements" are in translation dictionary.

5. **Invalid email/phone formats:** While any format is accepted, use consistent formatting across profiles.

6. **Broken external links:** Verify website and LinkedIn URLs are correct and accessible.

## Related Components

- `AuthorCard` - Compact author card for listings and article footers
- `TeamGrid` - Grid display of multiple author cards
- `ArticleFooter` - Displays author information on article pages

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the AuthorProfile component using the Marketer MCP tools.

### Important: Route-Context Component

The AuthorProfile component reads profile data from the **page route context** via AuthorContext, not from a component datasource. This means:

1. Profile fields are authored on the **Profile Page** itself
2. Adding the AuthorProfile component does not create a separate datasource
3. Content updates go to the page item and its child items

### Step 1: Find or Create the Profile Page

```javascript
// Search for existing profile page
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "John Smith"
});
const pageId = pageSearch.results[0].itemId;

// Or get page by path
const page = await mcp__marketer-mcp__get_content_item_by_path({
  itemPath: "/sitecore/content/Site/Home/Team/John-Smith"
});
```

### Step 2: Add AuthorProfile Component to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "author-profile-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "AuthorProfile_1",
  language: "en",
  fields: {}  // No component-level fields
});
```

### Step 3: Update Profile Fields on the Page

Since profile fields are page-level, update them on the page item:

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "firstName": "John",
    "lastName": "Smith",
    "role": "Senior Software Architect",
    "description": "<p>John Smith is a Senior Software Architect with over 15 years of experience...</p>",
    "email": "john.smith@company.com",
    "phone": "+1 (555) 123-4567"
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
    "image": "<image mediaid='{PROFILE-IMAGE-GUID}' />",
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
    "website": "<link linktype='external' url='https://johnsmith.dev' target='_blank' text='johnsmith.dev' />",
    "linkedInLink": "<link linktype='external' url='https://linkedin.com/in/johnsmith' target='_blank' text='LinkedIn' />"
  }
});
```

### Step 6: Create Accordion Section Items (Optional)

Create child items for achievements, education, and involvements:

```javascript
// Create Achievements folder (if it doesn't exist)
await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentId: pageId,
  name: "Achievements",
  templateId: "folder-template-id"
});

// Create achievement item
await mcp__marketer-mcp__create_content_item({
  siteName: "main",
  parentId: "achievements-folder-id",
  name: "AWS Certification",
  templateId: "achievement-template-id",
  fields: {
    "description": "Certified AWS Solutions Architect - Professional (2023)"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find the profile page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "John Smith Team"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Add AuthorProfile component to the page
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "author-profile-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "AuthorProfile_Main",
  language: "en",
  fields: {}
});

// ═══════════════════════════════════════════════════════════════
// STEP 3: Update text fields on the page
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "firstName": "John",
    "lastName": "Smith",
    "role": "Senior Software Architect",
    "description": "<p>John Smith is a Senior Software Architect with over 15 years of experience in enterprise software development.</p>",
    "email": "john.smith@company.com",
    "phone": "+1 (555) 123-4567"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 4: Update image fields
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "image": "<image mediaid='{CFD9E144-F974-4AA8-A552-CBF55E67E628}' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// STEP 5: Update link fields
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: pageId,
  language: "en",
  fields: {
    "website": "<link linktype='external' url='https://johnsmith.dev' target='_blank' text='johnsmith.dev' />",
    "linkedInLink": "<link linktype='external' url='https://linkedin.com/in/johnsmith' target='_blank' text='LinkedIn' />"
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: AuthorProfile displays the page's profile data
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field        | Type             | Location   | MCP Format                                          |
| :----------- | :--------------- | :--------- | :-------------------------------------------------- |
| firstName    | Single-Line Text | Page item  | `"Plain text value"`                                |
| lastName     | Single-Line Text | Page item  | `"Plain text value"`                                |
| role         | Single-Line Text | Page item  | `"Plain text value"`                                |
| description  | Rich Text        | Page item  | `"<p>HTML content</p>"`                             |
| email        | Single-Line Text | Page item  | `"email@domain.com"`                                |
| phone        | Single-Line Text | Page item  | `"+1 (555) 123-4567"`                               |
| image        | Image            | Page item  | `<image mediaid='{GUID}' />`                        |
| imageMobile  | Image            | Page item  | `<image mediaid='{GUID}' />`                        |
| website      | General Link     | Page item  | `<link linktype='external' url='...' ... />`        |
| linkedInLink | General Link     | Page item  | `<link linktype='external' url='...' ... />`        |
| expertise    | Multilist        | Page item  | `"{GUID1}\|{GUID2}"`                                |

### MCP Authoring Checklist

Before authoring AuthorProfile via MCP, verify:

- [ ] Have profile page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have AuthorProfile rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Update goes to page item, not datasource
- [ ] Have media GUIDs for profile image(s)
- [ ] Link fields use correct XML format

### MCP Error Handling

| Error                  | Cause                     | Solution                                     |
| :--------------------- | :------------------------ | :------------------------------------------- |
| "Item already exists"  | Duplicate component name  | Use unique suffix: `AuthorProfile_2`         |
| Component not visible  | Wrong placeholder path    | Use `"headless-main"` without leading slash  |
| Profile not showing    | No AuthorContext data     | Ensure page has profile template             |
| `updatedFields: {}`    | Normal response           | Update succeeded despite empty response      |
| Link not working       | Wrong XML format          | Use `<link linktype='external' ... />`       |

### Related Skills for MCP Authoring

| Skill                          | Purpose                                   |
| :----------------------------- | :---------------------------------------- |
| `/sitecore-author-placeholder` | Placeholder path construction rules       |
| `/sitecore-author-image`       | Image field XML formatting details        |
| `/sitecore-author-link`        | Link field XML formatting details         |
| `/sitecore-upload-media`       | Upload images to Media Library first      |
| `/sitecore-pagebuilder`        | Page creation and component placement     |

---

## Change Log

| Date       | Change                | Author      |
| ---------- | --------------------- | ----------- |
| 2026-02-09 | Initial documentation | Claude Code |
