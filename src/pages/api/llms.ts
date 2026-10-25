import type { NextApiRequest, NextApiResponse } from "next"
import { getAgentPosts, llmsFullTxt, llmsTxt } from "@libs/server/agentText"

// /llms.txt (index) and /llms-full.txt (?full=1, every post inline): https://llmstxt.org
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const posts = await getAgentPosts()
  res.setHeader("Content-Type", "text/plain; charset=utf-8")
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600")
  res.send(req.query.full ? llmsFullTxt(posts) : llmsTxt(posts))
}
