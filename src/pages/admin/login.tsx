import Head from "next/head"
import { useRouter } from "next/router"
import { FormEvent, useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error || "Login failed")
    const next = typeof router.query.next === "string" && router.query.next.startsWith("/admin") ? router.query.next : "/admin"
    router.replace(next)
  }

  return (
    <div className="grid min-h-screen place-items-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <Head>
        <title>Admin login</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <form onSubmit={submit} className="panel w-full max-w-sm p-6 shadow-sm">
        <h1 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-white">around-ai admin</h1>
        <p className="mb-6 text-sm text-zinc-500">Sign in to write and manage posts.</p>
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          className="field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button className="btn-primary mt-5 w-full" disabled={loading || !password}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  )
}
