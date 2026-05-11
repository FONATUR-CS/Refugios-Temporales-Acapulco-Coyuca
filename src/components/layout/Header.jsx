export function Header() {
  return (
    <header className="z-20 border-b border-white/10 bg-institutional-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-institutional-100 sm:text-xs">
            Geoportal 2026
          </p>
          <h1 className="truncate text-lg font-extrabold tracking-tight sm:text-xl lg:text-2xl">
            Refugios temporales Acapulco - Coyuca
          </h1>
        </div>
        <details className="shrink-0 rounded-xl bg-white/10 px-3 py-2 text-xs text-slate-100 backdrop-blur">
          <summary className="cursor-pointer font-bold text-white">Fuentes</summary>
          <p className="mt-2 max-w-xs leading-5">
            Sistema Nacional de Registro de Refugios Temporales; Protección Civil Guerrero;
            Gobierno Municipal de Acapulco de Juárez; Gobierno Municipal de Coyuca de Benítez.
          </p>
        </details>
      </div>
    </header>
  )
}
