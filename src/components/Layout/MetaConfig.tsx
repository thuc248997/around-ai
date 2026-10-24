import { CONFIG } from "site.config"
import Head from "next/head"

export type MetaConfigProps = {
  title: string
  description: string
  type: "website" | "article"
  date?: string
  image?: string | null
  url: string
  noindex?: boolean
}

const MetaConfig: React.FC<MetaConfigProps> = (meta) => {
  const image = meta.image
    ? meta.image.startsWith("/")
      ? `${CONFIG.link}${meta.image}`
      : meta.image
    : undefined

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={meta.noindex ? "noindex, nofollow" : "follow, index"} />
      {CONFIG.seo.keywords && (
        <meta name="keywords" content={CONFIG.seo.keywords.join(", ")} />
      )}
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.url} />
      {/* og */}
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content={CONFIG.blog.title} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.url} />
      {CONFIG.lang && <meta property="og:locale" content={CONFIG.lang.replace("-", "_")} />}
      {image && <meta property="og:image" content={image} />}
      {/* twitter */}
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      {image && <meta name="twitter:image" content={image} />}
      {/* article */}
      {meta.type === "article" && meta.date && (
        <>
          <meta property="article:published_time" content={meta.date} />
          <meta property="article:author" content={CONFIG.profile.name} />
        </>
      )}
    </Head>
  )
}

export default MetaConfig
