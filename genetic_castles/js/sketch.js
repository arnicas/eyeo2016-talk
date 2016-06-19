// Adapted by Lynn Cherny
// from The Nature of Code chapter on genetic algorithsm
// by Daniel Shiffman
// http://natureofcode.com

var population;
var info;
var ctx,
    columns = 3,
    rows = 2,
    w=900, h=600, tileWidth, tileHeight,
    popLocations = [],
    genecount, myFont, fancyFont;

var bookText, bookLength;

var castleParts = [
    //{name: "towerBase", path: 'img/tower_base.png', ptype: "base"},
    {name: "cren_tower2", path: 'img/cren_tower_2.png', ptype: "base"},
    {name: "diamond_attachment", path: 'img/diamond_attachment.png', ptype: "attach"},
    {name: "tall_orange_peak_tower", path: 'img/tall_orange_peak_tower.png', ptype: "base"},
    {name: "tall_stairs", path: 'img/tall_stairs.png', ptype: "base"},
    {name: "wall_single_bridge", path: 'img/wall_single_bridge.png', ptype: "base"},
    {name: "flagTower", path: 'img/flag_tower.png', ptype: "base" },
    {name: "wallWithArchDoor",  path: 'img/wall_with_arch_door.png', ptype: "base" },
    {name: "wallWindow",  path: 'img/wall_window.png', ptype: "base" },
    {name: "wallThreeWindows",  path: 'img/wall_three_windows.png', ptype: "base" },
    {name: "stairsUp",  path: 'img/stairs_up.png', ptype: "base" },
    {name: "bridgeThreeArches",  path: 'img/three_arch_bridge.png', ptype: "base" },
    {name: "towerThreeArches",  path: 'img/three_arch_tower.png', ptype: "base" },
    {name: "towerFlatOrange",  path: 'img/flat_orange_tower.png', ptype: "base" },
    {name: "towerSmallWedge",  path: 'img/small_wedge_tower.png', ptype: "base" },
    {name: "bridgeArch",  path: 'img/single_bridge_arch.png', ptype: "bottom" },
    {name: "towerPortcullis",  path: 'img/portcullis_tower.png', ptype: "base" },
    {name: "keep",  path: 'img/big_keep.png', ptype: "base" },
    {name: "stairsDouble",  path: 'img/double_steps_up.png', ptype: "bottom" },
    //{name: "doorLatches",  path: 'img/door_latches.png', ptype: "door" },
    //{name: "wallLongBase",  path: 'img/long_wall_base.png', ptype: "base" },
    {name: "wallLongOrange",  path: 'img/long_orange_wall.png', ptype: "base" },
    {name: "wallLongCrenelated",  path: 'img/long_crenelated_wall.png', ptype: "base" },
    {name: "towerCrenellated",  path: 'img/crenelated_tower.png', ptype: "base" },
    {name: "windowBigThreeAttach",  path: 'img/big_three_window_attach.png', ptype: "attach" },
    {name: "windowSmallThreeAttach",  path: 'img/tiny_three_window_attachment.png', ptype: "window" },
    {name: "windowSmallTwoGabled",  path: 'img/gable_two_windows.png', ptype: "window" } ];

function preload() {

  // 0 is for the text start point, 1 is words,2 is for where in words
  // 3,4, 5 is the color of bg gradient.
  // I need to make a smarter way to handle the genes and their counts.
  genecount = 6;
  castleParts.forEach(function(d) {
    d.handle = loadImage(d.path);
    d.geneX = genecount++;
    d.geneY = genecount++;
    d.geneShown = genecount++;
  });
  genes = new Array(genecount);
  bookText = loadStrings("text/yeats_poems.txt");
}

function setup() {
  ctx = createCanvas(w,h);
  popLocations = setupGrid(ctx, w, h, columns, rows);
  colorMode(RGB, 1.0, 1.0, 1.0, 1.0);
  var popmax = columns * rows;
  var mutationRate = 0.05;  // A pretty high mutation rate here, our population is rather small we need to enforce variety
  // Create a population with a target phrase, mutation rate, and population max
  population = new Population(mutationRate, popmax, tileWidth, tileHeight);

  // voting buttons for each and info text.
  // Would be much nicer to do this in the html.  Requires some work.
  // redo a generation button
  var button = createButton("evolve new generation");
  button.mousePressed(nextGen);
  button.position(20,600);
  info = createDiv(''); // what gen are we on?
  info.position(20,630);
  var instructions = createDiv("Vote for your favorite text, color, castle arrangement. Then press the button to evolve another generation. Text is from Yeats.")
  instructions.position(150, 605);
  var moreInfo = createDiv("Made by @arnicas using genetic algorithm in p5.js, based on Dan Shiffman code. <a href='https://github.com/arnicas/eyeo2016-talk'>Repo here.</a>");
  moreInfo.position(20, 650);


  bookText = bookText.map(function(t) {
    if (t) {
      return t.replace(/\s+/, " ").replace(/\"/g, "\t").replace(/_/g, "");
    }
  });
  bookLength = bookText.length;
  noLoop();

}

function draw() {
  background(1); // erases stuff
  // Display the castles
  population.display();
  info.html("Generation #:" + population.getGenerations());
}

// If the button is clicked, evolve next generation
function nextGen() {
  population.selection();
  population.reproduction();
  // clear all the text from the cells:
  divs = selectAll("div");
  divs.forEach(function(d) {
    if (d.elt.id == "text")
        d.remove();
  });
  draw();
}
