import type { Diagnostic, Plan } from "./types.js";
import type { FileMap } from "./workspace.js";

export type VerificationResult = {
  ok: boolean;
  diagnostics: Diagnostic[];
};

export function verifyAfterState(after: FileMap, plan: Plan): VerificationResult {
  const diagnostics: Diagnostic[] = [];

  for (const step of plan.steps) {
    if (step.kind === "assertFileExists") {
      if (!(step.path in after)) {
        diagnostics.push({ level: "error", code: "E_ASSERT_EXISTS", message: `Expected file does not exist: ${step.path}` });
      }
    }
    if (step.kind === "assertFileContains") {
      const v = after[step.path];
      if (v === undefined) {
        diagnostics.push({ level: "error", code: "E_ASSERT_CONTAINS", message: `Cannot assert missing file: ${step.path}` });
      } else if (!v.includes(step.needle)) {
        diagnostics.push({ level: "error", code: "E_ASSERT_CONTAINS", message: `Assertion failed: ${step.path} missing needle`, hint: step.needle });
      }
    }
  }

  return { ok: diagnostics.every((d) => d.level !== "error"), diagnostics };
}
