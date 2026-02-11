---
name: sitecore-author-placeholder
description: Construct correct dynamic placeholder paths for Sitecore component authoring. Handles root-level placeholders (no leading slash), nested placeholders (with leading slash + dynamic ID suffix), and multi-level nesting. Use when adding components to pages or building page layouts with parent-child relationships.
allowed-tools:
  - mcp__marketer-mcp__add_component_on_page
  - mcp__marketer-mcp__get_components_on_page
  - mcp__marketer-mcp__get_components_by_placeholder
  - mcp__marketer-mcp__get_allowed_components_by_placeholder
  - mcp__marketer-mcp__move_component_within_placeholder
  - mcp__marketer-mcp__remove_component_on_page
---

# Sitecore Author — Placeholder Path Construction

**Dynamic placeholder path construction for adding components to Sitecore pages via marketer-mcp.**

---

## What This Skill Does

- Construct correct placeholder paths for root-level and nested components
- Handle dynamic placeholder ID retrieval and tracking after adding parent components
- Manage parent-child component relationships across multiple nesting levels
- Validate placeholder paths before making MCP calls to avoid silent failures

---

## When to Use

Use this skill when:
- Adding components to a Sitecore page and determining the correct `placeholderPath`
- Creating nested components (e.g., Button inside HeroBanner, Card inside CardGrid)
- Building page layouts with multiple levels of component nesting
- Debugging why a component is not appearing on a page (likely a placeholder path issue)
- Moving or removing components within a placeholder

---

## Placeholder Path Rules (CRITICAL)

### Quick Reference

| Component Type | Placeholder Format | Example |
|:---------------|:-------------------|:--------|
| Root-level | `{placeholder-key}` | `headless-main` |
| Nested (1st level) | `/{parent-path}/{child-key}-{dynamic-id}` | `/headless-main/buttons-1` |
| Nested (2nd level) | `/{parent-path}/{child-key}-{dynamic-id}` | `/headless-main/cards-1/card-actions-2` |

### Key Rules

1. **Root-level components: NO leading slash**
   - Correct: `"headless-main"`
   - WRONG: `"/headless-main"`

2. **Child/nested components: MUST have leading slash**
   - Correct: `"/headless-main/buttons-1"`
   - WRONG: `"headless-main/buttons-1"` (missing leading slash!)

3. **Dynamic ID is numeric (1, 2, 3, etc.)**
   - Comes from parent's rendering, NOT from datasource ID or UID
   - Must query Sitecore after adding parent to get the dynamic ID

4. **Never include parent's GUID or UID in path**
   - Correct: `/headless-main/buttons-1`
   - WRONG: `/headless-main/buttons-abc123-1`

---

## Workflow Overview

```
1. Add Component    --> mcp__marketer-mcp__add_component_on_page
2. Get Dynamic ID   --> mcp__marketer-mcp__get_components_on_page (find by datasource)
3. If Has Children  --> Construct child placeholder path
4. Add Children     --> Use constructed path with leading slash
5. Repeat for nested children
```

---

## Step 1: Add Root-Level Component

Use `mcp__marketer-mcp__add_component_on_page` with a simple placeholder key (NO leading slash):

```
mcp__marketer-mcp__add_component_on_page({
  pageId: "3d665eeb-c575-485f-9682-097716190f5c",
  componentRenderingId: "c152f7dc-6c01-4380-babb-97c9f080cf00",
  placeholderPath: "headless-main",
  componentItemName: "HeroBanner_1",
  fields: {
    "Heading": "Welcome",
    "Subheading": "To our site"
  }
})
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

```
// Step 2a: Query page components
const pageData = mcp__marketer-mcp__get_components_on_page({
  pageId: "3d665eeb-c575-485f-9682-097716190f5c"
})

// Step 2b: Find our component by datasource ID and placeholder
const parentComponent = pageData.components.find(c =>
  c.dataSource === "09896bf6-30d2-411b-b9b5-3122bf032aed" &&
  c.placeholder === "headless-main"
)

// Step 2c: Extract the Dynamic Placeholder ID
const dynamicPlaceholderId = parentComponent.parameters?.DynamicPlaceholderId || "1"
// Output: "1"
```

**Why this matters:**
- This ID is required to construct child placeholder paths
- Each parent component gets a sequential numeric ID from Sitecore
- You CANNOT guess this — you must query for it after adding the parent

---

## Step 3: Construct Child Placeholder Path

Use this formula:

```
childPlaceholderPath = "/" + parentPlaceholderPath + "/" + childPlaceholderKey + "-" + parentDynamicId
```

**Example:**
```
parentPlaceholderPath = "headless-main"
childPlaceholderKey = "buttons"       // From references/component-registry.md
parentDynamicId = 1                   // From Step 2

