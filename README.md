# agent-orchestration-profiles

Portable multi-agent orchestration profiles for coding agents.

This project is intentionally separate from `agent-security-policies`.

- `agent-security-policies` defines safety, security, and review constraints.
- `agent-orchestration-profiles` defines coordination, delegation, ownership, and synchronization.

Use both together when you want secure multi-agent execution.

## Just Skip Reading This Readme

### Alternative: Let an LLM Agent do it

Paste this into a fresh agent session:

```text
Install and configure by following the instructions here https://raw.githubusercontent.com/raomaster/agent-orchestration-profiles/main/README.md
```

### For LLM Agents

If you are an LLM agent helping a user install this project, your job is to install the right stack for the current client, not just copy orchestration files blindly.

#### Step 1: Detect the current client

Choose the best match from the current environment:

- `Codex`
- `Claude Code`
- `GitHub Copilot`
- `OpenCode`

Look for project markers when useful:

- `AGENTS.md` suggests Codex
- `CLAUDE.md` suggests Claude Code
- `.github/copilot-instructions.md` suggests GitHub Copilot
- `.opencode/`, `.claude/rules/`, or `.claude/agents/` suggests OpenCode or `oh-my-opencode`

#### Step 2: Install the orchestration bundle

Copy these files from this repository into the target project:

- `templates/MULTI_AGENT_RULES.md` -> `MULTI_AGENT_RULES.md`
- `templates/topology/sdf_topology.yaml` -> `topology/sdf_topology.yaml`
- `templates/commands/task-force.md` -> `commands/task-force.md`

Then install the client-specific integration file:

- Codex -> `AGENTS.md`
- Claude Code -> `CLAUDE.md`
- GitHub Copilot -> `.github/copilot-instructions.md`
- OpenCode -> `.claude/rules/multi-agent.md`

Preserve existing user content. Only append or refresh the managed orchestration block.

#### Step 3: Install the security companion stack

Install `agent-security-policies` with the right default:

- Codex -> `lite`
- GitHub Copilot -> `lite`
- Claude Code -> `full`
- OpenCode -> `full`

If the project uses `oh-my-opencode`, install the OpenCode security stack with:

```bash
npx agent-security-policies --agent opencode --skills --omo
```

Otherwise use the agent-specific profile:

```bash
npx agent-security-policies --agent <agent> --profile <lite|full>
```

If command execution is blocked, tell the user the exact command and explain why.

#### Step 4: Install `oh-my-opencode` extras when detected

If the project looks like `oh-my-opencode`, also install:

- `.opencode/command/task-force.md`
- `.claude/agents/sdf-command.md`
- `.claude/agents/valkyrie-scan.md`
- `.claude/agents/valkyrie-forge.md`
- `.claude/agents/valkyrie-check.md`
- `.claude/agents/barrier-review.md`

#### Step 5: Final report

Tell the user:

- which client you detected
- which files were created or updated
- whether `agent-security-policies` was installed or only recommended
- whether `oh-my-opencode` extras were installed
- any blockers

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

## Installation

### For Humans

#### npx

```bash
npx agent-orchestration-profiles --all
npx agent-orchestration-profiles --agent codex --with-security auto
npx agent-orchestration-profiles --agent claude --with-security full
npx agent-orchestration-profiles --agent codex,claude
npx agent-orchestration-profiles --agent opencode --target /path/to/project
npx agent-orchestration-profiles --list
```

#### Local clone

```bash
git clone https://github.com/raomaster/agent-orchestration-profiles.git
cd agent-orchestration-profiles
./install.sh --all --target /path/to/project
```

#### Windows PowerShell

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

### For LLM Agents

Use the remote bootstrap prompt in [prompts/bootstrap.txt](prompts/bootstrap.txt) or send the agent directly to this README.

Supporting docs:

- [AGENT_INSTALL.md](AGENT_INSTALL.md)
- [prompts/bootstrap.txt](prompts/bootstrap.txt)

## Stack-aware install

This project can act as a stack installer, not just an orchestration installer.

When `--with-security` is enabled, it also tries to install `agent-security-policies` with an agent-appropriate profile:

- `codex` -> `lite` by default
- `copilot` -> `lite` by default
- `claude` -> `full` by default
- `opencode` -> `full` by default
- `opencode` with `oh-my-opencode` detected -> `--agent opencode --skills --omo`

Examples:

```bash
# Codex stack: orchestration + security lite
npx agent-orchestration-profiles --agent codex --with-security auto

# Claude stack: orchestration + security full
npx agent-orchestration-profiles --agent claude --with-security auto

# OpenCode + oh-my-opencode stack
npx agent-orchestration-profiles --agent opencode --with-security auto
```

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
