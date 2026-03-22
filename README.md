# agent-orchestration-profiles

Preset-driven secure multi-agent orchestration for coding agents.

This repository is the stack installer and workflow layer.

- `agent-orchestration-profiles` defines topology, delegation, ownership, recovery commands, and install presets.
- `agent-security-policies` remains the security companion and source of truth for security rules, profiles, and skills.

Use both together when you want a professional AI-assisted SSDLC without turning every project into a heavyweight harness.

## Install Through an Agent

Paste this into a fresh agent session:

```text
Install and configure agent-orchestration-profiles in this repository by following:
https://raw.githubusercontent.com/raomaster/agent-orchestration-profiles/main/README.md

Requirements:
- detect the current client automatically
- use preset pro unless I specify another preset
- preserve existing user instructions with managed blocks only
- install the security companion stack when possible
- report created or updated files and any blockers
```

## Quick Install

### Daily default

```bash
npx agent-orchestration-profiles install --agent auto --preset pro
```

### Low-cost setup

```bash
npx agent-orchestration-profiles install --agent auto --preset lite
```

### Full adaptive setup

```bash
npx agent-orchestration-profiles install --agent auto --preset full
```

### Explicit presets

```bash
npx agent-orchestration-profiles install --agent opencode --preset full-opencode
npx agent-orchestration-profiles install --agent claude --preset full-portable
npx agent-orchestration-profiles install --agent opencode --preset hybrid
```

### Planning only

```bash
npx agent-orchestration-profiles install --agent auto --preset pro --dry-run --explain
```

If you want the branch tip before the npm release lands, use:

```bash
npx --yes github:raomaster/agent-orchestration-profiles install --agent auto --preset pro
```

## Presets

| Preset | Purpose | Security default | Workflow shape |
| --- | --- | --- | --- |
| `lite` | Cheap starter for daily edits | `lite` where available | `task-force` + `verify-change` |
| `pro` | Recommended default | `lite` on all supported agents | planning, recovery, worktrees, verification, handoff |
| `full` | Adaptive alias | follows resolved target preset | `full-opencode` on OpenCode, `full-portable` elsewhere |
| `full-opencode` | Complete OpenCode stack | OpenCode-focused companion path | `pro` command pack mirrored into `.opencode/command/` plus SDF subagents |
| `full-portable` | Complete portable workflow | `standard` + skills where supported | `pro` plus planning and branch-finishing commands |
| `hybrid` | Experimental OpenCode + portable workflow | OpenCode-focused companion path | `full-opencode` plus portable planning and finish commands |

`full` is always adaptive:

- `OpenCode` -> `full-opencode`
- `Codex`, `Claude Code`, `GitHub Copilot` -> `full-portable`

When `--agent auto` cannot detect a clear client, the installer writes integration files for all supported agents.

## Supported Agents

- Codex
- Claude Code
- GitHub Copilot
- OpenCode

## What Gets Installed

### Shared bundle

- `MULTI_AGENT_RULES.md`
- `topology/sdf_topology.yaml`
- `commands/*.md` according to the selected preset

### Agent integration files

- Codex -> `AGENTS.md`
- Claude Code -> `CLAUDE.md`
- GitHub Copilot -> `.github/copilot-instructions.md`
- OpenCode -> `.claude/rules/multi-agent.md`

### OpenCode bundle for `full-opencode` and `hybrid`

- `.opencode/command/*.md` mirrored from the active command pack
- `.claude/agents/sdf-command.md`
- `.claude/agents/valkyrie-scan.md`
- `.claude/agents/valkyrie-forge.md`
- `.claude/agents/valkyrie-check.md`
- `.claude/agents/barrier-review.md`
- `.claude/agents/archive-note.md`

The installer also adds the OpenCode bundle when it detects an existing `oh-my-opencode` layout.

## Command Packs

### `lite`

- `task-force`
- `verify-change`

### `pro`

- `task-force`
- `checkpoint`
- `checkpoint-list`
- `rollback`
- `rollback-file`
- `worktree-start`
- `worktree-finish`
- `verify-change`
- `threat-model`
- `handoff`

