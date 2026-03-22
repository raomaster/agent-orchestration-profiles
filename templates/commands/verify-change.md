---
description: "Run focused validation for the current change"
---

Verify the current change using the lightest command set that still proves correctness.

## Process

1. Read `MULTI_AGENT_RULES.md` and any installed security rules.
2. Inspect the touched files and infer the smallest useful validation plan.
3. Ask `Valkyrie-Check` to add or adjust tests when that work is bounded.
4. Run focused tests, lint, or repro steps.
5. If the change is sensitive, ask `Barrier-Review` for a final risk pass.
6. Report what passed, what failed, and what remains unverified.
