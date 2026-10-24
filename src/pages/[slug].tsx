import { GetServerSideProps } from "next"
import Link from "next/link"
import { FiArrowLeft } from "react-icons/fi"
import { CONFIG } from "site.config"
import Layout from "@components/Layout"
import Markdown from "@components/Markdown"
import Utterances from "@components/Utterances"
import { getPublicPostBySlug } from "@libs/server/posts"
import { formatDate, readingTime } from "@libs/utils"
import { TPostDetail } from "@customTypes/index"
import { NextPageWithLayout } from "./_app"

type Props = { post: TPostDetail }

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, res }) => {
  const post = await getPublicPostBySlug(String(params?.slug))
  if (!post) return { notFound: true }
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600")
  return { props: { post } }
}

const DetailPage: NextPageWithLayout<Props> = ({ post }) => {
  const isPage = post.type === "PAGE"
  const date = post.publishedAt || post.createdAt

  return (
    <article className="mx-auto max-w-3xl pt-10 sm:pt-14">
      {!isPage && (
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <FiArrowLeft /> All posts
        </Link>
      )}
      <header className="mb-10">
        {!isPage && (
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
            <time dateTime={date}>{formatDate(date, CONFIG.lang)}</time>
            <span aria-hidden>·</span>
            <span>{readingTime(post.content)} min read</span>
            {post.category && (
              <span className="rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-500/10 dark:text-accent-400">
                {post.category}
              </span>
            )}
          </div>
        )}
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-[2.6rem] dark:text-white">
          {post.title}
        </h1>
        {post.summary && !isPage && (
          <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">{post.summary}</p>
        )}
      </header>

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt=""
          className="mb-10 w-full rounded-2xl border border-zinc-200 object-cover dark:border-zinc-800"
        />
      )}

      <Markdown content={post.content} />

      {post.tags.length > 0 && (
        <div className="mt-12 flex flex-wrap gap-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          {post.tags.map((t) => (
            <Link
              key={t}
              href={`/?tag=${encodeURIComponent(t)}`}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-accent-50 hover:text-accent-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-accent-500/10 dark:hover:text-accent-400"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      {!isPage && CONFIG.utterances.enable && <Utterances issueTerm={post.slug} />}
    </article>
  )
}

DetailPage.getLayout = (page) => {
  const post: TPostDetail = page.props.post
  return (
    <Layout
      metaConfig={{
        title: `${post.title} | ${CONFIG.blog.title}`,
        description: post.summary || CONFIG.blog.description,
        type: post.type === "POST" ? "article" : "website",
        date: post.publishedAt || post.createdAt,
        image: post.coverImage,
        url: `${CONFIG.link}/${post.slug}`,
        noindex: post.status === "UNLISTED",
      }}
    >
      {page}
    </Layout>
  )
}

export default DetailPage
