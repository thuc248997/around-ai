import Link from "next/link"
import { useRouter } from "next/router"
import { CONFIG } from "site.config"
import { FiMoon, FiRss, FiSun } from "react-icons/fi"
import useTheme from "@hooks/useTheme"

const links = [
  { name: "Posts", to: "/" },
  { name: "About", to: "/about" },
]

const Header: React.FC = () => {
  const router = useRouter()
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent-500 to-sky-500 text-xs font-bold text-white shadow-sm">
            AI
          </span>
          <span className="text-zinc-900 group-hover:text-accent-600 dark:text-zinc-100 dark:group-hover:text-accent-400">
            {CONFIG.blog.title}
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => {
            const active = l.to === "/" ? router.pathname === "/" : router.asPath === l.to
            return (
              <Link
                key={l.to}
                href={l.to}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  active
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {l.name}
              </Link>
            )
          })}
          {/* /feed is an API rewrite, not a page, so a plain link is intended */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/feed"
            aria-label="RSS feed"
            className="rounded-md p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <FiRss />
          </a>
          {CONFIG.blog.theme === "auto" && (
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="rounded-md p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
