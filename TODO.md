# OpenClaw Critical Path — Spec-Driven TODO

> **Scope:** Phases 1-3.5 (Security → Validations → Proxy Deploy → SOUL → Skills → All 42 Tools Live)
> **Format:** Epic → Story → Task (atomic ralph loop units)
> **Principle:** Maximize marketer-mcp's 42 tools first. Custom skills fill gaps only.
> **Created:** 2026-02-10
> **Updated:** 2026-02-11
>
> **Tool count: 42 (confirmed live 2026-02-11).** Reference docs said 36-37 — actual count is 42 via StreamableHTTP connection test. 6 previously undocumented tools: `create_personalization_version`, `delete_child_item`, `get_personalization_condition_template_by_id`, `get_personalization_condition_templates`, `get_personalization_versions_by_page`, `get_site_id_from_item`.
>
> **Auth: client_credentials works.** No interactive browser login needed. Token auto-renews on expiry.
>
> **Task classification:** `[R]` = ralph-loopable (code), `[M]` = manual (dashboard/UI/Slack), `[H]` = hybrid (code + manual deploy)

---

## Dependency Graph

```
                    ┌─────────────────┐
                    │  EPIC 1          │
                    │  Validation      │
                    │  Sprint          │
                    └──┬──┬──┬────────┘
                       │  │  │
          ┌────────────┘  │  └────────────────┐
          ▼               ▼                   ▼
   ┌─────────────┐ ┌─────────────┐   ┌──────────────┐
   │ 1.1 MCP SDK │ │ 1.2 Token   │   │ 1.3 Plugin   │
   │ Connection  │ │ Refresh     │   │ Tool Names   │
   └──────┬──────┘ └──────┬──────┘   └──────┬───────┘
          │               │                  │
          └───────┬───────┘                  │
                  ▼                          │
          ┌─────────────────┐                │
          │  EPIC 3          │                │
          │  Proxy Deploy    │                │
          └──────┬──────────┘                │
                 │                           │
                 ▼                           ▼
          ┌─────────────────┐     ┌──────────────────┐
          │  EPIC 4          │     │  EPIC 5           │
          │  SOUL + Agent    │     │  Skill Tool Names │
          └──────┬──────────┘     └──────┬───────────┘
                 │                        │
                 └────────┬───────────────┘
                          ▼
                 ┌─────────────────┐
                 │  EPIC 6          │
                 │  Phase 3 Skills  │
                 │  (field format)  │
                 └──────┬──────────┘
                        ▼
                 ┌─────────────────┐
                 │  EPIC 7          │
                 │  Phase 3.5 Skills│
                 │  (unused tools)  │
                 └─────────────────┘

    ┌─────────────────┐
    │  EPIC 2          │  ← PARALLEL (no dependencies)
    │  Security        │
    │  Hardening       │
    └─────────────────┘
```

### Parallelization Opportunities

- **EPIC 2** (Security) runs fully parallel with everything — start immediately
- **EPIC 1** stories 1.1, 1.2, 1.3 can run in parallel (all independent validations)
- **EPIC 5** (tool name updates) only needs 1.3 — can start before proxy deploys
- **EPIC 6** and **EPIC 7** are sequential (6 first, then 7) but individual stories within each can parallel

### Ralph Loop vs Manual Task Map

| Tag | Count | Description |
|:----|:------|:------------|
| `[R]` | 17 | Code-creation tasks — ralph loop can build autonomously |
| `[M]` | 11 | Dashboard/UI/Slack tasks — require human hands |
| `[H]` | 2 | Hybrid — ralph builds code, human deploys |

**Ralph-loopable NOW (no dependencies):** 1.1.1, 1.2.1, 1.3.1, 2.1.1
**Ralph-loopable after validations:** 5.1.1, 6.1.1-6.6.1, 7.1.1-7.6.1

---

## EPIC 1: Validation Sprint

> **Goal:** Unblock the entire roadmap by answering 3 critical unknowns
> **Depends on:** Nothing
> **Blocks:** EPIC 3, EPIC 5
> **Estimated effort:** 1-2 days total

### Story 1.1: MCP SDK Connection Test

> Can `@modelcontextprotocol/sdk` connect to marketer-mcp via Streamable HTTP?

#### Task 1.1.1: Write MCP Connection Test Script

**What to build:**
A standalone Node.js script (`proxy/scripts/test-connection.js`) that:
1. Imports `@modelcontextprotocol/sdk`
2. Connects to `https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod` via Streamable HTTP transport
3. Calls `client.listTools()` and prints the tool count + names
4. Reports connection errors with actionable diagnostics

**Files to modify:**
- CREATE `proxy/scripts/test-connection.js` (~40 lines)

**Acceptance criteria:**
- [ ] Script connects successfully and prints "Connected: X tools available"
- [ ] Tool count and names compared against marketer-mcp-tools.md (expect 36, reference says 37 — record actual count)
- [ ] Script handles auth errors gracefully (prints "Auth failed: [reason]")
- [ ] Script handles network errors (timeout, DNS, TLS)

**Test command:**
```bash
cd proxy && SITECORE_ACCESS_TOKEN="<token>" node scripts/test-connection.js
```

**Complexity:** LOW (20-30 min)

**Notes:**
- Needs a valid access token — run `node scripts/auth.js` first to get one
- If Streamable HTTP fails, try SSE transport as fallback
- Record the exact tool names returned — we need these for Story 1.3

