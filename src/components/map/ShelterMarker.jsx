import L from 'leaflet'
import { useEffect, useMemo, useRef } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { ShelterPopup } from './ShelterPopup'

function createShelterIcon(selected) {
  return L.divIcon({
    className: 'shelter-marker-wrapper',
    html: `
      <div class="shelter-pin ${selected ? 'shelter-pin--selected' : ''}">
        <img src="/refugio.svg" alt="" />
      </div>
    `,
    iconSize: selected ? [46, 46] : [36, 36],
    iconAnchor: selected ? [23, 46] : [18, 36],
    popupAnchor: selected ? [0, -50] : [0, -40],
  })
}

export function ShelterMarker({ shelter, selected, onSelect }) {
  const markerRef = useRef(null)
  const icon = useMemo(() => createShelterIcon(selected), [selected])

  useEffect(() => {
    if (selected) markerRef.current?.openPopup()
  }, [selected])

  return (
    <Marker
      eventHandlers={{ click: () => onSelect(shelter.id) }}
      icon={icon}
      position={[shelter.coordinates.lat, shelter.coordinates.lng]}
      ref={markerRef}
    >
      <Popup autoPan={false} maxWidth={220} minWidth={180}>
        <ShelterPopup shelter={shelter} />
      </Popup>
    </Marker>
  )
}
