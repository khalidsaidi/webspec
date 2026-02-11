import { NextResponse } from "next/server";
import { fsWorkspace, mapWorkspace, generatePatch } from "@webspec/core";
import type { Proposal } from "@webspec/core";
import { SANDBOX_SNAPSHOT } from "@webspec/core/demo/sandboxSnapshot";

function computeMode(): "local" | "demo" {
  const explicit = process.env.WEBSPEC_MODE;
  if (explicit === "demo" || explicit === "local") return explicit;
  if (process.env.VERCEL) return "demo";
  return "local";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const proposals = (body.proposals ?? []) as Proposal[];
  const proposalId = String(body.proposalId ?? "");

  const proposal = proposals.find((p) => p.id === proposalId);
  if (!proposal) {
    return NextResponse.json(
      {
        ok: false,
        patch: "",
        verification: {
          ok: false,
          diagnostics: [{ code: "E_NO_PROPOSAL", message: "Proposal not found" }],
        },
      },
      { status: 400 }
    );
  }

  const mode = computeMode();
  const workspacePath = process.env.WEBSPEC_WORKSPACE_PATH || "demo/sandbox-repo";

  const workspaceReader = mode === "local"
    ? fsWorkspace(workspacePath)
    : mapWorkspace("(embedded demo snapshot)", SANDBOX_SNAPSHOT);

  const resp = await generatePatch({
    proposal,
    mode,
    workspaceReader,
  });

  return NextResponse.json(resp);
}
