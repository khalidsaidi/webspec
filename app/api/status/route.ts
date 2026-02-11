import { NextResponse } from "next/server";
import { DEFAULT_KERNEL, SUPPORTED_KERNELS } from "@webspec/core";

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

function computeSelectedKernel() {
  const explicit = process.env.WEBSPEC_DEFAULT_KERNEL;
  if (explicit && SUPPORTED_KERNELS.includes(explicit as (typeof SUPPORTED_KERNELS)[number])) {
    return explicit as (typeof SUPPORTED_KERNELS)[number];
  }
  return DEFAULT_KERNEL;
}

export async function GET() {
  const mode = computeMode();
  return NextResponse.json({
    ok: true,
    mode,
    workspaceLabel: workspaceLabel(mode),
    allowWrite: process.env.WEBSPEC_ALLOW_WRITE === "1",
    selectedKernel: computeSelectedKernel(),
    supportedKernels: SUPPORTED_KERNELS,
  });
}
