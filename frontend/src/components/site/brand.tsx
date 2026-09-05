import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-deep",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M12 2.6 21 7.6v8.8L12 21.4 3 16.4V7.6z" fill="none" stroke="white" strokeWidth="1.5" />
        <path d="M12 2.6v18.8M3 7.6l9 5 9-5" fill="none" stroke="var(--ore)" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="1.9" fill="var(--ore)" />
      </svg>
    </span>
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark />
      <span className="leading-none">
        <span className="block font-display text-[1.05rem] font-semibold tracking-tight">
          GeoMineSense
        </span>
        {!compact && (
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            LEGION
          </span>
        )}
      </span>
    </span>
  );
}
