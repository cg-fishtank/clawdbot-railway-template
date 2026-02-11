#!/usr/bin/env bash
# tailscale/start.sh
# ---------------------------------------------------------------------------
# Tailscale Subnet Router Entrypoint for Railway
# ---------------------------------------------------------------------------
# This script starts the Tailscale daemon and configures it as a subnet
# router that advertises Railway's internal IPv6 network (fd12::/16).
#
# Once running, any device on the tailnet can reach Railway-internal
# services by their DNS names (e.g., openclaw-gateway.railway.internal).
#
# Environment variables:
#   TS_AUTHKEY  (required) - Tailscale pre-authenticated key (tskey-auth-...)
#   TS_HOSTNAME (optional) - Device name on the tailnet (default: openclaw-router)
#   TS_ROUTES   (optional) - CIDR routes to advertise (default: fd12::/16)
#
# What this script does:
#   1. Validates that TS_AUTHKEY is set
#   2. Enables IPv4 and IPv6 forwarding (required for subnet routing)
#   3. Starts tailscaled in userspace networking mode (no TUN device needed)
#   4. Authenticates with the tailnet using TS_AUTHKEY
#   5. Advertises the configured subnet routes
#   6. Waits on the tailscaled process (keeps the container alive)
#
# @notes
#   - Railway containers lack CAP_NET_ADMIN, so we use --tun=userspace-networking
#   - IP forwarding sysctls may fail silently in unprivileged containers;
#     Tailscale userspace mode handles routing regardless
#   - The --accept-dns=false flag prevents Tailscale from overwriting
#     Railway's internal DNS resolver (fd12::10)
# ---------------------------------------------------------------------------

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration with defaults
# ---------------------------------------------------------------------------
TS_HOSTNAME="${TS_HOSTNAME:-openclaw-router}"
TS_ROUTES="${TS_ROUTES:-fd12::/16}"

# ---------------------------------------------------------------------------
# Validate required environment
# ---------------------------------------------------------------------------
if [ -z "${TS_AUTHKEY:-}" ]; then
  echo "FATAL: TS_AUTHKEY is not set. Generate one at:"
  echo "  https://login.tailscale.com/admin/settings/keys"
  echo "  Options: Reusable + Ephemeral recommended"
  exit 1
fi

echo "=== Tailscale Subnet Router ==="
echo "  Hostname: ${TS_HOSTNAME}"
echo "  Routes:   ${TS_ROUTES}"
echo "================================"

# ---------------------------------------------------------------------------
# Enable IP forwarding (best-effort — may be denied in unprivileged containers)
# Tailscale userspace networking works regardless, but kernel forwarding
# improves performance when available.
# ---------------------------------------------------------------------------
sysctl -w net.ipv4.ip_forward=1 2>/dev/null || echo "WARN: Could not set net.ipv4.ip_forward (unprivileged container — OK)"
sysctl -w net.ipv6.conf.all.forwarding=1 2>/dev/null || echo "WARN: Could not set net.ipv6.conf.all.forwarding (unprivileged container — OK)"

# ---------------------------------------------------------------------------
# Start tailscaled in userspace networking mode
# --tun=userspace-networking : No TUN device required (works in Railway)
# --state=/var/lib/tailscale  : Persist identity if volume-mounted
# --socket=/var/run/tailscale/tailscaled.sock : Unix socket for CLI
# ---------------------------------------------------------------------------
mkdir -p /var/run/tailscale
tailscaled \
  --tun=userspace-networking \
  --state=/var/lib/tailscale/tailscaled.state \
  --socket=/var/run/tailscale/tailscaled.sock &

TAILSCALED_PID=$!

# Give tailscaled time to initialize its socket
echo "Waiting for tailscaled to start..."
sleep 3

# ---------------------------------------------------------------------------
# Authenticate and configure subnet routing
# --authkey       : Pre-authenticated key (no browser login needed)
# --hostname      : Device name visible in Tailscale admin console
# --advertise-routes : CIDRs to make reachable from the tailnet
# --accept-dns=false : Don't overwrite Railway's internal DNS (fd12::10)
# --accept-routes    : Accept routes from other subnet routers if any
# ---------------------------------------------------------------------------
tailscale up \
  --authkey="${TS_AUTHKEY}" \
  --hostname="${TS_HOSTNAME}" \
  --advertise-routes="${TS_ROUTES}" \
  --accept-dns=false \
  --accept-routes \
  --socket=/var/run/tailscale/tailscaled.sock

echo "Tailscale connected. Subnet routes advertised: ${TS_ROUTES}"
echo "Approve routes in Tailscale Admin -> Machines -> ${TS_HOSTNAME}"

# Print status for deploy logs
tailscale status --socket=/var/run/tailscale/tailscaled.sock || true

# ---------------------------------------------------------------------------
# Keep the container alive by waiting on tailscaled
# If tailscaled exits, the container exits (Railway will restart per policy)
# ---------------------------------------------------------------------------
wait ${TAILSCALED_PID}
