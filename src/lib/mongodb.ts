import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getUri(): string | undefined {
  return process.env.MONGODB_URI?.trim() || undefined;
}

export function getMongoClientPromise(): Promise<MongoClient> | null {
  const uri = getUri();
  if (!uri) return null;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  const client = new MongoClient(uri);
  return client.connect();
}

export async function getDb() {
  const p = getMongoClientPromise();
  if (!p) return null;
  const client = await p;
  const name = process.env.MONGODB_DB?.trim() || "breakfast_shop";
  return client.db(name);
}

let indexesEnsured = false;

export async function ensureDbIndexes() {
  if (indexesEnsured) return;
  const db = await getDb();
  if (!db) return;
  await Promise.all([
    db.collection("products").createIndex({ slug: 1 }, { unique: true }),
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("orders").createIndex({ createdAt: -1 }),
  ]);
  indexesEnsured = true;
}
