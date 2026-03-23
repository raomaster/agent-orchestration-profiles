import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { appendManagedBlock, writeFileIfChanged } from "../src/fs-utils.js";

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "aop-fs-"));
}

test("appendManagedBlock preserves user content outside managed region", () => {
  const target = makeTempDir();
  const filePath = path.join(target, "AGENTS.md");

  fs.writeFileSync(
    filePath,
    [
      "# Project Instructions",
      "",
      "Keep this custom guidance.",
      "",
      "<!-- agent-orchestration-profiles -->",
      "Old block",
      "<!-- /agent-orchestration-profiles -->",
      "",
      "Do not remove this footer.",
      "",
    ].join("\n"),
    "utf8"
  );

  const status = appendManagedBlock(filePath, "New block");
  const next = fs.readFileSync(filePath, "utf8");

  assert.equal(status, "updated");
  assert.match(next, /Keep this custom guidance\./);
  assert.match(next, /New block/);
  assert.match(next, /Do not remove this footer\./);
  assert.doesNotMatch(next, /Old block/);
});

test("appendManagedBlock dry-run does not create parent directories", () => {
  const target = makeTempDir();
  const filePath = path.join(target, "nested", "AGENTS.md");

  const status = appendManagedBlock(filePath, "New block", { dryRun: true });

  assert.equal(status, "created");
  assert.equal(fs.existsSync(path.join(target, "nested")), false);
  assert.equal(fs.existsSync(filePath), false);
});

test("writeFileIfChanged dry-run does not create parent directories", () => {
  const target = makeTempDir();
  const filePath = path.join(target, "commands", "task-force.md");

  const status = writeFileIfChanged(filePath, "content\n", { dryRun: true });

  assert.equal(status, "created");
  assert.equal(fs.existsSync(path.join(target, "commands")), false);
  assert.equal(fs.existsSync(filePath), false);
});
