// Encoding: UTF-8
Crafty.scene('Game', function() {
    Crafty.e("MouseTracker").at(0,0);
    
    // TODO: Move setupSum back into game and keep values in Game object
    function newGame() {
      Game.setup();
      Game.world.grid = new Array(Game.map_grid.width);

      for (var i = 0; i < Game.map_grid.width; i++) {
        Game.world.grid[i] = new Array(Game.map_grid.height);
        for (var y = 0; y < Game.map_grid.height; y++) {
          Game.world.grid[i][y] = -65535;
        }
      }
      Game.world.grid[1][1] = 1;
      
      var sums = Game.world.sum;
      function placeBush(x,y) {
        Crafty.e('Bush').at(x, y);
        Game.world.grid[x][y] = 2;
      }

      // Place a tree at every edge square on our grid of 16x16 tiles
      for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
          var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
          if (at_edge) {
            // Place a tree entity at the current tile
            Crafty.e('Tree').at(x, y);
            Game.world.grid[x][y] = 1;
          } else if (Math.random() < 0.06 && Game.world.grid[x][y] == -65535) {
            // Place a bush entity at the current tile
            placeBush(x,y);
          }
        }
      }
      
      while (sums.guesses.length > 0) {
        var x = Crafty.math.randomInt(0,Game.map_grid.width-1);
        var y = Crafty.math.randomInt(0,Game.map_grid.height-1);
        // console.log("Candidate position",x,y,Game.world.grid[x][y])
        if (Math.random() < 0.06 && Game.world.grid[x][y] == -65535) {
          var text = sums.guesses.pop();
          var chest = Crafty.e('Chest').at(x, y).text(text);
          Game.world.grid[x][y] = chest.index;
        }
      }
      var resultPlaced = false;
      while (!resultPlaced) {
        var x = Crafty.math.randomInt(0,Game.map_grid.width-1);
        var y = Crafty.math.randomInt(0,Game.map_grid.height-1);
        if (Game.world.grid[x][y] == -65535) {
          var treasure = Crafty.e('Chest').at(x, y).text(sums.result);
          treasure.treasure = true;
          Game.world.grid[x][y] = treasure.index;
          resultPlaced = [x,y];
        }
      }

      // Check scenario
      placeBush(1,2);
      Game.world.grid[resultPlaced[0]][resultPlaced[1]] = -65000;
      var path = findPath(Game.world.grid, [1,1], resultPlaced, -1000);
      if (path.length == 0) {
        // Unsolvable scenario, reshuffle
        console.log('Unsolvable scenario, reshuffle', Game.world.grid, [1,1], resultPlaced, -1000, path);
        Crafty.scene('Game');
      }
      Game.world.grid[resultPlaced[0]][resultPlaced[y]] = -1;

      this.player = Crafty.e('Player').at(1, 1);
      Crafty.viewport.follow(this.player,0,0);

      Game.world.state=1;
     // Crafty.viewport.scale(1.5);
    }
    switch (Game.world.state) {
      // Todo: 
      // - Sync state with server
      case 0:
        newGame();
        break;
      case 1:
        // - Start game from JSON state in places like the Player.at reset.
        console.log("should load json",JSON.stringify(Game));
        break;
      default:
        console.log("Unhandled Game.world.state",Game.world.state);
    }
}, function() {
});