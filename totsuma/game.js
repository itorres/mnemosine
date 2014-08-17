/*
// Crafty cookbooks
// https://groups.google.com/forum/#!topic/craftyjs/qtUQaDzVYAM
//
// Follow mouse tutorial
// http://gamedevelopment.tutsplus.com/tutorials/quick-tip-smoothly-move-an-entity-to-the-position-of-the-mouse--gamedev-7356
// http://jsfiddle.net/Gamedevtuts/nkZjR/
*/
Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid: {
    width:  10,
    height: 10,
    tile: {
      width:  32,
      height: 32
    }
  },
  occupied: new Array(),

  // The total width of the game screen. Since our grid takes up the entire screen
  //  this is just the width of a tile times the width of the grid
  world: {
    state: 0,
    wins: 0,
    grid: [],

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
    return 320;
    return this.map_grid.width * this.map_grid.tile.width;
  },

  // The total height of the game screen. Since our grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height: function() {
    return 320;
    return this.map_grid.height * this.map_grid.tile.height;
  },
  setup: function() {
    this.world.sum = {
      guesses:  [],
      operands: [],
      result: 0
    }
    var operands = this.world.sum.operands;
    while (operands.length<2) {
      var candidate = Crafty.math.randomInt(1,10+Game.world.wins);
      if (operands.length == 0 || candidate != operands[0])
        this.world.sum.operands.push(candidate);
    }
    this.world.sum.result = operands[0]+operands[1];
    var guesses  = this.world.sum.guesses;
    var result = this.world.sum.result;
    console.log("Setup sums");
    while (guesses.length<6) {
      var candidate = result - Math.round(Math.random()*10);
      if (candidate > result - 5 && candidate != result) {
        guesses.push(candidate);
      }
    }

    Crafty.e('Question').at(0,0)
      .text('Resuelve ' + operands.join(' + '));


  },
  giveUp: function() {
    /*
      TODO:
      - change status to -something (-2);
      - Save state
    */
    this.world.state = 0;
    Crafty.scene('Game');

  },
  // Initialize and start our game
  start: function() {

    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width(), Game.height());
    Crafty.background('rgb(249, 223, 125)');
    Crafty.scene('Game');
  }

}