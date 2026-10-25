import type { Prisma } from "@prisma/client"
import { slugify } from "@libs/utils"

const STATUSES = ["DRAFT", "PUBLISHED", "UNLISTED"] as const
const TYPES = ["POST", "PAGE"] as const

/** Validates an editor payload; returns prisma data or an error message */
export function parsePostInput(
  body: any,
  current?: { publishedAt: Date | null }
): { data: Prisma.PostUncheckedCreateInput } | { error: string } {
  const title = String(body?.title ?? "").trim()
  if (!title) return { error: "Title is required" }

  const slug = slugify(String(body?.slug || title))
  if (!slug) return { error: "Slug is invalid" }
  if (["admin", "api", "uploads", "blog"].includes(slug)) {
    return { error: `Slug "${slug}" is reserved` }
  }

  const status = STATUSES.includes(body?.status) ? body.status : "DRAFT"
  const type = TYPES.includes(body?.type) ? body.type : "POST"

  const tags: string[] = Array.isArray(body?.tags)
    ? body.tags
    : String(body?.tags ?? "").split(",")

  let publishedAt: Date | null = current?.publishedAt ?? null
  if (body?.publishedAt) {
    const d = new Date(body.publishedAt)
    if (isNaN(d.getTime())) return { error: "Publish date is invalid" }
    publishedAt = d
  }
  if (status !== "DRAFT" && !publishedAt) publishedAt = new Date()

  return {
    data: {
      title,
      slug,
      summary: String(body?.summary ?? "").trim(),
      content: String(body?.content ?? ""),
      coverImage: String(body?.coverImage ?? "").trim() || null,
      category: String(body?.category ?? "").trim() || null,
      tags: [...new Set(tags.map((t) => String(t).trim()).filter(Boolean))],
      status,
      type,
      publishedAt,
    },
  }
}
