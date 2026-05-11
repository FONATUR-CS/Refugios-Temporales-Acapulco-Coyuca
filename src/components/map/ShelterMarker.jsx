import L from 'leaflet'
import { useEffect, useMemo, useRef } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { ShelterPopup } from './ShelterPopup'

function createShelterIcon(selected) {
  return L.divIcon({
    className: selected ? 'shelter-marker shelter-marker-selected' : 'shelter-marker',
    html: `<span><img src="/refugio.svg" alt="" /></span>`,
    iconSize: selected ? [46, 46] : [36, 36],
    iconAnchor: selected ? [23, 41] : [18, 32],
    popupAnchor: [0, -32],
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
      <Popup maxWidth={300} minWidth={260}>
        <ShelterPopup shelter={shelter} />
      </Popup>
    </Marker>
  )
}
