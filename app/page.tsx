"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

type Preference = "avoid" | "allow" | "prefer";
type ChangeSize = "tiny" | "small" | "medium" | "large";
type DiagnosticEntry = { code?: string; message: string };
type RiskReason = { title: string; evidence: string; suggestion: string; strength: number };
type Verification = { ok: boolean; diagnostics: DiagnosticEntry[] };

type Proposal = {
  id: string;
  title: string;
  summary: string;
  assumptions: string[];
  compile: { ok: boolean; diagnostics: DiagnosticEntry[]; plan?: unknown };
  risk?: { profile: string; score: number; label: string; action: string; reasons: RiskReason[] };
};

function pct(x: number) {
  return Math.round(Math.max(0, Math.min(1, x)) * 100);
}

export default function Home() {
  const [mode, setMode] = useState<"local" | "demo">("local");
  const [workspaceLabel, setWorkspaceLabel] = useState<string>("(loading)");
  const [goalText, setGoalText] = useState<string>(
    "Add a playground page so I can test UI patterns. Keep it small, no deps, no config changes."
  );
  const [changeSize, setChangeSize] = useState<ChangeSize>("small");
  const [newDeps, setNewDeps] = useState<Preference>("avoid");
  const [configChanges, setConfigChanges] = useState<Preference>("avoid");

  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selected, setSelected] = useState<Proposal | null>(null);

  const [patchLoading, setPatchLoading] = useState(false);
  const [patch, setPatch] = useState<string>("");
  const [verification, setVerification] = useState<Verification | null>(null);

  const modeHint = useMemo(() => {
    if (mode === "demo") return "Demo mode uses an embedded sandbox repo snapshot (safe; no writes).";
    return "Local mode reads a workspace path on your machine (default: demo/sandbox-repo).";
  }, [mode]);

  async function refreshStatus() {
    const res = await fetch("/api/status", { cache: "no-store" });
    const json = await res.json();
    setMode(json.mode);
    setWorkspaceLabel(json.workspaceLabel);
  }

  async function runPropose() {
    setLoading(true);
    setSelected(null);
    setPatch("");
    setVerification(null);
    try {
      const res = await fetch("/api/propose", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          goal: {
            text: goalText,
            constraints: { changeSize, newDependencies: newDeps, configChanges }
          }
        }),
      });
      const json = await res.json();
      setMode(json.mode);
      setWorkspaceLabel(json.workspaceLabel);
      setProposals(json.proposals ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function runGenerate(p: Proposal) {
    setPatchLoading(true);
    setPatch("");
    setVerification(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ proposalId: p.id, proposals }),
      });
      const json = await res.json();
      setPatch(json.patch ?? "");
      setVerification(json.verification ?? null);
    } finally {
      setPatchLoading(false);
    }
  }

  function downloadPatch() {
    const blob = new Blob([patch], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "webspec.patch";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold">WebSpec Studio</h1>
          <Badge variant="secondary">{mode.toUpperCase()}</Badge>
        </div>
        <p className="text-sm opacity-80">
          Goal to proposals to verified patch. This is a drift-resistant workflow for LLM agents in web dev.
        </p>
        <div className="text-xs opacity-70">
          Workspace: <span className="font-mono">{workspaceLabel}</span>
        </div>
        <div className="text-xs opacity-70">{modeHint}</div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={refreshStatus}>Refresh status</Button>
        </div>
      </header>

      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Describe what you want (no routes/components required)</div>
          <Textarea value={goalText} onChange={(e) => setGoalText(e.target.value)} rows={5} />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Card className="p-3 space-y-2">
            <div className="text-xs font-semibold uppercase opacity-70">Change size</div>
            <div className="flex flex-wrap gap-2">
              {(["tiny", "small", "medium", "large"] as const).map((v) => (
                <Button key={v} variant={changeSize === v ? "default" : "secondary"} size="sm" onClick={() => setChangeSize(v)}>{v}</Button>
              ))}
            </div>
          </Card>
          <Card className="p-3 space-y-2">
            <div className="text-xs font-semibold uppercase opacity-70">New dependencies</div>
            <div className="flex flex-wrap gap-2">
              {(["avoid", "allow", "prefer"] as const).map((v) => (
                <Button key={v} variant={newDeps === v ? "default" : "secondary"} size="sm" onClick={() => setNewDeps(v)}>{v}</Button>
              ))}
            </div>
          </Card>
          <Card className="p-3 space-y-2">
            <div className="text-xs font-semibold uppercase opacity-70">Config changes</div>
            <div className="flex flex-wrap gap-2">
              {(["avoid", "allow", "prefer"] as const).map((v) => (
                <Button key={v} variant={configChanges === v ? "default" : "secondary"} size="sm" onClick={() => setConfigChanges(v)}>{v}</Button>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button onClick={runPropose} disabled={loading}>
            {loading ? "Proposing..." : "Propose options"}
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="proposals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="patch">Patch</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-4">
          {proposals.length === 0 ? (
            <Card className="p-4 text-sm opacity-70">No proposals yet. Click Propose options.</Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {proposals.map((p) => (
                <Card key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-lg font-semibold">{p.title}</div>
                      <div className="text-sm opacity-80">{p.summary}</div>
                    </div>
                    <Badge variant={p.compile.ok ? "default" : "destructive"}>
                      {p.compile.ok ? "COMPILES" : "BLOCKED"}
                    </Badge>
                  </div>

                  {p.risk && (
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Drift risk</div>
                        <Badge variant="secondary">{p.risk.label} ({pct(p.risk.score)}%)</Badge>
                      </div>
                      <div className="mt-2 space-y-2 text-xs">
                        {p.risk.reasons?.slice(0, 3).map((r, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="font-semibold">{r.title}</div>
                            <div className="opacity-80">Evidence: {r.evidence}</div>
                            <div className="opacity-80">Suggestion: {r.suggestion}</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {p.assumptions?.length > 0 && (
                    <div className="text-xs opacity-80">
                      <div className="font-semibold">Assumptions</div>
                      <ul className="ml-5 list-disc">
                        {p.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                  )}

                  {p.compile.diagnostics?.length > 0 && (
                    <div className="text-xs">
                      <div className="font-semibold">Diagnostics</div>
                      <ul className="ml-5 list-disc">
                        {p.compile.diagnostics.map((d, i) => (
                          <li key={i}>
                            <span className="font-mono">{d.code}</span>: {d.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => { setSelected(p); void runGenerate(p); }}
                      disabled={!p.compile.ok || patchLoading}
                    >
                      {patchLoading && selected?.id === p.id ? "Generating..." : "Generate patch"}
                    </Button>
                    <Button variant="secondary" onClick={() => setSelected(p)}>
                      Select
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="patch" className="space-y-4">
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Patch output</div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={downloadPatch} disabled={!patch}>Download patch</Button>
              </div>
            </div>

            {!patch ? (
              <div className="text-sm opacity-70">No patch generated yet.</div>
            ) : (
              <ScrollArea className="h-[420px] rounded-md border">
                <pre className="p-3 text-xs font-mono whitespace-pre-wrap">{patch}</pre>
              </ScrollArea>
            )}
          </Card>

          {verification && (
            <Card className="p-4 space-y-2">
              <div className="text-sm font-semibold">Verification</div>
              <Badge variant={verification.ok ? "default" : "destructive"}>
                {verification.ok ? "PASS" : "FAIL"}
              </Badge>
              {verification.diagnostics?.length > 0 && (
                <ul className="ml-5 list-disc text-xs">
                  {verification.diagnostics.map((d, i) => (
                    <li key={i}><span className="font-mono">{d.code}</span>: {d.message}</li>
                  ))}
                </ul>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card className="p-4 space-y-3 text-sm">
            <div className="font-semibold">What is WebSpec?</div>
            <p className="opacity-80">
              WebSpec is a web-dev-scoped compiler plus verifier layer that helps LLM agents avoid logic drift.
              You describe a goal, WebSpec proposes a few implementation options, and only options that compile to a bounded plan are shown.
              Then WebSpec generates a patch and verifies invariants before you apply anything.
            </p>
            <ul className="ml-5 list-disc space-y-1 opacity-80">
              <li><strong>Local mode</strong>: points at a workspace path on your machine.</li>
              <li><strong>Vercel demo mode</strong>: uses an embedded demo repo snapshot (no disk writes).</li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
