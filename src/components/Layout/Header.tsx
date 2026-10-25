import Link from "next/link"
import { useRouter } from "next/router"
import { CONFIG } from "site.config"
import { FiMoon, FiRss, FiSun } from "react-icons/fi"
import useTheme from "@hooks/useTheme"
import Logo from "./Logo"

const links = [
  { name: "Home", to: "/" },
  { name: "Blog", to: "/blog" },
  { name: "About", to: "/about" },
]

const Header: React.FC = () => {
  const router = useRouter()
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-xl border border-term-line bg-term-surface/85 px-3 shadow-sm backdrop-blur-md sm:px-4">
        <Logo subtitle />
        <nav className="flex items-center text-xs sm:gap-0.5 sm:text-[13px]">
          {links.map((l) => {
            const active =
              l.to === "/" ? router.pathname === "/" : router.asPath.split("?")[0] === l.to
            return (
              <Link
                key={l.to}
                href={l.to}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-2 py-1.5 transition-colors sm:px-3 ${
                  active
                    ? "bg-term-band text-[#4ade80]"
                    : "text-term-muted hover:text-term-fg"
                }`}
              >
                {active && <span className="hidden sm:inline">~/</span>}
                {l.name.toLowerCase()}
              </Link>
            )
          })}
          <span className="mx-1 hidden h-5 w-px bg-term-line sm:block" aria-hidden />
          {/* /feed is an API rewrite, not a page, so a plain link is intended */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/feed"
            aria-label="RSS feed"
            className="hidden rounded-md p-2 text-term-muted hover:text-term-green sm:block"
          >
            <FiRss />
          </a>
          {CONFIG.blog.theme === "auto" && (
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="rounded-md p-2 text-term-muted hover:text-term-green"
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
