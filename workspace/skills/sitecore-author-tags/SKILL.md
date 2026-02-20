---
name: sitecore-author-tags
description: Auto-invoked when user says "add [tag name] tag", "tag this with [name]", or mentions tagging by name (not ID). Maps tag names like "Healthcare" to Sitecore IDs deterministically. (project)
---

# Tag Author Skill

**Version:** 1.0

## What I do

- Map tag names to Sitecore tag item IDs (deterministic)
- Add tags to pages by name (e.g., "Healthcare" → `4da2e751-bad8-4f69-9c70-850504662fdd`)
- Update SxaTags field with proper format
- Support adding, replacing, and removing tags
- Handle multiple tags in single operation

## Expected Output Format

```
Done! Updated tags on [Page Name]:
• Added: Healthcare, Technology
• Tags: Healthcare, Technology, Innovation

Preview: https://xmc-main-xxx.sitecorecloud.io/...
```

## When to use

Use this skill when:

- User says "add [tag name] tag" or "tag this with [tag name]"
- User specifies tags by name (not ID)
- Need to update article/page categorization
- Need to add/remove/replace tags on any page

## Trigger Patterns (Auto-Invoke)

**Automatically invoke this skill when user mentions tags BY NAME:**

| User Input | Action | Example |
|:-----------|:-------|:--------|
| "add [name] tag" | Add tag by name | "Add Healthcare tag" |
| "tag with [name]" | Add tag by name | "Tag with Technology and AI" |
| "add tags: [list]" | Add multiple tags | "Add tags: Healthcare, Aerospace" |
| "update tags to [list]" | Replace tags | "Update tags to just Healthcare" |
| "remove [name] tag" | Remove specific tag | "Remove Technology tag" |
| "tag this with [names]" | Add tags to current context | "Tag this with Healthcare, Aerospace" |

**Keywords that trigger this skill:**
- Tag names without IDs: "Healthcare", "Technology", "AI", etc.
- Phrases: "tag with", "add tag", "update tags"
- When user provides tag names (not GUIDs)

**Do NOT use this skill for:**
- Tag operations with explicit GUIDs (direct MCP call)
- Listing available tags (just read the catalog)
- Creating new tag items (requires different workflow)

---

## Tag Reference Catalog

Complete mapping of tag names → Sitecore item IDs.

### Year Tags

| Tag Name | Tag Value | Item ID |
|:---------|:----------|:--------|
| 2024 | `year:2024` | `d9e4e588-28be-4f16-947b-efee69765d99` |
| 2025 | `year:2025` | `e234d81f-361e-4cee-9e7d-aab49b78ee29` |

### Industries

| Tag Name | Tag Value | Item ID |
|:---------|:----------|:--------|
| Healthcare | `industries:Healthcare` | `4da2e751-bad8-4f69-9c70-850504662fdd` |
| Aerospace | `industries:Aerospace` | `3ad028ef-640b-47c9-9dc4-8f15539a5d2e` |
| Associations and Non Profits | `industries:Associations and Non Profits` | TBD via MCP |
| Automotive | `industries:Automotive` | TBD via MCP |
| Consumer Goods | `industries:Consumer Goods` | TBD via MCP |
| Electronics | `industries:Electronics` | TBD via MCP |
| Engineering | `industries:Engineering` | TBD via MCP |
| Financial Services | `industries:Financial Services` | TBD via MCP |
| Government | `industries:Government` | TBD via MCP |
| Manufacturing | `industries:Manufacturing` | TBD via MCP |
| Oil and Gas | `industries:Oil and Gas` | TBD via MCP |
| Technology | `industries:Technology` | TBD via MCP |
| Utilities and Energy | `industries:Utilities and Energy` | TBD via MCP |
| Water Treatment | `industries:Water Treatment` | TBD via MCP |

### Innovation

| Tag Name | Tag Value | Item ID |
|:---------|:----------|:--------|
| AI | `innovation:AI` | TBD via MCP |
| Clean Energy | `innovation:Clean Energy` | TBD via MCP |
| Faculty Research | `innovation:Faculty Research` | TBD via MCP |
| Patents | `innovation:Patents` | TBD via MCP |
| R and D Capabilities | `innovation:R and D Capabilities` | TBD via MCP |
| Smart Grid | `innovation:Smart Grid` | TBD via MCP |
| Student Research | `innovation:Student Research` | TBD via MCP |
| Technology Partners | `innovation:Technology Partners` | TBD via MCP |

### Customers

| Tag Name | Tag Value | Item ID |
|:---------|:----------|:--------|
| Residential | `customers:Residential` | `ed1f4bdc-39a3-40fc-b614-6eeddbe189dc` |
| Account Management | `customers:Account Management` | TBD via MCP |
| Commercial | `customers:Commercial` | TBD via MCP |
| Emergency Preparedness | `customers:Emergency Preparedness` | TBD via MCP |
| Industrial | `customers:Industrial` | TBD via MCP |

### Services

