/**
 * @description
 * Dumps the FULL schema for ALL tools from Sitecore marketer-mcp.
 * Outputs a structured JSON array with every tool's name, description,
 * and complete inputSchema (properties, types, required fields, descriptions).
 *
 * This script:
 * 1. Authenticates using tokens.json or SITECORE_ACCESS_TOKEN env var
 * 2. Connects via StreamableHTTP (falls back to SSE)
 * 3. Calls listTools() to retrieve all available tools
 * 4. Outputs a JSON object with metadata + full tool schemas to stdout
 *
 * Key features:
 * - Captures ALL tools (expected: 42) with complete inputSchema
 * - JSON output suitable for piping to a file or further processing
 * - Includes metadata: timestamp, tool count, transport used
 *
 * @dependencies
 * - @modelcontextprotocol/sdk: MCP client SDK
 *
 * @notes
 * - Run from the proxy/ directory: node --env-file=.env scripts/dump-all-schemas.js
 * - Or pipe directly: node --env-file=.env scripts/dump-all-schemas.js > /tmp/all-tool-schemas.json
 * - Uses same token resolution as get-schema.js (env var -> tokens.json fallback)
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { readFileSync } from "node:fs";

// --- Configuration ---

const MCP_URL =
  process.env.SITECORE_MCP_URL ||
  "https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod";

const CONNECT_TIMEOUT_MS = 30_000;

// --- Token Resolution ---

let ACCESS_TOKEN = process.env.SITECORE_ACCESS_TOKEN;
if (!ACCESS_TOKEN) {
  try {
    const data = JSON.parse(readFileSync("tokens.json", "utf-8"));
    ACCESS_TOKEN = data.tokens.access_token;
    // Log to stderr so it doesn't pollute the JSON stdout output
    console.error("[info] Loaded access token from tokens.json");
  } catch (e) {
    console.error("[error] No token found. Set SITECORE_ACCESS_TOKEN or provide tokens.json.");
    console.error("[error] Run: npm run auth   (to get a fresh token)");
    process.exit(1);
  }
}

// --- Transport Factories ---

function createStreamableTransport(url, token) {
  return new StreamableHTTPClientTransport(new URL(url), {
    requestInit: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
}

function createSSETransport(url, token) {
  return new SSEClientTransport(new URL(url), {
    requestInit: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
}

// --- Main ---

async function main() {
  const client = new Client(
    { name: "schema-dump", version: "1.0.0" },
    { capabilities: {} }
  );

  // Try StreamableHTTP first, then SSE
  let connected = false;
  let transportUsed = "";

  const transports = [
    ["StreamableHTTP", () => createStreamableTransport(MCP_URL, ACCESS_TOKEN)],
    ["SSE", () => createSSETransport(MCP_URL, ACCESS_TOKEN)],
  ];

  for (const [label, factory] of transports) {
    try {
      console.error(`[info] Trying ${label} transport...`);
      await Promise.race([
        client.connect(factory()),
        new Promise((_, rej) =>
          setTimeout(() => rej(new Error(`${label} connection timed out after ${CONNECT_TIMEOUT_MS / 1000}s`)), CONNECT_TIMEOUT_MS)
        ),
      ]);
      console.error(`[info] Connected via ${label}`);
      connected = true;
      transportUsed = label;
      break;
    } catch (e) {
      console.error(`[warn] ${label} failed: ${e.message}`);
    }
  }

  if (!connected) {
    console.error("[error] All transports failed. Cannot connect to marketer-mcp.");
    process.exit(1);
  }

  // List all tools
  console.error("[info] Calling listTools()...");
  const { tools } = await client.listTools();
  console.error(`[info] Received ${tools.length} tools`);

  // Sort alphabetically for consistent output
  const sortedTools = [...tools].sort((a, b) => a.name.localeCompare(b.name));

  // Build the full output object
  const output = {
    _metadata: {
      description: "Complete tool schemas from Sitecore marketer-mcp",
      endpoint: MCP_URL,
      transport: transportUsed,
      toolCount: sortedTools.length,
      dumpedAt: new Date().toISOString(),
    },
    tools: sortedTools.map((tool) => ({
      name: tool.name,
      description: tool.description || null,
      inputSchema: tool.inputSchema || null,
    })),
  };

  // Write JSON to stdout (all diagnostic messages went to stderr)
  process.stdout.write(JSON.stringify(output, null, 2) + "\n");

  // Clean up
  try {
    await client.close();
  } catch {
    // Ignore close errors
  }

  console.error(`[info] Done. ${sortedTools.length} tool schemas dumped.`);
}

main().catch((e) => {
  console.error(`[fatal] ${e.message}`);
  if (e.stack) console.error(e.stack);
  process.exit(1);
});
