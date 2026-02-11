#!/usr/bin/env bash
# ------------------------------------------------------------------
# update-tool-names.sh — Task 5.1.1
#
# Replaces the placeholder tool-name prefix in all SKILL.md files
# with the confirmed format discovered in Task 1.3.1.
#
# Usage:
#   ./scripts/update-tool-names.sh <NEW_PREFIX>
#
# Example (once you know the format from the echo_test tool):
#   # If OpenClaw names it "sitecore-mcp__echo_test":
#   ./scripts/update-tool-names.sh "sitecore-mcp__"
#
#   # If OpenClaw names it "sitecore_mcp.echo_test":
#   ./scripts/update-tool-names.sh "sitecore_mcp."
#
#   # If OpenClaw passes through raw names (no prefix):
#   ./scripts/update-tool-names.sh ""
#
# Current format in all 15 SKILL.md files:
#   mcp__marketer-mcp__<tool_name>
#
# This script does a dry-run first, then asks for confirmation.
# ------------------------------------------------------------------

set -euo pipefail

SKILLS_DIR="$(cd "$(dirname "$0")/../workspace/skills" && pwd)"
OLD_PREFIX="mcp__marketer-mcp__"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <NEW_PREFIX>"
  echo ""
  echo "Examples:"
  echo "  $0 'sitecore-mcp__'     # if tools are prefixed with plugin id"
  echo "  $0 'sitecore_mcp.'      # if tools use dot separator"
  echo "  $0 ''                   # if tools have no prefix (raw names)"
  echo ""
  echo "Current prefix in SKILL.md files: ${OLD_PREFIX}"
  exit 1
fi

NEW_PREFIX="$1"

if [[ "$OLD_PREFIX" == "$NEW_PREFIX" ]]; then
  echo "New prefix is the same as old prefix (${OLD_PREFIX}). Nothing to do."
  exit 0
fi

# Count matches
MATCH_COUNT=$(grep -r --include="SKILL.md" -c "${OLD_PREFIX}" "$SKILLS_DIR" 2>/dev/null | awk -F: '{sum+=$2} END {print sum+0}')

if [[ "$MATCH_COUNT" -eq 0 ]]; then
  echo "No occurrences of '${OLD_PREFIX}' found in SKILL.md files."
  echo "Tool names may have already been updated."
  exit 0
fi

echo "=== Dry Run ==="
echo "Directory: ${SKILLS_DIR}"
echo "Old prefix: '${OLD_PREFIX}'"
echo "New prefix: '${NEW_PREFIX}'"
echo "Matches:    ${MATCH_COUNT} occurrences across SKILL.md files"
echo ""

# Show preview of changes (first 20 lines)
echo "--- Preview (first 20 changes) ---"
grep -r --include="SKILL.md" -n "${OLD_PREFIX}" "$SKILLS_DIR" 2>/dev/null | head -20 | while IFS= read -r line; do
  file=$(echo "$line" | cut -d: -f1)
  linenum=$(echo "$line" | cut -d: -f2)
  content=$(echo "$line" | cut -d: -f3-)
  short_file=$(basename "$(dirname "$file")")/$(basename "$file")
  new_content="${content//$OLD_PREFIX/$NEW_PREFIX}"
  echo "  ${short_file}:${linenum}"
  echo "    - ${content}"
  echo "    + ${new_content}"
done
echo ""

# Confirm
read -rp "Apply ${MATCH_COUNT} replacements? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 1
fi

# Execute replacement
if [[ "$(uname)" == "Darwin" ]]; then
  # macOS sed requires '' after -i
  find "$SKILLS_DIR" -name "SKILL.md" -exec sed -i '' "s|${OLD_PREFIX}|${NEW_PREFIX}|g" {} +
else
  find "$SKILLS_DIR" -name "SKILL.md" -exec sed -i "s|${OLD_PREFIX}|${NEW_PREFIX}|g" {} +
fi

# Verify
REMAINING=$(grep -r --include="SKILL.md" -c "${OLD_PREFIX}" "$SKILLS_DIR" 2>/dev/null | awk -F: '{sum+=$2} END {print sum+0}')

echo ""
echo "=== Done ==="
echo "Replaced: ${MATCH_COUNT} occurrences"
echo "Remaining: ${REMAINING} (should be 0)"

if [[ "$REMAINING" -gt 0 ]]; then
  echo "WARNING: Some occurrences were not replaced. Check manually."
  exit 1
fi

echo ""
echo "Next steps:"
echo "  1. git diff workspace/skills/ — review changes"
echo "  2. git add workspace/skills/ && git commit"
echo "  3. git push — Railway auto-deploys"
