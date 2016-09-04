var Directions = require('./directions.js');

var Snake = function() {
  this.direction = Directions.NORTH;
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
  var newCoordinate = this.newCoordinateForDirection(this.direction);
  newCoordinate.color = 'grey'
  this.coordinates.unshift(newCoordinate);
  this.coordinates.pop();
}

Snake.prototype.newCoordinateForDirection = function(direction) {
  var lastCoordinate = this.coordinates[0];
  var newCoordinate = {};
  switch (direction) {
    case Directions.NORTH:
      newCoordinate.x = lastCoordinate.x;
      newCoordinate.y = lastCoordinate.y + 1;
      break;
    case Directions.EAST:
      newCoordinate.x = lastCoordinate.x + 1;
      newCoordinate.y = lastCoordinate.y;
      break;
    case Directions.SOUTH:
      newCoordinate.x = lastCoordinate.x;
      newCoordinate.y = lastCoordinate.y - 1;
      break;
    case Directions.WEST:
      newCoordinate.x = lastCoordinate.x - 1;
      newCoordinate.y = lastCoordinate.y;
      break;
  }
  return newCoordinate;
}

module.exports = Snake;
