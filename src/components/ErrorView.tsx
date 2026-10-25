import Link from "next/link"
import { CONFIG } from "site.config"
import Layout from "@components/Layout"

const ErrorView: React.FC<{ code: number; message: string }> = ({ code, message }) => (
  <Layout
    metaConfig={{ title: `${code} | ${CONFIG.blog.title}`, description: message, type: "website", url: CONFIG.link, noindex: true }}
  >
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="text-7xl font-extrabold text-term-green">{code}</p>
      <p className="mt-4 text-sm text-term-muted">
        <span className="text-term-amber">error:</span> {message}
      </p>
      <Link href="/" className="btn-term mt-8">
        cd ~
      </Link>
    </div>
  </Layout>
)

export default ErrorView
