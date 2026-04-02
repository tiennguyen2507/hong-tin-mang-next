import { NextResponse } from "next/server";
import { createNews, fetchNewsList, type NewsUpsertInput } from "@/lib/newsApi";

export async function GET() {
  try {
    const data = await fetchNewsList();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<NewsUpsertInput>;

    if (
      typeof body.title !== "string" ||
      typeof body.description !== "string" ||
      typeof body.thumbnail !== "string" ||
      typeof body.status !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Invalid body" },
        { status: 400 },
      );
    }

    const created = await createNews({
      title: body.title,
      description: body.description,
      status: body.status,
      thumbnail: body.thumbnail,
    });
    return NextResponse.json(created);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}

