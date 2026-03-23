export const PACKAGE_NAME = "agent-orchestration-profiles";

export const SUPPORTED_AGENTS = ["codex", "claude", "copilot", "opencode"];
export const SUPPORTED_PRESETS = [
  "lite",
  "pro",
  "full",
  "full-opencode",
  "full-portable",
  "hybrid",
];
export const SUPPORTED_WORKFLOWS = ["auto", "native", "omo", "portable", "hybrid"];
export const SUPPORTED_SECURITY_MODES = ["auto", "off", "lite", "standard", "full"];
export const MARKER_START = "<!-- agent-orchestration-profiles -->";
export const MARKER_END = "<!-- /agent-orchestration-profiles -->";
export const DEFAULT_COMMAND = "install";

export const AGENT_FILE_MAP = {
  codex: "AGENTS.md",
  claude: "CLAUDE.md",
  copilot: ".github/copilot-instructions.md",
  opencode: ".claude/rules/multi-agent.md",
};

export const OMO_AGENT_FILES = [
  "sdf-command.md",
  "valkyrie-scan.md",
  "valkyrie-forge.md",
  "valkyrie-check.md",
  "barrier-review.md",
  "archive-note.md",
];

export const PRESET_COMMANDS = {
  lite: ["task-force", "verify-change"],
  pro: [
    "task-force",
    "checkpoint",
    "checkpoint-list",
    "rollback",
    "rollback-file",
    "worktree-start",
    "worktree-finish",
    "verify-change",
    "threat-model",
    "handoff",
  ],
  "full-portable": [
    "task-force",
    "plan-change",
    "execute-plan",
    "checkpoint",
    "checkpoint-list",
    "rollback",
    "rollback-file",
    "worktree-start",
    "worktree-finish",
    "verify-change",
    "threat-model",
    "handoff",
    "finish-branch",
  ],
  "full-opencode": [
    "task-force",
    "checkpoint",
    "checkpoint-list",
    "rollback",
    "rollback-file",
    "worktree-start",
    "worktree-finish",
    "verify-change",
    "threat-model",
    "handoff",
  ],
  hybrid: [
    "task-force",
    "plan-change",
    "execute-plan",
    "checkpoint",
    "checkpoint-list",
    "rollback",
    "rollback-file",
    "worktree-start",
    "worktree-finish",
    "verify-change",
    "threat-model",
    "handoff",
    "finish-branch",
  ],
};

export const PRESET_SUMMARIES = {
  lite: "Low-cost starter with conservative orchestration and security lite.",
  pro: "Daily-driver preset with professional workflow, recovery commands, and adaptive multi-agent execution.",
  full: "Adaptive alias: OpenCode resolves to full-opencode; other agents resolve to full-portable.",
  "full-opencode": "Complete OpenCode-only stack with SDF subagents, mirrored command pack, and oh-my-opencode compatibility assets.",
  "full-portable": "Portable full workflow with planning, execution, recovery, review, and branch finishing commands.",
  hybrid: "Experimental OpenCode stack that combines full-opencode assets with the portable workflow command pack.",
};
