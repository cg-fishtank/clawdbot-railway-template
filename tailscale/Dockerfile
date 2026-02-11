# tailscale/Dockerfile
# ---------------------------------------------------------------------------
# Tailscale Subnet Router for Railway
# ---------------------------------------------------------------------------
# This container runs a Tailscale subnet router that bridges the tailnet to
# Railway's private internal network (fd12::/16). Once deployed as a separate
# service in the same Railway project as OpenClaw Gateway and the Sitecore
# MCP Proxy, it allows any device on the tailnet to reach those services at
# their internal addresses:
#
#   - openclaw-gateway.railway.internal:8080
#   - sitecore-mcp-proxy.railway.internal:3001
#
# Neither service needs a public URL — all traffic flows through Tailscale.
#
# Required environment variables (set in Railway):
#   TS_AUTHKEY  - Pre-authenticated Tailscale auth key (tskey-auth-...)
#                 Generate at: https://login.tailscale.com/admin/settings/keys
#                 Options: Reusable + Ephemeral recommended
#
# Optional environment variables:
#   TS_HOSTNAME - Tailscale device hostname (default: openclaw-router)
#   TS_ROUTES   - Comma-separated CIDR routes to advertise
#                 (default: fd12::/16 — Railway's internal IPv6 range)
#
# Post-deploy steps:
#   1. Approve the fd12::/16 route in Tailscale Admin → Machines
#   2. Configure split DNS: nameserver fd12::10 for domain railway.internal
#   3. Remove public domains from OpenClaw Gateway and Proxy services
#
# @dependencies
#   - Alpine Linux 3.20: Minimal base image
#   - tailscale: Tailscale client/daemon packages
#   - ip6tables: Required for IPv6 subnet routing
#   - iptables: Required for IPv4 subnet routing (fallback)
#
# @notes
#   - Railway containers run unprivileged but Tailscale userspace networking
#     works without TUN device access
#   - start.sh handles authentication, IP forwarding, and route advertisement
# ---------------------------------------------------------------------------

FROM alpine:3.20

RUN apk add --no-cache \
    tailscale \
    iptables \
    ip6tables \
    bash \
    curl

# Copy and make the entrypoint executable
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Tailscale state directory — persists identity across restarts if volume-mounted
RUN mkdir -p /var/lib/tailscale

ENTRYPOINT ["/start.sh"]
