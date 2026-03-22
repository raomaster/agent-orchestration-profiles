import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { buildInstallPlan, installProject } from "../src/installer.js";

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "aop-test-"));
}

test("auto agent falls back to all supported agents when no markers exist", () => {
  const target = makeTempDir();
  const plan = buildInstallPlan({
    target,
    agents: ["auto"],
    preset: "full",
    workflow: "auto",
    withSecurity: "off",
  });

  assert.deepEqual(plan.resolvedAgents.agents, ["codex", "claude", "copilot", "opencode"]);
  assert.equal(plan.agentPresets.opencode, "full-opencode");
  assert.equal(plan.agentPresets.claude, "full-portable");
  assert.equal(plan.needsOhMyOpenCodeBundle, true);
});

test("installProject writes pro files and preserves managed block behavior", () => {
  const target = makeTempDir();
  const args = {
    target,
    agents: ["codex"],
    preset: "pro",
    workflow: "auto",
    withSecurity: "off",
    dryRun: false,
    explain: false,
  };

  const first = installProject(args, {
    executeSecurityPlan: () => ({ status: "skipped", detail: "not used" }),
  });
  const second = installProject(args, {
    executeSecurityPlan: () => ({ status: "skipped", detail: "not used" }),
  });

  assert.ok(fs.existsSync(path.join(target, "MULTI_AGENT_RULES.md")));
  assert.ok(fs.existsSync(path.join(target, "commands", "checkpoint.md")));
  assert.ok(fs.existsSync(path.join(target, "AGENTS.md")));
  assert.equal(first.results.find(([file]) => file === "AGENTS.md")[1], "created");
  assert.equal(second.results.find(([file]) => file === "AGENTS.md")[1], "unchanged");
});

test("installProject writes the OpenCode mirrored bundle for full-opencode", () => {
  const target = makeTempDir();
  const outcome = installProject(
    {
      target,
      agents: ["opencode"],
      preset: "full-opencode",
      workflow: "auto",
      withSecurity: "off",
      dryRun: false,
      explain: false,
    },
    {
      executeSecurityPlan: () => ({ status: "skipped", detail: "not used" }),
    }
  );

  assert.ok(fs.existsSync(path.join(target, ".opencode", "command", "task-force.md")));
  assert.ok(fs.existsSync(path.join(target, ".claude", "agents", "archive-note.md")));
  assert.ok(
    outcome.results.some(([file]) => file === ".opencode/command/verify-change.md")
  );
});

test("installProject dry-run leaves the target directory untouched", () => {
  const target = makeTempDir();
  installProject(
    {
      target,
      agents: ["claude"],
      preset: "pro",
      workflow: "auto",
      withSecurity: "off",
      dryRun: true,
      explain: false,
    },
    {
      executeSecurityPlan: () => ({ status: "planned", detail: "skipped" }),
    }
  );

  assert.equal(fs.existsSync(path.join(target, "CLAUDE.md")), false);
  assert.equal(fs.existsSync(path.join(target, "commands", "task-force.md")), false);
});
