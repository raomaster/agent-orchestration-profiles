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

### Agent-native install

If your coding agent can read GitHub repos or fetch raw files, you can install this project by giving it a single bootstrap instruction instead of running `npx`.

Use the prompt in [AGENT_INSTALL.md](AGENT_INSTALL.md) or [prompts/bootstrap.txt](prompts/bootstrap.txt).

Short version:

```text
Install agent-orchestration-profiles from https://github.com/raomaster/agent-orchestration-profiles into this project.
Copy the shared bundle, update the integration files for codex/claude/copilot/opencode, preserve existing instructions, and make all subagents inherit AGENT_RULES.md when present.
```

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

When an `oh-my-opencode`-style layout is detected, the installer also adds:

- `.opencode/command/task-force.md`
- `.claude/agents/sdf-command.md`
- `.claude/agents/valkyrie-scan.md`
- `.claude/agents/valkyrie-forge.md`
- `.claude/agents/valkyrie-check.md`
- `.claude/agents/barrier-review.md`

## Agent-first workflow

This repository supports two installation styles:

- `agent-native`: you paste a bootstrap prompt into the coding agent and it performs the install itself
- `npx`: you run the installer directly

The preferred workflow for agent-centric environments is `agent-native`.

## oh-my-opencode compatibility

The installer auto-detects an `oh-my-opencode`-style project by checking for:

- `.opencode/`
- `.claude/agents/`
- `.claude/rules/`

When detected, it installs the OpenCode-specific command and subagent files in addition to the normal rule file.

If that layout is present, the installer also recommends:

```bash
npx agent-security-policies --agent opencode --skills --omo
```

That pairing is intentional:

- `agent-orchestration-profiles` handles delegation, topology, and ownership
- `agent-security-policies` handles security rules, scans, and security agents
- `oh-my-opencode` handles discovery of rules, commands, skills, and agents

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
