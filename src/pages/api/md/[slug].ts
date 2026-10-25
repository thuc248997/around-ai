import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@libs/server/db"
import { postMarkdown } from "@libs/server/agentText"
import { VI_SUFFIX } from "@libs/i18n"

// /<slug>.md and /vi/<slug>.md: the raw markdown of a post, for agents
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = String(req.query.slug)
  const slugs = req.query.lang === "vi" ? [`${slug}${VI_SUFFIX}`, slug] : [slug]
  const rows = await prisma.post.findMany({
    where: { slug: { in: slugs }, status: { in: ["PUBLISHED", "UNLISTED"] } },
  })
  const post = slugs.map((s) => rows.find((r) => r.slug === s)).find(Boolean)
  if (!post) return res.status(404).send("Not found")
  res.setHeader("Content-Type", "text/markdown; charset=utf-8")
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600")
  if (post.status === "UNLISTED") res.setHeader("X-Robots-Tag", "noindex")
  res.send(postMarkdown(post))
}