| Tag Name | Tag Value | Item ID |
|:---------|:----------|:--------|
| Business Analysis | `services:Business Analysis` | TBD via MCP |
| Change Management | `services:Change Management` | TBD via MCP |
| Communication | `services:Communication` | TBD via MCP |
| Compliance Solutions | `services:Compliance Solutions` | TBD via MCP |
| Corporate Finance | `services:Corporate Finance` | TBD via MCP |
| Custom Solutions | `services:Custom Solutions` | TBD via MCP |
| Environmental Impact | `services:Environmental Impact` | TBD via MCP |
| Investment Planning | `services:Investment Planning` | TBD via MCP |
| Manufacturing Solutions | `services:Manufacturing Solutions` | TBD via MCP |
| Market Analysis | `services:Market Analysis` | TBD via MCP |
| Operations | `services:Operations` | TBD via MCP |
| Process Optimization | `services:Process Optimization` | TBD via MCP |
| Professional Services | `services:Professional Services` | TBD via MCP |
| Project Management | `services:Project Management` | TBD via MCP |
| Quality Assurance | `services:Quality Assurance` | TBD via MCP |
| Risk Management | `services:Risk Management` | TBD via MCP |
| Strategy Consulting | `services:Strategy Consulting` | TBD via MCP |
| Supply Chain | `services:Supply Chain` | TBD via MCP |
| Training and Development | `services:Training and Development` | TBD via MCP |
| Wealth Management | `services:Wealth Management` | TBD via MCP |

### Programs

| Tag Name | Tag Value | Item ID |
|:---------|:----------|:--------|
| Advocacy | `programs:Advocacy` | TBD via MCP |
| Community Outreach | `programs:Community Outreach` | TBD via MCP |
| Education | `programs:Education` | TBD via MCP |
| Emergency Preparedness | `programs:Emergency Preparedness` | TBD via MCP |
| Environmental Impact | `programs:Environmental Impact` | TBD via MCP |
| Grant Programs | `programs:Grant Programs` | TBD via MCP |
| Public Safety | `programs:Public Safety` | TBD via MCP |
| Regulatory Compliance | `programs:Regulatory Compliance` | TBD via MCP |

### Resources

| Tag Name | Tag Value | Item ID |
|:---------|:----------|:--------|
| Best Practices | `resources:Best Practices` | TBD via MCP |
| Compliance Docs | `resources:Compliance Docs` | TBD via MCP |
| Educational | `resources:Educational` | TBD via MCP |
| Forms and Documents | `resources:Forms and Documents` | TBD via MCP |
| Innovation | `resources:Innovation` | TBD via MCP |
| Leadership | `resources:Leadership` | TBD via MCP |
| Planning Tools | `resources:Planning Tools` | TBD via MCP |
| Research | `resources:Research` | TBD via MCP |
| Safety Guidelines | `resources:Safety Guidelines` | TBD via MCP |
| Toolkits | `resources:Toolkits` | TBD via MCP |

### Product Category

| Tag Name | Tag Value | Item ID |
|:---------|:----------|:--------|
| Connectivity | `productcategory:Connectivity` | TBD via MCP |
| Controllers | `productcategory:Controllers` | TBD via MCP |
| Motors and Drives | `productcategory:Motors and Drives` | TBD via MCP |
| Sensors | `productcategory:Sensors` | TBD via MCP |
| Valves and Actuators | `productcategory:Valves and Actuators` | TBD via MCP |

### Product Type

| Tag Name | Tag Value | Item ID |
|:---------|:----------|:--------|
| Flow Control | `producttype:Flow Control` | TBD via MCP |
| PLC | `producttype:PLC` | TBD via MCP |
| Pressure | `producttype:Pressure` | TBD via MCP |
| Servo | `producttype:Servo` | TBD via MCP |

---

## Tag Lookup Workflow

### When tag ID is known (from catalog above)

```javascript
// Direct update - no lookup needed
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: {
    SxaTags: "{4DA2E751-BAD8-4F69-9C70-850504662FDD}|{3AD028EF-640B-47C9-9DC4-8F15539A5D2E}"
  }
});
```

### When tag ID is NOT in catalog (marked as "TBD via MCP")

1. **Look up tag by path**
```javascript
// Determine category from tag name or user context
const tagCategory = "Industries"; // or Services, Innovation, etc.
const tagName = "Technology";

const tagItem = await marketer_get_content_item_by_path({
  itemPath: `/sitecore/content/sites/main/Settings/Component Settings/Tags/${tagCategory}/${tagName}`,
  language: "en"
});

// Returns: { itemId: "tag-guid", fields: { Title: "industries:Technology" } }
```

2. **Update catalog (for future reference)**
- Add the discovered ID to this skill's reference catalog
- Commit the update to make it available for next time

---

## SxaTags Field Format

The `SxaTags` field uses pipe-separated GUIDs in braces:

**Single tag:**
```
{4DA2E751-BAD8-4F69-9C70-850504662FDD}
```

