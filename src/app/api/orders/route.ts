import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { createOrder, listOrders } from "@/lib/db/orders";
import type { OrderItemLine } from "@/lib/models";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const data = await listOrders();
    return NextResponse.json({ data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      userId?: string;
      customerName?: string;
      customerPhone?: string;
      deliveryAddress?: string;
      note?: string;
      items?: OrderItemLine[];
    };
    if (typeof body.customerName !== "string" || !body.customerName.trim()) {
      return NextResponse.json({ error: "customerName required" }, { status: 400 });
    }
    if (typeof body.customerPhone !== "string" || !body.customerPhone.trim()) {
      return NextResponse.json({ error: "customerPhone required" }, { status: 400 });
    }
    if (typeof body.deliveryAddress !== "string" || !body.deliveryAddress.trim()) {
      return NextResponse.json({ error: "deliveryAddress required" }, { status: 400 });
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "items required" }, { status: 400 });
    }
    for (const it of body.items) {
      if (
        typeof it.productId !== "string" ||
        typeof it.name !== "string" ||
        typeof it.price !== "number" ||
        typeof it.quantity !== "number"
      ) {
        return NextResponse.json({ error: "invalid item" }, { status: 400 });
      }
    }
    const created = await createOrder({
      userId: body.userId,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      deliveryAddress: body.deliveryAddress,
      note: body.note,
      items: body.items,
    });
    return NextResponse.json(created);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
