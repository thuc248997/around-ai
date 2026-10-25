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
  <dc:creator>${esc(CONFIG.profile.name)}</dc:creator>
${p.tags.map((t) => `  <category>${esc(t)}</category>`).join("\n")}
</item>`
    )
    .join("\n")

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8")
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600")
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>
<title>${esc(CONFIG.blog.title)}</title>
<link>${CONFIG.link}</link>
<atom:link href="${CONFIG.link}/feed" rel="self" type="application/rss+xml"/>
<description>${esc(CONFIG.blog.description)}</description>
<language>${CONFIG.lang}</language>
${posts[0] ? `<lastBuildDate>${new Date(posts[0].updatedAt).toUTCString()}</lastBuildDate>` : ""}
${items}
</channel></rss>`)
}
