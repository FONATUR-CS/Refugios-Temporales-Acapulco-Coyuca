const AREA_BOUNDS = {
  minLat: 16.45,
  maxLat: 17.45,
  minLng: -100.45,
  maxLng: -99.45,
}

export const DEFAULT_CENTER = [16.86, -99.9]
export const DEFAULT_ZOOM = 10

export function isValidCoordinate(lat, lng) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}

export function isCoordinateInProjectArea(lat, lng) {
  return (
    isValidCoordinate(lat, lng) &&
    lat >= AREA_BOUNDS.minLat &&
    lat <= AREA_BOUNDS.maxLat &&
    lng >= AREA_BOUNDS.minLng &&
    lng <= AREA_BOUNDS.maxLng
  )
}

export function getFeatureLatLng(feature) {
  const geometry = feature?.geometry

  if (!geometry) return null

  if (geometry.type === 'Point') {
    const [lng, lat] = geometry.coordinates ?? []
    return isValidCoordinate(Number(lat), Number(lng)) ? { lat: Number(lat), lng: Number(lng) } : null
  }

  if (geometry.type === 'MultiPoint') {
    const [lng, lat] = geometry.coordinates?.[0] ?? []
    return isValidCoordinate(Number(lat), Number(lng)) ? { lat: Number(lat), lng: Number(lng) } : null
  }

  return null
}

export function buildGoogleMapsDirectionsUrl(lat, lng) {
  if (!isValidCoordinate(lat, lng)) return null
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

export function calculateDistanceKm(origin, destination) {
  if (!origin || !destination) return null
  if (!isValidCoordinate(origin.lat, origin.lng)) return null
  if (!isValidCoordinate(destination.lat, destination.lng)) return null

  const earthRadiusKm = 6371
  const toRadians = (degrees) => (degrees * Math.PI) / 180
  const deltaLat = toRadians(destination.lat - origin.lat)
  const deltaLng = toRadians(destination.lng - origin.lng)
  const originLat = toRadians(origin.lat)
  const destinationLat = toRadians(destination.lat)

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(originLat) *
      Math.cos(destinationLat) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2)

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistanceKm(distanceKm) {
  if (!Number.isFinite(distanceKm)) return 'Distancia no disponible'
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000).toLocaleString('es-MX')} m aprox.`
  return `${distanceKm.toLocaleString('es-MX', { maximumFractionDigits: 1 })} km aprox.`
}

export function getSheltersBounds(shelters) {
  const points = shelters
    .map((shelter) => shelter.coordinates)
    .filter((coords) => coords && isValidCoordinate(coords.lat, coords.lng))

  if (!points.length) return null

  return points.map(({ lat, lng }) => [lat, lng])
}
