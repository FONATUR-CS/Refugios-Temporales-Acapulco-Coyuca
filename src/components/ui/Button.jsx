const variants = {
  primary: 'bg-institutional-700 text-white shadow-sm hover:bg-institutional-600 focus-visible:ring-institutional-600',
  secondary: 'bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-institutional-600',
  ghost: 'bg-transparent text-institutional-700 hover:bg-institutional-50 focus-visible:ring-institutional-600',
}

export function Button({ children, className = '', variant = 'primary', href, ...props }) {
  const classes = `inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`

  if (href) {
    return (
      <a className={classes} href={href} rel="noreferrer" target="_blank" {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  )
}
