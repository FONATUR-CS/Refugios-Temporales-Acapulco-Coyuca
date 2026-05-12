/**
 * Expone el objeto Leaflet como variable global (window.L).
 *
 * leaflet.markercluster es un módulo UMD que asume que `L` existe como global
 * en lugar de importarlo explícitamente. Vite/ESM no expone automáticamente
 * las importaciones de módulos como globales de window.
 *
 * Este archivo DEBE importarse como el PRIMER import en main.jsx para garantizar
 * que window.L quede definido antes de que leaflet.markercluster se evalúe.
 */
import L from 'leaflet'

if (typeof window !== 'undefined') {
  window.L = window.L || L
}