childPlaceholderPath = "/headless-main/buttons-1"
```

**Finding the child placeholder key:**
- Check `references/component-registry.md` in the `sitecore-content-author` skill
- Look for `has_placeholders` and `placeholders` array on the parent component
- Common keys: `buttons`, `grid-items`, `cards`, `card-actions`, `icons`, `nav-items`

---

## Step 4: Add Child Component

Use `mcp__marketer-mcp__add_component_on_page` with the constructed path (WITH leading slash):

```
mcp__marketer-mcp__add_component_on_page({
  pageId: "3d665eeb-c575-485f-9682-097716190f5c",
  componentRenderingId: "button-rendering-id",
  placeholderPath: "/headless-main/buttons-1",
  componentItemName: "Button_1_1",
  fields: {
    "link": "<link text='Learn More' linktype='external' url='https://example.com' anchor='' target='_blank' />"
  }
})
```

---

## Cumulative Component Counting

Sitecore assigns dynamic placeholder IDs sequentially to ALL components added, including children:

```
1. HeroBanner (1st component added)  --> Dynamic ID: 1
   +-- Button (2nd component added)  --> Added to /headless-main/buttons-1
2. SplitBanner (3rd component added) --> Dynamic ID: 3
   +-- Button (4th component added)  --> Added to /headless-main/buttons-3
3. ContentBlock (5th component added) --> Dynamic ID: 5
   +-- Button (6th component added)  --> Added to /headless-main/buttons-5
4. CardGrid (7th component added)    --> Dynamic ID: 7
   +-- Card (8th component added)    --> Added to /headless-main/cards-7
```

**Key insight:** The dynamic ID equals the cumulative count of ALL components (parents and children) when that component was added. Always query `mcp__marketer-mcp__get_components_on_page` after adding a parent — never assume the ID.

---

## Multi-Level Nesting

For components nested more than one level deep:

```
CardGrid (placeholder: headless-main)
  +-- Card (placeholder: /headless-main/cards-1)
      +-- Button (placeholder: /headless-main/cards-1/card-actions-2)
```

**Construction:**
```
// Level 1: CardGrid added to root
cardGridPlaceholder = "headless-main"
// Add CardGrid --> query --> dynamic ID = 1

// Level 2: Card added as child of CardGrid
cardPlaceholder = "/headless-main/cards-1"
// Add Card --> query --> dynamic ID = 2

// Level 3: Button added as child of Card
buttonPlaceholder = "/headless-main/cards-1/card-actions-2"
```

Each nested level appends `/{childKey}-{dynamicId}` to the parent's full placeholder path.

---

## Complete Example: HeroBanner with Button

```
// 1. Add HeroBanner to root placeholder (NO leading slash)
mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: heroBannerRenderingId,
  placeholderPath: "headless-main",
  componentItemName: "HeroBanner_1",
  fields: { "heading": "Welcome" }
})
// --> Returns: { datasourceId: "abc-123-..." }

// 2. Get the dynamic placeholder ID
pageData = mcp__marketer-mcp__get_components_on_page({ pageId: pageId })
// Find HeroBanner by datasourceId "abc-123-..."
// Extract: parameters.DynamicPlaceholderId = "1"

// 3. Construct child placeholder path
buttonPlaceholder = "/headless-main/buttons-1"

