import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, Crosshair } from "lucide-react";
import { BELTS, type MineSite } from "@/data/mines";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Simplified India outline (lat/lon vertices, equirectangular)        */
/* Illustrative cartography for a prototype — not a survey boundary.  */
/* ------------------------------------------------------------------ */

const OUTLINE: [number, number][] = [
  [34.6, 74.0],
  [35.5, 76.5],
  [34.1, 78.9],
  [32.6, 79.2],
  [31.0, 81.0],
  [30.2, 81.0],
  [28.9, 80.1],
  [28.2, 81.4],
  [27.4, 83.9],
  [26.4, 86.0],
  [26.6, 88.1],
  [27.9, 88.9],
  [27.2, 89.1],
  [27.3, 92.1],
  [29.0, 94.5],
  [28.2, 96.5],
  [27.8, 97.4],
  [26.6, 96.2],
  [25.5, 95.1],
  [24.0, 94.2],
  [23.0, 93.4],
  [22.0, 92.6],
  [23.6, 91.2],
  [24.1, 92.3],
  [25.2, 92.1],
  [25.2, 89.8],
  [26.5, 89.7],
  [26.0, 88.2],
  [24.5, 88.0],
  [22.5, 88.2],
  [21.6, 87.0],
  [20.3, 86.7],
  [19.0, 84.8],
  [17.7, 83.3],
  [16.3, 81.7],
  [15.0, 80.1],
  [13.1, 80.3],
  [11.4, 79.8],
  [10.3, 79.9],
  [9.3, 79.2],
  [8.9, 78.2],
  [8.1, 77.6],
  [8.9, 76.6],
  [10.8, 75.9],
  [12.9, 74.8],
  [15.0, 74.0],
  [17.0, 73.3],
  [19.0, 72.8],
  [20.7, 72.9],
  [21.7, 72.6],
  [22.3, 72.9],
  [21.6, 71.5],
  [20.9, 70.4],
  [22.3, 68.9],
  [23.0, 70.0],
  [23.9, 68.2],
  [24.3, 68.7],
  [25.4, 70.7],
  [27.7, 71.0],
  [28.0, 72.9],
  [29.5, 73.4],
  [30.4, 74.5],
  [32.3, 74.7],
  [33.3, 74.0],
];

/** Interior reference lines (rivers / belt spines) purely for visual depth. */
const SPINES: [number, number][][] = [
  [
    [25.4, 81.9],
    [25.6, 84.0],
    [25.2, 86.5],
    [23.5, 88.0],
    [22.3, 88.2],
  ],
  [
    [21.5, 73.5],
    [21.2, 76.5],
    [21.4, 79.3],
    [21.0, 81.8],
    [20.3, 84.6],
    [19.0, 84.8],
  ],
  [
    [17.6, 75.9],
    [16.5, 78.4],
    [16.3, 81.7],
  ],
];

const LON0 = 67.4;
const LAT0 = 37.6;
const K = 10;
const KX = K * 0.93;
export const MAP_W = (97.8 - LON0) * KX;
export const MAP_H = (LAT0 - 7.4) * K;

export function project(lat: number, lon: number) {
  return { x: (lon - LON0) * KX, y: (LAT0 - lat) * K };
}

