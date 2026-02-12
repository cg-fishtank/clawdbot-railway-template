---
name: sitecore-personalization
description: A/B testing and audience targeting for SitecoreAI pages using personalization variants. Use when the user wants to create page variants for different audiences (returning visitors, mobile users, geographic regions), set up A/B tests, or inspect existing personalization rules. Requires condition templates before creating variants.
allowed-tools:
  - mcp__marketer-mcp__get_personalization_versions_by_page
  - mcp__marketer-mcp__create_personalization_version
  - mcp__marketer-mcp__get_personalization_condition_templates
  - mcp__marketer-mcp__get_personalization_condition_template_by_id
---

# Sitecore Personalization

**A/B testing and audience targeting for SitecoreAI pages via marketer-mcp.**

---

## Capabilities

1. **View existing personalization variants** — List all personalization versions configured on a page
2. **Browse condition templates** — Discover available targeting conditions (device, geography, visitor behavior, etc.)
3. **Inspect condition template details** — Get the full schema and parameters for a specific condition template
4. **Create personalization variants** — Add new page variants with audience-targeting conditions for A/B testing or segment-specific content

---

## Critical: Dependency Ordering

Personalization tools have a **strict dependency chain**. You must follow this order:

```
Step 1: get_personalization_condition_templates    (discover available conditions)
        ↓
Step 2: get_personalization_condition_template_by_id  (get schema for chosen condition)
        ↓
Step 3: create_personalization_version             (create variant using condition data)
```

- **NEVER attempt to create a personalization version without first retrieving condition templates.** The `create_personalization_version` tool requires condition data that comes from the template tools.
- **Always confirm the condition template schema** before building the variant — different templates have different required parameters.
- `get_personalization_versions_by_page` can be called at any time (no dependencies) and is useful both before and after creating variants.

---

## Workflow: Setting Up a Personalization Variant

This is the primary workflow. Follow every step in order.

### 1. Inspect Current State

Before adding personalization, check what already exists on the page:

```
mcp__marketer-mcp__get_personalization_versions_by_page
  → pageId: [PAGE_ID]
```

If the page already has variants, review them to avoid duplicates or conflicts.

### 2. Browse Available Condition Templates

Retrieve the full list of condition templates to understand what targeting options are available:

```
mcp__marketer-mcp__get_personalization_condition_templates
```

This returns all available condition types. Common categories include:
- **Device/browser** — Target mobile vs desktop users
- **Geographic** — Target by country, region, or city
- **Visitor behavior** — Target new vs returning visitors, visit count
- **Traffic source** — Target by referrer, campaign, or UTM parameters
- **Date/time** — Target by day of week, time of day, or date range

Present the available templates to the user so they can choose the right targeting condition.

### 3. Get Condition Template Details

Once the user selects a condition type, retrieve its full schema:

```
mcp__marketer-mcp__get_personalization_condition_template_by_id
  → templateId: [TEMPLATE_ID]
```

This returns:
- Required parameters and their types
- Allowed values or value ranges
- Default values (if any)
- Description of what the condition evaluates

**Review the schema carefully** — each template has different parameters. For example, a geographic condition may require a country code, while a device condition may require a device type enum.

### 4. Create the Personalization Version

With the condition template data in hand, create the variant:

```
mcp__marketer-mcp__create_personalization_version({
  pageId: "[PAGE_ID]",
  name: "Mobile Visitors Variant",
  variantName: "mobile-variant",
  audienceName: "Mobile Users",
  conditionTemplateId: "[TEMPLATE_ID_FROM_STEP_2]",
  language: "en",
  conditionParams: { ... }
})
```

**Required parameters:**
- `pageId`: The page to add personalization to
- `name`: Display name for this personalization version
- `variantName`: Machine-friendly variant identifier
- `audienceName`: Human-readable audience label
- `conditionTemplateId`: GUID of the condition template (from Step 2)

**Optional parameters:**
- `language`: Language code (default: `"en"`)
- `conditionParams`: Additional parameters specific to the condition template (from Step 3 schema)

After creation, confirm success by calling `get_personalization_versions_by_page` again to verify the new variant appears.

---

## Workflow: Auditing Existing Personalization

When the user wants to understand what personalization is already configured:

1. Call `mcp__marketer-mcp__get_personalization_versions_by_page` with the page ID
2. For each variant found, note:
   - Variant name/label
   - Condition type and parameters
   - Whether it is active or inactive
3. Present in a structured report:

```
Personalization Report: [Page Name]

Variants configured: [N]

1. [Variant Name]
   Condition: [Type] — [Description]
   Parameters: [Key details]
   Status: Active / Inactive

2. [Variant Name]
   Condition: [Type] — [Description]
   Parameters: [Key details]
   Status: Active / Inactive

Default (no conditions): Serves when no variant conditions match
```

---

## Use Cases

### A/B Testing

Create two or more variants of a page to test different content approaches:

1. **Identify the page** to test (get the page ID via search or direct reference)
2. **Get condition templates** — for A/B testing, look for percentage-based or random-split conditions
3. **Create Variant A** with one set of conditions (e.g., 50% of traffic)
4. **Create Variant B** with complementary conditions (e.g., remaining 50%)
5. **Verify** both variants are configured correctly

> **Tip:** Always confirm with the user what content changes will differ between variants before creating them. The personalization variant controls *which version is served*, but the content on each variant may need to be edited separately using the `sitecore-content-author` skill.

### Returning Visitor Targeting

Show different content to first-time vs returning visitors:

1. Browse condition templates for a "returning visitor" or "visit count" condition
2. Get the template details to understand parameters
3. Create a variant targeting returning visitors (e.g., visit count > 1)
4. The default version automatically serves first-time visitors

### Mobile User Targeting

Serve optimized content to mobile users:

1. Browse condition templates for "device type" or "screen size" conditions
2. Get the template details
3. Create a variant targeting mobile devices
4. The default version serves desktop users

### Geographic Targeting

Show region-specific content (e.g., different promotions by country):

1. Browse condition templates for "country" or "geographic location" conditions
2. Get the template details — note required format for country/region codes
3. Create a variant for each target region
4. The default version serves visitors outside the targeted regions

---

## Guidelines

- **Always start by browsing condition templates** — never assume you know what templates are available or what parameters they require. The available templates may change over time.
- **Confirm the user's targeting intent before creating variants** — personalization variants affect what real users see. Clarify the audience, the goal, and the content differences before proceeding.
- **Check for existing variants first** — avoid creating duplicate or conflicting personalization rules on the same page.
- **The default version always exists** — every page has a default (unconditioned) version. Personalization variants are layered on top, and the default serves as the fallback when no conditions match.
- **Personalization is not the same as content editing** — this skill controls *which variant is served to which audience*. To change the actual content within a variant, use the `sitecore-content-author` skill.
- **If a tool call fails**, report the error clearly and do not retry automatically. Condition template IDs or page IDs may be incorrect.
- **Document what was created** — after setting up personalization, summarize all variants and their conditions so the team has a clear record.

---

## Error Handling

- **No condition templates returned:** The marketer-mcp connection may be down or the Sitecore instance may not have personalization configured. Report this and suggest checking MCP status.
- **Invalid template ID:** The user may have referenced a template that no longer exists. Re-fetch the template list to get current options.
- **Create variant fails:** Check that the page ID is valid and that the condition parameters match the template schema exactly. Report the specific error.
- **Page has no variants:** This is normal — it means the page serves the same content to all visitors. Only a default version exists.
