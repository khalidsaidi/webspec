function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function tri(a, b, c) {
    return (x) => {
        if (x <= a || x >= c)
            return 0;
        if (x === b)
            return 1;
        if (x < b)
            return (x - a) / (b - a);
        return (c - x) / (c - b);
    };
}
function trap(a, b, c, d) {
    return (x) => {
        if (x <= a || x >= d)
            return 0;
        if (x >= b && x <= c)
            return 1;
        if (x < b)
            return (x - a) / (b - a);
        return (d - x) / (d - c);
    };
}
function centroid(agg, samples = 401) {
    let num = 0;
    let den = 0;
    for (let i = 0; i < samples; i++) {
        const x = i / (samples - 1);
        const mu = agg(x);
        num += x * mu;
        den += mu;
    }
    return den === 0 ? 0 : num / den;
}
export function assessRisk(plan, profile = "balanced") {
    const m = plan.predictedImpact;
    const size = clamp01(m.approxLinesChanged / 400);
    const files = clamp01(m.filesTouched / 25);
    const router = m.routerTouched ? 1 : 0;
    const config = m.configTouched ? 1 : 0;
    const deps = m.depsTouched ? 1 : 0;
    const proof = 0.85;
    const size_small = trap(0, 0, 0.25, 0.45)(size);
    const size_med = tri(0.25, 0.55, 0.85)(size);
    const size_large = trap(0.65, 0.85, 1, 1)(size);
    const files_small = trap(0, 0, 0.15, 0.35)(files);
    const files_large = trap(0.55, 0.75, 1, 1)(files);
    const proof_strong = trap(0.45, 0.65, 1, 1)(proof);
    const R_low = trap(0, 0, 0.18, 0.38);
    const R_medium = tri(0.22, 0.50, 0.78);
    const R_high = tri(0.55, 0.78, 0.95);
    const R_ext = trap(0.85, 0.93, 1, 1);
    const rules = [];
    rules.push({
        name: "Large change / many files",
        fire: Math.max(size_large, files_large),
        out: R_high,
        evidence: `approxLinesChanged=${m.approxLinesChanged}, filesTouched=${m.filesTouched}`,
        suggestion: "Split the feature into smaller steps or reduce scope."
    });
    rules.push({
        name: "Router touched with non-trivial change",
        fire: Math.min(router, Math.max(size_med, size_large)),
        out: R_high,
        evidence: `routerTouched=${m.routerTouched}, approxLinesChanged=${m.approxLinesChanged}`,
        suggestion: "Ensure route wiring proof exists; avoid unrelated router edits."
    });
    rules.push({
        name: "Config/deps touched",
        fire: Math.max(config, deps),
        out: R_ext,
        evidence: `configTouched=${m.configTouched}, depsTouched=${m.depsTouched}`,
        suggestion: "Avoid config/dependency changes unless necessary; isolate them if you must."
    });
    rules.push({
        name: "Small, well-proven change",
        fire: Math.min(size_small, Math.min(files_small, Math.min(proof_strong, 1 - Math.max(config, deps)))),
        out: R_low,
        evidence: `small change, proofStrength≈${proof}`,
        suggestion: "Good — keep changes tight and verified."
    });
    rules.push({
        name: "Moderate change (non-router) with proof",
        fire: Math.min(size_med, Math.min(1 - router, proof_strong)),
        out: R_medium,
        evidence: `routerTouched=${m.routerTouched}, proofStrength≈${proof}`,
        suggestion: "Looks reasonable; keep reviewable and avoid extra files."
    });
    const agg = (x) => {
        let mu = 0;
        for (const r of rules) {
            if (r.fire <= 0)
                continue;
            mu = Math.max(mu, Math.min(r.fire, r.out(x)));
        }
        return mu;
    };
    const score = clamp01(centroid(agg));
    let label = "LOW";
    if (score >= 0.80)
        label = "EXTREME";
    else if (score >= 0.62)
        label = "HIGH";
    else if (score >= 0.40)
        label = "MEDIUM";
    const action = profile === "fast"
        ? (label === "EXTREME" ? "REQUIRE_APPROVAL" : "ALLOW")
        : profile === "balanced"
            ? (label === "HIGH" || label === "EXTREME" ? "REQUIRE_APPROVAL" : "ALLOW")
            : (label === "MEDIUM" ? "REQUIRE_APPROVAL" : label === "LOW" ? "ALLOW" : "BLOCK");
    const reasons = rules
        .filter((r) => r.fire > 0.05)
        .sort((a, b) => b.fire - a.fire)
        .slice(0, 3)
        .map((r) => ({
        title: r.name,
        evidence: r.evidence,
        suggestion: r.suggestion,
        strength: Number(r.fire.toFixed(2)),
    }));
    return { profile, score: Number(score.toFixed(2)), label, action, reasons };
}
//# sourceMappingURL=risk.js.map