import { buildGoogleMapsDirectionsUrl } from '../../lib/mapUtils'
import { Button } from '../ui/Button'

export function ShelterPopup({ shelter }) {
  const directionsUrl = buildGoogleMapsDirectionsUrl(shelter.coordinates.lat, shelter.coordinates.lng)

  return (
    <div className="space-y-2 font-sans text-slate-800">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-institutional-700">
          {shelter.municipality || 'Sin municipio'} · {shelter.key}
        </p>
        <h3 className="font-display mt-0.5 text-sm font-bold leading-5 text-slate-950">
          {shelter.name}
        </h3>
      </div>
      <p className="text-xs leading-4 text-slate-600">{shelter.address || 'Sin dirección registrada'}</p>
      <p className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
        {shelter.capacityPeople
          ? `Capacidad: ${shelter.capacityPeople.toLocaleString('es-MX')} personas`
          : 'Capacidad no disponible'}
      </p>
      <Button className="min-h-9 w-full px-3 text-sm !text-gold-500" href={directionsUrl}>
        Cómo llegar
      </Button>
    </div>
  )
}
