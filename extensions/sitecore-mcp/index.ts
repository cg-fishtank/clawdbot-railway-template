/**
 * @description
 * OpenClaw tool plugin that exposes Sitecore marketer-mcp tools to the agent.
 * Acts as a thin HTTP client — all auth and MCP protocol complexity lives in
 * the sitecore-mcp-proxy service (proxy/).
 *
 * How it works:
 * 1. On init, fetches the tool list from the proxy via GET /tools
 * 2. Registers each tool with OpenClaw using the proxy's schema
 * 3. When the agent calls a tool, forwards the request to POST /tools/:name
 * 4. Returns the proxy's response to the agent
 *
 * The proxy runs on Railway's internal network at:
 *   http://sitecore-mcp-proxy.railway.internal:3001
 *
 * @dependencies
 * - OpenClaw plugin SDK (Type from @sinclair/typebox via OpenClaw)
 * - sitecore-mcp-proxy service (must be running)
 *
 * @notes
 * - Authenticates to proxy via x-mcp-token header (MCP_PROXY_TOKEN env var)
 * - Tool names are passed through as-is from marketer-mcp
 * - If the proxy is down, tool calls will fail with a clear error
 * - The proxyUrl is configurable via plugin config in OpenClaw admin
 *
 * ⚠️  VALIDATION REQUIRED: The exact OpenClaw plugin API (slot, schema, init)
 * needs verification against the actual OpenClaw source. This implementation
 * follows the pattern from the plan research. See:
 * openclaw-railway/Connecting marketer-mcp to OpenClaw.md#Validations Required
 */

import { Type } from "@sinclair/typebox";

/**
 * Tool definition fetched from the proxy.
 */
interface ProxyTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

/**
 * Response from the proxy's GET /tools endpoint.
 */
interface ProxyToolsResponse {
  tools: ProxyTool[];
}

/**
 * OpenClaw plugin export.
 *
 * Plugin ID: "sitecore-mcp"
 * Slot: "tool" — registers tools that the agent can call
 *
 * Config:
 *   proxyUrl — URL of the sitecore-mcp-proxy service
 *              Default: Railway internal network address
 */
export default {
  id: "sitecore-mcp",
  slot: "tool",

  schema: Type.Object({
    proxyUrl: Type.String({
      default: "http://sitecore-mcp-proxy.railway.internal:3001",
      description: "URL of the sitecore-mcp-proxy service",
    }),
    proxyToken: Type.String({
      default: "",
      description: "Auth token for proxy (MCP_PROXY_TOKEN). Set via OpenClaw admin or env.",
    }),
  }),

  init: async (config: { proxyUrl: string; proxyToken: string }) => {
    // Read proxy URL from: plugin config → env var → hardcoded default
    // Set SITECORE_PROXY_URL env var on the OpenClaw Railway service to override
    const proxyUrl =
      config.proxyUrl ||
      process.env.SITECORE_PROXY_URL ||
      "http://sitecore-mcp-proxy.railway.internal:3001";
    // Read token from plugin config OR environment (same env var on both services)
    const token = config.proxyToken || process.env.MCP_PROXY_TOKEN || "";

    // Build auth headers — sent on every request to the proxy
    const authHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      authHeaders["x-mcp-token"] = token;
    }

    console.log(`[sitecore-mcp] Fetching tools from proxy: ${proxyUrl}`);

    // Fetch available tools from the proxy
    let tools: ProxyTool[];
    try {
      const response = await fetch(`${proxyUrl}/tools`, { headers: authHeaders });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Proxy returned ${response.status}: ${body}`);
      }
      const data: ProxyToolsResponse = await response.json();
      tools = data.tools;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[sitecore-mcp] Failed to fetch tools: ${message}`);
      console.error("[sitecore-mcp] Is the sitecore-mcp-proxy service running?");
      // Return empty tools — plugin loads but no tools are available
      // This prevents OpenClaw from crashing if the proxy is temporarily down
      return { tools: [] };
    }

    console.log(`[sitecore-mcp] Loaded ${tools.length} tools from marketer-mcp`);

    // Map each proxy tool to an OpenClaw tool definition
    return {
      tools: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,

        /**
         * Execute the tool by forwarding to the proxy.
         * The proxy handles MCP protocol + OAuth with Sitecore.
         */
        async execute(params: Record<string, unknown>) {
          try {
            const response = await fetch(`${proxyUrl}/tools/${tool.name}`, {
              method: "POST",
              headers: authHeaders,
              body: JSON.stringify(params),
            });

            if (!response.ok) {
              const body = await response.text();
              return {
                success: false,
                output: `Proxy error (${response.status}): ${body}`,
              };
            }

            const result = await response.json();
            return {
              success: !result.isError,
              output: JSON.stringify(result.content || result, null, 2),
            };
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            return {
              success: false,
              output: `Failed to reach proxy: ${message}`,
            };
          }
        },
      })),
    };
  },
};
