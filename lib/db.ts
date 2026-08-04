import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL || "");

let ready: Promise<void> | null = null;

function init(): Promise<void> {
  if (!ready) {
    ready = sql`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL CHECK (type IN ('plugin', 'server')),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        link TEXT,
        image_url TEXT,
        tags TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `.then(() => undefined);
  }
  return ready;
}

export interface Experience {
  id: number;
  type: "plugin" | "server";
  title: string;
  description: string;
  link: string | null;
  image_url: string | null;
  tags: string;
  sort_order: number;
  created_at: string;
}

type ExperienceInput = Omit<Experience, "id" | "created_at">;

export async function listExperiences(): Promise<Experience[]> {
  await init();
  const rows = await sql`
    SELECT * FROM experiences ORDER BY sort_order ASC, id DESC
  `;
  return rows as Experience[];
}

export async function createExperience(input: ExperienceInput): Promise<Experience> {
  await init();
  const rows = await sql`
    INSERT INTO experiences (type, title, description, link, image_url, tags, sort_order)
    VALUES (${input.type}, ${input.title}, ${input.description}, ${input.link},
            ${input.image_url}, ${input.tags}, ${input.sort_order})
    RETURNING *
  `;
  return rows[0] as Experience;
}

export async function updateExperience(
  id: number,
  input: ExperienceInput
): Promise<Experience | undefined> {
  await init();
  const rows = await sql`
    UPDATE experiences SET type = ${input.type}, title = ${input.title},
      description = ${input.description}, link = ${input.link},
      image_url = ${input.image_url}, tags = ${input.tags}, sort_order = ${input.sort_order}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Experience | undefined;
}

export async function deleteExperience(id: number): Promise<void> {
  await init();
  await sql`DELETE FROM experiences WHERE id = ${id}`;
}
