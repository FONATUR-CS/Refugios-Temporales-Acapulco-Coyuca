export function LoadingState() {
  return (
    <div className="grid min-h-72 place-items-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-institutional-100 border-t-institutional-700" />
        <p className="mt-4 text-sm font-semibold text-slate-700">Cargando refugios temporales...</p>
      </div>
    </div>
  )
}
