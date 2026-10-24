import { withAdmin } from "@libs/server/auth"
import { prisma } from "@libs/server/db"
import { serializeAttachment } from "@libs/server/posts"

export default withAdmin(async (req, res) => {
  if (req.method !== "GET") return res.status(405).end()
  const where = req.query.postId ? { postId: String(req.query.postId) } : {}
  const rows = await prisma.attachment.findMany({ where, orderBy: { createdAt: "desc" } })
  return res.json(rows.map(serializeAttachment))
})
