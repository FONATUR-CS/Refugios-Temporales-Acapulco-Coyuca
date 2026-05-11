import { buildGoogleMapsDirectionsUrl } from '../../lib/mapUtils'
import { Button } from '../ui/Button'

export function ShelterPopup({ shelter }) {
  const directionsUrl = buildGoogleMapsDirectionsUrl(shelter.coordinates.lat, shelter.coordinates.lng)

  return (
    <div className="w-64 space-y-3 pr-1 font-sans text-slate-800">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-institutional-700">
          {shelter.municipality || 'Sin municipio'} · {shelter.key}
        </p>
        <h3 className="mt-1 text-base font-extrabold leading-5 text-slate-950">{shelter.name}</h3>
      </div>
      <p className="text-sm leading-5">{shelter.address || 'Sin dirección registrada'}</p>
      <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
        {shelter.capacityPeople
          ? `Capacidad: ${shelter.capacityPeople.toLocaleString('es-MX')} personas`
          : 'Capacidad no disponible'}
      </p>
      <div>
        <Button className="min-h-10 w-full px-3" href={directionsUrl}>
          Como llegar
        </Button>
      </div>
    </div>
  )
}
