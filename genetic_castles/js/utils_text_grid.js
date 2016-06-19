function setupGrid(canvas,cwidth,cheight,columns,rows) {

  var outerPadding = 20;
  var popLocations = [];

  return calcSize(cwidth,cheight);

  function calcSize(w, h) {

    //globals, sadly
      tileWidth = w / columns - outerPadding;
      tileHeight = h / rows - outerPadding;
      return getCells();
  }
  function getCells() {

      for(var x = 0; x < columns; x++) {
        for(var y = 0; y < rows; y++) {
          popLocations.push({x: x*tileWidth + outerPadding, y: y*tileHeight + outerPadding});
          //rect(x, y, tileWidth, tileHeight);
        }
      }
      return popLocations;
  }

}


// from p5.js docs

function setGradient(x, y, w, h, c1, c2, axis) {

  noFill();

  if (axis == "y_axis") {  // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }
  else if (axis == "x_axis") {  // Left to right gradient
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y+h);
    }
  }
}


function fixText(lines) {
  // this doesn't handle curly quotes.
  lines = smarten(lines);
  lines = lines.replace(/\u201d \u201c/g, "\u201d</p><p>\u201c");
  lines = lines.replace(/\t/g, "</p><p>");
  return lines;
}

function printLines(lines, x, y, w, h) {

  lines = fixText(lines.join(' '));

  console.log(lines);

  lines = lines.replace(/,/g, "<br>");
  lines = lines.replace(/\./g, "<br>");

  text = createDiv();
  text.id("text");
  text.position(x, y-8);

  text.style("width", "" + w);
  text.style("height", "" + (h - 5));
  text.style("overflow", "hidden");
  text.html("<p>" + specialCaps(lines) + "</p>");

}

function smarten(text) {
        return text
            /* opening singles */
            .replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018")

            /* closing singles & apostrophes */
            .replace(/'/g, "\u2019")

            /* opening doubles */
            .replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c")

            /* closing doubles */
            .replace(/"/g, "\u201d")

            /* em-dashes */
            .replace(/--/g, "\u2014");
    };

function splitCaps(text) {
  return text.split(/(?=[A-Z])/);
}

function specialCaps(lines) {
  return lines.replace(/\s([A-Z]\w+)/g, " <span>$1</span>");
}

function getNRandom(N, list) {

  var results = [];
  if (N < list.length-1) {
    for (n = 0; n <= N; n++) {
        results.push(getRandom(list));
      }
  } else {
    results = list;
  }
  return _.uniq(results);
}

function getRandom(list) {

  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return list[getRandomIntInclusive(0, list.length-1)];
}