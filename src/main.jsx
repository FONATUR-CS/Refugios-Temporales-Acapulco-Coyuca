// IMPORTANT: must be the very first import so window.L is set before
// leaflet.markercluster (UMD) evaluates its factory function.
import './lib/leaflet-global'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
