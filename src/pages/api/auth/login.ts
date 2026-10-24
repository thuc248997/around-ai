import type { NextApiRequest, NextApiResponse } from "next"
import { checkPassword, sessionCookie } from "@libs/server/auth"

// naive in-memory throttle: 10 attempts / 15 min per IP
const attempts = new Map<string, { count: number; reset: number }>()

function clientIp(req: NextApiRequest) {
  return (
    (req.headers["cf-connecting-ip"] as string) ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown"
  )
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const ip = clientIp(req)
  const now = Date.now()
  const entry = attempts.get(ip)
  if (entry && entry.reset > now && entry.count >= 10) {
    return res.status(429).json({ error: "Too many attempts, try again later" })
  }

  if (!checkPassword(String(req.body?.password ?? ""))) {
    const next =
      entry && entry.reset > now
        ? { ...entry, count: entry.count + 1 }
        : { count: 1, reset: now + 15 * 60 * 1000 }
    attempts.set(ip, next)
    return res.status(401).json({ error: "Wrong password" })
  }

  attempts.delete(ip)
  res.setHeader("Set-Cookie", sessionCookie())
  return res.status(200).json({ ok: true })
}
