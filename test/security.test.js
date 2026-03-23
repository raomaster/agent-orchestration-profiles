import test from "node:test";
import assert from "node:assert/strict";

import { resolveSecurityPlan } from "../src/security.js";

test("pro keeps Codex on security lite", () => {
  const plan = resolveSecurityPlan({
    agent: "codex",
    preset: "pro",
    override: "auto",
  });

  assert.equal(plan.mode, "command");
  assert.equal(plan.profile, "lite");
  assert.deepEqual(plan.args, ["agent-security-policies", "--agent", "codex", "--profile", "lite"]);
});

test("pro keeps OpenCode on security lite", () => {
  const plan = resolveSecurityPlan({
    agent: "opencode",
    preset: "pro",
    override: "auto",
  });

  assert.equal(plan.mode, "command");
  assert.equal(plan.profile, "lite");
  assert.deepEqual(plan.args, ["agent-security-policies", "--agent", "opencode", "--profile", "lite"]);
});

test("full-opencode recommends OpenCode companion path when enabled", () => {
  const plan = resolveSecurityPlan({
    agent: "opencode",
    preset: "full-opencode",
    override: "auto",
  });

  assert.equal(plan.mode, "command");
  assert.match(plan.args.join(" "), /agent-security-policies --agent opencode --skills --omo/);
});

test("full-opencode keeps OpenCode companion path for standard override", () => {
  const plan = resolveSecurityPlan({
    agent: "opencode",
    preset: "full-opencode",
    override: "standard",
  });

  assert.equal(plan.mode, "command");
  assert.match(plan.args.join(" "), /agent-security-policies --agent opencode --skills --omo/);
});

test("full-opencode keeps OpenCode companion path for full override", () => {
  const plan = resolveSecurityPlan({
    agent: "opencode",
    preset: "full-opencode",
    override: "full",
  });

  assert.equal(plan.mode, "command");
  assert.match(plan.args.join(" "), /agent-security-policies --agent opencode --skills --omo/);
});

test("security override off disables companion install", () => {
  const plan = resolveSecurityPlan({
    agent: "claude",
    preset: "full-portable",
    override: "off",
  });

  assert.equal(plan, null);
});
