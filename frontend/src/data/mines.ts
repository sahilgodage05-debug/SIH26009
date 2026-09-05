/**
 * GeoMineSense — structured reference dataset (PROTOTYPE)
 *
 * TRANSPARENCY: Every record below is illustrative reference data assembled for
 * a design prototype. Values are approximations shaped from publicly known
 * manganese belt geography in India and are NOT survey-grade measurements.
 * Nothing here is live telemetry and nothing is fetched from a server.
 */

export type SiteStatus = "active" | "exploration" | "dormant" | "reclamation";
export type Confidence = "modelled" | "reference" | "indicative";

export interface MineSite {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  status: SiteStatus;
  /** Mn content, % — indicative belt average */
  grade: number;
  /** Million tonnes, indicative resource */
  reserves: number;
  /** Kilotonnes / month, indicative throughput */
  output: number;
  /** GeoMineSense composite opportunity score, 0-100 (model output) */
  aiScore: number;
  depth: number;
  workforce: number;
  confidence: Confidence;
  notes: string;
}

export const MINE_SITES: MineSite[] = [
  {
    id: "mp-balaghat",
    name: "Balaghat Belt",
    district: "Balaghat",
    state: "Madhya Pradesh",
    lat: 21.81,
    lon: 80.19,
    status: "active",
    grade: 44.2,
    reserves: 61.4,
    output: 96,
    aiScore: 91,
    depth: 310,
    workforce: 2140,
    confidence: "reference",
    notes: "Deep underground gondite horizon; highest modelled ferro-grade continuity in the prototype set.",
  },
  {
    id: "mp-chhindwara",
    name: "Chhindwara Ridge",
    district: "Chhindwara",
    state: "Madhya Pradesh",
    lat: 22.06,
    lon: 78.94,
    status: "active",
    grade: 38.6,
    reserves: 27.9,
    output: 54,
    aiScore: 78,
    depth: 160,
    workforce: 980,
    confidence: "reference",
    notes: "Mixed open-cast and shallow underground blocks with moderate silica dilution.",
  },
  {
    id: "mh-nagpur",
    name: "Sausar Group — Nagpur",
    district: "Nagpur",
    state: "Maharashtra",
    lat: 21.15,
    lon: 79.09,
    status: "active",
    grade: 41.5,
    reserves: 43.2,
    output: 88,
    aiScore: 86,
    depth: 240,
    workforce: 1760,
    confidence: "reference",
    notes: "Classic Sausar metamorphic belt; strong rail linkage assumption in logistics model.",
  },
  {
    id: "mh-bhandara",
    name: "Bhandara Corridor",
    district: "Bhandara",
    state: "Maharashtra",
    lat: 21.17,
    lon: 79.65,
    status: "exploration",
    grade: 33.1,
    reserves: 18.6,
    output: 21,
    aiScore: 69,
    confidence: "modelled",
    depth: 90,
    workforce: 320,
    notes: "Prototype anomaly cluster derived from synthetic magnetic-gradient patterning.",
  },
  {
    id: "mh-gondia",
    name: "Gondia Outcrop",
    district: "Gondia",
    state: "Maharashtra",
    lat: 21.46,
    lon: 80.19,
    status: "active",
    grade: 36.4,
    reserves: 22.4,
    output: 47,
    aiScore: 74,
    depth: 120,
    workforce: 690,
    confidence: "reference",
    notes: "Shallow benches, high strip ratio sensitivity in the cost surface.",
  },
  {
    id: "od-keonjhar",
    name: "Keonjhar Plateau",
    district: "Keonjhar",
    state: "Odisha",
    lat: 21.63,
    lon: 85.58,
    status: "active",
    grade: 42.8,
    reserves: 55.1,
    output: 103,
    aiScore: 89,
    depth: 180,
    workforce: 2380,
    confidence: "reference",
    notes: "Iron-manganese association; port proximity dominates the logistics weighting.",
  },
  {
    id: "od-sundargarh",
    name: "Bonai–Sundargarh",
    district: "Sundargarh",
    state: "Odisha",
    lat: 22.12,
    lon: 84.79,
    status: "active",
    grade: 39.7,
    reserves: 34.8,
    output: 71,
    aiScore: 81,
    depth: 150,
    workforce: 1410,
    confidence: "reference",
    notes: "Lateritic capping over ore bodies; moisture correction applied to grade estimate.",
  },
  {
    id: "od-rairakhol",
    name: "Rairakhol Prospect",
    district: "Sambalpur",
    state: "Odisha",
    lat: 21.07,
    lon: 84.32,
    status: "exploration",
    grade: 30.2,
    reserves: 12.1,
    output: 0,
    aiScore: 62,
    depth: 0,
    workforce: 45,
    notes: "Greenfield prototype target; no throughput assumed.",
    confidence: "modelled",
  },
  {
    id: "ka-sandur",
    name: "Sandur Schist Belt",
    district: "Ballari",
    state: "Karnataka",
    lat: 15.09,
    lon: 76.55,
    status: "active",
    grade: 40.9,
    reserves: 38.7,
    output: 82,
    aiScore: 84,
    depth: 130,
    workforce: 1520,
    confidence: "reference",
    notes: "Well characterised schist belt; steady blending feed in the scenario engine.",
  },
  {
    id: "ka-shivamogga",
    name: "Shivamogga Lodes",
    district: "Shivamogga",
    state: "Karnataka",
    lat: 13.93,
    lon: 75.57,
    status: "dormant",
    grade: 31.6,
    reserves: 9.4,
    output: 0,
    aiScore: 48,
    depth: 70,
    workforce: 0,
    confidence: "indicative",
    notes: "Marked dormant in the prototype to exercise the reactivation scenario path.",
  },
  {
    id: "ap-vizianagaram",
    name: "Vizianagaram Field",
    district: "Vizianagaram",
    state: "Andhra Pradesh",
    lat: 18.11,
    lon: 83.4,
    status: "active",
    grade: 35.8,
    reserves: 20.3,
    output: 44,
    aiScore: 73,
    depth: 110,
    workforce: 810,
    confidence: "reference",
    notes: "Khondalite host rocks; short haul to the eastern seaboard.",
  },
  {
    id: "ap-srikakulam",
    name: "Srikakulam Extension",
    district: "Srikakulam",
    state: "Andhra Pradesh",
    lat: 18.3,
    lon: 83.9,
    status: "exploration",
    grade: 28.9,
    reserves: 7.8,
    output: 0,
    aiScore: 56,
    depth: 0,
    workforce: 30,
    confidence: "modelled",
    notes: "Low-grade indicative extension used for cut-off sensitivity demos.",
  },
  {
    id: "jh-singhbhum",
    name: "West Singhbhum",
    district: "West Singhbhum",
    state: "Jharkhand",
    lat: 22.28,
    lon: 85.56,
    status: "active",
    grade: 37.2,
    reserves: 16.9,
    output: 33,
    aiScore: 70,
    depth: 140,
    workforce: 560,
    confidence: "reference",
    notes: "Ore associated with iron formations; blending candidate for Keonjhar feed.",
  },
  {
    id: "rj-banswara",
    name: "Banswara Blocks",
    district: "Banswara",
    state: "Rajasthan",
    lat: 23.55,
    lon: 74.44,
    status: "reclamation",
    grade: 27.4,
    reserves: 4.2,
    output: 6,
    aiScore: 41,
    depth: 60,
    workforce: 130,
    confidence: "indicative",
    notes: "Late-life benches; used to demonstrate closure and rehabilitation tracking.",
  },
  {
    id: "gj-panchmahal",
    name: "Panchmahal Zone",
    district: "Panchmahal",
    state: "Gujarat",
    lat: 22.77,
    lon: 73.61,
    status: "dormant",
    grade: 26.1,
    reserves: 3.6,
    output: 0,
    aiScore: 38,
    depth: 45,
    workforce: 0,
    confidence: "indicative",
    notes: "Marginal grade; excluded from the prototype's priority queue.",
  },
  {
    id: "goa-sanguem",
    name: "Sanguem Laterites",
    district: "South Goa",
    state: "Goa",
    lat: 15.22,
    lon: 74.15,
    status: "reclamation",
    grade: 29.8,
    reserves: 5.1,
    output: 9,
    aiScore: 45,
    depth: 40,
    workforce: 180,
    confidence: "indicative",
    notes: "Coastal laterite profile with strict environmental weighting in the model.",
  },
];

