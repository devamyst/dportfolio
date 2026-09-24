import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, join } from "node:path";

const site = (process.argv[2] || process.env.BACKUP_SITE || "https://devamy.vercel.app").replace(/\/$/, "");
const stamp = new Date().toISOString().slice(0, 16).replace("T", "_").replace(":", "");
const dir = join(process.env.BACKUP_DIR || join(homedir(), "Backups", "dportfolio"), stamp);

async function getJson(path) {
  const res = await fetch(`${site}${path}`);
  if (!res.ok) throw new Error(`${path} returned ${res.status}`);
  return res.json();
}

const [experiences, reviews, settings] = await Promise.all([
  getJson("/api/experiences"),
  getJson("/api/reviews"),
  getJson("/api/settings"),
]);

await mkdir(join(dir, "images"), { recursive: true });
await writeFile(join(dir, "experiences.json"), JSON.stringify(experiences, null, 2));
await writeFile(join(dir, "reviews.json"), JSON.stringify(reviews, null, 2));
await writeFile(join(dir, "settings.json"), JSON.stringify(settings, null, 2));

const urls = [...new Set(experiences.flatMap((e) => [e.image_url, e.review_screenshot_url]).filter(Boolean))];
let saved = 0;
const failed = [];
for (const url of urls) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    await writeFile(join(dir, "images", basename(new URL(url).pathname)), Buffer.from(await res.arrayBuffer()));
    saved++;
  } catch (err) {
    failed.push(`${url} (${err.message})`);
  }
}

console.log(`Backed up ${site} to ${dir}`);
console.log(`${experiences.length} entries, ${reviews.length} reviews, ${Object.keys(settings).length} settings, ${saved}/${urls.length} images`);
if (failed.length) {
  console.log(`Images that failed:\n  ${failed.join("\n  ")}`);
  process.exitCode = 1;
}
