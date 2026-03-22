import { spawnSync } from "node:child_process";
import process from "node:process";

function defaultSecuritySettings(agent, preset) {
  if (preset === "lite") {
    return {
      mode: "command",
      profile: "lite",
      installSkills: false,
    };
  }

  if (preset === "pro") {
    return { mode: "command", profile: "lite", installSkills: false };
  }

  if (preset === "full-portable") {
    if (agent === "opencode") {
      return {
        mode: "recommended",
        detail:
          "Use full-opencode or hybrid if you want the OpenCode-specific security companion install path.",
      };
    }

    return {
      mode: "command",
      profile: "standard",
      installSkills: true,
    };
  }

  if (preset === "full-opencode" || preset === "hybrid") {
    if (agent === "opencode") {
      return {
        mode: "command",
        profile: "standard",
        installSkills: true,
        args: ["agent-security-policies", "--agent", "opencode", "--skills", "--omo"],
      };
    }

    return {
      mode: "command",
      profile: "standard",
      installSkills: true,
    };
  }

  return {
    mode: "command",
    profile: "standard",
    installSkills: false,
  };
}

function applySecurityOverride(settings, override) {
  if (override === "auto") {
    return settings;
  }

  if (override === "off") {
    return null;
  }

  if (settings?.mode === "recommended") {
    if (override === "full") {
      return {
        mode: "recommended",
        detail: "Run the full OpenCode security companion install path manually after the orchestration install completes.",
      };
    }

    return {
      mode: "recommended",
      detail: `Run agent-security-policies manually with profile ${override}.`,
    };
  }

  if (override === "lite") {
    return {
      mode: "command",
      profile: "lite",
      installSkills: false,
    };
  }

  if (override === "standard") {
    return {
      mode: "command",
      profile: "standard",
      installSkills: settings?.installSkills ?? false,
    };
  }

  return {
    mode: "command",
    profile: "standard",
    installSkills: true,
  };
}

function buildArgs(agent, settings) {
  if (settings.args) {
    return settings.args;
  }

  const args = ["agent-security-policies", "--agent", agent, "--profile", settings.profile];
  if (settings.installSkills) {
    args.push("--skills");
  }
  return args;
}

export function resolveSecurityPlan({ agent, preset, override }) {
  const defaults = defaultSecuritySettings(agent, preset);
  const resolved = applySecurityOverride(defaults, override);
  if (!resolved) {
    return null;
  }

  if (resolved.mode === "recommended") {
    return {
      agent,
      preset,
      mode: "recommended",
      profile: resolved.profile ?? "manual",
      detail: resolved.detail,
    };
  }

  return {
    agent,
    preset,
    mode: "command",
    profile: resolved.installSkills ? `${resolved.profile}+skills` : resolved.profile,
    args: buildArgs(agent, resolved),
  };
}

export function executeSecurityPlan(target, plan, options = {}) {
  const { dryRun = false } = options;
  if (!plan) {
    return null;
  }

  if (plan.mode === "recommended") {
    return {
      status: "recommended",
      detail: plan.detail,
    };
  }

  const commandText = `npx ${plan.args.join(" ")}`;
  if (dryRun) {
    return {
      status: "planned",
      detail: commandText,
    };
  }

  const runner = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(runner, plan.args, {
    cwd: target,
    stdio: "pipe",
    encoding: "utf8",
  });

  if (result.status === 0) {
    return {
      status: "installed",
      detail: commandText,
    };
  }

  return {
    status: "recommended",
    detail: commandText,
    error: result.stderr?.trim() || result.stdout?.trim() || "security companion install failed",
  };
}
