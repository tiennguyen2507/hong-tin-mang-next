import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { createUser, listUsers } from "@/lib/db/users";
import type { UserRole } from "@/lib/models";

const ROLES = new Set<UserRole>(["user", "admin"]);

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const data = await listUsers();
    return NextResponse.json({ data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await req.json()) as {
      email?: string;
      name?: string;
      phone?: string;
      role?: UserRole;
      password?: string;
    };
    if (typeof body.email !== "string" || !body.email.trim()) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }
    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    if (!body.role || !ROLES.has(body.role)) {
      return NextResponse.json({ error: "invalid role" }, { status: 400 });
    }
    const password =
      typeof body.password === "string" && body.password.length > 0 ? body.password : undefined;
    const created = await createUser({
      email: body.email,
      name: body.name,
      phone: body.phone,
      role: body.role,
      password,
    });
    return NextResponse.json(created);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    const code = (e as { code?: number }).code;
    if (code === 11000) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
