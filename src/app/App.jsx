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
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Refugio más cercano</p>
          {nearestShelter ? (
            <p className="font-display mt-1 line-clamp-2 text-sm font-bold text-slate-950">
              {nearestShelter.name}
            </p>
          ) : (
            <p className="mt-1 text-sm font-semibold text-slate-700">
              Activa tu ubicación para calcularlo.
            </p>
          )}
        </div>
        {nearestShelter ? (
          <span className="shrink-0 rounded-full bg-emergency-50 px-3 py-1 text-xs font-extrabold text-emergency-700">
            {nearestShelter.distanceLabel}
          </span>
        ) : null}
      </div>
      {userLocation?.accuracy ? (
        <p className="mt-2 text-xs text-slate-500">
          Precisión aproximada: {Math.round(userLocation.accuracy).toLocaleString('es-MX')} m.
        </p>
      ) : null}
      {nearestShelter ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            className="min-h-10 rounded-xl bg-white px-3 py-2 text-sm font-extrabold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-100"
            onClick={() => onSelectNearest(nearestShelter.id)}
            type="button"
          >
            Ver en mapa
          </button>
          <a
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-institutional-700 px-3 py-2 text-sm font-extrabold text-white transition hover:bg-institutional-900"
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

function Panel({ data, filters, locationTools, mobileExpanded, onToggleMobilePanel }) {
  const capacity = locationTools.visibleShelters.reduce((sum, shelter) => sum + (shelter.capacityPeople ?? 0), 0)
  const isFiltered = locationTools.visibleShelters.length !== data.shelters.length

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3 md:overflow-hidden">
      <div className="shrink-0">
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-slate-300 md:hidden" />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-institutional-700">
              Refugios activos 2026
            </p>
            <h2 className="font-display mt-0.5 truncate text-base font-bold text-slate-950 sm:text-lg">
              Encuentra el refugio más cercano
            </h2>
            <p className="mt-0.5 text-xs leading-4 text-slate-600 sm:leading-5">
              {formatNumber(locationTools.visibleShelters.length)} refugio{locationTools.visibleShelters.length !== 1 ? 's' : ''}
              {isFiltered ? ' filtrados' : ' activos'} · Capacidad{' '}
              {capacity ? formatNumber(capacity) : 'S/D'} personas
            </p>
          </div>
          <button
            className="shrink-0 rounded-xl bg-institutional-700 px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-institutional-900 md:hidden"
            onClick={onToggleMobilePanel}
            type="button"
          >
            {mobileExpanded ? 'Minimizar' : 'Ver lista'}
          </button>
        </div>
      </div>
      <div className={`${mobileExpanded ? 'flex' : 'hidden'} mobile-panel-scroll min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain md:flex md:overflow-hidden`}>
        <div className="space-y-2.5">
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
              className="min-h-11 rounded-xl bg-institutional-700 px-3 py-2 text-sm font-extrabold text-white transition hover:bg-institutional-900 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={locationTools.loading}
              onClick={locationTools.requestLocation}
              type="button"
            >
              {locationTools.loading ? 'Ubicando...' : 'Usar mi ubicación'}
            </button>
            <button
              className="min-h-11 rounded-xl bg-white px-3 py-2 text-sm font-extrabold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="font-bold text-slate-900">
              {locationTools.visibleShelters.length.toLocaleString('es-MX')} refugios visibles
            </p>
            <p className="text-slate-500">
              Total cargado: {data.diagnostics?.joinedShelters?.toLocaleString('es-MX') ?? data.shelters.length}
            </p>
          </div>
        </div>
        <div className="min-h-0 flex-none overflow-visible md:flex-1 md:overflow-y-auto md:pr-1 lg:pb-2">
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
            />
          }
          panel={
            <Panel
              data={data}
              filters={{ ...filters, setSelectedShelterId: selectShelter }}
              mobileExpanded={mobilePanelExpanded}
              onToggleMobilePanel={() => setMobilePanelExpanded((expanded) => !expanded)}
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
