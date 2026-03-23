import path from "node:path";
import process from "node:process";

import {
  DEFAULT_COMMAND,
  SUPPORTED_AGENTS,
  SUPPORTED_PRESETS,
  SUPPORTED_SECURITY_MODES,
  SUPPORTED_WORKFLOWS,
} from "./constants.js";

function normalizeAgentList(value) {
  return value.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
}

export function parseArgs(argv) {
  const args = {
    command: DEFAULT_COMMAND,
    all: false,
    agents: ["auto"],
    target: process.cwd(),
    preset: "pro",
    workflow: "auto",
    withSecurity: "auto",
    list: false,
    help: false,
    dryRun: false,
    explain: false,
  };

  let index = 0;
  const first = argv[0];
  if (first && !first.startsWith("-")) {
    if (first === "install") {
      args.command = "install";
      index = 1;
    } else if (first === "list") {
      args.command = "list";
      args.list = true;
      index = 1;
    } else {
      throw new Error(`Unknown command: ${first}`);
    }
  }

  for (; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--all") {
      args.all = true;
      args.agents = [...SUPPORTED_AGENTS];
      continue;
    }

    if (arg === "--agent") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--agent requires a comma-separated value or auto");
      }
      const agents = normalizeAgentList(value);
      if (agents.length === 0) {
        throw new Error("--agent requires at least one supported agent or auto");
      }
      if (agents.includes("auto") && agents.length > 1) {
        throw new Error("--agent auto cannot be combined with other agents");
      }
      args.all = false;
      args.agents = agents;
      index += 1;
      continue;
    }

    if (arg === "--target") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--target requires a path");
      }
      args.target = path.resolve(value);
      index += 1;
      continue;
    }

    if (arg === "--preset") {
      const value = argv[index + 1]?.trim().toLowerCase();
      if (!value) {
        throw new Error(`--preset requires one of: ${SUPPORTED_PRESETS.join(", ")}`);
      }
      args.preset = value;
      index += 1;
      continue;
    }

    if (arg === "--workflow") {
      const value = argv[index + 1]?.trim().toLowerCase();
      if (!value) {
        throw new Error(`--workflow requires one of: ${SUPPORTED_WORKFLOWS.join(", ")}`);
      }
      args.workflow = value;
      index += 1;
      continue;
    }

    if (arg === "--with-security") {
      const value = argv[index + 1]?.trim().toLowerCase();
      if (!value) {
        throw new Error(`--with-security requires one of: ${SUPPORTED_SECURITY_MODES.join(", ")}`);
      }
      args.withSecurity = value;
      index += 1;
      continue;
    }

    if (arg === "--list") {
      args.list = true;
      args.command = "list";
      continue;
    }

    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (arg === "--explain") {
      args.explain = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!SUPPORTED_PRESETS.includes(args.preset)) {
    throw new Error(`--preset must be one of: ${SUPPORTED_PRESETS.join(", ")}`);
  }

  if (!SUPPORTED_WORKFLOWS.includes(args.workflow)) {
    throw new Error(`--workflow must be one of: ${SUPPORTED_WORKFLOWS.join(", ")}`);
  }

  if (!SUPPORTED_SECURITY_MODES.includes(args.withSecurity)) {
    throw new Error(`--with-security must be one of: ${SUPPORTED_SECURITY_MODES.join(", ")}`);
  }

  if (args.agents.length === 0) {
    throw new Error("--agent requires at least one supported agent or auto");
  }

  if (args.agents.includes("auto") && args.agents.length > 1) {
    throw new Error("--agent auto cannot be combined with other agents");
  }

  const unknownAgents = args.agents.filter(
    (agent) => agent !== "auto" && !SUPPORTED_AGENTS.includes(agent)
  );
  if (unknownAgents.length > 0) {
    throw new Error(`Unsupported agent(s): ${unknownAgents.join(", ")}`);
  }

  return args;
}
