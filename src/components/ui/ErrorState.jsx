export function ErrorState({ error }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-950 shadow-sm">
      <p className="text-base font-bold">No se pudo cargar el geoportal</p>
      <p className="mt-2 text-sm text-red-800">
        {error?.message || 'Ocurrió un error al leer los datos de refugios.'}
      </p>
    </div>
  )
}