---

### Story 1.2: Token Refresh Lifecycle Test

> How long do Sitecore refresh tokens last? Do they survive Railway redeploys?

#### Task 1.2.1: Test Token Refresh Flow

**What to build:**
Extend `proxy/scripts/test-connection.js` or create `proxy/scripts/test-token-refresh.js` that:
1. Loads tokens from `tokens.json`
2. Uses the refresh token to get a new access token
3. Reports: old token expiry, new token expiry, refresh token unchanged?
4. Saves new tokens back to `tokens.json`

**Files to modify:**
- CREATE `proxy/scripts/test-token-refresh.js` (~50 lines)
- OR extend `proxy/scripts/test-connection.js`

**Acceptance criteria:**
- [ ] Refresh token successfully gets new access token
- [ ] New token expiry printed (confirms TTL)
- [ ] Refresh token itself is not rotated (or if rotated, new one is saved)
- [ ] Script works with tokens generated by `auth.js`

**Test command:**
```bash
cd proxy && node scripts/test-token-refresh.js
```

**Complexity:** LOW (1-2 hours including wait time)

**Notes:**
- Run auth.js first to get initial tokens
- Wait for access token to expire (~1 hour based on typical Sitecore TTL), then run refresh test
- If refresh tokens have very short TTL, document it — this affects operational model

#### Task 1.2.2: Document Token Lifecycle

**What to build:**
Update `proxy/.env.example` and the Obsidian doc (`Connecting marketer-mcp to OpenClaw.md`) with confirmed token TTLs.

**Files to modify:**
- EDIT `proxy/.env.example` (add token TTL comments)
- EDIT Obsidian: `Connecting marketer-mcp to OpenClaw.md` (fill in confirmed values)

**Acceptance criteria:**
- [ ] Access token TTL documented (exact hours/minutes)
- [ ] Refresh token TTL documented (or "indefinite" if confirmed)
- [ ] Railway redeploy behavior documented (tokens persist on volume? yes/no)

**Complexity:** LOW (30 min)

---

### Story 1.3: Plugin Tool Name Format Test

> What exact format do tool names take when exposed by an OpenClaw plugin?

#### Task 1.3.1: Create Minimal Test Plugin

**What to build:**
A throwaway plugin (`extensions/test-tool/index.ts`) that exposes a single dummy tool, so we can see what name format OpenClaw assigns.

**Files to modify:**
- CREATE `extensions/test-tool/index.ts` (~30 lines)
- CREATE `extensions/test-tool/package.json` (~8 lines)
- EDIT `Dockerfile` (add `COPY extensions/test-tool ./extensions/test-tool`)

**Acceptance criteria:**
- [ ] Plugin loads successfully in OpenClaw
- [ ] Dummy tool appears in agent's tool list
- [ ] Exact tool name format captured (e.g., `test-tool__my_tool`, `test_tool.my_tool`, etc.)
- [ ] Format documented for use in skill `allowed-tools:` lists

**Test command:**
```bash
# Deploy to Railway, then via Tailscale SSH:
ssh root@openclaw-railway -- openclaw tools list | grep test
```

**Complexity:** MEDIUM (2-4 hours — requires deploy + SSH)

**Notes:**
- This is the most important validation — blocks ALL skill `allowed-tools:` updates
- After capturing format, DELETE the test plugin and redeploy
- If OpenClaw doesn't support custom plugins at all, this is a SHOWSTOPPER — document and escalate

#### Task 1.3.2: Document Tool Name Convention

**What to build:**
Update the Obsidian doc and create a reference note with the confirmed format.

**Files to modify:**
- EDIT Obsidian: `Connecting marketer-mcp to OpenClaw.md` (resolve "Format TBD" section)
- EDIT Obsidian: `Skill Inventory & Architecture.md` (update tool naming notes)

**Acceptance criteria:**
- [ ] Confirmed format documented with example
- [ ] All 36 marketer-mcp tool names listed in new format (or actual count confirmed by 1.1.1)
- [ ] Skill `allowed-tools:` migration plan documented (old format → new format)

**Complexity:** LOW (30 min)

---

## EPIC 2: Security Hardening

> **Goal:** Lock down the Railway instance before it goes live with real Sitecore credentials
> **Depends on:** Nothing (parallel with everything)
> **Blocks:** Nothing (but should complete before EPIC 3)
> **Estimated effort:** 3-5 days

### Story 2.1: Tailscale Subnet Router

#### Task 2.1.1: Deploy Tailscale Sidecar on Railway

**What to build:**
A Tailscale subnet router container as a 3rd Railway service that bridges the tailnet to Railway's internal network.

**Files to modify:**
- CREATE `tailscale/Dockerfile` (~20 lines)
- CREATE `tailscale/start.sh` (~15 lines)
- EDIT Railway project config (add service, set root directory to `/tailscale`)

**Acceptance criteria:**
- [ ] Tailscale container starts and joins tailnet
- [ ] `tailscale status` shows the container as a subnet router
- [ ] OpenClaw Gateway (port 8080) is reachable from tailnet
- [ ] Proxy (port 3001) is reachable from tailnet
- [ ] Neither service is reachable from public internet

