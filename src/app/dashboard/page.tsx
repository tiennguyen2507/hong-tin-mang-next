"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import type { NewsItem, NewsListResponse } from "@/lib/newsApi";
import { useLocalStore } from "@/hooks/useLocalStore";

type FormState = {
  title: string;
  description: string;
  thumbnail: string;
  status: boolean;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  thumbnail: "",
  status: true,
};

async function apiJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Request failed (${res.status})`);
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export default function DashboardPage() {
  const [dashboardAuth, setDashboardAuth, authHydrated] = useLocalStore<{
    ok: boolean;
  }>("htm.dashboard.auth", { ok: false });
  const [password, setPassword] = React.useState("");
  const [authError, setAuthError] = React.useState<string | null>(null);

  const [items, setItems] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<FormState>(emptyForm);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiJson<NewsListResponse>("/api/news", {
        cache: "no-store",
      });
      setItems(data.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!authHydrated || !dashboardAuth.ok) return;
    void refresh();
  }, [authHydrated, dashboardAuth.ok, refresh]);

  function onUnlock(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    if (password !== "helloword") {
      setAuthError("Sai mật khẩu.");
      return;
    }
    setDashboardAuth({ ok: true });
    setPassword("");
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(item: NewsItem) {
    setEditingId(item._id);
    setForm({
      title: item.title ?? "",
      description: item.description ?? "",
      thumbnail: item.thumbnail ?? "",
      status: Boolean(item.status),
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusyId(editingId ?? "new");
    try {
      if (editingId) {
        await apiJson<NewsItem>(`/api/news/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await apiJson<NewsItem>("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      startCreate();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this news item?")) return;
    setError(null);
    setBusyId(id);
    try {
      await apiJson(`/api/news/${id}`, { method: "DELETE" });
      if (editingId === id) startCreate();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function onToggleStatus(item: NewsItem) {
    setError(null);
    setBusyId(item._id);
    try {
      await apiJson<NewsItem>(`/api/news/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !item.status }),
      });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            CRUD tin tức qua API proxy `/api/news`.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/news"
            className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            View news
          </Link>
          {dashboardAuth.ok ? (
            <Button variant="secondary" size="sm" onClick={startCreate}>
              New
            </Button>
          ) : null}
        </div>
      </div>

      {!authHydrated ? (
        <div className="max-w-md rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Loading...
        </div>
      ) : !dashboardAuth.ok ? (
        <form
          onSubmit={onUnlock}
          className="max-w-md rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="text-sm font-semibold">Nhập mật khẩu</div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Nhập đúng mật khẩu để vào dashboard. Lần sau sẽ không cần nhập lại.
          </p>
          <div className="mt-3 grid gap-2.5">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {authError ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {authError}
              </div>
            ) : null}
            <Button type="submit" size="sm">
              Unlock
            </Button>
          </div>
        </form>
      ) : null}

      {dashboardAuth.ok ? (
        <>
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">
              {editingId ? "Edit news" : "Create news"}
            </div>
            {editingId ? <Tag>id: {editingId}</Tag> : <Tag>new</Tag>}
          </div>

          <div className="mt-3 grid gap-2.5">
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Title
              </span>
              <Input
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                placeholder="Title"
                required
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Description
              </span>
              <textarea
                className="min-h-24 w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-700 dark:focus:ring-zinc-800/60"
                value={form.description}
                onChange={(e) =>
                  setForm((s) => ({ ...s, description: e.target.value }))
                }
                placeholder="Description"
                required
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Thumbnail (url)
              </span>
              <Input
                value={form.thumbnail}
                onChange={(e) =>
                  setForm((s) => ({ ...s, thumbnail: e.target.value }))
                }
                placeholder="https://..."
                required
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950">
              <span className="font-medium">Status</span>
              <input
                type="checkbox"
                checked={form.status}
                onChange={(e) =>
                  setForm((s) => ({ ...s, status: e.target.checked }))
                }
              />
            </label>
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              type="submit"
              disabled={busyId === (editingId ?? "new")}
              className="flex-1"
              size="sm"
            >
              {busyId === (editingId ?? "new") ? "Saving..." : "Save"}
            </Button>
            {editingId ? (
              <Button
                variant="secondary"
                onClick={startCreate}
                disabled={busyId === (editingId ?? "new")}
                size="sm"
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">All news</div>
            <Button variant="ghost" size="sm" onClick={refresh} disabled={loading}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Loading...
            </div>
          ) : (
            <div className="mt-3 grid gap-2.5">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {item.title}
                      </div>
                      <div className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                        {item.description}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Tag className={item.status ? "" : "opacity-60"}>
                          {item.status ? "Active" : "Inactive"}
                        </Tag>
                        <Link
                          href={`/news/${item._id}`}
                          className="text-xs font-medium text-zinc-700 hover:underline dark:text-zinc-300"
                        >
                          Open detail
                        </Link>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => startEdit(item)}
                        disabled={busyId === item._id}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleStatus(item)}
                        disabled={busyId === item._id}
                      >
                        Toggle
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(item._id)}
                        disabled={busyId === item._id}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 ? (
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  No news yet.
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
        </>
      ) : null}
    </div>
  );
}

