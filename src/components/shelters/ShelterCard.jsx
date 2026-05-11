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
      className={`rounded-3xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        selected ? 'border-institutional-600 ring-4 ring-institutional-100' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge>{shelter.municipality || 'Sin municipio'}</Badge>
          <h3 className="mt-3 line-clamp-2 text-base font-extrabold leading-6 text-slate-950">
            {shelter.name}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
          {shelter.key}
        </span>
      </div>
      {shelter.distanceLabel ? (
        <p className="mt-3 rounded-2xl bg-emergency-50 px-3 py-2 text-sm font-extrabold text-emergency-700">
          A {shelter.distanceLabel} de tu ubicación
        </p>
      ) : null}
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-bold text-slate-500">Dirección</dt>
          <dd className="mt-1 leading-5 text-slate-800">{shelter.address || 'Sin dirección registrada'}</dd>
        </div>
        <div>
          <dt className="font-bold text-slate-500">Capacidad</dt>
          <dd className="mt-1 text-slate-800">{capacityLabel(shelter)}</dd>
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
