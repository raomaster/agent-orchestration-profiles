---
description: "Restore one file or directory from a checkpoint"
---

Restore only the requested file or directory from a named checkpoint.

## Process

1. Resolve the path and checkpoint from `$ARGUMENTS`.
2. Confirm the requested scope is narrower than a full rollback.
3. Preview the file-level diff if possible.
4. Restore only the requested path.
5. Report what changed and whether follow-up verification is required.
