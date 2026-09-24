import { ImageResponse } from "next/og";
import GrassBlockImage from "@/components/GrassBlockImage";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e1230",
        }}
      >
        <GrassBlockImage pixel={16} />
      </div>
    ),
    size
  );
}
