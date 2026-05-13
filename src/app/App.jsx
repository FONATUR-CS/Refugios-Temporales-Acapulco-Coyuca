import { ErrorBoundary } from '../components/ErrorBoundary'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { Shell } from '../components/layout/Shell'
import { ShelterMap } from '../components/map/ShelterMap'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { ShelterFilters } from '../components/shelters/ShelterFilters'
import { ShelterList } from '../components/shelters/ShelterList'
import { useShelterFilters } from '../hooks/useShelterFilters'
import { useSheltersData } from '../hooks/useSheltersData'
import { useUserLocation } from '../hooks/useUserLocation'
import { buildGoogleMapsDirectionsUrl, calculateDistanceKm, formatDistanceKm } from '../lib/mapUtils'
import { useState } from 'react'

function formatNumber(value) {
  return new Intl.NumberFormat('es-MX').format(value)
}

function DataWarnings({ warnings }) {
  if (!warnings.length) return null

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
      <p className="font-extrabold">Advertencias de datos detectadas</p>
      <p className="mt-1">
        Se reportaron {warnings.length} advertencias en consola para revisión técnica. La aplicación
        continúa operando con los registros válidos.
      </p>
    </div>
  )
}

function LocationTools({ nearestShelter, onSelectNearest, userLocation }) {
  const directionsUrl = nearestShelter
    ? buildGoogleMapsDirectionsUrl(nearestShelter.coordinates.lat, nearestShelter.coordinates.lng)
    : null

  return (
    <div className="rounded-xl border border-gold-100 bg-gradient-to-br from-gold-50 to-white p-2.5 shadow-sm">
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gold-700">Refugio más cercano</p>
        {nearestShelter ? (
          <div className="mt-1 flex items-center justify-center gap-2">
            <p className="font-display line-clamp-1 text-xs font-bold text-slate-950">
              {nearestShelter.name}
            </p>
            <span className="shrink-0 rounded-full bg-institutional-700 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {nearestShelter.distanceLabel}
            </span>
          </div>
        ) : (
          <p className="mt-0.5 text-xs font-semibold text-slate-700">
            Activa tu ubicación
          </p>
        )}
      </div>
      {userLocation?.accuracy ? (
        <p className="mt-2 text-xs text-slate-500">
          Precisión aproximada: {Math.round(userLocation.accuracy).toLocaleString('es-MX')} m.
        </p>
      ) : null}
      {nearestShelter ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            className="min-h-9 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-800 ring-1 ring-gold-100 transition hover:bg-gold-50"
            onClick={() => onSelectNearest(nearestShelter.id)}
            type="button"
          >
            Ver en mapa
          </button>
          <a
            className="inline-flex min-h-9 items-center justify-center rounded-lg bg-institutional-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-institutional-600"
            href={directionsUrl}
            rel="noreferrer"
            target="_blank"
          >
            Cómo llegar
          </a>
        </div>
      ) : null}
    </div>
  )
}

