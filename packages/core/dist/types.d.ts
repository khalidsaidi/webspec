export type Mode = "local" | "demo";
export type ChangeSize = "tiny" | "small" | "medium" | "large";
export type Preference = "avoid" | "allow" | "prefer";
export type GoalConstraints = {
    changeSize?: ChangeSize;
    newDependencies?: Preference;
    configChanges?: Preference;
    accessibility?: "optional" | "required";
};
export type GoalSpec = {
    featureId?: string;
    title?: string;
    text: string;
    constraints?: GoalConstraints;
};
export declare const SUPPORTED_KERNELS: readonly ["react-vite-shadcn-tailwind4"];
export type TargetKernel = (typeof SUPPORTED_KERNELS)[number];
export declare const DEFAULT_KERNEL: TargetKernel;
export type PageKind = "static" | "form" | "list" | "dashboard";
export type IntentPage = {
    name: string;
    title: string;
    routeHint: string;
    kind: PageKind;
    sections?: Array<{
        type: "heading";
        text: string;
    } | {
        type: "paragraph";
        text: string;
    } | {
        type: "callout";
        text: string;
    }>;
};
export type IntentSpec = {
    feature: {
        id: string;
        title: string;
        summary?: string;
    };
    target: TargetKernel;
    intent: {
        pages: IntentPage[];
    };
    constraints?: GoalConstraints;
};
export type Diagnostic = {
    level: "error" | "warn" | "info";
    code: string;
    message: string;
    hint?: string;
};
export type PlanStep = {
    kind: "writeFile";
    path: string;
    content: string;
} | {
    kind: "insertBetweenMarkers";
    path: string;
    markerStart: string;
    markerEnd: string;
    content: string;
    uniqueKey?: string;
} | {
    kind: "assertFileExists";
    path: string;
} | {
    kind: "assertFileContains";
    path: string;
    needle: string;
};
export type Plan = {
    target: TargetKernel;
    steps: PlanStep[];
    predictedImpact: {
        filesTouched: number;
        newFiles: number;
        routerTouched: boolean;
        configTouched: boolean;
        depsTouched: boolean;
        approxLinesChanged: number;
    };
};
export type RiskLabel = "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
export type RiskAction = "ALLOW" | "REQUIRE_APPROVAL" | "BLOCK";
export type RiskAssessment = {
    profile: "fast" | "balanced" | "strict";
    score: number;
    label: RiskLabel;
    action: RiskAction;
    reasons: Array<{
        title: string;
        evidence: string;
        suggestion: string;
        strength: number;
    }>;
};
export type Proposal = {
    id: string;
    title: string;
    summary: string;
    intent: IntentSpec;
    assumptions: string[];
    compile: {
        ok: boolean;
        diagnostics: Diagnostic[];
        plan?: Plan;
    };
    risk?: RiskAssessment;
};
//# sourceMappingURL=types.d.ts.map