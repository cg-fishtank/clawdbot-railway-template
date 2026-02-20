---
name: sitecore-author-link
description: Authors link fields in Sitecore XM Cloud components using marketer-mcp
---

# Link Authoring Agent

**Version:** 1.0

## What I do

- Find pages and components in Sitecore using MCP
- Identify link fields on components
- Update link fields with properly formatted Sitecore link XML
- Handle multiple link fields per component
- Support both internal and external links

## When to use

Use this skill when:

- Updating link fields on existing Sitecore components
- Changing a component's CTA link, navigation link, etc.
- You need to author one or more link fields on a component

## Workflow Overview

```
1. Find Page → marketer_search_site
2. Get Components → marketer_get_components_on_page
3. Identify Link Fields → Check component manifest
3.5. Check Existing Values → marketer_get_content_item + Ask for override confirmation
4. Gather New Link Details → Ask user for link information
5. Update Link Fields → marketer_update_content
```

---

## Step 1: Find the Page

Use `marketer_search_site` to find the page containing the component:

```javascript
await marketer_search_site({
	site_name: "main",
	search_query: "Hospitality-01-28",
});
```

**Response includes:**

```json
{
	"itemId": "1cf58fee-32e4-45e6-ac86-905883f3b2b6",
	"name": "Hospitality-01-28",
	"path": "/sitecore/content/Sites/main/Home/Landrysv2/Hospitality-01-28"
}
```

**User Input Required:**
Ask the user: "What page contains the component you want to update?"

- Accept page name (e.g., "Hospitality-01-28")
- Accept partial path (e.g., "Landrysv2/Hospitality")
- Accept full path

---

## Step 2: Get Components on Page

Use `marketer_get_components_on_page` to list all components and their datasources:

```javascript
await marketer_get_components_on_page({
	site_name: "main",
	page_id: "1cf58fee-32e4-45e6-ac86-905883f3b2b6",
});
```

**Response includes components with datasource IDs:**

```json
{
	"components": [
		{
			"componentName": "HeroBanner",
			"dataSource": "a788f16f-d42e-4689-9975-f9a5bdde6757",
			"placeholder": "headless-main"
		},
		{
			"componentName": "Button",
			"dataSource": "b899c27g-e53f-522c-c086-g8a6ceee7868",
			"placeholder": "/headless-main/buttons-1"
		}
	]
}
```

**Present to User:**
Display a numbered list of components:

```
Components on this page:
1. HeroBanner (headless-main)
2. Button (/headless-main/buttons-1)
3. ContentBlock (headless-main)
```

**User Input Required:**
Ask: "Which component do you want to update?" (accept number or name)

The `dataSource` is the item ID you'll update.

---

## Step 3: Identify Link Fields

Load the component manifest to identify link fields:

**Manifest Location:** `.opencode/output/component-manifest.json`

```javascript
// Read manifest
const manifest = JSON.parse(
	fs.readFileSync(".opencode/output/component-manifest.json"),
);

// Find component
const componentDef = manifest.components.find(
	(c) => c.name === selectedComponentName,
);

// Filter for link fields
const linkFields = componentDef.fields.filter(
	(f) =>
		f.type === "LinkField" ||
		f.type === "Field<Link>" ||
		f.name.toLowerCase().includes("link"),
);
```

**Single Link Field:**
If component has only one link field, proceed to check existing values.

**Multiple Link Fields:**
If component has multiple link fields (e.g., `PrimaryLink`, `SecondaryLink`):

1. List all link fields by name
2. Ask user: "Which link field(s) do you want to update?"
   - Options: "All" or specific field names

---

## Step 3.5: Check Existing Values and Confirm Override

**CRITICAL:** Before updating, check if the link field(s) already have values.

Use `marketer_get_content_item` to read current field values:

```javascript
await marketer_get_content_item({
	siteName: "main",
	itemId: "a788f16f-d42e-4689-9975-f9a5bdde6757",
});
```

**Response includes current field values:**

```json
{
	"itemId": "a788f16f-d42e-4689-9975-f9a5bdde6757",
	"fields": {
		"Link": "<link text='Existing Link' linktype='external' url='https://old-url.com' anchor='' target='_blank' />",
		"Heading": "Welcome"
	}
}
```

**Parse and Display Existing Links:**

If a link field has a value, extract and display it to the user:

```javascript
function parseExistingLink(linkXml) {
	if (!linkXml || linkXml.trim() === "") {
		return null; // No existing value
	}

	// Extract attributes from XML
	const textMatch = linkXml.match(/text='([^']*)'/);
	const urlMatch = linkXml.match(/url='([^']*)'/);
	const typeMatch = linkXml.match(/linktype='([^']*)'/);
	const targetMatch = linkXml.match(/target='([^']*)'/);

	return {
		text: textMatch ? textMatch[1] : "",
		url: urlMatch ? urlMatch[1] : "",
		type: typeMatch ? typeMatch[1] : "external",
		target: targetMatch ? targetMatch[1] : "",
	};
}
```

