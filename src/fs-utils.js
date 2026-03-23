import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { MARKER_END, MARKER_START } from "./constants.js";

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_ROOT = path.join(CURRENT_DIR, "..", "templates");

export function templatePath(...parts) {
  return path.join(TEMPLATE_ROOT, ...parts);
}

export function readTemplate(...parts) {
  return fs.readFileSync(templatePath(...parts), "utf8");
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function writeFileIfChanged(filePath, content, options = {}) {
  const { dryRun = false } = options;
  const exists = fs.existsSync(filePath);

  if (!exists) {
    if (!dryRun) {
      ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, content, "utf8");
    }
    return "created";
  }

  const current = fs.readFileSync(filePath, "utf8");
  if (current === content) {
    return "unchanged";
  }

  if (!dryRun) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, "utf8");
  }
  return "updated";
}

export function appendManagedBlock(filePath, block, options = {}) {
  const { dryRun = false } = options;
  const managedBlock = `${MARKER_START}\n${block.trimEnd()}\n${MARKER_END}\n`;
  if (!fs.existsSync(filePath)) {
    if (!dryRun) {
      ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, managedBlock, "utf8");
    }
    return "created";
  }

  const existing = fs.readFileSync(filePath, "utf8");
  const pattern = new RegExp(
    `${escapeRegExp(MARKER_START)}[\\s\\S]*?${escapeRegExp(MARKER_END)}\\n?`,
    "m"
  );
  const next = pattern.test(existing)
    ? existing.replace(pattern, managedBlock)
    : `${existing.trimEnd()}\n\n${managedBlock}`;

  if (next === existing) {
    return "unchanged";
  }

  if (!dryRun) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, next, "utf8");
  }
  return "updated";
}
