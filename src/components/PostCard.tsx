import Link from "next/link"
import { CONFIG } from "site.config"
import { formatShortDate, postDate } from "@libs/utils"
import { TPost } from "@customTypes/index"

type Props = { data: TPost }

const MAX_TAGS = 3

/** Archive row: short date on the left, title / excerpt / tags on the right */
const PostCard: React.FC<Props> = ({ data }) => {
  const date = postDate(data)
  const extra = data.tags.length - MAX_TAGS
  return (
    <article className="group relative grid gap-1 py-7 sm:grid-cols-[5.5rem_1fr] sm:gap-4">
      <time dateTime={date} className="pt-1 text-xs text-term-muted">
        {formatShortDate(date, CONFIG.lang)}
      </time>
      <div className="min-w-0">
        <h3 className="text-[17px] font-bold leading-snug text-term-fg group-hover:text-term-green">
          {data.category && (
            <span className="mr-2 inline-block -translate-y-px rounded border border-term-line px-1.5 py-px align-middle text-[10px] font-medium uppercase tracking-wider text-term-amber">
              {data.category}
            </span>
          )}
          <Link href={`/${data.slug}`} className="after:absolute after:inset-0">
            {data.title}
          </Link>
        </h3>
        {data.summary && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-term-muted">{data.summary}</p>
        )}
        {data.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-x-3 text-xs text-term-muted/80">
            {data.tags.slice(0, MAX_TAGS).map((t) => (
              <span key={t}>#{t}</span>
            ))}
            {extra > 0 && <span>+{extra}</span>}
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard
