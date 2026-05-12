export function ShelterFilters({ query, onQueryChange, municipality, municipalities, onMunicipalityChange, onClear }) {
  const hasFilters = query || municipality !== 'Todos'

  return (
    <div className="space-y-2">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px] md:grid-cols-1">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Buscar refugio</span>
          <input
            className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-institutional-600 focus:ring-4 focus:ring-institutional-100"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Nombre, colonia, dirección o clave"
            type="search"
            value={query}
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Municipio</span>
          <select
            className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-institutional-600 focus:ring-4 focus:ring-institutional-100"
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
          className="text-xs font-bold text-institutional-700 hover:text-institutional-900 underline underline-offset-2 transition"
          onClick={onClear}
          type="button"
        >
          Limpiar filtros
        </button>
      ) : null}
    </div>
  )
}
