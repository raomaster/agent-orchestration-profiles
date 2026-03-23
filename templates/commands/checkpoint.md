---
description: "Create a local recovery point before risky work"
---

Create a named local checkpoint for the current branch or worktree before making risky changes.

## Process

1. Read `MULTI_AGENT_RULES.md` and any installed security rules.
2. Summarize what is about to change and why the checkpoint is needed.
3. Record the current branch, `HEAD`, staged diff, unstaged diff, and untracked files.
4. Save the snapshot in a local recovery mechanism that never pushes remote state automatically.
5. Return the checkpoint name, timestamp, and what it protects.

Use this before refactors, dependency upgrades, auth changes, migrations, generated code, or broad edits.
