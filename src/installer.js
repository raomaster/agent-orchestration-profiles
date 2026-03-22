import path from "node:path";

import { AGENT_FILE_MAP, OMO_AGENT_FILES, PACKAGE_NAME } from "./constants.js";
import { detectProjectContext, resolveAgents } from "./context.js";
import { appendManagedBlock, ensureDir, readTemplate, writeFileIfChanged } from "./fs-utils.js";
import { collectPresetContext, describePreset, resolvePresetForAgent } from "./presets.js";
import { executeSecurityPlan, resolveSecurityPlan } from "./security.js";

function integrationBlock(agent, preset) {
  const presetLine = `Preset: ${preset}. Follow the installed command pack conservatively and keep security inheritance intact.`;

  if (agent === "codex") {
    return `## Multi-Agent Orchestration\n\nRead and follow MULTI_AGENT_RULES.md and topology/sdf_topology.yaml for delegation and orchestration.\n${presetLine}\nIf AGENT_RULES.md or AGENT_RULES_LITE.md exists, apply it to every agent and subagent as mandatory policy.`;
  }

  if (agent === "claude") {
    return `## Multi-Agent Orchestration\n\nUse MULTI_AGENT_RULES.md as the collaboration and delegation policy.\n${presetLine}\nIf AGENT_RULES.md or AGENT_RULES_LITE.md exists, apply it to every agent and subagent as mandatory policy.`;
  }

  if (agent === "copilot") {
    return `Follow MULTI_AGENT_RULES.md and topology/sdf_topology.yaml when decomposing work into parallel streams or subagents.\n${presetLine}\nIf AGENT_RULES.md or AGENT_RULES_LITE.md exists, treat it as mandatory policy for all generated code and reviews.`;
  }

  if (agent === "opencode") {
    return `Read MULTI_AGENT_RULES.md and topology/sdf_topology.yaml before creating subagents or parallel workstreams.\n${presetLine}\nIf AGENT_RULES.md or AGENT_RULES_LITE.md exists, apply it as mandatory policy across the task force.`;
  }

  throw new Error(`Unsupported agent: ${agent}`);
}

function installIntegrationFile(target, agent, preset, options) {
  const targetFile = path.join(target, AGENT_FILE_MAP[agent]);
  return [AGENT_FILE_MAP[agent], appendManagedBlock(targetFile, integrationBlock(agent, preset), options)];
}

function installTemplateFiles(target, files, options) {
  const results = [];
  for (const file of files) {
    const content = readTemplate(...file.templatePath);
    const destination = path.join(target, file.relativePath);
    results.push([file.relativePath, writeFileIfChanged(destination, content, options)]);
  }
  return results;
}

function buildFileEntries(relativePaths, templatePrefix = []) {
  return relativePaths.map((relativePath) => ({
    relativePath,
    templatePath: [...templatePrefix, ...relativePath.split("/")],
  }));
}

function buildCommandPaths(commandFiles) {
  return commandFiles.map((command) => `commands/${command}.md`);
}

function buildOhMyOpenCodeCommandEntries(commandFiles) {
  return commandFiles.map((command) => ({
    relativePath: `.opencode/command/${command}.md`,
    templatePath: ["oh-my-opencode", "command", `${command}.md`],
  }));
}

function buildOhMyOpenCodeAgentEntries() {
  return OMO_AGENT_FILES.map((fileName) => ({
    relativePath: `.claude/agents/${fileName}`,
    templatePath: ["oh-my-opencode", "agents", fileName],
  }));
}

function buildSharedFileEntries(commandFiles) {
  return buildFileEntries([
    "MULTI_AGENT_RULES.md",
    "topology/sdf_topology.yaml",
    ...buildCommandPaths(commandFiles),
  ]);
}

