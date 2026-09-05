import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Brain, CircleCheck, Play, Sparkles, TriangleAlert } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DataNote, PageHeader, SectionTitle, Stat } from "@/components/site/ui-bits";
import {
  ADVISORIES,
  AI_STAGES,
  DRIVER_WEIGHTS,
  MINE_SITES,
  RECOVERY_RADAR,
} from "@/data/mines";

export const Route = createFileRoute("/intelligence")({
  head: () => ({
    meta: [
      { title: "AI Intelligence Workflow — GeoMineSense | LEGION" },
      {
        name: "description",
        content:
          "See how GeoMineSense turns geology, terrain and haulage signals into explainable manganese opportunity scores, driver weights and planner advisories.",
      },
      { property: "og:title", content: "AI Intelligence Workflow — GeoMineSense | LEGION" },
      {
        property: "og:description",
        content:
          "A five-stage, explainable scoring pipeline with driver weights, readiness profiles and ranked advisories.",
      },
    ],
  }),
  component: Intelligence,
});

const SEVERITY = {
  high: { label: "High", cls: "text-destructive", dot: "bg-destructive" },
  medium: { label: "Medium", cls: "text-ore", dot: "bg-ore" },
  low: { label: "Low", cls: "text-ok", dot: "bg-ok" },
} as const;

function Intelligence() {
  const [stage, setStage] = useState(AI_STAGES[0]!.id);
  const [running, setRunning] = useState(false);
  const active = AI_STAGES.find((s) => s.id === stage) ?? AI_STAGES[0]!;

  const ranked = [...MINE_SITES].sort((a, b) => b.aiScore - a.aiScore).slice(0, 8);

  const runPipeline = () => {
    if (running) return;
    setRunning(true);
    toast.info("Scoring run started", { description: "Simulated pass over the bundled dataset." });
    AI_STAGES.forEach((s, i) => {
      setTimeout(() => {
        setStage(s.id);
        if (i === AI_STAGES.length - 1) {
          setRunning(false);
          toast.success("Scoring run complete", {
            description: "17 sites re-ranked, 4 advisories refreshed.",
          });
        }
      }, i * 700);
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="AI intelligence"
        title="Explainable scoring, stage by stage"
        lead="GeoMineSense never hands over a bare number. Each opportunity score carries the pipeline stage, the drivers that moved it and the confidence class of its inputs."
        actions={
          <button
            type="button"
            onClick={runPipeline}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            <Play className="h-4 w-4" /> {running ? "Running…" : "Run scoring pass"}
          </button>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Pipeline stages" value="5" delta="Ingestion through decision support" />
          <Stat label="Features per cell" value="148" delta="250 m spatial resolution" tone="ore" />
          <Stat label="Hold-out agreement" value="0.84" delta="Prototype validation figure" tone="ok" />
          <Stat label="Open advisories" value={String(ADVISORIES.length)} tone="muted" />
        </div>
        <DataNote className="mt-4">
          Model metrics on this page are illustrative prototype figures. No training run, inference
          service or external model is invoked anywhere in this build.
        </DataNote>
      </section>

      {/* Workflow */}
      <section className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="Workflow"
            title="The five-stage scoring pipeline"
            sub="Select a stage to see what enters it, what leaves it and how long the prototype budgets for it."
          />

          <div className="relative">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-border lg:block" />
            <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {AI_STAGES.map((s) => {
                const on = s.id === active.id;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setStage(s.id)}
                      className={`w-full rounded-xl border bg-background p-4 text-left transition-all ${
                        on ? "border-brand shadow-md" : "hover:border-brand/40 hover:shadow-sm"
                      }`}
                    >
                      <span
                        className={`num flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold ${
                          on ? "border-brand bg-brand text-primary-foreground" : "bg-card text-muted-foreground"
                        }`}
                      >
                        {s.step}
                      </span>
                      <p className="mt-3 text-sm font-semibold">{s.title}</p>
                      <p className="num mt-1 text-[11px] text-muted-foreground">{s.latency}</p>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mt-6 grid gap-6 rounded-xl border bg-background p-6 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="flex items-center gap-2 text-brand">
                <Brain className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Stage {active.step}
                </span>
              </div>
              <h3 className="mt-2 text-xl font-semibold">{active.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.detail}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {active.inputs.map((i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    <CircleCheck className="h-3.5 w-3.5 text-ok" /> {i}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">Driver weights at scoring time</p>
              <div className="mt-4 space-y-3">
                {DRIVER_WEIGHTS.map((d) => (
                  <div key={d.driver}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{d.driver}</span>
                      <span className="num font-semibold">{(d.weight * 100).toFixed(0)}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${d.weight * 100 * 3}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ranking + radar */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border bg-card p-5">
            <SectionTitle
              kicker="Ranking"
              title="Top opportunity scores"
              sub="Composite score across grade continuity, logistics, recovery history and environmental load."
            />
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ranked} layout="vertical" margin={{ left: 18, right: 16 }}>
                  <CartesianGrid stroke="var(--grid)" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    stroke="var(--muted-foreground)"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    stroke="var(--muted-foreground)"
                  />
                  <RTooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="aiScore" name="Score" radius={[0, 4, 4, 0]} barSize={16}>
                    {ranked.map((r) => (
                      <Cell
                        key={r.id}
                        fill={r.aiScore >= 80 ? "var(--brand)" : "var(--chart-5)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <SectionTitle
              kicker="Readiness"
              title="Portfolio readiness profile"
              sub="Six axes the model balances before a site is promoted."
            />
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RECOVERY_RADAR} outerRadius="72%">
                  <PolarGrid stroke="var(--grid)" />
                  <PolarAngleAxis
                    dataKey="axis"
                    fontSize={10}
                    stroke="var(--muted-foreground)"
                  />
                  <Radar
                    dataKey="score"
                    name="Readiness"
                    stroke="var(--ore)"
                    fill="var(--ore)"
                    fillOpacity={0.22}
                  />
                  <RTooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      fontSize: 12,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Advisories */}
      <section className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="Decision support"
            title="Advisories awaiting sign-off"
            sub="The pipeline proposes; a human decides. Each card records the site, the reasoning and the action."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {ADVISORIES.map((a) => {
              const sev = SEVERITY[a.severity];
              return (
                <article key={a.id} className="rounded-xl border bg-background p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide ${sev.cls}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} />
                      {sev.label} priority
                    </span>
                    <span className="text-xs text-muted-foreground">{a.site}</span>
                  </div>
                  <h3 className="mt-3 flex items-start gap-2 text-base font-semibold">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-ore" />
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        toast.success("Advisory accepted", {
                          description: `${a.title} moved to the planner queue.`,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Accept <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toast.info("Advisory dismissed", {
                          description: "It will resurface on the next scoring pass.",
                        })
                      }
                      className="inline-flex items-center rounded-md border px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toast.message("Explanation", {
                          description:
                            "Driven mainly by grade continuity (28%) and haulage distance (17%).",
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand-soft"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Why?
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
