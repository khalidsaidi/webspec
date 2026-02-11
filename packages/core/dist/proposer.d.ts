import type { GoalSpec, IntentSpec } from "./types.js";
export declare function proposeIntents(goal: GoalSpec): Array<{
    id: string;
    title: string;
    summary: string;
    intent: IntentSpec;
    assumptions: string[];
}>;
//# sourceMappingURL=proposer.d.ts.map