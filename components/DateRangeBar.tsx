function formatMonth(value: string): string {
  const d = new Date(`${value}-01T00:00:00`);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

export default function DateRangeBar({
  start,
  end,
  status,
}: {
  start: string | null;
  end: string | null;
  status: string | null;
}) {
  if (!start) return null;
  const ongoing = !end;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <span>
          {formatMonth(start)} – {ongoing ? "Present" : formatMonth(end)}
        </span>
        {status && (
          <span className={`border px-2 py-0.5 font-pixel text-xs ${ongoing ? "border-accent/50 text-accent" : "border-border text-neutral-300"}`}>
            {status}
          </span>
        )}
      </div>
      <div className="xp-bar mt-1.5 w-full" title={ongoing ? "Still going" : undefined}>
        <div className={`xp-fill w-full ${ongoing ? "animate-xpShift" : "opacity-60"}`} />
      </div>
    </div>
  );
}
