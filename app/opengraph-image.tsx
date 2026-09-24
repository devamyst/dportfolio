import { ImageResponse } from "next/og";
import GrassBlockImage from "@/components/GrassBlockImage";
import { getSettings } from "@/lib/settings";

export const alt = "Devamy — Minecraft plugins, servers and websites";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

async function pixelFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700&display=swap", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534 (KHTML, like Gecko)" },
    }).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [settings, font] = await Promise.all([getSettings().catch(() => null), pixelFont()]);
  const title = settings?.hero_title ?? "Devamy";
  const subtitle = settings?.hero_subtitle ?? "Minecraft Developer";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(#07080f, #0e1230 60%, #1a1a3a)",
          fontFamily: font ? "Pixelify" : "sans-serif",
          position: "relative",
        }}
      >
        <GrassBlockImage pixel={20} />
        <div
          style={{
            marginTop: 40,
            fontSize: 120,
            fontWeight: 700,
            color: "#f3f3f3",
            letterSpacing: 8,
            textTransform: "uppercase",
            textShadow: "8px 8px 0 #3f3f3f",
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 16, fontSize: 36, color: "#5dbb3f" }}>{subtitle}</div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 40,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ height: 12, background: "#5dbb3f" }} />
          <div style={{ flex: 1, background: "#866043" }} />
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Pixelify", data: font, weight: 700 }] : undefined }
  );
}
