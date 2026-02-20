---
name: sitecore-author-placeholder
description: Adds components to Sitecore placeholders with correct dynamic placeholder path construction
---

# Placeholder Authoring Skill

**Version:** 1.0

## What I do
- Add components to Sitecore page placeholders using Marketer MCP
- Construct correct placeholder paths for root-level and nested components
- Handle dynamic placeholder ID retrieval and tracking
- Manage parent-child component relationships
- Support multi-level nesting of components

## When to use
Use this skill when:
- Adding components to a Sitecore page
- Creating nested components (e.g., Button inside HeroBanner)
- Building page layouts with multiple components
- Understanding placeholder path construction rules

---

## Placeholder Path Rules (CRITICAL)

### Quick Reference

| Component Type | Placeholder Format | Example |
|:---------------|:-------------------|:--------|
| Root-level | `{placeholder-key}` | `headless-main` |
| Nested (1st level) | `/{parent-path}/{child-key}-{dynamic-id}` | `/headless-main/buttons-1` |
| Nested (2nd level) | `/{parent-path}/{child-key}-{dynamic-id}` | `/headless-main/buttons-1/icons-1` |

### Key Points

1. **Root-level components: NO leading slash**
   - Example: `"headless-main"` (correct)
   - Example: `"/headless-main"` (WRONG)

2. **Child/nested components: MUST have leading slash**
   - Example: `"/headless-main/buttons-1"` (correct)
   - Example: `"headless-main/buttons-1"` (WRONG - missing leading slash!)

3. **Dynamic ID is numeric (1, 2, 3, etc.)**
   - Comes from parent's rendering, NOT from datasource ID or UID
   - Must query Sitecore after adding parent to get the dynamic ID

4. **Never include parent's GUID or UID in path**
   - Example: `/headless-main/buttons-1` (correct)
   - Example: `/headless-main/buttons-abc123-1` (WRONG)

---

## Workflow Overview

```
1. Add Component → marketer_add_component_on_page
2. Get Dynamic ID → marketer_get_components_on_page (find by datasource)
3. If Has Children → Construct child placeholder path
4. Add Children → Use constructed path with leading slash
5. Repeat for nested children
```

---

## Step 1: Add Root-Level Component

Use `marketer_add_component_on_page` with simple placeholder key (NO leading slash):

```javascript
await marketer_add_component_on_page({
  pageId: "3d665eeb-c575-485f-9682-097716190f5c",
  componentRenderingId: "c152f7dc-6c01-4380-babb-97c9f080cf00",
  placeholderPath: "headless-main",  // NO leading slash for root
  componentItemName: "HeroBanner_1",
  fields: {
    "Heading": "Welcome",
    "Subheading": "To our site"
  }
});
```

**Response:**
```json
{
  "componentId": "c152f7dc-6c01-4380-babb-97c9f080cf00",
  "pageId": "3d665eeb-c575-485f-9682-097716190f5c",
  "placeholderId": "headless-main",
  "datasourceId": "09896bf6-30d2-411b-b9b5-3122bf032aed"
}
```

**IMPORTANT:** The returned `datasourceId` is the content item ID, NOT the component rendering UID.

---

## Step 2: Retrieve Dynamic Placeholder ID

After adding a parent component, query to get its Dynamic Placeholder ID:

```javascript
// Step 2a: Query page components
const pageData = await marketer_get_components_on_page({
  pageId: "3d665eeb-c575-485f-9682-097716190f5c"
});

// Step 2b: Find our component by datasource ID and placeholder
const parentComponent = pageData.components.find(c =>
  c.dataSource === "09896bf6-30d2-411b-b9b5-3122bf032aed" &&
  c.placeholder === "headless-main"
);

// Step 2c: Extract the Dynamic Placeholder ID
const dynamicPlaceholderId = parentComponent.parameters?.DynamicPlaceholderId || "1";

console.log(`Parent's Dynamic ID: ${dynamicPlaceholderId}`);
// Output: Parent's Dynamic ID: 1
```

**Why this matters:**
- This ID is required to construct child placeholder paths
- Each parent component gets a sequential numeric ID from Sitecore
- You CANNOT guess this - you must query for it

---

## Step 3: Construct Child Placeholder Path

Use this formula:

```
childPlaceholderPath = "/" + parentPlaceholderPath + "/" + childPlaceholderKey + "-" + parentDynamicId
```

**Example:**
```javascript
const parentPlaceholderPath = "headless-main";
const childPlaceholderKey = "buttons";  // From component manifest
const parentDynamicId = 1;  // From Step 2

