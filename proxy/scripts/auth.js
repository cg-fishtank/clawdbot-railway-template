/**
 * @description
 * OAuth script for obtaining Sitecore Identity tokens.
 * Run this on your development machine (NOT on Railway).
 *
 * Supports TWO auth modes (auto-detected):
 *
 * 1. Client Credentials (headless) — when SITECORE_CLIENT_SECRET is set
 *    - No browser needed. Direct token exchange.
 *    - Uses Automation credentials from Sitecore Cloud Portal.
 *    - Token has no refresh_token; proxy re-requests when expired.
 *
 * 2. Authorization Code + PKCE (interactive) — when NO client secret
 *    - Opens browser for Sitecore Identity login.
 *    - Returns access_token + refresh_token.
 *    - For personal/user-delegated access.
 *
 * Usage:
 *   # Create .env with your credentials (see .env.example)
 *   npm run auth
 *
 * @dependencies
 * - node:http: Local callback server (auth code flow only)
 * - node:crypto: PKCE challenge generation (auth code flow only)
 * - node:child_process: Open browser (auth code flow only)
 *
 * @notes
 * - Only needs to run ONCE to get initial tokens
 * - For client_credentials: re-run if token expires and proxy can't auto-renew
 * - For auth_code: re-run if refresh tokens expire (should be rare)
 * - Output file: tokens.json (same format expected by mcp-client.js)
 */

import { createServer } from "node:http";
import { randomBytes, createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

// --- Configuration ---

const CLIENT_ID = process.env.SITECORE_CLIENT_ID;
const CLIENT_SECRET = process.env.SITECORE_CLIENT_SECRET || "";
const AUTH_URL = process.env.SITECORE_AUTH_URL || "https://auth.sitecorecloud.io/authorize";
const TOKEN_URL = process.env.SITECORE_TOKEN_URL || "https://auth.sitecorecloud.io/oauth/token";
const AUDIENCE = process.env.SITECORE_AUDIENCE || "https://api.sitecorecloud.io";
const CALLBACK_PORT = 9876;
const REDIRECT_URI = `http://localhost:${CALLBACK_PORT}/callback`;
const OUTPUT_FILE = resolve(process.cwd(), "tokens.json");

// Scopes needed for marketer-mcp operations
const SCOPES = "openid profile email offline_access";

if (!CLIENT_ID) {
  console.error("ERROR: SITECORE_CLIENT_ID is required.");
  console.error("");
  console.error("Set it via environment variable or .env file:");
  console.error("  export SITECORE_CLIENT_ID=your-client-id");
  console.error("");
  console.error("Get your client ID from Sitecore Cloud Portal:");
  console.error("  XM Cloud Deploy > Credentials > Automation");
  process.exit(1);
}

// --- PKCE Helpers ---

function generateCodeVerifier() {
  return randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier) {
  return createHash("sha256").update(verifier).digest("base64url");
}

// --- Open browser (cross-platform) ---

function openBrowser(url) {
  const platform = process.platform;
  try {
    if (platform === "darwin") {
      execSync(`open "${url}"`);
    } else if (platform === "win32") {
      execSync(`start "" "${url}"`);
    } else {
      execSync(`xdg-open "${url}"`);
    }
  } catch {
    console.log("\nCould not open browser automatically. Open this URL manually:");
    console.log(url);
  }
}

// --- Client Credentials Flow (headless — no browser needed) ---

async function clientCredentialsFlow() {
  console.log("=== Sitecore marketer-mcp — Client Credentials Flow ===\n");
  console.log("Using Automation credentials (no browser needed).\n");

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
    console.error(`Token request failed (${response.status}):`);
    console.error(text);
    console.error("");
    if (response.status === 401 || response.status === 403) {
      console.error("Check that SITECORE_CLIENT_ID and SITECORE_CLIENT_SECRET are correct.");
      console.error("Automation credentials are created at: Sitecore Cloud Portal > Credentials > Automation");
    }
    process.exit(1);
  }

  const tokenData = await response.json();

  saveTokens(tokenData, "client_credentials");

  console.log("Client credentials flow complete.");
  console.log("No refresh_token — proxy will re-request when expired.\n");
  printNextSteps();
}

