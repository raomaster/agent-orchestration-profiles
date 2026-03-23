# Presets

## `lite`

Use when token cost matters more than workflow depth.

- installs the base SDF bundle
- installs `task-force` and `verify-change`
- keeps security lightweight
- avoids the OpenCode mirrored command bundle

## `pro`

Recommended default for daily work.

- installs the base SDF bundle
- installs recovery, worktree, verification, threat-model, and handoff commands
- keeps subagent use conservative
- stays compatible with any supported agent

## `full`

Adaptive alias.

- `OpenCode` -> `full-opencode`
- `Codex`, `Claude Code`, `GitHub Copilot` -> `full-portable`

## `full-opencode`

Complete OpenCode stack.

- everything in `pro`
- mirrored command pack in `.opencode/command/`
- SDF subagent catalog in `.claude/agents/`
- OpenCode-focused security follow-up path
- requires `--agent opencode`

## `full-portable`

Complete portable workflow.

- everything in `pro`
- adds `plan-change`, `execute-plan`, and `finish-branch`
- intended for Codex, Claude Code, and GitHub Copilot

## `hybrid`

Experimental OpenCode stack.

- combines `full-opencode` and `full-portable`
- higher context and workflow overhead than `pro`
- use only when you explicitly want the extra workflow surface area
