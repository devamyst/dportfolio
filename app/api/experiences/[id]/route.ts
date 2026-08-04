import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteExperience, updateExperience } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
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

  const experience = await updateExperience(id, {
    type: body.type,
    title: body.title.trim(),
    description: body.description.trim(),
    link: typeof body.link === "string" && body.link.trim() ? body.link.trim() : null,
    image_url:
      typeof body.image_url === "string" && body.image_url.trim() ? body.image_url.trim() : null,
    tags: typeof body.tags === "string" ? body.tags.trim() : "",
    sort_order: Number.isFinite(body.sort_order) ? body.sort_order : 0,
  });

  if (!experience) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(experience);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  await deleteExperience(id);
  return NextResponse.json({ ok: true });
}
