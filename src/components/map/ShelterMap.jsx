import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import { CircleMarker, LayersControl, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { DEFAULT_CENTER, DEFAULT_ZOOM, getSheltersBounds } from '../../lib/mapUtils'
import { ShelterMarker } from './ShelterMarker'

function getMapBounds(shelters, userLocation) {
  const shelterBounds = getSheltersBounds(shelters) ?? []
  const userPoint = userLocation ? [[userLocation.lat, userLocation.lng]] : []
  const points = [...shelterBounds, ...userPoint]
  return points.length ? points : null
}

function FitShelterBounds({ shelters, userLocation }) {
  const map = useMap()
  const bounds = useMemo(() => getMapBounds(shelters, userLocation), [shelters, userLocation])
  const boundsKey = `${shelters.map((shelter) => shelter.id).join('|')}|${userLocation?.lat ?? ''}|${userLocation?.lng ?? ''}`

  useEffect(() => {
    if (!bounds?.length) return

    if (bounds.length === 1) {
      map.setView(bounds[0], 14, { animate: true })
      return
    }

    map.fitBounds(bounds, { padding: [34, 34], maxZoom: 14 })
  }, [bounds, boundsKey, map])

  return null
}

function FlyToSelectedShelter({ shelter }) {
  const map = useMap()

  useEffect(() => {
    if (!shelter?.coordinates) return
    map.flyTo([shelter.coordinates.lat, shelter.coordinates.lng], 16, { duration: 0.8 })
  }, [map, shelter])

  return null
}

function ResetViewControl({ shelters, userLocation }) {
  const map = useMap()
  const bounds = useMemo(() => getMapBounds(shelters, userLocation), [shelters, userLocation])
  const boundsKey = `${shelters.map((shelter) => shelter.id).join('|')}|${userLocation?.lat ?? ''}|${userLocation?.lng ?? ''}`

  useEffect(() => {
    const control = L.control({ position: 'topright' })

    control.onAdd = () => {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control reset-view-control')
      const button = L.DomUtil.create('button', '', container)
      button.type = 'button'
      button.title = 'Restablecer vista general'
      button.setAttribute('aria-label', 'Restablecer vista general')
      button.textContent = 'Vista general'

      L.DomEvent.disableClickPropagation(container)
      L.DomEvent.on(button, 'click', (event) => {
        L.DomEvent.preventDefault(event)

        if (bounds?.length > 1) {
          map.fitBounds(bounds, { padding: [34, 34], maxZoom: 14 })
          return
        }

        if (bounds?.length === 1) {
          map.setView(bounds[0], 14, { animate: true })
          return
        }

        map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true })
      })

      return container
    }

    control.addTo(map)

    return () => control.remove()
  }, [bounds, boundsKey, map])

  return null
}

function UserLocationMarker({ location }) {
  if (!location) return null

  return (
    <CircleMarker
      center={[location.lat, location.lng]}
      className="user-location-marker"
      fillColor="#2563eb"
      fillOpacity={0.85}
      pathOptions={{ color: '#ffffff', fillColor: '#2563eb', fillOpacity: 0.85, weight: 3 }}
      radius={10}
    >
      <Popup>
        <div className="font-sans text-sm font-bold text-slate-900">Tu ubicación aproximada</div>
      </Popup>
    </CircleMarker>
  )
}

export function ShelterMap({ shelters, selectedShelter, selectedShelterId, onSelect, userLocation }) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      className="h-full min-h-[52vh] w-full lg:min-h-0"
      scrollWheelZoom
      zoom={DEFAULT_ZOOM}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Mapa base OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satélite Esri">
          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      <FitShelterBounds shelters={shelters} userLocation={userLocation} />
      <FlyToSelectedShelter shelter={selectedShelter} />
      <ResetViewControl shelters={shelters} userLocation={userLocation} />
      <UserLocationMarker location={userLocation} />
      {shelters.map((shelter) => (
        <ShelterMarker
          key={shelter.id}
          onSelect={onSelect}
          selected={shelter.id === selectedShelterId}
          shelter={shelter}
        />
      ))}
    </MapContainer>
  )
}
