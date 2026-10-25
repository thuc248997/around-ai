import { GetServerSideProps } from "next"
import Link from "next/link"
import { FiArrowRight, FiArrowUpRight, FiCpu, FiGithub, FiLayers, FiServer } from "react-icons/fi"
import { CONFIG } from "site.config"
import Layout from "@components/Layout"
import SectionHeading from "@components/SectionHeading"
import TerminalWindow from "@components/TerminalWindow"
import { countTags, getPublishedPosts } from "@libs/server/posts"
import { formatDate, postDate } from "@libs/utils"
import { TPost } from "@customTypes/index"
import { NextPageWithLayout } from "./_app"

type Props = { latest: TPost[]; total: number; tagCount: number }

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, res }) => {
  // the archive used to live at /?tag=…
  if (typeof query.tag === "string") {
    return { redirect: { destination: `/blog?tag=${encodeURIComponent(query.tag)}`, permanent: true } }
  }
  const posts = await getPublishedPosts()
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600")
  return {
    props: {
      latest: posts.slice(0, 6),
      total: posts.length,
      tagCount: Object.keys(countTags(posts)).length,
    },
  }
}

const EXPLORATION_ICONS = [FiCpu, FiLayers, FiServer]
const pad = (n: number) => String(n + 1).padStart(2, "0")

