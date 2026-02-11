import { NextResponse } from "next/server";
import { fsWorkspace, mapWorkspace, propose } from "@webspec/core";
import type { GoalSpec } from "@webspec/core";
import { SANDBOX_SNAPSHOT } from "@webspec/core/demo/sandboxSnapshot";

function computeMode(): "local" | "demo" {
  const explicit = process.env.WEBSPEC_MODE;
  if (explicit === "demo" || explicit === "local") return explicit;
  if (process.env.VERCEL) return "demo";
  return "local";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const goal = (body.goal ?? {}) as GoalSpec;

  const mode = computeMode();
  const profile = "balanced";
  const workspacePath = process.env.WEBSPEC_WORKSPACE_PATH || "demo/sandbox-repo";

  const resp = await propose({
    goal,
    mode,
    profile,
    workspace: mode === "local"
      ? { reader: fsWorkspace(workspacePath) }
      : { reader: mapWorkspace("(embedded demo snapshot)", SANDBOX_SNAPSHOT) },
  });

  return NextResponse.json(resp);
}
