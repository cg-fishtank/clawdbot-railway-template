/**
 * @description
 * Research script to investigate whether Sitecore marketer-mcp tools
 * can read and write the __Final Renderings / __Renderings presentation
 * details field on content items.
 *
 * This script:
 * 1. Authenticates via client_credentials flow (same as auth.js)
 * 2. Connects to marketer-mcp using StreamableHTTP transport
 * 3. Lists all available tools, filtering for rendering/component related ones
 * 4. Searches for a page with components (e.g. "home")
 * 5. Gets the content item by ID, inspecting ALL returned fields
 * 6. Looks for __Final Renderings, __Renderings, or XML presentation data
 * 7. Tries get_components_on_page to see component/layout data
 * 8. Reports findings on whether presentation details are accessible
 *
 * @dependencies
 * - @modelcontextprotocol/sdk: MCP client SDK
 *
 * @notes
 * - Uses .env for credentials (SITECORE_CLIENT_ID, SITECORE_CLIENT_SECRET, etc.)
 * - Run from proxy/ directory: node --env-file=.env scripts/test-renderings.js
 * - No dotenv package needed — uses Node 22's built-in --env-file flag
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// ============================================================
// Configuration
// ============================================================

const TOKEN_URL =
  process.env.SITECORE_TOKEN_URL || "https://auth.sitecorecloud.io/oauth/token";
const CLIENT_ID = process.env.SITECORE_CLIENT_ID;
const CLIENT_SECRET = process.env.SITECORE_CLIENT_SECRET;
const AUDIENCE =
  process.env.SITECORE_AUDIENCE || "https://api.sitecorecloud.io";
const MCP_URL =
  process.env.SITECORE_MCP_URL ||
  "https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod";

const CONNECT_TIMEOUT_MS = 30_000;
const CALL_TIMEOUT_MS = 30_000;

// ============================================================
// Validation
// ============================================================

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "ERROR: SITECORE_CLIENT_ID and SITECORE_CLIENT_SECRET are required."
  );
  console.error(
    "Run with: node --env-file=.env scripts/test-renderings.js"
  );
  process.exit(1);
}

// ============================================================
// Step 1: Get access token via client_credentials
// ============================================================

async function getAccessToken() {
  console.log("\n=== Step 1: Obtaining access token (client_credentials) ===\n");

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    audience: AUDIENCE,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  console.log(
    `  Token obtained. Expires in ${data.expires_in}s. Preview: ${data.access_token.substring(0, 20)}...`
  );
  return data.access_token;
}

// ============================================================
// Step 2: Connect to marketer-mcp
// ============================================================

async function connectMCP(accessToken) {
  console.log("\n=== Step 2: Connecting to marketer-mcp ===\n");
  console.log(`  Endpoint: ${MCP_URL}`);

  const client = new Client(
    { name: "renderings-research", version: "1.0.0" },
    { capabilities: {} }
  );

  // Try StreamableHTTP first, fall back to SSE
  let transport;
  let transportType;

  try {
    transport = new StreamableHTTPClientTransport(new URL(MCP_URL), {
      requestInit: {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    });
    transportType = "StreamableHTTP";

    const connectPromise = client.connect(transport);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Connection timed out")),
        CONNECT_TIMEOUT_MS
      )
    );
    await Promise.race([connectPromise, timeoutPromise]);
  } catch (err) {
    console.log(
      `  StreamableHTTP failed (${err.message}), trying SSE...`
    );

    transport = new SSEClientTransport(new URL(MCP_URL), {
      requestInit: {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    });
    transportType = "SSE";

    const connectPromise = client.connect(transport);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("SSE connection timed out")),
        CONNECT_TIMEOUT_MS
      )
    );
    await Promise.race([connectPromise, timeoutPromise]);
  }

  console.log(`  Connected via ${transportType}.\n`);
  return client;
}

// ============================================================
// Helper: Call a tool with timeout and error handling
// ============================================================

async function callTool(client, toolName, args = {}) {
  console.log(`\n  >> Calling: ${toolName}(${JSON.stringify(args)})`);

  try {
    const callPromise = client.callTool({ name: toolName, arguments: args });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Tool call timed out after ${CALL_TIMEOUT_MS / 1000}s`)),
        CALL_TIMEOUT_MS
      )
    );
    const result = await Promise.race([callPromise, timeoutPromise]);
    return result;
  } catch (err) {
    console.error(`  !! Error calling ${toolName}: ${err.message}`);
    return null;
  }
}

// ============================================================
// Helper: Pretty-print tool result content
// ============================================================

function getTextContent(result) {
  if (!result || !result.content) return null;
  // MCP tool results have content array with { type, text } items
  const texts = result.content
    .filter((c) => c.type === "text")
    .map((c) => c.text);
  return texts.join("\n");
}

// ============================================================
// Step 3: List tools and find rendering/component related ones
// ============================================================

async function listAndFilterTools(client) {
  console.log("\n=== Step 3: Listing all tools ===\n");

  const response = await client.listTools();
  const tools = response.tools || [];

  console.log(`  Total tools: ${tools.length}\n`);

  // Keywords that might relate to renderings/presentation/components
  const keywords = [
    "render",
    "presentation",
    "layout",
    "component",
    "placeholder",
    "datasource",
    "page",
    "content",
    "field",
    "template",
    "item",
    "child",
  ];

  const relevantTools = tools.filter((t) => {
    const combined = `${t.name} ${t.description || ""}`.toLowerCase();
    return keywords.some((kw) => combined.includes(kw));
  });

  console.log(
    `  Rendering/component/content-related tools (${relevantTools.length}):`
  );
  console.log("  " + "-".repeat(70));

  for (const tool of relevantTools) {
    console.log(`    ${tool.name}`);
    if (tool.description) {
      // Print first 120 chars of description
      const desc =
        tool.description.length > 120
          ? tool.description.substring(0, 120) + "..."
          : tool.description;
      console.log(`      ${desc}`);
    }
    // Print the input schema if it exists — this tells us what parameters the tool accepts
    if (tool.inputSchema && tool.inputSchema.properties) {
      const props = Object.keys(tool.inputSchema.properties);
      console.log(`      Params: ${props.join(", ")}`);
    }
  }
  console.log("  " + "-".repeat(70));

  // Also print ALL tool names for completeness
  console.log("\n  All tools (alphabetical):");
  const sorted = [...tools].sort((a, b) => a.name.localeCompare(b.name));
  sorted.forEach((t, i) => {
    console.log(`    ${String(i + 1).padStart(2)}. ${t.name}`);
  });

  return tools;
}

// ============================================================
// Step 4: Search for a page (e.g. "home")
// ============================================================

async function searchForPage(client) {
  console.log("\n=== Step 4: Searching for a page with components ===\n");

  // First, try to list sites so we know what site to search
  const sitesResult = await callTool(client, "list_sites");
  const sitesText = getTextContent(sitesResult);
  if (sitesText) {
    console.log("\n  Sites found:");
    console.log(
      sitesText.length > 2000
        ? sitesText.substring(0, 2000) + "\n  ... (truncated)"
        : sitesText
    );
  }

  // Parse sites to get a site name for search
  // Response format: { sites: [{ id, name, targetHostname, rootPath }] }
  let siteName = null;
  let siteId = null;
  try {
    const parsed = JSON.parse(sitesText);
    // Handle both { sites: [...] } and [...] formats
    const sitesList = parsed.sites || (Array.isArray(parsed) ? parsed : []);
    if (sitesList.length > 0) {
      siteName = sitesList[0].name || sitesList[0].siteName;
      siteId = sitesList[0].id || sitesList[0].siteId;
      console.log(`\n  Using first site: "${siteName}" (ID: ${siteId})`);
    }
  } catch {
    console.log("  (Sites result is not JSON, will try search without site context)");
  }

  // Search for "home" page — use correct param names: search_query, site_name
  let searchText = null;
  if (siteName) {
    const searchResult = await callTool(client, "search_site", {
      search_query: "home",
      site_name: siteName,
    });
    searchText = getTextContent(searchResult);
  }

  if (!searchText) {
    console.log("  Search returned nothing. Trying get_all_pages_by_site...");

    if (siteName) {
      const pagesResult = await callTool(client, "get_all_pages_by_site", {
        siteName: siteName,
      });
      const pagesText = getTextContent(pagesResult);
      if (pagesText) {
        console.log("\n  All pages (first 3000 chars):");
        console.log(pagesText.substring(0, 3000));
        return { text: pagesText, siteName };
      }
    }
    return null;
  }

  console.log("\n  Search results (first 3000 chars):");
  console.log(
    searchText.length > 3000
      ? searchText.substring(0, 3000) + "\n  ... (truncated)"
      : searchText
  );

  return { text: searchText, siteName };
}

// ============================================================
// Step 5: Get content item and inspect ALL fields
// ============================================================

async function inspectContentItem(client, itemId) {
  console.log(
    `\n=== Step 5: Getting content item by ID: ${itemId} ===\n`
  );

  const result = await callTool(client, "get_content_item_by_id", {
    itemId: itemId,
  });
  const text = getTextContent(result);

  if (!text) {
    console.error("  No content returned for item ID:", itemId);
    return null;
  }

  console.log("\n  === RAW CONTENT ITEM RESPONSE (full) ===");
  console.log(text);
  console.log("  === END RAW RESPONSE ===\n");

  // Try to parse as JSON to enumerate fields
  try {
    const parsed = JSON.parse(text);

    // Recursively find all keys
    const allKeys = new Set();
    function collectKeys(obj, prefix = "") {
      if (obj && typeof obj === "object") {
        for (const key of Object.keys(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          allKeys.add(fullKey);
          if (typeof obj[key] === "object" && obj[key] !== null) {
            collectKeys(obj[key], fullKey);
          }
        }
      }
    }
    collectKeys(parsed);

    console.log("  All field names/paths found:");
    console.log("  " + "-".repeat(60));
    for (const key of [...allKeys].sort()) {
      console.log(`    ${key}`);
    }
    console.log("  " + "-".repeat(60));

    // Look for rendering-related fields
    const renderingKeywords = [
      "render",
      "renderings",
      "final renderings",
      "__final",
      "__render",
      "presentation",
      "layout",
      "placeholder",
      "par=",
      "<r ",
      "<d ",
    ];

    console.log("\n  Searching for rendering-related fields...");
    for (const key of allKeys) {
      const keyLower = key.toLowerCase();
      const value = getNestedValue(parsed, key);
      const valueLower =
        typeof value === "string" ? value.toLowerCase() : "";

      for (const kw of renderingKeywords) {
        if (keyLower.includes(kw) || valueLower.includes(kw)) {
          console.log(`\n  MATCH on "${kw}":`);
          console.log(`    Key:   ${key}`);
          console.log(
            `    Value: ${typeof value === "string" ? value.substring(0, 500) : JSON.stringify(value)}`
          );
          break;
        }
      }
    }

    // Also look for any field whose value contains XML
    console.log("\n  Searching for fields containing XML...");
    for (const key of allKeys) {
      const value = getNestedValue(parsed, key);
      if (
        typeof value === "string" &&
        (value.includes("<r ") ||
          value.includes("<d ") ||
          value.includes("</r>") ||
          value.includes("<rendering") ||
          value.includes("s:id=") ||
          value.includes("par="))
      ) {
        console.log(`\n  XML FIELD FOUND:`);
        console.log(`    Key: ${key}`);
        console.log(`    Value (first 1000 chars):`);
        console.log(`    ${value.substring(0, 1000)}`);
      }
    }

    return parsed;
  } catch {
    console.log("  (Response is not JSON, searching raw text for keywords)");

    // Search raw text for rendering keywords
    const keywords = [
      "__Final Renderings",
      "__Renderings",
      "Final Renderings",
      "presentation",
      "layout",
      "<r ",
      "<d ",
      "par=",
      "s:id=",
      "rendering",
    ];

    for (const kw of keywords) {
      if (text.includes(kw)) {
        const idx = text.indexOf(kw);
        const context = text.substring(
          Math.max(0, idx - 50),
          Math.min(text.length, idx + 200)
        );
        console.log(`\n  FOUND "${kw}" in raw text:`);
        console.log(`    ...${context}...`);
      }
    }

    return text;
  }
}

// Helper to get a nested value by dot-separated path
function getNestedValue(obj, path) {
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

// ============================================================
// Step 6: Try get_content_item_by_id with field name hints
// ============================================================

async function tryFieldHints(client, itemId) {
  console.log(
    `\n=== Step 6: Trying get_content_item_by_id with extra params ===\n`
  );

  // Some MCP tools accept field_names or fields parameter
  // Let's try several variations to see if we can request specific fields
  // The schema says: itemId (required), language (optional)
  // There's no field-selection param, but let's try passing extra params
  // to see if the server is lenient or has undocumented options.
  // Note: additionalProperties: false means these will likely be rejected,
  // so the most useful test is the default call (already done in Step 5).
  const variations = [
    { itemId: itemId, language: "en" },
  ];

  for (const args of variations) {
    console.log(`\n  Trying with args: ${JSON.stringify(args)}`);
    const result = await callTool(client, "get_content_item_by_id", args);
    const text = getTextContent(result);
    if (text) {
      // Check if the response differs or contains rendering data
      const hasRendering =
        text.includes("__Final Renderings") ||
        text.includes("__Renderings") ||
        text.includes("<r ") ||
        text.includes("<d ") ||
        text.includes("par=");

      if (hasRendering) {
        console.log("  >>> RENDERING DATA FOUND! <<<");
        console.log(text.substring(0, 3000));
        return text;
      } else {
        console.log(
          `  No rendering data in response (${text.length} chars). First 300 chars:`
        );
        console.log(`  ${text.substring(0, 300)}`);
      }
    }
  }

  // Also try get_content_item_by_path with a known page path
  const pagePath = "/sitecore/content/sites/main/home/tidal-home";
  console.log(`\n  Trying get_content_item_by_path for ${pagePath}...`);
  const pathResult = await callTool(client, "get_content_item_by_path", {
    itemPath: pagePath,
    language: "en",
  });
  const pathText = getTextContent(pathResult);
  if (pathText) {
    console.log(`  Response (first 500 chars): ${pathText.substring(0, 500)}`);
  }

  return null;
}

// ============================================================
// Step 7: Try component/page tools for rendering data
// ============================================================

async function tryComponentTools(client, pageId) {
  console.log(
    `\n=== Step 7: Trying component/page tools for rendering data ===\n`
  );

  // get_components_on_page — this is the most promising tool
  // Schema: pageId (required), language (optional), version (optional)
  console.log("--- 7a: get_components_on_page ---");
  const componentsResult = await callTool(client, "get_components_on_page", {
    pageId: pageId,
  });
  const componentsText = getTextContent(componentsResult);
  if (componentsText) {
    console.log("\n  Components on page (full response):");
    console.log(componentsText);

    // Check if it includes rendering parameters
    if (componentsText.includes("par=") || componentsText.includes("par:")) {
      console.log("\n  >>> RENDERING PARAMETERS FOUND IN COMPONENTS! <<<");
    }
    if (
      componentsText.includes("placeholder") ||
      componentsText.includes("Placeholder")
    ) {
      console.log("\n  >>> PLACEHOLDER INFO FOUND IN COMPONENTS! <<<");
    }
  }

  // get_page — might include layout/presentation info
  // Schema: pageId (required), language (optional)
  console.log("\n--- 7b: get_page ---");
  const pageResult = await callTool(client, "get_page", {
    pageId: pageId,
  });
  const pageText = getTextContent(pageResult);
  if (pageText) {
    console.log("\n  Page details (full response):");
    console.log(pageText.substring(0, 5000));
    if (pageText.length > 5000) {
      console.log("  ... (truncated at 5000 chars)");
    }
  }

  // get_page_template_by_id — wants templateId, not pageId
  // We got the templateId from search results: 300f3d1b-52ef-4734-8eab-ae2e2a422759
  console.log("\n--- 7c: get_page_template_by_id ---");
  const templateResult = await callTool(client, "get_page_template_by_id", {
    templateId: "300f3d1b-52ef-4734-8eab-ae2e2a422759",
  });
  const templateText = getTextContent(templateResult);
  if (templateText) {
    console.log("\n  Page template details (first 3000 chars):");
    console.log(templateText.substring(0, 3000));
  }

  // get_page_html — requires pageId and language
  console.log("\n--- 7d: get_page_html ---");
  const htmlResult = await callTool(client, "get_page_html", {
    pageId: pageId,
    language: "en",
  });
  const htmlText = getTextContent(htmlResult);
  if (htmlText) {
    console.log(
      `\n  Page HTML (${htmlText.length} chars, first 500):`
    );
    console.log(htmlText.substring(0, 500));
    // Check for Sitecore rendering markers in HTML
    if (
      htmlText.includes("sc-") ||
      htmlText.includes("data-sc-") ||
      htmlText.includes("chromeType")
    ) {
      console.log("\n  >>> SITECORE RENDERING MARKERS FOUND IN HTML! <<<");
    }
  }

  return { componentsText, pageText, templateText };
}

// ============================================================
// Step 8: Try additional undocumented tools
// ============================================================

async function tryUndocumentedTools(client, pageId) {
  console.log(
    `\n=== Step 8: Trying undocumented/less-known tools ===\n`
  );

  // get_site_id_from_item — schema: itemId (required)
  const siteIdResult = await callTool(client, "get_site_id_from_item", {
    itemId: pageId,
  });
  const siteIdText = getTextContent(siteIdResult);
  if (siteIdText) {
    console.log(`  Site ID for item: ${siteIdText}`);
  }

  // Try to get personalization versions — these involve renderings
  console.log("\n  Trying get_personalization_versions_by_page...");
  const persResult = await callTool(
    client,
    "get_personalization_versions_by_page",
    { pageId: pageId }
  );
  const persText = getTextContent(persResult);
  if (persText) {
    console.log(
      `\n  Personalization versions (first 2000 chars):`
    );
    console.log(persText.substring(0, 2000));
  }

  // Try get_allowed_components_by_placeholder — might tell us placeholder names
  console.log("\n  Trying get_allowed_components_by_placeholder...");
  const allowedResult = await callTool(
    client,
    "get_allowed_components_by_placeholder",
    { pageId: pageId, placeholderName: "headless-main" }
  );
  const allowedText = getTextContent(allowedResult);
  if (allowedText) {
    console.log(`\n  Allowed components (first 2000 chars):`);
    console.log(allowedText.substring(0, 2000));
  }
}

// ============================================================
// Step 9: Try update_content to see if it accepts rendering fields
// ============================================================

async function inspectUpdateContentSchema(client, tools) {
  console.log(
    `\n=== Step 9: Inspecting update_content tool schema ===\n`
  );

  const updateTool = tools.find((t) => t.name === "update_content");
  if (updateTool) {
    console.log("  update_content tool schema:");
    console.log(JSON.stringify(updateTool.inputSchema, null, 2));
    console.log("\n  Description:", updateTool.description);
  } else {
    console.log("  update_content tool not found!");
  }

  // Also check create_content_item schema
  const createTool = tools.find((t) => t.name === "create_content_item");
  if (createTool) {
    console.log("\n  create_content_item tool schema:");
    console.log(JSON.stringify(createTool.inputSchema, null, 2));
  }

  // Check add_component_on_page schema — this is how components get added
  const addComponentTool = tools.find(
    (t) => t.name === "add_component_on_page"
  );
  if (addComponentTool) {
    console.log("\n  add_component_on_page tool schema:");
    console.log(JSON.stringify(addComponentTool.inputSchema, null, 2));
    console.log("\n  Description:", addComponentTool.description);
  }

  // Check remove_component_on_page schema
  const removeComponentTool = tools.find(
    (t) => t.name === "remove_component_on_page"
  );
  if (removeComponentTool) {
    console.log("\n  remove_component_on_page tool schema:");
    console.log(JSON.stringify(removeComponentTool.inputSchema, null, 2));
  }

  // Check set_component_datasource schema
  const setDsTool = tools.find(
    (t) => t.name === "set_component_datasource"
  );
  if (setDsTool) {
    console.log("\n  set_component_datasource tool schema:");
    console.log(JSON.stringify(setDsTool.inputSchema, null, 2));
  }
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log("=".repeat(70));
  console.log("  RESEARCH: Sitecore marketer-mcp Renderings/Presentation");
  console.log("  Date: " + new Date().toISOString());
  console.log("=".repeat(70));

  // Step 1: Get token
  const accessToken = await getAccessToken();

  // Step 2: Connect
  const client = await connectMCP(accessToken);

  // Step 3: List tools
  const tools = await listAndFilterTools(client);

  // Step 4: Search for a page
  const searchResults = await searchForPage(client);
  const searchText = searchResults?.text || null;
  const siteName = searchResults?.siteName || null;

  // Extract an item/page ID from the search results
  let pageId = null;

  if (searchText) {
    // Try to parse a page ID from the search results
    try {
      const parsed = JSON.parse(searchText);
      // Handle various response shapes
      const items = parsed.pages || parsed.items || (Array.isArray(parsed) ? parsed : null);
      if (items && items.length > 0) {
        pageId = items[0].id || items[0].itemId || items[0].pageId;
        console.log(`\n  Extracted page ID from first result: ${pageId}`);
        if (items[0].name || items[0].title || items[0].path) {
          console.log(`  Page name/path: ${items[0].name || items[0].title || items[0].path}`);
        }
      } else if (parsed.id) {
        pageId = parsed.id;
      }
    } catch {
      // Try regex for GUIDs
      const guidMatch = searchText.match(
        /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
      );
      if (guidMatch) {
        pageId = guidMatch[0];
        console.log(`\n  Extracted page ID via regex: ${pageId}`);
      }
    }
  }

  if (!pageId) {
    console.error(
      "\n  Could not extract a page ID from search results."
    );
    console.log(
      "  Trying to get all pages for the first site instead..."
    );

    if (siteName) {
      const pagesResult = await callTool(client, "get_all_pages_by_site", {
        siteName: siteName,
      });
      const pagesText = getTextContent(pagesResult);
      if (pagesText) {
        console.log(`\n  All pages response (first 2000 chars):`);
        console.log(pagesText.substring(0, 2000));
        const guidMatch = pagesText.match(
          /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
        );
        if (guidMatch) {
          pageId = guidMatch[0];
          console.log(`\n  Found page ID from pages list: ${pageId}`);
        }
      }
    }
  }

  if (pageId) {
    console.log(`\n  Using page ID: ${pageId}`);

    // Step 5: Get content item
    await inspectContentItem(client, pageId);

    // Step 6: Try with field hints
    await tryFieldHints(client, pageId);

    // Step 7: Try component/page tools
    await tryComponentTools(client, pageId);

    // Step 8: Try undocumented tools
    await tryUndocumentedTools(client, pageId);
  } else {
    console.error("\n  FATAL: Could not find any page ID to inspect.");
    console.log(
      "  The remaining steps require a page ID. Skipping Steps 5-8."
    );
  }

  // Step 9: Inspect tool schemas regardless
  await inspectUpdateContentSchema(client, tools);

  // ============================================================
  // Final Summary
  // ============================================================

  console.log("\n" + "=".repeat(70));
  console.log("  RESEARCH COMPLETE — SUMMARY");
  console.log("=".repeat(70));
  console.log(`
Key questions to answer:
1. What fields does get_content_item_by_id return?
   => See Step 5 output above

2. Is __Final Renderings or __Renderings among them?
   => Check Step 5 field list for rendering keywords

3. What does the presentation details XML look like?
   => Check Step 5 for XML fields, Step 7a for component data

4. Can you see rendering parameters (par attribute)?
   => Check Steps 5 and 7 for par= patterns

5. What tools relate to component/rendering data?
   => get_components_on_page, add_component_on_page,
      remove_component_on_page, set_component_datasource,
      get_allowed_components_by_placeholder,
      get_personalization_versions_by_page
  `);

  // Clean up
  try {
    await client.close();
  } catch {
    // Ignore close errors
  }

  console.log("Done.\n");
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});
