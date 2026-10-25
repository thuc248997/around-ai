import type { Attachment, Post, Prisma } from "@prisma/client"
import { prisma } from "./db"
import { TAttachment, TPost, TPostDetail } from "@customTypes/index"
import { Locale, VI_SUFFIX } from "@libs/i18n"

export const listSelect = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  coverImage: true,
  tags: true,
  category: true,
  status: true,
  type: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PostSelect

type ListRow = Prisma.PostGetPayload<{ select: typeof listSelect }>

// picks fields explicitly so extra columns/relations never leak into page props
export function serializePost(p: ListRow): TPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    coverImage: p.coverImage,
    tags: p.tags,
    category: p.category,
    status: p.status,
    type: p.type,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }
}

export function serializePostDetail(p: Post): TPostDetail {
  return { ...serializePost(p), content: p.content }
}

export function serializeAttachment(a: Attachment): TAttachment {
  return {
    id: a.id,
    filename: a.filename,
    mimeType: a.mimeType,
    size: a.size,
    url: `/uploads/${a.storedName}`,
    createdAt: a.createdAt.toISOString(),
  }
}

export const isTranslationSlug = (slug: string) => slug.endsWith(VI_SUFFIX)

/**
 * Posts shown on the public feed, newest first. `<slug>-vi` rows are translations:
 * never listed on their own, but under /vi they replace the original's title/summary.
 */
export async function getPublishedPosts(locale: Locale = "en") {
  const rows = await prisma.post.findMany({
    where: { status: "PUBLISHED", type: "POST" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: listSelect,
  })
  const translations = new Map(
    rows.filter((r) => isTranslationSlug(r.slug)).map((r) => [r.slug.slice(0, -VI_SUFFIX.length), r])
  )
  return rows
    .filter((r) => !isTranslationSlug(r.slug))
    .map((r) => {
      const t = locale === "vi" ? translations.get(r.slug) : undefined
      return serializePost(t ? { ...r, title: t.title, summary: t.summary, category: t.category ?? r.category } : r)
    })
}

/**
 * A post or page reachable by URL (published or unlisted). Under /vi the `<slug>-vi`
 * translation wins when it exists; `translated` is false when it fell back to English.
 */
export async function getPublicPostBySlug(slug: string, locale: Locale = "en") {
  const viSlug = `${slug}${VI_SUFFIX}`
  const rows = await prisma.post.findMany({
    where: { slug: { in: [slug, viSlug] }, status: { in: ["PUBLISHED", "UNLISTED"] } },
  })
  const en = rows.find((r) => r.slug === slug)
  const vi = rows.find((r) => r.slug === viSlug)
  const post = locale === "vi" ? vi || en : en
  if (!post) return null
  // the languages this URL has real content in, for canonical/hreflang
  const locales: Locale[] = [...(en ? ["en" as const] : []), ...(vi ? ["vi" as const] : [])]
  return {
    post: { ...serializePostDetail(post), slug },
    translated: locale === "en" || post === vi,
    locales,
  }
}

export function countTags(posts: TPost[]) {
  const tags: Record<string, number> = {}
  for (const p of posts) for (const t of p.tags) tags[t] = (tags[t] || 0) + 1
  return Object.fromEntries(Object.entries(tags).sort((a, b) => b[1] - a[1]))
}
