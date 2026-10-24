import type { Attachment, Post, Prisma } from "@prisma/client"
import { prisma } from "./db"
import { TAttachment, TPost, TPostDetail } from "@customTypes/index"

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

/** Posts shown on the public feed, newest first */
export async function getPublishedPosts() {
  const rows = await prisma.post.findMany({
    where: { status: "PUBLISHED", type: "POST" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: listSelect,
  })
  return rows.map(serializePost)
}

/** A post or page reachable by URL (published or unlisted) */
export async function getPublicPostBySlug(slug: string) {
  const post = await prisma.post.findFirst({
    where: { slug, status: { in: ["PUBLISHED", "UNLISTED"] } },
  })
  return post ? serializePostDetail(post) : null
}

export function countTags(posts: TPost[]) {
  const tags: Record<string, number> = {}
  for (const p of posts) for (const t of p.tags) tags[t] = (tags[t] || 0) + 1
  return Object.fromEntries(Object.entries(tags).sort((a, b) => b[1] - a[1]))
}
