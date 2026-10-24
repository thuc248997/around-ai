import type { NextApiRequest, NextApiResponse } from "next"
import { CONFIG } from "site.config"
import { prisma } from "@libs/server/db"

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const rows = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  })
  const urls = [
    `<url><loc>${CONFIG.link}</loc></url>`,
    ...rows.map(
      (r) => `<url><loc>${CONFIG.link}/${r.slug}</loc><lastmod>${r.updatedAt.toISOString()}</lastmod></url>`
    ),
  ]
  res.setHeader("Content-Type", "application/xml; charset=utf-8")
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600")
  res.send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`
  )
}
