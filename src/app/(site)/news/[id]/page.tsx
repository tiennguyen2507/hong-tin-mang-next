import Link from "next/link";
import { fetchNewsDetail, fetchNewsList } from "@/lib/newsApi";

type Props = {
  params: Promise<{ id: string }>;
};

function isVideo(url: string) {
  return /\.mp4(\?|#|$)/i.test(url);
}

function toTime(value?: string) {
  if (!value) return 0;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : 0;
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const [item, list] = await Promise.all([fetchNewsDetail(id), fetchNewsList()]);

  const suggestions = list.data
    .filter((x) => x._id !== item._id)
    .sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt))
    .slice(0, 4);

  return (
    <div className="grid gap-4 sm:gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/news"
          className="text-sm font-medium text-zinc-700 hover:underline dark:text-zinc-300"
        >
          ← Back to news
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
        {item.createdAt ? (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        ) : null}
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          {item.description}
        </p>

        {item.thumbnail ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            {isVideo(item.thumbnail) ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                className="aspect-video w-full bg-black object-cover"
                src={item.thumbnail}
                controls
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="aspect-video w-full bg-zinc-100 object-cover dark:bg-zinc-900"
                src={item.thumbnail}
                alt=""
                loading="lazy"
              />
            )}
          </div>
        ) : null}
      </div>

      {suggestions.length > 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
          <div className="text-sm font-semibold">Gợi ý mới nhất</div>
          <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-2">
            {suggestions.map((s) => (
              <Link
                key={s._id}
                href={`/news/${s._id}`}
                className="rounded-2xl border border-zinc-200 p-3 transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 sm:p-4"
              >
                <div className="text-sm font-semibold leading-6 line-clamp-2">
                  {s.title}
                </div>
                <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {s.description}
                </div>
                {s.createdAt ? (
                  <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                    {new Date(s.createdAt).toLocaleString()}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

