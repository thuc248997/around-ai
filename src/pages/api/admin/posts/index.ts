import { Prisma } from "@prisma/client"
import { withAdmin } from "@libs/server/auth"
import { prisma } from "@libs/server/db"
import { parsePostInput } from "@libs/server/postInput"
import { listSelect, serializePost, serializePostDetail } from "@libs/server/posts"

export default withAdmin(async (req, res) => {
  if (req.method === "GET") {
    const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" }, select: listSelect })
    return res.json(posts.map(serializePost))
  }

  if (req.method === "POST") {
    const parsed = parsePostInput(req.body)
    if ("error" in parsed) return res.status(400).json(parsed)
    try {
      const post = await prisma.post.create({ data: parsed.data })
      // attach files uploaded before the post was first saved
      if (Array.isArray(req.body?.attachmentIds) && req.body.attachmentIds.length) {
        await prisma.attachment.updateMany({
          where: { id: { in: req.body.attachmentIds.map(String) }, postId: null },
          data: { postId: post.id },
        })
      }
      return res.status(201).json(serializePostDetail(post))
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        return res.status(409).json({ error: "Slug already exists" })
      }
      throw e
    }
  }

  return res.status(405).end()
})
