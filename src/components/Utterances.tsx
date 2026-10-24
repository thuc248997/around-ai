import { useEffect, useRef } from "react"
import { CONFIG } from "site.config"

const Utterances: React.FC<{ issueTerm: string }> = ({ issueTerm }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const dark = document.documentElement.classList.contains("dark")
    const script = document.createElement("script")
    script.src = "https://utteranc.es/client.js"
    script.async = true
    script.crossOrigin = "anonymous"
    script.setAttribute("theme", dark ? "github-dark" : "github-light")
    script.setAttribute("issue-term", issueTerm)
    Object.entries(CONFIG.utterances.config).forEach(([k, v]) => script.setAttribute(k, v))
    el.appendChild(script)
    return () => {
      el.innerHTML = ""
    }
  }, [issueTerm])

  return <div ref={ref} className="mt-16" />
}

export default Utterances
