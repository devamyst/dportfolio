import { ImageResponse } from "next/og";
import GrassBlockImage from "@/components/GrassBlockImage";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<GrassBlockImage pixel={8} />, size);
}
