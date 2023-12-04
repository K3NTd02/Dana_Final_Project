///Extra Copy of js file



var map;
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

    //call getData function
    getData();
};

function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    popupContent += "<p><b>Plant Name:</b> " + feature.properties.Plant_Name + "</p>";
    popupContent += "<p><b>City:</b> " + feature.properties.City + "</p>";
    popupContent += "<p><b>Total Megawatts Produced:</b> " + feature.properties.Total_MW + " MW</p>";
    popupContent += "<p><b>Main Energy Source:</b> " + feature.properties.PrimSource + "</p>";
    layer.bindPopup(popupContent);
};

//function to retrieve the data and place it on the map
function getData(){
    //load the data
    fetch("/Dana_Final_Project/data/Power_Plants.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                pointToLayer: function (feature, latlng){
                    var marker = L.circleMarker(latlng, geojsonMarkerOptions);
                    onEachFeature(feature, marker);
                    return marker;
                }
            }).addTo(map);          
            //create marker options
            
        });
};

document.addEventListener('DOMContentLoaded',createMap)

//codes from Chapter 4 Lesson 2 in Workbook with ChatGPT edits on last ".then" in getData() function