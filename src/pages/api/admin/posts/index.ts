import { withAdmin } from "@libs/server/auth"
import { prisma } from "@libs/server/db"
import { savePostPair } from "@libs/server/postPair"
import { listSelect, serializePost, serializePostDetail } from "@libs/server/posts"

export default withAdmin(async (req, res) => {
  if (req.method === "GET") {
    const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" }, select: listSelect })
    return res.json(posts.map(serializePost))
  }

  if (req.method === "POST") {
    const saved = await savePostPair(req.body)
    if ("error" in saved) return res.status(saved.status).json({ error: saved.error })
    const { post, translation } = saved
    // attach files uploaded before the post was first saved
    if (Array.isArray(req.body?.attachmentIds) && req.body.attachmentIds.length) {
      await prisma.attachment.updateMany({
        where: { id: { in: req.body.attachmentIds.map(String) }, postId: null },
        data: { postId: post.id },
      })
    }
    return res.status(201).json({ ...serializePostDetail(post), translation: translation && serializePostDetail(translation) })
  }

  return res.status(405).end()
})
