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