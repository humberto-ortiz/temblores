// Pull earthquake data from USGS in GeoJSON format
// API documented here
// https://earthquake.usgs.gov/fdsnws/event/1/
// Sample query
// https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-12-21&endtime=2020-01-15&latitude=17.949&longitude=-66.851&maxradiuskm=50


function getfield(features, field) {
    return features.map(function(feature) {return feature.properties[field];});
}

function getlat(features) {
    return features.map(function(feature) {return feature.geometry.coordinates[1];});
}

function getlon(features) {
    return features.map(function(feature) {return feature.geometry.coordinates[0];});
}

function getdepth(features) {
    return features.map(function(feature) {return feature.geometry.coordinates[2];});
}

function onisland(feature) {
    return feature.properties.place.includes("Puerto Rico");
}

// borrowed code from stack overflow for computing distance
// see https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function porguanica(feature) {
    var lat = feature.geometry.coordinates[1];
    var lon = feature.geometry.coordinates[0];
    var guanica = {
        lat:  17.949,
        lon: -66.851
    };
    var radius = 50 ; // kilometers
    return radius > getDistanceFromLatLonInKm(lat,lon,guanica.lat,guanica.lon);
}

function gettemblores() {
    var today = new Date;
    var begin_date = "2019-12-21";
    var end_date = today.toISOString();
    var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=17.949&longitude=-66.851&maxradiuskm=50&starttime="+begin_date+"&endtime="+end_date;

    //console.log(url);

    d3.json(url).then(function(geojson) {
        var here = geojson.features;
	      var magnitudes = getfield(here, "mag");
        var longitudes = getlon(here);
        var latitudes = getlat(here);
        var times = getfield(here, "time");
        var dates = times.map(function(d) {return new Date(d)});

        var intensity = {
            type: "scatter",
            mode: "markers",
            x: dates,
            y: magnitudes,
            marker: {
                size: magnitudes //.map(function(x) {return x*2; })
            }
        };

        var layout = {
            title: "Magnitudes of recent earthquakes in Puerto Rico<br><sub>n = " + magnitudes.length + "<br>Updated: " + end_date + "</sub>" ,
            yaxis: {
                title: 'Magnitude'
            }
        };

        Plotly.newPlot('Temblores', [intensity], layout);

        var location = {
            type: "scatter",
            mode: "markers",
            x: dates,
            hovertext: magnitudes.map(function(mag) {return "Mag: " + mag}),
            y: longitudes,
            marker: {
                size: magnitudes //.map(function(x) {return x*2; })
            }
        };

        var layout2 = {
            title: "Longitudes (east/west) of recent earthquakes in Puerto Rico<br><sub>n = " + longitudes.length + "<br>Uppdated: " + end_date + "</sub>" ,
            yaxis: {
                title: "Degrees longitude"
            }
        };

        Plotly.newPlot('Longitude', [location], layout2);

    })
}

