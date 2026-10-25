import type { Post } from "@prisma/client"
import { CONFIG } from "site.config"
import { Locale, localeUrl, siteCopy, VI_SUFFIX } from "@libs/i18n"
import { prisma } from "./db"
import { isTranslationSlug } from "./posts"

// Plain-text views of the site for LLMs and agents: /llms.txt, /llms-full.txt and /<slug>.md

/** Published posts and pages, originals and translations, newest first */
export async function getAgentPosts() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ type: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
  })
}

const baseSlug = (p: Post) => (isTranslationSlug(p.slug) ? p.slug.slice(0, -VI_SUFFIX.length) : p.slug)
export const postLocale = (p: Post): Locale => (isTranslationSlug(p.slug) ? "vi" : "en")
const mdUrl = (p: Post) => `${localeUrl(`/${baseSlug(p)}`, postLocale(p))}.md`

// "/uploads/x.png" -> absolute, so the markdown works outside the site
const absolutize = (md: string) => md.replace(/(\]\(|src=")\/(?!\/)/g, `$1${CONFIG.link}/`)

export function postMarkdown(p: Post) {
  const locale = postLocale(p)
  const date = (p.publishedAt || p.createdAt).toISOString().slice(0, 10)
  const meta = [
    `title: ${JSON.stringify(p.title)}`,
    p.summary && `description: ${JSON.stringify(p.summary)}`,
    `url: ${localeUrl(`/${baseSlug(p)}`, locale)}`,
    `author: ${CONFIG.profile.name} (${CONFIG.profile.role})`,
    `language: ${locale}`,
    p.type === "POST" && `published: ${date}`,
    p.type === "POST" && `updated: ${p.updatedAt.toISOString().slice(0, 10)}`,
    p.tags.length > 0 && `tags: [${p.tags.map((t) => JSON.stringify(t)).join(", ")}]`,
  ].filter(Boolean)
  return `---\n${meta.join("\n")}\n---\n\n# ${p.title}\n\n${absolutize(p.content).trim()}\n`
}

const line = (p: Post) => `- [${p.title}](${mdUrl(p)})${p.summary ? `: ${p.summary.replace(/\s+/g, " ")}` : ""}`

export function llmsTxt(posts: Post[]) {
  const copy = siteCopy("en")
  const p = copy.profile
  const pages = posts
    .filter((x) => x.type === "PAGE")
    .sort((a, b) => +isTranslationSlug(a.slug) - +isTranslationSlug(b.slug))
  const about = pages.find((x) => x.slug === "about")?.summary
  const en = posts.filter((x) => x.type === "POST" && postLocale(x) === "en")
  const vi = posts.filter((x) => x.type === "POST" && postLocale(x) === "vi")
  const links = [
    p.github && `GitHub: https://github.com/${p.github}`,
    p.linkedin && `LinkedIn: https://www.linkedin.com/in/${p.linkedin}`,
    `Email: ${p.email}`,
  ].filter(Boolean)

  return `# ${CONFIG.blog.title}

> ${copy.blog.description}

${CONFIG.blog.title} (${CONFIG.link}) is the personal blog of ${p.name}, ${p.role}. ${about || p.bio}
Posts are written in English, many with a Vietnamese translation under ${CONFIG.link}/vi/.
Every page has a plain-markdown version: add \`.md\` to its URL. The full text of all posts is at ${
    CONFIG.link
  }/llms-full.txt.

${links.join("\n")}

## Pages

${pages.map(line).join("\n") || "- (none yet)"}

## Posts

${en.map(line).join("\n") || "- (none yet)"}
${vi.length ? `\n## Posts in Vietnamese\n\n${vi.map(line).join("\n")}\n` : ""}
## Optional

- [Full text of every post](${CONFIG.link}/llms-full.txt)
- [RSS feed](${CONFIG.link}/feed)
- [Sitemap](${CONFIG.link}/sitemap.xml)
- [Blog index](${CONFIG.link}/blog)
`
}

export function llmsFullTxt(posts: Post[]) {
  return `# ${CONFIG.blog.title}: full text\n\n> ${siteCopy("en").blog.description}\n\n${posts
    .map(postMarkdown)
    .join("\n\n")}`
}
