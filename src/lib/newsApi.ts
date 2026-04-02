export type NewsItem = {
  _id: string;
  title: string;
  description: string;
  status: boolean;
  thumbnail: string;
  createdAt?: string;
  updatedAt?: string;
};

export type NewsListResponse = {
  data: NewsItem[];
  total: number;
  page: number;
  limit: number;
  nextPage: boolean;
  prePage: boolean;
};

const BASE_URL = "https://blog-data.up.railway.app";

function toUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${normalized}`;
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `Request failed (${res.status})`);
  }
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export async function fetchNewsList(init?: RequestInit): Promise<NewsListResponse> {
  const res = await fetch(toUrl("/news"), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  return parseJson<NewsListResponse>(res);
}

export async function fetchNewsDetail(
  id: string,
  init?: RequestInit,
): Promise<NewsItem> {
  const res = await fetch(toUrl(`/news/${encodeURIComponent(id)}`), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  return parseJson<NewsItem>(res);
}

export type NewsUpsertInput = Pick<
  NewsItem,
  "title" | "description" | "status" | "thumbnail"
>;

export async function createNews(input: NewsUpsertInput): Promise<NewsItem> {
  const res = await fetch(toUrl("/news"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });
  return parseJson<NewsItem>(res);
}

export async function updateNews(
  id: string,
  input: Partial<NewsUpsertInput>,
): Promise<NewsItem> {
  const res = await fetch(toUrl(`/news/${encodeURIComponent(id)}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });
  return parseJson<NewsItem>(res);
}

export async function deleteNews(id: string): Promise<{ ok: true } | unknown> {
  const res = await fetch(toUrl(`/news/${encodeURIComponent(id)}`), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });
  return parseJson(res);
}

