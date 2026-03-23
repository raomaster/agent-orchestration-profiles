# Commands

## Shared recovery and workflow commands

- `task-force` - select the smallest valid SDF topology and delegate conservatively
- `checkpoint` - create a local recovery point before risky work
- `checkpoint-list` - list available local recovery points
- `rollback` - restore a prior checkpoint with preview first
- `rollback-file` - restore a single file or directory from a checkpoint
- `worktree-start` - create an isolated worktree for medium or sensitive work
- `worktree-finish` - safely complete work done in a worktree
- `verify-change` - run the smallest valid verification plan
- `threat-model` - produce a lightweight STRIDE threat model
- `handoff` - summarize work for another agent session or human reviewer

## Full workflow commands

- `plan-change` - create a decision-complete plan before implementation
- `execute-plan` - run the approved plan with bounded delegation and validation
- `finish-branch` - safely close a development branch after verification

## Preset coverage

| Command | `lite` | `pro` | `full-portable` | `full-opencode` | `hybrid` |
| --- | --- | --- | --- | --- | --- |
| `task-force` | yes | yes | yes | yes | yes |
| `checkpoint*` | no | yes | yes | yes | yes |
| `rollback*` | no | yes | yes | yes | yes |
| `worktree-*` | no | yes | yes | yes | yes |
| `verify-change` | yes | yes | yes | yes | yes |
| `threat-model` | no | yes | yes | yes | yes |
| `handoff` | no | yes | yes | yes | yes |
| `plan-change` | no | no | yes | no | yes |
| `execute-plan` | no | no | yes | no | yes |
| `finish-branch` | no | no | yes | no | yes |
