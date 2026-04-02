import { NextResponse } from "next/server";
import {
  deleteNews,
  fetchNewsDetail,
  updateNews,
  type NewsUpsertInput,
} from "@/lib/newsApi";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const data = await fetchNewsDetail(id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = (await req.json()) as Partial<NewsUpsertInput>;

    const allowed: Partial<NewsUpsertInput> = {};
    if (typeof body.title === "string") allowed.title = body.title;
    if (typeof body.description === "string") allowed.description = body.description;
    if (typeof body.thumbnail === "string") allowed.thumbnail = body.thumbnail;
    if (typeof body.status === "boolean") allowed.status = body.status;

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updated = await updateNews(id, allowed);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const res = await deleteNews(id);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}

