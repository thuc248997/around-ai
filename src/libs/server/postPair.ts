import { Prisma, type Post } from "@prisma/client"
import { prisma } from "./db"
import { parsePostInput } from "./postInput"
import { VI_SUFFIX } from "@libs/i18n"

/** The `<slug>-vi` row holding the Vietnamese translation of an English post */
export const findTranslation = (slug: string) => prisma.post.findUnique({ where: { slug: `${slug}${VI_SUFFIX}` } })

// fields both languages always share, so they publish, unpublish and rename together
const sharedFields = (d: Prisma.PostUncheckedCreateInput) => ({
  slug: `${d.slug}${VI_SUFFIX}`,
  status: d.status,
  type: d.type,
  tags: d.tags,
  publishedAt: d.publishedAt,
  coverImage: d.coverImage,
})

/**
 * Saves an English post and its Vietnamese translation (`body.vi`) in one transaction.
 * The translation is created once a Vietnamese title or content is given; after that every
 * save keeps it in sync, even when `body.vi` is omitted.
 */
export async function savePostPair(
  body: any,
  current?: Post
): Promise<{ post: Post; translation: Post | null } | { error: string; status: number }> {
  const parsed = parsePostInput(body, current)
  if ("error" in parsed) return { ...parsed, status: 400 }
  const en = parsed.data
  if (en.slug.endsWith(VI_SUFFIX)) {
    return { error: `Slug can't end with "${VI_SUFFIX}": that suffix marks Vietnamese translations`, status: 400 }
  }

  const vi = body?.vi
  let viData: Prisma.PostUncheckedCreateInput | null = null
  if (vi && (String(vi.title ?? "").trim() || String(vi.content ?? "").trim())) {
    const parsedVi = parsePostInput({ title: vi.title, summary: vi.summary, content: vi.content, category: vi.category })
    if ("error" in parsedVi) return { error: `Vietnamese: ${parsedVi.error}`, status: 400 }
    const { title, summary, content, category } = parsedVi.data
    viData = { ...sharedFields(en), title, summary, content, category: category ?? en.category }
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const post = current
        ? await tx.post.update({ where: { id: current.id }, data: en })
        : await tx.post.create({ data: en })
      const existing = current
        ? await tx.post.findUnique({ where: { slug: `${current.slug}${VI_SUFFIX}` } })
        : null
      let translation: Post | null = null
      if (existing) {
        translation = await tx.post.update({ where: { id: existing.id }, data: viData ?? sharedFields(en) })
      } else if (viData) {
        translation = await tx.post.create({ data: viData })
      }
      return { post, translation }
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "Slug already exists (for this post or its -vi translation)", status: 409 }
    }
    throw e
  }
}

/** Deletes an English post together with its translation */
export const deletePostPair = (post: Post) =>
  prisma.$transaction([
    prisma.post.deleteMany({ where: { slug: `${post.slug}${VI_SUFFIX}` } }),
    prisma.post.delete({ where: { id: post.id } }),
  ])
