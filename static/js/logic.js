var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});


// Create the map object with options. Add the title layers. 
var map = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 3,
  layers: [graymap, satellitemap, outdoors]
});

//Add graymap
graymap.addTo(map);

// Create the layers for the different sets of data, earthquakes and tectonicplates
var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

// Define the object that contains all of the different map choices
var basemaps = {
  Satellite: satellitemap,
  Grayscale: graymap,
  Outdoors: outdoors
};


// Define the object that contains all of the overlays. 
var overlays = {
  "Tectonic Plates": tectonicplates,
  Earthquakes: earthquakes
};

// Our AJAX call retrieves our earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (data) {

  //Function that returns sytle data for each earthquake on the map. 
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

  //Function that determines the color of the marker based on the magnitude of the earthquake.
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

  //Function that determines the radius of the earthquake merker based on magnitude.
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
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
    //Add the data to the earthquake layer
  }).addTo(earthquakes);

  //Add the earthquake layer to the map
  earthquakes.addTo(map);

  //Create a legend
  var legend = L.control({
    position: "bottomright"
  });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var colors = [
      "#ea2c2c",
      "#ea822c",
      "#ee9c00",
      "#eecc00",
      "#4dee00",
      "#98ee00"];
    var labels = [];

    var legendInfo = "<h1> Earthquake Intensity<h1>" +
      "<div class =\"labels\">" +
      "<div class=\"max\">5+</div>" +
      "<div class=\"fourth\">4-5</div>" +
      "<div class=\"third\">3-4</div>" +
      "<div class=\"second\">2-3</div>" +
      "<div class=\"first\">1-2</div>" +
      "<div class=\"min\">0-1</div>"
    "</div>";


  }









  // Here we make an AJAX call to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function (platedata) {
