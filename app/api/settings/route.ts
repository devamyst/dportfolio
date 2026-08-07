import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSettings, updateSettings, DEFAULT_SETTINGS } from "@/lib/settings";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const allowedKeys = Object.keys(DEFAULT_SETTINGS);
  const partial = Object.fromEntries(
    Object.entries(body).filter(([key]) => allowedKeys.includes(key))
  );
  const settings = await updateSettings(partial);
  return NextResponse.json(settings);
}
