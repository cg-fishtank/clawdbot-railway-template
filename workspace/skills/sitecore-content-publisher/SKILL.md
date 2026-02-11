---
name: sitecore-content-publisher
description: Publish SitecoreAI content with mandatory Slack approval. Use when the user wants to make draft content live (publish pages). This is a destructive operation that requires explicit human approval via emoji reaction in Slack before execution. Never auto-publishes.
allowed-tools:
  - mcp__marketer-mcp__get_components_on_page
  - mcp__marketer-mcp__get_page_preview_url
---

# Sitecore Content Publisher

**Publish SitecoreAI content with mandatory human approval. Every publish requires explicit emoji reaction (✅) before execution. Approval requests are always posted to #ai-agent-workflows for team visibility, even if the conversation started in a DM.**

> **IMPORTANT:** This skill depends on marketer-mcp having a publish capability. If no publish tool is available, this skill can only prepare the publish request and guide the user to publish manually. Check available marketer-mcp tools before attempting.

## Approval Workflow

Publishing is a **destructive operation** — it makes content live and visible to end users. The approval gate is mandatory and cannot be bypassed.

### Single Page Publish

1. User requests a page be published
2. Use `mcp__marketer-mcp__get_components_on_page` to inspect current page state
3. Use `mcp__marketer-mcp__get_page_preview_url` to get preview URL
4. Post the approval request in #ai-agent-workflows:

```
⚠️ Publish Approval Required

Page: [Page Name/Path]
Components: [count] components configured
Preview: [Preview URL]

What will happen:
- This page will become live and visible to end users
- Current published version (if any) will be replaced

Please review the preview, then:
✅ React to approve and publish
❌ React to reject and cancel
```

5. **Wait for a reaction** — do NOT proceed without one
6. On ✅: Execute the publish (if tool available) or provide manual publish instructions
7. On ❌: Respond "Publish cancelled. Page remains as draft."
8. If no reaction in 10 minutes: post a reminder
9. If no reaction in 30 minutes total: cancel automatically with a message

### Bulk Publish (3+ pages)

Bulk publish has a **stricter gate** because the blast radius is larger:

1. List all pages to be published with their preview URLs
2. Post the approval request:

```
⚠️ BULK Publish Approval Required — [N] pages

Pages to publish:
1. [Page Name] — Preview: [URL]
2. [Page Name] — Preview: [URL]
3. [Page Name] — Preview: [URL]

⚠️ This will make ALL listed pages live simultaneously.

Please review each preview, then:
✅ React to approve ALL
❌ React to reject ALL
```

3. Same wait/timeout logic as single publish
4. On approval: publish sequentially, reporting each result
5. If any individual publish fails, stop and report — do not continue the batch

## Safety Rules

- **NEVER auto-publish** — the approval gate is mandatory, period
- **NEVER skip the approval reaction** — even if the user says "just do it" in text
  - Respond: "I understand the urgency, but publishing requires emoji approval (✅) for safety. Please react to the approval message above."
- **NEVER publish without showing a preview first** — the user must be able to visually verify before approving
- If the preview URL fails, do NOT proceed — the user cannot verify without it
- Log every publish attempt (approved, rejected, or timed out) in the conversation

## If No Publish Tool Available

If marketer-mcp does not expose a publish tool:

1. Complete the approval workflow as normal (preview + emoji gate)
2. On approval, provide manual publish instructions:

```
✅ Approved! Since I can't publish directly, here's how to publish manually:

Page: [Page Name/Path]
Location: [Path in Sitecore content tree]

Steps:
1. Open SitecoreAI Content Editor
2. Navigate to [path]
3. Select the page
4. Click "Publish" → "Publish Item"
5. Verify the live page

Let me know once it's live and I'll confirm the URL.
```

## Preview URL Construction

If `mcp__marketer-mcp__get_page_preview_url` is unavailable, construct the preview URL manually:

```
https://xmc-4qlgtraf1kmzc2kz5jkd33-eh.sitecorecloud.io/api/editing/render?sc_itemid={PAGE_ID}&sc_lang=en&sc_site=main&sc_version=1&mode=preview&sc_layoutkind=final&route={PAGE_ROUTE}&tenant_id=10053d8f-5120-4d89-f891-08de2910c96f&secret=5HB80HYQdXqyr2SnWsaCgT
```

Replace `{PAGE_ID}` with the page's item ID (GUID) and `{PAGE_ROUTE}` with the page route (e.g., `/testpage`).

## Future: GraphQL Publish Capability

The Sitecore Authoring & Management GraphQL API supports programmatic publishing. This requires OAuth client credentials to be configured on Railway. When available, this will replace the manual publish instructions with a direct API call. See `references/marketer-mcp-tools.md` for the full tool inventory.

## Error Handling

- If publish fails: report the error, do NOT retry automatically
- If preview URL fails: block the workflow and ask the user to verify the page manually before approving
- If marketer-mcp connection is down: report it and suggest checking MCP status

## Response Format

After successful publish:

```
✅ Published: [Page Name]

Live at: [URL if known]
Published by: [user who approved] at [timestamp]

Verify the live page to confirm everything looks correct.
```

After rejection:

```
❌ Publish cancelled: [Page Name]

The page remains as a draft. No changes were made to the live site.
```
