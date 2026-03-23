import process from "node:process";

import { parseArgs } from "./args.js";
import {
  PACKAGE_NAME,
  PRESET_COMMANDS,
  PRESET_SUMMARIES,
  SUPPORTED_AGENTS,
  SUPPORTED_PRESETS,
  SUPPORTED_SECURITY_MODES,
  SUPPORTED_WORKFLOWS,
} from "./constants.js";
import { formatInstallReport, installProject } from "./installer.js";

export function printHelp() {
  console.log(`${PACKAGE_NAME}

Usage:
  npx ${PACKAGE_NAME} install [--agent auto] [--preset pro] [--target PATH]
  npx ${PACKAGE_NAME} install --agent opencode --preset full-opencode
  npx ${PACKAGE_NAME} install --agent auto --preset full --workflow auto
  npx ${PACKAGE_NAME} list

Options:
  --all                 Install integration files for all supported agents
  --agent LIST|auto     Agents: ${SUPPORTED_AGENTS.join(", ")}, auto
  --preset NAME         Presets: ${SUPPORTED_PRESETS.join(", ")}
  --workflow NAME       Workflow resolver for full: ${SUPPORTED_WORKFLOWS.join(", ")}
  --target PATH         Target project directory (default: current directory)
  --with-security MODE  Security mode: ${SUPPORTED_SECURITY_MODES.join(", ")}
  --dry-run             Print a no-write install plan
  --explain             Print preset rationale and install details
  --list                Show presets, commands, and generated files
  --help                Show this help

Defaults:
  - install command uses --agent auto --preset pro
  - full resolves to full-opencode for OpenCode and full-portable elsewhere
  - full-opencode requires --agent opencode; use full for adaptive behavior
  - auto with no markers installs integration files for all supported agents
`);
}

export function printList() {
  console.log("Supported agents:");
  console.log("- codex -> AGENTS.md");
  console.log("- claude -> CLAUDE.md");
  console.log("- copilot -> .github/copilot-instructions.md");
  console.log("- opencode -> .claude/rules/multi-agent.md");
  console.log("");
  console.log("Presets:");
  for (const preset of SUPPORTED_PRESETS) {
    console.log(`- ${preset}: ${PRESET_SUMMARIES[preset]}`);
  }
  console.log("");
  console.log("Command packs:");
  for (const [preset, commands] of Object.entries(PRESET_COMMANDS)) {
    console.log(`- ${preset}: ${commands.join(", ")}`);
  }
  console.log("");
  console.log("oh-my-opencode bundle:");
  console.log("- .opencode/command/*.md mirrors the resolved OpenCode command pack, or the shared pack in an existing oh-my-opencode layout");
  console.log("- .claude/agents/sdf-command.md");
  console.log("- .claude/agents/valkyrie-scan.md");
  console.log("- .claude/agents/valkyrie-forge.md");
  console.log("- .claude/agents/valkyrie-check.md");
  console.log("- .claude/agents/barrier-review.md");
  console.log("- .claude/agents/archive-note.md");
}

export async function main(argv) {
  try {
    const args = parseArgs(argv);

    if (args.help) {
      printHelp();
      return;
    }

    if (args.list || args.command === "list") {
      printList();
      return;
    }

    const outcome = installProject(args);
    process.stdout.write(formatInstallReport(outcome));
  } catch (error) {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exitCode = 1;
  }
}
