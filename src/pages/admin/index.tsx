import { GetServerSideProps } from "next"
import Link from "next/link"
import { useMemo, useState } from "react"
import { FiPlus } from "react-icons/fi"
import AdminLayout from "@components/admin/AdminLayout"
import { requireAdminPage } from "@libs/server/auth"
import { prisma } from "@libs/server/db"
import { isTranslationSlug, listSelect, serializePost } from "@libs/server/posts"
import { VI_SUFFIX } from "@libs/i18n"
import { formatDate } from "@libs/utils"
import { TPost } from "@customTypes/index"

type Props = { posts: (TPost & { hasVi: boolean })[] }

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const redirect = requireAdminPage(ctx)
  if (redirect) return redirect
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" }, select: listSelect })
  // translations are edited inside their English post, so only orphaned ones get their own row
  const slugs = new Set(posts.map((p) => p.slug))
  const rows = posts
    .filter((p) => !isTranslationSlug(p.slug) || !slugs.has(p.slug.slice(0, -VI_SUFFIX.length)))
    .map((p) => ({ ...serializePost(p), hasVi: slugs.has(`${p.slug}${VI_SUFFIX}`) }))
  return { props: { posts: rows } }
}

const STATUS_STYLE: Record<string, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  DRAFT: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  UNLISTED: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
}

export default function AdminHome({ posts }: Props) {
  const [q, setQ] = useState("")
  const rows = useMemo(
    () => posts.filter((p) => `${p.title} ${p.slug} ${p.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())),
    [posts, q]
  )

  return (
    <AdminLayout
      title="Posts"
      actions={
        <>
          <input className="field w-56" placeholder="Filter…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Link href="/admin/posts/new" className="btn-primary">
            <FiPlus /> New post
          </Link>
        </>
      }
    >
      <div className="panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Type</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/posts/${p.id}`} className="font-medium text-zinc-900 hover:text-accent-600 dark:text-zinc-100">
                    {p.title}
                  </Link>
                  <div className="text-xs text-zinc-500">/{p.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[p.status]}`}>
                    {p.status.toLowerCase()}
                  </span>
                  {p.hasVi && (
                    <span className="ml-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-500/10 dark:text-sky-400">
                      vi
                    </span>
                  )}
                </td>
                <td className="hidden px-4 py-3 text-zinc-500 md:table-cell">{p.type.toLowerCase()}</td>
                <td className="hidden px-4 py-3 text-zinc-500 md:table-cell">{formatDate(p.updatedAt, "en-US")}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-zinc-500">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
