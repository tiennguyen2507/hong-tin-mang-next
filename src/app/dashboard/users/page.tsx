"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Stack } from "@/components/ui/Stack";
import type { User } from "@/lib/models";
import { apiJson } from "@/lib/apiClient";

const emptyForm = {
  id: null as string | null,
  email: "",
  name: "",
  phone: "",
  role: "customer" as "customer" | "admin",
};

export default function DashboardUsersPage() {
  const [items, setItems] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);

  const load = React.useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const r = await apiJson<{ data: User[] }>("/api/users");
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

  function openEdit(u: User) {
    setForm({
      id: u._id,
      email: u.email,
      name: u.name,
      phone: u.phone ?? "",
      role: u.role,
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
        email: form.email,
        name: form.name,
        phone: form.phone || undefined,
        role: form.role,
      };
      if (form.id) {
        await apiJson(`/api/users/${form.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await apiJson("/api/users", {
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
    if (!confirm("Xóa người dùng này?")) return;
    setError(null);
    try {
      await apiJson(`/api/users/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xóa thất bại");
    }
  }

  return (
    <Stack gap={4}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Người dùng</h1>
          <p className="text-sm text-slate-600">Khách và tài khoản quản trị.</p>
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
            + Thêm người dùng
          </Button>
        </div>
      </div>

      {error ? <Alert variant="destructive">{error}</Alert> : null}
      {loading ? <p className="text-sm text-slate-500">Đang tải...</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Điện thoại</th>
              <th className="px-3 py-2">Vai trò</th>
              <th className="px-3 py-2 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u._id} className="border-b border-slate-50">
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2 font-medium">{u.name}</td>
                <td className="px-3 py-2">{u.phone ?? "—"}</td>
                <td className="px-3 py-2">{u.role === "admin" ? "Quản trị" : "Khách"}</td>
                <td className="px-3 py-2 text-right">
                  <Button variant="ghost" size="sm" type="button" onClick={() => openEdit(u)}>
                    Sửa
                  </Button>
                  <Button variant="danger" size="sm" type="button" onClick={() => void onDelete(u._id)}>
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
        title={form.id ? "Sửa người dùng" : "Thêm người dùng"}
        footer={
          <>
            <Button variant="secondary" type="button" onClick={closeModal}>
              Hủy
            </Button>
            <Button
              className="bg-[#2563eb] hover:bg-[#1d4ed8]"
              type="submit"
              form="user-form"
            >
              Lưu
            </Button>
          </>
        }
      >
        <form id="user-form" className="grid gap-3" onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="u-email" label="Email">
              <Input
                id="u-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              />
            </Field>
            <Field id="u-name" label="Tên">
              <Input
                id="u-name"
                required
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              />
            </Field>
          </div>
          <Field id="u-phone" label="Điện thoại">
            <Input
              id="u-phone"
              value={form.phone}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
            />
          </Field>
          <label className="grid gap-1 text-xs font-medium text-slate-500">
            Vai trò
            <select
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm"
              value={form.role}
              onChange={(e) =>
                setForm((s) => ({ ...s, role: e.target.value as "customer" | "admin" }))
              }
            >
              <option value="customer">Khách</option>
              <option value="admin">Quản trị</option>
            </select>
          </label>
        </form>
      </Modal>
    </Stack>
  );
}
