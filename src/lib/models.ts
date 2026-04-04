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

export type UserRole = "customer" | "admin";

export type UserDoc = {
  _id?: ObjectId;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
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
export type User = Omit<UserDoc, "_id"> & { _id: string };
export type Order = Omit<OrderDoc, "_id" | "userId"> & {
  _id: string;
  userId?: string;
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  breakfast: "Đồ ăn sáng",
  cafe: "Cafe",
  drink: "Nước uống",
};
