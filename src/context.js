import fs from "node:fs";
import path from "node:path";

import { SUPPORTED_AGENTS } from "./constants.js";

function exists(target, relativePath) {
  return fs.existsSync(path.join(target, relativePath));
}

export function detectProjectContext(target) {
  const markers = {
    codexFile: exists(target, "AGENTS.md"),
    claudeFile: exists(target, "CLAUDE.md"),
    copilotFile: exists(target, ".github/copilot-instructions.md"),
    opencodeDir: exists(target, ".opencode"),
    claudeAgentsDir: exists(target, ".claude/agents"),
    claudeRulesDir: exists(target, ".claude/rules"),
  };

  const isOhMyOpenCode =
    markers.opencodeDir || markers.claudeAgentsDir || markers.claudeRulesDir;

  let detectedAgent = null;
  if (markers.opencodeDir) {
    detectedAgent = "opencode";
  } else if (markers.claudeFile) {
    detectedAgent = "claude";
  } else if (markers.codexFile) {
    detectedAgent = "codex";
  } else if (markers.copilotFile) {
    detectedAgent = "copilot";
  } else if (markers.claudeAgentsDir || markers.claudeRulesDir) {
    detectedAgent = "opencode";
  }

  return {
    markers,
    detectedAgent,
    isOhMyOpenCode,
  };
}

export function resolveAgents(requestedAgents, context) {
  if (requestedAgents.length === 1 && requestedAgents[0] === "auto") {
    if (context.detectedAgent) {
      return {
        agents: [context.detectedAgent],
        autoMode: "detected",
      };
    }

    return {
      agents: [...SUPPORTED_AGENTS],
      autoMode: "fallback-all",
    };
  }

  return {
    agents: [...new Set(requestedAgents)],
    autoMode: "explicit",
  };
}
