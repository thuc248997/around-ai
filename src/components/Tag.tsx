import Link from "next/link"

type Props = { children: string; active?: boolean; count?: number }

const Tag: React.FC<Props> = ({ children, active, count }) => (
  <Link
    href={active ? "/blog" : `/blog?tag=${encodeURIComponent(children)}`}
    scroll={false}
    className={`inline-flex shrink-0 items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors ${
      active
        ? "border-term-green bg-term-green text-term-bg"
        : "border-term-line text-term-muted hover:border-term-green hover:text-term-green"
    }`}
  >
    #{children}
    {count !== undefined && <span className="opacity-60">{count}</span>}
  </Link>
)

export default Tag
