export function ShelterFilters({ query, onQueryChange, municipality, municipalities, onMunicipalityChange, onClear }) {
  const hasFilters = query || municipality !== 'Todos'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_150px] md:grid-cols-1">
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wide text-institutional-700">Buscar refugio</span>
          <input
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-institutional-600 focus:bg-white focus:ring-4 focus:ring-institutional-100"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Nombre, colonia o clave"
            type="search"
            value={query}
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wide text-institutional-700">Municipio</span>
          <select
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-institutional-600 focus:bg-white focus:ring-4 focus:ring-institutional-100"
            onChange={(event) => onMunicipalityChange(event.target.value)}
            value={municipality}
          >
            {municipalities.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      {hasFilters ? (
        <button
          className="mt-2 inline-flex rounded-full bg-gold-50 px-3 py-1 text-xs font-bold text-gold-700 ring-1 ring-gold-100 transition hover:bg-gold-100"
          onClick={onClear}
          type="button"
        >
          Limpiar filtros
        </button>
      ) : null}
    </div>
  )
}
