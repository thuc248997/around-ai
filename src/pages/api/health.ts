import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@libs/server/db"

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json({ ok: true })
  } catch {
    res.status(503).json({ ok: false })
  }
}
