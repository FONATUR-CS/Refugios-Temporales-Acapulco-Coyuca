const refugiosLayer = L.layerGroup();

const satelliteWithLabels = L.layerGroup([
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
  })
]);

const map = L.map('map', {
  layers: [satelliteWithLabels, refugiosLayer]
});

let refugiosData = {};
Papa.parse("refugios.csv", {
  download: true,
  header: true,
  complete: function(results) {
    results.data.forEach(row => {
      refugiosData[row.CLV] = row;
    });
    cargarGeojsonRefugios();
  }
});

function cargarGeojsonRefugios() {
  fetch("refugios.geojson")
    .then(res => res.json())
    .then(geojson => {
      const capaRefugios = L.geoJSON(geojson, {
        pointToLayer: function(feature, latlng) {
          const clave = feature.properties.CLAVE;
          const props = refugiosData[clave];

          if (!props) {
            return null;
          }

          const customIcon = L.icon({
            iconUrl: 'refugio.svg',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
          });

          const marker = L.marker(latlng, { icon: customIcon });

          const popup = "<strong>" + props.Nombre + "</strong><br>" +
                        "<b>Dirección:</b> " + props["Dirección"] + "<br>" +
                        "<b>Capacidad personas:</b> " + props["Capacidad de personas"] + "<br>" +
                        "<b>Capacidad familias:</b> " + props["Capacidad de familias"] + "<br>" +
                        "<b>Municipio:</b> " + props["Municipio"] + "<br>" +
                        "<b>Responsable del H. Ayuntamiento:</b> " + props["Responsable del H. Ayuntamiento"] + "<br>" +
                        '<b>Ubicación:</b> <a href="' + props["Ubicación"] + '" target="_blank">Ver ubicación</a>';

          marker.bindPopup(popup);
          return marker;
        }
      }).addTo(refugiosLayer);

      map.fitBounds(capaRefugios.getBounds());
    });
}
