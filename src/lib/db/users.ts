import { ObjectId, type WithId } from "mongodb";
import { hashPassword } from "@/lib/auth/password";
import { ensureDbIndexes, getDb } from "@/lib/mongodb";
import type { User, UserDoc, UserRole } from "@/lib/models";

const COL = "users";

export function normalizeRole(r: string): UserRole {
  if (r === "admin") return "admin";
  return "user";
}

function toOut(doc: WithId<UserDoc>): User {
  return {
    _id: doc._id.toString(),
    email: doc.email,
    name: doc.name,
    phone: doc.phone,
    role: normalizeRole(String(doc.role)),
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

/** Tài khoản đăng nhập (có hash). */
export async function getUserDocByEmail(email: string) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  const doc = await db.collection<UserDoc>(COL).findOne({ email: email.trim().toLowerCase() });
  return doc as WithId<UserDoc> | null;
}

export async function countUsers() {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  return db.collection(COL).countDocuments({});
}

export async function countAdmins() {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  return db.collection(COL).countDocuments({ role: "admin" });
}

export type UserInput = {
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  /** Nếu có — lưu bcrypt; bỏ qua khi rỗng. */
  password?: string;
};

export async function createUser(input: UserInput) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  const now = new Date();
  let passwordHash: string | undefined;
  if (input.password && input.password.length > 0) {
    passwordHash = await hashPassword(input.password);
  }
  const doc: UserDoc = {
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    phone: input.phone?.trim() || undefined,
    role: input.role,
    passwordHash,
    createdAt: now,
    updatedAt: now,
  };
  const r = await db.collection<UserDoc>(COL).insertOne(doc);
  const created = await db.collection<UserDoc>(COL).findOne({ _id: r.insertedId });
  if (!created) throw new Error("Insert failed");
  return toOut(created as WithId<UserDoc>);
}

export type UserPatch = Partial<Pick<UserInput, "email" | "name" | "phone" | "role" | "password">>;

export async function updateUser(id: string, patch: UserPatch) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  if (!ObjectId.isValid(id)) return null;

  const existing = await db.collection<UserDoc>(COL).findOne({ _id: new ObjectId(id) });
  if (!existing) return null;

  const $set: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.email !== undefined) $set.email = patch.email.trim().toLowerCase();
  if (patch.name !== undefined) $set.name = patch.name.trim();
  if (patch.phone !== undefined) $set.phone = patch.phone?.trim() || undefined;
  if (patch.role !== undefined) $set.role = patch.role;
  if (patch.password !== undefined && patch.password.length > 0) {
    $set.passwordHash = await hashPassword(patch.password);
  }

  const wasAdmin = normalizeRole(String(existing.role)) === "admin";
  const newRole =
    patch.role !== undefined ? patch.role : normalizeRole(String(existing.role));
  if (wasAdmin && newRole === "user") {
    const admins = await countAdmins();
    if (admins <= 1) {
      throw Object.assign(new Error("Cannot remove the last admin"), { code: "LAST_ADMIN" as const });
    }
  }

  const doc = await db
    .collection<UserDoc>(COL)
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set }, { returnDocument: "after" });
  if (!doc) return null;
  return toOut(doc as WithId<UserDoc>);
}

export async function deleteUser(id: string) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  if (!ObjectId.isValid(id)) return false;

  const existing = await db.collection<UserDoc>(COL).findOne({ _id: new ObjectId(id) });
  if (!existing) return false;
  if (normalizeRole(String(existing.role)) === "admin") {
    const admins = await countAdmins();
    if (admins <= 1) {
      throw Object.assign(new Error("Cannot delete the last admin"), { code: "LAST_ADMIN" as const });
    }
  }

  const r = await db.collection<UserDoc>(COL).deleteOne({ _id: new ObjectId(id) });
  return r.deletedCount === 1;
}
