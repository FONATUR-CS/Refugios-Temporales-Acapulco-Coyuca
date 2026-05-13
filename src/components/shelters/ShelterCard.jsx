import { buildGoogleMapsDirectionsUrl } from '../../lib/mapUtils'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

function capacityLabel(shelter) {
  const people = shelter.capacityPeople ? `${shelter.capacityPeople.toLocaleString('es-MX')} personas` : null
  const families = shelter.capacityFamilies ? `${shelter.capacityFamilies.toLocaleString('es-MX')} familias` : null
  return [people, families].filter(Boolean).join(' / ') || 'Capacidad no disponible'
}

export function ShelterCard({ shelter, selected, onSelect }) {
  const directionsUrl = buildGoogleMapsDirectionsUrl(shelter.coordinates.lat, shelter.coordinates.lng)

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        selected ? 'border-gold-500 ring-4 ring-gold-100' : 'border-slate-200'
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${selected ? 'bg-gradient-to-r from-gold-500 to-sand-100' : 'bg-institutional-600'}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge>{shelter.municipality || 'Sin municipio'}</Badge>
          <h3 className="font-display mt-3 line-clamp-2 text-base font-bold leading-6 text-slate-950">
            {shelter.name}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-gold-50 px-2.5 py-1 text-xs font-bold text-gold-700 ring-1 ring-gold-100">
          {shelter.key}
        </span>
      </div>
      {shelter.distanceLabel ? (
        <p className="mt-3 rounded-2xl bg-institutional-50 px-3 py-2 text-sm font-bold text-institutional-700 ring-1 ring-institutional-100">
          A {shelter.distanceLabel} de tu ubicación
        </p>
      ) : null}
      <dl className="mt-4 space-y-3 text-sm">
        <div className="rounded-2xl bg-slate-50 px-3 py-2">
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Dirección</dt>
          <dd className="mt-1 leading-5 text-slate-800">{shelter.address || 'Sin dirección registrada'}</dd>
        </div>
        <div className="rounded-2xl bg-gold-50 px-3 py-2 ring-1 ring-gold-100">
          <dt className="text-xs font-bold uppercase tracking-wide text-gold-700">Capacidad</dt>
          <dd className="mt-1 font-semibold text-slate-900">{capacityLabel(shelter)}</dd>
        </div>
      </dl>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button onClick={() => onSelect(shelter.id)} variant={selected ? 'primary' : 'secondary'}>
          Ubicar
        </Button>
        <Button href={directionsUrl} variant="primary">
          Cómo llegar
        </Button>
      </div>
    </article>
  )
}
