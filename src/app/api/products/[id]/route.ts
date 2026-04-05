import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { deleteProduct, getProduct, updateProduct } from "@/lib/db/products";
import type { ProductCategory } from "@/lib/models";

const CATS = new Set<ProductCategory>(["breakfast", "cafe", "drink"]);

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const doc = await getProduct(id);
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
    const patch: Parameters<typeof updateProduct>[1] = {};
    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.slug === "string") patch.slug = body.slug;
    if (typeof body.description === "string") patch.description = body.description;
    if (typeof body.price === "number") patch.price = body.price;
    if (typeof body.category === "string" && CATS.has(body.category as ProductCategory))
      patch.category = body.category as ProductCategory;
    if (typeof body.active === "boolean") patch.active = body.active;
    if (typeof body.stock === "number") patch.stock = body.stock;
    if (typeof body.imageUrl === "string") patch.imageUrl = body.imageUrl;

    const doc = await updateProduct(id, patch);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const ok = await deleteProduct(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