**Test command:**
```bash
# From any tailnet machine:
curl http://openclaw-gateway.railway.internal:8080/setup/healthz
curl http://sitecore-mcp-proxy.railway.internal:3001/health
# From public internet (should fail):
curl https://<public-railway-url>/setup/healthz  # expect connection refused
```

**Complexity:** MEDIUM (4-6 hours)

**Notes:**
- Use `TS_AUTHKEY` env var with a pre-authenticated key
- Enable `--advertise-routes` for Railway's internal network CIDR
- See Security Lockdown Checklist.md steps 1-3 for detailed commands

#### Task 2.1.2: Remove Public URL

**What to build:**
Remove the public Railway URL so the gateway is ONLY accessible via Tailscale.

**Files to modify:**
- Railway dashboard config (disable public networking for gateway service)

**Acceptance criteria:**
- [ ] Public URL returns connection refused
- [ ] Gateway still accessible via Tailscale
- [ ] Setup wizard still works via Tailscale

**Test command:**
```bash
# Public (should fail):
curl https://<old-public-url>  # connection refused
# Tailscale (should work):
curl http://openclaw-gateway:8080/setup/healthz
```

**Complexity:** LOW (15 min)

### Story 2.2: Gateway Hardening

#### Task 2.2.1: Apply Command Allowlist + Filesystem Restrictions

**What to build:**
OpenClaw config changes via the setup wizard to restrict what the agent can execute.

**Files to modify:**
- OpenClaw config via `/setup` UI (command allowlist, filesystem restrictions)

**Acceptance criteria:**
- [ ] Agent can only run: `curl`, `cat`, `ls`, `echo`, `node`, `npx`
- [ ] Agent cannot access paths outside `/data/workspace/`
- [ ] Agent cannot modify its own SOUL.md, AGENTS.md, or MCP config
- [ ] Test: ask agent to run `rm -rf /` — must be denied

**Test command:**
```bash
# Via Slack, tell the agent:
"Run the command: whoami"  # should be denied (not in allowlist)
"Run the command: ls /data/workspace/skills/"  # should work
```

**Complexity:** LOW (1-2 hours)

#### Task 2.2.2: Rotate SETUP_PASSWORD

**What to build:**
Generate a strong password and update the Railway env var.

**Files to modify:**
- Railway dashboard env vars (`SETUP_PASSWORD`)

**Acceptance criteria:**
- [ ] Old password no longer works at `/setup`
- [ ] New password grants access
- [ ] Password stored in team's password manager (not in repo)

**Complexity:** LOW (10 min)

### Story 2.3: Disable ClawdHub + Pin MCP Versions

#### Task 2.3.1: Lock Down External Dependencies

**What to build:**
Disable community plugin marketplace and pin all MCP server versions.

**Files to modify:**
- OpenClaw config via `/setup` UI

**Acceptance criteria:**
- [ ] ClawdHub marketplace disabled (no plugin discovery/install)
- [ ] All MCP servers pinned to specific versions (no auto-updates)
- [ ] Agent cannot install new skills or MCP servers

**Complexity:** LOW (30 min)

---

## EPIC 3: Proxy Deploy

> **Goal:** Get sitecore-mcp-proxy live on Railway with working MCP connection
> **Depends on:** EPIC 1 (Stories 1.1 + 1.2 must pass)
> **Blocks:** EPIC 4, EPIC 6, EPIC 7
> **Estimated effort:** 1-2 days

### Story 3.1: Initial Token Acquisition

#### Task 3.1.1: Run OAuth Flow and Upload Tokens

**What to build:**
Nothing new — execute the existing `auth.js` script, then upload tokens to Railway volume.

**Files to modify:**
- None (execution task, not code task)

**Acceptance criteria:**
- [ ] `node scripts/auth.js` completes successfully
- [ ] `tokens.json` contains valid `access_token` and `refresh_token`
- [ ] `tokens.json` uploaded to Railway volume at `/data/tokens.json`
- [ ] File permissions set to 600 on Railway

**Test command:**
```bash
cd proxy && node scripts/auth.js
# Then upload via Tailscale SSH:
scp tokens.json root@openclaw-railway:/data/tokens.json
ssh root@openclaw-railway chmod 600 /data/tokens.json
```

**Complexity:** LOW (30 min)

### Story 3.2: Deploy Proxy Service

#### Task 3.2.1: Configure Railway Service for Proxy

**What to build:**
Add the proxy as a second Railway service in the same project.

**Files to modify:**
- Railway dashboard (add service, set root directory = `/proxy`, internal networking only)
- EDIT `proxy/.env.example` → set actual env vars in Railway

**Acceptance criteria:**
- [ ] Proxy service deploys successfully on Railway
- [ ] Proxy listens on port 3001 (internal only)
- [ ] `GET /health` returns 200 with tool count
- [ ] `GET /tools` returns marketer-mcp tool definitions (expect 36 — verify against 1.1.1 results)

**Test command:**
```bash
# Via Tailscale:
curl http://sitecore-mcp-proxy.railway.internal:3001/health
curl http://sitecore-mcp-proxy.railway.internal:3001/tools | jq '.tools | length'
# Expected: 36 (confirm in Task 1.1.1)
```

**Complexity:** MEDIUM (2-4 hours)

### Story 3.3: End-to-End Connection Test

#### Task 3.3.1: Test Plugin → Proxy → marketer-mcp Pipeline

