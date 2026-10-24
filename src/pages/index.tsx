import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { FiSearch } from "react-icons/fi"
import { CONFIG } from "site.config"
import Layout from "@components/Layout"
import PostCard from "@components/PostCard"
import SocialLinks from "@components/SocialLinks"
import Tag from "@components/Tag"
import { countTags, getPublishedPosts } from "@libs/server/posts"
import { TPost, TTags } from "@customTypes/index"
import { NextPageWithLayout } from "./_app"

type Props = { posts: TPost[]; tags: TTags }

export const getServerSideProps: GetServerSideProps<Props> = async ({ res }) => {
  const posts = await getPublishedPosts()
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600")
  return { props: { posts, tags: countTags(posts) } }
}

const FeedPage: NextPageWithLayout<Props> = ({ posts, tags }) => {
  const router = useRouter()
  const [q, setQ] = useState("")
  const currentTag = typeof router.query.tag === "string" ? router.query.tag : undefined

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase()
    return posts.filter((p) => {
      if (currentTag && !p.tags.includes(currentTag)) return false
      if (!keyword) return true
      return [p.title, p.summary, p.category, ...p.tags].join(" ").toLowerCase().includes(keyword)
    })
  }, [posts, q, currentTag])

  return (
    <div className="mx-auto max-w-3xl">
      <section className="pb-10 pt-14 sm:pt-20">
        <p className="mb-3 text-sm font-medium text-accent-600 dark:text-accent-400">
          {CONFIG.profile.role}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          Notes on AI, by {CONFIG.profile.name}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {CONFIG.profile.bio}
        </p>
        <SocialLinks className="-ml-2 mt-5" />
      </section>

      <div className="sticky top-14 z-30 -mx-4 space-y-3 bg-white/90 px-4 py-3 backdrop-blur-md dark:bg-zinc-950/90">
        <label className="relative block">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts…"
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </label>
        {Object.keys(tags).length > 0 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {Object.entries(tags).map(([t, n]) => (
              <Tag key={t} active={t === currentTag} count={n}>
                {t}
              </Tag>
            ))}
          </div>
        )}
      </div>

      <section className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-900">
        {filtered.map((p) => (
          <PostCard key={p.id} data={p} />
        ))}
        {!filtered.length && (
          <p className="py-16 text-center text-zinc-500">
            {posts.length ? "No posts match your search." : "No posts yet — check back soon."}
          </p>
        )}
      </section>
    </div>
  )
}

FeedPage.getLayout = (page) => (
  <Layout
    metaConfig={{
      title: CONFIG.blog.title,
      description: CONFIG.blog.description,
      type: "website",
      url: CONFIG.link,
    }}
  >
    {page}
  </Layout>
)

export default FeedPage
