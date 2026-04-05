import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { deleteUser, getUser, updateUser } from "@/lib/db/users";
import type { UserRole } from "@/lib/models";

const ROLES = new Set<UserRole>(["user", "admin"]);

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const doc = await getUser(id);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const body = (await req.json()) as Record<string, unknown>;
    const patch: Parameters<typeof updateUser>[1] = {};
    if (typeof body.email === "string") patch.email = body.email;
    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.phone === "string") patch.phone = body.phone;
    if (typeof body.role === "string" && ROLES.has(body.role as UserRole))
      patch.role = body.role as UserRole;
    if (typeof body.password === "string" && body.password.length > 0) patch.password = body.password;

    const doc = await updateUser(id, patch);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    const lastAdmin = (e as { code?: string }).code === "LAST_ADMIN";
    if (lastAdmin) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Invalid operation" },
        { status: 400 },
      );
    }
    const msg = e instanceof Error ? e.message : "Error";
    const code = (e as { code?: number }).code;
    if (code === 11000) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const ok = await deleteUser(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const lastAdmin = (e as { code?: string }).code === "LAST_ADMIN";
    if (lastAdmin) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Invalid operation" },
        { status: 400 },
      );
    }
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
