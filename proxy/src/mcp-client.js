/**
 * @description
 * MCP client manager that connects to Sitecore marketer-mcp and manages
 * OAuth tokens. Wraps @modelcontextprotocol/sdk for the proxy server.
 *
 * Responsibilities:
 * - Connect to marketer-mcp via StreamableHTTP transport
 * - Load/save/refresh OAuth tokens from persistent storage
 * - Cache the tool list to avoid repeated listTools() calls
 * - Provide callTool() that forwards requests to marketer-mcp
 * - Auto-reconnect on token refresh
 *
 * @dependencies
 * - @modelcontextprotocol/sdk: Official MCP client SDK
 * - fs: Token persistence to /data/tokens.json
 *
 * @notes
 * - Token refresh is handled by a custom OAuthClientProvider implementation
 * - If refresh tokens expire, the proxy returns 503 until re-auth via scripts/auth.js
 * - The MCP SDK handles the Streamable HTTP protocol (SSE + POST)
 * - Tool cache is populated on connect() and can be refreshed via reconnect()
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Custom OAuth provider that loads pre-obtained tokens from disk.
 * Implements the OAuthClientProvider interface expected by the MCP SDK.
 *
 * Auth flow:
 * 1. Initial tokens obtained via scripts/auth.js (one-time, local, interactive)
 * 2. This provider loads them from TOKEN_PATH on startup
 * 3. MCP SDK calls tokens() before each request
 * 4. If token is expired, SDK triggers refresh via the provider
 * 5. Updated tokens are persisted back to disk
 *
 * If interactive auth is needed (tokens fully expired, no refresh possible),
 * redirectToAuthorization() throws — the user must re-run scripts/auth.js.
 */
class FileTokenProvider {
  constructor({ tokenPath, tokenUrl, clientId, clientSecret, audience }) {
    this.tokenPath = tokenPath;
    this.tokenUrl = tokenUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.audience = audience;

    this._tokens = null;
    this._clientInfo = null;
    this._codeVerifier = null;
    this._tokenExpires = null;
    this._authMode = null; // "client_credentials" or "authorization_code"

    this._load();
  }

  // --- OAuthClientProvider interface ---

  get redirectUrl() {
    return "http://localhost:9876/callback";
  }

  get clientMetadata() {
    return {
      client_name: "sitecore-mcp-proxy",
      redirect_uris: ["http://localhost:9876/callback"],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: this.clientSecret ? "client_secret_post" : "none",
    };
  }

  clientInformation() {
    return this._clientInfo;
  }

  async saveClientInformation(info) {
    this._clientInfo = info;
    this._persist();
  }

  tokens() {
    return this._tokens;
  }

  async saveTokens(tokens) {
    this._tokens = tokens;
    // Track expiry for health endpoint
    if (tokens.expires_in) {
      this._tokenExpires = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
    }
    this._persist();
    console.log("[tokens] Tokens updated and persisted.");
  }

  async redirectToAuthorization(url) {
    // Cannot do interactive auth on Railway — throw so the proxy returns 503
    console.error("[tokens] Interactive OAuth required but not available on server.");
    console.error("[tokens] Run 'npm run auth' locally and upload tokens.json to /data/");
    console.error("[tokens] Authorization URL:", url.toString());
    throw new Error(
      "Interactive OAuth required. Run scripts/auth.js locally to re-authenticate."
    );
  }

  async saveCodeVerifier(verifier) {
    this._codeVerifier = verifier;
  }

  codeVerifier() {
    return this._codeVerifier;
  }

  // --- Token expiry info (for health endpoint) ---

  getTokenExpires() {
    return this._tokenExpires;
  }

  hasTokens() {
    return this._tokens !== null && this._tokens.access_token !== undefined;
  }

  // --- Manual refresh (fallback if SDK doesn't handle it) ---

