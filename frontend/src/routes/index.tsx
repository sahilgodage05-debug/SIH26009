import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Cpu,
  Download,
  Layers,
  LineChart as LineChartIcon,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { IndiaMap } from "@/components/IndiaMap";
import { DataNote, SectionTitle, Stat } from "@/components/site/ui-bits";
import { MINE_SITES, PRODUCTION_SERIES, STATUS_META, ADVISORIES } from "@/data/mines";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GeoMineSense — AI Manganese Mine Intelligence | LEGION" },
      {
        name: "description",
        content:
          "GeoMineSense by LEGION turns geology, production and logistics signals into ranked, explainable decisions across India's manganese mining belts.",
      },
      { property: "og:title", content: "GeoMineSense — AI Manganese Mine Intelligence | LEGION" },
      {
        property: "og:description",
        content:
          "Explore an interactive India mining map, AI opportunity scoring and decision-ready analytics for manganese operations.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const [selected, setSelected] = useState<string | null>("mp-balaghat");
  const site = useMemo(() => MINE_SITES.find((s) => s.id === selected) ?? null, [selected]);

  const totals = useMemo(() => {
    const active = MINE_SITES.filter((s) => s.status === "active");
    const reserves = MINE_SITES.reduce((a, s) => a + s.reserves, 0);
    const output = MINE_SITES.reduce((a, s) => a + s.output, 0);
    const grade = active.reduce((a, s) => a + s.grade, 0) / active.length;
    return { active: active.length, reserves, output, grade };
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="surface-grid relative overflow-hidden border-b bg-card">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-brand-soft blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-ore-soft blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:px-8 lg:py-20">
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              <Sparkles className="h-3.5 w-3.5" /> LEGION Platform
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              Manganese mine intelligence,
              <span className="text-brand"> made decision-ready.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              GeoMineSense fuses belt geology, drill records, terrain and haulage signals into an
              explainable opportunity score — so planners can see where the next tonne of ore is
              worth chasing, and why.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/map"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Explore the mine map <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/intelligence"
                className="inline-flex items-center gap-2 rounded-md border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <Cpu className="h-4 w-4" /> See the AI workflow
              </Link>
              <button
                type="button"
                onClick={() =>
                  toast.success("Executive brief prepared", {
                    description: "A 6-page prototype brief was generated locally from sample data.",
                  })
                }
                className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Download className="h-4 w-4" /> Download brief
              </button>
            </div>
            <dl className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { k: "Belts tracked", v: "4" },
                { k: "Sites in set", v: String(MINE_SITES.length) },
                { k: "Avg active grade", v: `${totals.grade.toFixed(1)}%` },
                { k: "Indicative resource", v: `${totals.reserves.toFixed(0)} Mt` },
              ].map((s) => (
                <div key={s.k}>
                  <dd className="num text-2xl font-semibold">{s.v}</dd>
                  <dt className="mt-1 text-xs text-muted-foreground">{s.k}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="rise">
            <IndiaMap
              sites={MINE_SITES}
              selectedId={selected}
              onSelect={setSelected}
              className="h-[380px] sm:h-[460px] lg:h-[520px]"
              compact
            />
            <DataNote className="mt-3">
              Illustrative cartography and reference site geography — a prototype visual, not a
              survey-grade boundary or live feed.
            </DataNote>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionTitle
          kicker="Operating snapshot"
          title="One surface for grade, throughput and risk"
          sub="Every tile below is computed in-browser from the bundled reference dataset, so the numbers stay consistent while you explore."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Active sites"
            value={String(totals.active)}
            delta={`of ${MINE_SITES.length} tracked in the reference set`}
            tone="ok"
          />
          <Stat
            label="Modelled throughput"
            value={totals.output.toFixed(0)}
            unit="kt / mo"
            delta="Sum of indicative site rates"
            tone="brand"
          />
          <Stat
            label="Average Mn grade"
            value={`${totals.grade.toFixed(1)}%`}
            delta="Active sites, belt-level averages"
            tone="ore"
          />
          <Stat
            label="Priority advisories"
            value={String(ADVISORIES.length)}
            delta="Awaiting planner sign-off"
            tone="muted"
          />
        </div>
      </section>

      {/* Trend + selected site */}
      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
          <div className="rounded-xl border bg-background p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold">Throughput vs. plan</h3>
                <p className="text-xs text-muted-foreground">
                  Aggregate kilotonnes per month against the prototype plan curve.
                </p>
              </div>
              <LineChartIcon className="h-4 w-4 shrink-0 text-brand" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PRODUCTION_SERIES} margin={{ left: -18, right: 6, top: 6 }}>
                  <defs>
                    <linearGradient id="ovOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--brand)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--grid)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    stroke="var(--muted-foreground)"
                  />
                  <YAxis
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
                  <Area
                    type="monotone"
                    dataKey="output"
                    name="Output (kt)"
                    stroke="var(--brand)"
                    strokeWidth={2}
                    fill="url(#ovOut)"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    name="Plan (kt)"
                    stroke="var(--ore)"
                    strokeDasharray="4 4"
                    strokeWidth={1.6}
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border bg-background p-5">
            <h3 className="text-base font-semibold">Selected site</h3>
            {site ? (
              <div className="mt-3">
                <p className="font-display text-lg font-semibold">{site.name}</p>
                <p className="text-sm text-muted-foreground">
                  {site.district}, {site.state}
                </p>
                <span
                  className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_META[site.status].token}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[site.status].dot}`} />
                  {STATUS_META[site.status].label}
                </span>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  {[
                    ["Mn grade", `${site.grade.toFixed(1)}%`],
                    ["Resource", `${site.reserves.toFixed(1)} Mt`],
                    ["Throughput", `${site.output} kt/mo`],
                    ["Opportunity", `${site.aiScore}/100`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-muted-foreground">{k}</dt>
                      <dd className="num mt-0.5 text-base font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{site.notes}</p>
                <Link
                  to="/map"
                  className="mt-5 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  <MapPinned className="h-4 w-4" /> Open in map explorer
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Pick a marker on the map to inspect a site.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionTitle
          kicker="Capabilities"
          title="Built around how mine planners actually decide"
          sub="Four working surfaces in this prototype, each traceable back to the inputs that produced it."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: MapPinned,
              title: "Spatial explorer",
              body: "Pan, zoom and filter belt-level sites with grade, status and score encodings on one map.",
              to: "/map" as const,
            },
            {
              icon: Cpu,
              title: "Explainable scoring",
              body: "Every opportunity score comes with the driver weights that produced it.",
              to: "/intelligence" as const,
            },
            {
              icon: LineChartIcon,
              title: "Operational analytics",
              body: "Throughput, grade bands and readiness profiles across the whole portfolio.",
              to: "/analytics" as const,
            },
            {
              icon: ShieldCheck,
              title: "Labelled provenance",
              body: "Reference, modelled and indicative values are tagged wherever they appear.",
              to: "/about" as const,
            },
          ].map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-soft text-brand">
                <c.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-brand-deep">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ore">LEGION</p>
            <h2 className="mt-2 text-2xl font-semibold text-primary-foreground sm:text-3xl">
              Take the prototype for a walk through your own belt
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
              Swap the bundled reference dataset for your block registry and the same surfaces —
              map, scoring, analytics — carry straight over.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                toast.success("Walkthrough request noted", {
                  description: "Prototype action — nothing was sent anywhere.",
                })
              }
              className="inline-flex items-center gap-2 rounded-md bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <Layers className="h-4 w-4" /> Request a walkthrough
            </button>
            <Link
              to="/analytics"
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/25 px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              View analytics
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
