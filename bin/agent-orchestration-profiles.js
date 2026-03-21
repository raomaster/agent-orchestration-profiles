#!/usr/bin/env node

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const PACKAGE_NAME = "agent-orchestration-profiles";
const SUPPORTED_AGENTS = ["codex", "claude", "copilot", "opencode"];
const MARKER_START = "<!-- agent-orchestration-profiles -->";
const MARKER_END = "<!-- /agent-orchestration-profiles -->";
const OMO_AGENT_FILES = [
  "sdf-command.md",
  "valkyrie-scan.md",
  "valkyrie-forge.md",
  "valkyrie-check.md",
  "barrier-review.md",
];

function printHelp() {
  console.log(`${PACKAGE_NAME}

Usage:
  npx ${PACKAGE_NAME} --all [--target PATH]
  npx ${PACKAGE_NAME} --agent codex,claude [--target PATH]
  npx ${PACKAGE_NAME} --list

Options:
  --all           Install integration files for all supported agents
  --agent LIST    Comma-separated list: codex, claude, copilot, opencode
  --target PATH   Target project directory (default: current directory)
  --list          Show supported agents and generated files
  --help          Show this help

Behavior:
  - Detects oh-my-opencode style layouts automatically
  - When oh-my-opencode is detected, installs OpenCode-specific commands and agents
`);
}

function parseArgs(argv) {
  const result = {
    all: false,
    agents: [],
    target: process.cwd(),
    list: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--all") {
      result.all = true;
    } else if (arg === "--agent") {
      const value = argv[i + 1];
      if (!value) {
        throw new Error("--agent requires a comma-separated value");
      }
      result.agents = value.split(",").map((item) => item.trim()).filter(Boolean);
      i += 1;
    } else if (arg === "--target") {
      const value = argv[i + 1];
      if (!value) {
        throw new Error("--target requires a path");
      }
      result.target = path.resolve(value);
      i += 1;
    } else if (arg === "--list") {
      result.list = true;
    } else if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (result.all) {
    result.agents = [...SUPPORTED_AGENTS];
  }

  return result;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readTemplate(...parts) {
  const templatePath = path.join(scriptDir(), "..", "templates", ...parts);
  return fs.readFileSync(templatePath, "utf8");
}

function scriptDir() {
  return path.dirname(fileURLToPath(import.meta.url));
}

function writeFileIfMissing(filePath, content) {
  ensureDir(path.dirname(filePath));
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
    return "created";
  }

  if (fs.readFileSync(filePath, "utf8") === content) {
    return "unchanged";
  }

  fs.writeFileSync(filePath, content, "utf8");
  return "updated";
}

function appendManagedBlock(filePath, block) {
  ensureDir(path.dirname(filePath));
  const managedBlock = `${MARKER_START}\n${block.trimEnd()}\n${MARKER_END}\n`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, managedBlock, "utf8");
    return "created";
  }

  const existing = fs.readFileSync(filePath, "utf8");
  const pattern = new RegExp(`${escapeRegExp(MARKER_START)}[\\s\\S]*?${escapeRegExp(MARKER_END)}\\n?`, "m");
  const next = pattern.test(existing)
    ? existing.replace(pattern, managedBlock)
    : `${existing.trimEnd()}\n\n${managedBlock}`;

  if (next === existing) {
    return "unchanged";
  }

  fs.writeFileSync(filePath, next, "utf8");
  return "updated";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function installBaseBundle(target) {
  const results = [];
  results.push([
    "MULTI_AGENT_RULES.md",
    writeFileIfMissing(
      path.join(target, "MULTI_AGENT_RULES.md"),
      readTemplate("MULTI_AGENT_RULES.md")
    ),
  ]);
  results.push([
    "topology/sdf_topology.yaml",
    writeFileIfMissing(
      path.join(target, "topology", "sdf_topology.yaml"),
      readTemplate("topology", "sdf_topology.yaml")
    ),
  ]);
  results.push([
    "commands/task-force.md",
    writeFileIfMissing(
      path.join(target, "commands", "task-force.md"),
      readTemplate("commands", "task-force.md")
    ),
  ]);
  return results;
}

function detectOhMyOpenCode(target) {
  const checks = [
    path.join(target, ".opencode"),
    path.join(target, ".claude", "agents"),
    path.join(target, ".claude", "rules"),
  ];
  return checks.some((candidate) => fs.existsSync(candidate));
}

