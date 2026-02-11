---
name: sitecore-component-datasources
description: Intelligent content linking for SitecoreAI components. Search for reusable datasources before creating new ones, create datasource items when needed, link datasources to components, and inspect component datasource requirements. Prevents duplicate content by promoting reuse of existing datasource items.
allowed-tools:
  - mcp__marketer-mcp__search_component_datasources
  - mcp__marketer-mcp__create_component_datasource
  - mcp__marketer-mcp__set_component_datasource
  - mcp__marketer-mcp__get_component
  - mcp__marketer-mcp__list_components
  - mcp__marketer-mcp__get_allowed_components_by_placeholder
---

# Sitecore Component Datasources

**Intelligent content linking for SitecoreAI via marketer-mcp. Search for reusable datasource items before creating duplicates, create new datasources when needed, and link them to components.**

---

## Core Principle: Search Before Create

**ALWAYS search for an existing datasource before creating a new one.** Duplicate datasources create content sprawl, make updates harder (fix in N places instead of 1), and confuse content authors.

```
WRONG:  User says "add a HeroBanner" -> immediately create_component_datasource
RIGHT:  User says "add a HeroBanner" -> search_component_datasources first
        -> found match? -> reuse it (set_component_datasource)
        -> no match?   -> THEN create_component_datasource
```

This is the single most important rule in this skill. Every workflow below follows it.

---

## Capabilities

1. **Search existing datasources** -- Find reusable datasource items for a component by keyword or content
2. **Create new datasources** -- Create a new datasource item when no suitable existing one is found
3. **Link datasources to components** -- Associate a datasource item with a component on a page
4. **Inspect component requirements** -- Get component details including datasource template and allowed fields
5. **Discover allowed components** -- Find which components are permitted in a given placeholder

---

## Context Efficiency -- Avoid Expensive Calls

### list_components Is Expensive

`mcp__marketer-mcp__list_components` returns the full component list for a site and costs approximately **13,000 tokens** per call. This adds up fast and wastes context window budget.

**Prefer these alternatives:**

| Need | Use Instead | Cost |
|:-----|:------------|:-----|
| Component rendering ID | `references/component-registry.md` (local file) | ~2k tokens (one-time read) |
| Component field schema | `references/component-registry.md` (local file) | ~2k tokens (one-time read) |
| Specific component details | `mcp__marketer-mcp__get_component` (single component) | ~500 tokens |
| Allowed components for a slot | `mcp__marketer-mcp__get_allowed_components_by_placeholder` | ~300 tokens |

**Only use `list_components` when:**
- The local component registry is outdated or missing a component
- You need to discover newly added components not yet in the registry
- You are performing a full site audit that requires the complete component manifest

If you must call `list_components`, cache the results mentally for the session -- do not call it again in the same conversation.

---

## Workflow 1: Search and Reuse Existing Datasource

**When to use:** A component needs a datasource and similar content may already exist in the system.

### Steps

1. **Identify the component** -- Get the component rendering ID from `references/component-registry.md` or use `get_component`
2. **Search for existing datasources:**
   ```
   mcp__marketer-mcp__search_component_datasources({
     componentId: "rendering-guid",
     searchQuery: "keyword describing the content"
   })
   ```
3. **Evaluate results:**
   - If a matching datasource is found with the right content -> proceed to link it
   - If a partial match is found -> ask the user if they want to reuse it (possibly updating fields) or create new
   - If no matches -> proceed to Workflow 2 (Create New Datasource)
4. **Link the datasource to the component:**
   ```
   mcp__marketer-mcp__set_component_datasource({
     pageId: "page-guid",
     componentId: "component-instance-id",
     datasourceId: "existing-datasource-guid"
   })
   ```
5. **Confirm** -- Tell the user which datasource was reused and on which component

### Example

```
// User: "Add a HeroBanner with the hospitality content we used before"

// STEP 1: Look up HeroBanner rendering ID from component-registry.md
// -> Rendering ID: 5e9d7b60-f61b-407b-b04b-2eeba60b0ec0

// STEP 2: Search for existing HeroBanner datasources
mcp__marketer-mcp__search_component_datasources({
  componentId: "5e9d7b60-f61b-407b-b04b-2eeba60b0ec0",
  searchQuery: "hospitality"
})
// -> Returns datasource: { id: "abc-123", name: "HeroBanner_Hospitality", fields: {...} }

// STEP 3: Match found -- reuse it
mcp__marketer-mcp__set_component_datasource({
  pageId: "b132d115-7893-49aa-a06f-f1719a8704e3",
  componentId: "component-instance-on-page",
  datasourceId: "abc-123"
})

// Result: Component now shares the same datasource as the original.
// Updating fields on abc-123 will update BOTH component instances.
```

---

## Workflow 2: Create New Datasource

**When to use:** Search returned no suitable existing datasource, and the user needs fresh content.

### Steps

1. **Confirm no existing datasource fits** -- You MUST have run `search_component_datasources` first
2. **Get component details** (if not already known):
   ```
   mcp__marketer-mcp__get_component({
     componentId: "rendering-guid"
   })
   ```
   This returns the datasource template ID, field definitions, and other metadata needed to create a compatible datasource.
3. **Create the datasource:**
   ```
   mcp__marketer-mcp__create_component_datasource({
     componentId: "rendering-guid",
     pageId: "page-guid",
     datasourceName: "HeroBanner_RestaurantLanding"
   })
   ```
