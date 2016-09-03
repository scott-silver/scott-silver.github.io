DIRECTION_NORTH = 'n';
DIRECTION_EAST = 'e';
DIRECTION_SOUTH = 's';
DIRECTION_WEST = 'w';

var Snake = function() {
  this.direction = DIRECTION_NORTH;
  this.coordinates = [
    {x: 0, y: 2, color: 'grey'},
    {x: 0, y: 1, color: 'grey'},
    {x: 0, y: 0, color: 'grey'}
  ];
}

Snake.prototype.changeDirection = function(direction) {
  this.direction = direction;
}

Snake.prototype.advance = function() {
  var lastCoordinate = this.coordinates[0];
  var newCoordinate = {};
  newCoordinate.color = 'grey'
  switch (this.direction) {
    case DIRECTION_NORTH:
      newCoordinate.x = lastCoordinate.x;
      newCoordinate.y = lastCoordinate.y + 1;
      break;
    case DIRECTION_EAST:
      newCoordinate.x = lastCoordinate.x + 1;
      newCoordinate.y = lastCoordinate.y;
      break;
    case DIRECTION_SOUTH:
      newCoordinate.x = lastCoordinate.x;
      newCoordinate.y = lastCoordinate.y - 1;
      break;
    case DIRECTION_WEST:
      newCoordinate.x = lastCoordinate.x - 1;
      newCoordinate.y = lastCoordinate.y;
      break;
  }
  this.coordinates.unshift(newCoordinate);
  this.coordinates.pop();
}

module.exports = Snake;
