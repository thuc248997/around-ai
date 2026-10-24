import { useCallback, useEffect, useState } from "react"
import { CONFIG } from "site.config"
import { ThemeType } from "@customTypes/index"

// The initial class is set by an inline script in _document to avoid a flash
export function getTheme(): ThemeType {
  if (CONFIG.blog.theme !== "auto") return CONFIG.blog.theme as ThemeType
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

export default function useTheme() {
  const [theme, setTheme] = useState<ThemeType>()

  useEffect(() => setTheme(getTheme()), [])

  const toggle = useCallback(() => {
    const next = getTheme() === "dark" ? "light" : "dark"
    document.documentElement.classList.toggle("dark", next === "dark")
    try {
      localStorage.setItem("theme", next)
    } catch {}
    setTheme(next)
  }, [])

  return { theme, toggle }
}
