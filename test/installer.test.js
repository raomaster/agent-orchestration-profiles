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
  assert.ok(plan.commandFiles.includes("plan-change"));
  assert.equal(
    plan.ohMyOpenCodeCommandFiles.some(
      ({ relativePath }) => relativePath === ".opencode/command/plan-change.md"
    ),
    false
  );
});

test("claude rules marker enables oh-my-opencode detection", () => {
  const target = makeTempDir();
  fs.mkdirSync(path.join(target, ".claude", "rules"), { recursive: true });

  const plan = buildInstallPlan({
    target,
    agents: ["auto"],
    preset: "pro",
    workflow: "auto",
    withSecurity: "off",
  });

  assert.equal(plan.context.detectedAgent, "opencode");
  assert.equal(plan.context.isOhMyOpenCode, true);
  assert.equal(plan.needsOhMyOpenCodeBundle, true);
  assert.ok(
    plan.ohMyOpenCodeCommandFiles.some(
      ({ relativePath }) => relativePath === ".opencode/command/task-force.md"
    )
  );
  assert.ok(
    plan.ohMyOpenCodeAgentFiles.some(
      ({ relativePath }) => relativePath === ".claude/agents/archive-note.md"
    )
  );
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

test("full-opencode fails fast for non-OpenCode agents", () => {
  const target = makeTempDir();

  assert.throws(
    () =>
      buildInstallPlan({
        target,
        agents: ["claude"],
        preset: "full-opencode",
        workflow: "auto",
        withSecurity: "off",
      }),
    /--preset full-opencode requires --agent opencode/
  );
});

test("auto full-opencode fails when no OpenCode marker exists", () => {
  const target = makeTempDir();

  assert.throws(
    () =>
      buildInstallPlan({
        target,
        agents: ["auto"],
        preset: "full-opencode",
        workflow: "auto",
        withSecurity: "off",
      }),
    /--preset full-opencode requires --agent opencode/
  );
});

test("auto full-opencode succeeds when OpenCode marker exists", () => {
  const target = makeTempDir();
  fs.mkdirSync(path.join(target, ".opencode"), { recursive: true });

  const plan = buildInstallPlan({
    target,
    agents: ["auto"],
    preset: "full-opencode",
    workflow: "auto",
    withSecurity: "off",
  });

  assert.deepEqual(plan.resolvedAgents.agents, ["opencode"]);
  assert.equal(plan.agentPresets.opencode, "full-opencode");
});

test("installProject dry-run leaves the target directory untouched", () => {
  const root = makeTempDir();
  const target = path.join(root, "nested", "project");

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

  assert.equal(fs.existsSync(path.join(root, "nested")), false);
  assert.equal(fs.existsSync(target), false);
  assert.equal(fs.existsSync(path.join(target, "CLAUDE.md")), false);
  assert.equal(fs.existsSync(path.join(target, "commands", "task-force.md")), false);
});
