"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Field } from "@/components/ui/Field";
import { CheckboxField } from "@/components/ui/CheckboxField";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { Stack } from "@/components/ui/Stack";
import type { Product, ProductCategory } from "@/lib/models";
import { CATEGORY_LABELS } from "@/lib/models";
import { apiJson } from "@/lib/apiClient";

const CATS: ProductCategory[] = ["breakfast", "cafe", "drink"];

const emptyForm = {
  id: null as string | null,
  name: "",
  slug: "",
  description: "",
  price: 0,
  category: "breakfast" as ProductCategory,
  imageUrl: "",
  active: true,
  stock: 0,
};

export default function DashboardProductsPage() {
  const [items, setItems] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);

  const load = React.useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const r = await apiJson<{ data: Product[] }>("/api/products?all=1");
      setItems(r.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  function openAdd() {
    setForm({ ...emptyForm });
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setForm({
      id: p._id,
      name: p.name,
      slug: p.slug,
      description: p.description ?? "",
      price: p.price,
      category: p.category,
      imageUrl: p.imageUrl ?? "",
      active: p.active,
      stock: p.stock,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm({ ...emptyForm });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const body = {
        name: form.name,
        slug: form.slug || undefined,
        description: form.description || undefined,
        price: Number(form.price),
        category: form.category,
        imageUrl: form.imageUrl || undefined,
        active: form.active,
        stock: Number(form.stock),
      };
      if (form.id) {
        await apiJson(`/api/products/${form.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await apiJson("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      closeModal();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lưu thất bại");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Xóa sản phẩm này?")) return;
    setError(null);
    try {
      await apiJson(`/api/products/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xóa thất bại");
    }
  }

  return (
    <Stack gap={4}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Sản phẩm</h1>
          <p className="text-sm text-slate-600">Danh sách món và đồ uống.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" type="button" onClick={() => void load()}>
            Làm mới
          </Button>
          <Button
            className="bg-[#2563eb] hover:bg-[#1d4ed8]"
            size="sm"
            type="button"
            onClick={openAdd}
          >
            + Thêm sản phẩm
          </Button>
        </div>
      </div>

      {error ? <Alert variant="destructive">{error}</Alert> : null}
      {loading ? <p className="text-sm text-slate-500">Đang tải...</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Danh mục</th>
              <th className="px-3 py-2">Giá</th>
              <th className="px-3 py-2">Tồn</th>
              <th className="px-3 py-2">Bán</th>
              <th className="px-3 py-2 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-b border-slate-50">
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2">{CATEGORY_LABELS[p.category]}</td>
                <td className="px-3 py-2">{p.price.toLocaleString("vi-VN")} đ</td>
                <td className="px-3 py-2">{p.stock}</td>
                <td className="px-3 py-2">{p.active ? "Có" : "Không"}</td>
                <td className="px-3 py-2 text-right">
                  <Button variant="ghost" size="sm" type="button" onClick={() => openEdit(p)}>
                    Sửa
                  </Button>
                  <Button variant="danger" size="sm" type="button" onClick={() => void onDelete(p._id)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={form.id ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        size="lg"
        footer={
          <>
            <Button variant="secondary" type="button" onClick={closeModal}>
              Hủy
            </Button>
            <Button
              className="bg-[#2563eb] hover:bg-[#1d4ed8]"
              type="submit"
              form="product-form"
            >
              Lưu
            </Button>
          </>
        }
      >
        <form id="product-form" className="grid gap-3" onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="p-name" label="Tên">
              <Input
                id="p-name"
                required
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              />
            </Field>
            <Field id="p-slug" label="Slug (tuỳ chọn)">
              <Input
                id="p-slug"
                value={form.slug}
                onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
              />
            </Field>
          </div>
          <Field id="p-desc" label="Mô tả">
            <Textarea
              id="p-desc"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field id="p-price" label="Giá (VND)">
              <Input
                id="p-price"
                type="number"
                required
                min={0}
                value={form.price || ""}
                onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))}
              />
            </Field>
            <label className="grid gap-1 text-xs font-medium text-slate-500">
              Danh mục
              <select
                className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800"
                value={form.category}
                onChange={(e) =>
                  setForm((s) => ({ ...s, category: e.target.value as ProductCategory }))
                }
              >
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
            <Field id="p-stock" label="Tồn kho">
              <Input
                id="p-stock"
                type="number"
                required
                min={0}
                value={form.stock || ""}
                onChange={(e) => setForm((s) => ({ ...s, stock: Number(e.target.value) }))}
              />
            </Field>
          </div>
          <Field id="p-img" label="Ảnh (URL)">
            <Input
              id="p-img"
              value={form.imageUrl}
              onChange={(e) => setForm((s) => ({ ...s, imageUrl: e.target.value }))}
            />
          </Field>
          <CheckboxField
            id="p-active"
            label="Đang bán"
            checked={form.active}
            onChange={(e) => setForm((s) => ({ ...s, active: e.target.checked }))}
          />
        </form>
      </Modal>
    </Stack>
  );
}
