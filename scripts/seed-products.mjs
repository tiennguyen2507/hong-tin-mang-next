/**
 * Seed 10 món đồ ăn sáng + 10 thức uống cafe (upsert theo slug).
 * Chạy: npm run seed:products
 * Cần MONGODB_URI trong .env.local (hoặc biến môi trường).
 * Ảnh: URL Unsplash (HTTPS) — có thể đổi trong mảng dưới đây.
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

/** Ảnh Unsplash (HTTPS) — crop + kích thước phù hợp thẻ sản phẩm */
const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const BREAKFAST = [
  {
    name: "Bánh mì thịt nướng",
    description: "Bánh mì giòn, thịt nướng sả, rau dưa.",
    price: 25000,
    imageUrl: u("photo-1601050690597-df0568f70950"),
  },
  {
    name: "Phở bò tái",
    description: "Nước dùng thơm, bò tái, hành lá, chanh.",
    price: 45000,
    imageUrl: u("photo-1591814468924-caf88d1232e0"),
  },
  {
    name: "Bún bò Huế",
    description: "Bún bò cay, chả cua, huyết.",
    price: 42000,
    imageUrl: u("photo-1617093727343-374698b1b08d"),
  },
  {
    name: "Xôi mặn",
    description: "Xôi nếp, chà bông, lạp xưởng, chả.",
    price: 20000,
    imageUrl: u("photo-1516684732162-798a0062be99"),
  },
  {
    name: "Cháo lòng",
    description: "Cháo trắng, lòng heo, quẩy.",
    price: 35000,
    imageUrl: u("photo-1547592166-23ac45744acd"),
  },
  {
    name: "Bánh cuốn nóng",
    description: "Nhân thịt, mộc nhĩ, hành phi.",
    price: 30000,
    imageUrl: u("photo-1563245372-f21724e3856d"),
  },
  {
    name: "Bánh bao nhân thịt",
    description: "Bột mềm, nhân thịt trứng cút.",
    price: 15000,
    imageUrl: u("photo-1496116218417-1a781b1c416c"),
  },
  {
    name: "Hủ tiếu Nam Vang",
    description: "Nước trong, thịt bằm, tôm.",
    price: 40000,
    imageUrl: u("photo-1569718212165-3a8278d5f624"),
  },
  {
    name: "Miến gà",
    description: "Miến dong, gà xé, nấm hương.",
    price: 38000,
    imageUrl: u("photo-1473093295043-cdd812d0e601"),
  },
  {
    name: "Cơm tấm sườn bì",
    description: "Sườn nướng, bì, trứng ốp la.",
    price: 40000,
    imageUrl: u("photo-1604908176997-125f25cc6f3d"),
  },
];

const CAFE = [
  {
    name: "Espresso",
    description: "Shot espresso đậm, ít đắng.",
    price: 25000,
    imageUrl: u("photo-1510591509098-f4fdc6d296e1"),
  },
  {
    name: "Americano",
    description: "Espresso pha loãng nước nóng.",
    price: 29000,
    imageUrl: u("photo-1497935586351-b67a49e012bf"),
  },
  {
    name: "Cappuccino",
    description: "Espresso, sữa nóng, bọt sữa.",
    price: 35000,
    imageUrl: u("photo-1572442388796-9c7627a66356"),
  },
  {
    name: "Latte",
    description: "Espresso, nhiều sữa, mịn.",
    price: 39000,
    imageUrl: u("photo-1461023058943-07fcbe16d735"),
  },
  {
    name: "Macchiato",
    description: "Espresso, một lớp sữa nhẹ.",
    price: 36000,
    imageUrl: u("photo-1485808191679-5f86510681a2"),
  },
  {
    name: "Flat White",
    description: "Espresso, sữa microfoam.",
    price: 42000,
    imageUrl: u("photo-1570968915860-54d5c301fa9f"),
  },
  {
    name: "Cold Brew",
    description: "Pha lạnh 12–18h, êm.",
    price: 35000,
    imageUrl: u("photo-1517701604599-bb29b565ddc9"),
  },
  {
    name: "Cà phê sữa đá",
    description: "Phin đậm, sữa đặc, đá.",
    price: 22000,
    imageUrl: u("photo-1517487881594-2787fef5ebf7"),
  },
  {
    name: "Cà phê bạc xỉu",
    description: "Espresso, sữa tươi, ít bọt.",
    price: 28000,
    imageUrl: u("photo-1558857563-b37103347b65"),
  },
  {
    name: "Matcha latte",
    description: "Matcha Nhật, sữa, mịn.",
    price: 45000,
    imageUrl: u("photo-1515825838458-f2a894b20188"),
  },
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
      imageUrl: b.imageUrl,
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
      imageUrl: c.imageUrl,
      active: true,
      stock: 100,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const doc of rows) {
    await col.updateOne(
      { slug: doc.slug },
      {
        $set: {
          name: doc.name,
          description: doc.description,
          price: doc.price,
          category: doc.category,
          imageUrl: doc.imageUrl,
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
  }

  await client.close();
  console.log(
    `OK: đã upsert ${rows.length} sản phẩm (${BREAKFAST.length} món + ${CAFE.length} đồ uống), kèm ảnh.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