  async refreshManually() {
    // Client credentials mode: re-request a fresh token (no refresh_token needed)
    if (this._authMode === "client_credentials" || (!this._tokens?.refresh_token && this.clientSecret)) {
      return this._clientCredentialsGrant();
    }

    // Authorization code mode: use refresh_token
    if (!this._tokens?.refresh_token) {
      throw new Error("No refresh token available. Run scripts/auth.js to re-authenticate.");
    }

    console.log("[tokens] Attempting refresh_token grant...");

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: this._tokens.refresh_token,
      client_id: this.clientId,
      audience: this.audience,
    });

    if (this.clientSecret) {
      body.set("client_secret", this.clientSecret);
    }

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Token refresh failed (${response.status}): ${text}`);
    }

    const data = await response.json();

    this._tokens = {
      access_token: data.access_token,
      token_type: data.token_type || "Bearer",
      expires_in: data.expires_in,
      // Sitecore may or may not return a new refresh token
      refresh_token: data.refresh_token || this._tokens.refresh_token,
      scope: data.scope,
    };

    this._tokenExpires = new Date(Date.now() + data.expires_in * 1000).toISOString();
    this._persist();

    console.log(`[tokens] Refresh successful. New token expires: ${this._tokenExpires}`);
    return this._tokens;
  }

  // --- Client credentials grant (headless token renewal) ---

  async _clientCredentialsGrant() {
    console.log("[tokens] Requesting new token via client_credentials grant...");

    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.audience,
    });

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Client credentials grant failed (${response.status}): ${text}`);
    }

    const data = await response.json();

    this._tokens = {
      access_token: data.access_token,
      token_type: data.token_type || "Bearer",
      expires_in: data.expires_in,
      refresh_token: null, // client_credentials never returns a refresh token
      scope: data.scope,
    };

    this._authMode = "client_credentials";
    this._tokenExpires = new Date(Date.now() + data.expires_in * 1000).toISOString();
    this._persist();

    console.log(`[tokens] Client credentials grant successful. Token expires: ${this._tokenExpires}`);
    return this._tokens;
  }

  // --- Persistence ---

  _load() {
    if (!existsSync(this.tokenPath)) {
      console.warn(`[tokens] No token file at ${this.tokenPath}. Run scripts/auth.js first.`);
      return;
    }

    try {
      const raw = readFileSync(this.tokenPath, "utf-8");
      const data = JSON.parse(raw);
      this._tokens = data.tokens || null;
      this._clientInfo = data.clientInfo || null;
      this._tokenExpires = data.tokenExpires || null;
      this._authMode = data.authMode || null;

      if (this._tokens) {
        console.log("[tokens] Loaded tokens from disk.");
        if (this._tokenExpires) {
          console.log(`[tokens] Token expires: ${this._tokenExpires}`);
        }
      }
    } catch (err) {
      console.error(`[tokens] Failed to load ${this.tokenPath}:`, err.message);
    }
  }

  _persist() {
    try {
      // Ensure parent directory exists (handles first-run on empty volume)
      const dir = dirname(this.tokenPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      writeFileSync(
        this.tokenPath,
        JSON.stringify(
          {
            tokens: this._tokens,
            clientInfo: this._clientInfo,
            authMode: this._authMode,
            tokenExpires: this._tokenExpires,
            updated: new Date().toISOString(),
          },
          null,
          2
        ),
        { mode: 0o600 } // Owner-only read/write for security
      );
    } catch (err) {
      console.error(`[tokens] Failed to persist to ${this.tokenPath}:`, err.message);
    }
  }
}

/**
 * Manages the MCP client lifecycle: connect, list tools, call tools, reconnect.
 *
 * Usage:
 *   const manager = new McpClientManager({ mcpUrl, tokenPath, ... });
 *   await manager.connect();
 *   const tools = manager.getTools();
 *   const result = await manager.callTool("get_page", { pageId: "..." });
 */
