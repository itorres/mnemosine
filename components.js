// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: Math.floor(this.x/Game.map_grid.tile.width), y: Math.floor(this.y/Game.map_grid.tile.height) }
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  },
  atEdge: function() {
    return x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
  }
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
});

// A Tree is just an Actor with a certain color
Crafty.c('Tree', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 125, 40)');
  },
});

Crafty.c('Formula', {
  init: function () {
    this.requires('2D, Color, DOM, Grid, Text')
      .textFont({ family: 'Ubuntu Mono', lineHeight: '32px', size: '28px' })
      .css({"textAlign": "center", "verticalAlign": "middle"});
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  }
});
Crafty.c('StatusText', {
  init: function () {
    this.requires('Formula');
    this.attr({
      w: Game.map_grid.tile.width*Game.map_grid.width,
      h: Game.map_grid.tile.height
    });
    this.bind('MouseDown', this._mouse_down);
  },
  _mouse_down: function() {
    console.log("Restart");
     Crafty.scene('Game');
  }

});

Crafty.c('Chest', {
  treasure: false,
  index: -1,
  init: function() {
    this.requires('Formula, Solid')
      .textFont({ size: '14px' })
      .color('rgb(100, 125, 140)')
      .css({"textAlign": "center", "verticalAlign": "middle"});
  },
  collect: function() {
    if (this.treasure) {
      console.log("BOTIN!", this.treasure);
  		Crafty.trigger('VillageVisited', this);
      Crafty('StatusText')
        .textColor('#ffffff')
        .text('¡Muy bien!');
    } else {
      Crafty('StatusText')
        .textColor('#ff0000')
        .text("Eso no es correcto");
      console.log("FALSE!");
    }
    var loc = this.at();
    world[loc.x][loc.y] = 0; // empty the location
    this.destroy();
  }
});

Crafty.c('MouseTracker', {
  init: function() {
    this.requires('Actor, Mouse');
    this.bind('MouseDown', this._mouse_down);
    this.w = Game.width();
    this.h = Game.height();
  },
  _mouse_down: function(e) {
    var y  = Math.floor(e.realY/Game.map_grid.tile.height), x = Math.floor(e.realX/Game.map_grid.tile.width);
    Crafty('Girl').moveTo(x, y);
  }
})
// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 185, 40)');
  },
});


Crafty.sprite(32,32, "art/chars.png",{
  girl01: [0,0], girl02: [0,1], girl03: [0,2],
  girl04: [1,0], girl05: [1,1], girl06: [1,2],
  girl07: [2,0], girl08: [2,1], girl09: [2,2],
  girl10: [3,0], girl11: [3,1], girl12: [3,2]
});

Crafty.c('Girl', {
  laststop: 0,
  init: function() {
    this.requires('Actor, Fourway, girl01, Tween, Collision')
      .fourway(4)
      .onHit('Chest', this.catchTreasure)
      .stopOnSolids();
  },
  catchTreasure: function (data) {
    chest = data[0].obj;
    chest.collect();
  },
  doTheWalk: function() {
    if (this.path.length == 0) {
      // reset animation
      return;
    }
    var g = this.path.shift();
    if (this.at().x == g[0] && this.at().y == g[1]) {
      g = this.path.shift(); // Ignore start position
    }
      
    var attr;
    if (this.at().x == g[0]) {
      attr = {y: g[1]*Game.map_grid.tile.height}
      // animate 
    } else {
      attr = {x: g[0]*Game.map_grid.tile.height}
      // animate
    }
    console.log("Walking",g);
    this.tween(attr, 200);
    this.timeout(this.doTheWalk, 220);
  },
  walkPath: function(path) {
    this.path = path;
    console.log("walkPath",path);
    this.doTheWalk();
  },
  moveTo: function(x, y) {
    var loc = this.at();
    var keep;
    if (world[x][y] <= 0) {
      keep = world[x][y];
      world[x][y] = -65000;
    }
    var path = findPath(world, [loc.x, loc.y], [x, y], -100);
    world[x][y] = keep;

    console.log("moveTo",x,y, world[x][y], path);
    this.walkPath(path);
  },
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);
    return this;
  },
  // Stops the movement
  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  }
});
