import type { NextApiRequest, NextApiResponse } from "next"
import { CONFIG } from "site.config"
import { getPublishedPosts } from "@libs/server/posts"

const esc = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => `&${{ "<": "lt", ">": "gt", "&": "amp", "'": "apos", '"': "quot" }[c]};`)

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const posts = await getPublishedPosts()
  const items = posts
    .slice(0, 50)
    .map(
      (p) => `<item>
  <title>${esc(p.title)}</title>
  <link>${CONFIG.link}/${p.slug}</link>
  <guid>${CONFIG.link}/${p.slug}</guid>
  <pubDate>${new Date(p.publishedAt || p.createdAt).toUTCString()}</pubDate>
  <description>${esc(p.summary)}</description>
</item>`
    )
    .join("\n")

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8")
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600")
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(CONFIG.blog.title)}</title>
<link>${CONFIG.link}</link>
<description>${esc(CONFIG.blog.description)}</description>
${items}
</channel></rss>`)
}