### `full-portable`

Everything in `pro`, plus:

- `plan-change`
- `execute-plan`
- `finish-branch`

### `full-opencode`

Everything in `pro`, mirrored into `.opencode/command/` and paired with the SDF agent catalog.

### `hybrid`

Everything in `full-portable`, plus the `full-opencode` mirrored command and agent bundle.

See `docs/commands.md` for details.

## Security Companion Behavior

This project does not replace `agent-security-policies`.

- `lite` prefers `agent-security-policies` lite where available.
- `pro` installs `agent-security-policies` in `lite` mode on all supported agents.
- `full-portable` prefers `standard` + `--skills` where supported.
- `full-opencode` and `hybrid` use the OpenCode-oriented companion path when available and otherwise print the exact recommended follow-up command.

If the companion install cannot run, the installer falls back to a recommendation instead of failing the orchestration install.

See `docs/integrations.md` for the current contract and limitations.

## Copy-Paste Prompts for Agents

### Generic `pro`

```text
Install and configure agent-orchestration-profiles in this repository by following:
https://raw.githubusercontent.com/raomaster/agent-orchestration-profiles/main/README.md

Requirements:
- detect the current client automatically
- install preset pro
- preserve existing user instructions using managed blocks only
- install the security companion stack when possible
- report created or updated files and blockers
```

### OpenCode `full-opencode`

```text
Install and configure agent-orchestration-profiles in this repository by following:
https://raw.githubusercontent.com/raomaster/agent-orchestration-profiles/main/README.md

Target client: OpenCode
Preset: full-opencode
Requirements:
- install the SDF orchestration bundle
- install the mirrored .opencode command pack
- install the SDF subagent catalog
- preserve existing user instructions using managed blocks only
- install the security companion stack when possible
- report created or updated files and blockers
```

### Claude Code `full-portable`

```text
Install and configure agent-orchestration-profiles in this repository by following:
https://raw.githubusercontent.com/raomaster/agent-orchestration-profiles/main/README.md

Target client: Claude Code
Preset: full-portable
Requirements:
- install the portable full workflow stack
- preserve existing user instructions using managed blocks only
- install the security companion stack when possible
- report created or updated files and blockers
```

### Codex `lite`

```text
Install and configure agent-orchestration-profiles in this repository by following:
https://raw.githubusercontent.com/raomaster/agent-orchestration-profiles/main/README.md

Target client: Codex
Preset: lite
Requirements:
- keep the setup lightweight
- preserve existing user instructions using managed blocks only
- install the security companion stack when possible
- report created or updated files and blockers
```

## Design Rules

- Conservative spawning by default
- Explicit ownership before delegation
- `SDF-Command` keeps the critical path
- `Valkyrie-Scan`, `Valkyrie-Forge`, `Valkyrie-Check`, `Barrier-Review`, and `Archive-Note` stay role-pure
- Recovery commands are built into `pro` and above
- Managed block updates never replace user-authored instructions outside the managed section
- Security is inherited from `AGENT_RULES.md` or `AGENT_RULES_LITE.md` whenever present

## Project Layout

```text
.
├── bin/agent-orchestration-profiles.js
├── docs/
├── prompts/
├── src/
├── templates/
│   ├── MULTI_AGENT_RULES.md
│   ├── commands/*.md
│   ├── oh-my-opencode/agents/*.md
│   ├── oh-my-opencode/command/*.md
│   └── topology/sdf_topology.yaml
├── AGENT_INSTALL.md
├── CHANGELOG.md
├── install.ps1
├── install.sh
└── README.md
```

## Documentation

- `AGENT_INSTALL.md` - agent-native installation contract
- `docs/presets.md` - exact preset semantics
- `docs/commands.md` - command pack reference
- `docs/integrations.md` - `agent-security-policies`, `oh-my-opencode`, and portable workflow notes
- `CHANGELOG.md` - release history

## Latest Changes

See `CHANGELOG.md` for the full release log. The current release introduces presets, recovery commands, an OpenCode bundle, and tests for the new installer core.
