import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createExperience, listExperiences } from "@/lib/db";

export async function GET() {
  return NextResponse.json(await listExperiences());
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.description !== "string" ||
    (body.type !== "plugin" && body.type !== "server")
  ) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const experience = await createExperience({
    type: body.type,
    title: body.title.trim(),
    description: body.description.trim(),
    link: typeof body.link === "string" && body.link.trim() ? body.link.trim() : null,
    image_url:
      typeof body.image_url === "string" && body.image_url.trim() ? body.image_url.trim() : null,
    tags: typeof body.tags === "string" ? body.tags.trim() : "",
    sort_order: Number.isFinite(body.sort_order) ? body.sort_order : 0,
    role: typeof body.role === "string" && body.role.trim() ? body.role.trim() : null,
    rating:
      Number.isFinite(body.rating) && body.rating >= 1 && body.rating <= 5
        ? Math.round(body.rating)
        : null,
    review_screenshot_url:
      typeof body.review_screenshot_url === "string" && body.review_screenshot_url.trim()
        ? body.review_screenshot_url.trim()
        : null,
    server_ip:
      typeof body.server_ip === "string" && body.server_ip.trim() ? body.server_ip.trim() : null,
    discord_url:
      typeof body.discord_url === "string" && body.discord_url.trim()
        ? body.discord_url.trim()
        : null,
    start_date:
      typeof body.start_date === "string" && body.start_date.trim() ? body.start_date.trim() : null,
    end_date:
      typeof body.end_date === "string" && body.end_date.trim() ? body.end_date.trim() : null,
    status: typeof body.status === "string" && body.status.trim() ? body.status.trim() : null,
  });

  return NextResponse.json(experience, { status: 201 });
}
