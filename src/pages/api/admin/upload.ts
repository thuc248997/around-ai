import busboy from "busboy"
import { randomBytes } from "crypto"
import { createWriteStream, promises as fs } from "fs"
import path from "path"
import { pipeline } from "stream/promises"
import { withAdmin } from "@libs/server/auth"
import { prisma } from "@libs/server/db"
import { serializeAttachment } from "@libs/server/posts"
import { MAX_UPLOAD_BYTES, UPLOAD_DIR } from "@libs/server/storage"

export const config = { api: { bodyParser: false } }

type Saved = { storedName: string; filename: string; mimeType: string; size: number }

export default withAdmin(async (req, res) => {
  if (req.method !== "POST") return res.status(405).end()
  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  const postId = req.query.postId ? String(req.query.postId) : null
  if (postId && !(await prisma.post.findUnique({ where: { id: postId } }))) {
    return res.status(404).json({ error: "Post not found" })
  }

  const saved: Saved[] = []
  const writes: Promise<void>[] = []
  let tooLarge = false

  const bb = busboy({
    headers: req.headers,
    limits: { fileSize: MAX_UPLOAD_BYTES, files: 20 },
    defParamCharset: "utf8",
  })

  bb.on("file", (_field, stream, info) => {
    const ext = path.extname(info.filename).toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 11)
    const storedName = `${Date.now().toString(36)}${randomBytes(8).toString("hex")}${ext}`
    const target = path.join(UPLOAD_DIR, storedName)
    let size = 0
    stream.on("data", (chunk: Buffer) => (size += chunk.length))
    stream.on("limit", () => (tooLarge = true))
    writes.push(
      pipeline(stream, createWriteStream(target)).then(async () => {
        if (tooLarge) return fs.rm(target, { force: true })
        saved.push({
          storedName,
          filename: info.filename || storedName,
          mimeType: info.mimeType || "application/octet-stream",
          size,
        })
      })
    )
  })

  await new Promise<void>((resolve, reject) => {
    bb.on("close", resolve)
    bb.on("error", reject)
    req.pipe(bb)
  })
  await Promise.all(writes)

  if (tooLarge) {
    await Promise.all(saved.map((s) => fs.rm(path.join(UPLOAD_DIR, s.storedName), { force: true })))
    return res.status(413).json({ error: `File exceeds ${MAX_UPLOAD_BYTES / 1024 / 1024} MB` })
  }
  if (!saved.length) return res.status(400).json({ error: "No file" })

  const rows = await prisma.$transaction(
    saved.map((s) => prisma.attachment.create({ data: { ...s, postId } }))
  )
  return res.status(201).json(rows.map(serializeAttachment))
})
