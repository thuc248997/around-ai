import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@libs/server/db"
import { Locale, LOCALES, localeUrl, VI_SUFFIX } from "@libs/i18n"

type Entry = { path: string; locales: Set<Locale>; lastmod?: Date }

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const rows = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  })
  // a `<slug>-vi` row is the /vi version of `<slug>`; list each URL only in the languages it was written in
  const entries = new Map<string, Entry>()
  let latest: Date | undefined
  for (const r of rows) {
    const vi = r.slug.endsWith(VI_SUFFIX)
    const path = `/${vi ? r.slug.slice(0, -VI_SUFFIX.length) : r.slug}`
    const e = entries.get(path) || { path, locales: new Set<Locale>() }
    e.locales.add(vi ? "vi" : "en")
    if (!e.lastmod || e.lastmod < r.updatedAt) e.lastmod = r.updatedAt
    if (!latest || latest < r.updatedAt) latest = r.updatedAt
    entries.set(path, e)
  }
  const all = [
    { path: "/", locales: new Set(LOCALES), lastmod: latest },
    { path: "/blog", locales: new Set(LOCALES), lastmod: latest },
    ...[...entries.values()].filter((e) => e.locales.has("en")), // a translation alone has no page
  ]

  const urls = all.flatMap((e) => {
    const locales = [...e.locales]
    const alternates =
      locales.length > 1
        ? [...locales, "x-default" as const]
            .map((l) => {
              const href = localeUrl(e.path, l === "x-default" ? "en" : l)
              return `<xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`
            })
            .join("")
        : ""
    return locales.map(
      (l) =>
        `<url><loc>${localeUrl(e.path, l)}</loc>${
          e.lastmod ? `<lastmod>${e.lastmod.toISOString()}</lastmod>` : ""
        }${alternates}</url>`
    )
  })
  res.setHeader("Content-Type", "application/xml; charset=utf-8")
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600")
  res.send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join(
      "\n"
    )}\n</urlset>`
  )
}
