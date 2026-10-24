import { CONFIG } from "site.config"
import SocialLinks from "@components/SocialLinks"

const Footer: React.FC = () => {
  const from = +CONFIG.since || new Date().getFullYear()
  const now = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:px-6 dark:text-zinc-400">
        <p>
          © {from === now ? now : `${from} – ${now}`} {CONFIG.profile.name}
        </p>
        <SocialLinks />
      </div>
    </footer>
  )
}

export default Footer
