import { CONFIG } from "site.config"
import { FiGithub, FiInstagram, FiLinkedin, FiMail } from "react-icons/fi"

const SocialLinks: React.FC<{ className?: string }> = ({ className = "" }) => {
  const p = CONFIG.profile
  const items = [
    p.github && { href: `https://github.com/${p.github}`, label: "GitHub", Icon: FiGithub },
    p.linkedin && { href: `https://www.linkedin.com/in/${p.linkedin}`, label: "LinkedIn", Icon: FiLinkedin },
    p.instagram && { href: `https://www.instagram.com/${p.instagram}`, label: "Instagram", Icon: FiInstagram },
    p.email && { href: `mailto:${p.email}`, label: "Email", Icon: FiMail },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof FiMail }[]

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noreferrer"
          className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <Icon className="h-[18px] w-[18px]" />
        </a>
      ))}
    </div>
  )
}

export default SocialLinks
