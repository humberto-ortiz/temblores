// Pull earthquake data from USGS in GeoJSON format
// API documented here
// https://earthquake.usgs.gov/fdsnws/event/1/
// Sample query
// https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-12-21&endtime=2020-01-15&latitude=17.949&longitude=-66.851&maxradiuskm=50


function getfield(features, field) {
    return features.map(function(feature) {return feature.properties[field];});
}

function getlon(features) {
    return features.map(function(feature) {return feature.geometry.coordinates[0];});
}

function gettemblores() {
    var today = Date.now();
    var begin_date = "2019-12-21";
    var end_date = new Date(today + (1000 * 60 * 60 * 8));

    var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=17.949&longitude=-66.851&maxradiuskm=50&starttime="+begin_date+"&endtime="+end_date.toISOString();
    //console.log(url);

    d3.json(url).then(function(geojson) {
	      var magnitudes = getfield(geojson.features, "mag");
        var longitudes = getlon(geojson.features);
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
            title: "Magnitudes of " + magnitudes.length + " recent earthquakes in southwest Puerto Rico",
            yaxis: {
                title: 'Magnitude'
            }
        };

        Plotly.newPlot('Temblores', [intensity], layout);

        var location = {
            type: "scatter",
            mode: "markers",
            x: dates,
            y: longitudes,
            marker: {
                size: magnitudes.map(function(x) {return x*2; })
            }
        };

        var layout2 = {
            title: "Longitudes (east/west) of " + longitudes.length + " recent earthquakes in southwest Puerto Rico",
            yaxis: {
                title: "Degrees longitude"
            }
        };

        Plotly.newPlot('Longitude', [location], layout2);
    })
}

gettemblores();