**Multiple tags:**
```
{4DA2E751-BAD8-4F69-9C70-850504662FDD}|{3AD028EF-640B-47C9-9DC4-8F15539A5D2E}
```

**Format rules:**
- Uppercase GUIDs
- Wrapped in braces `{}`
- Pipe-separated `|`
- No spaces

---

## Common Operations

### Add Tags (Keep Existing)

```javascript
// 1. Get current tags
const currentPage = await marketer_get_content_item_by_id({
  itemId: pageId,
  language: "en"
});

const currentTags = currentPage.fields.SxaTags || "";

// 2. Add new tags
const newTagIds = [
  "{4DA2E751-BAD8-4F69-9C70-850504662FDD}", // Healthcare
  "{3AD028EF-640B-47C9-9DC4-8F15539A5D2E}"  // Aerospace
];

const updatedTags = currentTags
  ? `${currentTags}|${newTagIds.join("|")}`
  : newTagIds.join("|");

// 3. Update field
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: { SxaTags: updatedTags }
});
```

### Replace All Tags

```javascript
// Replace entire tag list
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: {
    SxaTags: "{4DA2E751-BAD8-4F69-9C70-850504662FDD}|{3AD028EF-640B-47C9-9DC4-8F15539A5D2E}"
  }
});
```

### Remove Specific Tags

```javascript
// 1. Get current tags
const currentTags = "{TAG1}|{TAG2}|{TAG3}";

// 2. Filter out unwanted tag
const tagsArray = currentTags.split("|");
const filteredTags = tagsArray.filter(tag => tag !== "{TAG2}");

// 3. Update
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: { SxaTags: filteredTags.join("|") }
});
```

### Clear All Tags

```javascript
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: { SxaTags: "" }
});
```

---

## Tag Name Parsing

When user provides tag names, use smart matching:

| User Input | Matches | Item ID |
|:-----------|:--------|:--------|
| "Healthcare" | industries:Healthcare | `4da2e751-bad8-4f69-9c70-850504662fdd` |
| "healthcare" | industries:Healthcare | `4da2e751-bad8-4f69-9c70-850504662fdd` |
| "Aerospace" | industries:Aerospace | `3ad028ef-640b-47c9-9dc4-8f15539a5d2e` |
| "AI" | innovation:AI | Look up via MCP |
| "2024" | year:2024 | `d9e4e588-28be-4f16-947b-efee69765d99` |

**Matching rules:**
- Case-insensitive matching on tag name
- Check all categories (industries, services, innovation, etc.)
- If ambiguous, ask user to clarify category
- If not found in catalog, look up via MCP

---

## Usage Examples

### Example 1: Add tags by name
```
User: "Add Healthcare and Aerospace tags"

Response:
1. Lookup: "Healthcare" → 4da2e751-bad8-4f69-9c70-850504662fdd
2. Lookup: "Aerospace" → 3ad028ef-640b-47c9-9dc4-8f15539a5d2e
3. Update: SxaTags = "{4DA2E751-BAD8-4F69-9C70-850504662FDD}|{3AD028EF-640B-47C9-9DC4-8F15539A5D2E}"
4. Get preview URL

Output: "Done! Added Healthcare, Aerospace tags to [Page Name]"
```

### Example 2: Tag with multiple categories
```
User: "Tag this with Technology and AI"

Response:
1. "Technology" matches industries:Technology → Look up ID via MCP
2. "AI" matches innovation:AI → Look up ID via MCP
3. Update SxaTags field
4. Get preview URL
```

### Example 3: Replace tags
```
User: "Change tags to just Healthcare"

Response:
1. "Healthcare" → 4da2e751-bad8-4f69-9c70-850504662fdd
2. Replace (not append): SxaTags = "{4DA2E751-BAD8-4F69-9C70-850504662FDD}"
3. Get preview URL
```

---

## Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| Tag name not found | Typo or non-existent tag | List available tags, ask user to clarify |
| Multiple matches | Ambiguous name | Ask user to specify category |
| Field update fails | Wrong format | Verify GUID format (uppercase, braces, pipes) |
| Empty result | Tag ID not in catalog | Look up via MCP, update catalog |

---

## Catalog Maintenance

**When you discover a new tag ID:**

1. Look up the tag via MCP
2. Update this skill file with the discovered ID
3. Replace "TBD via MCP" with actual GUID
4. Ensure proper formatting (uppercase)

**Example update:**
```markdown
| Technology | `industries:Technology` | `A1B2C3D4-5678-90AB-CDEF-1234567890AB` |
```

---

## Integration with Other Skills

**Used by:**
- `/sitecore-author-article-page` - For article tagging
- `/sitecore-author` - For general page tagging

**Related to:**
- `.claude/data/site-config.md` - Site configuration
- Tag items at: `/sitecore/content/sites/main/Settings/Component Settings/Tags/`

---

## Preview URL (When Updating Existing Pages)

If updating an existing page with tags, ALWAYS get preview URL:

```javascript
const preview = await marketer_get_page_preview_url({
  pageId: pageId,
  language: "en"
});
```

Include in final response.
