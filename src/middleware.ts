import { NextRequest, NextResponse } from "next/server"

// Visitors from these countries default to Vietnamese
const VI_COUNTRIES = new Set(["VN"])
// Search engines and link previews must see the URL's own language
const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|lighthouse/i

/**
 * Pick the default language from the visitor's location (Cloudflare's cf-ipcountry).
 * Only English URLs are redirected, only on a full page load, and never once the
 * visitor has chosen a language with the header switch (NEXT_LOCALE cookie).
 */
export function middleware(req: NextRequest) {
  const { nextUrl, headers, cookies } = req
  if (nextUrl.locale !== "en" || cookies.has("NEXT_LOCALE")) return
  const dest = headers.get("sec-fetch-dest")
  if (req.method !== "GET" || (dest && dest !== "document")) return
  if (BOTS.test(headers.get("user-agent") || "")) return

  const country = headers.get("cf-ipcountry") || headers.get("x-vercel-ip-country")
  if (!country || !VI_COUNTRIES.has(country.toUpperCase())) return

  const url = nextUrl.clone()
  url.locale = "vi"
  const res = NextResponse.redirect(url, 307)
  res.headers.set("Cache-Control", "private, no-store")
  return res
}

export const config = {
  // pages only: no API, assets, admin, or feed/agent rewrites
  matcher: ["/", "/((?!api|_next|admin|uploads|feed|.*\\..*).*)"],
}
