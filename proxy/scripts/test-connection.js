/**
 * @description
 * Standalone MCP connection test script for validating connectivity
 * to Sitecore marketer-mcp-prod via the MCP SDK.
 *
 * This script:
 * 1. Reads a Sitecore access token from SITECORE_ACCESS_TOKEN env var
 * 2. Connects to marketer-mcp-prod using StreamableHTTP transport
 * 3. Calls client.listTools() and prints the tool count + names
 * 4. Reports connection/auth/network errors with actionable diagnostics
 * 5. If StreamableHTTP fails, falls back to SSE transport automatically
 *
 * Key features:
 * - Zero-config aside from the access token env var
 * - Graceful error handling for auth, network, DNS, and TLS failures
 * - Prints tool names in a format useful for cross-referencing marketer-mcp-tools.md
 * - Reports actual tool count vs expected (37 documented, 36 by subtotal)
 *
 * @dependencies
 * - @modelcontextprotocol/sdk: Official MCP client SDK (already in proxy/package.json)
 *
 * @notes
 * - Run `node scripts/auth.js` first to obtain a valid access token
 * - The token can also be passed directly if you have one (e.g., from manual OAuth)
 * - This does NOT use the FileTokenProvider from mcp-client.js — it's intentionally
 *   standalone so it can be run without a tokens.json file on disk
 * - Expected tool count: Reference doc says 37 total, but category subtotals sum to 36
 *   (4 site + 14 page + 6 content + 4 component + 4 asset + 4 personalization = 36).
 *   This script records the ACTUAL count returned by the MCP server.
 *
 * Usage:
 *   cd proxy && SITECORE_ACCESS_TOKEN="<token>" node scripts/test-connection.js
 *
 *   # Or with a custom MCP endpoint:
 *   SITECORE_ACCESS_TOKEN="<token>" SITECORE_MCP_URL="https://..." node scripts/test-connection.js
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// --- Configuration ---

/** The MCP endpoint URL. Defaults to the production marketer-mcp endpoint. */
const MCP_URL =
  process.env.SITECORE_MCP_URL ||
  "https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod";

/** Access token obtained via scripts/auth.js or manual OAuth flow. */
const ACCESS_TOKEN = process.env.SITECORE_ACCESS_TOKEN;

/** Expected tool count from the reference documentation (marketer-mcp-tools.md). */
const EXPECTED_TOOL_COUNT_DOC = 37; // What the doc header says
const EXPECTED_TOOL_COUNT_SUM = 36; // What the category subtotals actually add up to

/** Connection timeout in milliseconds (30 seconds). */
const CONNECT_TIMEOUT_MS = 30_000;

// --- Validation ---

if (!ACCESS_TOKEN) {
  console.error("ERROR: SITECORE_ACCESS_TOKEN environment variable is required.\n");
  console.error("How to get a token:");
  console.error("  1. Run: cd proxy && npm run auth");
  console.error("  2. Copy the access_token from the output or tokens.json");
  console.error("  3. Run: SITECORE_ACCESS_TOKEN=\"<token>\" node scripts/test-connection.js\n");
  console.error("If you already have a tokens.json file:");
  console.error("  export SITECORE_ACCESS_TOKEN=$(node -e \"console.log(JSON.parse(require('fs').readFileSync('tokens.json','utf-8')).tokens.access_token)\")");
  process.exit(1);
}

// --- Transport Factory ---

/**
 * Creates a StreamableHTTP transport with a static Bearer token.
 * Uses a custom headers object to inject the Authorization header
 * on every request (bypasses the OAuthClientProvider for simplicity).
 *
 * @param {string} url - The MCP endpoint URL
 * @param {string} token - The Bearer access token
 * @returns {StreamableHTTPClientTransport} configured transport
 */
