import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Filter, RotateCcw, Search, Send, X } from "lucide-react";

import { IndiaMap } from "@/components/IndiaMap";
import { DataNote, PageHeader, ProvenanceTag } from "@/components/site/ui-bits";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  CONFIDENCE_META,
  MINE_SITES,
  STATUS_META,
  type MineSite,
  type SiteStatus,
} from "@/data/mines";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Interactive Mine Map — GeoMineSense | LEGION" },
      {
        name: "description",
        content:
          "Pan, zoom and filter manganese sites across India's mining belts by grade, status and opportunity score in the GeoMineSense map explorer.",
      },
      { property: "og:title", content: "Interactive Mine Map — GeoMineSense | LEGION" },
      {
        property: "og:description",
        content:
          "An interactive India mining map with grade filters, belt envelopes and a per-site intelligence panel.",
      },
    ],
  }),
  component: MapExplorer,
});

const ALL_STATUS: SiteStatus[] = ["active", "exploration", "dormant", "reclamation"];

function MapExplorer() {
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<SiteStatus[]>(ALL_STATUS);
  const [minGrade, setMinGrade] = useState(24);
  const [minScore, setMinScore] = useState(0);
  const [belts, setBelts] = useState(true);
  const [labels, setLabels] = useState(true);
  const [selected, setSelected] = useState<string | null>("od-keonjhar");
  const [panelOpen, setPanelOpen] = useState(false);

  const filtered = useMemo(
    () =>
      MINE_SITES.filter(
        (s) =>
          statuses.includes(s.status) &&
          s.grade >= minGrade &&
          s.aiScore >= minScore &&
          (query.trim() === "" ||
            `${s.name} ${s.district} ${s.state}`.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [statuses, minGrade, minScore, query],
  );

  const site = useMemo(
    () => filtered.find((s) => s.id === selected) ?? null,
    [filtered, selected],
  );

  const resetFilters = () => {
    setQuery("");
    setStatuses(ALL_STATUS);
    setMinGrade(24);
    setMinScore(0);
    setBelts(true);
    setLabels(true);
    toast.info("Filters reset to defaults");
  };

  const toggleStatus = (s: SiteStatus) =>
    setStatuses((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const pick = (id: string) => {
    setSelected(id);
    setPanelOpen(true);
  };

  return (
    <>
      <PageHeader
        eyebrow="Map explorer"
        title="India manganese belt explorer"
        lead="Filter the reference site set, then select any marker to open its intelligence panel. Scroll or use the controls to zoom; drag to pan."
        actions={
          <>
            <button
              type="button"
              onClick={() =>
                toast.success(`Exported ${filtered.length} sites`, {
                  description: "Prototype export — a CSV was composed in-browser only.",
                })
              }
              className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <Download className="h-4 w-4" /> Export selection
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" /> Reset filters
            </button>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[17rem_1fr_20rem]">
          {/* Filters */}
          <aside className="space-y-6 rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Filter className="h-4 w-4 text-brand" /> Filters
            </div>

            <div>
              <Label htmlFor="site-search" className="text-xs text-muted-foreground">
                Search site, district or state
              </Label>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="site-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Balaghat"
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ALL_STATUS.map((s) => {
                  const on = statuses.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleStatus(s)}
                      aria-pressed={on}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        on
                          ? "border-brand/40 bg-brand-soft text-brand"
                          : "text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[s].dot}`} />
                      {STATUS_META[s].label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Minimum Mn grade</span>
                <span className="num font-semibold">{minGrade.toFixed(0)}%</span>
              </div>
              <Slider
                className="mt-3"
                min={24}
                max={45}
                step={1}
                value={[minGrade]}
                onValueChange={(v) => setMinGrade(v[0] ?? 24)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Minimum opportunity score</span>
                <span className="num font-semibold">{minScore}</span>
              </div>
              <Slider
                className="mt-3"
                min={0}
                max={95}
                step={5}
                value={[minScore]}
                onValueChange={(v) => setMinScore(v[0] ?? 0)}
              />
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="belts" className="text-xs font-normal text-muted-foreground">
                  Belt envelopes
                </Label>
                <Switch id="belts" checked={belts} onCheckedChange={setBelts} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="labels" className="text-xs font-normal text-muted-foreground">
                  Map labels
                </Label>
                <Switch id="labels" checked={labels} onCheckedChange={setLabels} />
              </div>
            </div>

            <p className="num rounded-md bg-secondary px-3 py-2 text-xs text-muted-foreground">
              {filtered.length} of {MINE_SITES.length} sites shown
            </p>
          </aside>

          {/* Map */}
          <div>
            <IndiaMap
              sites={filtered}
              selectedId={selected}
              onSelect={pick}
              showBelts={belts}
              showLabels={labels}
              className="h-[420px] sm:h-[560px] lg:h-[640px]"
            />
            <DataNote className="mt-3">
              Simplified outline and belt envelopes drawn for illustration. Site coordinates are
              belt-level approximations from public geography, rounded for the prototype.
            </DataNote>
          </div>

          {/* Info panel */}
          <div className="hidden lg:block">
            <InfoPanel site={site} count={filtered.length} />
          </div>
        </div>

        {/* Site list */}
        <div className="mt-8 overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h2 className="text-sm font-semibold">Filtered sites</h2>
            <ProvenanceTag label="Mixed provenance" hint="Rows combine reference, modelled and indicative values — see each row's tag." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs text-muted-foreground">
                <tr>
                  {["Site", "State", "Status", "Mn %", "Resource (Mt)", "kt/mo", "Score", "Basis"].map(
                    (h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left font-medium">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => pick(s.id)}
                    className={`cursor-pointer border-t transition-colors hover:bg-accent/60 ${
                      s.id === selected ? "bg-brand-soft/60" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-2.5 font-medium">{s.name}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                      {s.state}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[s.status].dot}`} />
                        {STATUS_META[s.status].label}
                      </span>
                    </td>
                    <td className="num px-4 py-2.5">{s.grade.toFixed(1)}</td>
                    <td className="num px-4 py-2.5">{s.reserves.toFixed(1)}</td>
                    <td className="num px-4 py-2.5">{s.output}</td>
                    <td className="num px-4 py-2.5">{s.aiScore}</td>
                    <td className="px-4 py-2.5">
                      <ProvenanceTag label={s.confidence} hint={CONFIDENCE_META[s.confidence]} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No sites match the current filters. Try resetting them.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile / tablet slide-over panel */}
      {panelOpen && site && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-brand-deep/40"
            onClick={() => setPanelOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-2xl border-t bg-background p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Site intelligence</p>
              <button
                type="button"
                aria-label="Close panel"
                onClick={() => setPanelOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <InfoPanel site={site} count={filtered.length} bare />
          </div>
        </div>
      )}
    </>
  );
}

function InfoPanel({
  site,
  count,
  bare = false,
}: {
  site: MineSite | null;
  count: number;
  bare?: boolean;
}) {
  if (!site) {
    return (
      <div className={bare ? "" : "rounded-xl border bg-card p-5"}>
        <p className="text-sm font-semibold">No site selected</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Select one of the {count} visible markers to open its intelligence panel.
        </p>
      </div>
    );
  }
  const meta = STATUS_META[site.status];
  return (
    <div className={bare ? "" : "sticky top-24 rounded-xl border bg-card p-5"}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold leading-tight">{site.name}</h2>
          <p className="text-sm text-muted-foreground">
            {site.district}, {site.state}
          </p>
        </div>
        <ProvenanceTag label={site.confidence} hint={CONFIDENCE_META[site.confidence]} />
      </div>

      <span
        className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${meta.token}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
        {meta.label}
      </span>

      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Opportunity score</span>
          <span className="num text-lg font-semibold">{site.aiScore}/100</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand to-ore transition-all duration-500"
            style={{ width: `${site.aiScore}%` }}
          />
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        {[
          ["Mn grade", `${site.grade.toFixed(1)}%`],
          ["Resource", `${site.reserves.toFixed(1)} Mt`],
          ["Throughput", `${site.output} kt/mo`],
          ["Working depth", site.depth ? `${site.depth} m` : "—"],
          ["Workforce", site.workforce ? site.workforce.toLocaleString("en-IN") : "—"],
          ["Coordinates", `${site.lat.toFixed(2)}, ${site.lon.toFixed(2)}`],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="num mt-0.5 font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 rounded-md bg-secondary/60 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        {site.notes}
      </p>

      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={() =>
            toast.success(`Survey queued for ${site.name}`, {
              description: "Prototype action — the request stays on this device.",
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Send className="h-4 w-4" /> Queue follow-up survey
        </button>
        <button
          type="button"
          onClick={() =>
            toast.success(`Site dossier ready — ${site.name}`, {
              description: "Composed locally from the bundled reference dataset.",
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <Download className="h-4 w-4" /> Download site dossier
        </button>
      </div>
    </div>
  );
}