**User Confirmation Required:**

For each link field with an existing value:

1. **Display current value:**

   ```
   The 'Link' field currently has:
   - Text: "Existing Link"
   - URL: "https://old-url.com"
   - Type: external
   - Target: _blank
   ```

2. **Ask for confirmation:**

   ```
   Do you want to override this existing link? (yes/no)
   ```

3. **Handle response:**
   - **Yes** → Proceed to gather new link details
   - **No** → Skip this field, move to next field (if any)

**Multiple Fields with Values:**
If updating multiple fields and some have existing values:

- Check each field individually
- Ask for confirmation for each field that has a value
- Only gather new details for fields the user confirms

---

## Step 4: Gather New Link Details

**User Input Required for Each Link Field:**

Ask the following questions for each link field:

1. **Link Text:** "What text should the link display?"
   - Example: "View Menu", "Learn More", "Contact Us"

2. **Link URL/Path:** "What is the link URL or path?"
   - External: "https://example.com/page"
   - Internal: "/about" or "sitecore item ID"

3. **Link Type:** "Is this an internal or external link?"
   - Options: "internal" or "external"
   - Auto-detect: URLs starting with `http` are external, paths starting with `/` are internal

4. **Target:** "Should this open in a new tab?"
   - Yes → `_blank`
   - No → `_self` or empty string

5. **Anchor (Optional):** "Any anchor/hash to add?" (usually empty)

---

## Step 5: Update Link Fields

Use `marketer_update_content` with properly formatted link XML:

```javascript
await marketer_update_content({
	siteName: "main",
	itemId: "a788f16f-d42e-4689-9975-f9a5bdde6757",
	fields: {
		Link: "<link text='View Menu' linktype='external' url='https://example.com/menu' anchor='' target='_blank' />",
	},
});
```

**Multiple Fields Example:**

```javascript
await marketer_update_content({
	siteName: "main",
	itemId: "a788f16f-d42e-4689-9975-f9a5bdde6757",
	fields: {
		PrimaryLink:
			"<link text='Learn More' linktype='internal' url='/about' anchor='' target='_self' />",
		SecondaryLink:
			"<link text='Contact' linktype='external' url='https://example.com/contact' anchor='' target='_blank' />",
	},
});
```

**Note:** Response may show `updatedFields: {}` even on success. This is expected behavior.

---

## CRITICAL: Link Field Format

Sitecore Link fields use XML format with specific attributes:

### External Link Format

```xml
<link text='Visit Website' linktype='external' url='https://example.com/' anchor='' target='_blank' />
```

### Internal Link Format (with Sitecore Item ID)

```xml
<link text='About Us' linktype='internal' url='' anchor='' target='' id='{B1BBF454-6060-4596-9D2C-0EA4AA414A9D}' />
```

### Internal Link Format (with Path)

```xml
<link text='About Us' linktype='internal' url='/about' anchor='' target='_self' />
```

### Format Requirements

| Requirement             | Details                                                         |
| :---------------------- | :-------------------------------------------------------------- |
| **Quotes**              | MUST use **single quotes** for all attributes                   |
| **Link Type**           | Must be `'internal'` or `'external'`                            |
| **External Links**      | Must include `url` attribute with full URL including `https://` |
| **Internal Links**      | Can use `url='/path'` OR `id='{GUID}'`                          |
| **Required Attributes** | `text`, `linktype`, `anchor`, `target`                          |
| **GUID Format**         | If using ID, MUST include braces: `'{GUID}'` and UPPERCASE      |

### Correct vs Wrong

```xml
CORRECT (external):
<link text='View Menu' linktype='external' url='https://example.com/menu' anchor='' target='_blank' />

WRONG (double quotes):
<link text="View Menu" linktype="external" url="https://example.com/menu" anchor="" target="_blank" />

CORRECT (internal with path):
<link text='About' linktype='internal' url='/about' anchor='' target='_self' />

CORRECT (internal with ID):
<link text='About' linktype='internal' url='' anchor='' target='' id='{B1BBF454-6060-4596-9D2C-0EA4AA414A9D}' />

WRONG (missing braces in GUID):
<link text='About' linktype='internal' id='B1BBF454-6060-4596-9D2C-0EA4AA414A9D' />
```

---

## Link Type Detection

Use this logic to auto-detect link type:

```javascript
function detectLinkType(url) {
	if (!url) return "external";

	// External if starts with http/https
	if (url.startsWith("http://") || url.startsWith("https://")) {
		return "external";
	}

	// Internal if starts with /
	if (url.startsWith("/")) {
		return "internal";
	}

	// If it's a GUID pattern, it's internal
	if (/^[{]?[0-9a-fA-F-]{36}[}]?$/.test(url)) {
		return "internal";
	}

	// Default to external
	return "external";
}
```

---

## Common Errors

