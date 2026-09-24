import type { Metadata } from "next";
import { Pixelify_Sans, VT323 } from "next/font/google";
import { Providers } from "./providers";
import { getSettings } from "@/lib/settings";
import Background from "@/components/Background";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel", display: "swap" });
const mono = VT323({ subsets: ["latin"], weight: "400", variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Devamy",
  description: "Minecraft plugins, servers and commissions by Devamy",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en" className={`${pixel.variable} ${mono.variable}`}>
      <body>
        <Providers>
          <Background />
          <Nav />
          <main className="relative">{children}</main>
          <Footer email={settings.social_email} github={settings.social_github} />
        </Providers>
      </body>
    </html>
  );
}
