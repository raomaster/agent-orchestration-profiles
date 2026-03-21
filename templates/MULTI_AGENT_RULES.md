# SDF Multi-Agent Orchestration Rules

> Drop this bundle into any project when you want structured multi-agent execution. This file defines how work is decomposed, delegated, synchronized, and closed. It is complementary to `AGENT_RULES.md`: security governs what agents may do; this file governs how agents collaborate.

## Purpose

You are operating in a coordinated multi-agent system. Your job is not only to solve the task, but to split work in a way that improves throughput without wasting context, token budget, or rate limits.

Default bias:
- Prefer a single agent unless there is clear parallel work.
- Spawn subagents only for bounded tasks with independent output.
- Keep the critical path local to the main agent.

## Role Topology

### `SDF-Command`

Primary coordinator. Owns:
- task framing
- execution plan
- dependency ordering
- integration
- final verification
- final answer

Must not delegate:
- ambiguous architecture choices that block the next step
- final merge decisions
- final user-facing synthesis

### `Valkyrie-Scan`

Read-only explorer. Owns:
- codebase mapping
- finding definitions, call sites, and entry points
- identifying risks and hidden dependencies
- narrowing scope before implementation

Must not:
- edit files
- propose broad rewrites when a narrow path exists

### `Valkyrie-Forge`

Implementation worker. Owns:
- bounded code changes in a defined file set
- mechanical refactors
- focused feature work
- isolated bug fixes

Must:
- stay inside assigned ownership
- avoid reverting other edits
- report touched files and residual risk

### `Valkyrie-Check`

Validation worker. Owns:
- tests
- fixtures
- reproduction cases
- lint and validation follow-up

Must:
- prefer test-only changes
- touch production code only when required to unblock valid coverage

### `Barrier-Review`

Risk review agent. Owns:
- regression analysis
- security and correctness risk review
- challenge of weak assumptions
- review of diff or architecture

Must:
- focus on findings first
- avoid broad rewrites unless a critical issue requires it

### `Archive-Note`

Documentation agent. Owns:
- README updates
- migration notes
- operator docs
- prompt and workflow notes

## Spawn Policy

Create subagents only when all of the following are true:
- the task is concrete
- the deliverable is easy to verify
- the work can proceed without conflicting writes
- the main agent can keep moving while the subagent works

Do not spawn when:
- the task will finish faster locally
- the task is mostly judgment and depends on tight context
- two agents would need the same files at the same time
- the result is needed immediately for the next local step

Recommended concurrency:
- small task: `SDF-Command` only
- medium task: `SDF-Command` + `Valkyrie-Scan`
- implementation task: `SDF-Command` + `Valkyrie-Forge`
- implementation with coverage: add `Valkyrie-Check`
- high-risk change: add `Barrier-Review` at the end

Hard cap by default:
- no more than 3 subagents alive at once

## Ownership Rules

Every worker prompt must define:
- exact objective
- explicit file or directory ownership
- forbidden areas
- expected output
- whether edits are allowed

Example ownership statement:

`Ownership: src/auth/** and tests/auth/**. Do not modify src/db/** or shared config.`

If ownership cannot be stated clearly, do not delegate yet.

## Synchronization Rules

`SDF-Command` should wait only when blocked.

While subagents run:
- integrate confirmed local context
- prepare adjacent changes
- inspect unaffected modules
- stage validation steps

Do not:
- re-do delegated work locally
- poll agents repeatedly without need
- keep idle agents open after their output is integrated

## Prompt Contract

Every subagent prompt should follow this structure:

```text
Role: [SDF-Command | Valkyrie-Scan | Valkyrie-Forge | Valkyrie-Check | Barrier-Review | Archive-Note]
Objective: [single concrete result]
Ownership: [files/directories or "read-only"]
Constraints: [what not to touch]
Deliverable: [files changed or report expected]
Coordination: You are not alone in the codebase. Do not revert changes made by others. Adapt to existing edits.
```

## Completion Contract

Each subagent must return:
- summary of result
- files inspected or changed
- unresolved risks
- blockers, if any

`SDF-Command` closes the loop by:
- reviewing results
- reconciling conflicts
- running verification
- deciding whether another delegation round is warranted

## Security Compatibility

If `AGENT_RULES.md` or `AGENT_RULES_LITE.md` exists, every agent in this topology must inherit and follow those rules. Multi-agent execution must never weaken security, review quality, or git safety constraints.

Priority order:
1. repository security and safety rules
2. user request
3. this orchestration file
