import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { FiArrowRight, FiArrowUpRight, FiRss, FiSearch, FiX } from "react-icons/fi"
import { CONFIG } from "site.config"
import Layout from "@components/Layout"
import PostCard from "@components/PostCard"
import { countTags, getPublishedPosts } from "@libs/server/posts"
import { dateLocale, toLocale, useT } from "@libs/i18n"
import { formatDate, postDate } from "@libs/utils"
import { TPost, TTags } from "@customTypes/index"
import { NextPageWithLayout } from "./_app"

type Props = { posts: TPost[]; tags: TTags }

export const getServerSideProps: GetServerSideProps<Props> = async ({ res, locale }) => {
  const posts = await getPublishedPosts(toLocale(locale))
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600")
  return { props: { posts, tags: countTags(posts) } }
}

const PAGE_SIZE = 10

const BlogPage: NextPageWithLayout<Props> = ({ posts, tags }) => {
  const router = useRouter()
  const { locale, t: tr, copy } = useT()
  const t = tr.blog
  const [q, setQ] = useState("")
  const [category, setCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const currentTag = typeof router.query.tag === "string" ? router.query.tag : undefined

  const categories = useMemo(() => {
    const c: Record<string, number> = {}
    for (const p of posts) if (p.category) c[p.category] = (c[p.category] || 0) + 1
    return Object.entries(c).sort((a, b) => b[1] - a[1])
  }, [posts])

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase()
    return posts.filter((p) => {
      if (currentTag && !p.tags.includes(currentTag)) return false
      if (category && p.category !== category) return false
      if (!keyword) return true
      return [p.title, p.summary, p.category, ...p.tags].join(" ").toLowerCase().includes(keyword)
    })
  }, [posts, q, currentTag, category])

  useEffect(() => setPage(1), [q, currentTag, category])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // group the current page by year
  const groups = useMemo(() => {
    const g: [string, TPost[]][] = []
    for (const p of visible) {
      const y = String(new Date(postDate(p)).getFullYear())
      if (g.length && g[g.length - 1][0] === y) g[g.length - 1][1].push(p)
      else g.push([y, [p]])
    }
    return g
  }, [visible])
  const yearCount = (y: string) => filtered.filter((p) => String(new Date(postDate(p)).getFullYear()) === y).length

  const [latest, second] = posts
  const readingPaths = Object.entries(tags).slice(0, 3)

  return (
    <>
      {/* title */}
      <section className="border-b border-term-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:py-20">
          <div>
            <p className="eyebrow mb-4">
              <span className="text-term-muted">~/</span>{t.crumb}
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-term-fg sm:text-6xl">
              {t.title}
              <br />
              <span className="cursor text-term-green">{t.titleAccent}</span>
            </h1>
          </div>
          <div>
            <p className="text-[15px] leading-relaxed text-term-fg/90">
              {t.lead}
            </p>
            <p className="mt-5 border-t border-term-line pt-3 text-[10px] uppercase tracking-[0.18em] text-term-muted">
              {t.by(CONFIG.profile.name)}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* featured */}
        {latest && (
          <section className="grid gap-4 pt-12 lg:grid-cols-[2fr_1fr]">
            <article className="group relative flex flex-col rounded-lg bg-term-band p-7 text-[#cdd6de] sm:p-9">
              <div className="flex justify-between border-b border-white/10 pb-4 text-[10px] uppercase tracking-[0.18em] text-white/50">
                <span>{t.latest}</span>
                <time dateTime={postDate(latest)}>{formatDate(postDate(latest), dateLocale(locale))}</time>
              </div>
              {latest.category && <p className="mt-6 text-xs text-[#f0b946]">{latest.category}</p>}
              <h2 className="mt-3 text-2xl font-extrabold leading-snug text-white group-hover:text-[#4ade80] sm:text-3xl">
                <Link href={`/${latest.slug}`} className="after:absolute after:inset-0">
                  {latest.title}
                </Link>
              </h2>
              {latest.summary && (
                <p className="mt-4 line-clamp-3 max-w-2xl text-[13px] leading-relaxed text-white/60">
                  {latest.summary}
                </p>
              )}
              <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm text-white">
                <span className="text-[#4ade80]">$</span> {t.openEssay} <FiArrowUpRight />
              </span>
            </article>
            {second && (
              <article className="card group relative flex flex-col p-7">
                <div className="flex justify-between text-[10px] uppercase tracking-[0.18em] text-term-muted">
                  <span>{t.workbench}</span>
                  <span className="text-term-green">●</span>
                </div>
                <p className="mt-6 text-xl font-bold leading-snug text-term-fg">
                  {t.smallFix}
                  <br />
                  <span className="text-term-amber">{t.usefulLesson}</span>
                </p>
                <h2 className="mt-4 font-bold leading-snug text-term-fg group-hover:text-term-green">
                  <Link href={`/${second.slug}`} className="after:absolute after:inset-0">
                    {second.title}
                  </Link>
                </h2>
                {second.summary && (
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-term-muted">{second.summary}</p>
                )}
                <span className="mt-auto flex items-center justify-between border-t border-term-line pt-4 text-xs text-term-muted">
                  {t.openNote} <FiArrowUpRight />
                </span>
              </article>
            )}
          </section>
        )}

        <div className="grid gap-12 pt-16 lg:grid-cols-[1fr_17rem]">
          {/* archive */}
          <section>
            <div className="flex items-end justify-between border-b border-term-line pb-4">
              <h2 className="text-2xl font-bold text-term-fg">{t.archive}</h2>
              <span className="text-[10px] uppercase tracking-[0.18em] text-term-muted">{t.archiveRight}</span>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-md border border-term-line bg-term-surface p-1 text-xs">
                {[[null, posts.length] as const, ...categories].map(([name, n]) => {
                  const active = name === null ? !category : category === name
                  return (
                    <button
                      key={name ?? ""}
                      onClick={() => setCategory(name)}
                      className={`shrink-0 rounded px-3 py-1.5 transition-colors ${
                        active ? "bg-term-band text-[#4ade80]" : "text-term-muted hover:text-term-fg"
                      }`}
                    >
                      {name ?? t.all} <span className="opacity-60">{n}</span>
                    </button>
                  )
                })}
              </div>
              <label className="relative block sm:w-64">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-term-muted" />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t.search}
                  className="w-full rounded-md border border-term-line bg-term-surface py-2 pl-9 pr-3 text-[13px] text-term-fg outline-none transition placeholder:text-term-muted/70 focus:border-term-green focus:ring-2 focus:ring-term-green/20"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-term-muted">
              <span>
                <span className="font-bold text-term-fg">{filtered.length}</span> {t.posts(filtered.length)}
              </span>
              {currentTag && (
                <Link
                  href="/blog"
                  scroll={false}
                  className="inline-flex items-center gap-1 rounded border border-term-green px-2 py-0.5 text-term-green"
                >
                  #{currentTag} <FiX />
                </Link>
              )}
            </div>

            {groups.map(([year, items]) => (
              <div key={year} className="mt-8">
                <p className="text-sm font-bold text-term-fg">
                  {year} <span className="ml-1 text-xs font-normal text-term-muted">{yearCount(year)} {t.posts(yearCount(year))}</span>
                </p>
                <div className="divide-y divide-term-line border-b border-term-line">
                  {items.map((p) => (
                    <PostCard key={p.id} data={p} />
                  ))}
                </div>
              </div>
            ))}
            {!filtered.length && (
              <p className="py-16 text-center text-sm text-term-muted">
                {posts.length ? t.noMatch : tr.home.noPosts}
              </p>
            )}

            {pages > 1 && (
              <nav className="mt-8 flex items-center justify-between text-xs" aria-label="Pagination">
                <button
                  onClick={() => setPage((n) => n - 1)}
                  disabled={page === 1}
                  className="text-term-fg hover:text-term-green disabled:text-term-muted/50"
                >
                  {t.prev}
                </button>
                <span className="text-term-muted">
                  {t.pageOf(page, pages)}
                </span>
                <button
                  onClick={() => setPage((n) => n + 1)}
                  disabled={page === pages}
                  className="text-term-fg hover:text-term-green disabled:text-term-muted/50"
                >
                  {t.next}
                </button>
              </nav>
            )}
          </section>

          {/* sidebar */}
          <aside className="space-y-6 lg:border-l lg:border-term-line lg:pl-8">
            {readingPaths.length > 0 && (
              <div>
                <p className="eyebrow mb-3">{t.pathEyebrow}</p>
                <p className="text-xl font-bold leading-snug text-term-fg">{t.pathTitle}</p>
                <p className="mt-2 text-xs text-term-muted">{t.pathText}</p>
                <ol className="mt-4 divide-y divide-term-line">
                  {readingPaths.map(([t, n], i) => (
                    <li key={t} className="py-4">
                      <Link href={`/blog?tag=${encodeURIComponent(t)}`} scroll={false} className="group block">
                        <span className="text-[11px] text-term-amber">0{i + 1} /</span>
                        <span className="mt-1 block font-bold text-term-fg group-hover:text-term-green">#{t}</span>
                        <span className="text-xs text-term-muted">{n} {tr.blog.posts(n)}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div className="card p-5">
              <p className="eyebrow mb-3">{t.behind}</p>
              <p className="text-lg font-bold leading-snug text-term-fg">
                {t.builtInPractice}
                <br />
                <span className="text-term-green">{t.sharedInPublic}</span>
              </p>
              <p className="mt-3 text-xs leading-relaxed text-term-muted">{copy.profile.bio}</p>
              <Link href="/about" className="link-term mt-4 !text-xs">
                {t.meet} <FiArrowRight />
              </Link>
            </div>
            <div className="card p-5">
              <p className="text-sm font-bold text-term-fg">{t.follow}</p>
              <p className="mt-1 text-xs text-term-muted">{t.followText}</p>
              {/* /feed is an API rewrite, not a page */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/feed" className="btn-term-outline mt-4 !py-2 !text-xs">
                <FiRss /> {t.subscribe}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

BlogPage.getLayout = (page) => (
  <Layout
    metaConfig={{
      title: `Blog | ${CONFIG.blog.title}`,
      type: "website",
      path: "/blog",
    }}
  >
    {page}
  </Layout>
)

export default BlogPage
