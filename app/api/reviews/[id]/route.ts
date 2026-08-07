import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteReview, updateReview } from "@/lib/db";

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
  if (typeof body.text !== "string" || !body.text.trim()) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const review = await updateReview(id, {
    author: typeof body.author === "string" && body.author.trim() ? body.author.trim() : null,
    text: body.text.trim(),
    sort_order: Number.isFinite(body.sort_order) ? body.sort_order : 0,
  });

  if (!review) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(review);
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

  await deleteReview(id);
  return NextResponse.json({ ok: true });
}
