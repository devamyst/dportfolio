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
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-neutral-300">
            {status}
          </span>
        )}
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface2">
        {ongoing ? (
          <div
            className="h-full w-full rounded-full bg-gradient-to-r from-accent via-blue-300 to-accent bg-[length:200%_100%] animate-gradientShift"
            title="Still going"
          />
        ) : (
          <div className="h-full w-full rounded-full bg-accent" />
        )}
      </div>
    </div>
  );
}
