---
description: "Create an isolated worktree for medium or risky tasks"
---

Create an isolated worktree before executing a medium, large, or sensitive task.

## Process

1. Pick the smallest safe branch name for the requested work.
2. Prefer an existing `.worktrees/` directory when present.
3. If using a project-local worktree directory, verify it is ignored by git first.
4. Create the worktree and branch.
5. Run the minimum project bootstrap needed to establish a clean baseline.
6. Run a verification command or explain why it was skipped.
7. Report the new worktree path and branch name.
