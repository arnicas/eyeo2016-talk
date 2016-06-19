// Based on example from The Nature of Code by
// Daniel Shiffman (ch09 interactive selection example)
// Modified by Lynn Cherny

// The class for our "castle", contains DNA sequence, fitness value, position on screen

  // Create a new castle
  function Castle(dna_, x_, y_, width, height) {

    var padding = 20; // space between cells for button(s)
    this.rolloverOn = false; // Are we rolling over this castle?
    this.dna = dna_; // Houses's DNA
    this.x = x_;     // Position on screen
    this.y = y_;
    this.width = width-padding;      // Size of square enclosing castle -- get from the cells!
    this.height = height-padding;
    this.fitness = 1; // How good is this castle?
    this.parts = castleParts; // could pass these in
    this.button;

    var scale = 2;
    var that = this;

  // Display the face
  this.display = function() {
    // We are using the face's DNA to pick properties for this face
    // such as: head size, color, window position, etc.
    // Now, since every gene is a floating point between 0 and 1, we map the values
    var genes = this.dna.genes;
    var mapGene = this.mapGene;

    var b1 = color(1); // white
    // book is 2 first genes
    var color2 = color(genes[3], genes[4], genes[5], .5);

    setGradient(this.x+padding, this.y+padding, this.width, this.height, color2, b1, "y_axis");

    push();
    translate(this.x + padding, this.y + padding); // top left corner?
    noStroke();

    // where
    var bookStart = mapGene(genes[0], 0, bookLength);
    // how many words

    // 3 lines from that point?
    var lines = bookText.slice(Math.trunc(bookStart),Math.trunc(bookStart) + 4);
    var lines = " ".concat(lines); // make one string
    var words = lines.split(" "); // split into words
    var bookwords = mapGene(genes[1], 3, words.length);
    var wordLoc = mapGene(genes[2], 0, words.length - 1 - bookwords);

    var wordsToShow = words.slice(Math.trunc(wordLoc), Math.trunc(bookwords));
    console.log(words, bookwords, wordLoc, wordsToShow);
    printLines(wordsToShow, this.x+padding+5, this.y+padding+10, this.width-10, this.height);

    this.parts.sort(function(a, b) { return genes[b.geneShown] - genes[a.geneShown];});
    var shown = this.parts.filter(function(p) { return genes[p.geneShown] > .7;});
    var bottoms = shown.filter(function(d) {return d.ptype == "bottom"});
    bottoms.forEach(function (part) {

      var scaledh = part.handle.height/2;
      var scaledw = part.handle.width/2;
      var startX = 0;
      var endX = that.width - scaledw;
      var startY = that.height - scaledh; // on the bottom?
      var endY = that.height - scaledh;
      var x = mapGene(genes[part.geneX], startX, endX);

      part.showMe = true;
      part.children = [];
      part.x = x;
      var y = mapGene(genes[part.geneY], startY, endY);
      part.y = y;
    });

    // bases can be the refpart for windows and attachments
    var bases = shown.filter(function(d) { return (d.ptype == "base");});

    bases.forEach(function(part) {
      var scaledh = part.handle.height/2;
      var scaledw = part.handle.width/2;
      var startX = 0;
      var endX = that.width - scaledw;
      var startY = that.height - scaledh; // on the bottom?
      var endY = that.height - scaledh;
      var x = mapGene(genes[part.geneX], startX, endX);

      part.showMe = true; // so it shows up
      part.children = []; // windows and attachments
      part.x = x;
      var y = mapGene(genes[part.geneY], startY, endY);
      part.y = y;
    });

    var others = shown.filter(function(d) { return (d.ptype == "attach" || d.ptype == "window");});
    others.forEach(function(part) {

      var scaledh = part.handle.height/2;
      var scaledw = part.handle.width/2;
      var startX = 0;
      var endX = that.width - scaledw;
      var startY = 0;
      var endY = that.height - scaledh;
      part.refpart = null;
      part.showMe = false;

      if (bases.length > 0) {
        part.refpart = bases.slice(0,1)[0];
        bases = bases.slice(1);
        }
      if (part.refpart) { // only show if there is a host base
        if (part.ptype == "window") {
          startX = part.refpart.x;
          endX = startX + part.refpart.handle.width/2 - scaledw;
          startY = that.height - part.refpart.handle.height/2; // top of start
          endY = that.height - part.refpart.handle.height/3; // start of refpart
          }
        if (part.ptype == "attach") {
          startX = part.refpart.x;
          endX = startX + part.refpart.handle.width/3 + scaledw;
          startY = that.height - scaledh; // on the bottom -- in silhouette they look bad in air.
          endY = that.height - scaledh -5;
        }
        var x = mapGene(genes[part.geneX], startX, endX);
        part.x = x;
        var y = mapGene(genes[part.geneY], startY, endY);
        part.y = y;
        part.refpart.children.push(part); // only graphed by being in a base
      }
    });

    shown.sort(function(a,b) {return (a.y + a.handle.height/2) > (b.y + b.handle.height/2);});
    shown.forEach(function(part) {
      var scaledh = part.handle.height/2;
      var scaledw = part.handle.width/2;
      if (part.showMe) { // only bases etc
        //tint(0, .7);  // not transparent here 
        image(part.handle, part.x, part.y, scaledw, scaledh);
        part.children.forEach(function(part) {
          var scaledh = part.handle.height/2;
          var scaledw = part.handle.width/2;
          image(part.handle, part.x, part.y, scaledw, scaledh);
      });
      }
    });

    // Once we calculate all the above properties, we use those variables to draw rects, ellipses, etc.

    // Draw the bounding box -- 
    stroke(.25);
    rectMode(CORNER);
    rect(0, 0, this.width, this.height);
    pop();

    this.button = createButton();
    this.button.position(this.x + padding, this.y + padding/2);  // inside the padding, top left.
    this.button.html(this.fitness);
    this.button.mousePressed(this.votedFor);
  }

  this.votedFor = function(e) {
      that.fitness += 1;
      that.button.html(that.fitness);
  }

  this.getFitness = function() {
    return this.fitness;
  }

  this.getDNA = function() {
    return this.dna;
  }

  this.mapGene = function(gene, rangeStart, rangeEnd) {
    // returns the scale for the gene which is from 0 to 1.
  return map(gene, 0, 1, rangeStart, rangeEnd);
  }
}