**What to build:**
Verify the full chain: OpenClaw agent → sitecore-mcp plugin → proxy → marketer-mcp → Sitecore.

**Files to modify:**
- None (validation task)

**Acceptance criteria:**
- [ ] Agent can call `list_sites` and get real Sitecore data back
- [ ] Agent can call `get_page_preview_url` for a known page
- [ ] Tool call round-trip time < 5 seconds
- [ ] Error handling works (call invalid tool → clean error message)

**Test command:**
```bash
# Via Slack, tell the agent:
"List all sites in Sitecore"
"Get the preview URL for the home page"
```

**Complexity:** LOW (1 hour — mostly waiting for agent responses)

**Notes:**
- This is the GRADUATION TEST — if this passes, the entire pipeline works
- If it fails, diagnose: is it plugin → proxy (internal network)? Or proxy → MCP (auth)?

---

## EPIC 4: SOUL + Core Agent

> **Goal:** Deploy the agent identity, verify skill routing and approval workflows
> **Depends on:** EPIC 3 (proxy must be live for skills to work)
> **Blocks:** EPIC 6
> **Estimated effort:** 2-3 days

### Story 4.1: Deploy SOUL.md

#### Task 4.1.1: Upload SOUL.md to Railway

**What to build:**
Deploy the SOUL file to the OpenClaw workspace.

**Files to modify:**
- The git-synced `workspace/` already contains skills, but SOUL.md needs to go to `/data/.openclaw/SOUL.md`
- May need to adjust `src/server.js` syncRepoSkills() to also sync SOUL.md

**Acceptance criteria:**
- [ ] SOUL.md is present at `/data/.openclaw/SOUL.md` on Railway
- [ ] Agent identifies itself as "Fishtank's SitecoreAI Content Agent"
- [ ] Agent refuses to respond outside `#ai-agent-workflows`
- [ ] Agent correctly routes to reader skill for "show me the homepage components"

**Test command:**
```bash
# Via Slack in #ai-agent-workflows:
"Who are you?"  # Should identify as Fishtank's SitecoreAI Content Agent
# Via Slack in #random:
"@agent hello"  # Should refuse: "I only operate in #ai-agent-workflows"
```

**Complexity:** LOW (1-2 hours)

### Story 4.2: Test Approval Workflow

#### Task 4.2.1: Verify Approval Gate End-to-End

**What to build:**
Nothing new — test the existing approval workflow via Slack.

**Files to modify:**
- None (manual test)

**Acceptance criteria:**
- [ ] Ask agent to "publish the home page" → approval request posted in `#ai-agent-workflows`
- [ ] Approval request includes: action description, scope, impact, preview URL
- [ ] React with ✅ → agent proceeds (or posts manual publish instructions if no publish tool)
- [ ] React with ❌ → agent cancels
- [ ] No reaction for 10 min → reminder posted
- [ ] No reaction for 30 min → auto-cancel

**Test command:**
```bash
# Via Slack in #ai-agent-workflows:
"Publish the home page"
# Then react with ✅ or ❌ and observe
```

**Complexity:** MEDIUM (2-3 hours including timeout tests)

**Notes:**
- If OpenClaw can't detect Slack reactions, document the gap and implement text-based fallback ("type APPROVE to proceed")

### Story 4.3: Model Routing Configuration

#### Task 4.3.1: Configure Model Routing

**What to build:**
Configure OpenClaw to use Anthropic as the primary model and Gemini as the cheap/heartbeat model.

**Files to modify:**
- OpenClaw config via `/setup` UI (model routing settings)

**Acceptance criteria:**
- [ ] Anthropic (Claude) configured as primary model for all substantive work
- [ ] Gemini configured as heartbeat/routine model (status checks, simple acknowledgments)
- [ ] Model routing logic documented (which queries go to which model)
- [ ] Cost baseline captured (rough estimate of daily API spend)

**Test command:**
```bash
# Via Slack:
"What model are you using right now?"  # Should respond using Anthropic
# Simple ping/ack should route to Gemini (if supported by OpenClaw)
```

**Complexity:** LOW (1 hour)

**Notes:**
- Check if OpenClaw supports model routing natively, or if we need a custom routing layer
- If no native support, document the gap and add to roadmap

---

## EPIC 5: Skill Tool Name Update

> **Goal:** Update all skill `allowed-tools:` lists with the confirmed tool name format
> **Depends on:** EPIC 1 Task 1.3.1 (tool name format must be confirmed — NOT 1.3.2 docs)
> **Blocks:** EPIC 6, EPIC 7
> **Estimated effort:** 1-2 hours

### Story 5.1: Update Existing Skills

#### Task 5.1.1: Migrate Tool Names in All 3 Skills

**What to build:**
Replace `mcp__marketer-mcp__*` with confirmed format in all SKILL.md files.

**Files to modify:**
- EDIT `workspace/skills/sitecore-content-reader/SKILL.md`
- EDIT `workspace/skills/sitecore-content-author/SKILL.md`
- EDIT `workspace/skills/sitecore-content-publisher/SKILL.md`

**Acceptance criteria:**
- [ ] All `allowed-tools:` entries use confirmed format
- [ ] No remaining references to `mcp__marketer-mcp__*` format
- [ ] Git push triggers deploy → skills sync to Railway
- [ ] Agent can successfully call tools listed in each skill

