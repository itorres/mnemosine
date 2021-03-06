var playersprite = 'chars1';

// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.world.tile,
      h: Game.world.tile,
      placed: false
    })
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: Math.floor(this.x/Game.world.tile), y: Math.floor(this.y/Game.world.tile) }
    } else {
      this.attr({ x: x * Game.world.tile, y: y * Game.world.tile });
      Game.world.grid[x][y] = this.index;
      return this;
    }
  },
  atEdge: function(x, y) {
    if (x === undefined && y === undefined) {
      x = this.x; y = this.y;
    }
    return x == 0 || x == Game.world.side - 1 || y == 0 || y == Game.world.side - 1;

    
  },
  place: function() {
    while (!this.placed) {
        var x = Crafty.math.randomInt(0,Game.world.side - 1);
        var y = Crafty.math.randomInt(0,Game.world.side - 1);
        if (!this.atEdge(x,y) && Game.world.grid[x][y] == -65535) {
          this.at(x,y);
          this.placed=true;
        }
    }
    return this;
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
  index: 1,
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 125, 40)');
  },
});

Crafty.c('Formula', {
  init: function () {
    this.requires('2D, Color, DOM, Grid, Text')
      .unselectable()
      .textFont({ family: 'Roboto Condensed', lineHeight: '32px', size: '28px' })
      .css({"textAlign": "center", "verticalAlign": "middle"});
    this.attr({
      w: Game.world.tile,
      h: Game.world.tile
    })
  }
});

Crafty.c('StatusText', {
  init: function () {
    this.requires('Formula');
    this.attr({
      w: Game.world.tile * Game.world.side,
      h: Game.world.tile
    });
  }
});

Crafty.c('Question', {
  init: function () {
    this.requires('Formula');
    this.attr({
      w: 288,
      h: Game.world.tile
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
    Game.world.grid[loc.x][loc.y] = -65000; // empty the location
    this.destroy();
    return this.treasure;

    if (this.treasure) {
      
      return true;

      console.log("BOTIN!", this.treasure, who);
  		//Crafty.trigger('VillageVisited', this);
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
Crafty.c('Treasure', {
  init: function() {
    this.requires('Chest')
      //.color('rgb(200, 125, 140)')
    ;
    this.treasure = true;
  }
});

Crafty.c('MouseTracker', {
  init: function() {
    this.requires('2D, Canvas, Mouse');
    this.bind('MouseDown', this._mouse_down);
    this.w = Game.world.width();
    this.h = Game.world.height();
    this.x = 0; this.y = 0;
  },
  _mouse_down: function(e) {
    var y  = Math.floor(e.realY/Game.world.tile), x = Math.floor(e.realX/Game.world.tile);
    Crafty('Player').moveTo(x, y);
  }
})
// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
  index: 2,
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 185, 40)');
  },
});

Crafty.sprite(32, "../art/" + playersprite + ".png", {
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

Crafty.c('Player', {
  index: 300,
  laststop: 0,
  init: function() {
    this.requires('Actor, Tween, Collision, Anim')
      .onHit('Chest', this.catchTreasure)
      .stopOnSolids();
  },
  catchTreasure: function (data) {
    chest = data[0].obj;
    if (chest.collect()) {
      this.animate('Visca', -1);
      Game.world.wins++;
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
        if (this.isPlaying('Visca')) {          
          Game.world.state=2;
          Crafty.scene('Game');
        } else {
          this.animate('rest', 1);
        }
        // The player clicked over the player character.
        return;
      }
    }
    var attr;
    if (this.at().x == g[0]) {
      attr = {y: g[1]*Game.world.tile};
      if (this.at().y > g[1]) {
        // Moving north
        this.animate('n', 2);
      } else {
        this.animate('s', 2);
      }
    } else {
      attr = {x: g[0]*Game.world.tile}
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
  canGoToTreasure: function() {
    var loc = this.at();
    var chestloc = [Crafty('Treasure').at().x,Crafty('Treasure').at().y];
    Game.world.grid[Crafty('Treasure').at().x][Crafty('Treasure').at().y] = -65000;
    var path = findPath(Game.world.grid, [loc.x, loc.y], chestloc, -1000);
    Game.world.grid[Crafty('Treasure').at().x][Crafty('Treasure').at().y] = Crafty('Treasure').index;
    if (path.length > 0) {
      return true;
    }
    return false;
  },
  moveTo: function(x, y) {
    if (this.at === undefined) {
      console.log('this at reset',this);
      /* FIXME: Ugly fix for "Uncaught TypeError: undefined is not a function"
          Should find the culprit. It seems there's no Grid ancestor.
      */
      Crafty.scene('Game');
    }
    console.log('Checking value of this', this);

    var loc = this.at();
    var keep;
    if (Game.world.grid[x][y] <= 0) {
      keep = Game.world.grid[x][y];
      Game.world.grid[x][y] = -65000;
    }
    var path = findPath(Game.world.grid, [loc.x, loc.y], [x, y], -1000);
    console.log('Solving', Game.world.grid, [loc.x, loc.y], [x, y], -1000, path);

    Game.world.grid[x][y] = keep;

    console.log("moveTo",x,y, Game.world.grid[x][y], path);
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