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
  world: {
    width: function() {
      return Game.map_grid.width * Game.map_grid.tile.width;
    },

    // The total height of the game screen. Since our grid takes up the entire screen
    //  this is just the height of a tile times the height of the grid
    height: function() {
      return Game.map_grid.height * Game.map_grid.tile.height;
    },
  },
  width: function() {
    return 310;
    return this.map_grid.width * this.map_grid.tile.width;
  },

  // The total height of the game screen. Since our grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height: function() {
    return 310;
    return this.map_grid.height * this.map_grid.tile.height;
  },
  
  // Initialize and start our game
  start: function() {

    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width(), Game.height());
    Crafty.background('rgb(249, 223, 125)');
    Crafty.scene('Game');
  }
}