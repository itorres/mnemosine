// Encoding: UTF-8
Crafty.scene('Game', function() {
    Crafty.e("MouseTracker");
    
    // TODO: Move setupSum back into game and keep values in Game object
    function newGame() {
      // reset grid
      Game.clearGrid();
      Game.setup();

//      Game.world.grid[1][1] = 1; // player
      
      //this.player = Crafty.e('Player').at(1, 1);
      this.player = Crafty.e('Player').place();
      Crafty.viewport.follow(this.player,0,0);
      Crafty.e('Treasure').place().text(Game.world.sum.result)

      // Place a tree at every edge square on our grid of 16x16 tiles
      for (var x = 0; x < Game.world.side; x++) {
        for (var y = 0; y < Game.world.side; y++) {
          var at_edge = x == 0 || x == Game.world.side - 1 || y == 0 || y == Game.world.side - 1;
          if (at_edge) {
            // Place a tree entity at the current tile
            Crafty.e('Tree').at(x, y);
          } else if (Math.random() < 0.3 && Game.world.grid[x][y] == -65535) {
            // Place a bush or guess entity at the current tile
            if (Math.random() < 0.82) {
              Crafty.e('Bush').at(x, y);
            } else {
              Crafty.e('Chest').at(x, y).text(Game.newGuess());
            }
          }
        }
      }

      if (Crafty('Chest').length <5) {
        // Not enough decoys
        console.log('Not enough chests', Crafty('Chest').length);
        Crafty.scene('Game');
      }

      if (!this.player.canGoToTreasure()) {
        // Unsolvable scenario, reshuffle
        console.log('Unsolvable scenario, reshuffle');
        Crafty.scene('Game');
      }

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