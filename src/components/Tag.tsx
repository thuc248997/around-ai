import Link from "next/link"

type Props = { children: string; active?: boolean; count?: number }

const Tag: React.FC<Props> = ({ children, active, count }) => (
  <Link
    href={active ? "/" : `/?tag=${encodeURIComponent(children)}`}
    scroll={false}
    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
      active
        ? "border-accent-500 bg-accent-500 text-white"
        : "border-zinc-200 text-zinc-600 hover:border-accent-400 hover:text-accent-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-accent-400 dark:hover:text-accent-400"
    }`}
  >
    #{children}
    {count !== undefined && <span className="opacity-60">{count}</span>}
  </Link>
)

export default Tag
