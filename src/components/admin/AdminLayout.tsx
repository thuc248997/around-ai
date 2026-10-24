import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { FiExternalLink, FiLogOut } from "react-icons/fi"

const AdminLayout: React.FC<{ title: string; children: React.ReactNode; actions?: React.ReactNode }> = ({
  title,
  children,
  actions,
}) => {
  const router = useRouter()
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Head>
        <title>{`${title} · Admin`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/admin" className="font-semibold text-zinc-900 dark:text-white">
            around-ai <span className="font-normal text-zinc-400">/ admin</span>
          </Link>
          <div className="flex items-center gap-1 text-sm">
            <a href="/" target="_blank" className="btn-ghost">
              <FiExternalLink /> View site
            </a>
            <button onClick={logout} className="btn-ghost">
              <FiLogOut /> Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">{title}</h1>
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        </div>
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
