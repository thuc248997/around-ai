import Link from "next/link"
import { CONFIG } from "site.config"
import { formatDate } from "@libs/utils"
import { TPost } from "@customTypes/index"

type Props = { data: TPost }

const PostCard: React.FC<Props> = ({ data }) => (
  <article className="group relative -mx-4 flex gap-6 rounded-2xl p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60">
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
        <time dateTime={data.publishedAt || data.createdAt}>
          {formatDate(data.publishedAt || data.createdAt, CONFIG.lang)}
        </time>
        {data.category && (
          <span className="rounded-full bg-accent-50 px-2 py-0.5 font-medium text-accent-700 dark:bg-accent-500/10 dark:text-accent-400">
            {data.category}
          </span>
        )}
      </div>
      <h2 className="text-lg font-semibold leading-snug tracking-tight text-zinc-900 group-hover:text-accent-600 sm:text-xl dark:text-zinc-100 dark:group-hover:text-accent-400">
        <Link href={`/${data.slug}`} className="after:absolute after:inset-0">
          {data.title}
        </Link>
      </h2>
      {data.summary && (
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          {data.summary}
        </p>
      )}
      {data.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-500">
          {data.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
      )}
    </div>
    {data.coverImage && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={data.coverImage}
        alt=""
        loading="lazy"
        className="hidden h-24 w-36 shrink-0 rounded-xl border border-zinc-200 object-cover sm:block dark:border-zinc-800"
      />
    )}
  </article>
)

export default PostCard