export const STATUS_META: Record<
  SiteStatus,
  { label: string; token: string; dot: string; ring: string }
> = {
  active: { label: "Active", token: "text-ok", dot: "bg-ok", ring: "ring-ok/30" },
  exploration: {
    label: "Exploration",
    token: "text-brand",
    dot: "bg-brand",
    ring: "ring-brand/30",
  },
  dormant: {
    label: "Dormant",
    token: "text-muted-foreground",
    dot: "bg-muted-foreground",
    ring: "ring-border",
  },
  reclamation: { label: "Reclamation", token: "text-ore", dot: "bg-ore", ring: "ring-ore/30" },
};

export const CONFIDENCE_META: Record<Confidence, string> = {
  reference: "Reference figure — belt-level public geography, rounded",
  modelled: "Model output — generated by the prototype scoring engine",
  indicative: "Indicative only — coarse estimate for interaction demos",
};

/** Belt envelopes drawn as translucent regions on the map (illustrative). */
export const BELTS = [
  { id: "central", name: "Central Sausar Belt", lat: 21.5, lon: 79.6, rx: 2.6, ry: 1.5 },
  { id: "eastern", name: "Eastern Iron–Mn Province", lat: 21.8, lon: 85.2, rx: 2.0, ry: 1.7 },
  { id: "southern", name: "Dharwar Schist Belt", lat: 14.6, lon: 76.0, rx: 1.6, ry: 1.9 },
  { id: "coastal", name: "Eastern Ghats Khondalite", lat: 18.2, lon: 83.6, rx: 1.2, ry: 1.0 },
];