**Test command:**
```bash
# After deploy, via Slack:
"Show me the components on the home page"  # reader skill tool call
"Create a test page under /content/Home"  # author skill tool call
```

**Complexity:** LOW (30 min — mechanical find/replace)

### Story 5.2: Retire Monolith Author Skill

#### Task 5.2.1: Thin sitecore-content-author to Orchestrator

**What to build:**
After Epic 6 deploys separate image/link/placeholder skills, the existing `sitecore-content-author` has redundant inline formatting docs. Thin it to be an orchestration layer that delegates to the focused sub-skills.

**Files to modify:**
- EDIT `workspace/skills/sitecore-content-author/SKILL.md` — remove inline image XML, link XML, and placeholder path docs. Replace with cross-references to `sitecore-author-image`, `sitecore-author-link`, `sitecore-author-placeholder` skills. Keep the 6-step workflow, field type reference table, error handling, and safety rules.

**Acceptance criteria:**
- [ ] Inline image XML format docs removed (replaced with: "See `sitecore-author-image` skill")
- [ ] Inline link XML format docs removed (replaced with: "See `sitecore-author-link` skill")
- [ ] Inline placeholder rules removed (replaced with: "See `sitecore-author-placeholder` skill")
- [ ] Core authoring workflow (6 steps) still present
- [ ] `allowed-tools:` list unchanged (still needs all tools for orchestration)
- [ ] No functional regression — agent can still author components

**Depends on:** EPIC 6 complete (sub-skills must exist before removing inline docs)

**Complexity:** LOW (1 hour)

---

## EPIC 6: Phase 3 — Field Formatting Skills

> **Goal:** Deploy 6 skills that add field-level formatting intelligence
> **Depends on:** EPIC 3 (proxy live), EPIC 4 (SOUL deployed), EPIC 5 (tool names correct)
> **Blocks:** EPIC 7
> **Estimated effort:** 1-2 weeks
> **Principle:** Each skill wraps marketer-mcp tools with domain knowledge (XML formats, placeholder rules, upload protocols). No custom API calls — pure skill logic on top of existing tools.
>
> **Migration source:** `mcp-migration-solution/.claude/skills/` — v2 skills exist but need adaptation:
> 1. **Add `allowed-tools:` frontmatter** — v2 skills don't have it (OpenClaw requires it)
> 2. **Remap tool names** — v2 uses `marketer_*`, OpenClaw uses `mcp__marketer-mcp__*` (or confirmed format from 1.3.1)
> 3. **Remap file paths** — v2 uses `.opencode/output/`, `.claude/data/` → use `references/`
> 4. **Relationship to existing author skill** — The deployed `sitecore-content-author` already has image/link/placeholder docs inline. Epic 6 creates focused sub-skills. After Epic 6 deploys, the monolith author should be thinned to just orchestration (see Task 6.5.1).
>
> **CRITICAL: sitecore-upload-media** — The v2 source uses GraphQL Authoring API (presigned URLs + bearer tokens). We should use marketer-mcp's `upload_asset` tool instead, per project principle. Task 6.4.1 must be a **rewrite**, not a migration.

### Story 6.1: `sitecore-author-image` Skill

#### Task 6.1.1: Create Image Field Formatting Skill

**What to build:**
Skill that teaches the agent how to format Sitecore image field XML correctly when calling `update_content`.

**Files to modify:**
- CREATE `workspace/skills/sitecore-author-image/SKILL.md`
- Migrate + adapt from `mcp-migration-solution/.claude/skills/sitecore-author-image/`

**Acceptance criteria:**
- [ ] SKILL.md has correct `allowed-tools:` frontmatter with confirmed tool name format
- [ ] Skill includes image XML format: `<image mediaid='{GUID}' />`
- [ ] Skill includes asset search workflow (find → get info → format XML → update)
- [ ] Agent can: "Set the hero image to the spring campaign banner" → searches assets, formats XML, calls update_content

**Test command:**
```bash
# Via Slack:
"Find the logo image and set it as the hero image on the about page"
```

**Complexity:** MEDIUM (4-6 hours)

### Story 6.2: `sitecore-author-link` Skill

#### Task 6.2.1: Create Link Field Formatting Skill

**What to build:**
Skill for link field XML formatting (internal links, external links, media links, anchors).

**Files to modify:**
- CREATE `workspace/skills/sitecore-author-link/SKILL.md`
- Migrate + adapt from `mcp-migration-solution/.claude/skills/sitecore-author-link/`

**Acceptance criteria:**
- [ ] Correct `allowed-tools:` frontmatter
- [ ] Covers all link types: `linktype='internal'`, `linktype='external'`, `linktype='media'`, `linktype='anchor'`
- [ ] Link XML format: `<link text='...' linktype='...' url='...' anchor='' target='...' />`
- [ ] Agent can: "Add a CTA link to the contact page" → formats correct XML

**Test command:**
```bash
# Via Slack:
"Add a 'Learn More' link to the pricing section that opens /services in a new tab"
```

**Complexity:** MEDIUM (3-4 hours)

### Story 6.3: `sitecore-author-placeholder` Skill

#### Task 6.3.1: Create Placeholder Path Skill

**What to build:**
Skill for dynamic placeholder path construction (root vs nested, index suffixes).

**Files to modify:**
- CREATE `workspace/skills/sitecore-author-placeholder/SKILL.md`
- Migrate + adapt from `mcp-migration-solution/.claude/skills/sitecore-author-placeholder/`

