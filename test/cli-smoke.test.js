import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "aop-cli-"));
}

test("CLI smoke install for codex pro without security", () => {
  const target = makeTempDir();
  const result = spawnSync(
    process.execPath,
    [
      "bin/agent-orchestration-profiles.js",
      "install",
      "--agent",
      "codex",
      "--preset",
      "pro",
      "--with-security",
      "off",
      "--target",
      target,
    ],
    {
      cwd: path.join(process.cwd()),
      encoding: "utf8",
    }
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Installed agent-orchestration-profiles/);
  assert.ok(fs.existsSync(path.join(target, "AGENTS.md")));
  assert.ok(fs.existsSync(path.join(target, "commands", "rollback.md")));
});

test("CLI dry-run for adaptive full shows resolved presets", () => {
  const root = makeTempDir();
  const target = path.join(root, "nested", "project");
  const result = spawnSync(
    process.execPath,
    [
      "bin/agent-orchestration-profiles.js",
      "install",
      "--agent",
      "auto",
      "--preset",
      "full",
      "--with-security",
      "off",
      "--dry-run",
      "--target",
      target,
    ],
    {
      cwd: path.join(process.cwd()),
      encoding: "utf8",
    }
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Planned install of agent-orchestration-profiles/);
  assert.match(result.stdout, /resolved presets: codex -> full-portable/);
  assert.match(result.stdout, /would create: AGENTS.md/);
  assert.equal(fs.existsSync(target), false);
});

test("CLI rejects full-opencode for non-OpenCode agents", () => {
  const target = makeTempDir();
  const result = spawnSync(
    process.execPath,
    [
      "bin/agent-orchestration-profiles.js",
      "install",
      "--agent",
      "claude",
      "--preset",
      "full-opencode",
      "--with-security",
      "off",
      "--target",
      target,
    ],
    {
      cwd: path.join(process.cwd()),
      encoding: "utf8",
    }
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--preset full-opencode requires --agent opencode/);
  assert.equal(fs.existsSync(path.join(target, "AGENTS.md")), false);
});
