import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL || "");

let ready: Promise<void> | null = null;

function init(): Promise<void> {
  if (!ready) {
    ready = sql`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `.then(() => undefined);
  }
  return ready;
}

export const DEFAULT_SETTINGS = {
  hero_title: "Devamy",
  hero_subtitle: "Full Stack Developer • Minecraft Developer • Open Source",
  hero_description:
    "I build high-performance Minecraft plugins, modern web applications, and open-source software focused on speed, scalability, and clean design.",
  profile_bio_1:
    "I'm a developer who loves shipping fast, reliable software. Most of my work lives at the intersection of Minecraft server tooling and modern web platforms.",
  profile_bio_2:
    "Outside of code, I care about clean architecture, good UX, and building things people actually enjoy using.",
  stat_downloads: "5K+",
  stat_years: "7+",
  skills: "Java,Kotlin,TypeScript,React,Next.js,Spring,PostgreSQL,Docker,Redis,MongoDB,Velocity,Paper,Folia",
  social_github: "https://github.com/devamyst",
  social_discord: "https://discord.com",
  social_email: "devamyst@gmail.com",
};

export type Settings = typeof DEFAULT_SETTINGS;
export type SettingsKey = keyof Settings;

export async function getSettings(): Promise<Settings> {
  await init();
  const rows = (await sql`SELECT key, value FROM settings`) as { key: string; value: string }[];
  const overrides = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return { ...DEFAULT_SETTINGS, ...overrides } as Settings;
}

export async function updateSettings(partial: Partial<Settings>): Promise<Settings> {
  await init();
  for (const [key, value] of Object.entries(partial)) {
    await sql`
      INSERT INTO settings (key, value) VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = ${value}
    `;
  }
  revalidatePath("/", "layout");
  return getSettings();
}
