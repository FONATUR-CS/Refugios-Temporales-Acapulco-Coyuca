import L from 'leaflet'
import { useEffect, useMemo, useRef } from 'react'
import { CircleMarker, LayersControl, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { ClusterGroup } from './ClusterGroup'
import { DEFAULT_CENTER, DEFAULT_ZOOM, getSheltersBounds } from '../../lib/mapUtils'
import { ShelterMarker } from './ShelterMarker'

function createClusterIcon(cluster) {
  const count = cluster.getChildCount()
  const size = count < 10 ? 36 : count < 30 ? 42 : 48
  return L.divIcon({
    html: `<div class="shelter-cluster" style="width:${size}px;height:${size}px">${count}</div>`,
    className: '',
    iconSize: L.point(size, size, true),
    iconAnchor: L.point(size / 2, size / 2, true),
  })
}

function getMapBounds(shelters, userLocation) {
  const shelterBounds = getSheltersBounds(shelters) ?? []
  const userPoint = userLocation ? [[userLocation.lat, userLocation.lng]] : []
  const points = [...shelterBounds, ...userPoint]
  return points.length ? points : null
}

function FitShelterBounds({ shelters, userLocation }) {
  const map = useMap()
  const fittedOnceRef = useRef(false)
  const boundsKey = `${shelters.map((shelter) => shelter.id).join('|')}|${userLocation?.lat ?? ''}|${userLocation?.lng ?? ''}`
  const bounds = useMemo(() => getMapBounds(shelters, userLocation), [boundsKey, shelters, userLocation])

  useEffect(() => {
    if (fittedOnceRef.current) return
    if (!bounds?.length) return

    fittedOnceRef.current = true

    if (bounds.length === 1) {
      map.setView(bounds[0], 14, { animate: true })
      return
    }

    map.fitBounds(bounds, { padding: [34, 34], maxZoom: 14 })
  }, [boundsKey, map])

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
  const boundsKey = `${shelters.map((shelter) => shelter.id).join('|')}|${userLocation?.lat ?? ''}|${userLocation?.lng ?? ''}`
  const bounds = useMemo(() => getMapBounds(shelters, userLocation), [boundsKey, shelters, userLocation])
  const boundsRef = useRef(bounds)

  useEffect(() => {
    boundsRef.current = bounds
  }, [bounds])

  useEffect(() => {
    const control = L.control({ position: 'topright' })

    control.onAdd = () => {
      const container = L.DomUtil.create('div', 'leaflet-control map-ctrl')
      const button = L.DomUtil.create('button', 'map-ctrl-btn', container)
      button.type = 'button'
      button.title = 'Restablecer vista general'
      button.setAttribute('aria-label', 'Restablecer vista general')
      button.innerHTML = `
        <svg aria-hidden="true" class="map-ctrl-icon" viewBox="0 0 24 24" focusable="false">
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10.5V20h13v-9.5" />
          <path d="M9.5 20v-5.5h5V20" />
        </svg>
      `

      L.DomEvent.disableClickPropagation(container)
      L.DomEvent.disableScrollPropagation(container)
      L.DomEvent.on(button, 'click', (event) => {
        L.DomEvent.preventDefault(event)
        const currentBounds = boundsRef.current

        if (currentBounds?.length > 1) {
          map.closePopup()
          map.fitBounds(currentBounds, { animate: true, padding: [34, 34], maxZoom: 14 })
          return
        }

        if (currentBounds?.length === 1) {
          map.closePopup()
          map.setView(currentBounds[0], 14, { animate: true })
          return
        }

        map.closePopup()
        map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true })
      })

      return container
    }

    control.addTo(map)

    return () => control.remove()
  }, [map])

  return null
}

function UserLocationControl({ hasLocation, loading, onClearLocation, onRequestLocation }) {
  const map = useMap()

  useEffect(() => {
    const control = L.control({ position: 'topright' })

    control.onAdd = () => {
      const container = L.DomUtil.create('div', 'leaflet-control map-ctrl')
      const button = L.DomUtil.create(
        'button',
        `map-ctrl-btn map-ctrl-btn--location${hasLocation ? ' is-active' : ''}`,
        container,
      )
      button.type = 'button'
      button.title = hasLocation ? 'Quitar mi ubicación' : 'Usar mi ubicación'
      button.setAttribute('aria-label', hasLocation ? 'Quitar mi ubicación' : 'Usar mi ubicación')
      button.setAttribute('aria-busy', loading ? 'true' : 'false')
      button.innerHTML = `
        <svg aria-hidden="true" class="map-ctrl-icon map-ctrl-icon--fill" viewBox="0 0 24 24" focusable="false">
          <path fill="currentColor" fill-rule="evenodd" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          <ellipse fill="currentColor" cx="12" cy="22.5" rx="3" ry="1.2" />
        </svg>
      `

      L.DomEvent.disableClickPropagation(container)
      L.DomEvent.disableScrollPropagation(container)
      L.DomEvent.on(button, 'click', (event) => {
        L.DomEvent.preventDefault(event)

        if (loading) return
        if (hasLocation) onClearLocation()
        else onRequestLocation()
      })

      return container
    }

    control.addTo(map)

    return () => control.remove()
  }, [hasLocation, loading, map, onClearLocation, onRequestLocation])

  return null
}

function UserLocationMarker({ location }) {
  if (!location) return null

  return (
    <CircleMarker
      center={[location.lat, location.lng]}
      className="user-location-marker"
      pathOptions={{ color: '#ffffff', fillColor: '#2563eb', fillOpacity: 0.85, weight: 3 }}
      radius={10}
    >
      <Popup>
        <div className="font-sans text-sm font-bold text-slate-900">Tu ubicación aproximada</div>
      </Popup>
    </CircleMarker>
  )
}

export function ShelterMap({
  shelters,
  selectedShelter,
  selectedShelterId,
  onSelect,
  userLocation,
  userLocationLoading,
  onRequestUserLocation,
  onClearUserLocation,
}) {
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
      <UserLocationControl
        hasLocation={Boolean(userLocation)}
        loading={userLocationLoading}
        onClearLocation={onClearUserLocation}
        onRequestLocation={onRequestUserLocation}
      />
      <UserLocationMarker location={userLocation} />
      <ClusterGroup
        animate
        chunkedLoading
        disableClusteringAtZoom={17}
        iconCreateFunction={createClusterIcon}
        maxClusterRadius={55}
        showCoverageOnHover={false}
        spiderfyOnMaxZoom
      >
        {shelters.map((shelter) => (
          <ShelterMarker
            key={shelter.id}
            onSelect={onSelect}
            selected={shelter.id === selectedShelterId}
            shelter={shelter}
          />
        ))}
      </ClusterGroup>
    </MapContainer>
  )
}
