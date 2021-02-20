// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level for sf
// This gets inserted into the div with an id of 'map' in index.html
var myMap = L.map("map", {
  center: [38.9717, -95.2353],
  zoom: 4
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


// link to get the geojson data
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";

//  GET color radius call to the query URL
d3.json(URL, function (data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // set different color for depth
  function getColor(depth) {
    switch (true) {
      case depth > 90:
        return "#ea2c2c";
      case depth > 70:
        return "#ea822c";
      case depth > 50:
        return "#ee9c00";
      case depth > 30:
        return "#eecc00";
      case depth > 10:
        return "#4dee00";
      default:
        return "#98ee00";
    }
  }
  // set radius from magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }
  //Add GeoJSON layer
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Location: "
        + feature.properties.place
        + "<br>Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
      );
    }
    //Add the data to the earthquake layer
  }).addTo(myMap);

  // an object legend
  var legend = L.control({
    position: "bottomright"
  });

  // details for the legend
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [-10, 10, 30, 50, 70, 90]

    // Looping through
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + getColor[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : '+');
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(myMap);
});

