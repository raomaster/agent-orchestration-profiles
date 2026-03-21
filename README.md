# agent-orchestration-profiles

Portable multi-agent orchestration profiles for coding agents.

This project is intentionally separate from `agent-security-policies`.

- `agent-security-policies` defines safety, security, and review constraints.
- `agent-orchestration-profiles` defines coordination, delegation, ownership, and synchronization.

Use both together when you want secure multi-agent execution.

## Why this exists

Most agent setups document safety rules, but leave collaboration vague. This project gives you a portable orchestration layer that answers:

- when to stay single-agent
- when to spawn subagents
- how to assign ownership
- how to avoid overlapping writes
- how to close and review a task force cleanly

## Supported agents

- Codex
- Claude Code
- GitHub Copilot
- OpenCode

## Install

### npx

```bash
npx agent-orchestration-profiles --all
npx agent-orchestration-profiles --agent codex,claude
npx agent-orchestration-profiles --agent opencode --target /path/to/project
npx agent-orchestration-profiles --list
```

### Local clone

```bash
git clone https://github.com/raomaster/agent-orchestration-profiles.git
cd agent-orchestration-profiles
./install.sh --all --target /path/to/project
```

### Windows PowerShell

```powershell
git clone https://github.com/raomaster/agent-orchestration-profiles.git
cd agent-orchestration-profiles
.\install.ps1 --all --target C:\path\to\project
```

## What gets installed

Shared bundle:

- `MULTI_AGENT_RULES.md`
- `topology/sdf_topology.yaml`
- `commands/task-force.md`

Agent-specific integration:

- Codex -> `AGENTS.md`
- Claude Code -> `CLAUDE.md`
- GitHub Copilot -> `.github/copilot-instructions.md`
- OpenCode -> `.claude/rules/multi-agent.md`

## Project layout

```text
.
├── bin/agent-orchestration-profiles.js
├── templates/
│   ├── MULTI_AGENT_RULES.md
│   ├── topology/sdf_topology.yaml
│   └── commands/task-force.md
├── install.sh
├── install.ps1
└── README.md
```

## Design rules

- Conservative spawning by default
- Explicit ownership before delegation
- Critical path stays in `SDF-Command`
- Compatibility with `AGENT_RULES.md` and `AGENT_RULES_LITE.md`
- Non-destructive updates using managed blocks where possible

## Example

```bash
npx agent-orchestration-profiles --agent codex,copilot --target .
```

This installs the shared orchestration bundle and updates:
- `AGENTS.md`
- `.github/copilot-instructions.md`

## Publish

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:raomaster/agent-orchestration-profiles.git
git push -u origin main
```

## Next steps

Recommended companion install:

```bash
npx agent-security-policies --all
```