**Acceptance criteria:**
- [ ] Correct `allowed-tools:` frontmatter
- [ ] Rules documented: root placeholders (no leading slash), nested (with leading slash + rendering UID + index)
- [ ] Agent correctly constructs placeholder paths for `add_component_on_page`

**Test command:**
```bash
# Via Slack:
"Add a Button component inside the HeroBanner on the home page"
# Agent must construct correct nested placeholder path
```

**Complexity:** MEDIUM (3-4 hours)

### Story 6.4: `sitecore-upload-media` Skill

#### Task 6.4.1: Create Media Upload Skill

**What to build:**
Skill for uploading media assets via marketer-mcp's `upload_asset` tool.

**CRITICAL: This is a REWRITE, not a migration.** The v2 source (`mcp-migration-solution/.claude/skills/sitecore-upload-media/`) uses the GraphQL Authoring API with presigned URLs and bearer tokens. That approach bypasses marketer-mcp entirely. Per project principle (maximize marketer-mcp tools), this skill must use the `upload_asset` marketer-mcp tool instead.

**Files to modify:**
- CREATE `workspace/skills/sitecore-upload-media/SKILL.md` (write from scratch)
- Reference v2 source for workflow structure only (steps, error handling, user guidance)

**Acceptance criteria:**
- [ ] Correct `allowed-tools:` frontmatter with `upload_asset`, `search_assets`, `get_asset_information`, `update_asset`
- [ ] Upload workflow uses marketer-mcp's `upload_asset` (NOT GraphQL presigned URLs)
- [ ] Metadata workflow: upload → update_asset for alt text, description, tags
- [ ] Search-before-upload pattern: check if asset exists before duplicating
- [ ] Agent can: "Upload this image as the new hero banner" → uploads + sets metadata

**Complexity:** MEDIUM (4-6 hours — rewrite, not migration)

### Story 6.5: `sitecore-author` Orchestrator Skill

#### Task 6.5.1: Create Authoring Orchestrator Skill

**What to build:**
Enhanced orchestrator that coordinates image, link, placeholder, and upload skills for complex authoring tasks.

**Files to modify:**
- CREATE `workspace/skills/sitecore-author/SKILL.md`
- Migrate + adapt from `mcp-migration-solution/.claude/skills/sitecore-author/`

**Acceptance criteria:**
- [ ] Correct `allowed-tools:` frontmatter (union of all sub-skill tools)
- [ ] Orchestration workflow: identify field types → route to correct formatting logic → execute
- [ ] Agent can handle multi-field updates in one request

**Complexity:** MEDIUM (4-6 hours)

### Story 6.6: `sitecore-pagebuilder` Skill

#### Task 6.6.1: Create Page Builder Guidance Skill

**What to build:**
Skill that provides page creation guidance — template selection, component mapping, CTA placement, naming conventions.

**Files to modify:**
- CREATE `workspace/skills/sitecore-pagebuilder/SKILL.md`
- Migrate + adapt from `mcp-migration-solution/.claude/skills/sitecore-pagebuilder/`

**Acceptance criteria:**
- [ ] Correct `allowed-tools:` frontmatter
- [ ] Template selection logic (when to use Blog Post vs Service Detail vs Landing Page)
- [ ] Component mapping guidance (which components for which content types)
- [ ] Naming conventions documented

**Complexity:** MEDIUM (3-4 hours)

---

## EPIC 7: Phase 3.5 — Unused marketer-mcp Tool Skills

> **Goal:** Unlock the remaining ~24 marketer-mcp tools via 6 new skills (exact count confirmed in 1.1.1)
> **Depends on:** EPIC 3 (proxy live), EPIC 5 (tool names correct)
> **Blocks:** Nothing (these are additive capabilities)
> **Estimated effort:** 2-3 weeks
> **Principle:** These skills are PURE marketer-mcp — every tool already exists in the MCP, we just need skill definitions that teach the agent when/how to use them.

### Story 7.1: `sitecore-personalization` Skill (HIGH priority)

#### Task 7.1.1: Create Personalization Skill

**What to build:**
Skill using all 4 personalization tools for A/B testing and audience targeting.

**Files to modify:**
- CREATE `workspace/skills/sitecore-personalization/SKILL.md`
- CREATE `workspace/skills/sitecore-personalization/references/condition-templates.md` (populated at runtime)

**Tools used (marketer-mcp):**
- `get_personalization_versions_by_page`
- `create_personalization_version`
- `get_personalization_condition_templates`
- `get_personalization_condition_template_by_id`

**Acceptance criteria:**
- [ ] Correct `allowed-tools:` frontmatter with all 4 tools
- [ ] Workflow: get condition templates → select template → create variant
- [ ] Agent can: "Set up an A/B test on the homepage hero for returning visitors"
- [ ] Agent can: "Show me all personalization rules on the pricing page"
- [ ] High-dependency ordering documented (get templates before creating variants)

**Test command:**
```bash
# Via Slack:
"What personalization condition templates are available?"
"Create a personalization variant on the home page for mobile users"
```

**Complexity:** MEDIUM (4-6 hours)

### Story 7.2: `sitecore-multilingual` Skill (HIGH priority)

#### Task 7.2.1: Create Multilingual Skill