| Error                             | Cause                       | Solution                                                              |
| :-------------------------------- | :-------------------------- | :-------------------------------------------------------------------- |
| `AUTH_NOT_AUTHENTICATED`          | Token expired               | Run `dotnet sitecore cloud login` and update `.env`                   |
| "Cannot find a field with name X" | Wrong field name            | Check component manifest for exact field name (case-sensitive)        |
| JSON escaping issues              | Double quotes in XML        | Use single quotes: `text='...'` not `text="..."`                      |
| `updatedFields: {}`               | Normal behavior             | Update actually succeeded - this is expected                          |
| "Invalid link format"             | Missing required attributes | Ensure all attributes present: `text`, `linktype`, `anchor`, `target` |
| "Cannot read item"                | Invalid datasource ID       | Verify component has a datasource (not shared)                        |

---

## Usage Examples

### Example 1: Simple External Link

```
/sitecore-author-link
Update the Button component on /Hospitality/Dining page
Field: Link
Text: "View Full Menu"
URL: "https://example.com/menu"
Type: external
Target: _blank
```

### Example 2: Internal Link with Path

```
/sitecore-author-link
Update the HeroBanner link on /Home page
Field: Link
Text: "Learn More"
URL: "/about-us"
Type: internal
Target: _self
```

### Example 3: Multiple Link Fields

```
/sitecore-author-link
Update the ContentBlock on /Services page
Component has 2 link fields:
- PrimaryLink: "Get Started" → https://example.com/signup (external, _blank)
- SecondaryLink: "Learn More" → /about (internal, _self)
```

---

## Key Rules

1. **Always check existing values first** - use `marketer_get_content_item` before updating
2. **Always ask for override confirmation** if field already has a value
3. **Always use single quotes** in XML to prevent JSON escaping issues
4. **Always include all required attributes**: `text`, `linktype`, `anchor`, `target`
5. **Use empty strings for unused attributes**: `anchor=''` not omitting it
6. **External links need full URLs** including `https://`
7. **Internal links can use paths** (`/about`) or IDs (`{GUID}`)
8. **GUIDs must have braces** and be UPPERCASE when used
9. **Find datasource via MCP** - don't assume IDs
10. **Check component manifest** to get exact field names
11. **Support multiple link fields** in a single update call

---

## Advanced: Internal Links with Sitecore Item IDs

If the user wants to link to a specific Sitecore item by ID:

**Step 1:** Get the target item ID (if user doesn't provide it):

```javascript
await marketer_search_site({
	site_name: "main",
	search_query: "About Us",
});
// Returns: { itemId: "b1bbf454-6060-4596-9d2c-0ea4aa414a9d" }
```

**Step 2:** Format the link XML with ID:

```xml
<link text='About Us' linktype='internal' url='' anchor='' target='' id='{B1BBF454-6060-4596-9D2C-0EA4AA414A9D}' />
```

**Note:**

- GUID must be UPPERCASE
- GUID must be wrapped in braces: `'{GUID}'`
- `url` attribute should be empty string when using `id`

---

## Workflow Summary

```
┌─────────────────────────────────────────────────────────────┐
│ LINK AUTHORING WORKFLOW                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. ASK: "What page has the component?"                     │
│     ↓                                                        │
│  2. CALL: marketer_search_site(page_name)                   │
│     ↓                                                        │
│  3. CALL: marketer_get_components_on_page(page_id)          │
│     ↓                                                        │
│  4. SHOW: List of components with indices                   │
│     ↓                                                        │
│  5. ASK: "Which component to update?"                       │
│     ↓                                                        │
│  6. READ: Component manifest for link fields                │
│     ↓                                                        │
│  7. IF multiple link fields:                                │
│     ├─ SHOW: List of link field names                       │
│     └─ ASK: "Which fields to update?"                       │
│     ↓                                                        │
│  8. CALL: marketer_get_content_item(datasource_id)          │
│     ↓                                                        │
│  9. FOR EACH selected link field:                           │
│     ├─ CHECK: Does field have existing value?               │
│     ├─ IF yes:                                              │
│     │   ├─ SHOW: Current link details                       │
│     │   ├─ ASK: "Override existing link? (yes/no)"          │
│     │   └─ IF no: Skip this field                           │
│     └─ IF yes to override OR field is empty:                │
│         ├─ ASK: "Link text?"                                │
│         ├─ ASK: "Link URL?"                                 │
│         ├─ ASK: "Internal or external?"                     │
│         └─ ASK: "Open in new tab?"                          │
│     ↓                                                        │
│ 10. BUILD: Link XML with single quotes                      │
│     ↓                                                        │
│ 11. CALL: marketer_update_content(datasource_id, fields)    │
│     ↓                                                        │
│ 12. CONFIRM: "Link field(s) updated successfully"           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration Notes

This skill works alongside:

- `/sitecore-author-image` - For updating image fields
- `/sitecore-upload-media` - For uploading assets
- `/sitecore-author` - For orchestrating page creation and component authoring

All skills use the same MCP authentication and site structure.
