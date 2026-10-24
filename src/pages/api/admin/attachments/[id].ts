import { promises as fs } from "fs"
import { withAdmin } from "@libs/server/auth"
import { prisma } from "@libs/server/db"
import { storedPath } from "@libs/server/storage"

export default withAdmin(async (req, res) => {
  if (req.method !== "DELETE") return res.status(405).end()
  const row = await prisma.attachment.findUnique({ where: { id: String(req.query.id) } })
  if (!row) return res.status(404).json({ error: "Not found" })
  await prisma.attachment.delete({ where: { id: row.id } })
  const file = storedPath(row.storedName)
  if (file) await fs.rm(file, { force: true })
  return res.status(204).end()
})
