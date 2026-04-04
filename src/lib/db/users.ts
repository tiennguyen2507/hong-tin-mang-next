import { ObjectId, type WithId } from "mongodb";
import { ensureDbIndexes, getDb } from "@/lib/mongodb";
import type { User, UserDoc, UserRole } from "@/lib/models";

const COL = "users";

function toOut(doc: WithId<UserDoc>): User {
  return {
    _id: doc._id.toString(),
    email: doc.email,
    name: doc.name,
    phone: doc.phone,
    role: doc.role,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function listUsers() {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  const docs = await db
    .collection<UserDoc>(COL)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toOut);
}

export async function getUser(id: string) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection<UserDoc>(COL).findOne({ _id: new ObjectId(id) });
  return doc ? toOut(doc as WithId<UserDoc>) : null;
}

export type UserInput = {
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
};

export async function createUser(input: UserInput) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  const now = new Date();
  const doc: UserDoc = {
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    phone: input.phone?.trim() || undefined,
    role: input.role,
    createdAt: now,
    updatedAt: now,
  };
  const r = await db.collection<UserDoc>(COL).insertOne(doc);
  const created = await db.collection<UserDoc>(COL).findOne({ _id: r.insertedId });
  if (!created) throw new Error("Insert failed");
  return toOut(created as WithId<UserDoc>);
}

export async function updateUser(id: string, patch: Partial<UserInput>) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  if (!ObjectId.isValid(id)) return null;
  const $set: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.email !== undefined) $set.email = patch.email.trim().toLowerCase();
  if (patch.name !== undefined) $set.name = patch.name.trim();
  if (patch.phone !== undefined) $set.phone = patch.phone?.trim() || undefined;
  if (patch.role !== undefined) $set.role = patch.role;

  const r = await db
    .collection<UserDoc>(COL)
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set }, { returnDocument: "after" });
  const doc = r && "value" in r ? r.value : null;
  if (!doc) return null;
  return toOut(doc as WithId<UserDoc>);
}

export async function deleteUser(id: string) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  if (!ObjectId.isValid(id)) return false;
  const r = await db.collection<UserDoc>(COL).deleteOne({ _id: new ObjectId(id) });
  return r.deletedCount === 1;
}
