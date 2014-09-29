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
  playersprite: 'chars1.png',
  world: {
    state: 0,
    wins: 0,
    tile: 32,
    side: 10,
    grid: [],

    width: function() {
      return Game.world.side * Game.world.tile;
    },

    // The total height of the game screen. Since our grid takes up the entire screen
    //  this is just the height of a tile times the height of the grid
    height: function() {
      return Game.width();
    },
  },
  clearGrid: function() {
    Game.world.grid = new Array(Game.world.side);
    console.log("clearGrid");
    for (var x = 0; x < Game.world.side; x++) {
      Game.world.grid[x] = new Array(Game.world.side);
      for (var y = 0; y < Game.world.side; y++) {
        Game.world.grid[x][y] = -65535;
      }
    }
  },
  width: function() {
    return 320;
  },

  // The total height of the game screen. Since our grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height: function() {
    return 320;
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

    Crafty.e('Question').at(0,0)
      .text('Resuelve ' + operands.join(' + '));

    console.log("Setup sums finished");

  },
  newGuess: function() {
    var result= this.world.sum.result,
        half = Math.round(result/2),
        candidate = false;
    while (candidate === false) {
      candidate = Crafty.math.randomInt(result-half, result+half);
      if (candidate != result) {
        return candidate;
      }
      candidate = false;
    }
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