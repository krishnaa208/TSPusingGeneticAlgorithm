var mapimg;
var clat = 0;
var clon = 0;
var ww = 1024;
var hh = 512;
var zoom = 1;
var cx
var cy;

var cities = [];
var totalCities = 15;
var popSize = 200;
var population = [];
var fitness = [];
var totalGeneration = 1000;
var mutationRate = 0.01;

var recordDistance = Infinity;
var bestEver;
var currentBest;
var currentGeneration = 0;

var iGeneration;
var iMutation;
var iCities;
var iPopulation;

var vGeneration = 0;
var vOptimizedDistance = 0;
var vCurrentDistance = 0;


function preload() {
  cx = mercX(clon);
  cy = mercY(clat);
  mapimg = loadMap(clon, clat, zoom, ww, hh)
  csv = loadCsv()
}



function setup() {

  var can = createCanvas(ww, hh);
  can.parent("canvas");
  translate(width / 2, height / 2);
  imageMode(CENTER);
  image(mapimg, 0, 0);
  cities = loadCities(csv, totalCities, cx, cy);
  var order = [];

  for (var i = 0; i < cities.length; i++) {
    order[i] = i;
  }
  for (var i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
  }

  iGeneration = select('#noOfGeneration');
  iMutation = select('#mutationRate');
  iCities = select('#noOfCities');
  iPopulation = select('#populationSize');

  iGeneration.value(totalGeneration);
  iMutation.value(mutationRate);
  iCities.value(totalCities);
  iPopulation.value(popSize);

  vGeneration = select('#generationNo');
  vOptimizedDistance = select('#optimizedDistance');
  vCurrentDistance = select('#currentGeneration');

  select("#startbtn").mousePressed(start);
  noLoop();
}

function start() {
  totalGeneration = iGeneration.value();
  mutationRate = iMutation.value();
  totalCities = iCities.value();
  popSize = iPopulation.value();
  select('#mutationRateShow').html(mutationRate);
  cities = loadCities(csv, totalCities, cx, cy);
  var order = [];

  for (var i = 0; i < cities.length; i++) {
    order[i] = i;
  }
  for (var i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
  }
  recordDistance = Infinity
  loop();
}


function showRoute() {

  route = []
  for (var i = 0; i < bestEver.length; i++) {
    var n = bestEver[i]
    route.push(cities[n])
  }

  groups = 6
  len = Math.ceil(route.length / groups);
  htmlStr = ""
  for (var i = 0; i < len; i++) {
    htmlStr += "<tr>";
    for (var j = 0; j < groups; j++) {
      var n = groups * i + j;
      if (route.length <= n) {
        break;
      }
      htmlStr += "<td>";
      htmlStr += route[n].name;
      htmlStr += "</td>";
    }
    htmlStr += "</tr>";

  }
  select('#finalRoute').html(htmlStr);

}

function draw() {

  if (totalGeneration < currentGeneration + 2) {
    noLoop();
    //console.log(bestEver);
    bestEver.forEach(i => {
      console.log(cities[i])
    });
    drawPath(bestEver);
    showRoute(bestEver);
  }

  translate(width / 2, height / 2);
  imageMode(CENTER);
  image(mapimg, 0, 0);

  calculateFitness();
  normalizeFitness();
  nextGeneration();
  currentGeneration += 1;
  drawPath(currentBest);
  showRoute(currentBest)


  mutationRate = iMutation.value();
  select('#mutationRateShow').html(mutationRate);

  vGeneration.html(currentGeneration);
  vOptimizedDistance.html(parseInt(calcDistance(cities, bestEver)) + ' km');
  vCurrentDistance.html(parseInt(calcDistance(cities, currentBest)) + ' km');


}

function drawPath(route) {
  stroke('rgb(163, 206, 170)');
  strokeWeight(1);
  noFill();
  beginShape();

  for (var i = 0; i < route.length - 1; i++) {
    var n = route[i];



    strokeWeight(1);
    //vertex(cities[n].x, cities[n].y);

    line(cities[n].x, cities[n].y, cities[route[i + 1]].x, cities[route[i + 1]].y);

    strokeWeight(2);
    ellipse(cities[n].x, cities[n].y, 6, 6);

  }
  line(cities[route[0]].x, cities[route[0]].y, cities[route[route.length - 1]].x, cities[route[route.length - 1]].y);
  endShape();

  stroke('rgb(206, 219, 239)');
  strokeWeight(1);
  noFill();
  textSize(13);
  beginShape();


  for (var i = 0; i < route.length; i++) {

    var n = route[i];
    text(cities[n].name, cities[n].x, cities[n].y)

  }
  //line(cities[0].x, cities[0].y,cities[route[route.length-1]].x, cities[route[route.length-1]].y);
  endShape();
}