import type { FileMap } from "./workspace.js";
import type { Plan, Diagnostic } from "./types.js";
export declare function applyPlanToFileMap(before: FileMap, plan: Plan): {
    after: FileMap;
    diagnostics: Diagnostic[];
};
export declare function buildUnifiedPatch(before: FileMap, after: FileMap): string;
export declare function collectTouchedPaths(plan: Plan): string[];
export declare function approxLinesChanged(plan: Plan): number;
//# sourceMappingURL=patch.d.ts.map