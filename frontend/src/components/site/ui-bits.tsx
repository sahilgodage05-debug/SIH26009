import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function PageHeader({
  eyebrow,
  title,
  lead,
  actions,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  actions?: ReactNode;
}) {
  return (
    <div className="rise border-b bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-9 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{lead}</p>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function DataNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-md border border-dashed bg-secondary/60 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
      <span>{children}</span>
    </p>
  );
}

export function ProvenanceTag({ label, hint }: { label: string; hint: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-help items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">{hint}</TooltipContent>
    </Tooltip>
  );
}

export function Stat({
  label,
  value,
  unit,
  delta,
  tone = "brand",
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  tone?: "brand" | "ore" | "ok" | "muted";
}) {
  const bar = {
    brand: "bg-brand",
    ore: "bg-ore",
    ok: "bg-ok",
    muted: "bg-muted-foreground",
  }[tone];
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-4">
      <span className={cn("absolute inset-y-0 left-0 w-[3px]", bar)} />
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="num mt-2 text-2xl font-semibold tracking-tight">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
      </p>
      {delta && <p className="mt-1 text-[11px] text-muted-foreground">{delta}</p>}
    </div>
  );
}

export function SectionTitle({
  kicker,
  title,
  sub,
}: {
  kicker?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-5 max-w-2xl">
      {kicker && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">{kicker}</p>
      )}
      <h2 className="mt-1.5 text-xl font-semibold sm:text-2xl">{title}</h2>
      {sub && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{sub}</p>}
    </div>
  );
}
