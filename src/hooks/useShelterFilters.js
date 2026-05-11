import { useMemo, useState } from 'react'
import { normalizeText } from '../lib/normalize'

const ALL_MUNICIPALITIES = 'Todos'

export function useShelterFilters(shelters) {
  const [query, setQuery] = useState('')
  const [municipality, setMunicipality] = useState(ALL_MUNICIPALITIES)
  const [selectedShelterId, setSelectedShelterId] = useState(null)

  const municipalities = useMemo(() => {
    const values = new Set(shelters.map((shelter) => shelter.municipality).filter(Boolean))
    return [ALL_MUNICIPALITIES, ...Array.from(values).sort((a, b) => a.localeCompare(b, 'es'))]
  }, [shelters])

  const filteredShelters = useMemo(() => {
    const normalizedQuery = normalizeText(query)

    return shelters.filter((shelter) => {
      const matchesQuery = !normalizedQuery || shelter.searchText.includes(normalizedQuery)
      const matchesMunicipality =
        municipality === ALL_MUNICIPALITIES || shelter.municipality === municipality

      return matchesQuery && matchesMunicipality
    })
  }, [municipality, query, shelters])

  const selectedShelter = useMemo(
    () => shelters.find((shelter) => shelter.id === selectedShelterId) ?? null,
    [selectedShelterId, shelters],
  )

  return {
    query,
    setQuery,
    municipality,
    setMunicipality,
    municipalities,
    filteredShelters,
    selectedShelter,
    selectedShelterId,
    setSelectedShelterId,
  }
}
