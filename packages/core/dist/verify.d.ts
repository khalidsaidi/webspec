import type { Diagnostic, Plan } from "./types.js";
import type { FileMap } from "./workspace.js";
export type VerificationResult = {
    ok: boolean;
    diagnostics: Diagnostic[];
};
export declare function verifyAfterState(after: FileMap, plan: Plan): VerificationResult;
//# sourceMappingURL=verify.d.ts.map