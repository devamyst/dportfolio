import type { Metadata } from "next";
import { Providers } from "./providers";
import { getSettings } from "@/lib/settings";
import Background from "@/components/Background";
import CursorGlow from "@/components/CursorGlow";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Plugins and servers I've worked on",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body>
        <Providers>
          <Background />
          <CursorGlow />
          <Nav />
          <main className="relative">{children}</main>
          <Footer email={settings.social_email} github={settings.social_github} />
        </Providers>
      </body>
    </html>
  );
}
