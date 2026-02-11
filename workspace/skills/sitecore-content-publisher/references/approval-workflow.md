# Approval Workflow Reference

## Emoji Reaction Gate

The publish approval uses Slack emoji reactions as the gate mechanism.

### How It Works

1. Agent posts an approval request message in #ai-agent-workflows
2. Team member reviews the preview URL
3. Team member reacts to the message:
   - ✅ (`:white_check_mark:`) = Approve
   - ❌ (`:x:`) = Reject
4. Agent reads the reaction and acts accordingly

### Timeout Behavior

| Time | Action |
|---|---|
| 0 min | Approval request posted |
| 10 min | Reminder posted (if no reaction) |
| 30 min | Auto-cancel with message |

### Edge Cases

- **Multiple reactions**: First reaction wins. If both ✅ and ❌ are present, treat as ambiguous and ask for clarification.
- **Reaction by non-team-member**: OpenClaw reads `reactions:read` scope — it sees all reactions. The SOUL file restricts the channel to #ai-agent-workflows, so only invited channel members can react.
- **Reaction removed**: If the approval reaction is removed before the operation completes, cancel the operation.

## Open Question: Slack Reaction Listening

> Can OpenClaw natively wait for Slack reactions? This needs validation.
>
> If not, alternatives:
> 1. Poll for reactions on the message at intervals
> 2. Use Slack event subscription for `reaction_added` events
> 3. Fall back to text-based approval ("type APPROVE to confirm")
>
> Test this during skill deployment and update this reference with the confirmed approach.
