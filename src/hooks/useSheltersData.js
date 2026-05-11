import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { joinShelters } from '../lib/joinShelters'
import { normalizeKey } from '../lib/normalize'

const CSV_URL = '/data/refugios2026.csv'
const GEOJSON_URL = '/data/refugios.geojson'

function parseCsv(text) {
  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: normalizeKey,
    transform: (value) => (typeof value === 'string' ? value.trim() : value),
  })

  if (result.errors?.length) {
    throw new Error(`No se pudo leer el CSV: ${result.errors[0].message}`)
  }

  return result.data
}

export function useSheltersData() {
  const [state, setState] = useState({
    shelters: [],
    warnings: [],
    diagnostics: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadData() {
      try {
        setState((current) => ({ ...current, loading: true, error: null }))

        const [csvResponse, geojsonResponse] = await Promise.all([
          fetch(CSV_URL, { signal: controller.signal }),
          fetch(GEOJSON_URL, { signal: controller.signal }),
        ])

        if (!csvResponse.ok) throw new Error('No se pudo cargar refugios2026.csv')
        if (!geojsonResponse.ok) throw new Error('No se pudo cargar refugios.geojson')

        const [csvText, geojson] = await Promise.all([csvResponse.text(), geojsonResponse.json()])
        const csvRows = parseCsv(csvText)
        const joined = joinShelters(csvRows, geojson)

        joined.warnings.forEach((warning) => {
          console.warn(`[Refugios] ${warning.message}`, warning.items)
        })

        setState({
          shelters: joined.shelters,
          warnings: joined.warnings,
          diagnostics: joined.diagnostics,
          loading: false,
          error: null,
        })
      } catch (error) {
        if (error.name === 'AbortError') return

        setState({
          shelters: [],
          warnings: [],
          diagnostics: null,
          loading: false,
          error,
        })
      }
    }

    loadData()

    return () => controller.abort()
  }, [])

  return state
}
