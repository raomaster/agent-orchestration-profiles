import test from "node:test";
import assert from "node:assert/strict";

import { resolvePresetForAgent } from "../src/presets.js";

test("full resolves to full-opencode for OpenCode", () => {
  assert.equal(
    resolvePresetForAgent({ requestedPreset: "full", agent: "opencode", workflow: "auto" }),
    "full-opencode"
  );
});

test("full resolves to full-portable for Claude", () => {
  assert.equal(
    resolvePresetForAgent({ requestedPreset: "full", agent: "claude", workflow: "auto" }),
    "full-portable"
  );
});

test("hybrid falls back to full-portable outside OpenCode", () => {
  assert.equal(
    resolvePresetForAgent({ requestedPreset: "hybrid", agent: "codex", workflow: "auto" }),
    "full-portable"
  );
});

test("full-opencode requires OpenCode", () => {
  assert.throws(
    () =>
      resolvePresetForAgent({
        requestedPreset: "full-opencode",
        agent: "claude",
        workflow: "auto",
      }),
    /--preset full-opencode requires --agent opencode/
  );
});
