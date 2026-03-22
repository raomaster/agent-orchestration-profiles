---
description: "Execute an approved plan with conservative subagent delegation"
---

Execute the current plan using the SDF topology.

## Process

1. Load the latest plan, topology, and security rules.
2. Create a checkpoint before high-entropy steps.
3. Delegate only bounded tasks with explicit ownership.
4. Keep `SDF-Command` on the critical path.
5. Use `Valkyrie-Check` and `Barrier-Review` before declaring the plan complete.
6. End with `/handoff` or `/finish-branch` when appropriate.
