import { GoalSpecSchema, IntentSpecSchema } from "./schemas.js";
import { DEFAULT_KERNEL } from "./types.js";
import { proposeIntents } from "./proposer.js";
import { compileViteReactIntent } from "./kernel_vite.js";
import { compileNextAppRouterIntent } from "./kernel_next.js";
import { assessRisk } from "./risk.js";
import { applyPlanToFileMap, buildUnifiedPatch, collectTouchedPaths } from "./patch.js";
import { verifyAfterState } from "./verify.js";
import { readFileMap } from "./workspace.js";
import { SANDBOX_SNAPSHOT } from "./demo/sandboxSnapshot.js";
async function compileIntent(intent, wsReader) {
    switch (intent.target) {
        case "react-vite-shadcn-tailwind4":
            return compileViteReactIntent(intent, wsReader);
        case "nextjs-app-router-shadcn-tailwind4":
            return compileNextAppRouterIntent(intent, wsReader);
        default:
            return {
                diagnostics: [{
                        level: "error",
                        code: "E_UNKNOWN_KERNEL",
                        message: `Unsupported kernel: ${intent.target}`,
                    }],
            };
    }
}
export async function propose(req) {
    const diagnostics = [];
    const parsed = GoalSpecSchema.safeParse(req.goal);
    if (!parsed.success) {
        return {
            ok: false,
            mode: req.mode,
            workspaceLabel: req.workspace?.reader.rootLabel ?? "(none)",
            proposals: [],
            diagnostics: [{ level: "error", code: "E_GOAL_SCHEMA", message: parsed.error.message }],
        };
    }
    const profile = req.profile ?? "balanced";
    const selectedKernel = parsed.data.targetKernel ?? DEFAULT_KERNEL;
    const wsReader = req.workspace?.reader ?? {
        rootLabel: "(demo snapshot)",
        async exists(p) { return Object.prototype.hasOwnProperty.call(SANDBOX_SNAPSHOT, p); },
        async read(p) {
            const v = SANDBOX_SNAPSHOT[p];
            if (v === undefined)
                throw new Error(`Missing demo file: ${p}`);
            return v;
        }
    };
    const candidates = proposeIntents(parsed.data, selectedKernel);
    const proposals = [];
    for (const c of candidates) {
        const intentOk = IntentSpecSchema.safeParse(c.intent);
        if (!intentOk.success) {
            proposals.push({
                id: c.id,
                title: c.title,
                summary: c.summary,
                intent: c.intent,
                assumptions: c.assumptions,
                compile: {
                    ok: false,
                    diagnostics: [{ level: "error", code: "E_INTENT_SCHEMA", message: intentOk.error.message }],
                }
            });
            continue;
        }
        const compiled = await compileIntent(c.intent, wsReader);
        const plan = compiled.plan;
        const proposal = {
            id: c.id,
            title: c.title,
            summary: c.summary,
            intent: c.intent,
            assumptions: c.assumptions,
            compile: {
                ok: !!plan && compiled.diagnostics.every((d) => d.level !== "error"),
                diagnostics: compiled.diagnostics,
                plan,
            }
        };
        if (proposal.compile.ok && plan) {
            proposal.risk = assessRisk(plan, profile);
        }
        proposals.push(proposal);
    }
    proposals.sort((a, b) => {
        const aOk = a.compile.ok ? 0 : 1;
        const bOk = b.compile.ok ? 0 : 1;
        if (aOk !== bOk)
            return aOk - bOk;
        const ar = a.risk?.score ?? 1;
        const br = b.risk?.score ?? 1;
        return ar - br;
    });
    return {
        ok: proposals.some((p) => p.compile.ok),
        mode: req.mode,
        workspaceLabel: wsReader.rootLabel,
        proposals,
        diagnostics,
    };
}
export async function generatePatch(req) {
    const compileDiagnostics = req.proposal.compile.diagnostics;
    const plan = req.proposal.compile.plan;
    if (!req.proposal.compile.ok || !plan) {
        return {
            ok: false,
            patch: "",
            verification: { ok: false, diagnostics: compileDiagnostics },
            compileDiagnostics,
            risk: req.proposal.risk,
        };
    }
    const touched = collectTouchedPaths(plan);
    const before = await readFileMap(req.workspaceReader, touched);
    const { after, diagnostics: applyDiags } = applyPlanToFileMap(before, plan);
    const verification = verifyAfterState(after, plan);
    const ok = applyDiags.every((d) => d.level !== "error") && verification.ok;
    const patch = buildUnifiedPatch(before, after);
    return {
        ok,
        patch,
        verification: {
            ok,
            diagnostics: [...applyDiags, ...verification.diagnostics],
        },
        compileDiagnostics,
        risk: req.proposal.risk,
    };
}
export async function applyPlanToDisk(ws, plan) {
    const diagnostics = [];
    for (const step of plan.steps) {
        if (step.kind === "writeFile") {
            await ws.write(step.path, step.content.endsWith("\n") ? step.content : step.content + "\n");
            continue;
        }
        if (step.kind === "insertBetweenMarkers") {
            if (!(await ws.exists(step.path))) {
                diagnostics.push({ level: "error", code: "E_NO_FILE", message: `Cannot modify missing file: ${step.path}` });
                continue;
            }
            const old = await ws.read(step.path);
            if (step.uniqueKey && old.includes(step.uniqueKey))
                continue;
            const startIdx = old.indexOf(step.markerStart);
            const endIdx = old.indexOf(step.markerEnd);
            if (startIdx < 0 || endIdx < 0 || endIdx <= startIdx) {
                diagnostics.push({ level: "error", code: "E_MARKERS", message: `Missing/invalid markers in ${step.path}` });
                continue;
            }
            const insertionPoint = endIdx;
            const content = step.content.endsWith("\n") ? step.content : step.content + "\n";
            const next = old.slice(0, insertionPoint) + content + old.slice(insertionPoint);
            await ws.write(step.path, next);
            continue;
        }
    }
    const touched = collectTouchedPaths(plan);
    const after = {};
    for (const p of touched) {
        if (await ws.exists(p))
            after[p] = await ws.read(p);
    }
    const verification = verifyAfterState(after, plan);
    diagnostics.push(...verification.diagnostics);
    return { ok: diagnostics.every((d) => d.level !== "error"), diagnostics };
}
//# sourceMappingURL=orchestrator.js.map