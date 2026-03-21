# Agent-Native Installation

This project can be installed directly by a coding agent, without `npx` and without asking the user to run shell installers manually.

The agent should:

1. Fetch this repository or read its published files.
2. Copy the shared bundle into the target project:
   - `templates/MULTI_AGENT_RULES.md` -> `MULTI_AGENT_RULES.md`
   - `templates/topology/sdf_topology.yaml` -> `topology/sdf_topology.yaml`
   - `templates/commands/task-force.md` -> `commands/task-force.md`
3. Update the target agent files with the orchestration integration block:
   - Codex -> `AGENTS.md`
   - Claude Code -> `CLAUDE.md`
   - GitHub Copilot -> `.github/copilot-instructions.md`
   - OpenCode -> `.claude/rules/multi-agent.md`
4. Preserve existing user content and append or replace only the managed orchestration block.
5. If `AGENT_RULES.md` or `AGENT_RULES_LITE.md` exists, reference it as mandatory policy for all agents and subagents.

## One-shot bootstrap prompt

Use this in any coding agent with repository access:

```text
Install agent-orchestration-profiles from https://github.com/raomaster/agent-orchestration-profiles into this project.

Requirements:
- Copy the shared bundle from the repository templates into this repo:
  - templates/MULTI_AGENT_RULES.md -> MULTI_AGENT_RULES.md
  - templates/topology/sdf_topology.yaml -> topology/sdf_topology.yaml
  - templates/commands/task-force.md -> commands/task-force.md
- Add or update the integration file for these agents: codex, claude, copilot, opencode
- Preserve existing instructions; append or refresh only the orchestration block
- If AGENT_RULES.md or AGENT_RULES_LITE.md exists, reference it as mandatory policy inherited by all subagents
- Show me which files were created or updated
```

## Per-agent prompts

### Codex

```text
Install the multi-agent orchestration bundle from https://github.com/raomaster/agent-orchestration-profiles into this repo and update AGENTS.md to reference MULTI_AGENT_RULES.md. Preserve existing content and only add or refresh a managed orchestration block.
```

### Claude Code

```text
Install the multi-agent orchestration bundle from https://github.com/raomaster/agent-orchestration-profiles into this repo and update CLAUDE.md to reference MULTI_AGENT_RULES.md. Preserve existing content and only add or refresh a managed orchestration block.
```

### GitHub Copilot

```text
Install the multi-agent orchestration bundle from https://github.com/raomaster/agent-orchestration-profiles into this repo and update .github/copilot-instructions.md so Copilot follows MULTI_AGENT_RULES.md for delegation and orchestration.
```

### OpenCode

```text
Install the multi-agent orchestration bundle from https://github.com/raomaster/agent-orchestration-profiles into this repo and create or update .claude/rules/multi-agent.md with the orchestration rule block.
```
