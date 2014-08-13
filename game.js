/*
// Crafty cookbooks
// https://groups.google.com/forum/#!topic/craftyjs/qtUQaDzVYAM
//
// Follow mouse tutorial
// http://gamedevelopment.tutsplus.com/tutorials/quick-tip-smoothly-move-an-entity-to-the-position-of-the-mouse--gamedev-7356
// http://jsfiddle.net/Gamedevtuts/nkZjR/
*/
var world;
Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid: {
    width:  12,
    height: 12,
    tile: {
      width:  32,
      height: 32
    }
  },
  occupied: new Array(),

  // The total width of the game screen. Since our grid takes up the entire screen
  //  this is just the width of a tile times the width of the grid
  width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
  },

  // The total height of the game screen. Since our grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height: function() {
    return this.map_grid.height * this.map_grid.tile.height;
  },

  // Initialize and start our game
  start: function() {

    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width(), Game.height());
    Crafty.background('rgb(249, 223, 125)');
    Crafty.e("MouseTracker").at(0,0);
    world = new Array(Game.map_grid.width);

    for (var i = 0; i < Game.map_grid.width; i++) {
      world[i] = new Array(Game.map_grid.height);
      for (var y = 0; y < Game.map_grid.height; y++) {
        world[i][y] = 0;
      }
    }
    world[1][1] = 1;

    
    // Place a tree at every edge square on our grid of 16x16 tiles
    for (var x = 0; x < Game.map_grid.width; x++) {
      for (var y = 0; y < Game.map_grid.height; y++) {
        var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;


        if (at_edge) {
          // Place a tree entity at the current tile
          Crafty.e('Tree').at(x, y);
          world[x][y] = 1;
        } else if (Math.random() < 0.06 && world[x][y] == 0) {
          // Place a bush entity at the current tile
          Crafty.e('Bush').at(x, y);
          world[x][y] = 2;
        }
      }
    }
    this.player = Crafty.e('Girl').at(1, 1);
  }
}