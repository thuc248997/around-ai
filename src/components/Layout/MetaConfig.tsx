import { CONFIG } from "site.config"
import Head from "next/head"
import { dateLocale, Locale, LOCALES, localeUrl, useT } from "@libs/i18n"
import { graph, ogImageUrl, personLd, websiteLd } from "@libs/seo"

export type MetaConfigProps = {
  title: string
  description?: string // defaults to the localized site description
  type: "website" | "article"
  date?: string
  modified?: string
  image?: string | null // defaults to a generated share card
  imageTitle?: string // headline on the generated card, defaults to title
  path: string // "/" or "/slug"; the locale prefix is added here
  noindex?: boolean
  // locales this page really exists in; a page missing its own locale points canonical at the first one
  locales?: readonly Locale[]
  tags?: string[]
  markdownPath?: string // plain-markdown copy of the page for agents
  jsonLd?: (locale: Locale) => Record<string, unknown>[] // extra schema.org nodes, alongside WebSite + Person
}

// "<" inside a JSON string would let content close the script tag
const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c")

const MetaConfig: React.FC<MetaConfigProps> = (props) => {
  const { locale, copy } = useT()
  const locales = props.locales?.length ? props.locales : LOCALES
  const description = props.description || copy.blog.description
  const url = localeUrl(props.path, locale)
  const canonical = locales.includes(locale) ? url : localeUrl(props.path, locales[0])
  const image = props.image
    ? props.image.startsWith("/")
      ? `${CONFIG.link}${props.image}`
      : props.image
    : ogImageUrl(props.imageTitle || props.title, props.imageTitle ? description : undefined)
  const keywords = [...(props.tags || []), ...CONFIG.seo.keywords]

  return (
    <Head>
      <title>{props.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="robots"
        content={
          props.noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <meta name="description" content={description} />
      <meta name="keywords" content={[...new Set(keywords)].join(", ")} />
      <meta name="author" content={CONFIG.profile.name} />
      <link rel="canonical" href={canonical} />
      {locales.length > 1 &&
        locales.map((l) => <link key={`hreflang-${l}`} rel="alternate" hrefLang={l} href={localeUrl(props.path, l)} />)}
      {locales.length > 1 && <link rel="alternate" hrefLang="x-default" href={localeUrl(props.path, locales[0])} />}
      {props.markdownPath && <link rel="alternate" type="text/markdown" href={`${CONFIG.link}${props.markdownPath}`} />}
      {/* og */}
      <meta property="og:type" content={props.type} />
      <meta property="og:site_name" content={CONFIG.blog.title} />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={dateLocale(locale).replace("-", "_")} />
      {locales
        .filter((l) => l !== locale)
        .map((l) => (
          <meta key={`og-locale-${l}`} property="og:locale:alternate" content={dateLocale(l).replace("-", "_")} />
        ))}
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={props.title} />
      {!props.image && (
        <>
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      {/* twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {/* article */}
      {props.type === "article" && props.date && (
        <>
          <meta property="article:published_time" content={props.date} />
          {props.modified && <meta property="article:modified_time" content={props.modified} />}
          <meta property="article:author" content={`${CONFIG.link}/about`} />
          {props.tags?.map((t) => (
            <meta key={`tag-${t}`} property="article:tag" content={t} />
          ))}
        </>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ldJson(
            graph([
              websiteLd(locale, copy.blog.description),
              personLd(locale, copy.profile.bio),
              ...(props.jsonLd?.(locale) || []),
            ])
          ),
        }}
      />
    </Head>
  )
}

export default MetaConfig
