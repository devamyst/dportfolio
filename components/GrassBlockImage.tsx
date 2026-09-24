import { GRASS_FILL, GRASS_PIXELS } from "./GrassBlock";

export default function GrassBlockImage({ pixel }: { pixel: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {GRASS_PIXELS.map((row, y) => (
        <div key={y} style={{ display: "flex" }}>
          {[...row].map((c, x) => (
            <div key={x} style={{ width: pixel, height: pixel, background: GRASS_FILL[c] }} />
          ))}
        </div>
      ))}
    </div>
  );
}
