"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CenteredPanel } from "@/components/ui/CenteredPanel";
import { CheckboxField } from "@/components/ui/CheckboxField";
import { Cluster } from "@/components/ui/Cluster";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { FormActions } from "@/components/ui/FormActions";
import { OutlineLink } from "@/components/ui/OutlineLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stack } from "@/components/ui/Stack";
import { Textarea } from "@/components/ui/Textarea";
import type { NewsItem, NewsListResponse } from "@/lib/newsApi";
import { useLocalStore } from "@/hooks/useLocalStore";
import { ActivityChartCard } from "@/components/dashboard/ActivityChartCard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { NewsTaskRow } from "@/components/dashboard/NewsTaskRow";
import { PublishProgress } from "@/components/dashboard/PublishProgress";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatGrid } from "@/components/dashboard/StatGrid";

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

function todayLabel() {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
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

  const published = items.filter((i) => i.status).length;
  const drafts = items.filter((i) => !i.status).length;

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
    if (!confirm("Xóa bài viết này?")) return;
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

  if (!authHydrated) {
    return (
      <CenteredPanel>
        <Card>
          <CardContent className="text-sm text-slate-600">Đang tải...</CardContent>
        </Card>
      </CenteredPanel>
    );
  }

  if (!dashboardAuth.ok) {
    return (
      <CenteredPanel>
        <Card>
          <CardTitle>Nhập mật khẩu</CardTitle>
          <p className="mt-1 text-sm text-slate-600">
            Nhập đúng mật khẩu để vào bảng điều khiển.
          </p>
          <form className="mt-4 grid gap-2.5" onSubmit={onUnlock}>
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {authError ? <Alert variant="destructive">{authError}</Alert> : null}
            <Button type="submit" size="sm">
              Mở khóa
            </Button>
          </form>
        </Card>
      </CenteredPanel>
    );
  }

  return (
    <DashboardShell
      onLogout={() => setDashboardAuth({ ok: false })}
      toolbar={
        <Cluster gap={2}>
          <Badge variant="outline" className="rounded-xl px-3 py-2 text-xs">
            {todayLabel()}
          </Badge>
          <OutlineLink href="/news">Xem trang tin</OutlineLink>
          <Button variant="secondary" size="sm" onClick={startCreate}>
            + Bài mới
          </Button>
        </Cluster>
      }
    >
      <Stack gap={5}>
        <StatGrid>
          <StatCard
            label="Tổng bài"
            value={items.length}
            hint={loading ? "Đang tải..." : `${items.length} bài trong hệ thống`}
            hintTone="neutral"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatCard
            label="Đã đăng"
            value={published}
            hint={`${published} bài hiển thị`}
            hintTone="up"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Nháp"
            value={drafts}
            hint={drafts ? "Cần duyệt hoặc xuất bản" : "Không có nháp"}
            hintTone={drafts ? "neutral" : "up"}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </StatGrid>

        <ActivityChartCard />

        {error ? <Alert>{error}</Alert> : null}

        <Stack gap={4}>
          <SectionHeader
            title="Tin tức"
            description="Tạo, sửa, đổi trạng thái và xóa bài."
            actions={
              <>
                <PublishProgress published={published} total={items.length} />
                <Button variant="ghost" size="sm" onClick={refresh} disabled={loading}>
                  Làm mới
                </Button>
              </>
            }
          />

          <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
            <Card>
              <form onSubmit={onSubmit}>
                <CardHeader>
                  <CardTitle>{editingId ? "Sửa bài" : "Bài mới"}</CardTitle>
                  {editingId ? (
                    <Tag className="border-slate-200 bg-slate-50 text-slate-600">
                      id: {editingId.slice(-8)}
                    </Tag>
                  ) : (
                    <Tag className="border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]">
                      mới
                    </Tag>
                  )}
                </CardHeader>
                <Stack gap={3} className="mt-3">
                  <Field id="news-title" label="Tiêu đề">
                    <Input
                      id="news-title"
                      value={form.title}
                      onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                      placeholder="Tiêu đề"
                      required
                      className="border-slate-200 bg-white"
                    />
                  </Field>
                  <Field id="news-description" label="Mô tả">
                    <Textarea
                      id="news-description"
                      value={form.description}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, description: e.target.value }))
                      }
                      placeholder="Nội dung ngắn"
                      required
                    />
                  </Field>
                  <Field id="news-thumbnail" label="Ảnh / video (URL)">
                    <Input
                      id="news-thumbnail"
                      value={form.thumbnail}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, thumbnail: e.target.value }))
                      }
                      placeholder="https://..."
                      required
                      className="border-slate-200 bg-white"
                    />
                  </Field>
                  <CheckboxField
                    id="news-published"
                    label="Đã đăng"
                    checked={form.status}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, status: e.target.checked }))
                    }
                  />
                </Stack>
                <FormActions>
                  <Button
                    type="submit"
                    disabled={busyId === (editingId ?? "new")}
                    className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8]"
                    size="sm"
                  >
                    {busyId === (editingId ?? "new") ? "Đang lưu..." : "Lưu"}
                  </Button>
                  {editingId ? (
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={startCreate}
                      disabled={busyId === (editingId ?? "new")}
                      size="sm"
                    >
                      Hủy
                    </Button>
                  ) : null}
                </FormActions>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danh sách</CardTitle>
                {loading ? (
                  <span className="text-xs text-slate-400">Đang tải...</span>
                ) : null}
              </CardHeader>
              <Stack gap={2} className="mt-3">
                {items.map((item) => (
                  <NewsTaskRow
                    key={item._id}
                    item={item}
                    busy={busyId === item._id}
                    onEdit={() => startEdit(item)}
                    onToggle={() => onToggleStatus(item)}
                    onDelete={() => onDelete(item._id)}
                  />
                ))}
                {!loading && items.length === 0 ? (
                  <EmptyState>Chưa có bài viết nào.</EmptyState>
                ) : null}
              </Stack>
            </Card>
          </div>
        </Stack>
      </Stack>
    </DashboardShell>
  );
}