// 4. Add Button to child placeholder (WITH leading slash)
mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: buttonRenderingId,
  placeholderPath: "/headless-main/buttons-1",
  componentItemName: "Button_1_1",
  fields: {
    "link": "<link text='Learn More' linktype='external' url='https://example.com' anchor='' target='_blank' />"
  }
})
```

---

## Checking Allowed Components for a Placeholder

Before adding a component, verify it is allowed in the target placeholder:

```
mcp__marketer-mcp__get_allowed_components_by_placeholder({
  pageId: "page-guid",
  placeholderPath: "headless-main"
})
```

This returns the list of component renderings that can be placed in that placeholder. Use this to validate before calling `add_component_on_page`.

---

## Moving Components Within a Placeholder

To reorder components within the same placeholder:

```
mcp__marketer-mcp__move_component_within_placeholder({
  pageId: "page-guid",
  componentId: "component-instance-id",
  placeholderPath: "headless-main",
  newIndex: 0
})
```

---

## Removing a Component

To remove a component from a page:

```
mcp__marketer-mcp__remove_component_on_page({
  pageId: "page-guid",
  componentId: "component-instance-id"
})
```

**Warning:** Removing a parent component will leave orphaned children. Remove children first, then the parent.

---

## Validation Rules

Before making any `add_component_on_page` call, validate the placeholder path:

### Root-Level Validation
- Must NOT start with `/`
- Must NOT contain `/`
- Must be a simple key like `headless-main`

### Nested-Level Validation
- MUST start with `/`
- MUST end with `-{number}` (e.g., `-1`, `-2`, `-3`)
- Must follow the pattern: `/{parentPath}/{childKey}-{dynamicId}`
- The dynamic ID must be queried from Sitecore, never guessed

---

## Common Placeholder Mistakes

| Mistake | Wrong | Correct |
|:--------|:------|:--------|
| Missing leading slash for child | `headless-main/buttons-1` | `/headless-main/buttons-1` |
| Leading slash on root | `/headless-main` | `headless-main` |
| Missing dynamic ID suffix | `/headless-main/buttons` | `/headless-main/buttons-1` |
| Using GUID in path | `/headless-main/buttons-abc123-1` | `/headless-main/buttons-1` |
| Wrong dynamic ID (zero-indexed) | `/headless-main/buttons-0` | `/headless-main/buttons-1` (IDs start at 1) |
| Guessing dynamic ID | Assumed `-1` without querying | Always query `get_components_on_page` first |

---

## Common Placeholder Keys by Component

| Parent Component | Placeholder Key | Typical Child |
|:-----------------|:----------------|:--------------|
| HeroBanner | `buttons` | Button |
| SplitBanner | `buttons` | Button |
| ContentBlock | `buttons` | Button |
| CardGrid | `cards` or `grid-items` | Card |
| Card | `card-actions` | Button |
| Navigation | `nav-items` | NavItem |

**Always check `references/component-registry.md` for exact placeholder keys — they are component-specific and must match exactly.**

---

## Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| Component not placed / not visible | Wrong placeholder path | Verify leading slash for nested, no slash for root |
| Child not visible on page | Missing or wrong dynamic ID | Query parent's `DynamicPlaceholderId` via `get_components_on_page` |
| "Invalid placeholder" | Path does not match page layout | Verify placeholder exists in page template via `get_allowed_components_by_placeholder` |
| Components in wrong order | Sequential processing needed | Add parent, query dynamic ID, then add children — never parallelize |
| Dynamic ID not found in response | API truncation on large pages | Retry `get_components_on_page` — the API may truncate results on pages with many components |

---

## Retry Logic for Component Queries

The API may not return all components immediately on pages with many components. Implement retry when the expected component is not found:

1. Call `mcp__marketer-mcp__get_components_on_page`
2. Search for the component by `datasourceId` and `placeholder`
3. If not found, wait briefly and retry (up to 3 attempts)
4. If still not found after retries, report the issue — do not guess the dynamic ID

---

## Integration with Other Skills

This skill provides placeholder path knowledge used by:
- **sitecore-content-author** — References this skill's rules when adding components to pages
- **sitecore-author-image** — Uses correct placeholder paths when adding image components
- **sitecore-content-reader** — Reads component trees that were built using these placeholder rules

---

## Workflow Summary

```
+------------------------------------------------------------------+
| PLACEHOLDER PATH CONSTRUCTION WORKFLOW                            |
+------------------------------------------------------------------+
|                                                                   |
|  1. VALIDATE: Is this root or nested?                            |
|     +-- Root --> Use simple key: "headless-main"                 |
|     +-- Nested --> Need dynamic ID first                         |
|                                                                   |
|  2. ADD COMPONENT: mcp__marketer-mcp__add_component_on_page      |
|     +-- Root: placeholderPath = "headless-main"                  |
|     +-- Nested: placeholderPath = "/parent/child-{dynamicId}"    |
|                                                                   |
|  3. IF COMPONENT HAS CHILDREN:                                   |
|                                                                   |
|     3a. QUERY: mcp__marketer-mcp__get_components_on_page         |
|                                                                   |
|     3b. FIND: Component by datasourceId + placeholder            |
|                                                                   |
|     3c. EXTRACT: parameters.DynamicPlaceholderId                 |
|                                                                   |
|     3d. CONSTRUCT: "/{parentPath}/{childKey}-{dynamicId}"        |
|                                                                   |
|     3e. ADD CHILDREN: Using constructed path (with leading /)    |
|                                                                   |
|  4. REPEAT: For deeper nesting levels                            |
|                                                                   |
+------------------------------------------------------------------+
```
