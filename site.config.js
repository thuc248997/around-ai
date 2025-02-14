const CONFIG = {
  // profile setting (required)
  profile: {
    name: "thucpham",
    image: "/avatar.svg", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "AI Engineer",
    bio: "Welcome to my blog! I am ThucPham, an AI Engineer. This blog is where I share my knowledge and experience around AI.",
    email: "thuc248997@gmail.com",
    linkedin: "thuc-pham-807241132",
    github: "thuc248997",
    instagram: "",
  },
  projects: [
    {
      name: `around-ai blog`,
      href: "https://github.com/thuc248997/around-ai",
    },
  ],
  // blog setting (required)
  blog: {
    title: "Around-ai",
    description: "Welcome to around-ai!",
    theme: "auto", // ['light', 'dark', 'auto'
  },

  // CONFIG configration (required)
  link: "www.around-ai.com",
  since: 2023, // If leave this empty, current year will be used.
  lang: "en-US", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app/**Around**%20AI.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fmorethan-log.vercel.app%2Favatar.svg", // The link to generate OG image, don't end with a slash
  seo: {
    keywords: ["Blog", "Website", "Notion"],
  },

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: false,
    config: {
      repo: "thuc248997/around-ai",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
}

module.exports = { CONFIG }