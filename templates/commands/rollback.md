---
description: "Rollback to a prior checkpoint with preview first"
---

Restore the current branch or worktree to a prior checkpoint.

## Process

1. Resolve `$ARGUMENTS` to a checkpoint id, name, or `last`.
2. Show a preview of what will change before applying the rollback.
3. Create an automatic rescue checkpoint before modifying anything.
4. Apply the rollback in the requested mode:
   - `--soft` restores working state
   - `--hard` restores the exact snapshot
5. Report restored files, unresolved conflicts, and verification steps.

Never push, force-push, or delete history as part of this command.
