import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import {
  createProduct,
  listProducts,
  type ProductInput,
} from "@/lib/db/products";
import type { ProductCategory } from "@/lib/models";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("all") !== "1";
    if (!activeOnly) {
      const denied = await requireAdmin();
      if (denied) return denied;
    }
    const data = await listProducts({ activeOnly });
    return NextResponse.json({ data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

const CATS = new Set<ProductCategory>(["breakfast", "cafe", "drink"]);

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await req.json()) as Partial<ProductInput>;
    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    if (typeof body.price !== "number" || body.price < 0) {
      return NextResponse.json({ error: "invalid price" }, { status: 400 });
    }
    if (!body.category || !CATS.has(body.category)) {
      return NextResponse.json({ error: "invalid category" }, { status: 400 });
    }
    if (typeof body.active !== "boolean") {
      return NextResponse.json({ error: "active required" }, { status: 400 });
    }
    if (typeof body.stock !== "number") {
      return NextResponse.json({ error: "stock required" }, { status: 400 });
    }
    const created = await createProduct({
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      category: body.category,
      imageUrl: body.imageUrl,
      active: body.active,
      stock: body.stock,
    });
    return NextResponse.json(created);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
