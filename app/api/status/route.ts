import { NextResponse } from "next/server";

function computeMode(): "local" | "demo" {
  const explicit = process.env.WEBSPEC_MODE;
  if (explicit === "demo" || explicit === "local") return explicit;
  if (process.env.VERCEL) return "demo";
  return "local";
}

function workspaceLabel(mode: "local" | "demo") {
  if (mode === "demo") return "(embedded demo snapshot)";
  return process.env.WEBSPEC_WORKSPACE_PATH || "demo/sandbox-repo";
}

export async function GET() {
  const mode = computeMode();
  return NextResponse.json({
    ok: true,
    mode,
    workspaceLabel: workspaceLabel(mode),
    allowWrite: process.env.WEBSPEC_ALLOW_WRITE === "1",
  });
}
