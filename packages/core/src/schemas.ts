import { z } from "zod";
import { SUPPORTED_KERNELS } from "./types.js";

export const GoalConstraintsSchema = z.object({
  changeSize: z.enum(["tiny", "small", "medium", "large"]).optional(),
  newDependencies: z.enum(["avoid", "allow", "prefer"]).optional(),
  configChanges: z.enum(["avoid", "allow", "prefer"]).optional(),
  accessibility: z.enum(["optional", "required"]).optional(),
}).strict();

export const GoalSpecSchema = z.object({
  featureId: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  text: z.string().min(1),
  targetKernel: z.enum(SUPPORTED_KERNELS).optional(),
  constraints: GoalConstraintsSchema.optional(),
}).strict();

export const IntentPageSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  routeHint: z.string().min(1),
  kind: z.enum(["static", "form", "list", "dashboard"]),
  sections: z.array(z.union([
    z.object({ type: z.literal("heading"), text: z.string().min(1) }),
    z.object({ type: z.literal("paragraph"), text: z.string().min(1) }),
    z.object({ type: z.literal("callout"), text: z.string().min(1) }),
  ])).optional(),
}).strict();

export const IntentSpecSchema = z.object({
  feature: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().optional(),
  }).strict(),
  target: z.enum(SUPPORTED_KERNELS),
  intent: z.object({
    pages: z.array(IntentPageSchema).min(1),
  }).strict(),
  constraints: GoalConstraintsSchema.optional(),
}).strict();
