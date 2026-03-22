# Integrations

## `agent-security-policies`

This repository intentionally does not duplicate security policy content.

- `agent-security-policies` owns security rules, profiles, and skills
- `agent-orchestration-profiles` decides when to invoke that companion installer and how to inherit its rules inside the SDF workflow

Default mapping in this repository:

- `lite` -> `agent-security-policies --profile lite`
- `pro` -> `agent-security-policies --profile lite`
- `full-portable` -> `agent-security-policies --profile standard --skills`
- `full-opencode` and `hybrid` -> `agent-security-policies --agent opencode --skills --omo` for OpenCode

If the companion installer cannot run, the orchestration install still succeeds and prints the exact follow-up command or recommendation.

## `oh-my-opencode`

`full-opencode` and `hybrid` install the mirrored `.opencode/command/` bundle and the SDF agent catalog under `.claude/agents/`.

The same bundle is also installed automatically when an existing `oh-my-opencode` layout is detected.

## Portable workflow inspiration

`full-portable` and parts of `hybrid` are intentionally inspired by the best lightweight parts of professional multi-agent workflows:

- recovery points before risky work
- isolated worktrees when task size or risk justifies them
- decision-complete plans before complex implementation
- explicit verification and branch-finishing steps

The goal is to keep those ideas portable across Codex, Claude Code, GitHub Copilot, and OpenCode without requiring one specific external runtime as a hard dependency.
