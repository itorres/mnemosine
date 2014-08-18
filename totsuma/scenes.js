// Encoding: UTF-8
Crafty.scene('Game', function() {
    Crafty.e("MouseTracker");
    
    // TODO: Move setupSum back into game and keep values in Game object
    function newGame() {
      // reset grid
      Game.clearGrid();
      Game.setup();

//      Game.world.grid[1][1] = 1; // player
      
      var sums = Game.world.sum;

      // Place a tree at every edge square on our grid of 16x16 tiles
      for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
          var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
          if (at_edge) {
            // Place a tree entity at the current tile
            Crafty.e('Tree').at(x, y);
          } else if (Math.random() < 0.06 && Game.world.grid[x][y] == -65535) {
            // Place a bush entity at the current tile
           
          }
        }
      }

      this.player = Crafty.e('Player').at(1, 1);
      Crafty.viewport.follow(this.player,0,0);

      Crafty.e('Treasure').place().text(sums.result)

      while (sums.guesses.length > 0) {
        var x = Crafty.math.randomInt(0,Game.map_grid.width -1);
        var y = Crafty.math.randomInt(0,Game.map_grid.height-1);
        // console.log("Candidate position",x,y,Game.world.grid[x][y])
        if (Game.world.grid[x][y] == -65535) {
          var text = sums.guesses.pop();
          var chest = Crafty.e('Chest').at(x, y).text(text);
        }
      }

      var bushes = 0, totalbushes = (Game.world.side-1)*(Game.world.side-1)/6;
      while (bushes < totalbushes) {
        var x = Crafty.math.randomInt(0,Game.map_grid.width -1);
        var y = Crafty.math.randomInt(0,Game.map_grid.height-1);
        if (Game.world.grid[x][y] == -65535) {
           Crafty.e('Bush').at(x, y);
           bushes++;
        }
      }
      console.log("bushes", bushes, totalbushes);



      Game.world.grid[Crafty('Treasure').at().x][Crafty('Treasure').at().y] = -65000;
      var path = findPath(Game.world.grid, [1,1], [Crafty('Treasure').at().x,Crafty('Treasure').at().y], -1000);
      if (path.length == 0) {
        // Unsolvable scenario, reshuffle
        console.log('Unsolvable scenario, reshuffle', Game.world.grid, [1,1], Crafty('Treasure').at(), -1000, path);
        Crafty.scene('Game');
      }
      Game.world.grid[Crafty('Treasure').at().x][Crafty('Treasure').at().y] = Crafty('Treasure').index;


      Game.world.state=1;
      if (this.player.at === undefined) {
        console.log('early this at reset',this);
        Crafty.scene('Game');
      }
     // Crafty.viewport.scale(1.5);
    }
    switch (Game.world.state) {
      // Todo: 
      // - Sync state with server
      case 2: // WON!
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