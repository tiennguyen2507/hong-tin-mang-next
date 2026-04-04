import { ObjectId, type WithId } from "mongodb";
import { ensureDbIndexes, getDb } from "@/lib/mongodb";
import type { Order, OrderDoc, OrderItemLine, OrderStatus } from "@/lib/models";

const COL = "orders";

function toOut(doc: WithId<OrderDoc>): Order {
  return {
    _id: doc._id.toString(),
    userId: doc.userId?.toString(),
    customerName: doc.customerName,
    customerPhone: doc.customerPhone,
    deliveryAddress: doc.deliveryAddress,
    note: doc.note,
    items: doc.items,
    total: doc.total,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function listOrders() {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  const docs = await db
    .collection<OrderDoc>(COL)
    .find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();
  return docs.map(toOut);
}

export async function getOrder(id: string) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection<OrderDoc>(COL).findOne({ _id: new ObjectId(id) });
  return doc ? toOut(doc as WithId<OrderDoc>) : null;
}

export type CreateOrderInput = {
  userId?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  note?: string;
  items: OrderItemLine[];
};

export async function createOrder(input: CreateOrderInput) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  const now = new Date();
  const total = input.items.reduce(
    (s, l) => s + l.price * l.quantity,
    0,
  );
  const doc: OrderDoc = {
    userId:
      input.userId && ObjectId.isValid(input.userId)
        ? new ObjectId(input.userId)
        : undefined,
    customerName: input.customerName.trim(),
    customerPhone: input.customerPhone.trim(),
    deliveryAddress: input.deliveryAddress.trim(),
    note: input.note?.trim() || undefined,
    items: input.items.map((l) => ({
      productId: l.productId,
      name: l.name,
      price: l.price,
      quantity: Math.max(1, Math.floor(l.quantity)),
    })),
    total: Math.round(total),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  const r = await db.collection<OrderDoc>(COL).insertOne(doc);
  const created = await db.collection<OrderDoc>(COL).findOne({ _id: r.insertedId });
  if (!created) throw new Error("Insert failed");
  return toOut(created as WithId<OrderDoc>);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  if (!ObjectId.isValid(id)) return null;
  const r = await db
    .collection<OrderDoc>(COL)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" },
    );
  const doc = r && "value" in r ? r.value : null;
  if (!doc) return null;
  return toOut(doc as WithId<OrderDoc>);
}

export async function deleteOrder(id: string) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  if (!ObjectId.isValid(id)) return false;
  const r = await db.collection<OrderDoc>(COL).deleteOne({ _id: new ObjectId(id) });
  return r.deletedCount === 1;
}
