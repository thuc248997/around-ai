import type { NextApiRequest, NextApiResponse } from "next"
import { CONFIG } from "site.config"

// AI search and assistant crawlers, named so they are welcome even if a default rule changes later
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "CCBot",
  "DuckAssistBot",
  "MistralAI-User",
]

const rules = `Allow: /\nAllow: /api/og\nDisallow: /admin\nDisallow: /api/`

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8")
  res.setHeader("Cache-Control", "public, s-maxage=3600")
  res.send(
    `User-agent: *\n${rules}\n\n${AI_BOTS.map((b) => `User-agent: ${b}`).join("\n")}\n${rules}\n\n` +
      `# A summary of this site for LLMs: ${CONFIG.link}/llms.txt\n` +
      `Sitemap: ${CONFIG.link}/sitemap.xml\n`
  )
}
