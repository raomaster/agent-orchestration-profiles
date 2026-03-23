---
description: "Close out worktree-based development safely"
---

Finish work performed in an isolated worktree.

## Process

1. Verify tests or other required validation have passed.
2. Summarize the branch status and outstanding risks.
3. Offer the next safe step: merge locally, create a PR, keep the branch, or discard it.
4. Require explicit confirmation before destructive cleanup.
5. Remove the worktree only when the chosen flow makes cleanup safe.
