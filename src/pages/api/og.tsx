import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { CONFIG } from "site.config"

export const config = { runtime: "edge" }

// JetBrains Mono ships the Vietnamese glyphs; next/og's built-in font does not
const bold = fetch(new URL("../../assets/fonts/JetBrainsMono-Bold.ttf", import.meta.url)).then((r) => r.arrayBuffer())
const regular = fetch(new URL("../../assets/fonts/JetBrainsMono-Regular.ttf", import.meta.url)).then((r) =>
  r.arrayBuffer()
)

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s)

/** 1200x630 share card: /api/og?title=…&subtitle=…&tag=… */
export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = clip(searchParams.get("title") || CONFIG.blog.title, 110)
  const subtitle = clip(searchParams.get("subtitle") || "", 160)
  const tag = clip(searchParams.get("tag") || CONFIG.profile.role, 40)
  const host = new URL(CONFIG.link).host

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "rgb(10 13 18)",
          backgroundImage:
            "linear-gradient(to bottom, rgba(36,45,58,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(36,45,58,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          color: "rgb(205 214 222)",
          fontFamily: "JetBrains Mono",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
          }}
        >
          <span style={{ color: "rgb(74 222 128)" }}>~/{host}</span>
          <span style={{ color: "rgb(128 139 151)" }}>$</span>
          <span
            style={{
              color: "rgb(240 185 70)",
              textTransform: "uppercase",
              letterSpacing: 3,
              fontSize: 22,
            }}
          >
            {tag}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: title.length > 60 ? 54 : 68,
              fontWeight: 700,
              lineHeight: 1.12,
              color: "rgb(235 240 245)",
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 26,
                lineHeight: 1.45,
                color: "rgb(128 139 151)",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid rgb(36 45 58)",
            paddingTop: 24,
            fontSize: 24,
          }}
        >
          <span style={{ fontWeight: 700 }}>
            {CONFIG.profile.name}
            <span
              style={{
                color: "rgb(128 139 151)",
                fontWeight: 400,
                marginLeft: 12,
              }}
            >
              · {CONFIG.profile.role}
            </span>
          </span>
          <span style={{ color: "rgb(74 222 128)" }}>{CONFIG.blog.title}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "JetBrains Mono",
          data: await regular,
          weight: 400,
          style: "normal",
        },
        {
          name: "JetBrains Mono",
          data: await bold,
          weight: 700,
          style: "normal",
        },
      ],
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    }
  )
}