const childPlaceholderPath = `/${parentPlaceholderPath}/${childPlaceholderKey}-${parentDynamicId}`;
// Result: "/headless-main/buttons-1"
```

**Finding the child placeholder key:**
- Check component manifest: `.opencode/output/component-manifest.json`
- Look for `has_placeholders` and `placeholders` array on the parent component
- Common keys: `buttons`, `grid-items`, `cards`, `icons`

---

## Step 4: Add Child Component

Use `marketer_add_component_on_page` with constructed path (WITH leading slash):

```javascript
await marketer_add_component_on_page({
  pageId: "3d665eeb-c575-485f-9682-097716190f5c",
  componentRenderingId: "button-rendering-id",
  placeholderPath: "/headless-main/buttons-1",  // HAS leading slash for children
  componentItemName: "Button_1_1",
  fields: {
    "Link": "<link text='Learn More' linktype='external' url='https://example.com' anchor='' target='_blank' />"
  }
});
```

---

## Complete Example: HeroBanner with Button

```javascript
// 1. Add HeroBanner to root placeholder
const heroBannerResult = await marketer_add_component_on_page({
  pageId: pageId,
  componentRenderingId: heroBannerRenderingId,
  placeholderPath: "headless-main",  // Root = NO leading slash
  componentItemName: "HeroBanner_1",
  fields: { "Heading": "Welcome" }
});

// 2. Get the dynamic placeholder ID
const pageData = await marketer_get_components_on_page({ pageId: pageId });
const heroBanner = pageData.components.find(c =>
  c.dataSource === heroBannerResult.datasourceId
);
const dynamicId = heroBanner?.parameters?.DynamicPlaceholderId || "1";

// 3. Construct child placeholder path
const buttonPlaceholder = `/headless-main/buttons-${dynamicId}`;
// Result: "/headless-main/buttons-1"

// 4. Add Button to child placeholder
await marketer_add_component_on_page({
  pageId: pageId,
  componentRenderingId: buttonRenderingId,
  placeholderPath: buttonPlaceholder,  // Child = HAS leading slash
  componentItemName: "Button_1_1",
  fields: {
    "Link": "<link text='Learn More' linktype='external' url='https://example.com' anchor='' target='_blank' />"
  }
});
```

---

## Cumulative Component Counting

Sitecore assigns dynamic placeholder IDs sequentially to ALL components added, including children:

```
1. HeroBanner (1st component) → Dynamic ID: 1
   └── Button (2nd component) → Added to /headless-main/buttons-1
2. SplitBanner (3rd component) → Dynamic ID: 3
   └── Button (4th component) → Added to /headless-main/buttons-3
3. ContentBlock (5th component) → Dynamic ID: 5
   └── Button (6th component) → Added to /headless-main/buttons-5
4. CardGrid (7th component) → Dynamic ID: 7
   └── Card (8th component) → Added to /headless-main/cards-7
```

**Key insight:** The dynamic ID equals the cumulative count of components when that component was added.

---

## Multi-Level Nesting

For components nested more than one level deep:

```
CardGrid (placeholder: headless-main)
  └── Card (placeholder: /headless-main/cards-1)
      └── Button (placeholder: /headless-main/cards-1/card-actions-1)
```

**Construction:**
```javascript
// Level 1: CardGrid
const cardGridPlaceholder = "headless-main";
// Add CardGrid, get dynamic ID = 1

// Level 2: Card
const cardPlaceholder = `/headless-main/cards-1`;
// Add Card, get dynamic ID = 1 (relative to CardGrid)

