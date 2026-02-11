import { z } from "zod";
export declare const GoalConstraintsSchema: z.ZodObject<{
    changeSize: z.ZodOptional<z.ZodEnum<["tiny", "small", "medium", "large"]>>;
    newDependencies: z.ZodOptional<z.ZodEnum<["avoid", "allow", "prefer"]>>;
    configChanges: z.ZodOptional<z.ZodEnum<["avoid", "allow", "prefer"]>>;
    accessibility: z.ZodOptional<z.ZodEnum<["optional", "required"]>>;
}, "strict", z.ZodTypeAny, {
    changeSize?: "tiny" | "small" | "medium" | "large" | undefined;
    newDependencies?: "avoid" | "allow" | "prefer" | undefined;
    configChanges?: "avoid" | "allow" | "prefer" | undefined;
    accessibility?: "optional" | "required" | undefined;
}, {
    changeSize?: "tiny" | "small" | "medium" | "large" | undefined;
    newDependencies?: "avoid" | "allow" | "prefer" | undefined;
    configChanges?: "avoid" | "allow" | "prefer" | undefined;
    accessibility?: "optional" | "required" | undefined;
}>;
export declare const GoalSpecSchema: z.ZodObject<{
    featureId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    text: z.ZodString;
    targetKernel: z.ZodOptional<z.ZodEnum<["react-vite-shadcn-tailwind4", "nextjs-app-router-shadcn-tailwind4"]>>;
    constraints: z.ZodOptional<z.ZodObject<{
        changeSize: z.ZodOptional<z.ZodEnum<["tiny", "small", "medium", "large"]>>;
        newDependencies: z.ZodOptional<z.ZodEnum<["avoid", "allow", "prefer"]>>;
        configChanges: z.ZodOptional<z.ZodEnum<["avoid", "allow", "prefer"]>>;
        accessibility: z.ZodOptional<z.ZodEnum<["optional", "required"]>>;
    }, "strict", z.ZodTypeAny, {
        changeSize?: "tiny" | "small" | "medium" | "large" | undefined;
        newDependencies?: "avoid" | "allow" | "prefer" | undefined;
        configChanges?: "avoid" | "allow" | "prefer" | undefined;
        accessibility?: "optional" | "required" | undefined;
    }, {
        changeSize?: "tiny" | "small" | "medium" | "large" | undefined;
        newDependencies?: "avoid" | "allow" | "prefer" | undefined;
        configChanges?: "avoid" | "allow" | "prefer" | undefined;
        accessibility?: "optional" | "required" | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    text: string;
    featureId?: string | undefined;
    title?: string | undefined;
    targetKernel?: "react-vite-shadcn-tailwind4" | "nextjs-app-router-shadcn-tailwind4" | undefined;
    constraints?: {
        changeSize?: "tiny" | "small" | "medium" | "large" | undefined;
        newDependencies?: "avoid" | "allow" | "prefer" | undefined;
        configChanges?: "avoid" | "allow" | "prefer" | undefined;
        accessibility?: "optional" | "required" | undefined;
    } | undefined;
}, {
    text: string;
    featureId?: string | undefined;
    title?: string | undefined;
    targetKernel?: "react-vite-shadcn-tailwind4" | "nextjs-app-router-shadcn-tailwind4" | undefined;
    constraints?: {
        changeSize?: "tiny" | "small" | "medium" | "large" | undefined;
        newDependencies?: "avoid" | "allow" | "prefer" | undefined;
        configChanges?: "avoid" | "allow" | "prefer" | undefined;
        accessibility?: "optional" | "required" | undefined;
    } | undefined;
}>;
export declare const IntentPageSchema: z.ZodObject<{
    name: z.ZodString;
    title: z.ZodString;
    routeHint: z.ZodString;
    kind: z.ZodEnum<["static", "form", "list", "dashboard"]>;
    sections: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"heading">;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "heading";
        text: string;
    }, {
        type: "heading";
        text: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"paragraph">;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "paragraph";
        text: string;
    }, {
        type: "paragraph";
        text: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"callout">;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "callout";
        text: string;
    }, {
        type: "callout";
        text: string;
    }>]>, "many">>;
}, "strict", z.ZodTypeAny, {
    title: string;
    name: string;
    routeHint: string;
    kind: "static" | "form" | "list" | "dashboard";
    sections?: ({
        type: "heading";
        text: string;
    } | {
        type: "paragraph";
        text: string;
    } | {
        type: "callout";
        text: string;
    })[] | undefined;
}, {
    title: string;
    name: string;
    routeHint: string;
    kind: "static" | "form" | "list" | "dashboard";
    sections?: ({
        type: "heading";
        text: string;
    } | {
        type: "paragraph";
        text: string;
    } | {
        type: "callout";
        text: string;
    })[] | undefined;
}>;
export declare const IntentSpecSchema: z.ZodObject<{
    feature: z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        summary: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        title: string;
        id: string;
        summary?: string | undefined;
    }, {
        title: string;
        id: string;
        summary?: string | undefined;
    }>;
    target: z.ZodEnum<["react-vite-shadcn-tailwind4", "nextjs-app-router-shadcn-tailwind4"]>;
    intent: z.ZodObject<{
        pages: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            title: z.ZodString;
            routeHint: z.ZodString;
            kind: z.ZodEnum<["static", "form", "list", "dashboard"]>;
            sections: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"heading">;
                text: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "heading";
                text: string;
            }, {
                type: "heading";
                text: string;
            }>, z.ZodObject<{
                type: z.ZodLiteral<"paragraph">;
                text: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "paragraph";
                text: string;
            }, {
                type: "paragraph";
                text: string;
            }>, z.ZodObject<{
                type: z.ZodLiteral<"callout">;
                text: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "callout";
                text: string;
            }, {
                type: "callout";
                text: string;
            }>]>, "many">>;
        }, "strict", z.ZodTypeAny, {
            title: string;
            name: string;
            routeHint: string;
            kind: "static" | "form" | "list" | "dashboard";
            sections?: ({
                type: "heading";
                text: string;
            } | {
                type: "paragraph";
                text: string;
            } | {
                type: "callout";
                text: string;
            })[] | undefined;
        }, {
            title: string;
            name: string;
            routeHint: string;
            kind: "static" | "form" | "list" | "dashboard";
            sections?: ({
                type: "heading";
                text: string;
            } | {
                type: "paragraph";
                text: string;
            } | {
                type: "callout";
                text: string;
            })[] | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        pages: {
            title: string;
            name: string;
            routeHint: string;
            kind: "static" | "form" | "list" | "dashboard";
            sections?: ({
                type: "heading";
                text: string;
            } | {
                type: "paragraph";
                text: string;
            } | {
                type: "callout";
                text: string;
            })[] | undefined;
        }[];
    }, {
        pages: {
            title: string;
            name: string;
            routeHint: string;
            kind: "static" | "form" | "list" | "dashboard";
            sections?: ({
                type: "heading";
                text: string;
            } | {
                type: "paragraph";
                text: string;
            } | {
                type: "callout";
                text: string;
            })[] | undefined;
        }[];
    }>;
    constraints: z.ZodOptional<z.ZodObject<{
        changeSize: z.ZodOptional<z.ZodEnum<["tiny", "small", "medium", "large"]>>;
        newDependencies: z.ZodOptional<z.ZodEnum<["avoid", "allow", "prefer"]>>;
        configChanges: z.ZodOptional<z.ZodEnum<["avoid", "allow", "prefer"]>>;
        accessibility: z.ZodOptional<z.ZodEnum<["optional", "required"]>>;
    }, "strict", z.ZodTypeAny, {
        changeSize?: "tiny" | "small" | "medium" | "large" | undefined;
        newDependencies?: "avoid" | "allow" | "prefer" | undefined;
        configChanges?: "avoid" | "allow" | "prefer" | undefined;
        accessibility?: "optional" | "required" | undefined;
    }, {
        changeSize?: "tiny" | "small" | "medium" | "large" | undefined;
        newDependencies?: "avoid" | "allow" | "prefer" | undefined;
        configChanges?: "avoid" | "allow" | "prefer" | undefined;
        accessibility?: "optional" | "required" | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    feature: {
        title: string;
        id: string;
        summary?: string | undefined;
    };
    target: "react-vite-shadcn-tailwind4" | "nextjs-app-router-shadcn-tailwind4";
    intent: {
        pages: {
            title: string;
            name: string;
            routeHint: string;
            kind: "static" | "form" | "list" | "dashboard";
            sections?: ({
                type: "heading";
                text: string;
            } | {
                type: "paragraph";
                text: string;
            } | {
                type: "callout";
                text: string;
            })[] | undefined;
        }[];
    };
    constraints?: {
        changeSize?: "tiny" | "small" | "medium" | "large" | undefined;
        newDependencies?: "avoid" | "allow" | "prefer" | undefined;
        configChanges?: "avoid" | "allow" | "prefer" | undefined;
        accessibility?: "optional" | "required" | undefined;
    } | undefined;
}, {
    feature: {
        title: string;
        id: string;
        summary?: string | undefined;
    };
    target: "react-vite-shadcn-tailwind4" | "nextjs-app-router-shadcn-tailwind4";
    intent: {
        pages: {
            title: string;
            name: string;
            routeHint: string;
            kind: "static" | "form" | "list" | "dashboard";
            sections?: ({
                type: "heading";
                text: string;
            } | {
                type: "paragraph";
                text: string;
            } | {
                type: "callout";
                text: string;
            })[] | undefined;
        }[];
    };
    constraints?: {
        changeSize?: "tiny" | "small" | "medium" | "large" | undefined;
        newDependencies?: "avoid" | "allow" | "prefer" | undefined;
        configChanges?: "avoid" | "allow" | "prefer" | undefined;
        accessibility?: "optional" | "required" | undefined;
    } | undefined;
}>;
//# sourceMappingURL=schemas.d.ts.map