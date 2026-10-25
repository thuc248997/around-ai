const { CONFIG } = require("./site.config")

const apexHost = new URL(CONFIG.link).host

module.exports = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  // English at /, Vietnamese at /vi. No Accept-Language redirect: the URL decides.
  i18n: { locales: ["en", "vi"], defaultLocale: "en", localeDetection: false },
  async rewrites() {
    return [
      { source: "/uploads/:name", destination: "/api/files/:name" },
      { source: "/feed", destination: "/api/rss" },
      { source: "/rss.xml", destination: "/api/rss" },
      { source: "/sitemap.xml", destination: "/api/sitemap" },
      { source: "/robots.txt", destination: "/api/robots" },
      { source: "/llms.txt", destination: "/api/llms" },
      { source: "/llms-full.txt", destination: "/api/llms?full=1" },
      // markdown copy of any post for agents: /<slug>.md, /vi/<slug>.md
      { source: "/vi/:slug([^/.]+).md", destination: "/api/md/:slug?lang=vi", locale: false },
      { source: "/:slug([^/.]+).md", destination: "/api/md/:slug" },
    ]
  },
  async redirects() {
    // www.around-ai.com -> around-ai.com
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${apexHost}` }],
        destination: `${CONFIG.link}/:path*`,
        permanent: true,
        locale: false,
      },
    ]
  },
}
