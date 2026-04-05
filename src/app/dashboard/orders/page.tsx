"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Stack } from "@/components/ui/Stack";
import { Textarea } from "@/components/ui/Textarea";
import type { Order, OrderStatus, Product } from "@/lib/models";
import { apiJson } from "@/lib/apiClient";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  delivered: "Đã giao",
  cancelled: "Đã huỷ",
};

export default function DashboardOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [editOpen, setEditOpen] = React.useState(false);
  const [editOrder, setEditOrder] = React.useState<Order | null>(null);
  const [editStatus, setEditStatus] = React.useState<OrderStatus>("pending");

  const [addOpen, setAddOpen] = React.useState(false);
  const [addForm, setAddForm] = React.useState({
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    note: "",
  });
  const [lines, setLines] = React.useState<{ productId: string; quantity: number }[]>([
    { productId: "", quantity: 1 },
  ]);

  const load = React.useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const [or, pr] = await Promise.all([
        apiJson<{ data: Order[] }>("/api/orders"),
        apiJson<{ data: Product[] }>("/api/products?all=1"),
      ]);
      setOrders(or.data);
      setProducts(pr.data.filter((p) => p.active && p.stock > 0));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  function openEdit(o: Order) {
    setEditOrder(o);
    setEditStatus(o.status);
    setEditOpen(true);
  }

  function openAdd() {
    setAddForm({ customerName: "", customerPhone: "", deliveryAddress: "", note: "" });
    setLines([{ productId: "", quantity: 1 }]);
    setAddOpen(true);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editOrder) return;
    setError(null);
    try {
      await apiJson(`/api/orders/${editOrder._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus }),
      });
      setEditOpen(false);
      setEditOrder(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cập nhật thất bại");
    }
  }

  async function saveAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const validLines = lines.filter((l) => l.productId && l.quantity > 0);
    if (validLines.length === 0) {
      setError("Chọn ít nhất một sản phẩm.");
      return;
    }
    try {
      const items = validLines.map((l) => {
        const p = products.find((x) => x._id === l.productId);
        if (!p) throw new Error("Sản phẩm không hợp lệ");
        return {
          productId: p._id,
          name: p.name,
          price: p.price,
          quantity: l.quantity,
        };
      });
      await apiJson("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: addForm.customerName,
          customerPhone: addForm.customerPhone,
          deliveryAddress: addForm.deliveryAddress,
          note: addForm.note || undefined,
          items,
        }),
      });
      setAddOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tạo đơn thất bại");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Xóa đơn hàng này?")) return;
    setError(null);
    try {
      await apiJson(`/api/orders/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xóa thất bại");
    }
  }

  return (
    <Stack gap={4}>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h1 className="font-heading text-xl font-bold tracking-tight text-[var(--shop-text)] sm:text-2xl">Đơn hàng</h1>
          <p className="mt-1 text-sm leading-relaxed text-[var(--shop-muted)]">Theo dõi và cập nhật trạng thái đơn.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:shrink-0">
          <Button variant="secondary" size="sm" type="button" className="min-h-10 w-full touch-manipulation sm:w-auto" onClick={() => void load()}>
            Làm mới
          </Button>
          <Button
            className="min-h-10 w-full touch-manipulation bg-[var(--shop-primary)] hover:bg-[var(--shop-primary-hover)] sm:w-auto"
            size="sm"
            type="button"
            onClick={openAdd}
          >
            + Thêm đơn
          </Button>
        </div>
      </div>

      {error ? <Alert variant="destructive">{error}</Alert> : null}
      {loading ? <p className="text-sm text-[var(--shop-muted)]">Đang tải...</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-[var(--shop-border)] bg-[var(--shop-surface)] shadow-sm">
        <table className="min-w-full text-left text-sm text-[var(--shop-text)]">
          <thead className="border-b border-[var(--shop-border)] bg-[var(--shop-border)]/20 text-xs uppercase text-[var(--shop-muted)]">
            <tr>
              <th className="px-3 py-2">Mã</th>
              <th className="px-3 py-2">Khách</th>
              <th className="px-3 py-2">SĐT</th>
              <th className="px-3 py-2">Tổng</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-[var(--shop-border)]/60">
                <td className="px-3 py-2 font-mono text-xs">…{o._id.slice(-6)}</td>
                <td className="px-3 py-2 font-medium">{o.customerName}</td>
                <td className="px-3 py-2">{o.customerPhone}</td>
                <td className="px-3 py-2">{o.total.toLocaleString("vi-VN")} đ</td>
                <td className="px-3 py-2">{STATUS_LABEL[o.status]}</td>
                <td className="px-3 py-2 text-right">
                  <Button variant="ghost" size="sm" type="button" onClick={() => openEdit(o)}>
                    Sửa
                  </Button>
                  <Button variant="danger" size="sm" type="button" onClick={() => void onDelete(o._id)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditOrder(null);
        }}
        title="Chi tiết đơn hàng"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setEditOpen(false);
                setEditOrder(null);
              }}
            >
              Đóng
            </Button>
            <Button className="bg-[var(--shop-primary)] hover:bg-[var(--shop-primary-hover)]" type="submit" form="order-edit-form">
              Lưu trạng thái
            </Button>
          </>
        }
      >
        {editOrder ? (
          <form id="order-edit-form" className="grid gap-3" onSubmit={saveEdit}>
            <p className="text-sm text-[var(--shop-muted)]">
              {editOrder.customerName} · {editOrder.customerPhone}
            </p>
            <p className="text-xs text-[var(--shop-muted)]">{editOrder.deliveryAddress}</p>
            <p className="text-sm font-semibold text-[#1a56db]">
              {editOrder.total.toLocaleString("vi-VN")} đ
            </p>
            <ul className="list-inside list-disc text-xs text-[var(--shop-muted)]">
              {editOrder.items.map((it, i) => (
                <li key={i}>
                  {it.name} × {it.quantity} — {it.price.toLocaleString("vi-VN")} đ
                </li>
              ))}
            </ul>
            <label className="grid gap-1 text-xs font-medium text-[var(--shop-muted)]">
              Trạng thái
              <select
                className="h-10 rounded-xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-3 text-sm text-[var(--shop-text)]"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
              >
                {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>
          </form>
        ) : null}
      </Modal>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Tạo đơn thủ công"
        size="lg"
        footer={
          <>
            <Button variant="secondary" type="button" onClick={() => setAddOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-[var(--shop-primary)] hover:bg-[var(--shop-primary-hover)]" type="submit" form="order-add-form">
              Tạo đơn
            </Button>
          </>
        }
      >
        <form id="order-add-form" className="grid gap-3" onSubmit={saveAdd}>
          <Field id="o-name" label="Họ tên khách">
            <Input
              id="o-name"
              required
              value={addForm.customerName}
              onChange={(e) => setAddForm((s) => ({ ...s, customerName: e.target.value }))}
            />
          </Field>
          <Field id="o-phone" label="Số điện thoại">
            <Input
              id="o-phone"
              required
              value={addForm.customerPhone}
              onChange={(e) => setAddForm((s) => ({ ...s, customerPhone: e.target.value }))}
            />
          </Field>
          <Field id="o-addr" label="Địa chỉ giao">
            <Textarea
              id="o-addr"
              required
              className="min-h-20"
              value={addForm.deliveryAddress}
              onChange={(e) => setAddForm((s) => ({ ...s, deliveryAddress: e.target.value }))}
            />
          </Field>
          <Field id="o-note" label="Ghi chú">
            <Textarea
              id="o-note"
              className="min-h-16"
              value={addForm.note}
              onChange={(e) => setAddForm((s) => ({ ...s, note: e.target.value }))}
            />
          </Field>
          <div className="grid gap-2">
            <span className="text-xs font-medium text-[var(--shop-muted)]">Món trong đơn</span>
            {lines.map((line, idx) => (
              <div key={idx} className="flex flex-wrap gap-2">
                <select
                  className="min-w-[200px] flex-1 rounded-xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-3 py-2 text-sm text-[var(--shop-text)]"
                  value={line.productId}
                  onChange={(e) => {
                    const v = e.target.value;
                    setLines((prev) =>
                      prev.map((x, i) => (i === idx ? { ...x, productId: v } : x)),
                    );
                  }}
                >
                  <option value="">— Chọn sản phẩm —</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.price.toLocaleString("vi-VN")} đ)
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min={1}
                  className="w-24"
                  value={line.quantity || ""}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setLines((prev) =>
                      prev.map((x, i) => (i === idx ? { ...x, quantity: n } : x)),
                    );
                  }}
                />
                {lines.length > 1 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => setLines((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    Xóa dòng
                  </Button>
                ) : null}
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setLines((prev) => [...prev, { productId: "", quantity: 1 }])}
            >
              + Thêm dòng
            </Button>
          </div>
        </form>
      </Modal>
    </Stack>
  );
}
