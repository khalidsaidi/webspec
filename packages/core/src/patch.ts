import { createTwoFilesPatch } from "diff";
import type { FileMap } from "./workspace.js";
import type { Plan, Diagnostic } from "./types.js";

function ensureNL(s: string) {
  return s.endsWith("\n") ? s : s + "\n";
}

export function applyPlanToFileMap(before: FileMap, plan: Plan): { after: FileMap; diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];
  const after: FileMap = { ...before };

  for (const step of plan.steps) {
    if (step.kind === "writeFile") {
      after[step.path] = ensureNL(step.content);
      continue;
    }
    if (step.kind === "insertBetweenMarkers") {
      const old = after[step.path];
      if (old === undefined) {
        diagnostics.push({ level: "error", code: "E_NO_FILE", message: `Cannot modify missing file: ${step.path}`, hint: "Ensure router file exists or is created by plan." });
        continue;
      }
      if (step.uniqueKey && old.includes(step.uniqueKey)) {
        continue;
      }
      const startIdx = old.indexOf(step.markerStart);
      const endIdx = old.indexOf(step.markerEnd);
      if (startIdx < 0 || endIdx < 0 || endIdx <= startIdx) {
        diagnostics.push({ level: "error", code: "E_MARKERS", message: `Missing/invalid markers in ${step.path}`, hint: `Expected markers: ${step.markerStart} ... ${step.markerEnd}` });
        continue;
      }
      const insertionPoint = endIdx;
      const inserted = old.slice(0, insertionPoint) + ensureNL(step.content) + old.slice(insertionPoint);
      after[step.path] = inserted;
      continue;
    }
  }

  return { after, diagnostics };
}

export function buildUnifiedPatch(before: FileMap, after: FileMap): string {
  const files = Array.from(new Set([...Object.keys(before), ...Object.keys(after)])).sort();
  const patches: string[] = [];

  for (const f of files) {
    const oldStr = before[f] ?? "";
    const newStr = after[f] ?? "";
    if (oldStr === newStr) continue;

    const patch = createTwoFilesPatch(
      `a/${f}`,
      `b/${f}`,
      oldStr,
      newStr,
      "",
      "",
      { context: 3 }
    );
    patches.push(patch);
  }

  return patches.join("\n");
}

export function collectTouchedPaths(plan: Plan): string[] {
  const paths = new Set<string>();
  for (const s of plan.steps) {
    if ("path" in s) paths.add(s.path);
  }
  return Array.from(paths);
}

export function approxLinesChanged(plan: Plan): number {
  let lines = 0;
  for (const s of plan.steps) {
    if (s.kind === "writeFile") lines += s.content.split("\n").length;
    if (s.kind === "insertBetweenMarkers") lines += s.content.split("\n").length;
  }
  return lines;
}
