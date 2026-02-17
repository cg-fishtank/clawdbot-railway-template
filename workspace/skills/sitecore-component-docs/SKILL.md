---
name: sitecore-component-docs
description: Discover and provide Sitecore Component documentation when authoring components via MCP. This skill MUST be used every time a component is authored.
---

# Sitecore Component Docs (Automatic)

**Version:** 2.0

## How It Works

This skill activates **automatically** when Claude detects component authoring.
No manual invocation is needed.

### Automatic Activation Triggers

Claude MUST activate this skill when:

- Calling `mcp__marketer-mcp__add_component_on_page`
- Calling `mcp__marketer-mcp__create_component_datasource`
- Calling `mcp__marketer-mcp__set_component_datasource`
- Any workflow that adds or configures a component

---

## Required Workflow

**BEFORE calling any component authoring MCP tool:**

### Step 1: Extract Component Name

Identify the component from:

- `componentRenderingId` parameter (e.g., "ArticleBanner")
- User request mentioning component name
- Migration map component mappings

### Step 2: Search for Component Documentation

```
Glob: /data/workspace/skills/sitecore-component-docs/**/{ComponentName}/{ComponentName}.md
```

Example searches:

- ArticleBanner → `/data/workspace/skills/sitecore-component-docs/**/ArticleBanner/ArticleBanner.md`
- HeroBanner → `/data/workspace/skills/sitecore-component-docs/**/HeroBanner/HeroBanner.md`
- CardGrid → `/data/workspace/skills/sitecore-component-docs/**/CardGrid/CardGrid.md`

### Step 3: Read and Apply Documentation

**If component documentation found:**

1. Read the entire file
2. Extract "MCP Authoring Instructions" section
3. Apply field formats to MCP call parameters
4. Validate fields against "Fields" table
5. Use correct field types (Image XML, Link XML, RichText format)

**If component documentation NOT found:**

1. Proceed with `sitecore-content-author/references/component-registry.md` field definitions
2. Use standard field type formats from sitecore-author skills

---

## Documentation Structure

When component documentation exists, it contains:

| Section                        | Purpose                               |
| ------------------------------ | ------------------------------------- |
| **Fields**                     | Field names, types, required/optional |
| **MCP Authoring Instructions** | Exact field formats for MCP calls     |
| **JSS Field Mapping**          | How fields render in Next.js          |
| **Content Matrix**             | Required vs optional field validation |
| **Troubleshooting**            | Common issues and fixes               |

---

## Documentation Location Pattern

All Sitecore Component Docs are stored in this skill's folder:

```
/data/workspace/skills/sitecore-component-docs/references/{Category}/{ComponentName}/{ComponentName}.md
```

Categories: Account, Articles, Authors, Banners, Cards, Containers, Events, Footer, IconFeatureCards, Navigation, Page Content, Products, Search, Tabs, WhereToBuy

**65 component documentation files are available.** Documentation is discovered dynamically by component name.

---

## Related Skills

| Skill                    | Integration                                                |
| ------------------------ | ---------------------------------------------------------- |
| `/sitecore-author`       | Orchestrates authoring; calls this skill automatically     |
| `/sitecore-author-image` | Image field formats from Sitecore Component Docs           |
| `/sitecore-author-link`  | Link field formats from Sitecore Component Docs            |
| `/component-lookup`      | Fallback for rendering IDs when no Sitecore Component Docs |
| `/field-validator`       | Validates field names before MCP calls                     |

---

## Example: Automatic Workflow

**User request:** "Add an ArticleBanner to the page with title 'Welcome'"

**Claude (internal process):**

1. Detected: ArticleBanner component authoring
2. Glob search: `/data/workspace/skills/sitecore-component-docs/**/ArticleBanner/ArticleBanner.md`
3. Found: `/data/workspace/skills/sitecore-component-docs/references/Articles/ArticleBanner/ArticleBanner.md`
4. Read documentation
5. Apply MCP authoring format:
   ```json
   {
   	"pageId": "...",
   	"componentRenderingId": "ArticleBanner",
   	"placeholderPath": "...",
   	"fields": {
   		"headline": "Welcome"
   	}
   }
   ```
6. Execute MCP call with correct field formats
