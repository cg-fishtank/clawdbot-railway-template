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
 * - MUST be a sync function (not async) — OpenClaw ignores async plugin returns
 * - Uses .then() chains to do async fetch work after the sync function returns
 * - The api object remains valid after the function returns, so registerTool()
 *   calls inside .then() callbacks work correctly
 * - Uses the confirmed register(api) plugin pattern, NOT the old slot/init pattern
 * - Authenticates to proxy via x-mcp-token header (MCP_PROXY_TOKEN env var)
 * - Tool names are passed through as-is from marketer-mcp
 * - If the proxy is down at load time, plugin loads with zero tools (no crash)
 * - Execute callbacks can be async since they're invoked later by OpenClaw
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
// NOTE: execute signature uses rest args — OpenClaw's actual callback signature is unknown
// and may differ from docs. See execute callback below for defensive handling.
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
      ...args: unknown[]
    ) => Promise<{ content: Array<{ type: string; text: string }> }>;
  }) => void;
}

// MUST be sync — OpenClaw ignores async plugin functions ("async registration is ignored")
export default function (api: OpenClawApi) {
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

  // Kick off async tool fetch — runs in the event loop after this function returns
  fetch(`${proxyUrl}/tools`, { headers })
    .then((res) => {
      if (!res.ok) throw new Error(`Proxy ${res.status}`);
      return res.json() as Promise<ProxyToolsResponse>;
    })
    .then((data) => {
      const tools = data.tools;
      api.logger.info(
        `[sitecore-mcp] Registering ${tools.length} tools from proxy`,
      );

      // Register each tool with OpenClaw
      for (const tool of tools) {
        api.registerTool({
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema, // JSON Schema — passed through from marketer-mcp

          // Execute callbacks CAN be async — they're invoked later when agent calls the tool
          // Uses rest args because OpenClaw's actual callback signature is unverified.
          // Docs say execute(toolCallId, params) but runtime may differ.
          async execute(...args: unknown[]) {
            // DEBUG: Log raw args to discover OpenClaw's actual callback signature
            const argSummary = args
              .map(
                (a, i) =>
                  `arg${i}(${typeof a}${typeof a === "object" && a !== null ? ":" + Object.keys(a as Record<string, unknown>).join(",") : ""})`,
              )
              .join(" | ");
            api.logger.info(
              `[sitecore-mcp] ${tool.name} called — ${args.length} args — ${argSummary}`,
            );

            // Defensive param extraction — handle multiple possible signatures:
            // 1. execute(toolCallId, params) — docs say this
            // 2. execute(params) — single arg object
            // 3. execute({ id, input/arguments }) — wrapper object
            let params: Record<string, unknown> = {};
            if (
              args.length >= 2 &&
              typeof args[1] === "object" &&
              args[1] !== null
            ) {
              // Signature: execute(toolCallId, params)
              params = args[1] as Record<string, unknown>;
            } else if (
              args.length >= 1 &&
              typeof args[0] === "object" &&
              args[0] !== null
            ) {
              const first = args[0] as Record<string, unknown>;
              if ("input" in first && typeof first.input === "object") {
                // Wrapper: execute({ id, input: {...} })
                params = first.input as Record<string, unknown>;
              } else if (
                "arguments" in first &&
                typeof first.arguments === "object"
              ) {
                // Wrapper: execute({ id, arguments: {...} })
                params = first.arguments as Record<string, unknown>;
              } else {
                // Single arg: execute(params)
                params = first;
              }
            }

            api.logger.info(
              `[sitecore-mcp] ${tool.name} resolved params: ${JSON.stringify(params)}`,
            );

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
                    {
                      type: "text",
                      text: `Proxy error (${res.status}): ${body}`,
                    },
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
    })
    .catch((err: unknown) => {
      // Proxy unreachable at startup — plugin loads with zero tools, no crash
      const message = err instanceof Error ? err.message : String(err);
      api.logger.error(`[sitecore-mcp] Failed to fetch tools: ${message}`);
    });
}
