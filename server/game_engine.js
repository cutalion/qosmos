var gx = 2;

function getPlacementPosition(map, fw, fh) {
  var found = false,
      x, y;

  while (!found) {
    x = gx; //Math.floor(Math.random() * 4); // fw
    y = 2; //Math.floor(Math.random() * 4); // fh

    if (!map[y * fw + x]) {
      map[y * fw + x] = true;
      found = true;
    }
  }


  gx += 1;
  return { x: x, y: y };
}

module.exports = function() {
  var self = this;

  // initializes for the new round
  self.newRound = function(gameState) {
    var map = [];
    gameState.eachNode(function(nodeInfo) {
      var pos = getPlacementPosition(map, gameState.fieldWidth, gameState.fieldHeight);

      nodeInfo.x = pos.x;
      nodeInfo.y = pos.y;
      nodeInfo.energy = 100 * Math.floor(Math.random() * 5 + 1) * 5;
      nodeInfo.dead = false;
    });
  }

  // processes current game state and makes all moves
  self.process = function(gameState, tick) {
    if (tick > 0) {
      moveNodes(gameState);
      exchangeEnergy(gameState);

      if (tick % 10) {
        deployEnergy(gameState);
      }
    }
  }

  var moveNodes = function(gameState) {
    var nodes = gameState.serialize.nodes;

    gameState.eachNode(function(n) {
      switch (n.tickMove) {
        case 'move_left':
          if (n.x > 0) n.move_left();
          break;

        case 'move_down':
          if (n.y < gameState.fieldHeight - 1) n.move_down();
          break;

        case 'move_up':
          if (n.y > 0) n.move_up();
          break;

        case 'move_right':
          if (n.x < gameState.fieldWidth - 1) n.move_right();
          break;
      }
    });

    // do {
    //   var collision_nodes = gameState.getCollisons();
    //   for(var i in collision_nodes){
    //     collision_nodes[i].x = collision_nodes[i].old.x
    //     collision_nodes[i].y = collision_nodes[i].old.y
    //   }
    // } while(collision_nodes.length > 0)

    // check: if two nodes in one position
    // move them back
    // goto check
    // or
    // proceed

    // reset moves
    gameState.eachNode(function(n) { n.tickMove = null; });
  }

  var exchangeEnergy = function(gameState) {
    var _ = require('../lib/underscore'),
        sorted = _.toArray(gameState.nodes);

    sorted = _.sortBy(sorted, function(n) { return -n.energy; });

    for (var i = 0; i < sorted.length; i++) {
      var node = sorted[i];

      for (var j = i + 1; j < sorted.length; j++) {
        var other = sorted[j];

        if (other.closeTo(node) && other.energy < node.energy) {
          console.log('take energy');
          node.takesEnergyOf(other);
        }
      }
    }
  }

  var deployEnergy = function(gameState) {}

  return self;
}
