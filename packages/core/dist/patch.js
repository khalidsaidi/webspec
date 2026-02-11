import { createTwoFilesPatch } from "diff";
function ensureNL(s) {
    return s.endsWith("\n") ? s : s + "\n";
}
export function applyPlanToFileMap(before, plan) {
    const diagnostics = [];
    const after = { ...before };
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
export function buildUnifiedPatch(before, after) {
    const files = Array.from(new Set([...Object.keys(before), ...Object.keys(after)])).sort();
    const patches = [];
    for (const f of files) {
        const oldStr = before[f] ?? "";
        const newStr = after[f] ?? "";
        if (oldStr === newStr)
            continue;
        const patch = createTwoFilesPatch(`a/${f}`, `b/${f}`, oldStr, newStr, "", "", { context: 3 });
        patches.push(patch);
    }
    return patches.join("\n");
}
export function collectTouchedPaths(plan) {
    const paths = new Set();
    for (const s of plan.steps) {
        if ("path" in s)
            paths.add(s.path);
    }
    return Array.from(paths);
}
export function approxLinesChanged(plan) {
    let lines = 0;
    for (const s of plan.steps) {
        if (s.kind === "writeFile")
            lines += s.content.split("\n").length;
        if (s.kind === "insertBetweenMarkers")
            lines += s.content.split("\n").length;
    }
    return lines;
}
//# sourceMappingURL=patch.js.map