import { GetServerSideProps } from "next"
import Link from "next/link"
import { FiArrowLeft } from "react-icons/fi"
import { CONFIG } from "site.config"
import Layout from "@components/Layout"
import Markdown from "@components/Markdown"
import Tag from "@components/Tag"
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
    <article className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14">
      {!isPage && (
        <nav className="mb-10 flex items-center gap-2 text-xs text-term-muted">
          <Link href="/blog" className="inline-flex items-center gap-1.5 hover:text-term-green">
            <FiArrowLeft /> cd ~/blog
          </Link>
          {post.category && (
            <>
              <span aria-hidden>/</span>
              <span className="text-term-amber">{post.category}</span>
            </>
          )}
        </nav>
      )}
      <header className="mb-10 border-b border-term-line pb-8">
        {!isPage && (
          <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-term-muted">
            <span className="text-term-green">$</span>
            <time dateTime={date}>{formatDate(date, CONFIG.lang)}</time>
            <span aria-hidden>·</span>
            <span>{readingTime(post.content)} min read</span>
            <span aria-hidden>·</span>
            <span>by {CONFIG.profile.name}</span>
          </div>
        )}
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-term-fg sm:text-[2.4rem]">
          {post.title}
        </h1>
        {post.summary && !isPage && (
          <p className="mt-5 border-l-2 border-term-green pl-4 text-[15px] leading-relaxed text-term-muted">
            {post.summary}
          </p>
        )}
      </header>

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt=""
          className="mb-10 w-full rounded-lg border border-term-line object-cover"
        />
      )}

      <Markdown content={post.content} />

      {post.tags.length > 0 && (
        <div className="mt-12 flex flex-wrap gap-2 border-t border-term-line pt-6">
          {post.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}

      {!isPage && (
        <div className="card mt-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Behind the notebook</p>
            <p className="text-sm text-term-muted">
              Written by <span className="font-bold text-term-fg">{CONFIG.profile.name}</span>,{" "}
              {CONFIG.profile.role}.
            </p>
          </div>
          <Link href="/blog" className="btn-term-outline shrink-0 !text-xs">
            <FiArrowLeft /> All posts
          </Link>
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