const HomePage: NextPageWithLayout<Props> = ({ latest, total, tagCount }) => {
  const { profile, home } = CONFIG
  const project = CONFIG.projects[0]
  const featured = latest.slice(0, 3)
  const more = latest.slice(3)

  const stats = [
    { value: total, label: "Published posts" },
    { value: `Since ${CONFIG.since}`, label: "Writing in the open" },
    { value: tagCount, label: "Topics covered" },
    { value: profile.role, label: profile.name },
  ]

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* breadcrumb strip */}
        <div className="mt-8 flex justify-between border-b border-term-line pb-3 text-[10px] uppercase tracking-[0.18em] text-term-muted">
          <span>
            {profile.name} / engineering notebook
          </span>
          <span className="hidden sm:inline">ideas — systems — lessons</span>
        </div>

        {/* hero */}
        <section className="grid items-center gap-12 py-14 lg:grid-cols-[1.25fr_1fr] lg:py-20">
          <div>
            <p className="eyebrow mb-5">
              <span className="text-term-green">●</span> {home.eyebrow}
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-term-fg sm:text-[3.4rem]">
              {home.headline}
              <br />
              <span className="cursor text-term-green">{home.headlineAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-term-fg/90">{home.lead}</p>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-term-muted">{profile.bio}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/blog" className="btn-term">
                Read the notebook <FiArrowRight />
              </Link>
              <Link href="/about" className="btn-term-outline">
                About me
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-term-muted">
              <a
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-term-green"
              >
                <FiGithub /> github.com/{profile.github}
              </a>
              <span aria-hidden>/</span>
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1 hover:text-term-green">
                Let&apos;s build something useful <FiArrowUpRight />
              </a>
            </div>
          </div>

          <TerminalWindow title={`${profile.name}@around-ai: ~`} footer="Hands-on by choice. Curious by default.">
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.image}
                alt={profile.name}
                className="h-20 w-20 shrink-0 rounded-md border border-white/10 bg-white/5 object-cover"
              />
              <div className="min-w-0 space-y-1 leading-relaxed">
                <p>
                  <span className="text-[#4ade80]">~ $</span> whoami
                </p>
                <p className="text-white">{profile.name}</p>
                <p>
                  <span className="text-[#4ade80]">~ $</span> cat role.txt
                </p>
                <p className="text-[#f0b946]">{profile.role}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1 leading-relaxed">
              <p>
                <span className="text-[#4ade80]">~ $</span> ls ./interests
              </p>
              <p className="text-white/80">llm/ ml/ agents/ self-hosting/</p>
              <p>
                <span className="text-[#4ade80]">~ $</span> <span className="cursor" />
              </p>
            </div>
          </TerminalWindow>
        </section>

        {/* stats */}
        <section className="grid grid-cols-2 divide-term-line rounded-lg border border-term-line bg-term-surface lg:grid-cols-4 lg:divide-x">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`p-5 sm:p-6 ${i < 2 ? "border-b border-term-line lg:border-b-0" : ""} ${
                i % 2 === 0 ? "border-r border-term-line lg:border-r-0" : ""
              }`}
            >
              <p className="truncate text-xl font-bold text-term-fg sm:text-2xl">{s.value}</p>
              <p className="mt-1 truncate text-[11px] text-term-muted">{s.label}</p>
            </div>
          ))}
        </section>

        {/* 01 selected work */}
        {project && (
          <section className="pt-24">
            <SectionHeading
              index="01"
              label="Selected work"
              title="From an idea to something useful."
              link={{ href: project.href, label: "All projects" }}
            />
            <div className="card grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.15fr]">
              <div>
                <p className="eyebrow mb-4">{project.label}</p>
                <h3 className="text-2xl font-extrabold text-term-fg">
                  {project.name}
                  <span className="text-term-green">.</span>
                </h3>
                <p className="mt-3 text-lg font-medium text-term-fg/90">{project.tagline}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-term-muted">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span key={t} className="rounded border border-term-line px-2 py-0.5 text-[11px] text-term-muted">
                      {t}
                    </span>
                  ))}
                </div>
                <a href={project.href} target="_blank" rel="noreferrer" className="link-term mt-6">
                  Explore {project.name} <FiArrowUpRight />
                </a>
              </div>
              <TerminalWindow title="around-ai / docker compose" footer="Self-hosted. Markdown in, blog out.">
                <pre className="overflow-x-auto whitespace-pre text-[12px] leading-relaxed">
                  <span className="text-[#4ade80]">$</span> docker compose ps{"\n"}
                  <span className="text-white/50">NAME      STATUS{"\n"}</span>
                  app       <span className="text-[#4ade80]">Up (healthy)</span>
                  {"\n"}db        <span className="text-[#4ade80]">Up (healthy)</span>
                  {"\n"}tunnel    <span className="text-[#4ade80]">Up</span>
                  {"\n\n"}
                  <span className="text-[#4ade80]">$</span> curl -s around-ai.com/api/health{"\n"}
                  <span className="text-[#f0b946]">{`{"ok":true}`}</span>
                  {"\n\n"}
                  <span className="text-[#4ade80]">$</span> <span className="cursor" />
                </pre>
              </TerminalWindow>
            </div>
          </section>
        )}
      </div>

      {/* 02 principles: dark band */}
      <section className="mt-24 bg-term-band text-[#cdd6de]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-4 !text-[#f0b946]">02 / How I work</p>
            <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              {home.principles.title}
              <br />
              <span className="text-[#4ade80]">{home.principles.accent}</span>
            </h2>
            <p className="mt-5 max-w-md text-[13px] leading-relaxed text-white/60">{home.principles.text}</p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 text-sm text-white hover:text-[#4ade80]">
              Background &amp; experience <FiArrowUpRight />
            </Link>
          </div>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {home.principles.items.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[2.5rem_1fr] py-6">
                <span className="text-xs text-[#f0b946]">{pad(i)}</span>
                <div>
                  <p className="font-bold text-white">{p.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 03 explorations */}
        <section className="pt-24">
          <SectionHeading index="03" label="Current explorations" title="The questions keeping me curious." />
          <div className="grid gap-4 md:grid-cols-3">
            {home.explorations.map((e, i) => {
              const Icon = EXPLORATION_ICONS[i % EXPLORATION_ICONS.length]
              return (
                <div key={e.title} className="card group p-6 transition-colors hover:border-term-green">
                  <div className="flex items-start justify-between text-term-muted">
                    <Icon className="h-5 w-5 text-term-green" />
                    <span className="text-[11px]">{pad(i)}</span>
                  </div>
                  <h3 className="mt-6 font-bold text-term-fg">{e.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-term-muted">{e.text}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 04 field notes */}
        <section className="pt-24">
          <SectionHeading
            index="04"
            label="Field notes"
            title="Building things. Writing it down."
            link={{ href: "/blog", label: "All articles" }}
          />
          {featured.length === 0 && (
            <p className="card p-10 text-center text-sm text-term-muted">No posts yet — check back soon.</p>
          )}
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((p, i) => (
              <article
                key={p.id}
                className="card group relative flex flex-col border-t-2 !border-t-term-green p-6 transition-colors hover:bg-term-raised"
              >
                <div className="flex justify-between text-[11px] text-term-muted">
                  <span>NOTE / {pad(i)}</span>
                  <time dateTime={postDate(p)}>{formatDate(postDate(p), CONFIG.lang)}</time>
                </div>
                <h3 className="mt-5 text-lg font-bold leading-snug text-term-fg group-hover:text-term-green">
                  <Link href={`/${p.slug}`} className="after:absolute after:inset-0">
                    {p.title}
                  </Link>
                </h3>
                {p.summary && (
                  <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-term-muted">{p.summary}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-6 text-xs">
                  <span className="text-term-amber">{p.category || (p.tags[0] ? `#${p.tags[0]}` : "")}</span>
                  <FiArrowUpRight className="text-term-muted group-hover:text-term-green" />
                </div>
              </article>
            ))}
          </div>
          {more.length > 0 && (
            <ul className="mt-6 divide-y divide-term-line border-y border-term-line">
              {more.map((p) => (
                <li key={p.id} className="group relative flex items-center gap-4 py-4 text-sm">
                  <time dateTime={postDate(p)} className="w-28 shrink-0 text-xs text-term-muted">
                    {formatDate(postDate(p), CONFIG.lang)}
                  </time>
                  <Link
                    href={`/${p.slug}`}
                    className="min-w-0 flex-1 truncate text-term-fg after:absolute after:inset-0 group-hover:text-term-green"
                  >
                    {p.title}
                  </Link>
                  <FiArrowUpRight className="shrink-0 text-term-muted group-hover:text-term-green" />
                </li>
              ))}
            </ul>
          )}
          {total > 0 && (
            <div className="mt-8 flex justify-center">
              <Link href="/blog" className="btn-term-outline">
                View all {total} posts <FiArrowRight />
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* CTA */}
      <section className="mt-24 border-y border-term-line bg-term-raised/60">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <p className="eyebrow mb-4">{home.cta.eyebrow}</p>
          <h2 className="text-3xl font-extrabold leading-tight text-term-fg sm:text-4xl">{home.cta.title}</h2>
          <a href={`mailto:${CONFIG.profile.email}`} className="btn-term mt-8">
            Let&apos;s talk <FiArrowRight />
          </a>
          <p className="mt-5 text-xs text-term-muted">{home.cta.text}</p>
        </div>
      </section>
    </>
  )
}

HomePage.getLayout = (page) => (
  <Layout
    metaConfig={{
      title: CONFIG.blog.title,
      description: CONFIG.blog.description,
      type: "website",
      url: CONFIG.link,
    }}
  >
    {page}
  </Layout>
)

export default HomePage
