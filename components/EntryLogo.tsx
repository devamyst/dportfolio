export default function EntryLogo({
  title,
  url,
  size = "h-14 w-14",
}: {
  title: string;
  url: string | null;
  size?: string;
}) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className={`${size} shrink-0 rounded-lg border border-border object-cover`}
      />
    );
  }
  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-lg border border-border bg-gradient-to-br from-blue-500/30 to-blue-700/30 text-lg font-bold text-blue-300`}
    >
      {title.charAt(0).toUpperCase() || "?"}
    </div>
  );
}
