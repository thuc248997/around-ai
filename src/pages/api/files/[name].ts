import { createReadStream, promises as fs } from "fs"
import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@libs/server/db"
import { INLINE_TYPES, storedPath } from "@libs/server/storage"

export const config = { api: { responseLimit: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") return res.status(405).end()

  const name = String(req.query.name)
  const file = storedPath(name)
  const row = file && (await prisma.attachment.findUnique({ where: { storedName: name } }))
  if (!file || !row) return res.status(404).end()

  let stat
  try {
    stat = await fs.stat(file)
  } catch {
    return res.status(404).end()
  }

  const inline = INLINE_TYPES.has(row.mimeType)
  res.setHeader("Content-Type", inline ? row.mimeType : "application/octet-stream")
  res.setHeader("Content-Length", stat.size)
  res.setHeader(
    "Content-Disposition",
    `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(row.filename)}`
  )
  // stored names are unique and never reused
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("Content-Security-Policy", "sandbox")

  if (req.method === "HEAD") return res.status(200).end()
  createReadStream(file).pipe(res)
}
