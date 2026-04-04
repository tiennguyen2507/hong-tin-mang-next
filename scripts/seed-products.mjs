/**
 * Seed 10 món đồ ăn sáng + 10 thức uống cafe (upsert theo slug).
 * Chạy: npm run seed:products
 * Cần MONGODB_URI trong .env.local (hoặc biến môi trường).
 */
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const p = join(__dirname, "..", ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnvLocal();

function slugify(text) {
  const t = text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return t || "san-pham";
}

const BREAKFAST = [
  { name: "Bánh mì thịt nướng", description: "Bánh mì giòn, thịt nướng sả, rau dưa.", price: 25000 },
  { name: "Phở bò tái", description: "Nước dùng thơm, bò tái, hành lá, chanh.", price: 45000 },
  { name: "Bún bò Huế", description: "Bún bò cay, chả cua, huyết.", price: 42000 },
  { name: "Xôi mặn", description: "Xôi nếp, chà bông, lạp xưởng, chả.", price: 20000 },
  { name: "Cháo lòng", description: "Cháo trắng, lòng heo, quẩy.", price: 35000 },
  { name: "Bánh cuốn nóng", description: "Nhân thịt, mộc nhĩ, hành phi.", price: 30000 },
  { name: "Bánh bao nhân thịt", description: "Bột mềm, nhân thịt trứng cút.", price: 15000 },
  { name: "Hủ tiếu Nam Vang", description: "Nước trong, thịt bằm, tôm.", price: 40000 },
  { name: "Miến gà", description: "Miến dong, gà xé, nấm hương.", price: 38000 },
  { name: "Cơm tấm sườn bì", description: "Sườn nướng, bì, trứng ốp la.", price: 40000 },
];

const CAFE = [
  { name: "Espresso", description: "Shot espresso đậm, ít đắng.", price: 25000 },
  { name: "Americano", description: "Espresso pha loãng nước nóng.", price: 29000 },
  { name: "Cappuccino", description: "Espresso, sữa nóng, bọt sữa.", price: 35000 },
  { name: "Latte", description: "Espresso, nhiều sữa, mịn.", price: 39000 },
  { name: "Macchiato", description: "Espresso, một lớp sữa nhẹ.", price: 36000 },
  { name: "Flat White", description: "Espresso, sữa microfoam.", price: 42000 },
  { name: "Cold Brew", description: "Pha lạnh 12–18h, êm.", price: 35000 },
  { name: "Cà phê sữa đá", description: "Phin đậm, sữa đặc, đá.", price: 22000 },
  { name: "Cà phê bạc xỉu", description: "Espresso, sữa tươi, ít bọt.", price: 28000 },
  { name: "Matcha latte", description: "Matcha Nhật, sữa, mịn.", price: 45000 },
];

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.error("Thiếu MONGODB_URI. Thêm vào .env.local rồi chạy lại.");
    process.exit(1);
  }
  const dbName = process.env.MONGODB_DB?.trim() || "breakfast_shop";
  const now = new Date();

  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db(dbName).collection("products");

  const rows = [];
  for (const b of BREAKFAST) {
    const slug = slugify(b.name);
    rows.push({
      slug,
      name: b.name,
      description: b.description,
      price: b.price,
      category: "breakfast",
      active: true,
      stock: 100,
      createdAt: now,
      updatedAt: now,
    });
  }
  for (const c of CAFE) {
    const slug = slugify(c.name);
    rows.push({
      slug,
      name: c.name,
      description: c.description,
      price: c.price,
      category: "cafe",
      active: true,
      stock: 100,
      createdAt: now,
      updatedAt: now,
    });
  }

  let n = 0;
  for (const doc of rows) {
    const r = await col.updateOne(
      { slug: doc.slug },
      {
        $set: {
          name: doc.name,
          description: doc.description,
          price: doc.price,
          category: doc.category,
          active: doc.active,
          stock: doc.stock,
          updatedAt: now,
        },
        $setOnInsert: {
          slug: doc.slug,
          createdAt: now,
        },
      },
      { upsert: true },
    );
    if (r.upsertedCount || r.modifiedCount || r.matchedCount) n += 1;
  }

  await client.close();
  console.log(`OK: đã upsert ${rows.length} sản phẩm (${BREAKFAST.length} món + ${CAFE.length} đồ uống).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
