import type { NextApiRequest, NextApiResponse } from "next"
import { CONFIG } from "site.config"

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "text/plain")
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${CONFIG.link}/sitemap.xml\n`)
}
