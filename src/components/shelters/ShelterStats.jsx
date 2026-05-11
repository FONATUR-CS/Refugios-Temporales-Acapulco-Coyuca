import { StatCard } from '../ui/StatCard'

function formatNumber(value) {
  return new Intl.NumberFormat('es-MX').format(value)
}

export function ShelterStats({ shelters }) {
  const totalCapacity = shelters.reduce((sum, shelter) => sum + (shelter.capacityPeople ?? 0), 0)
  const incomplete = shelters.filter((shelter) => shelter.isIncomplete).length
  const byMunicipality = shelters.reduce((acc, shelter) => {
    const key = shelter.municipality || 'Sin municipio'
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})

  return (
    <section className="grid grid-cols-2 gap-3">
      <StatCard label="Refugios" value={formatNumber(shelters.length)} helper="Registros unidos" />
      <StatCard
        label="Capacidad"
        value={totalCapacity ? formatNumber(totalCapacity) : 'S/D'}
        helper="Personas"
      />
      {Object.entries(byMunicipality).map(([municipality, count]) => (
        <StatCard key={municipality} label={municipality} value={formatNumber(count)} helper="Refugios" />
      ))}
      <StatCard label="Incompletos" value={formatNumber(incomplete)} helper="Campos obligatorios" />
    </section>
  )
}
