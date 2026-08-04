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
  });

  return NextResponse.json(experience, { status: 201 });
}
