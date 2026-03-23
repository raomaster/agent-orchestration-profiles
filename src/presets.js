import { PRESET_COMMANDS, PRESET_SUMMARIES } from "./constants.js";

const FULL_OPENCODE_PRESET_ERROR =
  "--preset full-opencode requires --agent opencode. Use --preset full for adaptive behavior or --preset full-portable for non-OpenCode agents.";

export function resolvePresetForAgent({ requestedPreset, agent, workflow }) {
  if (requestedPreset === "full") {
    if (workflow === "portable") {
      return "full-portable";
    }

    if (workflow === "omo") {
      return agent === "opencode" ? "full-opencode" : "full-portable";
    }

    if (workflow === "hybrid") {
      return agent === "opencode" ? "hybrid" : "full-portable";
    }

    return agent === "opencode" ? "full-opencode" : "full-portable";
  }

  if (requestedPreset === "hybrid" && agent !== "opencode") {
    return "full-portable";
  }

  if (requestedPreset === "full-opencode" && agent !== "opencode") {
    throw new Error(FULL_OPENCODE_PRESET_ERROR);
  }

  return requestedPreset;
}

export function commandFilesForPreset(preset) {
  return [...(PRESET_COMMANDS[preset] ?? [])];
}

export function collectPresetContext(agentPresets) {
  const actualPresets = [...new Set(Object.values(agentPresets))];
  const commandFiles = new Set();

  for (const preset of actualPresets) {
    const commands = commandFilesForPreset(preset);
    for (const command of commands) {
      commandFiles.add(command);
    }
  }

  return {
    actualPresets,
    commandFiles: [...commandFiles],
  };
}

export function describePreset(preset) {
  return PRESET_SUMMARIES[preset] ?? preset;
}
