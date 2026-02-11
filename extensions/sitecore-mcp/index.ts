/**
 * @description
 * OpenClaw extension plugin that exposes Sitecore marketer-mcp tools to the agent.
 * Acts as a thin HTTP client — all auth and MCP protocol complexity lives in
 * the sitecore-mcp-proxy service (proxy/).
 *
 * How it works:
 * 1. On load, fetches the tool list from the proxy via GET /tools
 * 2. Registers each tool with OpenClaw via api.registerTool()
 * 3. When the agent calls a tool, forwards the request to POST /tools/:name
 * 4. Returns the proxy's response to the agent
 *
 * The proxy runs on Railway's internal network at:
 *   http://sitecore-mcp-proxy.railway.internal:3001
 *
 * @dependencies
 * - OpenClaw extension API (api.registerTool, api.logger)
 * - sitecore-mcp-proxy service (must be running)
 *
 * @notes
 * - Uses the confirmed register(api) plugin pattern, NOT the old slot/init pattern
 * - Authenticates to proxy via x-mcp-token header (MCP_PROXY_TOKEN env var)
 * - Tool names are passed through as-is from marketer-mcp
 * - If the proxy is down at load time, plugin loads with zero tools (no crash)
 * - Execute signature is (toolCallId, params), return is { content: [...] }
 */

// Response shape from the proxy's GET /tools endpoint
interface ProxyTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

interface ProxyToolsResponse {
  tools: ProxyTool[];
}

// OpenClaw extension API surface used by this plugin
interface OpenClawApi {
  logger: {
    info: (msg: string) => void;
    error: (msg: string) => void;
    warn: (msg: string) => void;
  };
  registerTool: (def: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
    execute: (
      toolCallId: string,
      params: Record<string, unknown>,
    ) => Promise<{ content: Array<{ type: string; text: string }> }>;
  }) => void;
}

export default async function (api: OpenClawApi) {
  // Read proxy URL from env var, fall back to Railway internal network address
  const proxyUrl =
    process.env.SITECORE_PROXY_URL ||
    "http://sitecore-mcp-proxy.railway.internal:3001";

  // Read token from environment (same MCP_PROXY_TOKEN env var on both services)
  const token = process.env.MCP_PROXY_TOKEN || "";

  // Build headers — sent on every request to the proxy
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { "x-mcp-token": token }),
  };

  // Fetch available tools from the proxy
  let tools: ProxyTool[];
  try {
    const res = await fetch(`${proxyUrl}/tools`, { headers });
    if (!res.ok) throw new Error(`Proxy ${res.status}`);
    const data: ProxyToolsResponse = await res.json();
    tools = data.tools;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    api.logger.error(`[sitecore-mcp] Failed to fetch tools: ${message}`);
    // Plugin loads but with no tools — prevents OpenClaw from crashing
    return;
  }

  api.logger.info(
    `[sitecore-mcp] Registering ${tools.length} tools from proxy`,
  );

  // Register each tool with OpenClaw
  for (const tool of tools) {
    api.registerTool({
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema, // JSON Schema — passed through from marketer-mcp
      async execute(_toolCallId: string, params: Record<string, unknown>) {
        try {
          const res = await fetch(`${proxyUrl}/tools/${tool.name}`, {
            method: "POST",
            headers,
            body: JSON.stringify(params),
          });

          if (!res.ok) {
            const body = await res.text();
            return {
              content: [
                { type: "text", text: `Proxy error (${res.status}): ${body}` },
              ],
            };
          }

          const result = await res.json();
          const text = JSON.stringify(result.content || result, null, 2);
          return { content: [{ type: "text", text }] };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            content: [
              { type: "text", text: `Failed to reach proxy: ${message}` },
            ],
          };
        }
      },
    });
  }
}
