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
