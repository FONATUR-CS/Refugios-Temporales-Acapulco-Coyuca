import { cleanValue, isAffirmative, normalizeKey, normalizeText, parseCapacity } from './normalize.js'
import { getFeatureLatLng, isCoordinateInProjectArea } from './mapUtils.js'

const REQUIRED_CSV_HEADERS = ['CLV', 'Nombre', 'Dirección', 'Municipio']
const OPTIONAL_CSV_HEADERS = ['2026', 'Capacidad de personas', 'Capacidad de familias', 'Ubicación']

function createWarning(type, message, items = []) {
  return { type, message, items }
}

function getDuplicateKeys(records, keyGetter) {
  const counts = new Map()

  records.forEach((record) => {
    const key = normalizeKey(keyGetter(record))
    if (!key) return
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([key, count]) => ({ key, count }))
}

function indexByKey(records, keyGetter) {
  const index = new Map()

  records.forEach((record) => {
    const key = normalizeKey(keyGetter(record))
    if (!key || index.has(key)) return
    index.set(key, record)
  })

  return index
}

export function joinShelters(csvRows, geojson) {
  const rows = Array.isArray(csvRows) ? csvRows : []
  const features = Array.isArray(geojson?.features) ? geojson.features : []
  const warnings = []
  const headers = new Set(Object.keys(rows[0] ?? {}).map(normalizeKey))
  const missingHeaders = [...REQUIRED_CSV_HEADERS, ...OPTIONAL_CSV_HEADERS].filter(
    (header) => !headers.has(header),
  )

  if (missingHeaders.length) {
    warnings.push(
      createWarning(
        'missing-csv-headers',
        `Campos faltantes en CSV: ${missingHeaders.join(', ')}`,
        missingHeaders,
      ),
    )
  }

  if (!features.length) {
    warnings.push(createWarning('empty-geojson', 'El GeoJSON no contiene geometrías.'))
  }

  const csvDuplicates = getDuplicateKeys(rows, (row) => row.CLV)
  const geoDuplicates = getDuplicateKeys(features, (feature) => feature?.properties?.CLAVE)

  if (csvDuplicates.length) {
    warnings.push(
      createWarning('duplicate-csv-keys', 'Claves duplicadas en CSV.', csvDuplicates),
    )
  }

  if (geoDuplicates.length) {
    warnings.push(
      createWarning('duplicate-geojson-keys', 'Claves duplicadas en GeoJSON.', geoDuplicates),
    )
  }

  const featureIndex = indexByKey(features, (feature) => feature?.properties?.CLAVE)
  const csvIndex = indexByKey(rows, (row) => row.CLV)
  const csvWithoutGeometry = []
  const geoWithoutCsv = []
  const invalidGeometries = []
  const outOfAreaGeometries = []
  const incompleteRecords = []

  rows.forEach((row) => {
    const key = normalizeKey(row.CLV)
    if (key && !featureIndex.has(key)) csvWithoutGeometry.push(key)
  })

  features.forEach((feature) => {
    const key = normalizeKey(feature?.properties?.CLAVE)
    if (key && !csvIndex.has(key)) geoWithoutCsv.push(key)
  })

  const shelters = rows
    .map((row) => {
      const key = normalizeKey(row.CLV)
      const feature = featureIndex.get(key)
      const coordinates = getFeatureLatLng(feature)
      const missingFields = REQUIRED_CSV_HEADERS.filter((field) => !cleanValue(row[field]))

      if (missingFields.length) {
        incompleteRecords.push({ key: key || '(sin CLV)', missingFields })
      }

      if (!feature || !coordinates) {
        invalidGeometries.push(key || '(sin CLV)')
        return null
      }

      if (!isCoordinateInProjectArea(coordinates.lat, coordinates.lng)) {
        outOfAreaGeometries.push({ key, coordinates })
      }

      const name = cleanValue(row.Nombre) || cleanValue(feature?.properties?.name) || key
      const address = cleanValue(row['Dirección'])
      const municipality = cleanValue(row.Municipio)
      const capacityPeople = parseCapacity(row['Capacidad de personas'])
      const capacityFamilies = parseCapacity(row['Capacidad de familias'])
      const mapsSourceUrl = cleanValue(row['Ubicación'])
      const season2026 = cleanValue(row['2026'])

      return {
        id: key,
        key,
        name,
        address,
        municipality,
        capacityPeople,
        capacityFamilies,
        mapsSourceUrl,
        season2026,
        isActive2026: isAffirmative(season2026),
        coordinates,
        feature,
        raw: row,
        missingFields,
        isIncomplete: missingFields.length > 0,
        searchText: normalizeText([key, name, address, municipality].filter(Boolean).join(' ')),
      }
    })
    .filter((shelter) => shelter?.isActive2026)

  if (csvWithoutGeometry.length) {
    warnings.push(
      createWarning(
        'csv-without-geometry',
        'Registros del CSV sin geometría en GeoJSON.',
        csvWithoutGeometry,
      ),
    )
  }

  if (geoWithoutCsv.length) {
    warnings.push(
      createWarning(
        'geojson-without-csv',
        'Geometrías del GeoJSON sin registro tabular en CSV.',
        geoWithoutCsv,
      ),
    )
  }

  if (invalidGeometries.length) {
    warnings.push(
      createWarning('invalid-geometries', 'Registros omitidos por geometría inválida.', invalidGeometries),
    )
  }

  if (outOfAreaGeometries.length) {
    warnings.push(
      createWarning(
        'out-of-area-geometries',
        'Coordenadas fuera del rango esperado Acapulco/Coyuca.',
        outOfAreaGeometries,
      ),
    )
  }

  if (incompleteRecords.length) {
    warnings.push(
      createWarning('incomplete-records', 'Registros con campos obligatorios faltantes.', incompleteRecords),
    )
  }

  return {
    shelters,
    warnings,
    diagnostics: {
      csvRows: rows.length,
      geoFeatures: features.length,
      joinedShelters: shelters.length,
      active2026Shelters: shelters.length,
      incompleteRecords: incompleteRecords.length,
    },
  }
}
