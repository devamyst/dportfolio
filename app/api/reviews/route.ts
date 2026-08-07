import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createReview, listReviews } from "@/lib/db";

export async function GET() {
  return NextResponse.json(await listReviews());
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (typeof body.text !== "string" || !body.text.trim()) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const review = await createReview({
    author: typeof body.author === "string" && body.author.trim() ? body.author.trim() : null,
    text: body.text.trim(),
    sort_order: Number.isFinite(body.sort_order) ? body.sort_order : 0,
  });

  return NextResponse.json(review, { status: 201 });
}
