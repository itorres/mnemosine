Crafty.scene('Game', function() {
    Crafty.e("MouseTracker").at(0,0);
    
    function setupSum () {
        var operands = [];
        var guesses = [];
        while (operands.length<2) {
          var candidate = Math.round(Math.random()*10);
          if (candidate > 1 && candidate < 10) {
            if (operands.length == 0 || candidate != operands[0])
              operands.push(candidate);
          }
        }
        
        Crafty.e('StatusText').at(0,Game.map_grid.height-1)
            .text('¡Hola!');
        //patata.w = Game.map_grid.tile.width * Game.map_grid.width;
        
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
        var result = operands[0]+operands[1];
        while (guesses.length<6) {
          var candidate = result - Math.round(Math.random()*10);
          if (candidate > result - 5 && candidate != result) {
            guesses.push(candidate);
          }
        }
        return {guesses: guesses, result: operands[0]+operands[1], operands: operands}
    }
    
    world = new Array(Game.map_grid.width);

    for (var i = 0; i < Game.map_grid.width; i++) {
      world[i] = new Array(Game.map_grid.height);
      for (var y = 0; y < Game.map_grid.height; y++) {
        world[i][y] = -65535;
      }
    }
    world[1][1] = 1;
    
    var sums = setupSum();


    // Place a tree at every edge square on our grid of 16x16 tiles
    for (var x = 0; x < Game.map_grid.width; x++) {
      for (var y = 0; y < Game.map_grid.height; y++) {
        var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
        if (at_edge) {
          // Place a tree entity at the current tile
          Crafty.e('Tree').at(x, y);
          world[x][y] = 1;
        } else if (Math.random() < 0.06 && world[x][y] == -65535) {
          // Place a bush entity at the current tile
          Crafty.e('Bush').at(x, y);
          world[x][y] = 2;
        }
      }
    }
    
    while (sums.guesses.length > 0) {
      var x = randomIntFromInterval(0,Game.map_grid.width-1);
      var y = randomIntFromInterval(0,Game.map_grid.height-1);
      // console.log("Candidate position",x,y,world[x][y])
      if (Math.random() < 0.06 && world[x][y] == -65535) {
        var text = sums.guesses.pop();
        var chest = Crafty.e('Chest').at(x, y).text(text);
        world[x][y] = chest.index;
      }
    }
    var resultPlaced = false;
    
    while (!resultPlaced) {
      var x = randomIntFromInterval(0,Game.map_grid.width-1);
      var y = randomIntFromInterval(0,Game.map_grid.height-1);
      if (world[x][y] == -65535) {
        var treasure = Crafty.e('Chest').at(x, y).text(sums.result);
        treasure.treasure = true;
        world[x][y] = chest.index;
        resultPlaced = true;
      }
    }

    this.player = Crafty.e('Girl').at(1, 1);
    
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	// this.unbind('VillageVisited', this.show_victory);
});