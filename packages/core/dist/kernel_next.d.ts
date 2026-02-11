import type { Diagnostic, IntentSpec, Plan } from "./types.js";
import type { WorkspaceReader } from "./workspace.js";
export declare function compileNextAppRouterIntent(intent: IntentSpec, ws: WorkspaceReader): Promise<{
    plan?: Plan;
    diagnostics: Diagnostic[];
}>;
//# sourceMappingURL=kernel_next.d.ts.map