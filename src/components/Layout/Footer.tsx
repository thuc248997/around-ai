import Link from "next/link"
import { CONFIG } from "site.config"
import SocialLinks from "@components/SocialLinks"
import { useT } from "@libs/i18n"
import Logo from "./Logo"

const Footer: React.FC = () => {
  const { t, copy } = useT()
  const f = t.footer
  const columns = [
    {
      title: f.explore,
      links: [
        { name: f.home, href: "/" },
        { name: f.about, href: "/about" },
        { name: f.contact, href: `mailto:${CONFIG.profile.email}` },
      ],
    },
    {
      title: f.content,
      links: [
        { name: f.blog, href: "/blog" },
        // API rewrites, not pages
        { name: f.rss, href: "/feed", raw: true },
        { name: f.sitemap, href: "/sitemap.xml", raw: true },
      ],
    },
    {
      title: f.projects,
      links: CONFIG.projects.map((p) => ({ name: p.name, href: p.href })),
    },
  ]
  const from = +CONFIG.since || new Date().getFullYear()
  const now = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t border-term-line bg-term-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-term-muted">
            {CONFIG.profile.role} · {copy.blog.description} {f.tagline}
          </p>
          <SocialLinks className="-ml-2 mt-4" />
        </div>
        {columns.map((c) => (
          <div key={c.title}>
            <p className="eyebrow mb-4">{c.title}</p>
            <ul className="space-y-2.5 text-[13px]">
              {c.links.map((l) => (
                <li key={l.name}>
                  {l.href.startsWith("/") && !("raw" in l) ? (
                    <Link href={l.href} className="text-term-muted hover:text-term-green">
                      {l.name}
                    </Link>
                  ) : (
                    <a href={l.href} className="text-term-muted hover:text-term-green">
                      {l.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-term-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-term-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {from === now ? now : `${from}–${now}`} {CONFIG.profile.name}. {f.rights}
          </p>
          <p>
            <span className="text-term-green">$</span> exit 0
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