function Panel({ data, filters, locationTools, onToggleMobilePanel }) {
  const capacity = locationTools.visibleShelters.reduce((sum, shelter) => sum + (shelter.capacityPeople ?? 0), 0)
  const isFiltered = locationTools.visibleShelters.length !== data.shelters.length

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 p-2">
      <div className="shrink-0">
        <div className="flex items-center justify-between gap-2 md:hidden">
          <p className="text-[10px] font-bold uppercase tracking-wider text-institutional-700">Menú de Refugios</p>
          <button 
            onClick={onToggleMobilePanel}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-institutional-700 via-institutional-700 to-institutional-600 p-1.5 text-white shadow-sm ring-1 ring-white/20">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wider text-sand-100">
              Temporada de Ciclones 2026
            </p>
            <h2 className="font-display mt-0.5 truncate text-xs font-bold text-white sm:text-sm">
              Estadísticas actuales
            </h2>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5 text-[9px]">
            <div className="rounded-md bg-white/10 px-1.5 py-1 ring-1 ring-white/10">
              <p className="font-bold text-sand-100 leading-tight">Visibles</p>
              <p className="text-sm font-bold leading-none text-white">
                {formatNumber(locationTools.visibleShelters.length)}
              </p>
            </div>
            <div className="rounded-md bg-white/10 px-1.5 py-1 ring-1 ring-white/10">
              <p className="font-bold text-sand-100 leading-tight">Capacidad</p>
              <p className="text-sm font-bold leading-none text-white">
                {capacity ? formatNumber(capacity) : 'S/D'}
              </p>
            </div>
          </div>
          {isFiltered ? (
            <p className="mt-1.5 inline-flex rounded-full bg-gold-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
              Filtro: {filters.municipality}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mobile-panel-scroll flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain">
        <div className="space-y-2">
          <DataWarnings warnings={data.warnings} />
          <ShelterFilters
            municipalities={filters.municipalities}
            municipality={filters.municipality}
            onClear={filters.clearFilters}
            onMunicipalityChange={filters.setMunicipality}
            onQueryChange={filters.setQuery}
            query={filters.query}
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              className="min-h-9 rounded-lg bg-gold-500 px-3 py-1.5 text-xs font-bold text-black shadow-sm transition hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={locationTools.loading}
              onClick={locationTools.requestLocation}
              type="button"
            >
              {locationTools.loading ? 'Ubicando...' : 'Usar mi ubicación'}
            </button>
            <button
              className="min-h-9 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!locationTools.userLocation}
              onClick={locationTools.clearLocation}
              type="button"
            >
              Quitar ubicación
            </button>
          </div>
          {locationTools.error ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
              {locationTools.error}
            </p>
          ) : null}
          <LocationTools
            nearestShelter={locationTools.nearestShelter}
            onSelectNearest={filters.setSelectedShelterId}
            userLocation={locationTools.userLocation}
          />
          <div className="flex items-center justify-between gap-3 text-xs">
            <p className="font-bold text-slate-900">
              {locationTools.visibleShelters.length.toLocaleString('es-MX')} refugios
            </p>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1 pb-2">
          <ShelterList
            onSelect={filters.setSelectedShelterId}
            selectedShelterId={filters.selectedShelterId}
            shelters={locationTools.visibleShelters}
          />
        </div>
      </div>
    </div>
  )
}


export default function App() {
  const data = useSheltersData()
  const filters = useShelterFilters(data.shelters)
  const userLocation = useUserLocation()
  const [mobilePanelExpanded, setMobilePanelExpanded] = useState(false)

  const visibleShelters = userLocation.location
    ? filters.filteredShelters
        .map((shelter) => {
          const distanceKm = calculateDistanceKm(userLocation.location, shelter.coordinates)
          return {
            ...shelter,
            distanceKm,
            distanceLabel: formatDistanceKm(distanceKm),
          }
        })
        .sort((a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY))
    : filters.filteredShelters

  const nearestShelter = userLocation.location ? visibleShelters[0] ?? null : null
  const selectShelter = (shelterId) => {
    filters.setSelectedShelterId(shelterId)

    if (window.matchMedia('(max-width: 767px)').matches) {
      setMobilePanelExpanded(false)
    }
  }

  if (data.error) {
    return (
      <div className="flex h-dvh flex-col overflow-hidden bg-slate-100">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 overflow-auto px-4 py-8">
          <ErrorState error={data.error} />
        </main>
        <Footer />
      </div>
    )
  }

  if (data.loading) {
    return (
      <div className="flex h-dvh flex-col overflow-hidden bg-slate-100">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 overflow-auto px-4 py-8">
          <LoadingState />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-slate-100 text-slate-950">
      <Header />
      <ErrorBoundary>
        <Shell
          onClosePanel={() => setMobilePanelExpanded(false)}
          panelExpanded={mobilePanelExpanded}
          map={
            <ShelterMap
              onSelect={selectShelter}
              onClearUserLocation={userLocation.clearLocation}
              onRequestUserLocation={userLocation.requestLocation}
              selectedShelter={filters.selectedShelter}
              selectedShelterId={filters.selectedShelterId}
              shelters={visibleShelters}
              userLocation={userLocation.location}
              userLocationLoading={userLocation.loading}
              currentMunicipality={filters.municipality}
              onToggleMobilePanel={() => setMobilePanelExpanded((expanded) => !expanded)}
            />
          }
          panel={
            <Panel
              data={data}
              filters={{ ...filters, setSelectedShelterId: selectShelter }}
              onToggleMobilePanel={() => setMobilePanelExpanded(false)}
              locationTools={{
                clearLocation: userLocation.clearLocation,
                error: userLocation.error,
                loading: userLocation.loading,
                nearestShelter,
                requestLocation: userLocation.requestLocation,
                userLocation: userLocation.location,
                visibleShelters,
              }}
            />
          }
        />
      </ErrorBoundary>
      <Footer />
    </div>
  )
}
