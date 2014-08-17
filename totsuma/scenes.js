// Encoding: UTF-8
Crafty.scene('Game', function() {
    Crafty.e("MouseTracker").at(0,0);
    
    // TODO: Move setupSum back into game and keep values in Game object

    function setupSum () {
        var operands = [];
        var guesses = [];
        while (operands.length<2) {
          var candidate = Crafty.math.randomInt(1,10+Game.world.wins);
          if (operands.length == 0 || candidate != operands[0])
            operands.push(candidate);
        }
        
        /*
        Crafty.e('StatusText').at(0,Game.map_grid.height-1)
            .text('¡Hola!');
        */
        Crafty.e('Question').at(0,0)
            .text('Resuelve ' + operands.join(' + '));
        //patata.w = Game.map_grid.tile.width * Game.map_grid.width;
        /*
        var left = String(operands[0]);
        var center = Math.floor(Game.map_grid.width/2);
        var right = String(operands[1]);
        console.log("Center",center);
        for (i=0;i<left.length;i++) {
          var x = center-(left.length-i);
          console.log("Escrivint",left[i],"en",x);
          Crafty.e('Formula').at(x,0).text(left[i]);
        }
        //Crafty.e('Formula').at(3,0).text('2');
        Crafty.e('Formula').at(center,0).text('+');
        //Crafty.e('Formula').at(5,0).text('2');
        for (i=0;i<right.length;i++) {
          var x = center+(right.length-i);
          console.log("Escrivint",right[i],"en",x);
          Crafty.e('Formula').at(x,0).text(right[i]);
        }
        */
        var result = operands[0]+operands[1];
        while (guesses.length<6) {
          var candidate = result - Math.round(Math.random()*10);
          if (candidate > result - 5 && candidate != result) {
            guesses.push(candidate);
          }
        }
        return {guesses: guesses, result: operands[0]+operands[1], operands: operands}
    }
    
    Game.world.grid = new Array(Game.map_grid.width);
    // Game.world.grid = world;

    for (var i = 0; i < Game.map_grid.width; i++) {
      Game.world.grid[i] = new Array(Game.map_grid.height);
      for (var y = 0; y < Game.map_grid.height; y++) {
        Game.world.grid[i][y] = -65535;
      }
    }
    Game.world.grid[1][1] = 1;
    
    var sums = setupSum();
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
        Game.world.grid[x][y] = chest.index;
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

    // Todo: 
    // - Sync state with server
    // - Start game from JSON state in places like the Player.at reset.
    console.log("json",JSON.stringify(Game));

   // Crafty.viewport.scale(1.5);
}, function() {
});