function createStreamableTransport(url, token) {
  return new StreamableHTTPClientTransport(new URL(url), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

/**
 * Creates an SSE transport as a fallback if StreamableHTTP fails.
 * Some older MCP servers only support SSE-based communication.
 *
 * @param {string} url - The MCP endpoint URL
 * @param {string} token - The Bearer access token
 * @returns {SSEClientTransport} configured transport
 */
function createSSETransport(url, token) {
  return new SSEClientTransport(new URL(url), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

// --- Error Diagnostics ---

/**
 * Analyzes an error and returns a human-readable diagnostic message
 * with actionable next steps for the user.
 *
 * @param {Error} err - The caught error
 * @param {string} transportType - "StreamableHTTP" or "SSE" for context
 * @returns {string} Diagnostic message with recommendations
 */
function diagnoseError(err, transportType) {
  const msg = err.message || String(err);
  const code = err.code || "";
  const cause = err.cause?.message || err.cause?.code || "";

  // Auth errors (401, 403, token-related)
  if (
    msg.includes("401") ||
    msg.includes("Unauthorized") ||
    msg.includes("403") ||
    msg.includes("Forbidden") ||
    msg.includes("invalid_token") ||
    msg.includes("token")
  ) {
    return [
      `Auth failed: ${msg}`,
      "",
      "Possible causes:",
      "  - Access token has expired (tokens typically last 1 hour)",
      "  - Token was issued for a different audience/scope",
      "  - Token has been revoked",
      "",
      "Fix: Re-run 'npm run auth' to get a fresh token.",
    ].join("\n");
  }

  // DNS resolution failures
  if (code === "ENOTFOUND" || msg.includes("ENOTFOUND") || cause.includes("ENOTFOUND")) {
    return [
      `DNS Error: Cannot resolve hostname for ${MCP_URL}`,
      "",
      "Possible causes:",
      "  - No internet connection",
      "  - DNS server is unreachable",
      "  - The MCP endpoint hostname is incorrect",
      "",
      "Fix: Check internet connection and verify SITECORE_MCP_URL.",
    ].join("\n");
  }

  // TLS/certificate errors
  if (
    code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    msg.includes("certificate") ||
    msg.includes("TLS") ||
    msg.includes("SSL") ||
    code === "ERR_TLS_CERT_ALTNAME_INVALID"
  ) {
    return [
      `TLS Error: ${msg}`,
      "",
      "Possible causes:",
      "  - Corporate proxy intercepting HTTPS traffic",
      "  - Self-signed certificate in the chain",
      "  - System clock is significantly wrong",
      "",
      "Fix: Check proxy settings, or try: NODE_TLS_REJECT_UNAUTHORIZED=0 (dev only!).",
    ].join("\n");
  }

  // Timeout errors
  if (
    code === "ETIMEDOUT" ||
    code === "ESOCKETTIMEDOUT" ||
    msg.includes("timeout") ||
    msg.includes("Timeout") ||
    code === "UND_ERR_CONNECT_TIMEOUT"
  ) {
    return [
      `Timeout: Connection to ${MCP_URL} timed out after ${CONNECT_TIMEOUT_MS / 1000}s`,
      "",
      "Possible causes:",
      "  - Network firewall blocking outbound HTTPS",
      "  - MCP server is down or overloaded",
      "  - VPN/proxy interfering with the connection",
      "",
      "Fix: Check network connectivity, try from a different network.",
    ].join("\n");
  }

  // Connection refused
  if (code === "ECONNREFUSED" || msg.includes("ECONNREFUSED")) {
    return [
      `Connection Refused: ${MCP_URL} actively refused the connection`,
      "",
      "Possible causes:",
      "  - MCP server is not running",
      "  - Wrong port or endpoint URL",
      "",
      "Fix: Verify the MCP endpoint URL is correct.",
    ].join("\n");
  }

  // Connection reset
  if (code === "ECONNRESET" || msg.includes("ECONNRESET")) {
    return [
      `Connection Reset: Server closed the connection unexpectedly`,
      "",
      "Possible causes:",
      "  - Server-side error",
      "  - Load balancer timeout",
      "  - Protocol mismatch (try SSE transport)",
      "",
      "Fix: Retry, or check if the MCP server supports ${transportType} transport.",
    ].join("\n");
  }

  // Generic fallback
  return [
    `Connection Error (${transportType}): ${msg}`,
    code ? `  Error code: ${code}` : "",
    cause ? `  Cause: ${cause}` : "",
    "",
    "If this persists, check:",
    "  - Is the MCP URL correct? Current: " + MCP_URL,
    "  - Is your access token valid and not expired?",
    "  - Can you reach edge-platform.sitecorecloud.io from this network?",
  ]
    .filter(Boolean)
    .join("\n");
}

// --- Main Test Flow ---

/**
 * Attempts to connect to marketer-mcp using the given transport,
 * list all tools, and print the results.
 *
 * @param {string} transportType - "StreamableHTTP" or "SSE"
 * @param {import("@modelcontextprotocol/sdk/client/index.js").Transport} transport - The transport instance
 * @returns {Promise<{tools: Array<{name: string, description: string}>}>} The tools list
 * @throws {Error} If connection or listTools fails
 */
async function testConnection(transportType, transport) {
  console.log(`\n--- Attempting ${transportType} transport ---`);
  console.log(`Endpoint: ${MCP_URL}`);
  console.log(`Token:    ${ACCESS_TOKEN.substring(0, 12)}...${ACCESS_TOKEN.substring(ACCESS_TOKEN.length - 6)}`);
  console.log("");

  // Create the MCP client
  const client = new Client(
    { name: "sitecore-mcp-test", version: "1.0.0" },
    { capabilities: {} }
  );

  // Connect with timeout
  const connectPromise = client.connect(transport);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error(`Connection timed out after ${CONNECT_TIMEOUT_MS / 1000}s`)),
      CONNECT_TIMEOUT_MS
    )
  );

  await Promise.race([connectPromise, timeoutPromise]);
  console.log(`Connected via ${transportType}.\n`);

  // List tools
  console.log("Calling listTools()...\n");
  const response = await client.listTools();
  const tools = response.tools || [];

  // Close the client cleanly
  try {
    await client.close();
  } catch {
    // Ignore close errors — we got the data we need
  }

  return { tools };
}

/**
 * Main entry point. Tries StreamableHTTP first, then falls back to SSE.
 * Prints tool count and names, then compares against the expected count.
 */
async function main() {
  console.log("=== Sitecore marketer-mcp Connection Test ===");
  console.log(`Date: ${new Date().toISOString()}`);

  let tools = null;
  let usedTransport = null;

  // --- Attempt 1: StreamableHTTP transport (preferred) ---
  try {
    const transport = createStreamableTransport(MCP_URL, ACCESS_TOKEN);
    const result = await testConnection("StreamableHTTP", transport);
    tools = result.tools;
    usedTransport = "StreamableHTTP";
  } catch (err) {
    console.error(diagnoseError(err, "StreamableHTTP"));
    console.log("\n--- Falling back to SSE transport ---\n");

    // --- Attempt 2: SSE transport (fallback) ---
    try {
      const transport = createSSETransport(MCP_URL, ACCESS_TOKEN);
      const result = await testConnection("SSE", transport);
      tools = result.tools;
      usedTransport = "SSE";
    } catch (sseErr) {
      console.error(diagnoseError(sseErr, "SSE"));
      console.error("\n=== RESULT: Connection FAILED ===");
      console.error("Both StreamableHTTP and SSE transports failed.");
      console.error("See error messages above for diagnostics.\n");
      process.exit(1);
    }
  }

  // --- Success: Print results ---

  console.log("=".repeat(60));
  console.log(`Connected: ${tools.length} tools available`);
  console.log(`Transport: ${usedTransport}`);
  console.log("=".repeat(60));

  // Print all tool names, sorted alphabetically for easy comparison
  const sortedTools = [...tools].sort((a, b) => a.name.localeCompare(b.name));

  console.log("\nTool list (alphabetical):");
  console.log("-".repeat(40));
  sortedTools.forEach((tool, i) => {
    const num = String(i + 1).padStart(2, " ");
    console.log(`  ${num}. ${tool.name}`);
  });
  console.log("-".repeat(40));

  // Compare against expected counts
  console.log("\n--- Count Comparison ---");
  console.log(`  Actual count:              ${tools.length}`);
  console.log(`  marketer-mcp-tools.md says: ${EXPECTED_TOOL_COUNT_DOC} (header)`);
  console.log(`  Category subtotals sum to:  ${EXPECTED_TOOL_COUNT_SUM}`);

  if (tools.length === EXPECTED_TOOL_COUNT_DOC) {
    console.log(`  Status: Matches doc header (${EXPECTED_TOOL_COUNT_DOC})`);
  } else if (tools.length === EXPECTED_TOOL_COUNT_SUM) {
    console.log(`  Status: Matches category subtotals (${EXPECTED_TOOL_COUNT_SUM}) — doc header is off by 1`);
  } else {
    console.log(`  Status: MISMATCH — actual count differs from both reference numbers`);
    console.log(`  Action: Update marketer-mcp-tools.md with actual count`);
  }

  // Print raw tool names as JSON array for easy copy-paste into other scripts
  console.log("\n--- Raw Tool Names (JSON) ---");
  console.log(JSON.stringify(sortedTools.map((t) => t.name), null, 2));

  console.log("\n=== RESULT: Connection SUCCESS ===\n");
}

main().catch((err) => {
  // Catch-all for unexpected errors not handled above
  console.error("Unexpected fatal error:", err.message);
  if (err.stack) {
    console.error(err.stack);
  }
  process.exit(1);
});
