# Changelog

## 0.2.0

- Added preset-driven installs: `lite`, `pro`, `full`, `full-opencode`, `full-portable`, and `hybrid`
- Added adaptive `full` resolution: `OpenCode` -> `full-opencode`, other supported agents -> `full-portable`
- Refactored the installer into testable modules under `src/`
- Added workflow and recovery command templates: checkpoint, rollback, worktree, plan, execute, verify, handoff, and finish-branch
- Added `Archive-Note` to the OpenCode SDF agent catalog
- Rewrote `README.md`, `AGENT_INSTALL.md`, and `prompts/bootstrap.txt` around copy-paste installs for humans and agents
- Added preset, command, and integration reference docs under `docs/`
- Added unit and smoke tests for preset resolution, managed blocks, and CLI installs

## 0.1.0

- Initial public scaffold
- Cross-agent installer for Codex, Claude Code, GitHub Copilot, and OpenCode
- Shared `SDF` multi-agent orchestration bundle
- Cross-platform `install.sh` and `install.ps1`
- Auto-detection for oh-my-opencode style layouts
- OpenCode-specific command and subagent templates
- Companion recommendation for `agent-security-policies` in oh-my-opencode environments
- Stack-aware install mode with agent-appropriate `agent-security-policies` profiles
- README refocused to match the oh-my-opencode "For LLM Agents" remote-install pattern
