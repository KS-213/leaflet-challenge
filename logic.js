var mymap = L.map('mapid').setView([37, -100], 4);

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap); 


var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json(url, function(data) {
    createFeatures(data.features);
});


function createFeatures(data) {

    
    data.forEach(feature => {

        
        var depth = feature.geometry.coordinates[2];

        //Color container
        var color = "";

        switch (true) {
            case (depth <= 10):
                color = '#a3f600';
                break;
            case (depth <= 30):
                color = '#dcf400';
                break;
            case (depth <= 50):
                color = '#f7db11';
                break;
            case (depth <= 70):
                color = '#fdb72a';
                break;
            case (depth <= 90):
                color = '#fca35d';
                break;
            default:
                color = '#ff5f65';
                break;
        }

        
        L.circle([feature.geometry.coordinates[1], 
            feature.geometry.coordinates[0] 
        ], {
            
            fillColor: color,
            fillOpacity: .4,
            color: color,
            radius: feature.properties.mag * 15000
        }).bindPopup("<h3> Location: " +
            feature.properties.place +
            "<hr>Lat/Lon: " +
            feature.geometry.coordinates[1] +
            " / " +
            feature.geometry.coordinates[0] +
            "<hr>Magnitude: " +
            feature.properties.mag +
            "</h3>").addTo(mymap); //popup message
    });

    //Setup legend
    var legend = L.control({
        position: 'bottomright'
    });

    //More legend stuff
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var ranges = [' <= 10', '10 - 30', '30 - 50', '50 - 70', '70 - 90', ' > 90'];
        var colors = ['#a3f600', '#dcf400', '#f7db11', '#fdb72a', '#fca35d', '#ff5f65'];

        div.innerHTML += "<h1>Depth</h1>";
        for (var i = 0; i < colors.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + colors[i] + '"></i><span>' + ranges[i] + '</span><br>';
        }
        return div;
    }
    //legend map grid
    legend.addTo(mymap);
}
