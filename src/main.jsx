// IMPORTANT: must be the very first import so window.L is set before
// leaflet.markercluster (UMD) evaluates its factory function.
import './lib/leaflet-global'

import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/lato/300.css'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import '@fontsource/lato/900.css'
import App from './app/App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