export const PRODUCTION_SERIES = [
  { month: "Jan", output: 512, grade: 37.1, target: 520 },
  { month: "Feb", output: 498, grade: 37.6, target: 520 },
  { month: "Mar", output: 541, grade: 38.2, target: 530 },
  { month: "Apr", output: 526, grade: 38.0, target: 530 },
  { month: "May", output: 559, grade: 38.9, target: 540 },
  { month: "Jun", output: 503, grade: 37.4, target: 540 },
  { month: "Jul", output: 468, grade: 36.8, target: 545 },
  { month: "Aug", output: 521, grade: 38.4, target: 545 },
  { month: "Sep", output: 574, grade: 39.1, target: 555 },
  { month: "Oct", output: 596, grade: 39.6, target: 560 },
  { month: "Nov", output: 588, grade: 39.2, target: 565 },
  { month: "Dec", output: 612, grade: 40.1, target: 570 },
];

export const GRADE_DISTRIBUTION = [
  { band: "< 30%", sites: 4, tonnes: 20.5 },
  { band: "30–35%", sites: 3, tonnes: 39.8 },
  { band: "35–40%", sites: 5, tonnes: 121.7 },
  { band: "40–45%", sites: 4, tonnes: 198.7 },
];

export const RECOVERY_RADAR = [
  { axis: "Grade continuity", score: 82 },
  { axis: "Logistics", score: 74 },
  { axis: "Water risk", score: 58 },
  { axis: "Energy load", score: 66 },
  { axis: "Rehab readiness", score: 49 },
  { axis: "Community index", score: 71 },
];

export const AI_STAGES = [
  {
    id: "ingest",
    step: "01",
    title: "Signal ingestion",
    detail:
      "Reference geology, drill logs, terrain rasters and haulage records are normalised into a single feature frame.",
    inputs: ["Geology sheets", "Drill logs", "DEM tiles", "Haulage logs"],
    latency: "≈ 4.2 s",
  },
  {
    id: "features",
    step: "02",
    title: "Feature engineering",
    detail:
      "Spatial windows, gradient statistics and lithology encodings are derived per 250 m cell across each belt envelope.",
    inputs: ["Spatial windows", "Gradient stats", "Lithology encoding"],
    latency: "≈ 11.8 s",
  },
  {
    id: "model",
    step: "03",
    title: "Ensemble scoring",
    detail:
      "A gradient-boosted ensemble plus a spatial smoother produce grade likelihood and an opportunity score with uncertainty bands.",
    inputs: ["GBM ensemble", "Spatial smoother", "Uncertainty bands"],
    latency: "≈ 27.5 s",
  },
  {
    id: "explain",
    step: "04",
    title: "Explanation layer",
    detail:
      "Per-site contribution weights are surfaced so an engineer can see which drivers moved the score, and by how much.",
    inputs: ["Contribution weights", "Counterfactuals", "Confidence tags"],
    latency: "≈ 3.1 s",
  },
  {
    id: "decide",
    step: "05",
    title: "Decision support",
    detail:
      "Ranked actions, blending suggestions and closure flags are written into the planner queue for human sign-off.",
    inputs: ["Ranked actions", "Blend plans", "Closure flags"],
    latency: "≈ 1.6 s",
  },
];

export const DRIVER_WEIGHTS = [
  { driver: "Gondite horizon continuity", weight: 0.28 },
  { driver: "Depth to ore contact", weight: 0.19 },
  { driver: "Rail / port distance", weight: 0.17 },
  { driver: "Historic recovery rate", weight: 0.14 },
  { driver: "Water stress index", weight: 0.12 },
  { driver: "Community & land factor", weight: 0.1 },
];

export const ADVISORIES = [
  {
    id: "a1",
    severity: "high" as const,
    site: "Keonjhar Plateau",
    title: "Blend ratio drift detected",
    body: "Modelled feed grade drops 1.4 points if the Bonai stream is held at current share. Prototype suggests a 62:38 split.",
  },
  {
    id: "a2",
    severity: "medium" as const,
    site: "Bhandara Corridor",
    title: "Anomaly cluster worth a follow-up traverse",
    body: "Three adjacent cells score above 0.71 likelihood with wide uncertainty — a short traverse would collapse the band.",
  },
  {
    id: "a3",
    severity: "low" as const,
    site: "Banswara Blocks",
    title: "Closure milestone approaching",
    body: "Reclamation coverage is modelled at 68%. Schedule the next rehabilitation review within the quarter.",
  },
  {
    id: "a4",
    severity: "medium" as const,
    site: "Shivamogga Lodes",
    title: "Reactivation case is marginal",
    body: "At a 32% cut-off the block only clears breakeven under the optimistic freight scenario.",
  },
];
