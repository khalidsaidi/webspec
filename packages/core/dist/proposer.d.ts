import type { GoalSpec, IntentSpec, TargetKernel } from "./types.js";
export declare function proposeIntents(goal: GoalSpec, target: TargetKernel): Array<{
    id: string;
    title: string;
    summary: string;
    intent: IntentSpec;
    assumptions: string[];
}>;
//# sourceMappingURL=proposer.d.ts.map