// --- Authorization Code + PKCE Flow (interactive browser) ---

async function authorizationCodeFlow() {
  console.log("=== Sitecore marketer-mcp — Authorization Code + PKCE Flow ===\n");
  console.log("No client secret detected. Using interactive browser login.\n");

  // Generate PKCE
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Build authorization URL
  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    audience: AUDIENCE,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const authorizationUrl = `${AUTH_URL}?${authParams.toString()}`;

  // Start local callback server
  const authCode = await new Promise((resolveCode, reject) => {
    const server = createServer(async (req, res) => {
      if (!req.url?.startsWith("/callback")) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      const url = new URL(req.url, `http://localhost:${CALLBACK_PORT}`);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<h1>Auth Error</h1><p>${error}: ${url.searchParams.get("error_description")}</p>`);
        server.close();
        reject(new Error(`OAuth error: ${error}`));
        return;
      }

      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h1>Error</h1><p>No authorization code received.</p>");
        server.close();
        reject(new Error("No authorization code received"));
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        "<h1>Success!</h1><p>Authorization code received. You can close this tab.</p>" +
          "<p>Check your terminal for next steps.</p>"
      );

      server.close();
      resolveCode(code);
    });

    server.listen(CALLBACK_PORT, () => {
      console.log(`Callback server listening on port ${CALLBACK_PORT}`);
      console.log("\nOpening browser for Sitecore Identity login...\n");
      openBrowser(authorizationUrl);
      console.log("Waiting for authorization...");
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error("Authorization timed out after 5 minutes."));
    }, 5 * 60 * 1000);
  });

  console.log("\nAuthorization code received. Exchanging for tokens...\n");

  // Exchange code for tokens
  const tokenBody = new URLSearchParams({
    grant_type: "authorization_code",
    code: authCode,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  });

  const tokenResponse = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: tokenBody.toString(),
  });

  if (!tokenResponse.ok) {
    const text = await tokenResponse.text();
    console.error(`Token exchange failed (${tokenResponse.status}):`);
    console.error(text);
    process.exit(1);
  }

  const tokenData = await tokenResponse.json();

  saveTokens(tokenData, "authorization_code");

  console.log("Authorization code flow complete.");
  console.log(`Refresh token: ${tokenData.refresh_token ? "present" : "NOT present"}\n`);
  printNextSteps();
}

// --- Shared: Save tokens + print next steps ---

function saveTokens(tokenData, authMode) {
  const tokenFile = {
    tokens: {
      access_token: tokenData.access_token,
      token_type: tokenData.token_type || "Bearer",
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token || null,
      scope: tokenData.scope,
    },
    clientInfo: {
      client_id: CLIENT_ID,
      client_name: "sitecore-mcp-proxy",
    },
    authMode,
    tokenExpires: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
    created: new Date().toISOString(),
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(tokenFile, null, 2), { mode: 0o600 });

  console.log(`Tokens saved to: ${OUTPUT_FILE}`);
  console.log(`Token expires: ${tokenFile.tokenExpires}`);
  console.log(`Auth mode: ${authMode}`);
}

function printNextSteps() {
  console.log("=== Next Steps ===");
  console.log("");
  console.log("Upload tokens.json to the Railway proxy volume:");
  console.log("");
  console.log("  # Via Tailscale SSH:");
  console.log("  scp tokens.json railway-host:/data/tokens.json");
  console.log("");
  console.log("  # Or via Railway CLI:");
  console.log("  railway volume upload tokens.json /data/tokens.json");
  console.log("");
  console.log("Then restart the proxy service to pick up the new tokens.");
}

// --- Main: auto-detect flow based on credentials ---

async function main() {
  if (CLIENT_SECRET) {
    await clientCredentialsFlow();
  } else {
    await authorizationCodeFlow();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