export class McpClientManager {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.transport = null;
    this.tokenProvider = new FileTokenProvider(config);
    this.toolCache = [];
    this.connected = false;
    this.lastError = null;
  }

  /**
   * Connect to marketer-mcp and populate the tool cache.
   * Creates a new MCP Client + StreamableHTTP transport with OAuth.
   */
  async connect() {
    if (!this.tokenProvider.hasTokens()) {
      // If client_credentials are available, auto-request a token on startup
      // This eliminates the need to upload tokens.json to the Railway volume
      if (this.config.clientSecret) {
        console.log("[mcp] No tokens found. Auto-requesting via client_credentials...");
        await this.tokenProvider._clientCredentialsGrant();
      } else {
        this.lastError = "No tokens loaded. Run scripts/auth.js first.";
        throw new Error(this.lastError);
      }
    }

    try {
      // Create the transport with our OAuth provider
      this.transport = new StreamableHTTPClientTransport(
        new URL(this.config.mcpUrl),
        { authProvider: this.tokenProvider }
      );

      // Create the MCP client
      this.client = new Client(
        { name: "sitecore-mcp-proxy", version: "1.0.0" },
        { capabilities: {} }
      );

      // Connect — the SDK handles the HTTP handshake + auth
      await this.client.connect(this.transport);

      // Populate tool cache
      const response = await this.client.listTools();
      this.toolCache = (response.tools || []).map((tool) => ({
        name: tool.name,
        description: tool.description || "",
        inputSchema: tool.inputSchema || {},
      }));

      this.connected = true;
      this.lastError = null;

      console.log(`[mcp] Connected to ${this.config.mcpUrl}`);
      console.log(`[mcp] ${this.toolCache.length} tools available.`);
    } catch (err) {
      this.connected = false;
      this.lastError = err.message;

      // If auth-related, try manual refresh and retry once
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        console.warn("[mcp] Auth error. Attempting manual token refresh...");
        try {
          await this.tokenProvider.refreshManually();
          // Retry connection after refresh
          return this.connect();
        } catch (refreshErr) {
          this.lastError = `Token refresh failed: ${refreshErr.message}`;
          throw new Error(this.lastError);
        }
      }

      throw err;
    }
  }

  /**
   * Disconnect and reconnect. Used after token refresh or on-demand via API.
   */
  async reconnect() {
    console.log("[mcp] Reconnecting...");
    if (this.client) {
      try {
        await this.client.close();
      } catch {
        // Ignore close errors
      }
    }
    this.client = null;
    this.transport = null;
    this.connected = false;
    await this.connect();
  }

  /**
   * Call a tool on marketer-mcp by name.
   * Returns the MCP result object: { content: [...], isError: bool }
   */
  async callTool(name, args) {
    if (!this.client || !this.connected) {
      // Try to reconnect on-demand
      await this.connect();
    }

    // Validate tool exists
    const tool = this.toolCache.find((t) => t.name === name);
    if (!tool) {
      const err = new Error(
        `Unknown tool: ${name}. Available: ${this.toolCache.map((t) => t.name).join(", ")}`
      );
      err.status = 404;
      throw err;
    }

    try {
      const result = await this.client.callTool({ name, arguments: args });
      return result;
    } catch (err) {
      // If auth error during call, refresh and retry once
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        console.warn(`[mcp] Auth error calling ${name}. Refreshing tokens...`);
        await this.tokenProvider.refreshManually();
        await this.reconnect();
        return this.client.callTool({ name, arguments: args });
      }
      throw err;
    }
  }

  // --- Accessors ---

  isReady() {
    return this.connected && this.toolCache.length > 0;
  }

  getTools() {
    return this.toolCache;
  }

  getStatus() {
    return {
      connected: this.connected,
      toolCount: this.toolCache.length,
      tokenExpires: this.tokenProvider.getTokenExpires(),
      lastError: this.lastError,
    };
  }
}
