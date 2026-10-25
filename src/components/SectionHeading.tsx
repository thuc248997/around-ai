import Link from "next/link"
import { FiArrowUpRight } from "react-icons/fi"

type Props = {
  index: string
  label: string
  title: React.ReactNode
  link?: { href: string; label: string }
  className?: string
}

/** `01 / LABEL` eyebrow, a title, and an optional "see all" link on the right */
const SectionHeading: React.FC<Props> = ({ index, label, title, link, className = "" }) => (
  <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${className}`}>
    <div>
      <p className="eyebrow mb-3">
        {index} / {label}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-term-fg sm:text-[1.75rem]">{title}</h2>
    </div>
    {link && (
      <Link href={link.href} className="link-term">
        {link.label} <FiArrowUpRight />
      </Link>
    )}
  </div>
)

export default SectionHeading