4. **Link it to the component:**
   ```
   mcp__marketer-mcp__set_component_datasource({
     pageId: "page-guid",
     componentId: "component-instance-id",
     datasourceId: "newly-created-datasource-guid"
   })
   ```
5. **Populate fields** -- Use `update_content` from the `sitecore-content-author` skill to fill in field values on the new datasource item

### Naming Convention for New Datasources

Use descriptive, unique names that make future search easier:

| Pattern | Example | Why |
|:--------|:--------|:----|
| `{ComponentType}_{PageContext}` | `HeroBanner_RestaurantLanding` | Easy to find by page context |
| `{ComponentType}_{ContentTheme}` | `Card_Hospitality_Overview` | Easy to find by content theme |
| `{ComponentType}_{N}` | `HeroBanner_3` | Fallback when no clear theme |

**Avoid:** Generic names like `HeroBanner_1`, `New Datasource`, or `Copy of HeroBanner` -- these are unsearchable and lead to confusion.

---

## Workflow 3: Link Datasource to Component

**When to use:** A component on a page already exists but needs its datasource reassigned (e.g., swapping content, fixing a broken link, or sharing content across pages).

### Steps

1. **Identify the component instance** -- Use `mcp__marketer-mcp__get_components_on_page` (from `sitecore-content-reader` skill) to find the component's instance ID on the page
2. **Identify the datasource** -- Either:
   - User provides a datasource ID directly
   - Search for the datasource using `search_component_datasources`
3. **Set the datasource:**
   ```
   mcp__marketer-mcp__set_component_datasource({
     pageId: "page-guid",
     componentId: "component-instance-id",
     datasourceId: "target-datasource-guid"
   })
   ```
4. **Verify** -- Confirm the component now points to the correct datasource

### Shared Datasource Warning

When reusing a datasource across multiple components, always inform the user:

```
This datasource is shared across [N] component instances.
Any field updates will affect ALL instances using this datasource.
Confirm you want to share (not copy) this content. (yes/no)
```

---

## Workflow 4: Inspect Component Requirements

**When to use:** You need to understand what datasource structure a component expects before creating or linking one.

### Steps

1. **Check local registry first** -- Read `references/component-registry.md` for rendering ID, fields, and placeholder keys
2. **If not in registry**, get details via MCP:
   ```
   mcp__marketer-mcp__get_component({
     componentId: "rendering-guid"
   })
   ```
   This returns:
   - Datasource template information
   - Required and optional fields
   - Field types and constraints
3. **For placeholder-level discovery:**
   ```
   mcp__marketer-mcp__get_allowed_components_by_placeholder({
     pageId: "page-guid",
     placeholderPath: "headless-main"
   })
   ```
   This returns which components are allowed in a given placeholder -- useful when building page layouts.

---

## Decision Tree: When to Search, Create, or Link

```
User requests datasource operation
|
+-- Does the component already have a datasource?
|   |
|   +-- YES: Does the user want to change it?
|   |   |
|   |   +-- YES: Search for replacement -> Link (Workflow 3)
|   |   +-- NO:  No action needed
|   |
|   +-- NO: Component needs a datasource
|       |
|       +-- Search for existing datasources (Workflow 1)
|           |
|           +-- Match found? -> Reuse it (set_component_datasource)
|           +-- No match?   -> Create new (Workflow 2) -> Link it
```

---

## Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| No search results | No matching datasources exist | Proceed to create a new datasource (Workflow 2) |
| "Component not found" | Invalid rendering ID | Verify the rendering ID from `references/component-registry.md` |
| "Datasource incompatible" | Datasource template does not match component | Use `get_component` to check expected datasource template, then create a compatible one |
| "Component instance not found" | Invalid component instance ID on page | Use `get_components_on_page` to get the correct instance ID |
| `list_components` timeout or large response | Known expensive call | Use `get_component` for a single component or read `references/component-registry.md` locally |
| "Item already exists" | Duplicate datasource name | Use a more specific name with page context or content theme |

---

## Safety Rules

- **ALWAYS search before creating** -- This is non-negotiable. Never create a datasource without first searching for an existing one.
- **Warn about shared datasources** -- If linking a datasource that is already used elsewhere, inform the user that changes will propagate to all instances.
- **Describe before executing** -- Tell the user what you are about to do (create, link, or reuse) and wait for confirmation.
- **Never delete datasources** -- This skill does not handle deletion. Orphaned datasources should be flagged for manual cleanup.
- **All changes are drafts** -- Creating or linking datasources does not publish content. Publishing requires the `sitecore-content-publisher` skill.

---

## Guidelines

- Prefer `references/component-registry.md` over `list_components` for rendering IDs and field schemas -- saves approximately 11,000 tokens per lookup
- Use descriptive datasource names to make future `search_component_datasources` calls effective
- When multiple components on a page share the same content (e.g., a repeated CTA), use a single shared datasource rather than creating duplicates
- If the user is unsure whether to reuse or create, default to showing search results and letting them decide
- After linking a datasource, suggest the user verify the page via `get_page_preview_url` (from `sitecore-content-reader` skill)
- For bulk operations (linking datasources to 3+ components), present the full plan and get approval before executing
- Cross-reference with the `sitecore-content-author` skill when new datasources need field population after creation
