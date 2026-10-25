import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@libs/server/db"
import { LOCALES, localeUrl, VI_SUFFIX } from "@libs/i18n"

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const rows = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  })
  // every page exists under each locale; a `<slug>-vi` row is the /vi version of `<slug>`
  const lastmod = new Map<string, Date>()
  for (const r of rows) {
    const slug = r.slug.endsWith(VI_SUFFIX) ? r.slug.slice(0, -VI_SUFFIX.length) : r.slug
    const prev = lastmod.get(slug)
    if (!prev || prev < r.updatedAt) lastmod.set(slug, r.updatedAt)
  }
  const urls = LOCALES.flatMap((l) => [
    `<url><loc>${localeUrl("/", l)}</loc></url>`,
    `<url><loc>${localeUrl("/blog", l)}</loc></url>`,
    ...[...lastmod].map(
      ([slug, d]) => `<url><loc>${localeUrl(`/${slug}`, l)}</loc><lastmod>${d.toISOString()}</lastmod></url>`
    ),
  ])
  res.setHeader("Content-Type", "application/xml; charset=utf-8")
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600")
  res.send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`
  )
}
