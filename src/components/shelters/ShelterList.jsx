import { EmptyState } from '../ui/EmptyState'
import { ShelterCard } from './ShelterCard'

export function ShelterList({ shelters, selectedShelterId, onSelect }) {
  if (!shelters.length) return <EmptyState />

  return (
    <div className="space-y-3 pb-4">
      {shelters.map((shelter) => (
        <ShelterCard
          key={shelter.id}
          onSelect={onSelect}
          selected={shelter.id === selectedShelterId}
          shelter={shelter}
        />
      ))}
    </div>
  )
}
