import Link from "next/link";
import { fetchNewsList } from "@/lib/newsApi";
import { Tag } from "@/components/ui/Tag";

export const metadata = {
  title: "News",
};

function isVideo(url: string) {
  return /\.mp4(\?|#|$)/i.test(url);
}

export default async function NewsPage() {
  const { data } = await fetchNewsList();

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">News</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Data from Railway API.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          Manage in dashboard
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((item) => (
          <Link
            key={item._id}
            href={`/news/${item._id}`}
            className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold leading-6 tracking-tight group-hover:underline">
                {item.title}
              </h2>
              <Tag className={item.status ? "" : "opacity-60"}>
                {item.status ? "Active" : "Inactive"}
              </Tag>
            </div>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {item.description}
            </p>

            {item.thumbnail ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                {isVideo(item.thumbnail) ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    className="aspect-video w-full bg-black object-cover"
                    src={item.thumbnail}
                    preload="metadata"
                    muted
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
          </Link>
        ))}
      </div>
    </div>
  );
}

