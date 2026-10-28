import { Prisma } from "@prisma/client"
import { withAdmin } from "@libs/server/auth"
import { prisma } from "@libs/server/db"
import { parsePostInput } from "@libs/server/postInput"
import { deletePostPair, findTranslation, savePostPair } from "@libs/server/postPair"
import { isTranslationSlug, serializePostDetail } from "@libs/server/posts"

export default withAdmin(async (req, res) => {
  const id = String(req.query.id)
  const current = await prisma.post.findUnique({ where: { id } })
  if (!current) return res.status(404).json({ error: "Not found" })
  // a `-vi` row is normally edited through its English post; one without an original is edited alone
  const standalone = isTranslationSlug(current.slug)

  if (req.method === "GET") {
    const translation = standalone ? null : await findTranslation(current.slug)
    return res.json({ ...serializePostDetail(current), translation: translation && serializePostDetail(translation) })
  }

  if (req.method === "PUT") {
    if (!standalone) {
      const saved = await savePostPair(req.body, current)
      if ("error" in saved) return res.status(saved.status).json({ error: saved.error })
      const { post, translation } = saved
      return res.json({ ...serializePostDetail(post), translation: translation && serializePostDetail(translation) })
    }
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
    if (standalone) await prisma.post.delete({ where: { id } })
    else await deletePostPair(current)
    return res.status(204).end()
  }

  return res.status(405).end()
})
