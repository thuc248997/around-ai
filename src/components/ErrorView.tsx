import Link from "next/link"
import { CONFIG } from "site.config"
import Layout from "@components/Layout"

const ErrorView: React.FC<{ code: number; message: string }> = ({ code, message }) => (
  <Layout
    metaConfig={{ title: `${code} | ${CONFIG.blog.title}`, description: message, type: "website", url: CONFIG.link, noindex: true }}
  >
    <div className="flex flex-col items-center py-32 text-center">
      <p className="bg-gradient-to-br from-accent-500 to-sky-500 bg-clip-text text-7xl font-bold text-transparent">{code}</p>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">{message}</p>
      <Link href="/" className="mt-8 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
        Back to home
      </Link>
    </div>
  </Layout>
)

export default ErrorView