function installOhMyOpenCodeBundle(target) {
  const results = [];
  results.push([
    ".opencode/command/task-force.md",
    writeFileIfMissing(
      path.join(target, ".opencode", "command", "task-force.md"),
      readTemplate("oh-my-opencode", "command", "task-force.md")
    ),
  ]);

  for (const fileName of OMO_AGENT_FILES) {
    results.push([
      `.claude/agents/${fileName}`,
      writeFileIfMissing(
        path.join(target, ".claude", "agents", fileName),
        readTemplate("oh-my-opencode", "agents", fileName)
      ),
    ]);
  }

  return results;
}

function integrationBlock(agent) {
  if (agent === "codex") {
    return `Read and follow MULTI_AGENT_RULES.md for delegation and orchestration.
If AGENT_RULES.md or AGENT_RULES_LITE.md exists, apply it to every agent and subagent as mandatory policy.`;
  }

  if (agent === "claude") {
    return `## Multi-Agent Orchestration

Use MULTI_AGENT_RULES.md as the collaboration and delegation policy.
If AGENT_RULES.md or AGENT_RULES_LITE.md exists, apply it to every agent and subagent as mandatory policy.`;
  }

  if (agent === "copilot") {
    return `Follow MULTI_AGENT_RULES.md when decomposing work into parallel streams or subagents.
If AGENT_RULES.md or AGENT_RULES_LITE.md exists, treat it as mandatory policy for all generated code and reviews.`;
  }

  if (agent === "opencode") {
    return `Read MULTI_AGENT_RULES.md before creating subagents or parallel workstreams.
If AGENT_RULES.md or AGENT_RULES_LITE.md exists, apply it as mandatory policy across the task force.`;
  }

  throw new Error(`Unsupported agent: ${agent}`);
}

function installAgent(target, agent) {
  if (!SUPPORTED_AGENTS.includes(agent)) {
    throw new Error(`Unsupported agent: ${agent}`);
  }

  const block = integrationBlock(agent);
  if (agent === "codex") {
    return [
      "AGENTS.md",
      appendManagedBlock(path.join(target, "AGENTS.md"), block),
    ];
  }

  if (agent === "claude") {
    return [
      "CLAUDE.md",
      appendManagedBlock(path.join(target, "CLAUDE.md"), block),
    ];
  }

  if (agent === "copilot") {
    return [
      ".github/copilot-instructions.md",
      appendManagedBlock(path.join(target, ".github", "copilot-instructions.md"), block),
    ];
  }

  return [
    ".claude/rules/multi-agent.md",
    appendManagedBlock(path.join(target, ".claude", "rules", "multi-agent.md"), block),
  ];
}

function printList() {
  console.log("Supported agents:");
  console.log("- codex -> AGENTS.md");
  console.log("- claude -> CLAUDE.md");
  console.log("- copilot -> .github/copilot-instructions.md");
  console.log("- opencode -> .claude/rules/multi-agent.md");
  console.log("");
  console.log("Shared bundle:");
  console.log("- MULTI_AGENT_RULES.md");
  console.log("- topology/sdf_topology.yaml");
  console.log("- commands/task-force.md");
  console.log("");
  console.log("oh-my-opencode extras when detected:");
  console.log("- .opencode/command/task-force.md");
  console.log("- .claude/agents/sdf-command.md");
  console.log("- .claude/agents/valkyrie-scan.md");
  console.log("- .claude/agents/valkyrie-forge.md");
  console.log("- .claude/agents/valkyrie-check.md");
  console.log("- .claude/agents/barrier-review.md");
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  if (args.list) {
    printList();
    return;
  }

  if (args.agents.length === 0) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  ensureDir(args.target);
  const isOhMyOpenCode = detectOhMyOpenCode(args.target);
  const results = [...installBaseBundle(args.target)];
  for (const agent of args.agents) {
    results.push(installAgent(args.target, agent));
  }
  if (isOhMyOpenCode) {
    results.push(...installOhMyOpenCodeBundle(args.target));
  }

  console.log(`Installed ${PACKAGE_NAME} into ${args.target}`);
  if (isOhMyOpenCode) {
    console.log("- detected: oh-my-opencode compatible layout");
  }
  for (const [file, status] of results) {
    console.log(`- ${status}: ${file}`);
  }
  if (isOhMyOpenCode) {
    console.log("");
    console.log("Recommended companion install:");
    console.log("- npx agent-security-policies --agent opencode --skills --omo");
    console.log("This will add security rules, skills, commands, and the Aegis security agent without conflicting with the orchestration bundle.");
  }
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
