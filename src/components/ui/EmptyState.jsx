export function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <p className="text-base font-bold text-slate-900">No se encontraron refugios</p>
      <p className="mt-2 text-sm text-slate-600">
        Ajusta la búsqueda o cambia el municipio para ver más resultados.
      </p>
    </div>
  )
}