export function buildInstallPlan(args) {
  const context = detectProjectContext(args.target);
  const resolvedAgents = resolveAgents(args.agents, context);
  const agentPresets = {};
  for (const agent of resolvedAgents.agents) {
    agentPresets[agent] = resolvePresetForAgent({
      requestedPreset: args.preset,
      agent,
      workflow: args.workflow,
    });
  }

  const presetContext = collectPresetContext(agentPresets);
  const sharedFiles = buildSharedFileEntries(presetContext.commandFiles);

  const needsOhMyOpenCodeBundle =
    context.isOhMyOpenCode ||
    resolvedAgents.agents.some(
      (agent) => agentPresets[agent] === "full-opencode" || agentPresets[agent] === "hybrid"
    );

  const securityPlans = resolvedAgents.agents
    .map((agent) =>
      resolveSecurityPlan({
        agent,
        preset: agentPresets[agent],
        override: args.withSecurity,
      })
    )
    .filter(Boolean);

  return {
    context,
    resolvedAgents,
    agentPresets,
    sharedFiles,
    commandFiles: presetContext.commandFiles,
    needsOhMyOpenCodeBundle,
    ohMyOpenCodeCommandFiles: needsOhMyOpenCodeBundle
      ? buildOhMyOpenCodeCommandEntries(presetContext.commandFiles)
      : [],
    ohMyOpenCodeAgentFiles: needsOhMyOpenCodeBundle ? buildOhMyOpenCodeAgentEntries() : [],
    securityPlans,
  };
}

export function installProject(args, options = {}) {
  const plan = buildInstallPlan(args);
  const writeOptions = { dryRun: args.dryRun };
  ensureDir(args.target);

  const results = [];
  results.push(...installTemplateFiles(args.target, plan.sharedFiles, writeOptions));

  for (const agent of plan.resolvedAgents.agents) {
    results.push(installIntegrationFile(args.target, agent, plan.agentPresets[agent], writeOptions));
  }

  if (plan.needsOhMyOpenCodeBundle) {
    results.push(
      ...installTemplateFiles(
        args.target,
        plan.ohMyOpenCodeCommandFiles,
        writeOptions
      )
    );

    results.push(
      ...installTemplateFiles(
        args.target,
        plan.ohMyOpenCodeAgentFiles,
        writeOptions
      )
    );
  }

  const securityResults = plan.securityPlans.map((securityPlan) => ({
    plan: securityPlan,
    result: (options.executeSecurityPlan ?? executeSecurityPlan)(
      args.target,
      securityPlan,
      writeOptions
    ),
  }));

  return {
    packageName: PACKAGE_NAME,
    args,
    plan,
    results,
    securityResults,
  };
}

export function formatInstallReport(outcome) {
  const lines = [];
  const { args, plan, results, securityResults, packageName } = outcome;
  lines.push(`Installed ${packageName} into ${args.target}`);
  lines.push(`- agents: ${plan.resolvedAgents.agents.join(", ")}`);
  lines.push(`- auto mode: ${plan.resolvedAgents.autoMode}`);
  lines.push(`- requested preset: ${args.preset}`);

  const presetDescriptions = Object.entries(plan.agentPresets).map(
    ([agent, preset]) => `${agent} -> ${preset}`
  );
  lines.push(`- resolved presets: ${presetDescriptions.join("; ")}`);

  if (plan.context.isOhMyOpenCode) {
    lines.push("- detected: oh-my-opencode compatible layout");
  }

  for (const [file, status] of results) {
    lines.push(`- ${status}: ${file}`);
  }

  if (args.explain) {
    lines.push("");
    lines.push("Preset details:");
    for (const [agent, preset] of Object.entries(plan.agentPresets)) {
      lines.push(`- ${agent}: ${describePreset(preset)}`);
    }
  }

  if (securityResults.length > 0) {
    lines.push("");
    lines.push("Security companion:");
    for (const item of securityResults) {
      const { agent, profile } = item.plan;
      if (item.result.status === "installed") {
        lines.push(`- installed for ${agent} (${profile}): ${item.result.detail}`);
      } else if (item.result.status === "planned") {
        lines.push(`- planned for ${agent} (${profile}): ${item.result.detail}`);
      } else if (item.result.status === "recommended") {
        lines.push(`- recommended for ${agent} (${profile}): ${item.result.detail}`);
        if (item.result.error) {
          lines.push(`  note: ${item.result.error}`);
        }
      }
    }
  }

  return `${lines.join("\n")}\n`;
}
