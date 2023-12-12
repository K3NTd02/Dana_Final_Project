///Extra Copy of js file



var map;
var enSource;
var countiesLayer;

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [45,-120],
        zoom: 6

    
    });
    
    //add OSM base tilelayer
    L.tileLayer('https://api.mapbox.com/styles/v1/k3nt-d/cloxh3eju009g01r63u685tpl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiazNudC1kIiwiYSI6ImNsb2l5cWcyazAwYXIycm1vY2R5MXNkZWwifQ.tO2BZUE-ZbahyZLzWq9gXg',
    {
        attribution: '&copy; <a href="https://api.mapbox.com/styles/v1/k3nt-d/cloxh3eju009g01r63u685tpl.html?title=view&access_token=pk.eyJ1IjoiazNudC1kIiwiYSI6ImNsb2l5cWcyazAwYXIycm1vY2R5MXNkZWwifQ.tO2BZUE-ZbahyZLzWq9gXg&zoomwheel=true&fresh=true#11.57/40.7771/-73.9697">Mapbox</a>', maxZoom: 17,
    }).addTo(map);

   countiesLayer = L.geoJson('/data/Counties_Line_6578384382787054859.geojson').addTo(map);
    //call getData function
    getData();
};

function color(data) {
    var allValues = [];
    for (var feature of data.features) {
      var type = feature.properties.PrimSource;
      allValues.push(type);
    }
  
    enSource = allValues; // Use all PrimSources for classification
  
    return enSource;
  }
  
  function classify(primSource) {
    var options;
  
    if (primSource == "solar") {
      options = {
        fillColor: "#ff7800",
      };
    } else if (primSource == "hydroelectric") {
      options = {
        fillColor: "#0504aa",
      };
    } else if (primSource == "biomass") {
      options = {
        fillColor: "7cfc00",
      };
    } else if (primSource == "wind") {
      options = {
        fillColor: "#04d9ff",
      };
    } else {
      options = {
        fillColor: "#0000ff",
      };
    }
  
    return options;
  }

  function pointToLayer(feature, latlng) {
    // create marker options
    var options = {
        radius: 8,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var primSource = feature.properties.PrimSource;
    options = classify(primSource);  // Assign the result directly to options

    // create circle marker or polygon layer based on geometry type
    var layer;
    if (feature.geometry.type === 'Point') {
        // For points, create a circle marker
        layer = L.circleMarker(latlng, options);
    } else if (feature.geometry.type === 'Polygon') {
        // For polygons, create a polygon layer
        layer = L.polygon(latlng, options);
    }

    // build popup content string
    var popupContent = "";
    popupContent += "<p><b>Plant Name:</b> " + feature.properties.Plant_Name + "</p>";
    popupContent += "<p><b>City:</b> " + feature.properties.City + "</p>";
    popupContent += "<p><b>Total Megawatts Produced:</b> " + feature.properties.Total_MW + " MW</p>";
    popupContent += "<p><b>Main Energy Source:</b> " + feature.properties.PrimSource + "</p>";

    layer.bindPopup(popupContent);

    // return the circle marker or polygon layer to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createSymbols(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(map);
};

//function to retrieve the data and place it on the map
function getData() {
    // load the data
    fetch("/data/Power_Plants.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log(json);  // Log the loaded GeoJSON data
            createSymbols(json);
        });

    fetch("/data/Counties_Polygon_-6180148356286324910.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log(json);  // Log the loaded GeoJSON data
            pointToLayer(json);
        });
}


document.addEventListener('DOMContentLoaded',createMap)

//codes from Chapter 4 Lesson 2 in Workbook with ChatGPT edits