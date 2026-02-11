import type { GoalSpec, Proposal, Mode, Diagnostic, Plan } from "./types.js";
import type { WorkspaceReader, WorkspaceWriter } from "./workspace.js";
export type ProposeRequest = {
    goal: GoalSpec;
    mode: Mode;
    profile?: "fast" | "balanced" | "strict";
    workspace?: {
        reader: WorkspaceReader;
    };
};
export type ProposeResponse = {
    ok: boolean;
    mode: Mode;
    workspaceLabel: string;
    proposals: Proposal[];
    diagnostics: Diagnostic[];
};
export type GenerateRequest = {
    proposal: Proposal;
    mode: Mode;
    workspaceReader: WorkspaceReader;
};
export type GenerateResponse = {
    ok: boolean;
    patch: string;
    verification: {
        ok: boolean;
        diagnostics: Diagnostic[];
    };
    compileDiagnostics: Diagnostic[];
    risk?: Proposal["risk"];
};
export declare function propose(req: ProposeRequest): Promise<ProposeResponse>;
export declare function generatePatch(req: GenerateRequest): Promise<GenerateResponse>;
export declare function applyPlanToDisk(ws: WorkspaceWriter, plan: Plan): Promise<{
    ok: boolean;
    diagnostics: Diagnostic[];
}>;
//# sourceMappingURL=orchestrator.d.ts.map