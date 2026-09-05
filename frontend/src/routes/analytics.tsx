import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, FileText, Table2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { DataNote, PageHeader, SectionTitle, Stat } from "@/components/site/ui-bits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GRADE_DISTRIBUTION, MINE_SITES, PRODUCTION_SERIES, STATUS_META } from "@/data/mines";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Portfolio Analytics — GeoMineSense | LEGION" },
      {
        name: "description",
        content:
          "Throughput trends, grade bands, state-level distribution and grade-versus-score positioning across the GeoMineSense manganese reference portfolio.",
      },
      { property: "og:title", content: "Portfolio Analytics — GeoMineSense | LEGION" },
      {
        property: "og:description",
        content:
          "Charted throughput, grade distribution and readiness analytics for India's manganese mining belts.",
      },
    ],
  }),
  component: Analytics,
});

const PIE_COLORS = ["var(--brand)", "var(--ore)", "var(--ok)", "var(--chart-4)", "var(--chart-5)", "var(--muted-foreground)"];

function Analytics() {
  const [tab, setTab] = useState("throughput");

  const byState = useMemo(() => {
    const map = new Map<string, number>();
    MINE_SITES.forEach((s) => map.set(s.state, (map.get(s.state) ?? 0) + s.reserves));
    return [...map.entries()]
      .map(([state, reserves]) => ({ state, reserves: Number(reserves.toFixed(1)) }))
      .sort((a, b) => b.reserves - a.reserves);
  }, []);

  const byStatus = useMemo(() => {
    const map = new Map<string, number>();
    MINE_SITES.forEach((s) => map.set(s.status, (map.get(s.status) ?? 0) + 1));
    return [...map.entries()].map(([k, v]) => ({
      name: STATUS_META[k as keyof typeof STATUS_META].label,
      value: v,
    }));
  }, []);

  const scatter = MINE_SITES.map((s) => ({
    x: s.grade,
    y: s.aiScore,
    z: s.reserves,
    name: s.name,
  }));

  const totals = useMemo(() => {
    const output = PRODUCTION_SERIES.reduce((a, s) => a + s.output, 0);
    const target = PRODUCTION_SERIES.reduce((a, s) => a + s.target, 0);
    return { output, target, hit: (output / target) * 100 };
  }, []);

  const tooltipStyle = {
    borderRadius: 8,
    border: "1px solid var(--border)",
    fontSize: 12,
  } as const;

  return (
    <>
      <PageHeader
        eyebrow="Analytics"
        title="Portfolio analytics & reporting"
        lead="Four views over the same reference dataset: throughput against plan, grade banding, geographic concentration and grade-versus-score positioning."
        actions={
          <>
            <button
              type="button"
              onClick={() =>
                toast.success("CSV composed", {
                  description: "17 site rows and 12 monthly records, assembled in-browser.",
                })
              }
              className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <Table2 className="h-4 w-4" /> Export CSV
            </button>
            <button
              type="button"
              onClick={() =>
                toast.success("Report generated", {
                  description: "Quarterly prototype report — nothing left this device.",
                })
              }
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <FileText className="h-4 w-4" /> Generate report
            </button>
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Annual throughput"
            value={totals.output.toLocaleString("en-IN")}
            unit="kt"
            delta="Sum of monthly reference series"
          />
          <Stat
            label="Plan attainment"
            value={`${totals.hit.toFixed(1)}%`}
            delta="Against the prototype plan curve"
            tone="ok"
          />
          <Stat
            label="Highest-grade band"
            value="40–45%"
            delta="198.7 Mt indicative resource"
            tone="ore"
          />
          <Stat label="States represented" value={String(byState.length)} tone="muted" />
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-8">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-secondary p-1">
            <TabsTrigger value="throughput">Throughput</TabsTrigger>
            <TabsTrigger value="grade">Grade bands</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="positioning">Positioning</TabsTrigger>
          </TabsList>

          <TabsContent value="throughput" className="mt-5">
            <ChartCard
              title="Monthly output and feed grade"
              sub="Output in kilotonnes on the left axis, average feed grade on the right."
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PRODUCTION_SERIES} margin={{ left: -14, right: 6, top: 8 }}>
                  <CartesianGrid stroke="var(--grid)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                  <YAxis yAxisId="l" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                  <YAxis
                    yAxisId="r"
                    orientation="right"
                    domain={[34, 42]}
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    stroke="var(--muted-foreground)"
                  />
                  <RTooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    yAxisId="l"
                    type="monotone"
                    dataKey="output"
                    name="Output (kt)"
                    stroke="var(--brand)"
                    strokeWidth={2.2}
                    dot={false}
                  />
                  <Line
                    yAxisId="l"
                    type="monotone"
                    dataKey="target"
                    name="Plan (kt)"
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                    strokeWidth={1.4}
                    dot={false}
                  />
                  <Line
                    yAxisId="r"
                    type="monotone"
                    dataKey="grade"
                    name="Feed grade (%)"
                    stroke="var(--ore)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </TabsContent>

          <TabsContent value="grade" className="mt-5">
            <ChartCard
              title="Resource by Mn grade band"
              sub="Indicative tonnage and site count per grade band."
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={GRADE_DISTRIBUTION} margin={{ left: -14, right: 6, top: 8 }}>
                  <CartesianGrid stroke="var(--grid)" vertical={false} />
                  <XAxis dataKey="band" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                  <RTooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="tonnes" name="Resource (Mt)" fill="var(--brand)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sites" name="Sites" fill="var(--ore)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </TabsContent>

          <TabsContent value="geography" className="mt-5">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <ChartCard
                title="Indicative resource by state"
                sub="Aggregated across the reference site set."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byState} layout="vertical" margin={{ left: 34, right: 16 }}>
                    <CartesianGrid stroke="var(--grid)" horizontal={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                    <YAxis
                      type="category"
                      dataKey="state"
                      width={120}
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      stroke="var(--muted-foreground)"
                    />
                    <RTooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="reserves" name="Resource (Mt)" fill="var(--brand)" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Sites by status" sub="Composition of the tracked portfolio.">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byStatus}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="46%"
                      outerRadius="76%"
                      paddingAngle={2}
                    >
                      {byStatus.map((entry, i) => (
                        <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RTooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </TabsContent>

          <TabsContent value="positioning" className="mt-5">
            <ChartCard
              title="Grade versus opportunity score"
              sub="Bubble size reflects indicative resource. Upper-right sites carry both grade and readiness."
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: -12, right: 12, top: 12, bottom: 6 }}>
                  <CartesianGrid stroke="var(--grid)" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Mn grade (%)"
                    domain={[24, 46]}
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    stroke="var(--muted-foreground)"
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Score"
                    domain={[30, 100]}
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    stroke="var(--muted-foreground)"
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 420]} name="Resource (Mt)" />
                  <RTooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={scatter} name="Sites" fill="var(--brand)" fillOpacity={0.55} />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>
          </TabsContent>
        </Tabs>

        <DataNote className="mt-6">
          Series and aggregates are derived entirely from the bundled reference dataset. Plan curves
          and feed grades are illustrative and should not be read as reported production.
        </DataNote>
      </section>

      <section className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="Reporting"
            title="Report packs"
            sub="Each pack assembles the relevant charts and tables from this page."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Monthly operations pack",
                body: "Throughput, plan attainment and feed grade with per-site commentary.",
              },
              {
                title: "Exploration prospect pack",
                body: "Ranked anomaly clusters, uncertainty bands and suggested traverses.",
              },
              {
                title: "Closure & rehabilitation pack",
                body: "Reclamation coverage, milestone dates and community indices.",
              },
            ].map((p) => (
              <article key={p.title} className="rounded-xl border bg-background p-5">
                <h3 className="text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <button
                  type="button"
                  onClick={() =>
                    toast.success(`${p.title} ready`, {
                      description: "Prototype pack composed locally.",
                    })
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  <Download className="h-4 w-4" /> Build pack
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ChartCard({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      <div className="mt-4 h-[340px]">{children}</div>
    </div>
  );
}
