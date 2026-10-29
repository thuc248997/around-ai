import { useCallback, useEffect, useState } from "react"
import { CONFIG } from "site.config"
import { ThemeType } from "@customTypes/index"

// "auto" follows the visitor's clock: dark from DARK_FROM until LIGHT_FROM
export const DARK_FROM = 18
export const LIGHT_FROM = 6

const timeTheme = (d: Date): ThemeType => {
  const h = d.getHours()
  return h >= DARK_FROM || h < LIGHT_FROM ? "dark" : "light"
}
// Same rule for the inline script in _document
export const timeThemeJs = `function(d){var h=d.getHours();return h>=${DARK_FROM}||h<${LIGHT_FROM}?"dark":"light"}`

/** The next time the clock-based theme flips */
function nextSwitch(now: Date) {
  const d = new Date(now)
  const h = d.getHours()
  d.setHours(h < LIGHT_FROM ? LIGHT_FROM : h < DARK_FROM ? DARK_FROM : 24 + LIGHT_FROM, 0, 0, 0)
  return d
}

/** A manual toggle sticks until the next switch, then the clock takes over again */
function storedTheme(): ThemeType | undefined {
  try {
    if (Number(localStorage.themeUntil) > Date.now()) return localStorage.theme
  } catch {}
}

// The initial class is set by an inline script in _document to avoid a flash
export function getTheme(): ThemeType {
  if (CONFIG.blog.theme !== "auto") return CONFIG.blog.theme as ThemeType
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function apply(next: ThemeType) {
  document.documentElement.classList.toggle("dark", next === "dark")
}

export default function useTheme() {
  const [theme, setTheme] = useState<ThemeType>()

  useEffect(() => {
    setTheme(getTheme())
    if (CONFIG.blog.theme !== "auto") return
    // keep an open tab in step with the clock
    let timer: ReturnType<typeof setTimeout>
    const schedule = () => {
      timer = setTimeout(() => {
        const next = storedTheme() || timeTheme(new Date())
        apply(next)
        setTheme(next)
        schedule()
      }, nextSwitch(new Date()).getTime() - Date.now() + 1000)
    }
    schedule()
    return () => clearTimeout(timer)
  }, [])

  const toggle = useCallback(() => {
    const next = getTheme() === "dark" ? "light" : "dark"
    apply(next)
    try {
      localStorage.theme = next
      localStorage.themeUntil = String(nextSwitch(new Date()).getTime())
    } catch {}
    setTheme(next)
  }, [])

  return { theme, toggle }
}
