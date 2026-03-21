---
description: "Create a bounded multi-agent task force using the SDF topology"
---

Create and operate a multi-agent task force for the current request using `MULTI_AGENT_RULES.md` and `topology/sdf_topology.yaml`.

$ARGUMENTS should be a short goal and optional scope, for example:
- `audio pipeline refactor`
- `add tests for session expiration in src/auth`
- `full review of recent diff`

## Process

### 1. Load Orchestration Context

- Read `MULTI_AGENT_RULES.md`
- Read `topology/sdf_topology.yaml`
- If present, also read `AGENT_RULES.md` or `AGENT_RULES_LITE.md`

### 2. Classify the Task

Choose one profile:
- `small`
- `discovery`
- `feature`
- `feature_with_validation`
- `sensitive_change`

Pick the smallest profile that fits the work.

### 3. Assign Roles

Always create `SDF-Command`.

Only add extra roles if their work is independent:
- `Valkyrie-Scan` for read-only discovery
- `Valkyrie-Forge` for scoped implementation
- `Valkyrie-Check` for tests and verification
- `Barrier-Review` for risk review
- `Archive-Note` for docs

### 4. Write Ownership Before Delegating

For each subagent, define:
- objective
- explicit file or directory ownership
- forbidden areas
- deliverable

If ownership is unclear, do not spawn that subagent.

### 5. Run Conservatively

- Keep the critical path in `SDF-Command`
- Do not exceed 3 live subagents by default
- Wait only when blocked
- Close agents when their output is integrated

### 6. Final Output

Report:
- profile used
- roles activated
- ownership assigned
- work completed
- unresolved risks
