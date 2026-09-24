import { NextResponse } from "next/server";
import { DISCORD_USER_ID } from "@/lib/lanyard";

export async function GET() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, {
      next: { revalidate: 15 },
    });
    if (!res.ok) return NextResponse.json({ success: false }, { status: 502 });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