function toPath(points: [number, number][], close: boolean) {
  const d = points
    .map(([lat, lon], i) => {
      const p = project(lat, lon);
      return `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    })
    .join(" ");
  return close ? `${d} Z` : d;
}

const INDIA_D = toPath(OUTLINE, true);

function gradeColor(grade: number) {
  if (grade >= 40) return "var(--ore)";
  if (grade >= 35) return "var(--brand)";
  if (grade >= 30) return "var(--chart-5)";
  return "var(--muted-foreground)";
}

interface Props {
  sites: MineSite[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  showBelts?: boolean;
  showLabels?: boolean;
  className?: string;
  compact?: boolean;
}

const MIN_Z = 1;
const MAX_Z = 6;

export function IndiaMap({
  sites,
  selectedId,
  onSelect,
  showBelts = true,
  showLabels = true,
  className,
  compact = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState<MineSite | null>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const clampPan = useCallback((p: { x: number; y: number }, z: number) => {
    const lim = { x: (MAP_W * (z - 1)) / 2, y: (MAP_H * (z - 1)) / 2 };
    return {
      x: Math.max(-lim.x, Math.min(lim.x, p.x)),
      y: Math.max(-lim.y, Math.min(lim.y, p.y)),
    };
  }, []);

  const zoomAt = useCallback(
    (next: number, cx?: number, cy?: number) => {
      setZoom((z) => {
        const nz = Math.max(MIN_Z, Math.min(MAX_Z, next));
        setPan((p) => {
          const ax = cx ?? 0;
          const ay = cy ?? 0;
          const k = nz / z;
          return clampPan({ x: ax - (ax - p.x) * k, y: ay - (ay - p.y) * k }, nz);
        });
        return nz;
      });
    },
    [clampPan],
  );

  const zoomAtRef = useRef(zoomAt);
  zoomAtRef.current = zoomAt;
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const rect = el.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width - 0.5) * MAP_W;
      const sy = ((e.clientY - rect.top) / rect.height - 0.5) * MAP_H;
      zoomAtRef.current(zoomRef.current * Math.exp(-dy * 0.0015), sx, sy);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const reset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setHover(null);
  };

  const focusSelected = () => {
    const s = sites.find((x) => x.id === selectedId);
    if (!s) return;
    const p = project(s.lat, s.lon);
    const z = 3.2;
    setZoom(z);
    setPan(clampPan({ x: (MAP_W / 2 - p.x) * z, y: (MAP_H / 2 - p.y) * z }, z));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sx = ((e.clientX - d.x) / rect.width) * MAP_W;
    const sy = ((e.clientY - d.y) / rect.height) * MAP_H;
    setPan(clampPan({ x: d.px + sx, y: d.py + sy }, zoom));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const markerScale = 1 / Math.sqrt(zoom);
  const belts = useMemo(() => BELTS.map((b) => ({ ...b, p: project(b.lat, b.lon) })), []);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={wrapRef}
        className="surface-grid relative h-full w-full touch-none overflow-hidden rounded-xl border bg-card"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ cursor: drag.current ? "grabbing" : "grab" }}
      >
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="h-full w-full select-none"
          role="img"
          aria-label="Interactive map of manganese mining sites across India"
        >
          <defs>
            <linearGradient id="gms-land" x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0%" stopColor="var(--brand-soft)" />
              <stop offset="100%" stopColor="var(--surface)" />
            </linearGradient>
            <filter id="gms-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="1.6"
                stdDeviation="2.2"
                floodColor="var(--brand-deep)"
                floodOpacity="0.18"
              />
            </filter>
          </defs>

          <g
            transform={`translate(${MAP_W / 2 + pan.x} ${MAP_H / 2 + pan.y}) scale(${zoom}) translate(${-MAP_W / 2} ${-MAP_H / 2})`}
          >
            <path
              d={INDIA_D}
              fill="url(#gms-land)"
              stroke="var(--brand-deep)"
              strokeWidth={0.9 * markerScale}
              strokeLinejoin="round"
              filter="url(#gms-shadow)"
            />

            {SPINES.map((s, i) => (
              <path
                key={i}
                d={toPath(s, false)}
                fill="none"
                stroke="var(--brand)"
                strokeOpacity={0.22}
                strokeWidth={0.7 * markerScale}
              />
            ))}

            {showBelts &&
              belts.map((b) => (
                <g key={b.id}>
                  <ellipse
                    cx={b.p.x}
                    cy={b.p.y}
                    rx={b.rx * KX}
                    ry={b.ry * K}
                    fill="var(--ore)"
                    fillOpacity={0.1}
                    stroke="var(--ore)"
                    strokeOpacity={0.35}
                    strokeDasharray={`${2.4 * markerScale} ${2 * markerScale}`}
                    strokeWidth={0.6 * markerScale}
                  />
                  {showLabels && zoom > 1.6 && (
                    <text
                      x={b.p.x}
                      y={b.p.y - b.ry * K - 2.5 * markerScale}
                      textAnchor="middle"
                      fontSize={4.4 * markerScale}
                      fill="var(--ore)"
                      opacity={0.8}
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {b.name}
                    </text>
                  )}
                </g>
              ))}

            {sites.map((s) => {
              const p = project(s.lat, s.lon);
              const active = s.id === selectedId;
              const r = (active ? 3.4 : 2.4) * markerScale;
              return (
                <g
                  key={s.id}
                  transform={`translate(${p.x} ${p.y})`}
                  className="cursor-pointer"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onSelect(s.id)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${s.name}, ${s.state}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect(s.id);
                  }}
                >
                  {s.status === "active" && (
                    <circle
                      r={r}
                      fill={gradeColor(s.grade)}
                      className="pulse-ring"
                      style={{ transformOrigin: "center" }}
                    />
                  )}
                  <circle r={r * 2.2} fill="transparent" />
                  <circle
                    r={r}
                    fill={gradeColor(s.grade)}
                    stroke="white"
                    strokeWidth={0.8 * markerScale}
                  />
                  {active && (
                    <circle
                      r={r * 2.1}
                      fill="none"
                      stroke="var(--brand-deep)"
                      strokeWidth={0.7 * markerScale}
                      strokeDasharray={`${1.6 * markerScale} ${1.4 * markerScale}`}
                    />
                  )}
                  {showLabels && (zoom > 2 || active) && (
                    <text
                      x={r * 2.4}
                      y={r * 0.8}
                      fontSize={4.2 * markerScale}
                      fill="var(--foreground)"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {s.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Controls */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          <MapBtn label="Zoom in" onClick={() => zoomAt(zoom * 1.5)}>
            <Plus className="h-4 w-4" />
          </MapBtn>
          <MapBtn label="Zoom out" onClick={() => zoomAt(zoom / 1.5)}>
            <Minus className="h-4 w-4" />
          </MapBtn>
          <MapBtn label="Focus selected site" onClick={focusSelected} disabled={!selectedId}>
            <Crosshair className="h-4 w-4" />
          </MapBtn>
          <MapBtn label="Reset view" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
          </MapBtn>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border bg-card/90 px-3 py-2 text-[11px] text-muted-foreground backdrop-blur">
          <span className="font-medium text-foreground">Mn grade</span>
          <LegendDot color="var(--ore)" label="40%+" />
          <LegendDot color="var(--brand)" label="35–40%" />
          <LegendDot color="var(--chart-5)" label="30–35%" />
          <LegendDot color="var(--muted-foreground)" label="&lt; 30%" />
        </div>

        {!compact && (
          <div className="num pointer-events-none absolute bottom-3 right-3 rounded-md border bg-card/90 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
            {zoom.toFixed(1)}×
          </div>
        )}

        {hover && (
          <div className="pointer-events-none absolute left-3 top-3 max-w-[15rem] rounded-lg border bg-card/95 px-3 py-2 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold">{hover.name}</p>
            <p className="text-xs text-muted-foreground">
              {hover.district}, {hover.state}
            </p>
            <p className="num mt-1 text-xs">
              {hover.grade.toFixed(1)}% Mn · score {hover.aiScore}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MapBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </span>
  );
}
