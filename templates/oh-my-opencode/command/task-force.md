---
description: "Create an SDF multi-agent task force with explicit ownership and conservative delegation"
---

Run the multi-agent orchestration flow for the current request.

1. Read `MULTI_AGENT_RULES.md`
2. Read `topology/sdf_topology.yaml`
3. If present, also read `AGENT_RULES.md` or `AGENT_RULES_LITE.md`
4. Select the smallest valid topology profile
5. Create only the roles needed for the task
6. Define explicit ownership before delegating
7. Keep the critical path in `SDF-Command`
8. Wait only when blocked
9. Close agents when their output is integrated

If `agent-security-policies` is installed, treat its rules and security agents as mandatory constraints for the whole task force.
