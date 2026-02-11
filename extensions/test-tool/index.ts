/**
 * @description
 * Minimal throwaway OpenClaw extension that exposes a single dummy tool.
 * Purpose: discover the exact tool name format that OpenClaw assigns to
 * extension-exposed tools (e.g., "test-tool__echo_test", "test_tool.echo_test",
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
 * - OpenClaw extension API (api.registerTool, api.logger)
 * - @sinclair/typebox for schema definition
 *
 * @notes
 * - Uses the confirmed register(api) plugin pattern
 * - The echo_test tool simply returns whatever input it receives
 * - No external dependencies — purely self-contained
 * - The plugin ID "test-tool" and tool name "echo_test" are chosen to make
 *   it easy to grep for the resulting format in the agent's tool list
 */

import { Type } from "@sinclair/typebox";

// OpenClaw extension API surface used by this plugin
interface OpenClawApi {
  logger: {
    info: (msg: string) => void;
    error: (msg: string) => void;
  };
  registerTool: (def: {
    name: string;
    description: string;
    parameters: unknown;
    execute: (
      toolCallId: string,
      params: Record<string, unknown>,
    ) => Promise<{ content: Array<{ type: string; text: string }> }>;
  }) => void;
}

export default function (api: OpenClawApi) {
  api.logger.info(
    "[test-tool] Initializing test plugin for tool name discovery",
  );

  api.registerTool({
    name: "echo_test",
    description:
      "Throwaway test tool that echoes back its input. " +
      "Used to discover the exact tool name format OpenClaw assigns " +
      "to extension-exposed tools. Check the agent's tool list to see " +
      "what name this tool was given.",
    parameters: Type.Object({
      message: Type.String({
        description: "Any message to echo back",
      }),
    }),

    async execute(
      _toolCallId: string,
      params: Record<string, unknown>,
    ) {
      const msg = String(params.message || "");
      const response = `[test-tool echo] You said: "${msg}"`;
      api.logger.info(`[test-tool] echo_test called with: ${msg}`);
      return {
        content: [{ type: "text", text: response }],
      };
    },
  });
}
