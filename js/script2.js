///Extra Copy of js file



var map;
var border;
var enSource

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

    border = L.border('/data/Counties_Line_6578384382787054859.geojson').addTo(map);
    //call getData function
    getData();
};

function color(data){
    var allValues = [];
    for (var feature of data.features) {
        var type = feature.properties.PrimSource;
        allValues.push(type);
      }
    //get population for current year
    //data.features.forEach((_feature) => {});
              //add value to array
    //allValues.push(allValues);
    
    //get minimum value of our array
    enSource = Math.min(...allValues)

    return enSource;
}

function classify(primSource, enSource){
    if (enSource == "solar") {
        options = {
            fillColor: "#ff7800",
        };
    } else if (enSource == "hydroelectric") {
        options = {
            fillColor: "#0504aa",
        };
    } else if (enSource == "biomass") {
        options = {
            fillColor: "7cfc00",
        };
    } else if (enSource == "wind") {
        options = {
            fillColor: "#04d9ff",
        };
    } else {
        options = {
            fillColor: "#0000ff",
        };
    }

}

function pointToLayer(feature, latlng, enSource){
    //create marker options
    
    var options = {
        radius: 8,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var primSource = Number(feature.properties.PrimSource);
    options.fillColor = classify(enSource);
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
function createSymbols(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(map);
};

//function to retrieve the data and place it on the map
function getData(){
    //load the data
    fetch("/data/Power_Plants.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            createSymbols(json);         
            //create marker options
            
        });
};

document.addEventListener('DOMContentLoaded',createMap)

//codes from Chapter 4 Lesson 2 in Workbook with ChatGPT edits on last ".then" in getData() function