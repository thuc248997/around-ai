import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"

type Props = { content: string; className?: string }

/** Renders post markdown. Raw HTML is not rendered (safe for untrusted input). */
const Markdown: React.FC<Props> = ({ content, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null)

  // ```mermaid blocks are rendered client-side
  useEffect(() => {
    const nodes = ref.current?.querySelectorAll<HTMLElement>("pre.mermaid:not([data-processed])")
    if (!nodes?.length) return
    let cancelled = false
    import("mermaid").then(({ default: mermaid }) => {
      if (cancelled) return
      const dark = document.documentElement.classList.contains("dark")
      mermaid.initialize({ startOnLoad: false, theme: dark ? "dark" : "default" })
      mermaid.run({ nodes: Array.from(nodes) }).catch(() => {})
    })
    return () => {
      cancelled = true
    }
  }, [content])

  return (
    <div ref={ref} className={`prose-blog ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeHighlight, { detect: false, ignoreMissing: true }]]}
        components={{
          pre({ node, children, ...props }) {
            const code: any = node?.children?.[0]
            const cls: string[] = code?.properties?.className || []
            if (cls.includes("language-mermaid")) {
              const text = code.children?.map((c: any) => c.value ?? "").join("") ?? ""
              return <pre className="mermaid">{text}</pre>
            }
            return <pre {...props}>{children}</pre>
          },
          a({ node, href, children, ...props }) {
            const external = href && /^https?:\/\//.test(href)
            return (
              <a href={href} {...props} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                {children}
              </a>
            )
          },
          img({ node, ...props }) {
            // eslint-disable-next-line @next/next/no-img-element
            return <img loading="lazy" {...props} alt={props.alt || ""} />
          },
          table({ node, ...props }) {
            return (
              <div className="overflow-x-auto">
                <table {...props} />
              </div>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default Markdown
