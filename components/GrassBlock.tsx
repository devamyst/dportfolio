export const GRASS_PIXELS = [
  "GGgGGGgG",
  "gGGGgGGG",
  "GdGgGdGG",
  "dDdGdddD",
  "ddDdddDd",
  "DdddDddd",
  "ddDddDdD",
  "dDddddDd",
];

export const GRASS_FILL: Record<string, string> = {
  G: "#5dbb3f",
  g: "#4c9a33",
  d: "#866043",
  D: "#6b4c35",
};

export default function GrassBlock({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 8" className={className} shapeRendering="crispEdges" aria-hidden>
      {GRASS_PIXELS.flatMap((row, y) =>
        [...row].map((c, x) => <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={GRASS_FILL[c]} />)
      )}
    </svg>
  );
}
