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

function gettemblores() {
    var today = new Date;
    var begin_date = "2019-12-21";
    var end_date = today.toISOString();
    var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=17.949&longitude=-66.851&maxradiuskm=50&starttime="+begin_date+"&endtime="+end_date;
    //console.log(url);

    d3.json(url).then(function(geojson) {
	      var magnitudes = getfield(geojson.features, "mag");
        var longitudes = getlon(geojson.features);
        var latitudes = getlat(geojson.features);
        var times = getfield(geojson.features, "time");
        var dates = times.map(function(d) {return new Date(d)});

        var intensity = {
            type: "scatter",
            mode: "markers",
            x: dates,
            y: magnitudes,
            marker: {
                size: magnitudes.map(function(x) {return x*2; })
            }
        };

        var layout = {
            title: "Magnitudes of recent earthquakes in southwest Puerto Rico<br><sub>n = " + magnitudes.length + "<br>" + begin_date + " - " + end_date + "</sub>" ,
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
                size: magnitudes.map(function(x) {return x*2; })
            }
        };

        var layout2 = {
            title: "Longitudes (east/west) of recent earthquakes in southwest Puerto Rico<br><sub>n = " + longitudes.length + "<br>" + begin_date + " - " + end_date + "</sub>" ,
            yaxis: {
                title: "Degrees longitude"
            }
        };

        Plotly.newPlot('Longitude', [location], layout2);

    })
}

