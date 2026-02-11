/**
 * @description
 * Minimal throwaway OpenClaw plugin that exposes a single dummy tool.
 * Purpose: discover the exact tool name format that OpenClaw assigns to
 * plugin-exposed tools (e.g., "test-tool__echo_test", "test_tool.echo_test",
 * "echo_test", etc.).
 *
 * This is Task 1.3.1 from the project TODO — it blocks ALL skill
 * `allowed-tools:` updates because we need the confirmed naming format.
 *
 * After capturing the format:
 * 1. Document it in Task 1.3.2
 * 2. DELETE this entire extensions/test-tool/ directory
 * 3. Redeploy
 *
 * @dependencies
 * - OpenClaw plugin SDK (Type from @sinclair/typebox via OpenClaw)
 *
 * @notes
 * - Follows the exact same pattern as extensions/sitecore-mcp/index.ts
 * - The echo_test tool simply returns whatever input it receives
 * - No external dependencies — purely self-contained
 * - The plugin ID "test-tool" and tool name "echo_test" are chosen to make
 *   it easy to grep for the resulting format in the agent's tool list
 */

import { Type } from "@sinclair/typebox";

/**
 * OpenClaw plugin export.
 *
 * Plugin ID: "test-tool"
 * Slot: "tool" — registers tools that the agent can call
 *
 * Config: none (no configuration needed for this throwaway plugin)
 */
export default {
  id: "test-tool",
  slot: "tool",

  // Empty config schema — this plugin needs no configuration
  schema: Type.Object({}),

  init: async (_config: Record<string, never>) => {
    console.log("[test-tool] Initializing test plugin for tool name discovery");

    return {
      tools: [
        {
          name: "echo_test",
          description:
            "Throwaway test tool that echoes back its input. " +
            "Used to discover the exact tool name format OpenClaw assigns " +
            "to plugin-exposed tools. Check the agent's tool list to see " +
            "what name this tool was given.",
          inputSchema: Type.Object({
            message: Type.String({
              description: "Any message to echo back",
            }),
          }),

          /**
           * Simply returns the input message wrapped in a confirmation string.
           * The actual output doesn't matter — what matters is the tool NAME
           * that appears in the agent's tool list.
           */
          async execute(params: { message: string }) {
            const response = `[test-tool echo] You said: "${params.message}"`;
            console.log(`[test-tool] echo_test called with: ${params.message}`);
            return {
              success: true,
              output: response,
            };
          },
        },
      ],
    };
  },
};
