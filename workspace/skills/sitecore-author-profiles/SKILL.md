---
name: sitecore-author-profiles
description: Auto-invoked when user says "add [profile name] profile", "author [name]", or mentions adding profiles by name (not ID). Maps profile names like "Thomas Anderson" to Sitecore IDs deterministically. (project)
---

# Profile Author Skill

**Version:** 1.0

## What I do

- Map profile names to Sitecore profile item IDs (deterministic)
- Add profiles to pages by name (e.g., "Thomas Anderson" → `6a0b9814-d0d3-484e-8305-ed1bdf835c60`)
- Update profiles field with proper format
- Support adding, replacing, and removing profiles
- Handle multiple profiles in single operation

## Expected Output Format

```
Done! Updated profiles on [Page Name]:
• Added: Thomas Anderson
• Profiles: Thomas Anderson, Sarah Mitchell

Preview: https://xmc-main-xxx.sitecorecloud.io/...
```

## When to use

Use this skill when:

- User says "add [profile name] profile" or "set author to [name]"
- User specifies profiles by name (not ID)
- Need to update article/page author attribution
- Need to add/remove/replace profiles on any page

## Trigger Patterns (Auto-Invoke)

**Automatically invoke this skill when user mentions profiles BY NAME:**

| User Input | Action | Example |
|:-----------|:-------|:--------|
| "add [name] profile" | Add profile by name | "Add Thomas Anderson profile" |
| "set author to [name]" | Add profile by name | "Set author to Sarah Mitchell" |
| "add profiles: [list]" | Add multiple profiles | "Add profiles: Thomas Anderson, Jane Doe" |
| "update profiles to [list]" | Replace profiles | "Update profiles to just John Doe" |
| "remove [name] profile" | Remove specific profile | "Remove Thomas Anderson profile" |
| "authored by [name]" | Add profile attribution | "Authored by Sarah Mitchell" |

**Keywords that trigger this skill:**
- Profile names: "Thomas Anderson", "Sarah Mitchell", "Jane Doe", etc.
- Phrases: "author", "profile", "add profile", "set author"
- When user provides profile names (not GUIDs)

**Do NOT use this skill for:**
- Profile operations with explicit GUIDs (direct MCP call)
- Listing available profiles (just read the catalog)
- Creating new profile items (requires different workflow)

---

## Profile Reference Catalog

**See `references/profile-catalog.md` for the complete mapping of profile names → Sitecore item IDs.**

The catalog contains 23 profiles with deterministic name-to-ID mappings. All profiles are located under:
`/sitecore/content/sites/main/Settings/Component Settings/Profiles/`

---

## Profile Lookup Workflow

### Direct lookup from catalog

```javascript
// All profile IDs are in the catalog above - no MCP lookup needed
const profileId = "6a0b9814-d0d3-484e-8305-ed1bdf835c60"; // Thomas Anderson

await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: {
    profiles: "{6A0B9814-D0D3-484E-8305-ED1BDF835C60}"
  }
});
```

### If profile not in catalog (rare)

1. **Look up profile by path**
```javascript
const profileName = "New Profile Name";

const profileItem = await marketer_get_content_item_by_path({
  itemPath: `/sitecore/content/sites/main/Settings/Component Settings/Profiles/${profileName}`,
  language: "en"
});

// Returns: { itemId: "profile-guid", fields: { firstName: "...", lastName: "..." } }
```

2. **Update catalog (for future reference)**
- Add the discovered ID to this skill's reference catalog
- Commit the update to make it available for next time

---

## Profiles Field Format

The `profiles` field uses pipe-separated GUIDs in braces (same as tags):

**Single profile:**
```
{6A0B9814-D0D3-484E-8305-ED1BDF835C60}
```

**Multiple profiles:**
```
{6A0B9814-D0D3-484E-8305-ED1BDF835C60}|{ABC123DE-F456-7890-ABCD-EF1234567890}
```

**Format rules:**
- Uppercase GUIDs
- Wrapped in braces `{}`
- Pipe-separated `|`
- No spaces

---

## Common Operations

### Add Profiles (Keep Existing)

```javascript
// 1. Get current profiles
const currentPage = await marketer_get_content_item_by_id({
  itemId: pageId,
  language: "en"
});

const currentProfiles = currentPage.fields.profiles || "";

// 2. Add new profiles
const newProfileIds = [
  "{6A0B9814-D0D3-484E-8305-ED1BDF835C60}", // Thomas Anderson
  "{ABC123DE-F456-7890-ABCD-EF1234567890}"  // Sarah Mitchell
];

const updatedProfiles = currentProfiles
  ? `${currentProfiles}|${newProfileIds.join("|")}`
  : newProfileIds.join("|");

// 3. Update field
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: { profiles: updatedProfiles }
});
```

