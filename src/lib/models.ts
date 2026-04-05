import type { ObjectId } from "mongodb";

export type ProductCategory = "breakfast" | "cafe" | "drink";

export type ProductDoc = {
  _id?: ObjectId;
  name: string;
  slug: string;
  description?: string;
  price: number;
  category: ProductCategory;
  imageUrl?: string;
  active: boolean;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};

/** `customer` giữ trong DB cũ — chuẩn hoá khi đọc thành `user`. */
export type UserRole = "user" | "admin";

export type UserDoc = {
  _id?: ObjectId;
  email: string;
  name: string;
  phone?: string;
  /** Lưu DB: `user` | `admin` hoặc legacy `customer`. */
  role: UserRole | "customer";
  /** Chỉ server; không trả về client. */
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export type OrderItemLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderDoc = {
  _id?: ObjectId;
  userId?: ObjectId;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  note?: string;
  items: OrderItemLine[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = Omit<ProductDoc, "_id"> & { _id: string };
/** Bản trả API: role đã chuẩn hoá, không có passwordHash. */
export type User = Omit<UserDoc, "_id" | "role" | "passwordHash"> & { _id: string; role: UserRole };
export type Order = Omit<OrderDoc, "_id" | "userId"> & {
  _id: string;
  userId?: string;
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  breakfast: "Đồ ăn sáng",
  cafe: "Cafe",
  drink: "Đồ uống",
};
