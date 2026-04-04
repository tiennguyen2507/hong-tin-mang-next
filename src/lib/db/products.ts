import { ObjectId, type WithId } from "mongodb";
import { ensureDbIndexes, getDb } from "@/lib/mongodb";
import type { Product, ProductCategory, ProductDoc } from "@/lib/models";

const COL = "products";

function slugify(text: string): string {
  const t = text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return t || "san-pham";
}

function toOut(doc: WithId<ProductDoc>): Product {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    price: doc.price,
    category: doc.category,
    imageUrl: doc.imageUrl,
    active: doc.active,
    stock: doc.stock,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function listProducts(options?: { activeOnly?: boolean }) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  const q = options?.activeOnly ? { active: true } : {};
  const cur = db
    .collection<ProductDoc>(COL)
    .find(q)
    .sort({ category: 1, name: 1 });
  const docs = await cur.toArray();
  return docs.map(toOut);
}

export async function getProduct(id: string) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  if (!ObjectId.isValid(id)) return null;
  const doc = await db
    .collection<ProductDoc>(COL)
    .findOne({ _id: new ObjectId(id) });
  return doc ? toOut(doc as WithId<ProductDoc>) : null;
}

export type ProductInput = {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  category: ProductCategory;
  imageUrl?: string;
  active: boolean;
  stock: number;
};

export async function createProduct(input: ProductInput) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  const now = new Date();
  let slug = (input.slug?.trim() || slugify(input.name)).toLowerCase();
  const base = slug;
  for (let i = 0; i < 20; i++) {
    try {
      const doc: ProductDoc = {
        name: input.name.trim(),
        slug,
        description: input.description?.trim(),
        price: Math.round(input.price),
        category: input.category,
        imageUrl: input.imageUrl?.trim() || undefined,
        active: input.active,
        stock: Math.max(0, Math.floor(input.stock)),
        createdAt: now,
        updatedAt: now,
      };
      const r = await db.collection<ProductDoc>(COL).insertOne(doc);
      const created = await db
        .collection<ProductDoc>(COL)
        .findOne({ _id: r.insertedId });
      if (!created) throw new Error("Insert failed");
      return toOut(created as WithId<ProductDoc>);
    } catch (e: unknown) {
      const code = (e as { code?: number }).code;
      if (code === 11000) {
        slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
        continue;
      }
      throw e;
    }
  }
  throw new Error("Could not allocate unique slug");
}

export async function updateProduct(id: string, patch: Partial<ProductInput>) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  if (!ObjectId.isValid(id)) return null;
  const $set: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.name !== undefined) $set.name = patch.name.trim();
  if (patch.slug !== undefined) $set.slug = patch.slug.trim().toLowerCase();
  if (patch.description !== undefined) $set.description = patch.description?.trim();
  if (patch.price !== undefined) $set.price = Math.round(patch.price);
  if (patch.category !== undefined) $set.category = patch.category;
  if (patch.imageUrl !== undefined) $set.imageUrl = patch.imageUrl?.trim() || undefined;
  if (patch.active !== undefined) $set.active = patch.active;
  if (patch.stock !== undefined) $set.stock = Math.max(0, Math.floor(patch.stock));

  const r = await db
    .collection<ProductDoc>(COL)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set },
      { returnDocument: "after" },
    );
  const doc = r && "value" in r ? r.value : (r as unknown as WithId<ProductDoc> | null);
  if (!doc) return null;
  return toOut(doc as WithId<ProductDoc>);
}

export async function deleteProduct(id: string) {
  await ensureDbIndexes();
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  if (!ObjectId.isValid(id)) return false;
  const r = await db
    .collection<ProductDoc>(COL)
    .deleteOne({ _id: new ObjectId(id) });
  return r.deletedCount === 1;
}
