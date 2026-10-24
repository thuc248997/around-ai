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
  link: "https://around-ai.com", // canonical url, no trailing slash
  since: 2023, // If leave this empty, current year will be used.
  lang: "en-US", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  seo: {
    keywords: ["AI", "Blog", "Machine Learning", "LLM"],
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
  isProd: process.env.NODE_ENV === "production",
}

module.exports = { CONFIG }