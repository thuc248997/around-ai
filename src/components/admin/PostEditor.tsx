import { useRouter } from "next/router"
import { ChangeEvent, ClipboardEvent, DragEvent, useCallback, useEffect, useRef, useState } from "react"
import { FiEye, FiImage, FiPaperclip, FiSave, FiTrash2, FiUpload } from "react-icons/fi"
import Markdown from "@components/Markdown"
import { formatBytes, slugify } from "@libs/utils"
import { TAttachment, TPostDetail } from "@customTypes/index"

type Props = {
  post?: TPostDetail
  attachments?: TAttachment[]
}

type Form = {
  title: string
  slug: string
  summary: string
  content: string
  tags: string
  category: string
  coverImage: string
  status: TPostDetail["status"]
  type: TPostDetail["type"]
  publishedAt: string
}

// <input type="datetime-local"> wants local time without zone
const toLocalInput = (iso?: string | null) => {
  if (!iso) return ""
  const d = new Date(iso)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

const PostEditor: React.FC<Props> = ({ post, attachments: initialAttachments = [] }) => {
  const router = useRouter()
  const textarea = useRef<HTMLTextAreaElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<Form>({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    summary: post?.summary ?? "",
    content: post?.content ?? "",
    tags: post?.tags.join(", ") ?? "",
    category: post?.category ?? "",
    coverImage: post?.coverImage ?? "",
    status: post?.status ?? "DRAFT",
    type: post?.type ?? "POST",
    publishedAt: toLocalInput(post?.publishedAt),
  })
  const [slugTouched, setSlugTouched] = useState(Boolean(post))
  const [attachments, setAttachments] = useState<TAttachment[]>(initialAttachments)
  const [tab, setTab] = useState<"write" | "preview">("write")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null)

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setDirty(true)
    setForm((f) => ({
      ...f,
      [key]: value,
      ...(key === "title" && !slugTouched ? { slug: slugify(String(value)) } : {}),
    }))
  }

  const onField = (key: keyof Form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(key, e.target.value as any)

  // warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty])

  const insertAtCursor = (text: string) => {
    const el = textarea.current
    setDirty(true)
    setForm((f) => {
      if (!el) return { ...f, content: `${f.content}\n${text}` }
      const start = el.selectionStart
      const end = el.selectionEnd
      requestAnimationFrame(() => {
        el.focus()
        el.selectionStart = el.selectionEnd = start + text.length
      })
      return { ...f, content: f.content.slice(0, start) + text + f.content.slice(end) }
    })
  }

  const markdownFor = (a: TAttachment) =>
    a.mimeType.startsWith("image/") ? `![${a.filename}](${a.url})` : `[📎 ${a.filename}](${a.url})`

  const upload = async (files: FileList | File[], insert = true) => {
    const list = Array.from(files)
    if (!list.length) return
    setUploading(true)
    setMessage(null)
    const body = new FormData()
    list.forEach((f) => body.append("file", f, f.name))
    const res = await fetch(`/api/admin/upload${post ? `?postId=${post.id}` : ""}`, { method: "POST", body })
    setUploading(false)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return setMessage({ kind: "error", text: data.error || "Upload failed" })
    setAttachments((a) => [...data, ...a])
    if (insert) insertAtCursor(data.map(markdownFor).join("\n") + "\n")
    return data as TAttachment[]
  }

  const removeAttachment = async (a: TAttachment) => {
    if (!confirm(`Delete ${a.filename}? Links to it will break.`)) return
    const res = await fetch(`/api/admin/attachments/${a.id}`, { method: "DELETE" })
    if (res.ok) setAttachments((list) => list.filter((x) => x.id !== a.id))
  }

  const save = useCallback(
    async (overrides: Partial<Form> = {}) => {
      setSaving(true)
      setMessage(null)
      const payload = {
        ...form,
        ...overrides,
        publishedAt: (overrides.publishedAt ?? form.publishedAt) ? new Date(overrides.publishedAt ?? form.publishedAt).toISOString() : null,
        attachmentIds: post ? undefined : attachments.map((a) => a.id),
      }
      const res = await fetch(post ? `/api/admin/posts/${post.id}` : "/api/admin/posts", {
        method: post ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      setSaving(false)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) return setMessage({ kind: "error", text: data.error || "Save failed" })
      setDirty(false)
      setForm((f) => ({ ...f, ...overrides, slug: data.slug, publishedAt: toLocalInput(data.publishedAt) }))
      setMessage({ kind: "ok", text: "Saved" })
      if (!post) router.replace(`/admin/posts/${data.id}`)
    },
    [form, post, attachments, router]
  )

  // Ctrl/Cmd+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        if (!saving) save()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [save, saving])

  const remove = async () => {
    if (!post || !confirm("Delete this post permanently?")) return
    const res = await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" })
    if (res.ok) {
      setDirty(false)
      router.replace("/admin")
    }
  }

  const onPaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(e.clipboardData.files)
    if (files.length) {
      e.preventDefault()
      upload(files)
    }
  }

  const onDrop = (e: DragEvent<HTMLTextAreaElement>) => {
    if (e.dataTransfer.files.length) {
      e.preventDefault()
      upload(e.dataTransfer.files)
    }
  }

  const publicUrl = `/${form.slug}`

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <input
          className="field border-none bg-transparent px-0 text-2xl font-semibold shadow-none focus:ring-0 dark:bg-transparent"
          placeholder="Post title"
          value={form.title}
          onChange={onField("title")}
          autoFocus={!post}
        />
        <textarea
          className="field min-h-[60px] resize-y"
          placeholder="Short summary shown on the feed and in link previews"
          value={form.summary}
          onChange={onField("summary")}
          rows={2}
        />

        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-200 px-2 dark:border-zinc-800">
            <div className="flex">
              {(["write", "preview"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`border-b-2 px-3 py-2.5 text-sm font-medium capitalize ${
                    tab === t
                      ? "border-accent-500 text-zinc-900 dark:text-white"
                      : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="btn-ghost text-xs" onClick={() => fileInput.current?.click()} disabled={uploading}>
              <FiUpload /> {uploading ? "Uploading…" : "Upload file"}
            </button>
          </div>
          {tab === "write" ? (
            <textarea
              ref={textarea}
              className="block min-h-[60vh] w-full resize-y bg-transparent p-4 font-mono text-[13.5px] leading-relaxed text-zinc-800 outline-none dark:text-zinc-200"
              placeholder={"Write in Markdown…\n\nPaste or drop images/files here to upload them.\nUse ```mermaid code blocks for diagrams."}
              value={form.content}
              onChange={onField("content")}
              onPaste={onPaste}
              onDrop={onDrop}
            />
          ) : (
            <div className="min-h-[60vh] p-6">
              {form.content.trim() ? <Markdown content={form.content} /> : <p className="text-zinc-500">Nothing to preview.</p>}
            </div>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) upload(e.target.files)
            e.target.value = ""
          }}
        />
      </div>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="panel space-y-4 p-4">
          <div className="flex gap-2">
            <button className="btn-primary flex-1" onClick={() => save()} disabled={saving}>
              <FiSave /> {saving ? "Saving…" : "Save"}
            </button>
            {form.status === "DRAFT" && (
              <button className="btn-secondary" onClick={() => save({ status: "PUBLISHED" })} disabled={saving}>
                Publish
              </button>
            )}
          </div>
          {message && (
            <p className={`text-sm ${message.kind === "ok" ? "text-emerald-600" : "text-red-600"}`}>{message.text}</p>
          )}
          {post && form.status !== "DRAFT" && (
            <a href={publicUrl} target="_blank" rel="noreferrer" className="btn-ghost w-full">
              <FiEye /> View live
            </a>
          )}

          <div>
            <label className="label">Status</label>
            <select className="field" value={form.status} onChange={onField("status")}>
              <option value="DRAFT">Draft (hidden)</option>
              <option value="PUBLISHED">Published</option>
              <option value="UNLISTED">Unlisted (link only)</option>
            </select>
          </div>
          <div>
            <label className="label">Type</label>
            <select className="field" value={form.type} onChange={onField("type")}>
              <option value="POST">Post (in feed)</option>
              <option value="PAGE">Page (e.g. /about)</option>
            </select>
          </div>
          <div>
            <label className="label">Slug</label>
            <input
              className="field font-mono text-xs"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                set("slug", e.target.value)
              }}
              onBlur={() => set("slug", slugify(form.slug || form.title))}
            />
            <p className="mt-1 text-xs text-zinc-500">
              Vietnamese version: same slug + <code>-vi</code> (e.g. <code>about-vi</code>), shown at /vi/&lt;slug&gt;.
            </p>
          </div>
          <div>
            <label className="label">Tags (comma separated)</label>
            <input className="field" value={form.tags} onChange={onField("tags")} placeholder="llm, rag" />
          </div>
          <div>
            <label className="label">Category</label>
            <input className="field" value={form.category} onChange={onField("category")} placeholder="Tutorial" />
          </div>
          <div>
            <label className="label">Publish date</label>
            <input type="datetime-local" className="field" value={form.publishedAt} onChange={onField("publishedAt")} />
          </div>
          <div>
            <label className="label">Cover image URL</label>
            <input className="field" value={form.coverImage} onChange={onField("coverImage")} placeholder="/uploads/…" />
            {form.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.coverImage} alt="" className="mt-2 aspect-video w-full rounded-lg object-cover" />
            )}
          </div>
          {post && (
            <button className="btn-danger w-full" onClick={remove}>
              <FiTrash2 /> Delete post
            </button>
          )}
        </div>

        <div className="panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="label mb-0">Attachments</span>
            <span className="text-xs text-zinc-400">{attachments.length}</span>
          </div>
          {!attachments.length && <p className="text-sm text-zinc-500">Upload, paste or drop files into the editor.</p>}
          <ul className="space-y-2">
            {attachments.map((a) => (
              <li key={a.id} className="flex items-center gap-2 text-sm">
                {a.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt="" className="h-9 w-9 shrink-0 rounded object-cover" />
                ) : (
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-zinc-100 text-zinc-500 dark:bg-zinc-800">
                    <FiPaperclip />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <a href={a.url} target="_blank" rel="noreferrer" className="block truncate text-zinc-800 hover:underline dark:text-zinc-200">
                    {a.filename}
                  </a>
                  <div className="flex gap-2 text-xs text-zinc-500">
                    <span>{formatBytes(a.size)}</span>
                    <button className="hover:text-accent-600" onClick={() => insertAtCursor(markdownFor(a) + "\n")}>
                      insert
                    </button>
                    {a.mimeType.startsWith("image/") && (
                      <button className="inline-flex items-center gap-0.5 hover:text-accent-600" onClick={() => set("coverImage", a.url)}>
                        <FiImage /> cover
                      </button>
                    )}
                    <button className="hover:text-red-600" onClick={() => removeAttachment(a)}>
                      delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}

export default PostEditor
