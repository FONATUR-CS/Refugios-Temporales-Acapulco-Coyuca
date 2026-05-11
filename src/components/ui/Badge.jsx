export function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-institutional-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-institutional-700 ring-1 ring-institutional-100 ${className}`}
    >
      {children}
    </span>
  )
}
