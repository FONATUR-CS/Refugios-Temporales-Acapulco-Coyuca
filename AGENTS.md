# AGENTS.md

## Proyecto

Geoportal de refugios temporales Acapulco y Coyuca de Benítez 2026.

## Stack obligatorio

- React
- Vite
- Tailwind CSS
- Leaflet / React-Leaflet
- JavaScript moderno

## Reglas del proyecto

- No inventar datos.
- No modificar los archivos originales `refugios2026.csv` y `refugios.geojson` salvo instrucción explícita.
- El join de datos debe hacerse con `CLV` del CSV y `CLAVE` del GeoJSON.
- Toda clave debe normalizarse como string con trim.
- Toda lógica de transformación debe estar separada de los componentes visuales.
- El proyecto debe compilar con `npm run build`.
- El diseño debe ser mobile-first, claro, profesional e institucional.
- Evitar dependencias innecesarias.
- Mantener separación entre componentes de mapa, UI, filtros, datos y utilidades.
- Antes de cerrar una tarea, verificar mapa, filtros, cards, responsive y build.

## Estado del proyecto (actualizado)

### Completado

- Proyecto Vite 8 + React 18 + Tailwind 3 + React-Leaflet 4 creado y compilando.
- Datos copiados a `public/data/`; `.gitignore` creado.
- Utilidades puras: `normalize.js`, `mapUtils.js`, `joinShelters.js`.
- Hooks: `useSheltersData`, `useShelterFilters` (con `clearFilters()`), `useUserLocation`.
- Componentes UI: `Button`, `Badge`, `StatCard`, `EmptyState`, `LoadingState`, `ErrorState`.
- Layout: `Header`, `Shell`, `Footer`.
- Mapa: `ShelterMap` con `LayersControl`, `ShelterMarker`, `ShelterPopup`, `FitShelterBounds`, `FlyToSelectedShelter`, `ResetViewControl`, `UserLocationControl`.
- `ClusterGroup.jsx`: wrapper ESM-safe de `leaflet.markercluster` usando `@react-leaflet/core`.
- `leaflet.markercluster@1.5.3` instalado como dependencia directa.
- Fuentes Geomanist OTF self-hosted (10 archivos, pesos 300–900).
- **Bug crítico resuelto — pantalla en blanco**: `src/lib/leaflet-global.js` creado; expone `window.L = L` antes de que `leaflet.markercluster` (UMD) evalúe su factory. Importado como primer import en `main.jsx`. `vite.config.js` actualizado con `optimizeDeps.include` para ambos módulos.
- **ErrorBoundary**: `src/components/ErrorBoundary.jsx` creado (clase React). Envuelve `<Shell>` en `App.jsx`. Muestra mensaje institucional + botón "Recargar" ante cualquier error de render.
- **Icono de mapa (Pin)**: Rediseñado usando un contenedor interno para evitar conflictos de rotación con Leaflet. Forma de gota perfecta (`50% 50% 50% 0`) con imagen centrada y derecha (contra-rotada 45°).
- **Tipografía**: Cambiada a Inter/Geomanist con peso `font-bold` y sin tracking negativo para mejorar legibilidad y reducir la sensación de "apretado".
- **Ortografía**: Corregido "más" y "Cómo" en la interfaz.
- Build validado: 379 kB JS, 37.2 kB CSS, 873 ms, 0 errores.

### Pendiente / Próximos pasos

- Verificar visualmente en dispositivo real (móvil y desktop).
- Considerar despliegue en Vercel para pruebas en HTTPS con geolocalización real.

## Arquitectura de módulos clave

| Archivo | Rol |
|---|---|
| `src/main.jsx` | Entry point; `leaflet-global` va primero |
| `src/lib/leaflet-global.js` | Side-effect: expone `window.L` para UMD de markercluster |
| `src/components/ErrorBoundary.jsx` | Captura errores de render; evita pantalla en blanco silenciosa |
| `src/components/map/ClusterGroup.jsx` | Wrapper ESM-safe de `L.MarkerClusterGroup` |
| `src/components/map/ShelterMap.jsx` | Mapa principal con capas, controles y clusters |
| `src/app/App.jsx` | Orquesta hooks, panel, mapa y footer |
| `vite.config.js` | `optimizeDeps.include` para leaflet + markercluster |

## Decisiones técnicas clave

- `h-dvh` en lugar de `min-h-screen` para evitar scroll de página en iPhone Safari.
- `autoPan={false}` en `<Popup>` — `FlyToSelectedShelter` es el único responsable de mover el mapa.
- `FitShelterBounds` solo ejecuta una vez (`fittedOnceRef`) para no mover el mapa al filtrar.
- `react-leaflet-cluster` descartado (CJS + dos instancias de L). `ClusterGroup.jsx` custom con `@react-leaflet/core` directo.
- `leaflet.markercluster` es UMD que accede a `L` como global. Vite/ESM no expone `window.L` automáticamente → necesita `src/lib/leaflet-global.js` como primer import en `main.jsx`.
- `ErrorBoundary` es clase React (no hook) porque React aún no soporta error boundaries funcionales.
- `institutional-700: #0f5e55` (teal institucional); `emergency-600: #2563eb` (azul emergencia).
- Geomanist self-hosted con OTF; Inter como fallback web.
