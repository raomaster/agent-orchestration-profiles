# Agent-Native Installation

This file is the authoritative install contract for coding agents.

Use the project README as the public bootstrap entrypoint:

```text
Install and configure agent-orchestration-profiles in this repository by following:
https://raw.githubusercontent.com/raomaster/agent-orchestration-profiles/main/README.md
```

## Required Agent Behavior

1. Detect the active client when possible.
2. If the request uses `--agent auto` and no clear marker exists, install integration files for all supported agents.
3. Resolve presets exactly like the CLI:
   - `lite` -> lightweight orchestration
   - `pro` -> recommended default
   - `full` -> adaptive alias
   - `full-opencode` -> OpenCode-focused full stack
   - `full-portable` -> portable full workflow stack
   - `hybrid` -> experimental OpenCode + portable workflow stack
4. Preserve existing user instructions using the managed block markers only.
5. Install the security companion stack when possible.
6. If the companion install fails, report the exact follow-up command instead of failing the orchestration install.

## Client Detection Heuristics

- `.opencode/` -> `opencode`
- `CLAUDE.md` -> `claude`
- `AGENTS.md` -> `codex`
- `.github/copilot-instructions.md` -> `copilot`
- `.claude/agents/` or `.claude/rules/` without stronger markers -> treat as `opencode`
- no marker -> `auto` resolves to all supported agents

## Preset Resolution Rules

- `full` + `opencode` -> `full-opencode`
- `full` + anything else -> `full-portable`
- `hybrid` on non-OpenCode agents falls back to `full-portable`

## Files to Install

### Always

- `templates/MULTI_AGENT_RULES.md` -> `MULTI_AGENT_RULES.md`
- `templates/topology/sdf_topology.yaml` -> `topology/sdf_topology.yaml`
- preset command files from `templates/commands/*.md` -> `commands/*.md`

### Agent integration files

- `codex` -> `AGENTS.md`
- `claude` -> `CLAUDE.md`
- `copilot` -> `.github/copilot-instructions.md`
- `opencode` -> `.claude/rules/multi-agent.md`

### OpenCode bundle for `full-opencode` and `hybrid`

- `templates/oh-my-opencode/command/*.md` -> `.opencode/command/*.md`
- `templates/oh-my-opencode/agents/sdf-command.md` -> `.claude/agents/sdf-command.md`
- `templates/oh-my-opencode/agents/valkyrie-scan.md` -> `.claude/agents/valkyrie-scan.md`
- `templates/oh-my-opencode/agents/valkyrie-forge.md` -> `.claude/agents/valkyrie-forge.md`
- `templates/oh-my-opencode/agents/valkyrie-check.md` -> `.claude/agents/valkyrie-check.md`
- `templates/oh-my-opencode/agents/barrier-review.md` -> `.claude/agents/barrier-review.md`
- `templates/oh-my-opencode/agents/archive-note.md` -> `.claude/agents/archive-note.md`

Also install the OpenCode bundle when an existing `oh-my-opencode` layout is detected.

## Security Companion Contract

`agent-security-policies` stays separate from this repository.

- `lite` -> prefer `lite`
- `pro` -> prefer `lite` on all supported agents
- `full-portable` -> prefer `standard --skills` where supported
- `full-opencode` and `hybrid` -> prefer the OpenCode-oriented companion command when available

If execution is blocked, tell the user the exact command to run next.

## One-Shot Prompt

```text
Install agent-orchestration-profiles from https://github.com/raomaster/agent-orchestration-profiles into this repository.

Requirements:
- detect the current client automatically
- install preset pro unless I specify another preset
- preserve existing user instructions using managed blocks only
- install the security companion stack when possible
- if no clear client marker exists, install integration files for codex, claude, copilot, and opencode
- show me which files were created or updated and any blockers
```

## Per-Agent Prompts

### Codex

```text
Install agent-orchestration-profiles from https://github.com/raomaster/agent-orchestration-profiles into this repository for Codex using preset pro. Update AGENTS.md with the managed orchestration block only, install the command pack, install the security companion when possible, and report the files changed.
```

### Claude Code

```text
Install agent-orchestration-profiles from https://github.com/raomaster/agent-orchestration-profiles into this repository for Claude Code using preset full-portable. Update CLAUDE.md with the managed orchestration block only, install the full portable command pack, install the security companion when possible, and report the files changed.
```

### GitHub Copilot

```text
Install agent-orchestration-profiles from https://github.com/raomaster/agent-orchestration-profiles into this repository for GitHub Copilot using preset lite. Update .github/copilot-instructions.md with the managed orchestration block only, install the lightweight command pack, install the security companion when possible, and report the files changed.
```

### OpenCode

```text
Install agent-orchestration-profiles from https://github.com/raomaster/agent-orchestration-profiles into this repository for OpenCode using preset full-opencode. Update .claude/rules/multi-agent.md with the managed orchestration block only, install the mirrored .opencode command pack and SDF subagent files, install the security companion when possible, and report the files changed.
```
