# sitecore-mcp-proxy
# Bridges OpenClaw to Sitecore marketer-mcp via REST-to-MCP translation.
# Runs on Railway's internal network only — no public ports.
# Accessible at: sitecore-mcp-proxy.railway.internal:3001
# Requires /data volume mount for OAuth token persistence.

FROM node:22-bookworm-slim

ENV NODE_ENV=production

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src
COPY scripts ./scripts

# Internal-only port — not publicly exposed
EXPOSE 3001

CMD ["node", "src/server.js"]
