import test from "node:test";
import assert from "node:assert/strict";

import { parseArgs } from "../src/args.js";

test("parseArgs defaults to install auto pro", () => {
  const args = parseArgs([]);

  assert.equal(args.command, "install");
  assert.deepEqual(args.agents, ["auto"]);
  assert.equal(args.preset, "pro");
  assert.equal(args.workflow, "auto");
  assert.equal(args.withSecurity, "auto");
});

test("parseArgs accepts explicit preset workflow and dry-run", () => {
  const args = parseArgs([
    "install",
    "--agent",
    "opencode",
    "--preset",
    "full-opencode",
    "--workflow",
    "omo",
    "--dry-run",
    "--explain",
  ]);

  assert.deepEqual(args.agents, ["opencode"]);
  assert.equal(args.preset, "full-opencode");
  assert.equal(args.workflow, "omo");
  assert.equal(args.dryRun, true);
  assert.equal(args.explain, true);
});

test("parseArgs validates preset values", () => {
  assert.throws(() => parseArgs(["install", "--preset", "unknown"]), /--preset must/);
});

test("parseArgs rejects mixing auto with explicit agents", () => {
  assert.throws(
    () => parseArgs(["install", "--agent", "auto,codex"]),
    /--agent auto cannot be combined/
  );
});

test("parseArgs rejects an empty agent list", () => {
  assert.throws(
    () => parseArgs(["install", "--agent", ","]),
    /--agent requires at least one supported agent or auto/
  );
});

test("parseArgs validates the final agent selection after --all", () => {
  assert.throws(
    () => parseArgs(["install", "--all", "--agent", "bogus"]),
    /Unsupported agent\(s\): bogus/
  );
});
