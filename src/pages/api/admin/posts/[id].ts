import { Prisma } from "@prisma/client"
import { withAdmin } from "@libs/server/auth"
import { prisma } from "@libs/server/db"
import { parsePostInput } from "@libs/server/postInput"
import { serializePostDetail } from "@libs/server/posts"

export default withAdmin(async (req, res) => {
  const id = String(req.query.id)
  const current = await prisma.post.findUnique({ where: { id } })
  if (!current) return res.status(404).json({ error: "Not found" })

  if (req.method === "GET") return res.json(serializePostDetail(current))

  if (req.method === "PUT") {
    const parsed = parsePostInput(req.body, current)
    if ("error" in parsed) return res.status(400).json(parsed)
    try {
      const post = await prisma.post.update({ where: { id }, data: parsed.data })
      return res.json(serializePostDetail(post))
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        return res.status(409).json({ error: "Slug already exists" })
      }
      throw e
    }
  }

  if (req.method === "DELETE") {
    // attachments are kept (postId -> null) so links elsewhere don't break
    await prisma.post.delete({ where: { id } })
    return res.status(204).end()
  }

  return res.status(405).end()
})
