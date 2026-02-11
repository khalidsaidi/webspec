import type { IntentSpec, Plan, Diagnostic } from "./types.js";
import type { WorkspaceReader } from "./workspace.js";
export declare function compileViteReactIntent(intent: IntentSpec, ws: WorkspaceReader): Promise<{
    plan?: Plan;
    diagnostics: Diagnostic[];
}>;
//# sourceMappingURL=kernel_vite.d.ts.map