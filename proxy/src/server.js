/**
 * @description
 * Express REST API that bridges OpenClaw tool plugins to Sitecore marketer-mcp.
 * Exposes three endpoints:
 *   GET  /health       — Health check with token & tool status
 *   GET  /tools        — List all available marketer-mcp tools
 *   POST /tools/:name  — Execute a specific tool by name
 *
 * This server runs on Railway's internal network only (port 3001).
 * OpenClaw's sitecore-mcp plugin calls these endpoints over the internal network.
 *
 * @dependencies
 * - express: HTTP server
 * - ./mcp-client.js: MCP SDK client with OAuth token management
 *
 * @notes
 * - Auth via MCP_PROXY_TOKEN header required on all tool endpoints
 * - Health endpoint is unauthenticated (for Railway health checks)
 * - Tool cache is refreshed on startup and can be refreshed via POST /tools/_refresh
 * - If MCP client isn't ready, all tool endpoints return 503
 */

import express from "express";
import { McpClientManager } from "./mcp-client.js";

const app = express();
app.use(express.json({ limit: "1mb" }));

// --- Auth Middleware ---
// Require x-mcp-token header on all routes except /health
const MCP_PROXY_TOKEN = process.env.MCP_PROXY_TOKEN || "";

function requireAuth(req, res, next) {
  if (!MCP_PROXY_TOKEN) {
    // No token configured — skip auth (dev mode / backwards compat)
    return next();
  }
  const provided = req.headers["x-mcp-token"];
  if (provided !== MCP_PROXY_TOKEN) {
    return res.status(401).json({ error: "Unauthorized — invalid or missing x-mcp-token header" });
  }
  next();
}

const PORT = process.env.PORT || 3001;
const TOKEN_PATH = process.env.TOKEN_PATH || "/data/tokens.json";
const MCP_URL =
  process.env.SITECORE_MCP_URL ||
  "https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod";

// --- MCP Client Lifecycle ---

const manager = new McpClientManager({
  mcpUrl: MCP_URL,
  tokenPath: TOKEN_PATH,
  tokenUrl: process.env.SITECORE_TOKEN_URL || "https://auth.sitecorecloud.io/oauth/token",
  clientId: process.env.SITECORE_CLIENT_ID || "",
  clientSecret: process.env.SITECORE_CLIENT_SECRET || "",
  audience: process.env.SITECORE_AUDIENCE || "https://api.sitecorecloud.io",
});

// --- Routes ---

/**
 * Health check — used by Railway health checks and monitoring.
 * Returns connection status, tool count, and token expiry info.
 */
app.get("/health", (req, res) => {
  const status = manager.getStatus();
  res.json({
    status: status.connected ? "ok" : "connecting",
    tools: status.toolCount,
    tokenExpires: status.tokenExpires,
    lastError: status.lastError,
    uptime: Math.floor(process.uptime()),
  });
});

/**
 * List all tools from marketer-mcp.
 * Returns array of { name, description, inputSchema } objects.
 * Used by the OpenClaw plugin on startup to register tools.
 */
app.get("/tools", requireAuth, async (req, res) => {
  if (!manager.isReady()) {
    return res.status(503).json({
      error: "MCP client not ready",
      hint: "Proxy is still connecting to marketer-mcp. Check /health for status.",
    });
  }

  try {
    const tools = manager.getTools();
    res.json({ tools });
  } catch (err) {
    console.error("[GET /tools] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Execute a tool by name.
 * Request body is passed directly as tool arguments.
 * Returns the MCP tool result (content array).
 */
app.post("/tools/:name", requireAuth, async (req, res) => {
  if (!manager.isReady()) {
    return res.status(503).json({
      error: "MCP client not ready",
      hint: "Proxy is still connecting to marketer-mcp. Check /health for status.",
    });
  }

  const toolName = req.params.name;
  const args = req.body || {};

  // DEBUG: Log what the proxy actually receives from the extension
  console.log(`[POST /tools/${toolName}] received args:`, JSON.stringify(args));

  try {
    const result = await manager.callTool(toolName, args);
    res.json(result);
  } catch (err) {
    console.error(`[POST /tools/${toolName}] Error:`, err.message);
    res.status(err.status || 500).json({
      error: err.message,
      tool: toolName,
    });
  }
});

/**
 * Force refresh the tool cache and reconnect to MCP.
 * Useful after token refresh or MCP server updates.
 */
app.post("/tools/_refresh", requireAuth, async (req, res) => {
  try {
    await manager.reconnect();
    res.json({
      status: "ok",
      tools: manager.getTools().length,
    });
  } catch (err) {
    console.error("[POST /tools/_refresh] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Startup ---

app.listen(PORT, async () => {
  console.log(`[proxy] Listening on port ${PORT}`);
  console.log(`[proxy] MCP endpoint: ${MCP_URL}`);
  console.log(`[proxy] Token path: ${TOKEN_PATH}`);
  if (!MCP_PROXY_TOKEN) {
    console.warn("[proxy] WARNING: MCP_PROXY_TOKEN not set — tool endpoints are unauthenticated!");
  } else {
    console.log("[proxy] Auth enabled — x-mcp-token header required on tool endpoints.");
  }

  try {
    await manager.connect();
    console.log(`[proxy] Connected. ${manager.getTools().length} tools available.`);
  } catch (err) {
    // Non-fatal — proxy starts and retries on next request
    console.error(`[proxy] Initial connection failed: ${err.message}`);
    console.error("[proxy] Will retry on next request. Check /health for status.");
  }
});
