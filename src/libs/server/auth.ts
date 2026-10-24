import { createHmac, timingSafeEqual } from "crypto"
import type {
  GetServerSidePropsContext,
  NextApiHandler,
  NextApiRequest,
} from "next"

const COOKIE = "admin_session"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function secret() {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (>= 32 chars)")
  return s
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url")
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  // compare digests so length differences don't leak
  return safeEqual(sign(password), sign(expected))
}

export function sessionCookie() {
  const exp = Date.now() + MAX_AGE * 1000
  const token = `${exp}.${sign(String(exp))}`
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`
}

export function clearSessionCookie() {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

export function isAdmin(req: { cookies: Partial<Record<string, string>> }) {
  const token = req.cookies[COOKIE]
  if (!token) return false
  const [exp, sig] = token.split(".")
  if (!exp || !sig || Number(exp) < Date.now()) return false
  return safeEqual(sig, sign(exp))
}

export function withAdmin(handler: NextApiHandler): NextApiHandler {
  return (req, res) => {
    if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" })
    // same-origin check for state-changing requests (cookie is SameSite=Lax already)
    if (req.method !== "GET" && !sameOrigin(req)) {
      return res.status(403).json({ error: "Bad origin" })
    }
    return handler(req, res)
  }
}

function sameOrigin(req: NextApiRequest) {
  const origin = req.headers.origin
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.host
  } catch {
    return false
  }
}

export function requireAdminPage(ctx: GetServerSidePropsContext) {
  if (isAdmin(ctx.req)) return null
  return {
    redirect: {
      destination: `/admin/login?next=${encodeURIComponent(ctx.resolvedUrl)}`,
      permanent: false,
    },
  }
}
