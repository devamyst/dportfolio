import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL || "");

let ready: Promise<void> | null = null;

async function runInit(): Promise<void> {
  await sql`
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
    )
  `;
  await sql`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS role TEXT`;
  await sql`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS rating INTEGER`;
  await sql`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS review_screenshot_url TEXT`;
  await sql`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS server_ip TEXT`;
  await sql`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS discord_url TEXT`;
  await sql`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS start_date TEXT`;
  await sql`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS end_date TEXT`;
  await sql`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS status TEXT`;
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      author TEXT,
      text TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`ALTER TABLE reviews ALTER COLUMN author DROP NOT NULL`;
}

function init(): Promise<void> {
  if (!ready) {
    ready = runInit();
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
  role: string | null;
  rating: number | null;
  review_screenshot_url: string | null;
  server_ip: string | null;
  discord_url: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
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
    INSERT INTO experiences (type, title, description, link, image_url, tags, sort_order, role, rating, review_screenshot_url, server_ip, discord_url, start_date, end_date, status)
    VALUES (${input.type}, ${input.title}, ${input.description}, ${input.link},
            ${input.image_url}, ${input.tags}, ${input.sort_order}, ${input.role},
            ${input.rating}, ${input.review_screenshot_url}, ${input.server_ip}, ${input.discord_url},
            ${input.start_date}, ${input.end_date}, ${input.status})
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
      image_url = ${input.image_url}, tags = ${input.tags}, sort_order = ${input.sort_order},
      role = ${input.role}, rating = ${input.rating}, review_screenshot_url = ${input.review_screenshot_url},
      server_ip = ${input.server_ip}, discord_url = ${input.discord_url},
      start_date = ${input.start_date}, end_date = ${input.end_date}, status = ${input.status}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Experience | undefined;
}

export async function deleteExperience(id: number): Promise<void> {
  await init();
  await sql`DELETE FROM experiences WHERE id = ${id}`;
}

export interface Review {
  id: number;
  author: string | null;
  text: string;
  sort_order: number;
  created_at: string;
}

type ReviewInput = Omit<Review, "id" | "created_at">;

export async function listReviews(): Promise<Review[]> {
  await init();
  const rows = await sql`
    SELECT * FROM reviews ORDER BY sort_order ASC, id DESC
  `;
  return rows as Review[];
}

export async function createReview(input: ReviewInput): Promise<Review> {
  await init();
  const rows = await sql`
    INSERT INTO reviews (author, text, sort_order)
    VALUES (${input.author}, ${input.text}, ${input.sort_order})
    RETURNING *
  `;
  return rows[0] as Review;
}

export async function updateReview(
  id: number,
  input: ReviewInput
): Promise<Review | undefined> {
  await init();
  const rows = await sql`
    UPDATE reviews SET author = ${input.author}, text = ${input.text}, sort_order = ${input.sort_order}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Review | undefined;
}

export async function deleteReview(id: number): Promise<void> {
  await init();
  await sql`DELETE FROM reviews WHERE id = ${id}`;
}
