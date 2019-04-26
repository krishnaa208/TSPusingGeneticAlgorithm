function loadMap(clon, clat, zoom, ww, hh) {

    return loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
        clon + ',' + clat + ',' + zoom + '/' +
        ww + 'x' + hh +
        '?access_token=pk.eyJ1IjoiY29kaW5ndHJhaW4iLCJhIjoiY2l6MGl4bXhsMDRpNzJxcDh0a2NhNDExbCJ9.awIfnl6ngyHoB3Xztkzarw');

}


function mercX(lon, type = 'd') {
    lon = radians(lon);
    //lon = radians(lon);
    var a = (256 / PI) * pow(2, zoom);
    var b = lon + PI;
    return a * b;
}

function mercY(lat, type = 'd') {

    lat = radians(lat);
    var a = (256 / PI) * pow(2, zoom);
    var b = tan(PI / 4 + lat / 2);
    var c = PI - log(b);
    return a * c;
}
// function mercX(lon,type='d') {
//     return ((lon+180)*(ww/360));
// }
// function mercY(lat,type='d') {
//     lat = radians(lat)
//     mercN = log(tan((PI/4)+(lat/2)));
//     y  = (hh/2)-(ww*mercN/(2*PI));
//     return y;
// }

function swap(a, i, j) {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}

function loadCsv() {
    return loadStrings('./project.csv');
}

function loadCities(csvData, numberOfCities, cx, cy) {
    cities = [];
    for (var i = 1; i < csvData.length; i++) {

        var data = csvData[i].split(/,/);
        //console.log(data);
        var name = data[0];
        var lat = data[1];
        var lon = data[2];

        var x = mercX(lon) - cx;
        var y = mercY(lat) - cy;

        if (x < -width / 2) {
            x += width;
        } else if (x > width / 2) {
            x -= width;
        }
        cities.push(new City(name, x, y, lon, lat))
    }

    return shuffle(cities).slice(0, numberOfCities);
}

function calculateDistance(cityA, cityB) {
    var R = 6371; // Radius of the earth in km
    var dLat = radians(cityB.lat - cityA.lat); // deg2rad below
    var dLon = radians(cityB.lon - cityA.lon);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(radians(cityA.lat)) * Math.cos(radians(cityB.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}