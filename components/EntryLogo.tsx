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
        className={`${size} shrink-0 border-2 border-black object-cover`}
      />
    );
  }
  return (
    <div
      className={`${size} mc-slot-dark mc-shadow flex shrink-0 items-center justify-center border-2 border-black font-pixel text-lg text-accent`}
    >
      {title.charAt(0).toUpperCase() || "?"}
    </div>
  );
}
