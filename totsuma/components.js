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
      .unselectable()
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
  }
});
Crafty.c('Question', {
  init: function () {
    this.requires('Formula');
    this.attr({
      w: 288,
      h: Game.map_grid.tile.height
    });

  }
});

Crafty.c('Chest', {
  treasure: false,
  index: -1,
  init: function() {
    this.requires('Formula, Solid')
      .textFont({ size: '18px' })
      .color('rgb(100, 125, 140)')
      .css({"textAlign": "center", "verticalAlign": "middle"});
  },
  collect: function(who) {
    var loc = this.at();
    world[loc.x][loc.y] = 0; // empty the location
    this.destroy();

    if (this.treasure) {
      wins++;
      return true;

      console.log("BOTIN!", this.treasure, who);
  		Crafty.trigger('VillageVisited', this);
      Crafty('StatusText')
        .textColor('#ffffff')
        .text('¡Muy bien!');
    } else {
      return false;

      Crafty('StatusText')
        .textColor('#000000')
        .text("Eso no es correcto");
      console.log("FALSE!");
    }
  }
});

Crafty.c('MouseTracker', {
  init: function() {
    this.requires('Actor, Mouse');
    this.bind('MouseDown', this._mouse_down);
    this.w = Game.world.width();
    this.h = Game.world.height();
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


Crafty.sprite(32,32, "../art/chars1.png",{
  fr: [0,0], fn: [1,0], fl: [2,0],
  lr: [0,1], ln: [1,1], ll: [2,1],
  rl: [0,2], rn: [1,2], rr: [2,2],
  br: [0,3], bn: [1,3], bl: [2,3]
});

Crafty.sprite(32, "../art/chars1.png", {
  PlayerSprite: [0,0]  
});

Crafty.c('Anim', {
  init: function() {
    this.requires('SpriteAnimation, PlayerSprite')
      .reel('Visca',1000, [ [0, 0], [1, 0], [2, 0], [1, 0] ])
      .reel('boo',  1000, [ [0, 3], [1, 3], [2, 3], [1, 3] ])
      .reel('s'    , 100, [ [0, 0], [2, 0] ])
      .reel('e'    , 100, [ [0, 2], [2, 2] ])
      .reel('w'    , 100, [ [0, 1], [2, 1] ])
      .reel('n'    , 100, [ [0, 3], [2, 3] ])
      .reel('rest' , 100, [ [1, 0] ])
      ;
  }
});

Crafty.c('Girl', {
  laststop: 0,
  init: function() {
    this.requires('Actor, Fourway, Tween, Collision, Anim')
      .fourway(4)
      .onHit('Chest', this.catchTreasure)
      .stopOnSolids();
  },
  catchTreasure: function (data) {
    chest = data[0].obj;
    if (chest.collect()) {
      this.animate('Visca', -1);
    } else {
      this.animate('boo',   2);
    }
  },
  doTheWalk: function() {
    if (this.path.length == 0) {
      // reset animation
      console.log("End of walk");
      if (!this.isPlaying())
        this.animate('rest', 2);
      return;
    }
    var g = this.path.shift();
    if (this.at().x == g[0] && this.at().y == g[1]) {
      g = this.path.shift(); // Ignore start position

      if (g === undefined) {
        if (this.isPlaying('Visca'))
          Crafty.scene('Game');
        else
          this.animate('rest', 1);
        // The player clicked over the player character.
        return;
      }
    }
    var attr;
    if (this.at().x == g[0]) {
      attr = {y: g[1]*Game.map_grid.tile.height};
      if (this.at().y > g[1]) {
        // Moving north
        this.animate('n', 2);
      } else {
        this.animate('s', 2);
      }
    } else {
      attr = {x: g[0]*Game.map_grid.tile.height}
      if (this.at().x > g[0]) {
        // Moving west
        this.animate('w', 2);
      } else {
        this.animate('e', 2);
      }
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
    if (this.at === undefined) {
      console.log('this at reset');
      // Ugly fix for "Uncaught TypeError: undefined is not a function"
      Crafty.scene('Game');
    }
    console.log('Checking value of this', this);
    
    var loc = this.at();
    var keep;
    if (world[x][y] <= 0) {
      keep = world[x][y];
      world[x][y] = -65000;
    }
    var path = findPath(world, [loc.x, loc.y], [x, y], -1000);
    console.log('Solving', world, [loc.x, loc.y], [x, y], -1000, path);

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