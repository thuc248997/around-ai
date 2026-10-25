import { CONFIG } from "site.config"
import { dateLocale, Locale, localeUrl } from "@libs/i18n"

type JsonLd = Record<string, unknown>

export const PERSON_ID = `${CONFIG.link}/#person`
export const WEBSITE_ID = `${CONFIG.link}/#website`

const abs = (url: string) => (url.startsWith("/") ? `${CONFIG.link}${url}` : url)

/** Generated share card for pages without a cover image */
export function ogImageUrl(title: string, subtitle?: string, tag?: string | null) {
  const q = new URLSearchParams({ title })
  if (subtitle) q.set("subtitle", subtitle)
  if (tag) q.set("tag", tag)
  return `${CONFIG.link}/api/og?${q}`
}

/** The author, referenced by @id from every other node */
export function personLd(locale: Locale, bio: string): JsonLd {
  const p = CONFIG.profile
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: p.name,
    jobTitle: p.role,
    description: bio,
    url: localeUrl("/about", locale),
    image: abs(p.image),
    email: `mailto:${p.email}`,
    knowsAbout: CONFIG.seo.keywords,
    sameAs: [
      p.github && `https://github.com/${p.github}`,
      p.linkedin && `https://www.linkedin.com/in/${p.linkedin}`,
      p.instagram && `https://www.instagram.com/${p.instagram}`,
    ].filter(Boolean),
  }
}

export function websiteLd(locale: Locale, description: string): JsonLd {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: CONFIG.link,
    name: CONFIG.blog.title,
    description,
    inLanguage: ["en-US", "vi-VN"],
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  }
}

export function breadcrumbLd(locale: Locale, items: { name: string; path: string }[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: localeUrl(it.path, locale),
    })),
  }
}

type ArticleInput = {
  title: string
  summary: string
  path: string
  image: string
  published: string
  modified: string
  tags: string[]
  category: string | null
  words: number
}

export function articleLd(locale: Locale, a: ArticleInput): JsonLd {
  const url = localeUrl(a.path, locale)
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: a.title,
    description: a.summary,
    image: [a.image],
    datePublished: a.published,
    dateModified: a.modified,
    inLanguage: dateLocale(locale),
    keywords: a.tags.join(", "),
    articleSection: a.category || undefined,
    wordCount: a.words,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  }
}

/** Wraps nodes in one @graph so @id references resolve across them */
export const graph = (nodes: JsonLd[]) => ({ "@context": "https://schema.org", "@graph": nodes })