**What to build:**
Skill for adding language versions to pages (foundation for multi-market expansion).

**Files to modify:**
- CREATE `workspace/skills/sitecore-multilingual/SKILL.md`

**Tools used (marketer-mcp):**
- `add_language_to_page`
- (Also leverages `update_content` from author skill for populating translated fields)

**Acceptance criteria:**
- [ ] Correct `allowed-tools:` frontmatter
- [ ] Language code reference (en, fr-CA, es-MX, de-DE, etc.)
- [ ] Workflow: add language version → populate fields with translated content
- [ ] Agent can: "Add a French version of the products page"

**Test command:**
```bash
# Via Slack:
"Add a French (fr-CA) version to the home page"
```

**Complexity:** LOW (2-3 hours)

### Story 7.3: `sitecore-site-management` Skill (HIGH priority)

#### Task 7.3.1: Create Site Management Skill

**What to build:**
Skill for multi-site governance — listing sites, inspecting configuration, generating sitemaps.

**Files to modify:**
- CREATE `workspace/skills/sitecore-site-management/SKILL.md`

**Tools used (marketer-mcp):**
- `list_sites`
- `get_site_information`
- `get_site_id_from_item`
- `get_all_pages_by_site`

**Acceptance criteria:**
- [ ] Correct `allowed-tools:` frontmatter
- [ ] Agent can: "List all sites" → returns site names, URLs, root paths
- [ ] Agent can: "Generate a sitemap for the corporate site" → full page tree
- [ ] Agent can: "Which site does this page belong to?" → site identification

**Test command:**
```bash
# Via Slack:
"List all sites in this Sitecore instance"
"Show me all pages on the main site"
```

**Complexity:** LOW (2-3 hours)

### Story 7.4: `sitecore-asset-management` Skill (MEDIUM priority)

#### Task 7.4.1: Create Asset Management Skill

**What to build:**
Skill for searching, inspecting, and updating digital assets.

**Files to modify:**
- CREATE `workspace/skills/sitecore-asset-management/SKILL.md`

**Tools used (marketer-mcp):**
- `search_assets`
- `get_asset_information`
- `update_asset`

**Acceptance criteria:**
- [ ] Correct `allowed-tools:` frontmatter
- [ ] Agent can: "Find all logo images" → asset search results
- [ ] Agent can: "Update the alt text on this image" → metadata update
- [ ] Prevents duplicate uploads by searching first

**Complexity:** LOW (2-3 hours)

### Story 7.5: `sitecore-component-datasources` Skill (MEDIUM priority)

#### Task 7.5.1: Create Component Datasources Skill

**What to build:**
Skill for intelligent content linking — finding reusable datasources instead of creating duplicates.

**Files to modify:**
- CREATE `workspace/skills/sitecore-component-datasources/SKILL.md`

**Tools used (marketer-mcp):**
- `search_component_datasources`
- `get_component`
- `list_components` (expensive — prefer component-registry.md)
- `get_allowed_components_by_placeholder`

**Acceptance criteria:**
- [ ] Correct `allowed-tools:` frontmatter
- [ ] Prefer component-registry.md over `list_components` (document this rule)
- [ ] Agent can: "Find existing CTA datasources I can reuse"
- [ ] Agent can: "What components are allowed in the main-content placeholder?"

**Complexity:** MEDIUM (3-4 hours)

### Story 7.6: `sitecore-page-rendering` Skill (MEDIUM priority)

#### Task 7.6.1: Create Page Rendering Skill

**What to build:**
Skill for visual QA — screenshots, HTML inspection, template analysis.

**Files to modify:**
- CREATE `workspace/skills/sitecore-page-rendering/SKILL.md`

**Tools used (marketer-mcp):**
- `get_page_screenshot`
- `get_page_html`
- `get_page_template_by_id`

**Acceptance criteria:**
- [ ] Correct `allowed-tools:` frontmatter
- [ ] Agent can: "Screenshot the home page" → returns base64 image
- [ ] Agent can: "Get the HTML for the about page" → HTML content for analysis
- [ ] Agent can: "What fields does the Blog Post template have?"

**Complexity:** LOW (2-3 hours)

---

## Progress Tracking

### Completion Status

