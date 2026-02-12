/**
 * One-off script to fetch and print the full inputSchema for a specific tool.
 * Usage: cd proxy && node scripts/get-schema.js [tool_name]
 * Default tool: create_page
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { readFileSync } from "fs";

const MCP_URL = process.env.SITECORE_MCP_URL || "https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod";
const TOOL_NAME = process.argv[2] || "create_page";

// Read token from tokens.json
let ACCESS_TOKEN = process.env.SITECORE_ACCESS_TOKEN;
if (!ACCESS_TOKEN) {
  try {
    const data = JSON.parse(readFileSync("tokens.json", "utf-8"));
    ACCESS_TOKEN = data.tokens.access_token;
  } catch (e) {
    console.error("No token found. Set SITECORE_ACCESS_TOKEN or have tokens.json present.");
    process.exit(1);
  }
}

async function main() {
  const client = new Client({ name: "schema-fetch", version: "1.0.0" }, { capabilities: {} });

  // Try StreamableHTTP first, then SSE
  let connected = false;
  for (const [label, factory] of [
    ["StreamableHTTP", () => new StreamableHTTPClientTransport(new URL(MCP_URL), { requestInit: { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } } })],
    ["SSE", () => new SSEClientTransport(new URL(MCP_URL), { requestInit: { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } } })],
  ]) {
    try {
      console.log(`Trying ${label}...`);
      await Promise.race([
        client.connect(factory()),
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 30000)),
      ]);
      console.log(`Connected via ${label}\n`);
      connected = true;
      break;
    } catch (e) {
      console.log(`${label} failed: ${e.message}`);
    }
  }

  if (!connected) { console.error("All transports failed."); process.exit(1); }

  const { tools } = await client.listTools();
  console.log(`Total tools: ${tools.length}\n`);

  const target = tools.find((t) => t.name === TOOL_NAME);
  if (!target) {
    console.error(`Tool "${TOOL_NAME}" not found. Available tools:`);
    tools.sort((a, b) => a.name.localeCompare(b.name)).forEach((t) => console.log(`  - ${t.name}`));
    process.exit(1);
  }

  console.log(`=== ${target.name} ===`);
  console.log(`Description: ${target.description}\n`);
  console.log("inputSchema:");
  console.log(JSON.stringify(target.inputSchema, null, 2));

  try { await client.close(); } catch {}
}

main().catch((e) => { console.error(e); process.exit(1); });
