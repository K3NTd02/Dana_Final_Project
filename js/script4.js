//declare map var in global scope
var map;
var map2;

//function to instantiate the Leaflet map
function createMap() {
    //create the map
    map = L.map('map', {
        center: [45, -120],
        zoom: 6
    });

    //add OSM base tilelayer
    L.tileLayer('https://api.mapbox.com/styles/v1/k3nt-d/cloxh3eju009g01r63u685tpl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiazNudC1kIiwiYSI6ImNsb2l5cWcyazAwYXIycm1vY2R5MXNkZWwifQ.tO2BZUE-ZbahyZLzWq9gXg', {
        attribution: '&copy; <a href="https://api.mapbox.com/styles/v1/k3nt-d/cloxh3eju009g01r63u685tpl.html?title=view&access_token=pk.eyJ1IjoiazNudC1kIiwiYSI6ImNsb2l5cWcyazAwYXIycm1vY2R5MXNkZWwifQ.tO2BZUE-ZbahyZLzWq9gXg&zoomwheel=true&fresh=true#11.57/40.7771/-73.9697">Mapbox</a>', maxZoom: 17,
    }).addTo(map);

    //call getData function
    getData();

    // Invalidate map size to ensure proper rendering
    map.invalidateSize();

    console.log("Map created!");
};

function createMap2() {
    //create the map
    map2 = L.map('map2', {
        center: [45, -120],
        zoom: 6
    });

    //add OSM base tilelayer
    L.tileLayer('https://api.mapbox.com/styles/v1/k3nt-d/cloxh3eju009g01r63u685tpl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiazNudC1kIiwiYSI6ImNsb2l5cWcyazAwYXIycm1vY2R5MXNkZWwifQ.tO2BZUE-ZbahyZLzWq9gXg', {
        attribution: '&copy; <a href="https://api.mapbox.com/styles/v1/k3nt-d/cloxh3eju009g01r63u685tpl.html?title=view&access_token=pk.eyJ1IjoiazNudC1kIiwiYSI6ImNsb2l5cWcyazAwYXIycm1vY2R5MXNkZWwifQ.tO2BZUE-ZbahyZLzWq9gXg&zoomwheel=true&fresh=true#11.57/40.7771/-73.9697">Mapbox</a>', maxZoom: 17,
    }).addTo(map2);

    //call getData function
    getData();

    map2.invalidateSize();

    console.log("Map2 created!");
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
            fillColor: "#00ffff",
        };
    } else if (primSource == "biomass") {
        options = {
            fillColor: "#ffff00",
        };
    } else if (primSource == "wind") {
        options = {
            fillColor: "#6cbb3c",
        };
    } else if (primSource == "natural gas") {
        options = {
          fillColor: "#ffc0cb",
        };
    } else {
        options = {
            fillColor: "#ff0000",
        };
    }

    return options;
}

function pointToLayer(feature, latlng) {
    //create marker options
    var options = {
        radius: 8,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    };

    var primSource = feature.properties.PrimSource;
    options = classify(primSource);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "";
    popupContent += "<p><b>Plant Name:</b> " + feature.properties.Plant_Name + "</p>";
    popupContent += "<p><b>City:</b> " + feature.properties.City + "</p>";
    popupContent += "<p><b>Total Megawatts Produced:</b> " + feature.properties.Total_MW + " MW</p>";
    popupContent += "<p><b>Main Energy Source:</b> " + feature.properties.PrimSource + "</p>";

    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createSymbols(data) {
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            // Pass minValue to pointToLayer function
            return pointToLayer(feature, latlng);
        }
    }).addTo(map);
};

function createSymbols2(data) {
    // Filter features with Total_MW values over 10
    var filteredData = data.features.filter(function (feature) {
        return feature.properties.Total_MW > 50;
    });

    // Create a Leaflet GeoJSON layer with filtered data
    var geoJsonLayer = L.geoJson({
        type: "FeatureCollection",
        features: filteredData
    }, {
        pointToLayer: function (feature, latlng) {
            return pointToLayer(feature, latlng);
        }
    });

    // Add the GeoJSON layer to map2
    geoJsonLayer.addTo(map2);
}

function getData() {
    //load the data
    fetch("/Dana_Final_Project/data/Power_Plants.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log(json);
            createSymbols(json);
            createSymbols2(json);
        });
};

document.addEventListener('DOMContentLoaded', function () {
    createMap(); // Initialize the first map
    createMap2(); // Initialize the second map
});

