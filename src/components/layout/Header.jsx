export function Header() {
  return (
    <header className="z-20 shrink-0 border-b border-white/10 bg-institutional-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-institutional-100 sm:text-xs">
            Geoportal 2026
          </p>
          <h1 className="font-display truncate text-base font-bold sm:text-xl lg:text-2xl">
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
