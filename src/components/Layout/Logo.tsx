import Link from "next/link"
import { CONFIG } from "site.config"
import { useT } from "@libs/i18n"

/** `>_` mark + site name, with an optional subtitle line */
const Logo: React.FC<{ subtitle?: boolean }> = ({ subtitle }) => {
  const { t } = useT()
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="grid h-7 w-7 shrink-0 sm:h-8 sm:w-8 place-items-center rounded-md bg-term-band text-xs font-bold text-[#4ade80] sm:text-[13px] ring-1 ring-term-line">
        &gt;_
      </span>
      <span className="leading-tight">
        <span className="block whitespace-nowrap text-[13px] font-bold sm:text-sm text-term-fg group-hover:text-term-green">
          {CONFIG.blog.title.toLowerCase()}
          <span className="text-term-green">.com</span>
        </span>
        {subtitle && (
          <span className="hidden text-[10px] uppercase tracking-[0.16em] text-term-muted sm:block">
            {t.logoSubtitle}
          </span>
        )}
      </span>
    </Link>
  )
}

export default Logo
