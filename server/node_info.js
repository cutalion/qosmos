module.exports = function(name) {
  var self = this;

  // status data
  self.name   = name;
  self.x      = null;
  self.y      = null;
  self.old    = 
  self.energy = null;
  self.score  = 0;

  // move that is valid for the upcoming tick
  // cleared on every tick.
  self.tickMove = null;

  self.move_left = function(){
    self.x--;
  }

  self.move_down = function(){
    self.y++;
  }

  self.move_up = function(){
    self.y--;
  }

  self.move_right = function(){
    self.x++;
  }

  return self;
}