### Replace All Profiles

```javascript
// Replace entire profile list
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: {
    profiles: "{6A0B9814-D0D3-484E-8305-ED1BDF835C60}|{ABC123DE-F456-7890-ABCD-EF1234567890}"
  }
});
```

### Remove Specific Profile

```javascript
// 1. Get current profiles
const currentProfiles = "{PROFILE1}|{PROFILE2}|{PROFILE3}";

// 2. Filter out unwanted profile
const profilesArray = currentProfiles.split("|");
const filteredProfiles = profilesArray.filter(profile => profile !== "{PROFILE2}");

// 3. Update
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: { profiles: filteredProfiles.join("|") }
});
```

### Clear All Profiles

```javascript
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: { profiles: "" }
});
```

---

## Profile Name Parsing

When user provides profile names, use smart matching:

| User Input | Matches | Item ID |
|:-----------|:--------|:--------|
| "Thomas Anderson" | Thomas Anderson | `6a0b9814-d0d3-484e-8305-ed1bdf835c60` |
| "thomas anderson" | Thomas Anderson | `6a0b9814-d0d3-484e-8305-ed1bdf835c60` |
| "Sarah Mitchell" | Sarah Mitchell | `abc123de-f456-7890-abcd-ef1234567890` |
| "Jane Doe" | Jane Doe | `899df5ba-801b-4601-9bef-088a7d46ef3b` |
| "John" | John Doe | `2c825391-cf0b-471e-9d3c-e8210106fd9b` |

**Matching rules:**
- Case-insensitive matching on profile name
- Partial name matching (first or last name alone)
- Full name preferred over partial match
- If ambiguous, ask user to clarify
- Support both "FirstName LastName" and "LastName, FirstName" formats

---

## Usage Examples

### Example 1: Add profile by name
```
User: "Add Thomas Anderson profile"

Response:
1. Lookup: "Thomas Anderson" → 6a0b9814-d0d3-484e-8305-ed1bdf835c60
2. Update: profiles = "{6A0B9814-D0D3-484E-8305-ED1BDF835C60}"
3. Get preview URL

Output: "Done! Added Thomas Anderson profile to [Page Name]"
```

### Example 2: Set article author
```
User: "Set author to Sarah Mitchell"

Response:
1. "Sarah Mitchell" → abc123de-f456-7890-abcd-ef1234567890
2. Replace profiles field
3. Get preview URL
```

### Example 3: Add multiple authors
```
User: "Add profiles Thomas Anderson and Jane Doe"

Response:
1. "Thomas Anderson" → 6a0b9814-d0d3-484e-8305-ed1bdf835c60
2. "Jane Doe" → 899df5ba-801b-4601-9bef-088a7d46ef3b
3. Update profiles field (append if existing profiles)
4. Get preview URL
```

---

## Error Handling

| Error | Cause | Solution |
|:------|:------|:---------|
| Profile name not found | Typo or non-existent profile | List available profiles, ask user to clarify |
| Multiple matches | Ambiguous name (e.g., "Sarah") | Ask user to specify full name |
| Field update fails | Wrong format | Verify GUID format (uppercase, braces, pipes) |
| Empty result | Profile ID not in catalog | Look up via MCP, update catalog |

---

## Profile Fields Reference

Each profile item contains these fields:
- **firstName** - First name
- **lastName** - Last name
- **email** - Contact email
- **role** - Job title/position
- **company** - Organization name
- **phone** - Contact phone number
- **image** - Profile image (media ID)
- **imageMobile** - Mobile-optimized image
- **description** - Bio/description (rich text)
- **expertise** - Areas of expertise (multi-value)
- **location** - Geographic location
- **website** - External website link
- **linkedInLink** - LinkedIn profile URL

---

## Integration with Other Skills

**Used by:**
- `/sitecore-author-article-page` - For article author attribution
- `/sitecore-author` - For general page profile assignment

**Related to:**
- `.claude/data/site-config.md` - Site configuration
- Profile items at: `/sitecore/content/sites/main/Settings/Component Settings/Profiles/`

---

## Preview URL (When Updating Existing Pages)

If updating an existing page with profiles, ALWAYS get preview URL:

```javascript
const preview = await marketer_get_page_preview_url({
  pageId: pageId,
  language: "en"
});
```

Include in final response.
