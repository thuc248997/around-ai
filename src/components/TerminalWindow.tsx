type Props = { title: string; children: React.ReactNode; className?: string; footer?: React.ReactNode }

/** A fake terminal window: traffic-light title bar + dark body (dark in both themes) */
const TerminalWindow: React.FC<Props> = ({ title, children, className = "", footer }) => (
  <div
    className={`overflow-hidden rounded-lg border border-term-line bg-term-band text-[13px] text-[#cdd6de] shadow-xl shadow-black/10 ${className}`}
  >
    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      <span className="ml-2 truncate text-[11px] text-white/50">{title}</span>
    </div>
    <div className="p-4 sm:p-5">{children}</div>
    {footer && (
      <div className="border-t border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-white/40">
        {footer}
      </div>
    )}
  </div>
)

export default TerminalWindow