| Epic | Story | Task | Type | Status | Assignee |
|:-----|:------|:-----|:-----|:-------|:---------|
| 1 | 1.1 | 1.1.1 MCP Connection Test | `[R]` | `done 2026-02-11` | 42 tools confirmed |
| 1 | 1.2 | 1.2.1 Token Refresh Test | `[R]` | `done 2026-02-11` | N/A — client_credentials has no refresh token; proxy auto-renews |
| 1 | 1.2 | 1.2.2 Document Token Lifecycle | `[M]` | `pending` | |
| 1 | 1.3 | 1.3.1 Test Plugin (minimal) | `[H]` | `pending` | |
| 1 | 1.3 | 1.3.2 Document Tool Names | `[M]` | `pending` | |
| 2 | 2.1 | 2.1.1 Tailscale Sidecar | `[R]` | `pending` | |
| 2 | 2.1 | 2.1.2 Remove Public URL | `[M]` | `pending` | |
| 2 | 2.2 | 2.2.1 Command Allowlist | `[M]` | `pending` | |
| 2 | 2.2 | 2.2.2 Rotate SETUP_PASSWORD | `[M]` | `pending` | |
| 2 | 2.3 | 2.3.1 Disable ClawdHub | `[M]` | `pending` | |
| 3 | 3.1 | 3.1.1 OAuth + Upload Tokens | `[M]` | `done 2026-02-11` | client_credentials flow, tokens.json created |
| 3 | 3.2 | 3.2.1 Deploy Proxy Service | `[M]` | `pending` | |
| 3 | 3.3 | 3.3.1 E2E Connection Test | `[M]` | `pending` | |
| 4 | 4.1 | 4.1.1 Deploy SOUL.md | `[H]` | `pending` | |
| 4 | 4.2 | 4.2.1 Test Approval Workflow | `[M]` | `pending` | |
| 4 | 4.3 | 4.3.1 Configure Model Routing | `[M]` | `pending` | |
| 5 | 5.1 | 5.1.1 Migrate Tool Names | `[R]` | `pending` | |
| 5 | 5.2 | 5.2.1 Thin sitecore-content-author | `[R]` | `pending` | |
| 6 | 6.1 | 6.1.1 Image Formatting Skill | `[R]` | `done 2026-02-11` | |
| 6 | 6.2 | 6.2.1 Link Formatting Skill | `[R]` | `done 2026-02-11` | all 4 link types |
| 6 | 6.3 | 6.3.1 Placeholder Skill | `[R]` | `done 2026-02-11` | |
| 6 | 6.4 | 6.4.1 Media Upload Skill | `[R]` | `done 2026-02-11` | rewrite (not migration) |
| 6 | 6.5 | 6.5.1 Author Orchestrator | `[R]` | `done 2026-02-11` | 21 tools, 7-step workflow |
| 6 | 6.6 | 6.6.1 Pagebuilder Skill | `[R]` | `done 2026-02-11` | 10 templates, 20+ components |
| 7 | 7.1 | 7.1.1 Personalization Skill | `[R]` | `done 2026-02-11` | 4 personalization tools |
| 7 | 7.2 | 7.2.1 Multilingual Skill | `[R]` | `done 2026-02-11` | 14 language codes |
| 7 | 7.3 | 7.3.1 Site Management Skill | `[R]` | `done 2026-02-11` | 5 tools + sitemap |
| 7 | 7.4 | 7.4.1 Asset Management Skill | `[R]` | `done 2026-02-11` | 5 workflows |
| 7 | 7.5 | 7.5.1 Component Datasources | `[R]` | `done 2026-02-11` | search-before-create |
| 7 | 7.6 | 7.6.1 Page Rendering Skill | `[R]` | `done 2026-02-11` | visual QA + HTML inspection |

### Counts
- **Total tasks:** 30 (was 28 — added 4.3.1, 5.2.1)
- **Ralph-loopable `[R]`:** 17
- **Manual `[M]`:** 11
- **Hybrid `[H]`:** 2
- **Critical path (must complete sequentially):** 1.1.1 → 3.1.1 → 3.2.1 → 3.3.1 → 4.1.1 → 5.1.1 → 6.x → 7.x
- **Parallelizable:** EPIC 2 (all), EPIC 1 stories (all 3), EPIC 7 stories (all 6)
- **Estimated total effort:** 3-4 weeks with parallel execution

---

## Ralph Loop Instructions

Each task in this spec is designed as an **atomic ralph loop unit**. To execute:

1. **Pick a task** — check the Progress Tracking table for `pending` tasks with no unmet dependencies
2. **Read the task spec** — What to build, Files to modify, Acceptance criteria
3. **Execute** — Build exactly what's specified, no more
4. **Verify** — Run the test command, check all acceptance criteria
5. **Update this file** — Change status from `pending` to `done` + add date
6. **Move to next** — Pick the next unblocked task

### Ralph Loop Prompt Template

```
You are executing task [TASK_ID] from TODO.md in the clawdbot-railway-template repo.

Read the task spec at the task ID section. Build exactly what's specified.
When done, verify against the acceptance criteria.
Update the Progress Tracking table status to `done`.

Do NOT modify anything outside the task scope.
Do NOT start tasks that are blocked by incomplete dependencies.
```

### Dependency Quick Reference

| Task | Blocked By | Unlocks | Type |
|:-----|:-----------|:--------|:-----|
| 1.1.1, 1.2.1, 1.3.1 | Nothing | 3.x (1.1+1.2), 5.x (1.3) | `[R]` `[R]` `[H]` |
| 2.x | Nothing | Nothing (parallel) | mostly `[M]` |
| 3.1.1 | 1.1.1 + 1.2.1 | 3.2.1 | `[M]` |
| 3.2.1 | 3.1.1 | 3.3.1 | `[M]` |
| 3.3.1 | 3.2.1 | 4.x, 6.x, 7.x | `[M]` |
| 4.1.1 | 3.3.1 | 4.2.1, 4.3.1 | `[H]` |
| 4.2.1 | 4.1.1 | Nothing | `[M]` |
| 4.3.1 | 4.1.1 | Nothing | `[M]` |
| 5.1.1 | 1.3.1 | 6.x, 7.x | `[R]` |
| 5.2.1 | EPIC 6 complete | Nothing | `[R]` |
| 6.x | 3.3.1 + 5.1.1 | 7.x, 5.2.1 | `[R]` |
| 7.x | 3.3.1 + 5.1.1 | Nothing (additive) | `[R]` |