// Level 3: Button
const buttonPlaceholder = `/headless-main/cards-1/card-actions-1`;
```

---

## Validation Function

Use this to validate placeholder paths before MCP calls:

```javascript
function validatePlaceholderPath(placeholderPath, isNested) {
  // Root-level: simple key only (NO leading slash)
  if (!isNested) {
    if (placeholderPath.startsWith('/')) {
      throw new Error(`Root placeholder should NOT have leading slash: ${placeholderPath}`);
    }
    if (placeholderPath.includes('/')) {
      throw new Error(`Root placeholder should be simple key: ${placeholderPath}`);
    }
    return true;
  }

  // Nested: MUST start with "/" and have format /parent/child-dynamicId
  if (!placeholderPath.startsWith('/')) {
    throw new Error(
      `CRITICAL: Nested placeholder MUST have leading slash: ${placeholderPath}\n` +
      `Expected: /${placeholderPath}`
    );
  }

  // Must end with -{number}
  if (!/-\d+$/.test(placeholderPath)) {
    throw new Error(
      `Nested placeholder must end with dynamic ID (e.g., -1, -2): ${placeholderPath}`
    );
  }

  return true;
}
```

---

## Common Placeholder Mistakes

| Mistake | Wrong | Correct |
|:--------|:------|:--------|
| Missing leading slash for child | `headless-main/buttons-1` | `/headless-main/buttons-1` |
| Leading slash on root | `/headless-main` | `headless-main` |
| Missing dynamic ID | `/headless-main/buttons` | `/headless-main/buttons-1` |
| Using GUID in path | `/headless-main/buttons-abc123-1` | `/headless-main/buttons-1` |
| Wrong dynamic ID | `/headless-main/buttons-0` | `/headless-main/buttons-1` (IDs start at 1) |

---

## Common Placeholder Keys by Component

| Parent Component | Placeholder Key | Child Component |
|:-----------------|:----------------|:----------------|
| HeroBanner | `buttons` | Button |
| SplitBanner | `buttons` | Button |
| ContentBlock | `buttons` | Button |
| CardGrid | `cards` or `grid-items` | Card |
| Card | `card-actions` | Button |
| Navigation | `nav-items` | NavItem |

**Always check the component manifest for exact placeholder keys!**

---

## Retry Logic for Component Queries

The API may not return all components immediately (truncation). Implement retry:

```javascript
async function getComponentWithRetry(pageId, datasourceId, placeholder, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const pageData = await marketer_get_components_on_page({ pageId });

    const component = pageData.components.find(c =>
      c.dataSource === datasourceId && c.placeholder === placeholder
    );

    if (component) {
      return component;
    }

    if (attempt < maxRetries) {
      console.log(`Component not found, retry ${attempt}/${maxRetries}...`);
      await new Promise(r => setTimeout(r, 2000 * attempt)); // Exponential backoff
    }
  }

  return null;
}
```

---

## Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| Component not placed | Wrong placeholder path | Verify leading slash for nested, no slash for root |
| Child not visible | Missing dynamic ID | Query parent's DynamicPlaceholderId before adding child |
| "Invalid placeholder" | Path doesn't match page layout | Verify placeholder exists in page template |
| Components in wrong order | Sequential processing needed | Add parent, query dynamic ID, then add children |

---

## Integration with Other Skills

This skill works alongside:
- `/sitecore-author-link` - For link field formatting
- `/sitecore-author-image` - For image field formatting
- `/pagebuilder` - For understanding component structure
- `/content-page-auto-populator` - For automated page population

---

## Workflow Summary

```
+------------------------------------------------------------------+
| PLACEHOLDER AUTHORING WORKFLOW                                   |
+------------------------------------------------------------------+
|                                                                   |
|  1. VALIDATE: Is this root or nested?                            |
|     ├── Root → Use simple key: "headless-main"                   |
|     └── Nested → Need dynamic ID first                           |
|     |                                                             |
|  2. ADD COMPONENT: marketer_add_component_on_page                |
|     ├── Root: placeholderPath = "headless-main"                  |
|     └── Nested: placeholderPath = "/parent/child-{dynamicId}"    |
|     |                                                             |
|  3. IF HAS CHILDREN:                                             |
|     |                                                             |
|     3a. QUERY: marketer_get_components_on_page                   |
|         |                                                         |
|     3b. FIND: Component by datasourceId + placeholder            |
|         |                                                         |
|     3c. EXTRACT: parameters.DynamicPlaceholderId                 |
|         |                                                         |
|     3d. CONSTRUCT: "/{parentPath}/{childKey}-{dynamicId}"        |
|         |                                                         |
|     3e. ADD CHILDREN: Using constructed path (with leading /)    |
|     |                                                             |
|  4. REPEAT: For nested children                                  |
|                                                                   |
+------------------------------------------------------------------+
```
