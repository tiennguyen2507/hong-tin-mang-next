import { NextResponse } from "next/server";
import { getSession } from "./session";

export async function requireAdmin(): Promise<NextResponse | null> {
  const s = await getSession();
  if (!s || s.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
