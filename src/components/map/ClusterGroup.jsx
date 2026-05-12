import L from 'leaflet'
import 'leaflet.markercluster'
import { createElementObject, createLayerComponent, extendContext } from '@react-leaflet/core'

/**
 * Wrapper ESM-safe de leaflet.markercluster para React-Leaflet v4.
 * Evita los problemas de interop CJS de react-leaflet-cluster con Vite.
 */
function createClusterGroup({ children: _children, ...options }, context) {
  const clusterGroup = new L.MarkerClusterGroup(options)
  return createElementObject(
    clusterGroup,
    extendContext(context, { layerContainer: clusterGroup }),
  )
}

export const ClusterGroup = createLayerComponent(createClusterGroup, () => {})
